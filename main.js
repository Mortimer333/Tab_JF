class TabJF {
  editor;
  lastX        = 0;
  clipboard    = [];
  docEventsSet = false;
  copiedHere   = false;
  activated    = false;

  // ### Stack commented, uncomment for debugging
  stack = {
    open      : true,
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

  constructor( editor, set = {}, debugMode = false ) {
    if ( typeof editor?.nodeType == 'undefined') throw new Error('You can\'t create Editor JF without passing node to set as editor.');
    if ( editor.nodeType != 1                  ) throw new Error('Editor node has to be of proper node type. (1)'                    );
    this.editor   = editor;
    this.editor.setAttribute('tabindex', '-1');
    this.editor.classList.add('tabjf_editor');
    set.left      = ( set.left    ||  0   );
    set.top       = ( set.top     ||  0   );
    set.line      = ( set.line    ||  20  );
    set.height    = ( set.height  ||  400 );
    set.addCss    = ( set.addCss  ||  true );
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
    this.render.init();

    if (set.addCss) {
      this.addRules();
    }
  }

  addRules () {
    const css = window.document.styleSheets[0];
    const rules = [
      `.tabjf_editor-con {
        max-height: calc( var(--max-height, 200) * 1px);
        overflow: auto;
      }`,
      `.tabjf_editor {
        position    : relative;
        min-height  : calc( (var(--min-height, 0) - var(--paddingTop, 0)) * 1px);
        padding-top : calc( var(--paddingTop, 0) * 1px );
        width       : calc(var(--scroll-width, 100%) * 1px + 5px );
      }`,
      `.tabjf_editor p {
        position     : relative;
        min-height   : 20px    ;
        max-height   : 20px    ;
        height       : 20px    ;
        cursor       : text    ;
        display      : flex    ;
        margin : 0;
        padding:0;
      }`,
      `.tabjf_editor p::after {
        display : block;
        content : '█'  ;
        opacity : 0;
      }`,
      `.tabjf_editor p span {
        display: block;
        white-space: nowrap;
        flex-shrink: 0;
      }`,
      `@keyframes tabjf_blink {
        0%   { opacity: 1; }
        50%  { opacity: 0; }
        100% { opacity: 1; }
      }`,
      `.tabjf_editor .caret {
        width     : 1px ;
        height    : 20px;
        position  : absolute   ;
        background-color : #000;
        animation : tabjf_blink 1s linear infinite;
      }`
    ];
    rules.forEach( rule => {
      css.insertRule(
        rule,
        css.cssRules.length
      );
    });
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
      stack.building.push({ name : target.name, args, res : results });
      if (target.bind) results = target.bind(this.main)(...args);
      else results = target(...args);
      stack.building[ stack.building.length - 1 ].res = results;

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
      const main = this.main;
      const save = main._save;
      save.debounce();

      const oldInProggress = save.inProgress;
      save.inProgress = true;

      const step = save.tmp.length;

      // Here we build methods stack so we can check what method called what
      save.methodsStack.push(target.name);

      let startLine = main.pos.line;
      const sel = main.get.selection();
      if (sel.type.toLowerCase() == 'range') {
        startLine = main.selection.start.line;
        if (main.selection.start.line > main.selection.end.line) {
          startLine = main.selection.end.line;
        }
      }

      save.set.add(target.name, args);

      const results = target.bind(main)(...args);

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

  render = {
    hidden : 0, // how many lines was hidden
    content : null,
    linesLimit : 80,
    maxLineWidth : 0,
    overflow : null,
    focusLost : false, // if we have scrolled past caret
    removeScroll : () => {
      this.render.overflow.removeEventListener('scroll', this.render.fill.event, true);
    },
    init : (importObj = false) => {
      if ( importObj ) this.render.content = importObj;
      else             this.render.content = this.truck.export(); // If we don't have saved state, save current state
      this.render.linesLimit = Math.ceil(this.settings.height / this.settings.line) + 2;
      const overflow = document.createElement("div");
      overflow.addEventListener('scroll', this.render.fill.event, true);
      overflow.className = "tabjf_editor-con";
      overflow   .style.setProperty("--max-height", this.settings.height);
      this.render.update.minHeight();
      this.render.update.scrollWidth();
      this.editor.parentElement.insertBefore(overflow, this.editor);
      overflow.appendChild(this.editor);
      this.render.overflow = overflow;
      this.truck.import(this.render.content, this.render.linesLimit);
    },
    fill : {
      event : ( e = null ) => {
        const selection = this.get.selection();
        let top         = this.render.overflow.scrollTop; // how much was scrolled
        let startLine   = Math.floor(top / this.settings.line); // amount of line hidden - from which index get lines

        // Remove all rendered lines
        for (let i = 0; i < this.render.linesLimit; i++) {
          let line = this.get.lineByPos(this.render.hidden);
          if (!line) {
            break;
          }
          this.render.content[this.render.hidden + i] = this.truck.exportLine(line);
          line.remove();
        }

        this.render.move.page(startLine, false);
        this.checkSelect();
      },
    },
    move : {
      page : (offset = this.render.hidden, clear = true, reverse = false) => {
        this.truck.import(this.render.content, this.render.linesLimit, offset, clear, reverse);
        this.render.hidden = offset;
        this.editor.style.setProperty('--paddingTop', this.render.hidden * this.settings.line);
        this.editor.style.setProperty('--counter-current', this.render.hidden);
        this.caret.refocus();
      },
      overflow : (x, y) => {
        let top  = this.render.overflow.scrollTop;
        let left = this.render.overflow.scrollLeft;
        this.render.overflow.scrollTo(left + x, top + y);
      }
    },
    add : {
      line : (line, pos) => {
        this.render.content.splice( pos, 0, this.truck.exportLine(line) );
        this.render.fill.event();
        this.render.update.minHeight();
      },
    },
    remove : {
      line : (pos) => {
        this.render.content.splice( pos, 1 );
        this.render.fill.event();
        this.render.update.minHeight();
      }
    },
    set : {
      overflow : (x = null, y = null) => {
        if (x === null) {
          x = this.render.overflow.scrollLeft;
        }
        if (y === null) {
          y = this.render.overflow.scrollTop;
        }
        this.render.overflow.scrollTo(x, y);
      }
    },
    update : {
      minHeight : (lines = this.render.content.length) => {
        lines = lines < this.render.linesLimit ? this.render.linesLimit : lines;
        this.editor.style.setProperty("--min-height", this.settings.line * lines);
      },
      scrollWidth : () => {
        this.render.maxLineWidth = 0;
        this.render.content.forEach( line => {
          let text = '';
          line.content.forEach(item => {
            text += item.content;
          });

          const width = this.font.calculateWidth(text);
          if (this.render.maxLineWidth < width) {
            this.render.maxLineWidth = width;
          }
        });
        this.editor.style.setProperty("--scroll-width", this.render.maxLineWidth + this.settings.left);
      }
    }
  }

  truck = {
    export : ( html = null ) => {
      const exportAr = [];
      if (!html) {
        html = this.editor.children;
      }
      Object.values(html).forEach( function(p) {
        let line = this.truck.exportLine(p);
        if (line) {
          exportAr.push(line);
        }
      }, this);
      return exportAr;
    },
    exportLine : ( p ) => {
      if ( p.nodeName !== "P") return false;

      const lineContent = [];
      Object.values(p.children).forEach( span => {
        lineContent.push({
          attrs   : this.getAttributes(span),
          content : this.replace.spaces(span.innerText),
        });
      });
      return {
        content : lineContent,
      };
    },
    exportText : ( text ) => {
      const content = text.split('\n');
      const conAr = [];
      content.forEach( text => {
        conAr.push({
          content : [
            {
              attrs : [],
              content : this.replace.spaces(text)
            }
          ]
        });
      });
      return conAr;
    },
    import : (
      importAr,
      limit = false,
      offset = 0,
      clear = true,
      reverse = false,
      container = null,
      replaceContent = true
    ) => {
      if ( clear && !container ) this.clear.editor();
      if ( !container ) {
        container = this.editor;
      }
      let firstLine;
      for (let i = offset; i < importAr.length; i++) {
        if (limit && i === limit + offset) break; // If we wanna import only part of the saved state

        const line = importAr[i];
        const lineNode = document.createElement("p");
        line.content.forEach( span => {
          span.content = this.replace.spaces(span.content);
          const spanNode = this.setAttributes( span.attrs, span.content );
          if (spanNode.childNodes.length == 0) {
            spanNode.appendChild(document.createTextNode(''));
          }
          lineNode.appendChild(spanNode);
        });
        if (reverse) {
          if (!firstLine) firstLine = this.get.lineByPos(0);
          container.insertBefore(lineNode, firstLine);
        } else {
          container.appendChild(lineNode);
        }
      }
      if (replaceContent) {
        this.render.content = importAr;
      }
    }
  }

  clear = {
    editor : () => {
      Object.values(this.editor.children).forEach( p => {
        if (p.nodeName == "P") p.remove();
      });
    }
  }

  replace = {
    spaces : (string) => {
      return string.replaceAll(' ', '&nbsp;');
    },
    spaceChars : (string) => {
      return string.replaceAll('&nbsp;', ' ');
    },
  }

  update = {
    selection : {
      start : (letter = this.pos.letter, line = this.pos.line, index = this.pos.childIndex) => {
        const start = this.selection.start;
        start.letter = letter;
        start.line   = line;
        start.node   = index;
      },
      end : (letter = this.pos.letter, line = this.pos.line, index = this.pos.childIndex) => {
        const end = this.selection.end;
        end.letter = letter;
        end.line   = line;
        end.node   = index;
      }
    }
  }

  getAttributes(el) {
    const attrsObj = [];
    for ( let att, i = 0, atts = el.attributes, n = atts.length; i < n; i++ ){
      att = atts[i];
      attrsObj.push({
        nodeName  : att.nodeName,
        nodeValue : att.nodeValue,
      });
    }
    return attrsObj;
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
        topLine    : 0,
        letter     : -1,
        line       : -1,
        childIndex : -1,
      },
      focusAfter : {
        topLine    : 0,
        letter     : -1,
        line       : -1,
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
       * @return {object} Focus object { line, childIndex, letter, topLine }
       */
      focus : () => {
        return {
          letter     : this.pos.letter,
          line       : this.pos.line,
          childIndex : this.get.childIndex(this.pos.el),
          topLine    : this.render.hidden,
        };
      },

      /**
       * One of two main methods for saving steps.
       * This one adds related lines before they are changed.
       * @param {string} name Name of the function (mainly used for exception)
       * @param {array } args Array of arguments which will be passed to the function
       */
      add : ( name, args ) => {
        // Modifiers tells us if we need to get one more line and from which direction
        let modifiers = 0;
        if (name == "mergeLine") {
          modifiers = args[0];
        }

        // Create new tmp object from default
        const tmp = this.get.clone(this._save.tmpDefault);

        // Get selection and check if something is selected
        const sel = this.get.selection();
        if (sel.type.toLowerCase() == 'range') {
          // If so figure out which line is first and save selected lines
          const start = this.selection.start;
          const end   = this.selection.end;

          const startLinePos = start.line > end.line ? end.line   : start.line;
          const endLinePos   = start.line > end.line ? start.line : end.line  ;

          for (let i = startLinePos; i <= endLinePos; i++) {
            tmp.add[i] = this.get.clone(this.render.content[i]);
          }
        }

        // Save function name, just for clarification when debugging
        tmp.fun_name = name;

        // Save where caret is focused
        tmp.focus = this._save.set.focus();
        const linePos = this.pos.line;
        const line    = this.get.lineByPos(linePos);

        // Get and save current line if we haven't already saved her
        if ( !tmp.add[linePos] ) tmp.add[linePos] = this.truck.exportLine(line);

        // Save line from modificators if we haven't already saved her
        if ( modifiers != 0 && !tmp.add[linePos + modifiers] ) {
          let nexLine = this.get.lineInDirection(line, modifiers);
          if (nexLine) tmp.add[linePos + modifiers] = this.render.content[linePos + modifiers];
        }

        // Push created step to tmp
        this._save.tmp.push(tmp);
      },

      /**
       * Second main method for saving steps.
       * Here we save which line are to be deleted.
       * @param {string } name      Name of function that was called
       * @param {array  } args      Argument passed to that function
       * @param {integer} step      Index of used step (there might be few at once in tmp)
       * @param {integer} startLine The line where caret started before function was called
       */
      remove : ( name, args, step, startLine ) => {
        const save = this._save;
        const pos  = this.pos.line;
        // Remove not needed steps
        if (
          (name == "one" || name == "word") && save.methodsStack[ save.methodsStack.length - 1 ] == "mergeLine" || // If the newest is mergeLine
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
            tmp.after[i] = this.render.content[i];
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
          tmp.after[i] = this.render.content[i];
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
      // Setting start of render
      save.squash(); // squash all "duplicated" steps
      save.pending[0].focus.topLine = this.render.hidden;
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
     * @param {object} stepOne Step to compare
     * @param {object} stepTwo Step to compare
     * @return {boolean}         If the steps are identical except the lines content
     */
    checkStepsCompatibility : (stepOne, stepTwo) => {
      return stepOne.fun_name == stepTwo.fun_name && stepOne.fun_name != 'mergeLine' &&
        Object.values(stepOne.remove).toString() == Object.values(stepTwo.remove).toString() &&
        Object.keys  (stepOne.add   ).toString() == Object.keys  (stepTwo.add   ).toString();
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
      // this._save.slowVersion(version);

      const focus = version[ version.length - 1 ].focus;

      this.caret.refocus(
        focus.letter,
        focus.line,
        focus.childIndex
      );

      if (!this.is.line.visible(focus.line)) {
        this.render.move.page(focus.line - Math.floor(this.render.linesLimit/2));
      } else {
        this.render.move.page();
      }

      this.render.overflow.scrollTo(this.render.overflow.scrollLeft, this.render.hidden * this.settings.line);
      save.version++;
    },

    slowVersion : (version, i = 0) => {
      setTimeout(function() {
        let step = version[i];
        console.log("Step", i + 1, step.fun_name, "Remove", step.remove);
        const save = this._save;
        save.content.remove(step.remove);
        const focus = step.focus;
        this.render.move.page(focus.topLine);
        setTimeout(function(){
          let step = version[i];
          console.log("Step", i + 1, step.fun_name, "Add", step.add);
          const focus = step.focus;
          const save = this._save;
          save.content.add(step.add);
          this.render.move.page(focus.topLine);
          if (version.length > i + 1) {
            this._save.slowVersion(version, i + 1);
          }
        }.bind(this), 2000);
      }.bind(this), 2000);
    },

    /**
     * Refocuses the caret using focus object
     * @param {object} focus Focus object { line, childIndex, letter }
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
      const focus = version[0].focusAfter;

      if (!this.is.line.visible(focus.line)) {
        this.render.move.page(focus.line - Math.floor(this.render.linesLimit/2));
      } else {
        this.render.move.page();
      }
      this.render.overflow.scrollTo(this.render.overflow.scrollLeft, this.render.hidden * this.settings.line);
      this.caret.refocus(
        focus.letter,
        focus.line,
        focus.childIndex
      );
    },
    content : {

      /**
       * Remove lines using step instructions
       * @param {object} step Step
       */
      remove : (remove) => {
        this.render.content.splice(remove.sLine, remove.len);
      },

      /**
       * Adds line using step instructions
       * @param {object} step Step
       */
      add : (add) => {
        const positions = Object.keys(add);
        positions.forEach(linePos => {
          this.render.content.splice(linePos, 0, add[linePos]);
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
      this.font.lab.innerHTML = letters.replaceAll('\n','');
      const width = this.font.lab.offsetWidth;
      this.font.lab.innerHTML = '';
      return width;
    },
    getLetterByWidth : (x, el) => {
      x -= el.offsetLeft;
      const text = el.innerText;
      const lineWidth = this.font.calculateWidth( text + '' );
      let procent = 0;
      if (lineWidth != 0) {
        procent = x/lineWidth;
      }
      return Math.round(text.length * procent);
    }
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
      const sel    = this.selection;
      sel.anchor   = null;
      sel.offset   = -1;
      sel.line     = -1;
      sel.reverse  = false;
      sel.active   = false;
      sel.expanded = false;
      this.pressed.shift = false; // forcing the state, might not be the same as in real world
      this.update.selection.start();
      sel.end = { line : -1, letter : -1, node : -1 };
    }
  }

  remove = {
    _name : 'remove',
    docEvents : () => {
      if (!this.docEventsSet) return;
      document.removeEventListener('paste'  , this.catchClipboard.bind ? this.catchClipboard.bind(this) : this.catchClipboard, true);
      document.removeEventListener('keydown', this.key.bind            ? this.key           .bind(this) : this.key           , true);
      document.removeEventListener('keyup'  , this.key.bind            ? this.key           .bind(this) : this.key           , true);
      this.docEventsSet = false;
      this.caret.hide();
    },
    selected : () => {
      let start = this.get.clone(this.selection.start);
      let end   = this.get.clone(this.selection.end);

      if (
        start.line > end.line
        || (start.line == end.line && start.node > end.node)
        || (start.line == end.line && start.node == end.node && start.letter > end.letter)
      ) {
        let tmp = start;
        start = end;
        end = tmp;
      }
      const sel = this.get.selection();
      if (sel.type != 'Range') {
        return;
      }

      if (start.line == end.line) {
        if (start.node == end.node) {
          let content = this.replace.spaceChars(this.render.content[start.line].content[start.node].content);
          let pre     = this.replace.spaces(content.substr(0, start.letter));
          let suf     = this.replace.spaces(content.substr(end.letter     ));
          this.render.content[start.line].content[start.node].content = pre + suf;
        } else {
          let startNode = this.render.content[start.line].content[start.node];
          let endNode   = this.render.content[end.line  ].content[end.node  ];
          startNode.content = this.replace.spaces(this.replace.spaceChars(startNode.content).substr(0, start.letter));
          endNode.content   = this.replace.spaces(this.replace.spaceChars(endNode.content  ).substr(end.letter     ));
          if (endNode.content.length == 0) {
            end.node++;
          }
          this.render.content[start.line].content.splice(start.node + 1, end.node - 1);
        }
      } else {
        let startLine = this.render.content[start.line];
        startLine.content = startLine.content.slice(0, start.node + 1);
        let startSpan = startLine.content[start.node];
        startSpan.content = startSpan.content.replaceAll('&nbsp;', ' ')
                                              .substr(0, start.letter)
                                              .replaceAll(' ', '&nbsp;');
        let endLine   = this.render.content[end.line];
        endLine.content = endLine.content.slice(end.node);
        let endSpan = endLine.content[0];
        endSpan.content = endSpan.content.replaceAll('&nbsp;', ' ')
                                         .substr(end.letter)
                                         .replaceAll(' ', '&nbsp;');
        if (endSpan.content.length > 0) {
          startLine.content = startLine.content.concat(endLine.content);
        }
        this.render.content.splice(start.line + 1, end.line - start.line);
        this.render.update.minHeight();
        this.render.update.scrollWidth();
      }

      this.caret.refocus(
        start.letter,
        start.line,
        start.node
      );
      this.render.move.page();
      this.end.select();
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
    validateMergeLineOnRemoveWord : (dir, el, c_pos) => {
      return ( el.innerText.length == 0 && !el.nextSibling ) ||
      ( dir < 0 && c_pos == 0 ) ||
      ( dir > 0 && c_pos == el.innerText.length &&
        el.parentElement.children[el.parentElement.children.length - 1] == el
      );
    },
    word : ( dir, el = this.pos.el, c_pos = this.pos.letter ) => {
      if ( this.remove.validateMergeLineOnRemoveWord(dir, el, c_pos) ) {
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
      const pos  = this.pos,
            next = pos.el.nextSibling,
            prev = pos.el.previousSibling;

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
      document.addEventListener('keyup'  , this.key.bind            ? this.key           .bind(this) : this.key           , true);
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
      this.pos.letter = letter;
      this.pos.line   = line;
      this.caret.setByChar( letter, line, node );
    }
  }

  get = {
    _name : 'get',
    clone : (obj) => {
      return JSON.parse(JSON.stringify(obj));
    },
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
      let start = this.get.clone(this.selection.start);
      let end   = this.get.clone(this.selection.end);
      if (
        start.line > end.line
        || (start.line == end.line && start.node > end.node)
        || (start.line == end.line && start.node == end.node && start.letter > end.letter)
      ) {
        let tmp = start;
        start = end;
        end = tmp;
      }
      const sel   = this.get.selection();
      if (sel.type != 'Range') {
        return;
      }

      if (start.line == end.line) {
        const line = this.get.clone(this.render.content[start.line]);
        if (start.node == end.node) {
          let content = this.replace.spaceChars(line.content[start.node].content);
          let text    = this.replace.spaces(content.substr(start.letter, end.letter - start.letter));
          line.content[start.node].content = text;
          return [line];
        } else {
          let startNode = line.content[start.node];
          let endNode   = line.content[end.node  ];
          startNode.content = this.replace.spaces(this.replace.spaceChars(startNode.content).substr(start.letter ));
          endNode.content   = this.replace.spaces(this.replace.spaceChars(endNode.content  ).substr(0, end.letter));
          line.content = [startNode].concat(line.content.slice(start.node + 1, end.node + 1) )
          return [line];
        }
      }
      let linesBetween = this.render.content.slice(start.line + 1, end.line);
      let startLine = this.get.clone(this.render.content[start.line]);
      let endLine = this.get.clone(this.render.content[end.line]);
      endLine.content = endLine.content.slice(0, end.node + 1);
      let endSpan = endLine.content[endLine.content.length - 1];

      endSpan.content = endSpan.content.replaceAll('&nbsp;', ' ');
      endSpan.content = endSpan.content.substr(0, end.letter);
      endSpan.content = endSpan.content.replaceAll(' ', '&nbsp;');

      startLine.content = startLine.content.slice(start.node);
      let startNode = startLine.content[0];
      startNode.content = startNode.content.replaceAll('&nbsp;', ' ');
      startNode.content = startNode.content.substr(start.letter);
      startNode.content = startNode.content.replaceAll(' ', '&nbsp;');
      return [startLine].concat(linesBetween, [endLine]);
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
      const children = Object.values(this.pos.el.parentElement.children);
      let letters = 0;
      for (let i = 0; i < children.length; i++) {
        if (this.pos.el == children[i]) {
          break;
        }
        letters += children[i].innerText.length;
      }
      letters += this.pos.letter;

      return {
        x : letters,
        y : this.pos.line
      }
    },
    line : ( el ) => {
      if ( el.parentElement == this.editor ) return el;
      return this.get.line( el.parentElement );
    },
    lineByPos : ( pos ) => {
      pos -= this.render.hidden;
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
    isActive : false,
    isVisible : () => {
      return this.caret.isActive
      && (
        this.pos.line >= this.render.hidden
        && this.pos.line <= this.render.hidden + this.render.linesLimit
      );
    },
    scrollTo : () => {
      let caretLeft = this.get.realPos().x * this.settings.letter + this.settings.left;
      let caretTop  = ( this.pos.line + 1 ) * this.settings.line;
      let yPos = caretTop - this.editor.offsetHeight > 0 ? caretTop - this.editor.offsetHeight : 0;

      if ( caretLeft > this.editor.offsetWidth - 20 ) this.editor.scrollTo( caretLeft + 20 - this.editor.offsetWidth, yPos );
      else this.editor.scrollTo( 0, yPos );
    },
    scrollToX : () => {
      const left = this.render.overflow.scrollLeft;
      const caretPos = this.caret.getPos();
      if ( this.render.overflow.offsetWidth + left - 10 - this.settings.left < caretPos.left ) {
        this.render.move.overflow(caretPos.left - (this.render.overflow.offsetWidth + left - 10 - this.settings.left), 0);
      } else if ( caretPos.left < left + 10 + this.settings.left ) {
        this.render.move.overflow( -(left + 10  + this.settings.left - caretPos.left), 0);
      }
    },
    set : ( x, y ) => {
      this.caret.el.style.left = x + 'px';
      this.caret.el.style.top  = y + 'px' ;
    },
    setByChar : ( letter, line, el = null ) => {
      if (el) {
        this.pos.el = el;
      }
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
      caret.className = 'caret';
      parent.insertBefore( caret, parent.children[0] );
      return caret;
    },
    pos : {
      _name : 'pos',
      toY : ( pos ) => {
        return ( Math.floor( (pos - this.settings.top  ) / this.settings.line   ) * this.settings.line    ) + this.settings.top
      }
    },
    hide : () => {
      if ( this.caret.el ) this.caret.el.style.display = "none";
      this.caret.isActive = false;
    },
    show : () => {
      if ( this.caret.el ) this.caret.el.style.display = "block";
      this.caret.isActive  = true;
    },
    refocus : (letter = this.pos.letter, line = this.pos.line, childIndex = this.pos.childIndex) => {
      this.pos.letter     = letter;
      this.pos.line       = line;
      this.pos.childIndex = childIndex;
      if (!this.caret.isVisible()) {
        return;
      }
      line = this.get.lineByPos(this.pos.line);
      if (
        this.pos.line <= this.render.hidden + this.render.linesLimit &&
        this.pos.line >= this.render.hidden &&
        line
      ) {
        this.pos.el = line.childNodes[childIndex];
        this.caret.setByChar(this.pos.letter, this.pos.line, line.childNodes[this.pos.childIndex]);
        return true;
      }
      return false;
    }
  }

  action = {
    _name : 'action',
    copy : () => {
      /*
        As coping to clipboard sucks without https server -
        https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
        we will do it in 2 parts:
         - copy to cliboard plain text as this is supported
         - keep in our clipboard variable to proper stuff with styles and all
      */
      this.clipboard = this.get.clone(this.get.selectedNodes());
      this.truck.import(this.clipboard, false, 0, false, false, this.font.lab, false);
      let firstText = this.font.lab.children[0].children[0].childNodes[0];
      let lastText  = this.font.lab.children[ this.font.lab.children.length - 1 ]
      lastText      = lastText.children[ lastText.children.length - 1 ]
      lastText      = lastText.childNodes[ lastText.childNodes.length - 1];

      const range = new Range();
      range.setStart(firstText, 0);
      range.setEnd  (lastText , lastText.nodeValue.length);
      this.get.selection().removeAllRanges();
      this.get.selection().addRange(range);

      // moving it to timeout as the exec copy appears to work on the end of stack
      // or something similar
      setTimeout(function(){
        document.execCommand('copy');
        this.copiedHere = true;
        this.font.lab.innerHTML = '';
        this.checkSelect();
      }.bind(this), 0)
    },
    paste : () => {
      this.remove.selected();
      const start = this.selection.start;
      const end   = this.selection.end;
      const clipboard = this.get.clone(this.clipboard);
      const first = clipboard[0];
      const last = clipboard[ clipboard.length - 1 ];
      let firstLine = this.render.content[this.pos.line];
      let firstLineSpan = firstLine.content[this.pos.childIndex];
      let firstPreText = this.replace.spaceChars(firstLineSpan.content).substr(0, this.pos.letter);
      let firstSufText = this.replace.spaceChars(firstLineSpan.content).substr(this.pos.letter);
      // Set content to be prefix
      firstLineSpan.content = firstPreText;
      // cut the rest of spans
      let firstLineSpans = firstLine.content.splice(start.node + 1);
      // add spans from the first copy line
      firstLine.content = firstLine.content.concat(first.content);

      let middleLines = this.get.clone(clipboard.slice( 1, clipboard.length - 1 ));
      let lastLetter, lastChildIndex;
      if (clipboard.length > 1) {
        let lastLine = clipboard[clipboard.length - 1];
        lastChildIndex = lastLine.content.length - 1;
        lastLetter = this.replace.spaceChars(lastLine.content[lastLine.content.length - 1].content).length;
        lastLine.content[lastLine.content.length - 1].content += firstSufText;
        lastLine.content = lastLine.content.concat(firstLineSpans);
        middleLines = middleLines.concat([lastLine]);
      } else {
        lastLetter = first.content[ first.content.length - 1 ].content.length;
        lastChildIndex = this.pos.childIndex + first.content.length;
        firstLine.content[firstLine.content.length - 1].content += firstSufText;
      }
      this.render.content.splice(
        this.pos.line + 1,
        0,
        ...middleLines
      );

      this.render.move.page();
      this.render.set.overflow(
        null,
        (
          (this.pos.line + clipboard.length - 1)
          - (Math.floor(this.render.linesLimit/2))
        ) * this.settings.line
      );
      this.caret.refocus(
        lastLetter,
        this.pos.line + clipboard.length - 1,
        lastChildIndex
      );
      this.render.update.minHeight();
      this.render.update.scrollWidth();
      this.update.selection.start();
    },
    cut : () => {
      this.action.copy();
      this.remove.selected();
      this.render.update.minHeight();
      this.render.update.scrollWidth();
    },
    undo : () => {
      this._save.restore();
      this.render.update.minHeight();
      this.render.update.scrollWidth();
    },
    redo : () => {
      this._save.recall();
      this.render.update.minHeight();
      this.render.update.scrollWidth();
    },
    selectAll : () => {
      this.update.selection.start(0, 0, 0);
      const last = this.render.content[this.render.content.length - 1];
      const lastSpan = last.content[last.content.length - 1];
      const lastNode = this.replace.spaceChars(lastSpan.content);
      this.update.selection.end(
        lastNode.length,
        this.render.content.length - 1,
        last.content.length - 1
      );
      this.selection.active = true;
      this.checkSelect();
    },
  }

  is = {
    line : {
      visible : (line) => {
        return !(line < this.render.hidden || line > this.render.hidden + this.render.linesLimit);
      }
    }
  }

  assignEvents() {
    this.editor.addEventListener("mousedown", this.active.bind      ? this.active    .bind(this) : this.active    );
    this.editor.addEventListener("mouseup"  , this.stopSelect.bind  ? this.stopSelect.bind(this) : this.stopSelect);
    this.editor.addEventListener("focusout" , this.deactive.bind    ? this.deactive  .bind(this) : this.deactive  );
  }

  updateSelect( e ) {
    this.selection.update = true;
    // If this was called then some selection appeared
    const selection = this.get.selection();
    if (selection.type !== 'Range') {
      return;
    }
    this.selection.active = true;
    if (selection.focusNode == this.editor) {
      return;
    }
    this.selection.end = {
      line : this.get.linePos( this.get.line( selection.focusNode ) ) + this.render.hidden,
      node : this.get.childIndex( selection.focusNode.parentElement ),
      letter : selection.focusOffset,
    };
  }

  stopSelect( e ) {
    this.selection.update = false;
    this.editor.removeEventListener('mousemove', this.updateSelect.bind ? this.updateSelect.bind(this) : this.updateSelect, true);
    this.checkSelect();
  }

  checkSelect() {
    if (!this.selection.active) {
      return;
    }

    const start  = this.selection.start;
    const end    = this.selection.end;
    let reversed = false;

    if ( start.line < this.render.hidden && end.line < this.render.hidden ) {
      return;
    }

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

    if (!firstText.children[ lineStartChildIndex ]) {
      console.log(firstText, lineStartChildIndex);
    }
    firstText = firstText.children[ lineStartChildIndex ].childNodes[0];
    lastText  = lastText .children[ lineEndChildIndex   ].childNodes[0];
    const range = new Range();
    const firstTextLength = firstText.nodeValue.length;
    const lastTextLength = lastText.nodeValue.length;
    if (firstTextLength < startLetter) {
      startLetter = firstTextLength;
    }
    if (lastTextLength < endLetter) {
      endLetter = lastTextLength;
    }
    range.setStart(firstText, startLetter);
    range.setEnd  (lastText , endLetter  );
    this.get.selection().removeAllRanges();
    this.get.selection().addRange(range);
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
    let line = Math.ceil ( ( y - this.settings.top ) / this.settings.line );
    const letter = this.font.getLetterByWidth(left, el);
    this.caret.show();
    const index = this.get.childIndex(el);
    this.caret.refocus(
      letter,
      line,
      index,
    );

    if (line < this.render.hidden + 2 && this.render.hidden > 0) {
      this.render.set.overflow(null, (line - 2) * this.settings.line);
    } else if (line > this.render.hidden + this.render.linesLimit - 5) {
      this.render.set.overflow(null, (line - (this.render.linesLimit - 5)) * this.settings.line);
    }

    this.lastX = this.get.realPos().x;
    this.selection.start = { line : line, letter, node : index };
    this.selection.active = false;
    this.editor.addEventListener(
      'mousemove',
      this.updateSelect.bind ? this.updateSelect.bind(this) : this.updateSelect,
      true
    );
    this.activated = true;
    this.resetPressed();
    this.set.docEvents();
  }

  resetPressed() {
    this.pressed.ctrl  = false;
    this.pressed.shift = false;
    this.pressed.alt   = false;
  }

  deactive( e ) {
    console.log("deactivate");
    this.remove.docEvents();
    this.copiedHere = false;
    this.activated  = false;
  }

  updateSpecialKeys( e ) {
    // Clicking Alt also triggers Ctrl ?????? wierd stuff man
    if (!e.altKey) {
      this.pressed.ctrl = e.ctrlKey;
    } else {
      this.pressed.ctrl = false;
    }
    // If shift key was just clicked
    if (!this.pressed.shift && e.shiftKey) {
      this.selection.active = true;
      this.update.selection.start()
    } else if (!e.shiftKey && this.get.selection().type != "Range") {
      this.selection.active = false;
    }
    this.pressed.shift = e.shiftKey;
    this.pressed.alt   = e.altKey  ;
  }

  key ( e ) {
    this.updateSpecialKeys( e );
    const type = e.type;
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
      default : ( e, type ) => {
        throw new Error('Unknow special key', e.keyCode);
      }
    };

    let selDelSkip = { 'delete' : true, 'backspace' : true, 'escape' : true };
    const sel = this.get.selection();
    if ( this.selection.active && !selDelSkip[e.key.toLowerCase()] && !this.pressed.ctrl &&  sel.type == "Range") {
      if ( !!this.keys[e.key.toLowerCase()]  ||  e.key.length == 1 ) {
        this.remove.selected();
      }
    }

    if ( !keys[e.keyCode] && e.key.length == 1 ) {
      this.insert( e.key );

      if (!this.caret.isVisible()) {
        this.render.set.overflow(null, (this.pos.line - (this.render.linesLimit/2)) * this.settings.line);
      }
      return;
    }

    ( keys[e.keyCode]  ||  keys['default'] )( e, type );

    this.updateCurrentLine();
  }

  updateCurrentLine() {
    const line = this.pos.line;
    // Line we want to save if hidden
    if (!this.is.line.visible(line)) {
      return;
    }
    const exportedLine = this.truck.exportLine(
      this.get.lineByPos(
        line
      )
    );
    this.render.content[line] = exportedLine;
  }

  toSide( dirX, dirY ) {
    let line   = this.pos.line;
    let letter = this.pos.letter;
    let node   = this.pos.childIndex;

    if (dirY > 0) {
      line = this.render.content.length - 1;
    } else if (dirY < 0) {
      line   = 0;
    }

    if (dirX > 0) {
      let lineContent = this.render.content[line];
      node = lineContent.content.length - 1;
      let lastSpan = lineContent.content[lineContent.content.length - 1];
      letter = lastSpan.content.length;
    } else if (dirX < 0) {
      letter = 0;
      node   = 0;
    }

    // Check if chosen line has needed amount of nodes and letters
    const chosenLine = this.render.content[line];
    if (chosenLine.content.length - 1 < node) {
      node = chosenLine.content.length - 1;
    }

    if (chosenLine.content[node].content.length < letter) {
      letter = chosenLine.content[node].content.length;
    }

    this.caret.refocus(
      letter,
      line,
      node
    );
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
        if (sel.type != "Range") this.remove.one (-1);
        else                     this.remove.selected();
      }
    },
    tab : ( e ) => {
      e.preventDefault();
      let tab = '';
      for ( let i = 0; i < 2; i++ ) {
        tab += '&nbsp;';
      }
      this.insert(tab);
    },
    escape : ( e ) => {
      this.caret.hide();
      this.end.select();
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

      // Find closest space considering direction
           if ( dir < 0 ) newPos = text.split("").reverse().indexOf('\u00A0', text.length - c_pos );
      else if ( dir > 0 ) newPos = text.indexOf('\u00A0', c_pos );
      // If closes space is in the same space as caret then just move one in chosen direction
      if ( text.length - newPos === c_pos && dir < 0 ) {
        c_pos--;
      } else if ( newPos === c_pos && dir > 0 ) {
        c_pos++;
      // If space wasn't found then it means we have to check closes nodes
      } else if ( newPos === -1 ) {
        const prev = el.previousSibling, next = el.nextSibling;
        // If direction is inversed and our node has sibling before it then run moveCtrl using
        // that sibling
        if ( dir < 0 && prev ) {
          this.keys.moveCtrl( dir, prev, prev.innerText.length );
          return;
        }

        // Same for forward direction but using sibling after our node
        if ( dir > 0 && next ) {
          this.keys.moveCtrl( dir, next, 0 );
          return;
        }

        // If caret is already on the end of line (no siblings in chosen direction idicates it) then
        // move it to the start or end of next/previous line
        // console.log("Ne checks");
        // console.log("left check", c_pos, '==', 0, '&&', this.pos.line, '>', 0, '&&', dir, '<', 0);
        // console.log("left result", c_pos == 0, this.pos.line >= 0, dir < 0);
        // console.log("right check", c_pos, '==', text.length, '&&', this.pos.line, '>=', 0, '&&', this.pos.line, '<', this.render.content.length - 1);
        // console.log("right result",c_pos == text.length, this.pos.line >= 0, this.pos.line < this.render.content.length - 1);
        if (
          c_pos == 0 && this.pos.line > 0 && dir < 0 // Going left
          ||
          c_pos == text.length && this.pos.line >= 0 && this.pos.line < this.render.content.length - 1 && dir > 0 // Going right
        ) {
          if (dir < 0) {
            const line = this.get.lineByPos(this.pos.line - 1);
            const el = line.childNodes[line.childNodes.length - 1];
            this.set.side( el, dir * -1, this.pos.line - 1 );
            this.keys.moveCtrl( dir );
            return;
          } else {
            const line = this.get.lineByPos(this.pos.line);
            const el = line.childNodes[0];
            this.set.side( el, dir * -1, this.pos.line + 1 );
            this.keys.moveCtrl( dir );
            return;
          }
        } else {
          // Otherwise set it to side of current node
          this.set.side( el, dir );
        }
        this.pos.childIndex = this.get.childIndex(el);
        this.lastX = this.get.realPos().x;
        return;
      } else {
             if ( dir < 0 ) c_pos = text.length - newPos;
        else if ( dir > 0 ) c_pos = newPos;
      }

      this.set.pos( el, c_pos, this.pos.line );
      this.pos.childIndex = this.get.childIndex(el);
      this.lastX = this.get.realPos().x;
    },
    move : ( dirX, dirY, recuresionCheck = false ) => {
      if (this.get.selection().type == 'Range') {
        this.caret.refocus(
          this.selection.end.letter,
          this.selection.end.line,
          this.selection.end.node
        );
      }

      const oldLine = this.pos.line;

      if ( this.selection.active && !this.pressed.shift ) {
        if ( this.selection.reverse && !this.selection.expanded && dirX < 0 ) dirX = 0;
        else if ( dirX > 0 ) dirX = 0;
      }

      if ( this.pressed.ctrl && dirX != 0 ) this.keys.moveCtrl( dirX );
      else if ( dirX != 0 ) this.keys.moveX( dirY, dirX );

      if ( dirY != 0 ) this.keys.moveY( dirY, dirX );

      if (
        this.pos.el.innerText.length == 0 &&
        (
          this.pos.el.previousSibling && dirX < 0 ||
          this.pos.el.nextSibling && dirX > 0
        ) &&
        !recuresionCheck
      ) {
        let temp = this.pos.el;
        this.keys.move(dirX, 0, true);
        temp.remove();
      }

      if ( this.pressed.shift ) {
        this.update.selection.end();
        this.checkSelect();
      } else this.end.select();

    },
    moveX : ( dirY, dirX ) => {
      let el = this.pos.el, prev = el.previousSibling;
      if ( this.pos.letter + dirX <= -1 ) {
        if ( prev && prev.nodeType == 1 ) {
          this.pos.el = prev;
          this.pos.childIndex--;
          this.pos.letter = prev.innerText.length;
        } else {
          let previousLine = this.get.lineInDirection( el.parentElement, -1 );
          if ( !previousLine ) return;
          this.pos.el = previousLine.children[ previousLine.children.length - 1 ];
          this.pos.childIndex = previousLine.children.length - 1;
          this.caret.setByChar( this.pos.el.innerText.length, this.pos.line - 1 );
          this.lastX = this.get.realPos().x;
          this.caret.scrollToX();
          return;
        }

      } else if ( this.pos.letter + dirX > el.innerText.length && el.nextSibling && el.nextSibling.nodeType == 1 ) {
        this.pos.el     = el.nextSibling;
        this.pos.letter = 0;
        this.pos.childIndex++;
      } else if ( this.pos.letter + dirX > el.innerText.length ) {
        let nextLine = this.get.lineInDirection( el.parentElement, 1 );
        if ( !nextLine ) return;
        this.pos.el = nextLine.children[0];
        this.pos.childIndex = 0;
        this.caret.setByChar( 0, this.pos.line + 1 );
        this.lastX = this.get.realPos().x;
        this.caret.scrollToX();
        return;
      }
      this.caret.setByChar( this.pos.letter + dirX, this.pos.line );
      this.lastX = this.get.realPos().x;
      this.caret.scrollToX();
    },
    moveY : ( dirY, dirX ) => {

      const line = this.pos.line;
      if ( line + dirY <= -1 ) return;
      if ( line + dirY >= this.render.content.length ) return;

      let realLetters = this.get.realPos().x;

      let newLine = this.get.lineInDirection( this.pos.el.parentElement, dirY );
      if ( !newLine ) return;

      if ( newLine.innerText.length < realLetters + dirX ) {
        this.pos.childIndex = newLine.children.length - 1;
        this.pos.line   = line + dirY;
        this.pos.letter = newLine.innerText.length;
      } else {

        let currentLetterCount = 0;

        for ( let i = 0; i < newLine.children.length; i++ ) {
          let child = newLine.children[i];
          currentLetterCount += child.innerText.length;
          if ( currentLetterCount >= this.lastX ) {
            this.pos.childIndex = this.get.childIndex(child);
            this.pos.line   = line + dirY;
            this.pos.letter =  this.lastX - (currentLetterCount - child.innerText.length);
            break;
          } else if (i + 1 == newLine.children.length) {
            this.pos.childIndex = newLine.children.length - 1;
            this.pos.line       = line + dirY;
            this.pos.letter     =  child.innerText.length;
          }
        }
      }

      if (dirY > 0 && this.pos.line + dirY + 3 >= this.render.linesLimit + this.render.hidden) {
        this.render.move.overflow(0, this.settings.line)
      } else if (dirY < 0 && this.pos.line + dirY <= this.render.hidden) {
        this.render.move.overflow(0, -this.settings.line)
      }
      this.caret.refocus();
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
    this.render.content[this.pos.line] = this.truck.exportLine(el.parentElement);
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
    this.render.content.splice(this.pos.line + 1, 0, this.truck.exportLine(newLine));
    if (this.pos.line + 1 > this.render.hidden + this.render.linesLimit - 6) {
      this.render.set.overflow(null, (this.pos.line - (this.render.linesLimit - 6)) * this.settings.line);
      this.render.move.page(this.pos.line - (this.render.linesLimit - 6));
    } else {
      this.render.move.page();
    }
    this.caret.refocus(0, this.pos.line + 1, 0);
  }

  mergeLine( dir ) {
    let line = this.get.line( this.pos.el );
    if ( line.nodeName != "P") throw new Error("Parent has wrong tag, can't merge lines");
    if ( dir < 0 ) { // Backspace
      let previous = this.get.lineInDirection( line, dir );
      if ( !previous ) return; // do nothing

      let oldLast = previous.children[previous.children.length - 1];
      for ( let i = line.children.length - 1; i >= 0 ; i-- ) {
        if ( line.children[0].innerText.length > 0 ) previous.appendChild( line.children[0] );
        else line.children[0].remove();
      }
      line.remove();
      this.pos.line = this.pos.line - 1;
      this.toSide(1, 0);
      this.lastX = this.get.realPos().x;
      this.render.remove.line(this.pos.line);

    } else if ( dir > 0 ) { // Delete
      let next = this.get.lineInDirection( line, dir );
      if ( !next ) return; // do nothing

      for ( let i = next.children.length - 1; i >= 0 ; i-- ) {
        if ( next.children[0].innerText.length > 0 ) line.appendChild( next.children[0] );
        else                                         next.children[0].remove();
      }

      next.remove();
      this.render.remove.line(this.pos.line + 1);
    }
  }

  insert( key ) {
    let text = this.replace.spaceChars(this.render.content[this.pos.line].content[this.pos.childIndex].content);
    text = {
      pre : text.substr( 0, this.pos.letter ),
      suf : text.substr( this.pos.letter    )
    }
    this.pos.el.innerHTML = text.pre + key + text.suf;
    this.render.content[this.pos.line].content[this.pos.childIndex].content = text.pre + key + text.suf;
    this.caret.refocus( this.pos.letter + this.replace.spaceChars(key).length );
    this.lastX++;
  }

  getSplitNode() {
    let text = this.pos.el.innerText;
    return {
      pre : this.setAttributes( this.pos.el.attributes, text.substr( 0, this.pos.letter ) ),
      suf : this.setAttributes( this.pos.el.attributes, text.substr( this.pos.letter    ) )
    }
  }

  setAttributes(attributes, text) {
    let newSpan = document.createElement("span");
    for ( let att, i = 0, atts = attributes, n = atts.length; i < n; i++ ){
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

    let span = this.setAttributes( el.attributes, el.innerText );
    nodes.push( span );
    if ( el.nextSibling ) {
      let nextSpan = this.getNextSiblignAndRemove( el.nextSibling );
      nodes = nodes.concat( nextSpan );
    }

    el.remove();
    return nodes;
  }

  catchClipboard(e) {
    if (!this.activated) {
      return;
    }

    // If user used internal method action.copy to copy content of this editor
    // don't transform the clipboard
    if (!this.copiedHere) {
      let paste = (event.clipboardData || window.clipboardData).getData('text');
      this.clipboard = this.truck.exportText(paste);
    }

    this.action.paste();
  }
}
