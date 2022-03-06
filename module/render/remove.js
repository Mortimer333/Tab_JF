class TabJF_Render_Remove {
  /**
   * Remove line from render.content and refresh page
   * @param  {Number} pos Line position
   */
  line ( pos ) {
    this.render.content.splice( pos, 1 );
    this.render.fill  .event    ();
    this.render.update.minHeight();
  }
}
export { TabJF_Render_Remove };
