class TabJF_Update {
  select( e ) {
    this.selection.update = true;
    // If this was called then some selection appeared
    const selection = this.get.selection();
    if (selection.type !== 'Range') return;
    this.selection.active = true;
    if ( selection.focusNode == this.editor ) return;
    this.selection.end = {
      line   : this.get.linePos( this.get.line( selection.focusNode ) ) + this.render.hidden,
      node   : this.get.childIndex( selection.focusNode.parentElement ),
      letter : selection.focusOffset,
    };
  }

  specialKeys( e ) {
    // Clicking Alt also triggers Ctrl ?????? wierd stuff man
    if ( !e.altKey ) {
      this.pressed.ctrl = e.ctrlKey;
    } else {
      this.pressed.ctrl = false;
    }
    // If shift key was just clicked
    if ( !this.pressed.shift && e.shiftKey ) {
      this.selection.active = true;
      this.update.selection.start()
    } else if ( !e.shiftKey && this.get.selection().type != "Range") {
      this.selection.active = false;
    }
    this.pressed.shift = e.shiftKey;
    this.pressed.alt   = e.altKey  ;
  }

  currentLine() {
    const line = this.pos.line;
    // Line we want to save if hidden
    if ( !this.is.line.visible( line ) ) {
      return;
    }
    const exportedLine = this.truck.exportLine(
      this.get.lineByPos( line )
    );
    this.render.content[ line ] = exportedLine;
  }
}
