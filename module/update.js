class TabJF_Update {
  resizeDebounce = null; // Placeholder for resize event debounce

  /**
   * Updates whole page:
   * - syntax (if set)
   * - rerender page
   * - update selection
   * - recalculate caret position and refocus
   */
  page () {
    if ( this.settings.syntax ) this.syntax.update();
    this.render.move.page({ refocus : false });
    this.checkSelect();
    if ( this.caret.isVisible() ) {
      this.caret.recalculatePos();
      this.caret.refocus();
    }
  }

  /**
   * Update our selection with values from browser selection. So you could select something using Range, use this method and be sure that it
   * will be selected even after user rerenders document
   */
  select() {
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

  /**
   * Updates special keys such as alt, ctrl and shift
   * @param  {Object} e Keydown|Keyup event
   */
  specialKeys( e ) {
    // Clicking Alt also triggers Ctrl (??????)
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

  /**
   * Updates active node with test
   * @param  {String} text
   */
  currentSpanContent ( text ) {
    this.render.content[this.pos.line].content[this.pos.childIndex].content = this.replace.spaces(text);
  }

  /**
   * Updates editors values on resize
   * @param  {Object|null} [e=null] Resize event
   */
  resize( e = null) {
    this.settings.height = this.render.overflow.offsetHeight;
    this.render.linesLimit = Math.ceil( this.settings.height / this.settings.line ) + 2;
    this.render.update.minHeight();
    this.render.update.scrollWidth();
    this.clear.editor( false );
    this.render.fill.event();
  }
}
export { TabJF_Update };
