class TabJF_Render_Remove {
  line ( pos ) {
    this.render.content.splice( pos, 1 );
    this.render.fill  .event    ();
    this.render.update.minHeight();
  }
}
