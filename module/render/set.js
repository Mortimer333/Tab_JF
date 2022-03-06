class TabJF_Render_Set {
  /**
   * Set overflow scroll position
   * @param  {Number} [x=null] Pass null to not change on X axis
   * @param  {Number} [y=null] Pass null to not change on Y axis
   */
  overflow ( x = null, y = null ) {
    if ( x === null ) x = this.render.overflow.scrollLeft;
    if ( y === null ) y = this.render.overflow.scrollTop;
    this.render.overflow.scrollTo( x, y );
  }
}
export { TabJF_Render_Set };
