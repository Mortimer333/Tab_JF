import { TabJF_Action } from './module/action.js';
import { TabJF_Caret_Pos } from './module/caret/pos.js';
import { TabJF_Caret } from './module/caret.js';
import { TabJF_Clear } from './module/clear.js';
import { TabJF_End } from './module/end.js';
import { TabJF_Event } from './module/event.js';
import { TabJF_Expand } from './module/expand.js';
import { TabJF_Font } from './module/font.js';
import { TabJF_Get_Css } from './module/get/css.js';
import { TabJF_Get } from './module/get.js';
import { TabJF_Is_Line } from './module/is/line.js';
import { TabJF_Is } from './module/is.js';
import { TabJF_Keys } from './module/keys.js?v=2';
import { TabJF_Remove } from './module/remove.js';
import { TabJF_Render_Add } from './module/render/add.js';
import { TabJF_Render_Fill } from './module/render/fill.js';
import { TabJF_Render_Move } from './module/render/move.js';
import { TabJF_Render_Remove } from './module/render/remove.js';
import { TabJF_Render_Set } from './module/render/set.js';
import { TabJF_Render_Update } from './module/render/update.js';
import { TabJF_Render } from './module/render.js';
import { TabJF_Replace } from './module/replace.js';
import { TabJF_Set } from './module/set.js';
import { TabJF_Syntax_Create } from './module/syntax/create.js';
import { TabJF_Syntax } from './module/syntax.js';
import { TabJF_Truck } from './module/truck.js';
import { TabJF_Update_Selection } from './module/update/selection.js';
import { TabJF_Update } from './module/update.js';
import { TabJF_Hidden } from './module/_hidden.js';
import { TabJF_Save_Content } from './module/_save/content.js';
import { TabJF_Save_Set } from './module/_save/set.js';
import { TabJF_Save } from './module/_save.js';
import styles from './schema/styles.js';

class TabJF {
  editor;
  lastX        = 0;
  clipboard    = [];
  docEventsSet = false;
  copiedHere   = false;
  activated    = false;
  spaceUChar   = '\u00A0';

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
    update   : false,
    anchor   : null ,
    offset   : -1   ,
    line     : -1   ,
    reverse  : false,
    active   : false,
    expanded : false,
    start : {
      line   : -1,
      letter : -1,
      node   : -1,
    },
    end : {
      line   : -1,
      letter : -1,
      node   : -1,
    },
  }

  constructor( editor, set = {} ) {
    if ( typeof editor?.nodeType == 'undefined') throw new Error('You can\'t create Editor JF without passing node to set as editor.');
    if ( editor.nodeType != 1                  ) throw new Error('Editor node has to be of proper node type. (1)'                    );
    this.editor   = editor;
    this.editor.setAttribute('tabindex', '-1');
    this.editor.classList.add('tabjf_editor');
    const required = {
      left   : 0,
      top    : 0,
      line   : 20,
      height : 400,
      addCss : false,
      syntax : false,
      contentText : false,
      contentObj  : false,
    };

    Object.keys(required).forEach( attr => {
      set[attr] = typeof set[attr] == 'undefined' ? required[attr] : set[attr];
    });

    this.settings = set;

    this.inject();

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

    this.assignEvents();
    this.caret.el = this.caret.create( this.editor );
    this.caret.hide();
    this.font.createLab();
    this.render.init( this.settings.contentObj, this.settings.contentText );
    if ( this.settings.syntax ) this.syntax.init();
    this.truck.import( this.render.content, this.render.linesLimit );

    if ( set.addCss ) {
      this.addRules();
    }

    this.set.docEvents();
  }

  inject () {
    const classes = [
      { instance : TabJF_Hidden , var : '_hidden' },
      { instance : TabJF_Save   , var : '_save', modules : [
        { instance : TabJF_Save_Set    , var : 'set'     },
        { instance : TabJF_Save_Content, var : 'content' },
      ]},
      { instance : TabJF_Action , var : 'action'  },
      { instance : TabJF_Caret  , var : 'caret', modules : [
        { instance : TabJF_Caret_Pos, var : 'pos' },
      ]},
      { instance : TabJF_Clear  , var : 'clear'   },
      { instance : TabJF_End    , var : 'end'     },
      { instance : TabJF_Event  , var : 'event'   },
      { instance : TabJF_Expand , var : 'expand'  },
      { instance : TabJF_Font   , var : 'font'    },
      { instance : TabJF_Get    , var : 'get', modules : [
        { instance : TabJF_Get_Css, var : 'css' },
      ]},
      { instance : TabJF_Is     , var : 'is', modules : [
        { instance : TabJF_Is_Line, var : 'line' },
      ]},
      { instance : TabJF_Keys   , var : 'keys'    },
      { instance : TabJF_Remove , var : 'remove'  },
      { instance : TabJF_Render , var : 'render', modules : [
        { instance : TabJF_Render_Fill  , var : 'fill'   },
        { instance : TabJF_Render_Move  , var : 'move'   },
        { instance : TabJF_Render_Add   , var : 'add'    },
        { instance : TabJF_Render_Remove, var : 'remove' },
        { instance : TabJF_Render_Set   , var : 'set'    },
        { instance : TabJF_Render_Update, var : 'update' },
      ]},
      { instance : TabJF_Replace, var : 'replace' },
      { instance : TabJF_Set    , var : 'set'     },
      { instance : TabJF_Syntax , var : 'syntax', modules : [
        { instance : TabJF_Syntax_Create, var : 'create' },
      ]},
      { instance : TabJF_Truck  , var : 'truck'   },
      { instance : TabJF_Update , var : 'update', modules : [
        { instance : TabJF_Update_Selection, var : 'selection' },
      ]},
    ];

    classes.forEach( classObj => {
      this.assignInjected( classObj );
    });
  }

  assignInjected(classObj, context = this) {
    const variable      = classObj.var;
    if (!context[variable]) {
      context[variable] = {};
    }

    const classInstance = classObj.instance;
    const getMethods    = Object.getOwnPropertyNames( classInstance.prototype );
    const instance      = new classInstance.prototype.constructor();
    if (!instance._name) {
      instance._name = classInstance.name
        .replace(this.constructor.name + '_' , '')
        .replaceAll('_', '.')
        .toLowerCase();
    }

    const getProps      = Object.getOwnPropertyNames( instance );
    getMethods.forEach( name => {
      if (name != 'constructor') {
        context[variable][name] = classInstance.prototype[name].bind(this);
      }
    });

    getProps.forEach( name => {
      context[variable][name] = instance[name];
    });

    if (classObj?.modules) {
      classObj.modules.forEach( moduleObj => {
        this.assignInjected(moduleObj, this[variable]);
      });
    }
  }

  addRules () {
    let css = window.document.styleSheets[0];
    if (!css) {
      var styleEl = document.createElement('style');
      styleEl.setAttribute('name', "TabJF Styles");
      document.head.insertBefore(styleEl, document.head.children[0]);
      css = styleEl.sheet;
    }
    // Using styles schema
    styles.forEach( rule => {
      css.insertRule(
        rule,
        css.cssRules.length
      );
    });
  }

  /**
   * Proxy handle for VC
   */
  _proxySaveHandle = {
    main : this, // Saving `this` in current scope so can access the instance
    apply : function (target, scope, args) {
      const main = this.main;
      const save = main._save;
      const name = target.name.replace('bound ', '');
      save.debounce();

      const oldInProggress = save.inProgress;
      save.inProgress      = true;
      const step           = save.tmp.length;

      // Here we build methods stack so we can check what method called what
      save.methodsStack.push(name);

      let startLine = main.pos.line;
      const sel     = main.get.selection();
      if ( sel.type.toLowerCase() == 'range' ) {
        startLine = main.selection.start.line;
        if ( main.selection.start.line > main.selection.end.line ) {
          startLine = main.selection.end.line;
        }
      }

      save.set.add( name, args );

      const results = target.bind( main )( ...args );

      save.set.remove( name, args, step, startLine );

      // only move to pending if master function have finshed
      if ( !oldInProggress ) {
        save.methodsStack = [];
        save.inProgress   = false;
        save.moveToPending();
      }

      return results;
    }
  }

  assignEvents() {
    this.editor.addEventListener("mousedown", this.active.bind      ? this.active    .bind(this) : this.active    );
    this.editor.addEventListener("mouseup"  , this.stopSelect.bind  ? this.stopSelect.bind(this) : this.stopSelect);
    this.editor.addEventListener("focusout" , this.deactive.bind    ? this.deactive  .bind(this) : this.deactive  );
  }

  stopSelect( e ) {
    if (this.get.selection().type == 'Range') {
      const event = this.event.dispatch('tabJFSelectStop', {
        pos       : this.get.clonedPos(),
        event     : e,
        selection : this.get.clone(this.selection),
      });
      if ( event.defaultPrevented ) return;
    }

    this.selection.update = false;
    this.editor.removeEventListener('mousemove', this.update.select.bind ? this.update.select.bind(this) : this.update.select, true);
    this.checkSelect();
  }

  checkSelect() {
    if ( !this.selection.active ) return;
    const start  = this.selection.start;
    const end    = this.selection.end;
    let reversed = false;

    if ( start.line < this.render.hidden && end.line < this.render.hidden ) return;

    let lineEndPos          = end.line;
    let lineEndChildIndex   = end.node;
    let lineStartChildIndex = start.node;
    let firstLinePos, startLetter, endLetter;

    if (
      lineEndPos < start.line
      || lineEndPos == start.line && lineEndChildIndex < lineStartChildIndex
      || lineEndPos == start.line && lineEndChildIndex == lineStartChildIndex && end.letter < start.letter
    ) {
      reversed     = true;
      startLetter  = end.letter;
      endLetter    = start.letter;
      firstLinePos = lineEndPos;
      lineEndPos   = start.line;
      const tmp    = lineStartChildIndex;
      lineStartChildIndex = lineEndChildIndex;
      lineEndChildIndex   = tmp;
    } else {
      startLetter  = start.letter;
      endLetter    = end.letter;
      firstLinePos = start.line;
    }


    if (firstLinePos < this.render.hidden || (this.selection.update && firstLinePos >= this.render.hidden + this.render.linesLimit)) {
      firstLinePos        = this.render.hidden;
      startLetter         = 0;
      lineStartChildIndex = 0;
      endLetter           = end.letter;
    }

    if ( endLetter < 0 ) {
      return;
    }

    if (lineEndPos >= this.render.hidden + this.render.linesLimit) {
      lineEndPos = this.render.hidden + this.render.linesLimit - 1;
      let endLine = this.get.lineByPos(lineEndPos);
      let endChild = endLine.children[ endLine.children.length - 1 ];
      lineEndChildIndex = endChild.childNodes.length - 1;
      endLetter = endChild.childNodes[ endChild.childNodes.length - 1 ].nodeValue.length;
    }

    let firstText = this.get.lineByPos(firstLinePos)
    let lastText  = this.get.lineByPos(lineEndPos  )
    if (!firstText || !lastText) {
      return;
    }

    firstText = firstText.children[ lineStartChildIndex ].childNodes[0];
    lastText  = lastText .children[ lineEndChildIndex   ].childNodes[0];
    const range = new Range();
    const firstTextLength = firstText.nodeValue.length;
    const lastTextLength = lastText.nodeValue.length;
    if ( firstTextLength < startLetter ) startLetter = firstTextLength;
    if ( lastTextLength  < endLetter   ) endLetter   = lastTextLength;
    range.setStart(firstText, startLetter);
    range.setEnd  (lastText , endLetter  );
    this.get.selection().removeAllRanges();
    this.get.selection().addRange(range);
  }

  active( e ) {
    const event = this.event.dispatch('tabJFActivate', {
      pos       : this.get.clonedPos(),
      event     : e,
    });
    if ( event.defaultPrevented ) return;

    if ( e.target == this.editor  ||  e.x < 0  ||  e.y < 0 ) return;
    let el = e.target;
    if ( el.nodeName === "P") el = el.children[ el.children.length - 1 ];
    let left = e.x - this.settings.left;
    if ( el.offsetWidth + el.offsetLeft < left ) {
      left = el.offsetWidth + el.offsetLeft;
    }

    let y = this.caret.pos.toY( el.parentElement.offsetTop + this.settings.top );
    let line = Math.ceil ( ( y - this.settings.top ) / this.settings.line );
    const letter = this.font.getLetterByWidth( left, el );
    this.caret.show();
    const index  = this.get.childIndex( el );
    this.caret.refocus(
      letter,
      line,
      index,
    );

    if ( line < this.render.hidden + 2 && this.render.hidden > 0 ) {
      this.render.set.overflow( null, ( line - 2 ) * this.settings.line );
    } else if ( line > this.render.hidden + this.render.linesLimit - 5 ) {
      this.render.set.overflow( null, ( line - ( this.render.linesLimit - 5 ) ) * this.settings.line );
    }

    this.lastX            = this.get.realPos().x;
    this.selection.start  = { line : line, letter     , node : index };
    this.selection.end    = { line : -1  , letter : -1, node : -1    };
    this.selection.active = false;
    this.editor.addEventListener(
      'mousemove',
      this.update.select.bind ? this.update.select.bind(this) : this.update.select,
      true
    );
    this.activated = true;
    this.resetPressed();
  }

  resetPressed() {
    this.pressed.ctrl  = false;
    this.pressed.shift = false;
    this.pressed.alt   = false;
  }

  deactive( e ) {
    const event = this.event.dispatch('tabJFDeactivate', {
      pos       : this.get.clonedPos(),
      event     : e,
    });
    if ( event.defaultPrevented ) return;

    this.caret.hide();
    this.copiedHere = false;
    this.activated  = false;
  }

  key ( e ) {
    if (!this.activated) return;

    const type = e.type;

    if ( type == 'keydown' ) {
      const event = this.event.dispatch('tabJFKeyDown', {
        pos   : this.get.clonedPos(),
        event : e,
      });
      if ( event.defaultPrevented ) return;
    } else if ( type == 'keyup' ) {
      const event = this.event.dispatch('tabJFKeyUp', {
        pos   : this.get.clonedPos(),
        event : e,
      });
      if ( event.defaultPrevented ) return;
    }

    this.update.specialKeys( e );
    if ( type == 'keyup' ) {
      return;
    }

    const prevent = {
      33 : true,
      34 : true,
      35 : true,
      36 : true,
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
        // MediaTrackNext And MediaTrackPrevious and MediaPlayPause ??? I guees the 0 is a fillup for unknown codes
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
        const selection = this.get.selection();
        if (selection.type == 'Caret') {
          this.update.selection.start();
        }
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
        e.preventDefault();
        this.keys.space( e );
      },
      33 : ( e, type ) => {
        this.toSide( -1, -1 ); // Page up
      },
      34 : ( e, type ) => {
        this.toSide( 1, 1 ); // Page down
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
        const event = this.event.dispatch('tabJFMove', {
          pos       : this.get.clonedPos(),
          event     : e,
          selection : this.get.clone(this.selection),
          x         : -1,
          y         : 0,
        });
        if ( event.defaultPrevented ) return;
        this.keys.move(-1, 0);
      },
      38 : ( e, type ) => {
        const event = this.event.dispatch('tabJFMove', {
          pos       : this.get.clonedPos(),
          event     : e,
          selection : this.get.clone(this.selection),
          x         : 0,
          y         : -1,
        });
        if ( event.defaultPrevented ) return;
        this.keys.move(0, -1);
      },
      39 : ( e, type ) => {
        const event = this.event.dispatch('tabJFMove', {
          pos       : this.get.clonedPos(),
          event     : e,
          selection : this.get.clone(this.selection),
          x         : 1,
          y         : 0,
        });
        if ( event.defaultPrevented ) return;
        this.keys.move(1, 0);
      },
      40 : ( e, type ) => {
        const event = this.event.dispatch('tabJFMove', {
          pos       : this.get.clonedPos(),
          event     : e,
          selection : this.get.clone(this.selection),
          x         : 0,
          y         : 1,
        });
        if ( event.defaultPrevented ) return;
        this.keys.move(0, 1);
      },

      45 : ( e, type ) => {
        // Insert
      },
      65 : ( e, type ) => { // a
        if ( this.pressed.ctrl ) {
          e.preventDefault();
          this.action.selectAll();
        } else {
          this.insert( e.key );
        }
      },
      67 : ( e, type ) => { // c
        if ( this.pressed.ctrl ) {
          this.action.copy();
        } else {
          this.insert( e.key );
        }
      },
      86 : ( e, type ) => { // v
        if ( !this.pressed.ctrl ) {
          this.insert( e.key );
        }
      },
      88 : ( e, type ) => { // x
        if ( this.pressed.ctrl ) {
          this.action.cut();
        } else {
          this.insert( e.key );
        }
      },
      89 : ( e, type ) => { // y
        if ( this.pressed.ctrl ) {
          this.action.redo();
        } else {
          this.insert( e.key );
        }
      },
      90 : ( e, type ) => { // z
        if ( this.pressed.ctrl ) {
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
      191 : ( e, type ) => {
        e.preventDefault();
        this.insert('/');
      },
      192 : ( e, type ) => {
        if ( this.pressed.shift ) this.insert('~');
        else                      this.insert('`');
      },
      default : ( e, type ) => {
        throw new Error('Unknow special key', e.keyCode);
      }
    };
    const selDelSkip = { 'delete' : true, 'backspace' : true, 'escape' : true };
    const sel = this.get.selection();
    const replaceKey = {
      192 : ( key ) => {
        return this.pressed.shift ? '~' : '`';
      },
      default : ( key ) => key
    }

    const key = ( replaceKey[ e.keyCode ] || replaceKey['default'] )( e.key );

    if (
      this.selection.active
      && !selDelSkip[ key.toLowerCase() ]
      && !this.pressed.ctrl
      && sel.type == "Range"
      && (
        !!this.keys[ key.toLowerCase() ]
        || key.length == 1
      )
    ) {
      this.remove.selected();
    }

    if ( !keys[ e.keyCode ] && key.length == 1 ) {
      this.insert( key );
    } else {
      ( keys[e.keyCode] || keys['default'] )( e, type );
    }

    if ( !this.caret.isVisible() ) {
      this.render.set.overflow(
        null,
        (this.pos.line - (this.render.linesLimit/2)) * this.settings.line
      );
    }

    const skipUpdate = {
      86 : () => {
        if ( !this.pressed.ctrl ) return false;
        return true;
      },
      default : () => false
    };

    if (
      !( skipUpdate[ e.keyCode ]
      || skipUpdate[ 'default' ] )()
    ) this.update.page()

  }

  toSide( dirX, dirY ) {
    let line   = this.pos.line;
    let letter = this.pos.letter;
    let node   = this.pos.childIndex;

    if ( dirY > 0 ) {
      line = this.render.content.length - 1;
    } else if ( dirY < 0 ) {
      line = 0;
    }

    if ( dirX > 0 ) {
      let lineContent = this.render.content[ line ];
      node            = lineContent.content.length - 1;
      let lastSpan    = lineContent.content[ lineContent.content.length - 1 ];
      letter          = this.replace.spaceChars(lastSpan.content).length;
    } else if ( dirX < 0 ) {
      letter = 0;
      node   = 0;
    }

    // Check if chosen line has needed amount of nodes and letters
    const chosenLine = this.render.content[ line ];
    if ( chosenLine.content.length - 1 < node ) {
      node = chosenLine.content.length - 1;
    }

    if ( this.replace.spaceChars(chosenLine.content[ node ].content).length < letter) {
      letter = this.replace.spaceChars(chosenLine.content[ node ].content).length;
    }

    this.caret.refocus(
      letter,
      line,
      node
    );

    this.lastX = this.get.realPos().x;
  }

  newLine() {
    let el = this.pos.el, text = this.get.splitRow();
    if ( text.pre.innerText.length > 0 ) {
      el.parentElement.insertBefore( text.pre, el );
      el.remove();
      el = text.pre;
    } else {
      el.innerHTML = '';
      el.appendChild( document.createTextNode('') );
    }
    this.render.content[ this.pos.line ].content = this.truck.exportLine( el.parentElement ).content;
    let newLine  = document.createElement("p");
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
    this.render.content.splice(
      this.pos.line + 1,
      0,
      this.truck.exportLine( newLine )
    );
    if ( this.pos.line + 1 > this.render.hidden + this.render.linesLimit - 6 ) {
      this.render.set.overflow(
        null,
        ( this.pos.line - ( this.render.linesLimit - 6 ) ) * this.settings.line
      );
      this.render.move.page({ offset : this.pos.line - ( this.render.linesLimit - 6 ) });
    } else {
      this.render.move.page();
    }
    this.caret.refocus( 0, this.pos.line + 1, 0 );
    this.lastX = 0;
  }

  mergeLine( dir ) {
    let line = this.get.line( this.pos.el );
    if ( line.nodeName != "P") throw new Error("Parent has wrong tag, can't merge lines");

    if ( dir < 0 ) { // Backspace
      this.pos.line--;
      this.toSide(1, 0);

      this.render.content[this.pos.line].content =
        this.render.content[this.pos.line].content.concat(
          this.render.content[ this.pos.line + 1 ].content
        );

      this.render.content.splice( this.pos.line + 1, 1 );
      this.lastX = this.get.realPos().x;

    } else if ( dir > 0 ) { // Delete

      this.render.content[this.pos.line].content =
        this.render.content[this.pos.line].content.concat(
          this.render.content[ this.pos.line + 1 ].content
        );

      this.render.content.splice( this.pos.line + 1, 1 );
    }
  }

  insert( key ) {
    let text = this.replace.spaceChars(
      this.render.content[ this.pos.line ].content[ this.pos.childIndex ].content
    );
    text = {
      pre : text.substr( 0, this.pos.letter ),
      suf : text.substr( this.pos.letter    )
    }
    text = this.replace.spaces(text.pre) + key + this.replace.spaces(text.suf);
    // this.pos.el.innerHTML = text;
    this.render.content[ this.pos.line ].content[ this.pos.childIndex ].content = text;
    this.caret.refocus( this.pos.letter + this.replace.spaceChars( key ).length );
    this.lastX = this.get.realPos().x;
  }

  catchClipboard( e ) {
    if (!this.activated) {
      return;
    }

    // If user used internal method action.copy to copy content of this editor
    // don't transform the clipboard
    if ( !this.copiedHere ) {
      let paste = ( event.clipboardData || window.clipboardData ).getData('text');
      this.clipboard = this.truck.exportText( paste );
    }

    this.action.paste();
  }
}
export { TabJF };
