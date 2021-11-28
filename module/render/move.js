class TabJF_Render_Move {
  page ( offset = this.render.hidden, clear = true, reverse = false ) {
    this.truck.import( this.render.content, this.render.linesLimit, offset, clear, reverse );
    this.render.hidden = offset;
    this.editor.style.setProperty('--paddingTop', this.render.hidden * this.settings.line );
    this.editor.style.setProperty('--counter-current', this.render.hidden );
    this.caret.refocus();
  }

  overflow ( x, y ) {
    let top  = this.render.overflow.scrollTop;
    let left = this.render.overflow.scrollLeft;
    this.render.overflow.scrollTo( left + x, top + y );
  }
}
export { TabJF_Render_Move };
