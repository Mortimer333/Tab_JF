/**
 * Save object which is hidden from debug tool and holds all related functionality to Version Control.
 */
class TabJF_Save {
  debounce   = undefined;   // Here we store debounce function, which saves state of editor
  version    = 0;           // Version counter
  tmpDefault = {            // Default values of each version
    fun_name : false,
    remove : {              // cLine - from which line start, len - how much lines to delete going down
      sLine : -1,
      len   : -1,
    },
    after : {},             // Additional saved lines added to `add` attrbiute on undo
    add : {},               // Saved lines before the change occured
    focus : {               // Focus of the caret before the change
      topLine    : 0,       // This indicate on which line we should start the render
      letter     : -1,
      line       : -1,
      childIndex : -1,
    },
    focusAfter : {          // Focus of caret after the change
      topLine    : 0,
      letter     : -1,
      line       : -1,
      childIndex : -1,
    },
  }

  tmp          = [];        // Here we store steps which we are working on, later merged with pending as means to not overwrite them
  pending      = [];        // Here we store set of steps called version which gets updated until debounce stops and move them to versions
  versions     = [];        // Here we store versions
  methodsStack = [];        // Saved current methods stack which helps with creating exceptions because some combinations of features brings
                            // unexpected results
  inProgress   = false;     // Tells us if master function has ended and we can do cleanup operations

  set     = {};             // Placeholder for injection of Tab_JS_Save_Set class
  content = {};             // Placeholder for injection of Tab_JS_Save_Content class
  maxVersionCount = 100;    // The maximum of versions to hold in memory

  /**
   * Merges tmp with pending and resets it
   */
  moveToPending () {
    this._save.pending = this._save.pending.concat( this._save.tmp );
    this._save.resetTmp();
  }

  /**
   * Moves pending version to versions. Removes old versions that got replaced by newer one.
   *
   * Versions are saved in reverse order. The newest is 0 and the oldest is the biggest.
   * This makes it easier to understand as current version is at start of the array and dipper are the older ones.
   */
  publish () {
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
    if (save.versions.length > save.maxVersionCount) {
      save.versions.splice(save.maxVersionCount);
    }
  }

  /**
   * Better name for this one would be removeRepeatingSteps but that doesn't sound as cool as `squash`.
   * This method basically checks if all steps are necessary and deletes those which brings nothing to the table.
   * It does it by method checkStepsCompatibility which checks if two steps are basically the same, just content of lines
   * is different. If so remove *newer* step as the older step is the closer is to the original line.
   */
  squash () {
    const pending = this._save.pending;
    // Start from step 2 as first one is always closes to the original line
    for (let i = 1; i < pending.length; i++) {
      const step     = pending[i];      // Step Two
      const previous = pending[i - 1];  // Step One
      if ( this._save.checkStepsCompatibility( step, previous ) ) {
        previous.after      = step.after;
        previous.focusAfter = step.focusAfter;
        pending.splice( i, 1 );
        i--;
      }
    }
  }

  /**
   * Check if two steps where created by the same fuction - have the same lines to remove and to add
   * @param  {object} stepOne
   * @param  {object} stepTwo
   * @return {boolean}        Returns if the steps are compatible for merge
   */
  checkStepsCompatibility ( stepOne, stepTwo ) {
    return stepOne.fun_name == stepTwo.fun_name && stepOne.fun_name != 'mergeLine' &&
      Object.values(stepOne.remove).toString() == Object.values(stepTwo.remove).toString() &&
      Object.keys  (stepOne.add   ).toString() == Object.keys  (stepTwo.add   ).toString();
  }

  /**
   * Reset tmp object
   */
  resetTmp () {
    this._save.tmp = [];
  }

  /**
   * Restore previous version and increase version counter.
   */
  restore () {
    const save = this._save;
    // If debounce didn't end and last version wasn't published, publish it and stop debouncing
    if ( save.pending.length > 0 ) {
      save.publish();
      save.debounce('clear');
    }

    // If this is last available version don't do anything
    if (save.versions.length == save.version) return;

    // Get previous version
    let version = save.versions[ save.version ];
    // Reverse steps and go through each of them and restore editor content starting by removing new lines and replacing them with older ones
    version.forEach(step => {
      save.content.remove( step.remove );
      save.content.add   ( step.add    );
    });
    // Set caret where it was before changes happen
    const focus = version[ version.length - 1 ].focus;
    this.lastX          = focus.lastX;
    this.pos.letter     = focus.letter;
    this.pos.line       = focus.line;
    this.pos.childIndex = focus.childIndex;
    // Move page so caret is visible or refresh page
    if ( !this.is.line.visible( focus.line ) ) {
      this.render.move.page({ offset : focus.line - Math.floor( this.render.linesLimit/2 ) });
    } else {
      this.render.move.page();
    }

    this.render.overflow.scrollTo(
      this.render.overflow.scrollLeft,
      this.render.hidden * this.settings.line
    );
    save.version++;
  }

  /**
   * The oposite of restore, moves editor to newer version (ctrl + Y/Redo)
   */
  recall () {
    const save = this._save;
    // This should be version == 0 but to be save it says: if version is first or lower then don't do anything
    if ( save.version <= 0 ) return;

    save.version--;
    const version = save.versions[ save.version ];
    // We reverse steps to apply them in right order.
    // @TODO might good to just create them reversed
    version.reverse().forEach( step => {
      const keys = Object.keys( step.add )
      const min  = Math.min(...keys);
      // Remove all lines which will be replaced
      save.content.remove({
        sLine : min,
        len   : Math.max(...keys) - min + 1,
      });

      save.content.add( step.after );
    });
    version.reverse(); // Reverse version content (again) for easier usage
    const focus = version[0].focusAfter;

    if ( !this.is.line.visible( focus.line ) )
      this.render.move.page({ offset : focus.line - Math.floor( this.render.linesLimit/2 ) });
    else
      this.render.move.page();

    this.render.overflow.scrollTo(
      this.render.overflow.scrollLeft,
      this.render.hidden * this.settings.line,
    );
    this.caret.refocus(
      focus.letter,
      focus.line,
      focus.childIndex
    );
  }
}
export { TabJF_Save };
