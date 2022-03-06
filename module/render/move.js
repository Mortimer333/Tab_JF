class TabJF_Render_Move {
  /**
   * Move page to passed offset and update editor variables
   * @param  {Object} [obj={}] Some settings:
   * - {Number } offset  [this.render.hidden] - from where start rendering
   * - {Boolean} clear   [true              ] - clear editor?
   * - {Boolean} clear   [false             ] - reverse insert?
   * - {Boolean} refocus [true              ] - refocus caret after rendering?
   */
  page ( obj = {} ) {
    const required = {
      'offset' : this.render.hidden,
      'clear' : true,
      'reverse' : false,
      'refocus' : true
    }
    Object.keys(required).forEach( attr => {
      obj[attr] = typeof obj[attr] == 'undefined' ? required[attr] : obj[attr];
    });
    let offset = obj.offset, clear = obj.clear, reverse = obj.reverse, refocus = obj.refocus;

    this.truck.import( this.render.content, this.render.linesLimit, offset, clear, reverse );
    this.render.hidden = offset;
    this.editor.style.setProperty('--paddingTop', this.render.hidden * this.settings.line );
    this.editor.style.setProperty('--counter-current', this.render.hidden );
    if ( refocus && this.caret.isVisible() ) this.caret.refocus();
  }

  /**
   * Scroll editor for addtional pixels on X or/and Y axis. Passed values will be added to current scroll amount
   * @param  {Number} x 
   * @param  {Number} y
   */
  overflow ( x, y ) {
    let top  = this.render.overflow.scrollTop;
    let left = this.render.overflow.scrollLeft;
    this.render.overflow.scrollTo( left + x, top + y );
  }
}
export { TabJF_Render_Move };
