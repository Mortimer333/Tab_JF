/**
 * Save object which is hidden from debug
 * and holds all related functionality to VC
 */
class TabJF_Save {
  debounce   = undefined;   // Here we store debounce function
  version    = 0;           // Version counter
  tmpDefault = {
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
  }

  tmp          = [];     // Here we store steps which we are working on, later merged with pending as means to not overwrite them
  pending      = [];     // Here we store set of steps called version which gets updated until debounce stops and move them to versions
  versions     = [];     // Here we store versions
  methodsStack = [];     // Save current methods stuck
  inProgress   = false;  // Tells us if maste function has ended and we can do cleanup operations

  set     = {};
  content = {};

  /**
   * Merges tmp with pending and resets it
   */
  moveToPending () {
    this._save.pending = this._save.pending.concat( this._save.tmp );
    this._save.resetTmp();
  }

  /**
   * Moves panding version to versions. Removes old versions that got replaced by newer one.
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
  }

  /**
   * Better name for this one would be removeRepeatingSteps but that's not really what I like.
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
   * Check if two steps where created by the same fuction, have the same lines to remove and to add
   * @param  {object} stepOne Step to compare
   * @param  {object} stepTwo Step to compare
   * @return {boolean}         If the steps are identical except the lines content
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
    // If debounce didn't end and last version wasn't published,
    // publish it and stop debouncing
    if ( save.pending.length > 0 ) {
      save.publish();
      save.debounce('clear');
    }

    // If we can't go back any further
    if (save.versions.length == save.version) return;

    // Get previous version
    let version = save.versions[ save.version ];
    // Reverse steps and go through each of them and restore editor content
    // starting from removing new lines and replacing them with older one
    version.forEach(step => {
      save.content.remove( step.remove );
      save.content.add   ( step.add    );
    });
    // this._save.slowVersion(version);

    const focus = version[ version.length - 1 ].focus;

    this.caret.refocus(
      focus.letter,
      focus.line,
      focus.childIndex,
    );

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

  slowVersion ( version, i = 0 ) {
    setTimeout(function() {
      let step = version[i];
      console.log("Step", i + 1, step.fun_name, "Remove", step.remove);
      const save = this._save;
      save.content.remove(step.remove);
      const focus = step.focus;
      this.render.move.page({ offset : focus.topLine });
      setTimeout(function(){
        let step = version[i];
        console.log("Step", i + 1, step.fun_name, "Add", step.add);
        const focus = step.focus;
        const save = this._save;
        save.content.add(step.add);
        this.render.move.page({ offset : focus.topLine });
        if (version.length > i + 1) {
          this._save.slowVersion(version, i + 1);
        }
      }.bind(this), 2000);
    }.bind(this), 2000);
  }

  /**
   * Refocuses the caret using focus object
   * @param {object} focus Focus object { line, childIndex, letter }
   */
  refocus ( focus ) {
    let line = this.get.lineByPos( focus?.line );

    if ( line ) {
      this.set.pos( line.childNodes[ focus.childIndex ], focus.letter, focus.line, focus.childIndex );
    } else {
      console.error("Line not found! Please refocus caret.");
    }
  }

  /**
   * The oposite of restore, merges new version to editor (ctrl + Y)
   */
  recall () {
    const save = this._save;
    if ( save.version <= 0 ) return;

    save.version--;
    const version = save.versions[ save.version ];
    version.reverse().forEach( step => {
      const keys = Object.keys( step.add )
      const min  = Math.min(...keys);

      save.content.remove({
        sLine : min,
        len   : Math.max(...keys) - min + 1,
      });

      save.content.add( step.after );
    });
    version.reverse();
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
