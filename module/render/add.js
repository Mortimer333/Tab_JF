class TabJF_Render_Add {
  line ( line, pos ) {
    this.render.content.splice( pos, 0, this.truck.exportLine( line ) );
    this.render.fill  .event    ();
    this.render.update.minHeight();
  }
}
export { TabJF_Render_Add };
