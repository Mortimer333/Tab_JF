class TabJF_Render_Set {
  overflow ( x = null, y = null ) {
    if ( x === null ) {
      x = this.render.overflow.scrollLeft;
    }
    if ( y === null ) {
      y = this.render.overflow.scrollTop;
    }
    this.render.overflow.scrollTo( x, y );
  }
}
export { TabJF_Render_Set };
