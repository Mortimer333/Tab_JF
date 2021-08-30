class TabJF {
  editor;
  lastX     = 0;
  isActive  = false;
  clipboard = [];
  docEventsSet = false;
  copiedHere = false;

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

  constructor( editor, set = {}, debugMode = false ) {
    if ( typeof editor?.nodeType == 'undefined') throw new Error('You can\'t create Editor JF without passing node to set as editor.');
    if ( editor.nodeType != 1                  ) throw new Error('Editor node has to be of proper node type. (1)'                    );
    this.editor   = editor;
    this.editor.setAttribute('tabindex', '-1');
    set.left      = ( set.left    ||  0   );
    set.top       = ( set.top     ||  0   );
    set.letter    = ( set.letter  ||  8.8 ); //9.6333 );
    set.line      = ( set.line    ||  20  );
    this.settings = set;

    this._save.debounce = this._hidden.debounce( this._save.publish, 500 );

    // Proxy for VC
    const methodsSave = [
      ['remove', 'selected'],
      ['remove', 'one'     ],
      ['remove', 'word'    ],
      ['action', 'paste'   ],
      ['newLine'           ],
      ['mergeLine'         ],
      ['insert'            ],
    ];
    methodsSave.forEach(path => {
      this.set.preciseMethodsProxy(this, path);
    });

    // Setting debug modes which keeps track of all called methods, arguments, scope and results
    if (debugMode) {
      let methods    = Object.getOwnPropertyNames( TabJF.prototype );
      let properties = Object.getOwnPropertyNames( this );

      let consIndex = methods.indexOf('constructor');
      if ( consIndex > -1 ) methods.splice(consIndex, 1);

      let hiddenMethods = methods.concat(properties);
      this.set.methodsProxy(this, hiddenMethods);
    }

    this.assignEvents();
    this.caret.el = this.caret.create( this.editor );
    this.caret.hide();
    this.font.createLab();
  }

  /**
   * Object for keeping loose methods hidden
   * before debug proxy
   */
  _hidden = {
    debounce : (func, timeout = 300) => {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        if ( args[0] === "clear" ) {
          return; // if passed `clear` then stop debouncing
        }

        timer = setTimeout(() => { func.apply(this, args); }, timeout);
      };
    }
  }

  /**
   * Proxy handle object for debuging info
   * Saves whole stack of methods, their arguments and results
   */
  _proxyHandle = {
    main : this, // Saving `this` in current scope so can access the instance
    get : function (target, name, receiver) {
      // nothing for now
    },
    apply : function (target, scope, args) {
      const stack = this.main.stack;

      // Here we save the status of stack.open
      // which indicates if the current function is master caller.
      // Just after saving it we change its value to false so other
      // methods will have oldMaster set to `false` which will disallow them
      // finishing stack and moving it to trace
      let oldMaster = stack.open;
      stack.open = false;

      let results;
      if (target.bind) results = target.bind(this.main)(...args);
      else results = target(...args);

      stack.building.push({ name : target.name, args, res : results });

      // If oldMaster is set to true it means to master caller finished
      // its cycle and we can move stack to trace and do clearing operations
      if ( oldMaster ) {
        if (stack.trace.length == 100) stack.trace.shift();
        stack.trace.push(stack.building);
        stack.building = [];
        stack.open = true;
      }

      return results;
    }
  }

  /**
   * Proxy handle for VC
   */
  _proxySaveHandle = {
    main : this, // Saving `this` in current scope so can access the instance
    apply : function (target, scope, args) {
      const save = this.main._save;
      save.debounce();

      const oldInProggress = save.inProgress;
      save.inProgress = true;

      const step = save.tmp.length;
      save.methodsStack.push(target.name); // Here we build methods stack so we can check what method called what
      const startLine = this.main.pos.line;

      save.set.add(target.name, args);

      const results = target.bind(this.main)(...args);

      save.set.remove(target.name, args, step, startLine);

      // only move to pending if master function have finshed
      if (!oldInProggress) {
        save.methodsStack = [];
        save.inProgress = false;
        save.moveToPending();
      }

      return results;
    }
  }

  /**
   * Save object which is hidden from debug
   * and holds all related functionality to VC
   */
  _save = {
    _name : 'save',
    debounce : undefined,   // Here we store debounce function
    version : 0,            // Version counter
    tmpDefault : {
      fun_name : false,
      remove : {
        sLine : -1,
        len   : -1,
      },
      after : {},
      add : {},
      focus : {
        letter  : -1,
        line    : -1,
        childIndex : -1,
      },
      focusAfter : {
        letter  : -1,
        line    : -1,
        childIndex : -1,
      },
    },
    tmp : [],            // Here we store steps which we are working on, later merged with pending as means to not overwrite them
    pending : [],        // Here we store set of steps called version which gets updated until debounce stops and move them to versions
    versions : [],       // Here we store versions
    methodsStack : [],   // Save current methods stuck
    inProgress : false,  // Tells us if maste function has ended and we can do cleanup operations

    /**
     * Merges tmp with pending and resets it
     */
    moveToPending : () => {
      this._save.pending = this._save.pending.concat(this._save.tmp);
      this._save.resetTmp();
    },

    set : {
      /**
       * Gets current caret focus position
       * @return {object} Focus object { line, childIndex, letter }
       */
      focus : () => {
        return {
          letter     : this.pos.letter,
          line       : this.pos.line,
          childIndex : this.get.childIndex(this.pos.el)
        };
      },

      /**
       * One of two main methods for saving steps.
       * This one add or related lines before they are changed.
       * @param {string} name Name of the function (mainly used for exception)
       * @param {array } args Array of arguments which will be passed to the function
       */
      add : ( name, args ) => {
        // Modifiers tells us if we need to get one more line and from which direction
        let modifiers = 0;
        if (name == "mergeLine") modifiers = args[0];

        // Create new tmp object from default
        const tmp = JSON.parse(JSON.stringify(this._save.tmpDefault));

        // Get selection and check if something is selected
        const sel = this.get.selection();
        if (sel.type.toLowerCase() == 'range') {
          // If so figure out which line is first and save selected lines
          let start = sel.anchorNode;
          let end = this.selection.reverse ? sel.focusNode : this.pos.el;

          const startLinePos = this.get.linePos( this.get.line(start) );
          const endLinePos   = this.get.linePos( this.get.line(end  ) );

          for (let i = startLinePos; i <= endLinePos; i++) {
            tmp.add[i] = this.get.lineByPos(i).cloneNode(true);
          }
        }

        // Save function name, just for clarification when debugging
        tmp.fun_name = name;

        // Save where caret is focused
        tmp.focus = this._save.set.focus();

        const linePos = this.pos.line;
        const line    = this.get.lineByPos(linePos);

        // Get and save current line if we haven't already saved her
        if ( !tmp.add[linePos] ) tmp.add[linePos] = line.cloneNode(true);

        // Save line from modificators if we haven't already saved her
        if ( modifiers != 0 && !tmp.add[linePos + modifiers] ) {
          let nexLine = this.get.lineInDirection(line, modifiers);
          if (nexLine) tmp.add[linePos + modifiers] = nexLine.cloneNode(true);
        }

        // Push created step to tmp
        this._save.tmp.push(tmp);
      },

      /**
       * Second main method for saving steps.
       * Here we save which line are to be deleted.
       * @param  {string } name      Name of function that was called
       * @param  {array  } args      Argument passed to that function
       * @param  {integer} step      Index of used step (there might be few at once in tmp)
       * @param  {integer} startLine The line where caret started before function was called
       */
      remove : ( name, args, step, startLine ) => {
        const save = this._save;
        const pos  = this.pos.line;
        // Remove not needed steps
        if (
          name == "one"       && save.methodsStack[ save.methodsStack.length - 1 ] == "mergeLine" || // If the newest is mergeLine
          name == "mergeLine" && save.methodsStack[ save.methodsStack.length - 2 ] == "selected"     // If previous is selected
        ) {
          save.tmp.splice(step, 1);
          return;
        }

        // Paste if pretty special as it uses a lot of existing functionality like newLine
        // which makes this solution get wierd out. So we have one whole exception for this method
        if ( name == "paste" ) {
          let tmp = save.tmp[step]
          tmp.remove = {
            sLine : startLine,
            len : pos - startLine + 1
          };
          tmp.focusAfter = this._save.set.focus();
          for (let i = tmp.remove.sLine; i < tmp.remove.sLine + tmp.remove.len; i++) {
            tmp.after[i] = this.get.lineByPos(i).cloneNode(true);
          }
          save.tmp = [tmp];
          return;
        }

        // Get step from current tmp
        let tmp = save.tmp[step];

        // If step is not present in tmp it might have been pushed to
        // pending due to some clearing, try to get it from there
        if (!tmp) {
          tmp = save.pending[ step ];
        }

        // Set name
        tmp.fun_name = name;

        // Check if anything will be added
        // if not just skip this as this never happens
        const lines = Object.keys(tmp.add);
        if (lines.length == 0) return;

        // @TODO: Take closer look at this \/ and improve

        // Get min and max of saved lines
        // as similar numbers will be deleted
        let minOrMax = pos;
        let max = Math.max(...lines);
        let min = Math.max(...lines);

        // Here we decide if out current position is the lowest or highest
        if (minOrMax < min) {
          min = minOrMax;
          max = pos;
        } else if (minOrMax > max) {
          max = minOrMax;
          min = pos;
        } else {
          max = minOrMax;
          min = minOrMax;
        }

        // Set start of lines to be removed and the length
        tmp.remove.sLine = min;
        tmp.remove.len   = max - min + 1;

        // Move lines to be deleted by one if be have created new line
        if ( name == "newLine") {
          tmp.remove.sLine--;
          tmp.remove.len++;
        }

        // Add new/changed line so we can recall them later on undo
        for (let i = tmp.remove.sLine; i < tmp.remove.sLine + tmp.remove.len; i++) {
          tmp.after[i] = this.get.lineByPos(i).cloneNode(true);
        }

        // Save where caret is focused
        tmp.focusAfter = save.set.focus();
      }
    },

    /**
     * Moves panding version to versions. Removes old versions that got replaced by newer one.
     *
     * Versions are saved in reverse order. The newest is 0 and the oldest is the biggest.
     * This makes it easier to understand as current version is at start of the array and dipper are the older ones.
     */
    publish : () => {
      const save = this._save;
      // If we are publishing new version
      // and current counter is pointing to older version
      // remove previous one and set counter as the newest
      if ( save.version > 0 ) {
        save.versions.splice(0, save.version);
        save.version = 0;
      }

      // Don't add new version if pending is empty
      if ( save.pending.length == 0 ) return;

      save.squash(); // squash all "duplicated" steps
      // Move pending version to the start of array
      save.versions.unshift( save.pending.reverse() );
      // Clear pending
      save.pending = [];
    },

    /**
     * Better name for this one would be removeRepeatingSteps but that's not really what I like.
     * This method basically checks if all steps are necessary and deletes those which brings nothing to the table.
     * It does it by method checkStepsCompatibility which checks if two steps are basically the same, just content of lines
     * is different. If so remove *newer* step as the older step is the closer is to the original line.
     */
    squash : () => {
      const pending = this._save.pending;
      // Start from step 2 as first one is always closes to the original line
      for (let i = 1; i < pending.length; i++) {
        const step     = pending[i];      // Step Two
        const previous = pending[i - 1];  // Step One
        if ( this._save.checkStepsCompatibility(step, previous) ) {
          previous.after      = step.after;
          previous.focusAfter = step.focusAfter;
          pending.splice(i, 1);
          i--;
        }
      }
    },

    /**
     * Check if two steps where created by the same fuction, have the same lines to remove and to add
     * @param  {object } stepOne Step to compare
     * @param  {object } stepTwo Step to compare
     * @return {boolean}         If the steps are identical except the lines content
     */
    checkStepsCompatibility : (stepOne, stepTwo) => {
      return stepOne.fun_name == stepTwo.fun_name && Object.values(stepOne.remove).toString() == Object.values(stepTwo.remove).toString() && Object.keys(stepOne.add).toString() == Object.keys(stepTwo.add).toString();
    },

    /**
     * Reset tmp object
     */
    resetTmp : () => {
      this._save.tmp = [];
    },

    /**
     * Restore previous version and increase version counter.
     */
    restore : () => {
      const save = this._save;
      // If debounce didn't end and last version wasn't published,
      // publish it and stop debouncing
      if ( save.pending.length > 0 ) {
        save.publish();
        save.debounce('clear');
      }

      // If we can't go back any further
      if (save.versions.length == save.version) return;

      // Get previous version
      let version = save.versions[save.version];
      // Reverse steps and go through each of them and restore editor content
      // starting from removing new lines and replacing them with older one
      version.forEach(step => {
        save.content.remove(step.remove);
        save.content.add   (step.add   );
      });

      // Set caret focus on saved state
      save.refocus(version[ version.length - 1 ].focus);

      save.version++;
    },

    /**
     * Refocuses the caret using focus object
     * @param  {object} focus Focus object { line, childIndex, letter }
     */
    refocus : (focus) => {
      let line = this.get.lineByPos(focus?.line);

      if ( line ) {
        this.set.pos( line.childNodes[ focus.childIndex ], focus.letter, focus.line );
      } else {
        console.error("Line not found! Please refocus caret.");
      }
    },

    /**
     * The oposite of restore, merges new version to editor (ctrl + Y)
     */
    recall : () => {
      const save = this._save;
      if (save.version <= 0) {
        return;
      }

      save.version--;
      const version = save.versions[save.version];
      version.reverse().forEach(step => {
        const keys = Object.keys(step.add)
        const min = Math.min(...keys);

        save.content.remove({
          sLine : min,
          len : Math.max(...keys) - min + 1
        });

        save.content.add(step.after);
      });
      version.reverse();
      save.refocus(version[0].focusAfter);

    },
    content : {

      /**
       * Remove lines using step instructions
       * @param {object} step Step
       */
      remove : (remove) => {
        for (let i = remove.sLine; i < remove.len + remove.sLine; i++) {
          // We always remove the line with position of sLine because after deletion
          // the order of line will be moved up by one, which means when removing 4th line 5th will become 4th etc.
          let line = this.get.lineByPos(remove.sLine);
          if ( line ) line.remove();
        }
      },

      /**
       * Adds line using step instructions
       * @param {object} step Step
       */
      add : (add) => {
        const positions = Object.keys(add);
        // Get first line to add
        let line = this.get.lineByPos(positions[0]);
        if (!line) {
          // If not found it means that editor doesn't have lines before this one
          // so we set it to null, which insertBefore will interprate as `insert at the end`
          line = null
        }

        positions.forEach(linePos => {
          this.editor.insertBefore(add[linePos].cloneNode(true), line);
        });
      },
    }
  }

  font = {
    lab : null,
    createLab : () => {
      this.font.lab = document.createElement("span");
      this.editor.insertBefore(this.font.lab, this.editor.childNodes[0]);
    },
    calculateWidth : (letters) => {
      this.font.lab.innerText = letters.replace('\n','');
      const width = this.font.lab.offsetWidth;
      this.font.lab.innerHTML = '';
      return width;
    },
    getLetterByWidth : (x, el) => {
      x -= el.offsetLeft;
      const text = el.innerText;
      const lineWidth = this.font.calculateWidth( text );
      let procent = x/lineWidth;
      return Math.round(text.length * procent);
    },
    recursiveGuessWidth : (x, text, offset, last = null) => {
      const width = this.font.calculateWidth( text.slice(0, offset) );
      if ( width < x ) {
        return this.font.recursiveGuessWidth(x, text, offset + (offset * .25), width)
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
      const sel = this.selection;
      sel.anchor   = null;
      sel.offset   = -1;
      sel.line     = -1;
      sel.reverse  = false;
      sel.active   = false;
      sel.expanded = false;
      this.pressed.shift = false; // forcing the state, might not be the same as in real world
    }
  }

  remove = {
    _name : 'remove',
    docEvents : () => {
      if (!this.docEventsSet) return;
      this.docEventsSet = false;
    },
    selected : () => {
      const rev = this.selection.reverse;
      let startAnchor = rev ? this.pos.el     : this.selection.anchor;
      let startOffset = rev ? this.pos.letter : this.selection.offset;
      let startLine   = rev ? this.pos.line   : this.selection.line;

      let endAnchor   = rev ? this.selection.anchor : this.pos.el;
      let endOffset   = rev ? this.selection.offset : this.pos.letter;
      let endLine     = rev ? this.selection.line   : this.pos.line;

      if (startAnchor == null  ||  endAnchor == null) return;
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
        const prev = el.previousSibling;
        const next = el.nextSibling;
        if ( dir < 0 && prev ) {
          this.remove.word(dir, prev, prev.innerText.length);
        } else if ( dir > 0 && next ) {
          this.remove.word(dir, next, 0);
        }

        if ( dir < 0 ) newPos = 0;
        if ( dir > 0 ) newPos = text.length;

      } else if ( dir < 0 ) newPos = text.length - newPos;

      if (dir < 0) {
        pre = text.substr(0, newPos);
        suf = text.substr( c_pos );
      } else {
        pre = text.substr(0, c_pos);
        suf = text.substr( newPos );
      }
      el.innerHTML = pre + suf;

      if ( dir < 0 ) this.set.pos(el, newPos, this.pos.line);
    },
    one : ( dir ) => {
      const pos    = this.pos,
            next   = pos.el.nextSibling,
            prev   = pos.el.previousSibling;

      let pre, suf, text = pos.el.innerText;

      if ( text.length == 0 ) {
        this.remove.oneInSibling( pos.el, dir );
        return;
      }

      if ( text.length == 1 ) {
        let res = this.remove.posElWithOnlyOneChar( dir );
        if ( res ) return;
      }

      if ( dir > 0 ) {
        if ( pos.letter >= text.length ) {
          this.remove.oneInSibling( next, dir );
          return;
        }

        pre = text.substr( 0, pos.letter  );
        suf = text.substr( pos.letter + 1 );
      } else {
        if ( pos.letter - 1 < 0 ) {
          this.remove.oneInSibling( prev, dir );
          return;
        }

        pre = text.substr( 0, pos.letter - 1 );
        suf = text.substr( pos.letter        );

        this.caret.setByChar( pos.letter - 1, pos.line );
      }
      pos.el.innerHTML = pre + suf;
    },
    oneInSibling : ( node, dir ) => {
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
    posElWithOnlyOneChar : ( dir ) => {
      if ( this.pos.letter == 0 && dir > 0   ||   this.pos.letter == 1 && dir < 0 ) {
        const el = this.pos.el;
        let sibling = this.get.sibling( el, dir );
        if ( sibling === null ) {
          dir *= -1;
          sibling = this.get.sibling( el, dir );

          if ( sibling === null ) {
            const span = document.createElement("span");
            const text = document.createTextNode('');
            span.appendChild(text);
            this.pos.el.parentElement.insertBefore( span, el );
            sibling = span;
          }

        }

        el.remove();
        this.set.side( sibling, dir * -1 );
        return true;
      }
      return false;
    }
  }

  set = {
    _name : 'set',
    docEvents : () => {
      if (this.docEventsSet) return;
      document.addEventListener('paste'  , this.catchClipboard.bind ? this.catchClipboard.bind(this) : this.catchClipboard, true);
      document.addEventListener('keydown', this.key.bind            ? this.key           .bind(this) : this.key           , true);
      this.docEventsSet = true;
    },
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
      let letter = this.pos.letter;
      this.pos.el = node;
           if ( dirX > 0 ) letter = node.innerText.length;
      else if ( dirX < 0 ) letter = 0;
      this.caret.setByChar( letter, newLine );
    },
    pos : ( node, letter, line ) => {
      this.pos.el     = node;
      this.pos.letter = letter;
      this.pos.line   = line;
      this.caret.setByChar( letter, line );
    }
  }

  get = {
    _name : 'get',
    myself : () => {
      return this;
    },
    selectedLines : (sLine = null, eLine = null) => {
      if (!sLine || !eLine) {
        const sel = this.get.selection(), revCheck = this.selection.reverse && !this.selection.expanded;
        sLine = this.get.line( revCheck ? sel.focusNode : sel.anchorNode );
        eLine = this.get.line( revCheck ? sel.anchorNode : sel.focusNode );
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
      const sel = this.get.selection(), revCheck = this.selection.reverse && !this.selection.expanded;;
      if ( sel.type == "Caret") return this.get.line( sel.anchorNode );
      let startNode   = revCheck ? sel.focusNode    : sel.anchorNode;
      let startOffset = revCheck ? sel.focusOffset  : sel.anchorOffset;
      let endNode     = revCheck ? sel.anchorNode   : sel.focusNode;
      let endOffset   = revCheck ? sel.anchorOffset : sel.focusOffset;

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
        if ( el.parentElement.children[i] == el ) return i;
      }
      return false;
    },
    linePos : ( line ) => {
      let linePos = 0;
      for ( let i = 0; i < this.editor.children.length; i++ ) {
        let child = this.editor.children[i];
        if ( line == child ) return linePos;
        // we only increase if there was actual line in editor between our target
        if (child.nodeName && child.nodeName == "P") linePos++;
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
      if (pos >= 0) {
        let linePos = -1;
        for (var i = 0; i < this.editor.children.length; i++) {
          let line = this.editor.children[i];
          if (line.nodeName == "P") linePos++;
          if (linePos == pos) return line;
        }
      } else {
        let linePos = 0;
        for (var i = this.editor.children.length - 1; i > -1 ; i--) {
          let line = this.editor.children[i];
          if (line.nodeName == "P") linePos++;
          if (linePos == pos * -1) return line;
        }
      }
      return false;
    },
    lineInDirection : ( line, dir, first = true ) => {

      if ( first  && line?.nodeName != "P" ) throw new Error("Parent has wrong tag, can't find proper lines");
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
        if ( el.parentElement.childNodes[i] == el ) return i;
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

      if ( caretLeft > this.editor.offsetWidth - 20 ) this.editor.scrollTo( caretLeft + 20 - this.editor.offsetWidth, yPos );
      else this.editor.scrollTo( 0, yPos );
    },
    set : ( x, y ) => {
      this.caret.el.style.left = x + 'px';
      this.caret.el.style.top  = y + 'px' ;
    },
    setByChar : ( letter, line ) => {
      let posX = this.font.calculateWidth( this.pos.el.innerText.slice(0, letter) );
      this.pos.letter = letter;
      this.pos.line   = line  ;

      this.caret.set(
        posX + this.settings.left + this.pos.el.offsetLeft,
        ( line * this.settings.line ) + this.settings.top
      );

      this.caret.scrollTo();
    },
    getPos : () => {
      return {
        top  : this.caret.el.style.top .replace('px',''),
        left : this.caret.el.style.left.replace('px',''),
      }
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
      this.copiedHere = true;
    },
    paste : () => {
      let toDelete = [];
      this.remove.selected();
      const splitedNode = this.getSplitNode();
      this.pos.el.parentElement.insertBefore( splitedNode.pre, this.pos.el );
      this.pos.el.parentElement.insertBefore( splitedNode.suf, this.pos.el );

      this.pos.el.remove();
      this.set.side(splitedNode.pre, 1);
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
      this.action.copy();
      this.remove.selected();
    },
    undo : () => this._save.restore(),
    redo : () => this._save.recall(),
    selectAll : () => {
      const firstLine = this.get.lineByPos(0);
      const lastLine = this.get.lineByPos(-1);

      this.set.side(firstLine.children[0], -1, 0);
      this.start.select();
      let lastLineSpan = lastLine.children[ lastLine.children.length - 1 ];
      let lastLinePos = this.get.linePos(lastLine);
      this.set.side(lastLineSpan, 1, lastLinePos);

      // Here we assume that the line structure is correct which means
      // each line have only span as children and span have only textNodes as children
      let firstNode = firstLine.children[0].childNodes[0];
      if (!firstNode) {
        firstNode = document.createTextNode("");
        firstLine.children[0].appendChild(firstNode);
      }
      let lastNode = lastLineSpan.childNodes[ lastLineSpan.childNodes.length - 1 ];
      const range = new Range();
      range.setStart(firstNode, 0);
      range.setEnd  (lastNode, lastNode.nodeValue.length);

      this.get.selection().removeAllRanges();
      this.get.selection().addRange(range);
    },
  }

  assignEvents() {
    this.editor.addEventListener("mousedown", this.active.bind      ? this.active     .bind(this) : this.active     );
    this.editor.addEventListener("mouseup"  , this.checkSelect.bind ? this.checkSelect.bind(this) : this.checkSelect);
    this.editor.addEventListener("focusout" , this.deactive.bind    ? this.deactive   .bind(this) : this.deactive   );
    this.set.docEvents();
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

  active( e ) {
    if ( e.target == this.editor  ||  e.layerX < 0  ||  e.layerY < 0 ) return;

    let el = e.target;
    if ( el.nodeName === "P") el = el.children[el.children.length - 1];

    let left = e.layerX;
    if ( el.offsetWidth + el.offsetLeft < left ) {
      left = el.offsetWidth + el.offsetLeft;
    }

    let y = this.caret.pos.toY( el.parentElement.offsetTop + this.settings.top );
    let line = Math.ceil ( ( y -  this.settings.top ) / this.settings.line   );
    this.pos.el = el;

    this.caret.setByChar(
      this.font.getLetterByWidth(left, el),
      line
    );

    this.lastX      = this.get.realPos().x;
    this.caret.show();
    this.end.select();
    this.editor.focus();
  }

  deactive( e ) {
    this.remove.docEvents();
    this.copiedHere = false;
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
      65 : ( e, type ) => { // a
        if (this.pressed.ctrl) {
          e.preventDefault();
          this.action.selectAll();
        } else {
          this.insert( e.key );
        }
      },
      67 : ( e, type ) => { // c
        if (this.pressed.ctrl) {
          this.action.copy();
        } else {
          this.insert( e.key );
        }
      },
      86 : ( e, type ) => { // v
        if (!this.pressed.ctrl) {
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
    const sel = this.get.selection();
    if ( this.selection.active && !selDelSkip[e.key.toLowerCase()] && !this.pressed.ctrl &&  sel.type == "Range") {
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
        const sel = this.get.selection();
        if (sel.type.toLowerCase() != "range") this.remove.one (-1);
        else                                   this.remove.selected();
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
      } else this.remove.selected();
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
        const prev = el.previousSibling, next = el.nextSibling;
        if ( dir < 0 && prev ) {
          this.keys.moveCtrl( dir, prev, prev.innerText.length );
          return;
        } else if ( dir > 0 && next ) {
          this.keys.moveCtrl( dir, next, 0 );
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
    move : ( dirX, dirY, recuresionCheck = false ) => {

      if ( this.selection.active && !this.pressed.shift ) {
        if ( this.selection.reverse && !this.selection.expanded && dirX < 0 ) dirX = 0;
        else if ( dirX > 0 ) dirX = 0;
      }

      if ( this.pressed.ctrl ) this.keys.moveCtrl( dirX );
      else if ( dirX != 0 ) this.keys.moveX( dirY, dirX );

      if ( dirY != 0 ) this.keys.moveY( dirY, dirX );

      if (this.pos.el.innerText.length == 0 && !recuresionCheck) {
        let temp = this.pos.el;
        this.keys.move(dirX, 0, true);
        temp.remove();
      }

      if ( this.pressed.shift ) this.expand.select();
      else                      this.end   .select();

    },
    moveX : ( dirY, dirX ) => {
      let el = this.pos.el, prev = el.previousSibling;
      if ( this.pos.letter + dirX <= -1 ) {
        if ( prev && prev.nodeType == 1 ) {
          this.pos.el = prev;
          this.pos.letter = el.innerText.length;
        } else {
          let previousLine = this.get.lineInDirection( el.parentElement, -1 );
          if ( !previousLine ) return;
          this.pos.el = previousLine.children[ previousLine.children.length - 1 ];
          this.caret.setByChar( this.pos.el.innerText.length, this.pos.line - 1 );
          this.lastX = this.get.realPos().x;
          return;
        }

      } else if ( this.pos.letter + dirX > el.innerText.length && el.nextSibling && el.nextSibling.nodeType == 1 ) {
        this.pos.el     = el.nextSibling;
        this.pos.letter = 0;
      } else if ( this.pos.letter + dirX > el.innerText.length ) {
        let nextLine = this.get.lineInDirection( el.parentElement, 1 );
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
      const line = this.pos.line;

      if ( line + dirY <= -1 ) return;

      if ( line + dirY >= this.editor.children.length - 1 ) return;

      let realLetters = this.get.realPos().x;

      let newLine = this.get.lineInDirection( this.pos.el.parentElement, dirY );

      if ( !newLine ) return;

      if ( newLine.innerText.length < realLetters + dirX ) {
        this.pos.el = newLine.children[newLine.children.length - 1];
        this.caret.setByChar( this.pos.el.innerText.length, line + dirY );
        return;
      }

      let currentLetterCount = 0;

      for ( let i = 0; i < newLine.children.length; i++ ) {
        let child = newLine.children[i];
        currentLetterCount += child.innerText.length;
        if ( currentLetterCount >= this.lastX ) {
          this.pos.el = child;
          this.caret.setByChar( this.lastX - (currentLetterCount - child.innerText.length), line + dirY );
          return;
        }
      }

      this.pos.el = newLine.children[ newLine.children.length - 1];
      this.caret.setByChar( this.pos.el.innerText.length, line + dirY );
    }
  }

  newLine() {
    let el = this.pos.el, text = this.getSplitRow();

    if ( text.pre.innerText.length > 0 ) {
      el.parentElement.insertBefore( text.pre, el );
      el.remove();
      el = text.pre;
    } else {
      el.innerHTML = '';
      el.appendChild( document.createTextNode('') );
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

    let line = this.get.line( el );
    this.editor.insertBefore( newLine, line.nextSibling );
    this.pos.el = appended[0];
    this.caret.setByChar( 0, this.pos.line + 1 );
  }

  mergeLine( dir ) {
    let line = this.get.line( this.pos.el );
    if ( line.nodeName != "P") throw new Error("Parent has wrong tag, can't merge lines");
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

  catchClipboard(e) {
    // If user used internal method action.copy to copy conctent of this editor
    // don't transform the clipboard
    if (this.copiedHere) {
      this.action.paste();
      return;
    }

    let paste = (event.clipboardData || window.clipboardData).getData('text');
    if ( !paste.includes('\n') ) {
      const span = document.createElement('span');
      span.appendChild( document.createTextNode(paste) );
      this.clipboard = [ span ];
    }
    this.clipboard = [];
    let lines = paste.split('\n');
    let span = document.createElement('span');
    span.appendChild( document.createTextNode( lines[0] ) );
    this.clipboard.push(span);
    for (let i = 1; i < lines.length - 1; i++) {
      if (i == 1) {
        this.clipboard.push('_jump');
      }

      let newSpan = document.createElement("span");
      newSpan.appendChild( document.createTextNode(lines[i]) );
      this.clipboard.push(newSpan);
      this.clipboard.push('_jump');
    }
    if (lines.length == 2) {
      this.clipboard.push('_jump');
    }

    span = document.createElement('span');
    span.appendChild( document.createTextNode( lines[ lines.length - 1 ] ) );
    this.clipboard.push(span);

    this.action.paste();
  }
}
