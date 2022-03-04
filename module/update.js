class TabJF_Update {
  resizeDebounce = null; // Placeholder for resize event debounce

  page () {
    if ( this.settings.syntax ) this.syntax.update();
    this.render.move.page({ refocus : false });
    this.checkSelect();
    if ( this.caret.isVisible() ) {
      this.caret.recalculatePos();
      this.caret.refocus();
    }
  }

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

    const type =  this.get.selection().type;
    // If shift key was just clicked
    if ( !this.pressed.shift && e.shiftKey && type != "Range" ) {
      this.selection.active = true;
      this.update.selection.start()
    } else if ( !e.shiftKey && type != "Range" ) {
      this.selection.active = false;
    }
    this.pressed.shift = e.shiftKey;
    this.pressed.alt   = e.altKey  ;
  }

  currentSpanContent ( text ) {
    this.render.content[this.pos.line].content[this.pos.childIndex].content = this.replace.spaces(text);
  }

  resize() {
    console.log("resize");
    this.render.overflow.style.setProperty("--max-height", 'none');
    setTimeout(this.update.resizeTimeout.bind(this), 0)
  }

  resizeTimeout() {
    this.settings.height = this.render.overflow.offsetHeight;
    this.render.overflow.style.setProperty("--max-height", this.settings.height);
    this.render.linesLimit = Math.ceil( this.settings.height / this.settings.line ) + 2;
    this.render.update.minHeight();
    this.render.update.scrollWidth();
    this.clear.editor( false );
    this.render.fill.event();
  }
}
export { TabJF_Update };
