import { TabJF_Action } from './module/action.js';
import { TabJF_Caret_Pos } from './module/caret/pos.js';
import { TabJF_Caret } from './module/caret.js';
import { TabJF_Clear } from './module/clear.js';
import { TabJF_End } from './module/end.js';
import { TabJF_Event } from './module/event.js';
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
  editor;                     // Editor node reference
  lastX        = 0;           // Position of letter saved between changing lines
  clipboard    = [];
  copiedHere   = false;       // Variable which helps us pasting if user didn't leave the window (normally on ctrl + c there are always double
                              // new lines between each line because of how browsers copy paragraphs, so to prevent it to happen here we use
                              // this flag to know when to use our clipboard on paste rather then default one)
  activated    = false;
  spaceUChar   = '\u00A0';
  updateMethod;               // Placeholder for update method
  // For quick check if any modify keys are pressed
  pressed = {
    shift : false,
    ctrl  : false,
    alt   : false,
  }
  // Position of caret
  pos = {
    letter : null,
    line   : null,
    el     : null,
  }
  // Holds all related information about selection
  selection = {
    update   : false,
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

  /**
   * Tab_JS constructor
   * @param {node  } editor    Node to be replaced with editor
   * @param {Object} [set={}]  Settings:
   *                           - left        [0    ] - indicator for script about any left padding in editor
   *                           - top         [0    ] - indicator for script about any top padding in editor
   *                           - line        [20   ] - the line-height of lines
   *                           - syntax      [false] - the schemat for higlighting text
   *                           - contentText [false] - if you don't want to pass editor content into html node you can just pass it here as string
   *                           - contentObj  [false] - if you have already prepared saved version of content you can pass it here
   */
  constructor( editor, set = {} ) {
    if ( typeof editor?.nodeType == 'undefined') throw new Error('You can\'t create Editor JF without passing node to set as editor.');
    if ( editor.nodeType != 1                  ) throw new Error('Editor node has to be of proper node type. [1]'                    );
    this.editor   = editor;
    // Setting tabindex fo focus out event will be fired
    this.editor.setAttribute('tabindex', '-1');
    this.editor.classList.add('tabjf_editor');
    // All required fields for editor to work, they are not required to be passed by user
    const required = {
      left   : 0,
      line   : 20,
      syntax : false,
      contentText : false,
      contentObj  : false,
    };
    // Setting them programmatically if user didn't passed them in the set object
    Object.keys(required).forEach( attr => {
      set[attr] = typeof set[attr] == 'undefined' ? required[attr] : set[attr];
    });

    this.settings        = set;
    this.settings.height = this.editor.offsetHeight; // Setting editor static height - updated on resize

    this.inject();

    this._save.debounce        = this._hidden.debounce( this._save.publish, 500 );
    this.update.resizeDebounce = this._hidden.debounce( this.update.resize, 500 );

    // Proxy for VC - which method usage save for possible reversion or redoing
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
    // Assign all used events on editor
    this.assignEvents();
    this.caret.el = this.caret.create( this.editor );
    this.caret.hide();
    this.font.createLab();
    // Start the render of the editor - display all visible lines
    this.render.init( this.settings.contentObj, this.settings.contentText );
    if ( this.settings.syntax ) this.syntax.init();
    this.truck.import( this.render.content, this.render.linesLimit );
    // Add neccessary css rules
    this.addRules();
    // Assign events to the document
    this.set.docEvents();
    // Save update method (this gets removed and added multiple times)
    this.updateMethod = this.update.select.bind ? this.update.select.bind(this) : this.update.select;
  }

  /**
   * Class injection, to prevent file becoming to big to maintain I've came up with idea of seperating them into modules and attaching into
   * main class. And it's not by just creating new instance but actually copping all methods and attributes class have. This is to preserv
   * proper use of `this` across all classes as later they will be merged into one big file for real for quicker loading.
   */
  inject () {
    // Map of class connections
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

  /**
   * Actual inject class method. It copies all contents of class and injects it into this one.
   * @param  {object} classObj       Class to copy
   * @param  {object} [context=this] Where to copy it
   */
  assignInjected(classObj, context = this) {
    const variable      = classObj.var;
    if (!context[variable]) {
      context[variable] = {};
    }

    const classInstance = classObj.instance;
    const getMethods    = Object.getOwnPropertyNames( classInstance.prototype );
    const instance      = new classInstance.prototype.constructor();
    /**
     * Classes has very specific names to not overwrite some other class I would use:
     *  - They have to start with Tab_JF
     *  - Then they have their parent name (if they have one, if parent has its own parent then add it so all of them are included)
     *  - And at the end proper name of class.
     * Example: I would like to create class for render update. I would start with Tab_JS as prefix and add to it Render as parent class
     * and finish with Update so it would give me: TabJF_Render_Update.
     * And here, if class doesn't have _name attribute, (which would overwrite the path where I inject this class) I replace its name and
     * turn it into proper path so TabJF_Render_Update would be this.render.update.
     */
    if (!instance._name) {
      instance._name = classInstance.name
        .replace(this.constructor.name + '_' , '')
        .replaceAll('_', '.')
        .toLowerCase();
    }
    // Retriving methods, attributes etc. and setting them in proper context
    const getProps      = Object.getOwnPropertyNames( instance );
    getMethods.forEach( name => {
      if (name != 'constructor') {
        context[variable][name] = classInstance.prototype[name].bind(this);
      }
    });

    getProps.forEach( name => {
      context[variable][name] = instance[name];
    });
    // And here we check if class has any child classes and recursively assign them
    if (classObj?.modules) {
      classObj.modules.forEach( moduleObj => {
        this.assignInjected(moduleObj, this[variable]);
      });
    }
  }

  /**
   * Adds css classes to page scope defined in ./schema/styles.js.
   * They are set at the top of head so any class later should overwrite them without problem without usage of !important
   */
  addRules () {
    var styleEl = document.createElement('style');
    styleEl.setAttribute('name', "TabJF Styles");
    document.head.insertBefore(styleEl, document.head.children[0]);
    const css = styleEl.sheet;
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
   * Actual methodology responsible for saving current state of document. (saves before and after status)
   */
  _proxySaveHandle = {
    main : this, // Saving `this` in current scope so can access the instance
    apply : function (target, scope, args) {
      const main = this.main;
      const save = main._save;
      const name = target.name.replace('bound ', '');
      // Here we add debounce so we don't save each letter addition as seperate version but merge them into one if all those actions happend
      // in small time frame
      save.debounce();

      const oldInProggress = save.inProgress;
      save.inProgress      = true;
      const step           = save.tmp.length;

      // Here we build methods stack so we can check what method called what and create exceptions of weird combinations
      save.methodsStack.push(name);

      let startLine = main.pos.line;
      const sel     = main.get.selection();
      if ( sel.type.toLowerCase() == 'range' ) {
        startLine = main.selection.start.line;
        if ( main.selection.start.line > main.selection.end.line ) {
          startLine = main.selection.end.line;
        }
      }
      // This saves related nodes so we can reconstruct them later
      save.set.add( name, args );
      // Fire the actual method
      const results = target.bind( main )( ...args );
      // This sets what lines or nodes we have to remove to create old state
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

  /**
   * Assign events to editor.
   * Wierd implementations is a result of my debug tool which adds Proxy to whole class and this kinda make it impossible to bind them as
   * Proxy doesn't support this feature.
   */
  assignEvents() {
    this.editor.addEventListener("mousedown", this.active.bind                ? this.active               .bind(this) : this.active               );
    this.editor.addEventListener("mouseup"  , this.stopSelect.bind            ? this.stopSelect           .bind(this) : this.stopSelect           );
    this.editor.addEventListener("focusout" , this.deactive.bind              ? this.deactive             .bind(this) : this.deactive             );
    this.editor.addEventListener("dblclick" , this.saveSelectionDblClick.bind ? this.saveSelectionDblClick.bind(this) : this.saveSelectionDblClick);
  }

  /**
   * Save the selection after double click
   * @param  {object} e Double Click event
   */
  saveSelectionDblClick( e ) {
    this.update.select();
    this.update.selection.start(
      0,
      this.selection.end.line,
      this.selection.end.node
    );
    this.checkSelect();
  }

  /**
   * Stop selection after user released mouse button
   * @param  {object} e Mouse up event
   */
  stopSelect( e ) {
    this.editor.removeEventListener('mousemove', this.updateMethod, true);
    if (this.get.selection().type == 'Range') {
      // Custom event fire, if you don't want to update selection after it has finished you can prevent it from happening
      const event = this.event.dispatch('tabJFSelectStop', {
        pos       : this.get.clonedPos(),
        event     : e,
        selection : this.get.clone(this.selection),
      });
      if ( event.defaultPrevented ) return;
    }

    this.selection.update = false;
    this.checkSelect();
  }

  /**
   * Main function which keeps all selection in proper form even if the actual node which started the selection was removed to render new lines
   */
  checkSelect() {
    if ( !this.selection.active ) return;
    const start  = this.selection.start;
    const end    = this.selection.end;
    let reversed = false;

    // If selection is not visible them don't do anything
    if ( start.line < this.render.hidden && end.line < this.render.hidden ) return;

    let lineEndPos          = end.line;
    let lineEndChildIndex   = end.node;
    let lineStartChildIndex = start.node;
    let firstLinePos, startLetter, endLetter;

    // This check if start and end are not reversed and if neccessary reverses them
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

    // If the line with selection is not visible and got removed at top set selection to start at the start of first line
    if (firstLinePos < this.render.hidden || (this.selection.update && firstLinePos >= this.render.hidden + this.render.linesLimit)) {
      firstLinePos        = this.render.hidden;
      startLetter         = 0;
      lineStartChildIndex = 0;
      endLetter           = end.letter;
    }
    // Some error checking
    if ( endLetter < 0 ) {
      return;
    }
    // If end line is on removed line then set it to end at the end of last line
    if (lineEndPos >= this.render.hidden + this.render.linesLimit) {
      lineEndPos = this.render.hidden + this.render.linesLimit - 1;
      let endLine = this.get.lineByPos(lineEndPos);
      let endChild = endLine.children[ endLine.children.length - 1 ];
      lineEndChildIndex = endChild.childNodes.length - 1;
      endLetter = endChild.childNodes[ endChild.childNodes.length - 1 ].nodeValue.length;
    }
    // Create the actual Range visible to user
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

  /**
   * Main function which actiaves editor when engaged by user
   * @param  {object} e Click event
   */
  active( e ) {
    // Custom event, if you don't want to editor to activate you can prevent it here
    const event = this.event.dispatch('tabJFActivate', {
      pos       : this.get.clonedPos(),
      event     : e,
    });
    if ( event.defaultPrevented ) return;

    // If target is actual editor (which means user didn't click text but some part of editor) or there is something wrong with position
    // don't start editor
    if ( e.target == this.editor  ||  e.x < 0  ||  e.y < 0 ) return;
    let el = e.target;

    // If user was able to click the actual line set clicked element to last span containing text
    if ( el.nodeName === "P") el = el.children[ el.children.length - 1 ];
    // Translate position to which line was clicked and which letter
    const line   = el.parentElement.offsetTop / this.settings.line;
    const letter = this.font.getLetterByWidth( el.innerText, el, e.layerX - el.offsetLeft );
    // Activate caret and refocus it
    this.caret.show();
    const index  = this.get.childIndex( el );
    this.caret.refocus(
      letter,
      line,
      index,
    );
    // If user clicked to close to the end lines move editor a little in right direction
    if ( line < this.render.hidden + 2 && this.render.hidden > 0 ) {
      this.render.set.overflow( null, ( line - 2 ) * this.settings.line );
    } else if ( line > this.render.hidden + this.render.linesLimit - 5 ) {
      this.render.set.overflow( null, ( line - ( this.render.linesLimit - 5 ) ) * this.settings.line );
    }

    this.lastX            = this.get.realPos().x;
    this.selection.start  = { line : line, letter     , node : index };
    this.selection.end    = { line : -1  , letter : -1, node : -1    };
    this.selection.active = false;
    // Start selection in case this is not only activation but also action
    this.editor.addEventListener(
      'mousemove',
      this.updateMethod,
      true
    );
    this.activated = true;
    this.resetPressed();
  }

  /**
   * Reset all saved keys to their original value
   */
  resetPressed() {
    this.pressed.ctrl  = false;
    this.pressed.shift = false;
    this.pressed.alt   = false;
  }

  /**
   * Deactivate editor
   * @param  {object} e Focus out event
   */
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

  /**
   * Centre of actions which translates user action to editor actions
   * @param  {object} e Keyup or Keydown event
   */
  key( e ) {
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
    if ( type == 'keyup' ) return;      // We don't do anything for keyup expect update modify keys (shift, ctrl etc.)
    // Prevent Default on those keys
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
    // Completly skip those
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
    // Map - key to action
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
        this.insert('/');
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
        if (this.pressed.shift) {
          this.insert('?');
        } else {
          this.insert('/');
        }
      },
      192 : ( e, type ) => {
        if ( this.pressed.shift ) this.insert('~');
        else                      this.insert('`');
      },
      default : ( e, type ) => {
        throw new Error('Unknow special key', e.keyCode);
      }
    };
    // Skip those keys when removing selection
    const selDelSkip = { 'delete' : true, 'backspace' : true, 'escape' : true };
    const sel = this.get.selection();
    // If you want to replace a with A if shift pressed you can do it here
    const replaceKey = {
      192 : ( key ) => {
        return this.pressed.shift ? '~' : '`';
      },
      default : ( key ) => key
    }

    const key = ( replaceKey[ e.keyCode ] || replaceKey['default'] )( e.key );
    // Check if this key should remove selection
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
    // If key is not in Map: key - action then just insert it
    if ( !keys[ e.keyCode ] && key.length == 1 ) {
      this.insert( key );
    } else {
      ( keys[e.keyCode] || keys['default'] )( e, type );
    }
    // If caret is not visible render page so it is
    if ( !this.caret.isVisible() ) {
      this.render.set.overflow(
        null,
        (this.pos.line - (this.render.linesLimit/2)) * this.settings.line
      );
    }
    // You can set here keys which should skip page update
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
    ) {
      // Keys which prevent from automatic scrolling
      const preventScroll = {
        16 : true
      };

      this.update.page()
      this.render.update.scrollWidthWithCurrentLine();
      if (!preventScroll[e.keyCode]) {
        this.caret.scrollToX();
        this.caret.scrollToY();
      }
    }

  }

  /**
   * Move cusros to the side of the line or whole page
   * @param  {int} dirX Decides if to move it to the start of end of line
   * @param  {int} dirY Decides if to move it to the start of end of document
   */
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

    // Check if chosen line has required amount of nodes and letters
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

  /**
   * Adds new line in current place of caret
   */
  newLine() {
    // Save elemt and split line in place of caret
    let el = this.pos.el, text = this.get.splitRow();
    // Slice text into two parts if there is any
    if ( text.pre.innerText.length > 0 ) {
      el.parentElement.insertBefore( text.pre, el );
      el.remove();
      el = text.pre;
    } else {
      el.innerHTML = '';
      el.appendChild( document.createTextNode('') );
    }
    // Update changed line in render content object
    this.render.content[ this.pos.line ].content = this.truck.exportLine( el.parentElement ).content;
    let newLine  = document.createElement("p");
    let appended = [];
    // Append all nodes after the caret position to the new line
    text.suf.forEach( span => {
      if ( span.innerText.length > 0 ) {
        newLine.appendChild( span );
        appended.push( span );
      }
    });
    // If there is zero nodes add one empty
    if ( appended.length == 0 ) {
      text.suf[0].appendChild( document.createTextNode('') );
      newLine.appendChild( text.suf[0] );
      appended.push( text.suf[0] );
    }
    // Insert new line
    this.render.content.splice(
      this.pos.line + 1,
      0,
      this.truck.exportLine( newLine )
    );
    // move page if neccessary and update it
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

  /**
   * Merge two lines togheter
   * @param  {int} dir Direction of merge - 0 is up and 1 is down
   */
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

  /**
   * Insert new letter and move caret by one
   * @param  {string} key Single letter
   */
  insert( key ) {
    // Reconstruct saved content from chars to letters
    let text = this.replace.spaceChars(
      this.render.content[ this.pos.line ].content[ this.pos.childIndex ].content
    );
    text = {
      pre : text.substr( 0, this.pos.letter ),
      suf : text.substr( this.pos.letter    )
    }
    text = this.replace.spaces(text.pre) + key + this.replace.spaces(text.suf);
    this.render.content[ this.pos.line ].content[ this.pos.childIndex ].content = text;
    this.caret.refocus( this.pos.letter + this.replace.spaceChars( key ).length );
    this.lastX = this.get.realPos().x;
  }

  /**
   * Catch ctrl + v event and replace it without our own
   * @param  {object} e Paste event
   */
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
