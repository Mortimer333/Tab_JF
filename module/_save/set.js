class TabJF_Save_Set {
  /**
   * Gets current caret focus position
   * @return {object} Focus object { line, childIndex, letter, topLine }
   */
  focus () {
    return {
      letter     : this.pos.letter,
      line       : this.pos.line,
      childIndex : this.get.childIndex(this.pos.el),
      topLine    : this.render.hidden,
    };
  }

  /**
   * One of two main methods for saving steps.
   * This one adds related lines before they are changed.
   * @param {string} name Name of the function (mainly used for exception)
   * @param {array } args Array of arguments which will be passed to the function
   */
  add ( name, args ) {
    // Modifiers tells us if we need to get one more line and from which direction
    let modifiers = 0;
    if ( name == "mergeLine") modifiers = args[0];

    // Create new tmp object from default
    const tmp = this.get.clone( this._save.tmpDefault );

    // Get selection and check if something is selected
    const sel = this.get.selection();
    if ( sel.type.toLowerCase() == 'range') {
      // If so figure out which line is first and save selected lines
      const start = this.selection.start;
      const end   = this.selection.end  ;

      const startLinePos = start.line > end.line ? end.line   : start.line;
      const endLinePos   = start.line > end.line ? start.line : end.line  ;

      for (let i = startLinePos; i <= endLinePos; i++) {
        tmp.add[i] = this.get.clone( this.render.content[i] );
      }
    }

    // Save function name, just for clarification when debugging
    tmp.fun_name  = name;

    // Save where caret is focused
    tmp.focus     = this._save.set.focus();
    const linePos = this.pos.line;
    const line    = this.get.lineByPos( linePos );

    // Get and save current line if we haven't already saved her
    if ( !tmp.add[ linePos ] ) tmp.add[ linePos ] = this.get.clone( this.render.content[ linePos ] );

    // Save line from modificators if we haven't already saved her
    if ( modifiers != 0 && !tmp.add[ linePos + modifiers ] ) {
      let nexLine = this.get.lineInDirection( line, modifiers );
      if ( nexLine ) tmp.add[ linePos + modifiers ] = this.render.content[ linePos + modifiers ];
    }

    // Push created step to tmp
    this._save.tmp.push( tmp );
  }

  /**
   * Second main method for saving steps.
   * Here we save which line are to be deleted.
   * @param {string } name      Name of function that was called
   * @param {array  } args      Argument passed to that function
   * @param {integer} step      Index of used step (there might be few at once in tmp)
   * @param {integer} startLine The line where caret started before function was called
   */
  remove ( name, args, step, startLine ) {
    const save = this._save;
    const pos  = this.pos.line;
    // Remove not needed steps
    if (
      (
        ( name == "one" || name == "word" )
        && save.methodsStack[ save.methodsStack.length - 1 ] == "mergeLine"
      )
      || // If the newest is mergeLine
      (
        name == "mergeLine"
        && save.methodsStack[ save.methodsStack.length - 2 ] == "selected"
      ) // If previous is selected
    ) {
      save.tmp.splice( step, 1 );
      return;
    }

    // Paste if pretty special as it uses a lot of existing functionality like newLine
    // which makes this solution get wierd out. So we have one whole exception for this method
    if ( name == "paste" ) {
      let tmp = save.tmp[ step ]
      tmp.remove = {
        sLine : startLine,
        len   : pos - startLine + 1,
      };
      tmp.focusAfter = this._save.set.focus();

      for (let i = tmp.remove.sLine; i < tmp.remove.sLine + tmp.remove.len; i++) {
        tmp.after[i] = this.render.content[i];
      }
      save.tmp = [ tmp ];
      return;
    }

    // Get step from current tmp
    let tmp = save.tmp[ step ];

    // If step is not present in tmp it might have been pushed to
    // pending due to some clearing, try to get it from there
    if ( !tmp ) tmp = save.pending[ step ];

    // Set name
    tmp.fun_name = name;

    // Check if anything will be added
    // if not just skip this as this never happens
    const lines = Object.keys( tmp.add );
    if ( lines.length == 0 ) return;

    // @TODO: Take closer look at this \/ and improve

    // Get min and max of saved lines
    // as similar numbers will be deleted
    let minOrMax = pos;
    let max = Math.max(...lines);
    let min = Math.max(...lines);

    // Here we decide if out current position is the lowest or highest
    if ( minOrMax < min ) {
      min = minOrMax;
      max = pos;
    } else if ( minOrMax > max ) {
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
    for ( let i = tmp.remove.sLine; i < tmp.remove.sLine + tmp.remove.len; i++ ) {
      tmp.after[i] = this.render.content[i];
    }

    // Save where caret is focused
    tmp.focusAfter = save.set.focus();
  }
}
export { TabJF_Save_Set };
