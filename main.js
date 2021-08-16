class TabJF {
  noParentTags = ["INPUT","TEXTAREA","BR","HR","IMG","AREA","BASE","EMBED","IFRAME","LINK","META","PARAM","SOURCE","TRACK"];
  editor;
  lastX     = 0;
  isActive  = false;
  clipboard = [];

  stack = {
    open : true,
    building  : [], // currently building trace
    trace     : [], // array of seperate builds (each time a function was called this contain debug info about it, with arguments)
  };

  pressed = {
    shift : false,
    ctrl  : false,
    alt   : false,
  }

  pos = {
    letter : null,
    line   : null,
    el     : null,
  }

  selection = {
    anchor  : null ,
    offset  : -1   ,
    line    : -1   ,
    reverse : false,
    active  : false,
    expanded : false,
  }

  // [DEPRICATED]
  methodsToSave = {
    insert  : true,
    newLine : true,
    remove : {
      one      : true,
      selected : true,
      word     : true,
    },
    action : {
      paste : true,
      cut   : true,
    },
  };

  constructor( editor, set = {} ) {
    if ( typeof editor.nodeType == 'undefined'         ) throw new Error('You can\'t construct Styles without passing node to lock on.');
    if ( editor.nodeType != 1                          ) throw new Error('Editor node has to be of proper node type.'                  );
    if ( this.noParentTags.includes( editor.nodeName ) ) throw new Error('Editor node has to be proper parent tag.'                    );
    this.editor   = editor;
    set.left      = ( set.left    ||  0   );
    set.top       = ( set.top     ||  0   );
    set.letter    = ( set.letter  ||  8.8 ); //9.6333 );
    set.line      = ( set.line    ||  20  );
    this.settings = set;

    this._save.debounce = this._hidden.debounce( this._save.publish, 500 );
    this._save.resetTmp();
    // Proxy for save
    const methodsSave = [
      ['remove', 'selected'],
      ['remove', 'one'     ],
      ['remove', 'word'    ],
      ['action', 'paste'   ],
      ['action', 'cut'     ],
      ['newLine'           ],
      ['mergeLine'         ],
      ['insert'            ],
    ];
    methodsSave.forEach(path => {
      this.set.preciseMethodsProxy(this, path);
    });

    // Proxy for all methods
    let methods    = Object.getOwnPropertyNames( TabJF.prototype );
    let properties = Object.getOwnPropertyNames( this );

    let consIndex = methods.indexOf('constructor');
    if ( consIndex > -1 ) methods.splice(consIndex, 1);

    let hiddenMethods = methods.concat(properties);
    this.set.methodsProxy(this, hiddenMethods);

    this.assignEvents();
    this.caret.el = this.caret.create( this.editor );
    this.caret.hide();
  }

  _hidden = {
    debounce : (func, timeout = 300) => {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        this._save.masterMethod = false;
        if ( args[0] === "clear" ) {
          this._save.masterMethod = true;
          return; // if only clear then stop the debouncing
        }

        timer = setTimeout(() => { func.apply(this, args); this._save.masterMethod = true; }, timeout);
      };
    }
  }

  _proxyHandle = {
    main : this,
    get : function (target, name, receiver) {
      // nothing for now
    },
    apply : function (target, scope, args) {
      const name = scope?._name;

      // changing scope
      let methodsToSave = this.main.methodsToSave[name] ? this.main.methodsToSave[name] : this.main.methodsToSave;
      let oldMaster = this.main.stack.open;
      this.main.stack.open = false;

      let results;
      if (target.bind) {
        results = target.bind(this.main)(...args);
      } else {
        results = target(...args);
      }
      this.main.stack.building.push({ name : target.name, args : args, res : results });

      if ( oldMaster ) {
        if (this.main.stack.trace.length == 100) this.main.stack.trace.shift();
        this.main.stack.trace.push(this.main.stack.building);
        this.main.stack.building = [];
        this.main.stack.open = true;
      }

      return results;
    }
  }

  _proxySaveHandle = {
    main : this,
    apply : function (target, scope, args) {
      const exceptions = ['mergeLine', 'newLine'];

      if (this.main._save.masterMethod && exceptions.includes(target.name)) {
        this.main._save.debounce('clear');
        this.main._save.publish();
        this.main._save.exceptions[target.name]();
      } else if (this.main._save.masterMethod) {
        this.main._save.updateVersion();
      } else if (this.main._save.tmp.eLine < this.main.pos.line && this.main._save.tmp.content.length > 0) {
        this.main._save.updateVersionWithNewLine();
      }

      this.main._save.debounce();

      const results = target.bind(this.main)(...args);

      return results;
    }
  }

  _save = {
    _name : 'save',
    debounce : undefined,
    masterMethod : true,
    version : 0,
    add : {
      line : () => {
        const sCheck = this._save.tmp.sLine == -1 || this._save.tmp.sLine > this.pos.line;
        const eCheck = this._save.tmp.eLine == -1 || this._save.tmp.eLine < this.pos.line;
        if ( sCheck ) this._save.tmp.sLine = this.pos.line;
        if ( eCheck ) this._save.tmp.eLine = this.pos.line;
        if ( sCheck || eCheck ) {
          const line = this.get.line( this.pos.el );
          if ( line ) this._save.tmp.content.push( line.cloneNode(true) );
        }
      },
      lines : ( sel ) => {
        let sNode = sel.anchorNode;
        let eNode = sel.focusNode;
        console.log("first", sNode, eNode);
        if ( this.selection.reverse && !this.selection.expanded ) {
          console.log("reverse");
          sNode = sel.focusNode;
          eNode = sel.anchorNode;
        }

        let sLine = this.get.line(sNode);
        let eLine = this.get.line(eNode);

        // if the selection apeared to be in the same line we just save current line
        if (sLine == eLine) {
          this._save.add.line();
          return;
        }

        // clear debounce and publish
        this._save.debounce('clear');
        if ( this._save.tmp.content.length > 0 ) this._save.publish();

        const sLinePos = this.get.linePos(sLine);
        const eLinePos = this.get.linePos(eLine);

        // here we save line to insert (not replace)
        this._save.tmp.add = {};
        this._save.tmp.add.sLine = sLinePos;

        console.log(sNode, eNode, sLine, eLine);

        this._save.tmp.add.content = this.get.selectedLines(sLine, eLine);
        // here we save to line that left after select, which will have to be deleted
        this._save.tmp.remove = {};
        this._save.tmp.remove.sLine = sLinePos;
        this._save.tmp.remove.eLine = sLinePos;
        this._save.publish();
      }
    },
    tmp : {},
    tmpDefault : {
      pending : false,
      sLine   : -1, // start line number
      eLine   : -1, // end line number
      content : [], // saved line nodes to be later pushed into control version
      /* {
        eLine: 1​,​
        sLine: 1
      } */
      remove  : false, // this tells if we have to remove some lines, if false then no
      /* {
        content : [p, p],
        sLine : 1
      } */
      add     : false, // this tells if we have to add some lines, if false then no
      focus : {
        letter  : -1,
        line    : -1,
        childIndex : -1,
      },
    },
    versions : [],
    exceptions : {
      newLine : () => {
        // this will add current line
        this._save.updateVersion();

        // this will remove new line
        this._save.tmp.remove = {
          sLine : this._save.tmp.sLine + 1,
          eLine : this._save.tmp.sLine + 1,
        };

        this._save.publish();
      },
      mergeLine : () => {
        // Merge line happens when remove.one tries to remove smth at the start of line
        // so we have to remove last version as it is not needed
        this._save.versions.shift();
        this._save.updateVersion();
        let line = this.get.lineByPos(this.pos.line - 1);
        this._save.tmp.add = {
          content : [ line.cloneNode(true) ],
          sLine : this.pos.line - 1,
        };

        this._save.publish();
      },
    },
    updateVersion : () => {
      const sel      = this.get.selection();
      const selTypes = ['caret', 'none'];
      this._save.tmp.focus.letter = this.pos.letter;
      this._save.tmp.focus.line   = this.pos.line  ;
      let childIndex = this.get.childIndex(this.pos.el);
      this._save.tmp.focus.childIndex = childIndex;
      if ( selTypes.includes(sel.type.toLowerCase()) ) this._save.add.line();
      else                                             this._save.add.lines(sel);
      this._save.tmp.pending = true;
    },
    updateVersionWithNewLine : () => {
      this._save.add.line();
    },
    publish : () => {
      if ( this._save.version > 0 ) {
        this._save.versions.splice(0, this._save.version );
        this._save.version = 0;
      }
      // we wanna save new version at the start of the $versions so the newest one is 0 and older are bigger
      // it will make chronological sens as bigger numbers are older versions, not realy logical
      // but humans aren't made for logical thinking anyway
      if ( this._save.tmp.content.length == 0 && !this._save.tmp.remove && !this._save.tmp.add ) return;
      this.version = 0;
      this._save.versions.unshift({ ...this._save.tmp });
      this._save.resetTmp();
    },
    resetTmp : () => {
      this._save.tmpDefault.content = [];
      this._save.tmpDefault.focus = {};
      this._save.tmp = { ...this._save.tmpDefault };
    },
    restore : () => {
      if ( this._save.tmp.pending == true ) {
        this._save.publish();
        this._save.debounce('clear');
      }

      if (this._save.versions.length == this._save.version) {
        return;
      }

      let version = this._save.versions[this._save.version];
      this._save.content.removeAndAdd( version );
      this._save.content.replace( version );
      let line = this.get.lineByPos(version.focus.line);

      if (line) {
        this.set.pos( line.childNodes[ version.focus.childIndex ], version.focus.letter, version.focus.line );
      } else {
        console.error("Line not found! Please refocus caret.");
      }

      this._save.version++;
    },
    content : {
      removeAndAdd : (version) => {
        if ( version.remove === false && version.add === false ) return;
        let linePos = -1, toFind = 0, found, isFirstLine;
        if (version.add !== false) {
          toFind = version.add.sLine - 1;
          if (toFind < 0) {
            isFirstLine = true;
            if ( version.remove.sLine == 0 ) {
              toFind = version.remove.eLine + 1;
            } else {
              toFind = 0;
            }
          }
        }
        for (let i = 0; i < this.editor.children.length; i++) {
          let child = this.editor.children[i];
          if (child.nodeName == "P") linePos++;
          if ( linePos == toFind ) found = child;
          if ( linePos >= version.remove.sLine && linePos <= version.remove.eLine ) {
            child.remove();
            i--;
          }
          if ( linePos >= version.remove.eLine && linePos >= toFind ) break;
        }

        if (version.add === false) return;
        let anchor = found.nextSibling;
        if ( isFirstLine ) anchor = found;

        for (var i = 0; i < version.add.content.length; i++) {
          let line = version.add.content[i];
          this.editor.insertBefore(line.cloneNode(true), anchor);
        }

      },
      replace : (version) => {
        if ( version.content.length == 0 ) return;

        let linePos = -1;
        let anchor;

        for (let i = 0; i < this.editor.children.length; i++) {
          let child = this.editor.children[i];
          if (child.nodeName == "P") linePos++;
          if ( linePos == version.eLine ) {
            anchor = child.nextSibling;
            child.remove();
            break;
          }

          if ( linePos >= version.sLine && linePos <= version.eLine ) {
            child.remove();
            i--;
          }
        }

        for (var i = 0; i < version.content.length; i++) {
          let line = version.content[i];
          this.editor.insertBefore(line.cloneNode(true), anchor);
        }
      }
    }
  }

  start = {
    _name : 'start',
    select : () => {
      this.selection.anchor = this.pos.el;
      this.selection.offset = this.pos.letter;
      this.selection.line   = this.pos.line;
      this.selection.active = true;
    },
  }

  expand = {
    _name : 'expand',
    select : (stop = false) => {
      this.selection.expanded = true;
      const range = new Range();

      // I have to do it like this because otherwise selection doesn't appear
      // but this create false data, as when we get selection even if it is reversed
      // the anchor node and focus node are correctly set
      if (this.selection.reverse) {
        range.setStart(this.pos.el          .childNodes[0], this.pos.letter      );
        range.setEnd  (this.selection.anchor.childNodes[0], this.selection.offset);
      } else {
        range.setStart(this.selection.anchor.childNodes[0], this.selection.offset);
        range.setEnd  (this.pos.el          .childNodes[0], this.pos.letter      );
      }

      this.get.selection().removeAllRanges();
      this.get.selection().addRange(range);

      if ( stop ) return;
      if ( this.get.selection().isCollapsed && !this.selection.reverse ) {
        this.selection.reverse = true;
        this.expand.select(true);
      } else if ( this.get.selection().isCollapsed && this.selection.reverse ) {
        this.selection.reverse = false;
        this.expand.select(true);
      }
    }
  }

  end = {
    _name : 'end',
    select : () => {
      this.get.selection().empty();
      this.selection.anchor  = null;
      this.selection.offset  = -1;
      this.selection.line    = -1;
      this.selection.reverse = false;
      this.selection.active  = false;
      this.selection.expanded = false;
      this.pressed.shift     = false; // forcing the state, might not be the same as in real world
    }
  }

  remove = {
    _name : 'remove',
    selected : () => {
      let startAnchor = this.selection.anchor;
      let startOffset = this.selection.offset;
      let startLine   = this.selection.line;

      let endAnchor   = this.pos.el;
      let endOffset   = this.pos.letter;
      let endLine     = this.pos.line;

      if (startAnchor == null  ||  endAnchor == null) return;

      if (this.selection.reverse) {
        startAnchor = this.pos.el;
        startOffset = this.pos.letter;
        startLine   = this.pos.line;

        endAnchor   = this.selection.anchor;
        endOffset   = this.selection.offset;
        endLine     = this.selection.line;
      }

      if (endAnchor == startAnchor) {
        let child = endAnchor.childNodes[0];
        child.nodeValue = child.nodeValue.slice(0, startOffset) + child.nodeValue.slice(endOffset);
        this.set.pos(endAnchor, startOffset, endLine)
        this.end.select();
        return;
      }

      // remove from end
      endAnchor.childNodes[0].nodeValue   = endAnchor.childNodes  [0].nodeValue.slice( endOffset );
      // remove from start
      startAnchor.childNodes[0].nodeValue = startAnchor.childNodes[0].nodeValue.slice( 0, startOffset );

      this.remove.selectedRecursive(endAnchor, startAnchor);

      this.end.select();
      // set cursor position
      this.set.pos(startAnchor, startOffset, startLine)
      if (startLine != endLine) this.mergeLine(1);
    },
    selectedRecursive : ( previous, stopNode, removeLine = false, isPrevious = false ) => {
      // previous is anchor node, and we want to work on its previous sibling
      let node = previous.previousSibling;

      if ( isPrevious       ) node = previous;
      if ( node == stopNode ) return;

      if ( node == null ) {
        let line         = this.get.line( previous );
        let previousLine = this.get.lineInDirection( line, -1 );
        this.remove.selectedRecursive(previousLine.children[ previousLine.children.length - 1], stopNode, true, true);
        if ( removeLine ) line.remove();
        return;
      }
      this.remove.selectedRecursive( node, stopNode, removeLine );
      node.remove();
    },
    word : ( dir, el = this.pos.el, c_pos = this.pos.letter ) => {
      if ( el.innerText.length == 0   ||   ( dir < 0 && c_pos == 0 )   ||   ( dir > 0 && c_pos == el.innerText.length ) ) {
        this.mergeLine(dir);
        return;
      }

      let pre, suf, newPos, text = el.innerText;

           if ( dir < 0 ) newPos = text.split("").reverse().indexOf('\u00A0', text.length - c_pos);
      else if ( dir > 0 ) newPos = text.indexOf('\u00A0', c_pos);

      if ( text.length - newPos === c_pos && dir < 0   ||   newPos === c_pos && dir > 0) {
        this.remove.one(dir);
        return;
      } else if ( newPos === -1 ) {
        if ( dir < 0 && el.previousSibling ) {
          this.remove.word(dir, el.previousSibling, el.previousSibling.innerText.length);
        } else if ( dir > 0 && el.nextSibling ) {
          this.remove.word(dir, el.nextSibling, 0);
        }

        if ( dir < 0 ) newPos = 0;
        if ( dir > 0 ) newPos = text.length;

      } else {

        if ( dir < 0 ) newPos = text.length - newPos;

      }

      if (dir < 0) {
        pre = text.substr(0, newPos);
        suf = text.substr( c_pos );
      } else {
        pre = text.substr(0, c_pos);
        suf = text.substr( newPos );
      }
      el.innerHTML = pre + suf;

      if ( dir < 0 ) {
        this.set.pos(el, newPos, this.pos.line);
      }

    },
    one : ( dir ) => {
      if ( this.pos.el.innerText.length == 0 ) {
        this.remove.oneInSibling( this.pos.el, dir );
        return ;
      }
      let pre, suf, text = this.pos.el.innerText;

      if ( this.pos.el.innerText.length == 1 ) {
        let res = this.remove.posElWithOnlyOneChar( dir );
        if ( res ) return;
      }

      if ( dir > 0 ) {
        if ( this.pos.letter >= text.length ) {
          this.remove.oneInSibling( this.pos.el.nextSibling, dir );
          return;
        }

        pre = text.substr( 0, this.pos.letter  );
        suf = text.substr( this.pos.letter + 1 );
      } else {
        if ( this.pos.letter - 1 < 0 ) {
          this.remove.oneInSibling( this.pos.el.previousSibling, dir );
          return;
        }

        pre = text.substr( 0, this.pos.letter - 1 );
        suf = text.substr( this.pos.letter        );

        this.caret.setByChar( this.pos.letter - 1, this.pos.line );
      }
      this.pos.el.innerHTML = pre + suf;
    },
    oneInSibling : ( node, dir ) => {
      /**
       * Check if :
       * - sibling exist
       * - sibling is node and not text
       * - sibling isn't empty
       * - sibling would be empty after letter was removed
       */
      if ( node == null ) {
        this.mergeLine( dir ); // If node is null merge next line
        return;
      }

      if ( node.innerText.length == 1 ) {
        let res = this.remove.posElWithOnlyOneChar( dir );
        if ( res ) return;
      }

      if ( node.nodeType != 1   ||   node.innerText.length == 0 ) {
        let sibling = this.get.sibling(node, dir);
        this.remove.oneInSibling(sibling, dir);
        return;
      }

      this.keys  .move( dir, 0   );
      this.remove.one ( dir * -1 );
    },
    // pretty specific xd
    posElWithOnlyOneChar : ( dir ) => {
      if ( this.pos.letter == 0 && dir > 0   ||   this.pos.letter == 1 && dir < 0 ) {
        let sibling = this.get.sibling( this.pos.el, dir );

        if ( sibling === null ) {
          sibling = this.get.sibling( this.pos.el, dir * -1 );

          if ( sibling === null ) {
            let span = document.createElement("span");
            this.pos.el.parentElement.insertBefore( span, this.pos.el );
            sibling = span;
          }

        }

        this.pos.el.remove();
        this.set.side( sibling, dir * -1 );
        return true;
      }
      return false;
    }
  }

  set = {
    _name : 'set',
    preciseMethodsProxy : ( scope, path ) => {
      if (path.length == 1) {
        scope[path[0]] = new Proxy(scope[path[0]], this._proxySaveHandle );
      } else {
        this.set.preciseMethodsProxy(scope[path[0]], path.slice(1));
      }
    },
    methodsProxy : ( object, keys ) => {
      for (var i = 0; i < keys.length; i++) {
        let propertyName = keys[i];
        const type = typeof object[propertyName];
        if ( type == 'function') {
          if ( object[propertyName] == this.set.methodsProxy )  continue;
          object[propertyName] = new Proxy( object[propertyName], this._proxyHandle );
        } else if ( type == 'object' && object[propertyName] !== null && propertyName[0] != '_' ) {
          this.set.methodsProxy( object[propertyName], Object.keys( object[propertyName] ) );
        }
      };
    },
    side : ( node, dirX, newLine = this.pos.line ) => {
      this.pos.el = node;
           if ( dirX > 0 ) this.pos.letter = node.innerText.length;
      else if ( dirX < 0 ) this.pos.letter = 0;
      this.caret.setByChar( this.pos.letter, newLine );
    },
    pos : ( node, letter, line ) => {
      this.pos.el     = node;
      this.pos.letter = letter;
      this.pos.line   = line;
      this.caret.setByChar( this.pos.letter, this.pos.line );
    }
  }

  get = {
    _name : 'get',
    myself : () => {
      return this;
    },
    selectedLines : (sLine = null, eLine = null) => {
      if (!sLine || !eLine) {
        const sel = this.get.selection();
        let sNode = sel.anchorNode;
        let eNode = sel.focusNode;

        if ( this.selection.reverse && !this.selection.expanded ) {
          sNode = sel.focusNode;
          eNode = sel.anchorNode;
        }

        sLine = this.get.line(sNode);
        eLine = this.get.line(eNode);
      }

      if (!sLine || !eLine) throw new Error('Couldn\'t find lines');

      return [sLine.cloneNode(true), ...this.get.selectedLinesRecursive(sLine.nextSibling, eLine)];
    },
    selectedLinesRecursive : (node, end) => {
      if (node === null) throw new Error('The node doesn\'t exist in this parent');
      if (node == end) return [node.cloneNode(true)];
      if (node.nodeName !== "P") return this.get.selectedLinesRecursive(node.nextSibling, end);
      return [node.cloneNode(true), ...this.get.selectedLinesRecursive(node.nextSibling, end)];
    },
    selectedNodes : () => {
      let sel = this.get.selection();
      if ( sel.type == "Caret") return this.get.line( sel.anchorNode );
      let startNode   = sel.anchorNode;
      let startOffset = sel.anchorOffset;
      let endNode     = sel.focusNode;
      let endOffset   = sel.focusOffset;

      if ( this.selection.reverse && !this.selection.expanded ) {
        startNode   = sel.focusNode;
        startOffset = sel.focusOffset;
        endNode     = sel.anchorNode;
        endOffset   = sel.anchorOffset;
      }

      if ( startNode == endNode ) {
        let newNode = startNode.parentElement.cloneNode( true );
        newNode.innerHTML = newNode.innerHTML.substr( startOffset, endOffset - startOffset );
        return [newNode];
      }

      // we are getting parents as selection always selects textNodes
      let nodes = this.get.selectedNodesRecursive( startNode.parentElement, endNode.parentElement, !startNode.parentElement.previousSibling );
      let first = nodes.splice( 0, 1 )[0].cloneNode(true);
      let last = nodes.splice( -1    )[0].cloneNode(true);

      first.innerHTML = first.innerText.substr( startOffset  );
      last.innerHTML  = last .innerText.substr( 0, endOffset );

      let clonedNodes = [first]
      this.clipboard  = [first];
      nodes.forEach( node => {
        clonedNodes.push( node.nodeName ? node.cloneNode(true) : node );
      });

      clonedNodes.push( last );
      return clonedNodes;
    },
    selectedNodesRecursive : ( el, end, fromFirst = false, tmp = [], checked = [] ) => {
      if ( el == end ) {
        tmp.push( el );
        return checked.concat( tmp );
      }

      if ( !el.nextSibling ) {
        let line = this.get.line( el );
        tmp      = tmp.concat([ el, '_jump' ]); // jump action means to jump to the start of next line
        checked  = checked.concat( tmp );
        let nextLine = this.get.lineInDirection( line, 1 );
        return this.get.selectedNodesRecursive( nextLine.children[0], end, true, [], checked );
      }

      tmp.push( el );

      return this.get.selectedNodesRecursive( el.nextSibling, end, fromFirst, tmp, checked );
    },
    elPos : ( el ) => {
      for ( let i = 0; i < el.parentElement.children.length; i++ ) {
        let child = el.parentElement.children[i];
        if ( child == el ) return i;
      }
      return false;
    },
    linePos : ( line ) => {
      let linePos = 0;
      for ( let i = 0; i < this.editor.children.length; i++ ) {
        let child = this.editor.children[i];
        if ( line == child ) return linePos;
        // we only increase if there was actual line in editor between our target
        if (child.nodeName && child.nodeName == "P") {
          linePos++;
        }
      }
      return false;
    },
    selection : () => {
      return window.getSelection ? window.getSelection() : document.selection;
    },
    realPos : () => {
      return {
        x : Math.ceil(( this.caret.getPos().left - this.settings.left ) / this.settings.letter),
        y : this.pos.line
      }
    },
    line : ( el ) => {
      if ( el.parentElement == this.editor ) return el;
      return this.get.line( el.parentElement );
    },
    lineByPos : ( pos ) => {
      let linePos = -1;
      for (var i = 0; i < this.editor.children.length; i++) {
        let line = this.editor.children[i];
        if (line.nodeName == "P") linePos++;
        if (linePos == pos) return line;
      }
      return false;
    },
    lineInDirection : ( line, dir, first = true ) => {

      if ( first  && line?.nodeName != "P" ) Log.ElementRulesViolationException("Parent has wrong tag, can't find proper lines");
      if ( !first && line?.nodeName == "P" ) return line;

      let newLine;
      if ( line === null ) return line;

           if ( dir < 0 ) newLine = line.previousSibling;
      else if ( dir > 0 ) newLine = line.nextSibling;

      if ( newLine === null ) return newLine;
      if ( newLine.nodeType != 1 ) {
        let newNewLine; // xd
             if ( dir < 0 ) newNewLine = newLine.previousSibling;
        else if ( dir > 0 ) newNewLine = newLine.nextSibling;
        newLine.remove(); // there shouldn't be any text there
        return this.get.lineInDirection( newNewLine, dir, false );
      }

      if ( newLine.nodeName != "P" ) return this.get.lineInDirection( newLine, dir, false );
      if ( dir == -1   ||   dir == 1   ) return newLine;
      return this.get.lineInDirection( newLine, dir < 0 ? dir + 1 : dir - 1, true );
    },
    sibling : ( node, dir ) => {
           if ( dir > 0 ) return node.nextSibling;
      else if ( dir < 0 ) return node.previousSibling;
    },
    childIndex : ( el ) => {
      for (var i = 0; i < el.parentElement.childNodes.length; i++) {
        let child = el.parentElement.childNodes[i];
        if ( child == el ) return i;
      }
      return false;
    }
  }

  caret = {
    _name : 'caret',
    el : null,
    scrollTo : () => {
      let caretLeft = this.get.realPos().x * this.settings.letter + this.settings.left;
      let caretTop  = ( this.pos.line + 1 ) * this.settings.line;
      let yPos = caretTop - this.editor.offsetHeight > 0 ? caretTop - this.editor.offsetHeight : 0;

      if ( caretLeft > this.editor.offsetWidth - ( this.settings.letter * 6 ) ) {
        this.editor.scrollTo( caretLeft + ( this.settings.letter * 6 ) - this.editor.offsetWidth, yPos );
      } else {
        this.editor.scrollTo( 0, yPos );
      }

    },
    set : ( x, y ) => {
      this.caret.el.style.top  = y + 'px' ;
      this.caret.el.style.left = x + 'px';
    },
    setByChar : ( letter, line ) => {
      let posX = this.pos.el.offsetLeft + ( letter * this.settings.letter );
      this.pos.letter = letter;
      this.pos.line   = line  ;

      this.caret.el.style.top  = ( ( line * this.settings.line ) + this.settings.top  ) + 'px' ;
      this.caret.el.style.left = ( this.caret.pos.toX( posX + this.settings.left ) ) + 'px';
      this.caret.scrollTo();
    },
    getPos : () => {
      return {
        top  : this.caret.el.style.top .replace('px',''),
        left : this.caret.el.style.left.replace('px',''),
      }
    },
    move : ( dirX, dirY ) => {
      let pos = this.caret.getPos();
      this.caret.set( pos.left + ( this.settings.letter * dirX ), pos.top + ( this.settings.line * dirY ));
    },
    create : ( parent ) => {
      const caret = document.createElement("div");
      caret.setAttribute('class', 'caret');
      parent.insertBefore( caret, parent.children[0] );
      return caret;
    },
    pos : {
      _name : 'pos',
      toX : ( pos ) => {
        return ( Math.round( ( pos - this.settings.left ) / this.settings.letter ) * this.settings.letter ) + this.settings.left
      },
      toY : ( pos ) => {
        return ( Math.floor( (pos - this.settings.top  ) / this.settings.line   ) * this.settings.line    ) + this.settings.top
      }
    },
    hide : () => {
      if ( this.caret.el ) this.caret.el.style.display = "none";
      this.isActive = false;
    },
    show : () => {
      if ( this.caret.el ) this.caret.el.style.display = "block";
      this.isActive  = true;
    }
  }

  action = {
    _name : 'action',
    copy : () => {
      /*
        As coping to clipboard sucks without https server - https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
        we will do it in 2 parts:
         - copy to cliboard plain text as this is supported
         - keep in our clipboard variable to proper stuff with styles and all
      */
      this.clipboard = this.get.selectedNodes();
      document.execCommand('copy');
    },
    paste : () => {
      let toDelete = [];
      this.remove.selected();

      for (var i = 0; i < this.clipboard.length; i++) {
        let node = this.clipboard[i];

        if (node == '_jump') {
          this.newLine();
          // adding empty span as anchot point for inserting cloned nodes
          let span = document.createElement("span");
          let empty = document.createTextNode('');
          span.appendChild( empty );
          this.pos.el.parentElement.insertBefore( span, this.pos.el );
          this.set.side( span, 1 );
          toDelete.push( span );
          continue;
        }

        let nodeClone = node.cloneNode(true);
        if ( node.nodeName == 'P') {
          this.newLine();
          let line = this.get.line( this.pos.el );
          this.editor.insertBefore( nodeClone, line );
          this.set.side( line.children[0], 1 );
          this.pos.line++;
        } else {
          this.pos.el.parentElement.insertBefore( nodeClone, this.pos.el.nextSibling );
          this.set.side( nodeClone, 1 );
        }
      }

      toDelete.forEach( node => {
        node.remove();
      });
    },
    cut : () => {
      this.clipboard = this.get.selectedNodes();
      document.execCommand('copy');
      this.remove.selected();
    },
    undo : () => {
      this._save.restore();
    },
    redo : () => {
      console.log("redo");
    }
  }

  assignEvents() {
    document.addEventListener('keydown', this.key);
    this.editor.addEventListener("mousedown", this.active     );
    this.editor.addEventListener("keyup"    , this.key        );
    this.editor.addEventListener("mouseup"  , this.checkSelect);
  }

  checkSelect( e ) {
    let selection = this.get.selection();
    if (selection.type == "Range") {
      this.selection.anchor = selection.anchorNode.parentElement;
      this.selection.offset = selection.anchorOffset;
      this.selection.active = true;

      let lineStartPos = this.get.linePos( this.get.line(selection.anchorNode) );
      this.selection.line = lineStartPos;

      let lineEndPos = this.get.linePos( this.get.line( selection.focusNode ) );
      this.set.pos( selection.focusNode.parentElement, selection.focusOffset, lineEndPos );

      if ( lineStartPos > lineEndPos ) {
        this.selection.reverse = true;
        return;
      } else if ( lineStartPos == lineEndPos ) {
        let elStart = this.get.elPos( selection.anchorNode.parentElement );
        let elEnd   = this.get.elPos( selection.focusNode .parentElement );
        if ( elStart > elEnd ) {
          this.selection.reverse = true;
          return;
        } else if ( elStart == elEnd && this.selection.offset > selection.focusOffset ) {
          this.selection.reverse = true;
          return;
        }
      }
      this.selection.reverse = false;
    }
  }

  active ( e ) {
    if ( e.target == this.editor  ||  e.layerX < 0  ||  e.layerY < 0 ) return;
    let el = e.target;
    if ( el.nodeName === "P") el = el.children[el.children.length - 1];
    let left = e.layerX;
    if ( el.offsetWidth + el.offsetLeft < left ) {
      left = el.offsetWidth + el.offsetLeft;
    }
    let x = this.caret.pos.toX( left + this.settings.left );
    let y = this.caret.pos.toY( el.parentElement.offsetTop + this.settings.top );
    this.caret.set( x, y );
    this.pos.letter = Math.round( ( left - el.offsetLeft   ) / this.settings.letter );
    this.pos.line   = Math.ceil ( ( y -  this.settings.top ) / this.settings.line   );
    this.pos.el     = el;
    this.lastX      = this.get.realPos().x;
    this.caret.show();
    this.end.select();
  }

  updateSpecialKeys( e ) {
    if ( !this.selection.anchor && e.shiftKey ) this.start.select( e );
    this.pressed.shift = e.shiftKey;
    this.pressed.ctrl  = e.ctrlKey ;
    this.pressed.alt   = e.altKey  ;
  }


  key ( e, type ) {
    this.updateSpecialKeys( e );

    if ( type == 'up' ) return;

    const prevent = {
      37 : true,
      38 : true,
      39 : true,
      40 : true,
      222 : true
    };

    const skip = {
      /* F1 - F12 */
      112 : true,
      113 : true,
      114 : true,
      115 : true,
      116 : true,
      117 : true,
      118 : true,
      119 : true,
      120 : true,
      121 : true,
      122 : true,
      123 : true,
      /*/ F1 - F12 */
    };

    if ( skip   [ e.keyCode ] ) return;
    if ( prevent[ e.keyCode ] ) e.preventDefault();

    const keys = {
      0 : ( e, type ) => {
        // MediaTrackNext And MediaTrackPrevious and MediaPlayPause ??? I guees the 0 is a fillup for now know codes
      },
      8 : ( e, type ) => {
        this.keys.backspace( e );
      },
      9 : ( e, type ) => {
        this.keys.tab( e );
      },
      13 : ( e, type ) => {
        this.keys.enter( e );
      },
      16 : ( e, type ) => {
        // shift
      },
      17 : ( e, type ) => {
        // control
      },
      18 : ( e, type ) => {
        // alt
      },
      18 : ( e, type ) => {
        // pause ?
      },
      20 : ( e, type ) => {
        // CAPS
      },
      27 : ( e, type ) => {
        this.keys.escape( e );
      },
      32 : ( e, type ) => {
        this.keys.space( e );
      },
      33 : ( e, type ) => {
        this.toSide( 0, 1 ); // Page up
      },
      34 : ( e, type ) => {
        this.toSide( 0, -1 ); // Page down
      },
      35 : ( e, type ) => {
        this.toSide( 1, 0 ); // End
      },
      36 : ( e, type ) => {
        this.toSide( -1, 0 ); // Home
      },
      46 : ( e, type ) => {
        this.keys.delete( e );
      },

      // Move keys
      37 : ( e, type ) => {
        this.keys.move(-1, 0);
      },
      38 : ( e, type ) => {
        this.keys.move(0, -1);
      },
      39 : ( e, type ) => {
        this.keys.move(1, 0);
      },
      40 : ( e, type ) => {
        this.keys.move(0, 1);
      },

      45 : ( e, type ) => {
        // Insert
      },
      67 : ( e, type ) => { // c
        if (this.pressed.ctrl) {
          this.action.copy();
        } else {
          this.insert( e.key );
        }
      },
      86 : ( e, type ) => { // v
        if (this.pressed.ctrl) {
          this.action.paste();
        } else {
          this.insert( e.key );
        }
      },
      88 : ( e, type ) => { // x
        if (this.pressed.ctrl) {
          this.action.cut();
        } else {
          this.insert( e.key );
        }
      },
      89 : ( e, type ) => { // y
        if (this.pressed.ctrl) {
          this.action.redo();
        } else {
          this.insert( e.key );
        }
      },
      90 : ( e, type ) => { // z
        if (this.pressed.ctrl) {
          this.action.undo();
        } else {
          this.insert( e.key );
        }
      },
      91 : ( e, type ) => {
        // windows
      },
      106 : ( e, type ) => {
        // it's * but it should be * so lets insert proper for him
        this.insert('*');
      },
      109 : ( e, type ) => {
        // very buggy, it should just enter - but it sometimes enter new line too?
        this.insert('-');
      },
      111 : ( e, type ) => {
        // em it's / but it opens search?
        e.preventDefault();
      },
      144 : ( e, type ) => {
        // NumLock
      },
      145 : ( e, type ) => {
        // scroll lock
      },
      182 : ( e, type ) => {
        // AudioVolumeDown
      },
      183 : ( e, type ) => {
        // AudioVolumeUp
      },
      default : ( e, type ) => {}
    };

    let selDelSkip = { 'delete' : true, 'backspace' : true, 'escape' : true };

    if ( this.selection.active && !selDelSkip[e.key.toLowerCase()] && !this.pressed.ctrl ) {
      if ( !!this.keys[e.key.toLowerCase()]  ||  e.key.length == 1 ) this.remove.selected();
    }

    if ( !keys[e.keyCode] && e.key.length == 1 ) {
      this.insert( e.key );
      return;
    }

    ( keys[e.keyCode]  ||  keys['default'] )( e, type );
  }

  toSide( dirX, dirY ) {
    if ( dirY != 0 ) {
      if ( dirY < 0 ) {
        let currentLineCount = this.editor.children.length - 2; // minus to to remove caret and change to index
        this.keys.move( 0, currentLineCount - this.pos.line );
      } else {
        this.keys.move( 0, -this.pos.line );
      }
    }
  }

  keys = {
    _name : 'keys',
    enter : ( e ) => {
      this.newLine( e );
    },
    backspace : ( e ) => {
      if ( !this.selection.active ) {
        if ( this.pressed.ctrl ) this.remove.word(-1);
        else                     this.remove.one (-1);
      } else {
        this.remove.selected();
      }
    },
    tab : ( e ) => {
      e.preventDefault();
      for ( let i = 0; i < 2; i++ ) {
        this.insert('&nbsp;');
      }
    },
    escape : ( e ) => {
      this.caret.hide();
      this.end.selected();
    },
    space : ( e ) => {
      this.insert('&nbsp;');
    },
    delete : ( e ) => {
      if ( !this.selection.active ) {
        if ( this.pressed.ctrl ) this.remove.word( 1 );
        else                     this.remove.one ( 1 );
      } else {
        this.remove.selected();
      }
    },
    moveCtrl : ( dir, el = this.pos.el, c_pos = this.pos.letter ) => {
      let newPos, text = el.innerText;

           if ( dir < 0 ) newPos = text.split("").reverse().indexOf('\u00A0', text.length - c_pos );
      else if ( dir > 0 ) newPos = text.indexOf('\u00A0', c_pos );

      if ( text.length - newPos === c_pos && dir < 0 ) {
        c_pos--;
      } else if ( newPos === c_pos && dir > 0 ) {
        c_pos++;
      } else if ( newPos === -1 ) {

        if ( dir < 0 && el.previousSibling ) {
          this.keys.moveCtrl( dir, el.previousSibling, el.previousSibling.innerText.length );
          return;
        } else if ( dir > 0 && el.nextSibling ) {
          this.keys.moveCtrl( dir, el.nextSibling, 0 );
          return;
        }

        this.set.side( el, dir );
        return;
      } else {

             if ( dir < 0 ) c_pos = text.length - newPos;
        else if ( dir > 0 ) c_pos = newPos;

      }

      this.set.pos( el, c_pos, this.pos.line );
      if ( this.pressed.shift ) this.expand.select();
      else                      this.end   .select();
    },
    move : ( dirX, dirY ) => {

      if ( this.selection.active && !this.pressed.shift ) {
             if ( this.selection.reverse && !this.selection.expanded && dirX < 0 ) dirX = 0;
        else if ( dirX > 0 ) dirX = 0;
      }

      if ( this.pressed.ctrl ) {
        this.keys.moveCtrl( dirX );
      } else if ( dirX != 0 ) {
        this.keys.moveX( dirY, dirX );
      }

      if ( dirY != 0 ) this.keys.moveY( dirY, dirX );

      if (this.pos.el.innerText.length == 0) {
        let temp = this.pos.el;
        this.keys.move(dirX, 0);
        temp.remove();
      }

      if ( this.pressed.shift ) this.expand.select();
      else                      this.end   .select();

    },
    moveX : ( dirY, dirX ) => {
      if ( this.pos.letter + dirX <= -1 ) {
        if ( this.pos.el.previousSibling && this.pos.el.previousSibling.nodeType == 1 ) {
          this.pos.el = this.pos.el.previousSibling;
          this.pos.letter = this.pos.el.innerText.length;
        } else {
          let previousLine = this.get.lineInDirection( this.pos.el.parentElement, -1 );
          if ( !previousLine ) return;
          this.pos.el = previousLine.children[ previousLine.children.length - 1 ];
          this.caret.setByChar( this.pos.el.innerText.length, this.pos.line - 1 );
          this.lastX = this.get.realPos().x;
          return;
        }

      } else if ( this.pos.letter + dirX > this.pos.el.innerText.length && this.pos.el.nextSibling && this.pos.el.nextSibling.nodeType == 1 ) {
        this.pos.el     = this.pos.el.nextSibling;
        this.pos.letter = 0;
      } else if ( this.pos.letter + dirX > this.pos.el.innerText.length ) {
        let nextLine = this.get.lineInDirection( this.pos.el.parentElement, 1 );
        if ( !nextLine ) return;
        this.pos.el = nextLine.children[0];
        this.caret.setByChar( 0, this.pos.line + 1 );
        this.lastX  = this.get.realPos().x;
        return;
      }

      this.caret.setByChar( this.pos.letter + dirX, this.pos.line);
      this.lastX  = this.get.realPos().x;
    },
    moveY : ( dirY, dirX ) => {
      if ( this.pos.line + dirY <= -1 ) return;

      if ( this.pos.line + dirY >= this.editor.children.length - 1 ) return;

      let realLetters = this.get.realPos().x;

      let newLine = this.get.lineInDirection( this.pos.el.parentElement, dirY );

      if ( !newLine ) return;

      if ( newLine.innerText.length < realLetters + dirX ) {
        this.pos.el = newLine.children[newLine.children.length - 1];
        this.caret.setByChar( this.pos.el.innerText.length, this.pos.line + dirY );
        return;
      }

      let currentLetterCount = 0;

      for ( let i = 0; i < newLine.children.length; i++ ) {
        let child = newLine.children[i];
        currentLetterCount += child.innerText.length;
        if ( currentLetterCount >= this.lastX ) {
          this.pos.el = child;
          this.caret.setByChar( this.lastX - (currentLetterCount - child.innerText.length), this.pos.line + dirY );
          return;
        }
      }

      this.pos.el = newLine.children[ newLine.children.length - 1];
      this.caret.setByChar( this.pos.el.innerText.length, this.pos.line + dirY );
    }
  }

  newLine() {
    let text = this.getSplitRow();

    if ( text.pre.innerText.length > 0 ) {
      this.pos.el.parentElement.insertBefore( text.pre, this.pos.el );
      this.pos.el.remove();
      this.pos.el = text.pre;
    } else {
      this.pos.el.innerHTML = '';
      this.pos.el.appendChild( document.createTextNode('') );
    }
    let newLine = document.createElement("p");

    let appended = [];

    text.suf.forEach( span => {
      if ( span.innerText.length > 0 ) {
        newLine.appendChild( span );
        appended.push( span );
      }
    });

    if ( appended.length == 0 ) {
      text.suf[0].appendChild( document.createTextNode('') );
      newLine.appendChild( text.suf[0] );
      appended.push( text.suf[0] );
    }

    let line = this.get.line( this.pos.el );
    this.editor.insertBefore( newLine, line.nextSibling );
    this.pos.el = appended[0];
    this.caret.setByChar( 0, this.pos.line + 1 );
  }

  mergeLine( dir ) {
    let line = this.get.line( this.pos.el );
    if ( line.nodeName != "P") Log.ElementRulesViolationException("Parent has wrong tag, can't merge lines");
    if ( dir < 0 ) {
      let previous = this.get.lineInDirection( line, dir );
      if ( !previous ) return; // do nothing

      let oldLast = previous.children[previous.children.length - 1];
      for ( let i = line.children.length - 1; i >= 0 ; i-- ) {
        if ( line.children[0].innerText.length > 0 ) previous.appendChild( line.children[0] );
        else line.children[0].remove();
      }
      line.remove();

      let char = 0;
      if ( dir > 0 ) char = this.pos.el.innerText.length;
      this.set.side( oldLast, 1, this.pos.line - 1 );
    } else if ( dir > 0 ) {
      let next = this.get.lineInDirection( line, dir );
      if ( !next ) return; // do nothing

      for ( let i = next.children.length - 1; i >= 0 ; i-- ) {
        if ( next.children[0].innerText.length > 0 ) line.appendChild( next.children[0] );
        else                                         next.children[0].remove();
      }

      next.remove();
    }
  }

  insert( key ) {
    let text = this.getSplitText();
    text.pre += key;
    this.pos.el.innerHTML = text.pre + text.suf;
    this.caret.setByChar( this.pos.letter + 1, this.pos.line );
  }

  getSplitText() {
    let text = this.pos.el.innerText;

    return {
      pre : text.substr( 0, this.pos.letter ),
      suf : text.substr( this.pos.letter    )
    }
  }

  getSplitNode() {
    let text = this.pos.el.innerText;
    return {
      pre : this.setAttributes( this.pos.el, text.substr( 0, this.pos.letter ) ),
      suf : this.setAttributes( this.pos.el, text.substr( this.pos.letter    ) )
    }
  }

  setAttributes(el, text) {
    let newSpan = document.createElement("span");
    for ( let att, i = 0, atts = el.attributes, n = atts.length; i < n; i++ ){
      att = atts[i];
      newSpan.setAttribute( att.nodeName, att.nodeValue );
    }
    newSpan.innerHTML = text;
    return newSpan;
  }

  getSplitRow() {
    let local = this.getSplitNode();
    let nodes = this.getNextSiblignAndRemove( this.pos.el.nextSibling );
    local.suf = [local.suf, ...nodes];
    return local;
  }

  getNextSiblignAndRemove( el ) {
    if ( el === null ) return [];
    let nodes = [];

    let span = this.setAttributes( el, el.innerText );
    nodes.push( span );
    if ( el.nextSibling ) {
      let nextSpan = this.getNextSiblignAndRemove( el.nextSibling );
      nodes = nodes.concat( nextSpan );
    }

    el.remove();
    return nodes;
  }
}
