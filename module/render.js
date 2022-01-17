class TabJF_Render {
  hidden       = 0    ; // how many lines was hidden
  content      = null ;
  linesLimit   = 80   ; // shown lines
  maxLineWidth = 0    ;
  overflow     = null ;
  focusLost    = false; // if we have scrolled past caret

  removeScroll () {
    this.render.overflow.removeEventListener('scroll', this.render.fill.event, true);
  }

  init ( importObj = false ) {
    if ( importObj ) this.render.content = importObj;
    else             this.render.content = this.truck.export(); // If we don't have saved state, save current state
    this.render.linesLimit = Math.ceil( this.settings.height / this.settings.line ) + 2;
    const overflow = document.createElement("div");
    overflow.addEventListener('scroll', this.render.fill.event, true);
    overflow.className = "tabjf_editor-con";
    overflow   .style.setProperty("--max-height", this.settings.height);
    this.render.update.minHeight();
    this.render.update.scrollWidth();
    this.editor.parentElement.insertBefore(overflow, this.editor);
    overflow.appendChild( this.editor );
    this.render.overflow = overflow;
  }
}
export { TabJF_Render };
