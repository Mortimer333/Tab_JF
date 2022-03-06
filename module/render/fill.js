class TabJF_Render_Fill {
  /**
   * Fill editor event.
   * Its requested every time overflow is scrolled and is updating contents of editor
   * @param  {Object} [e=null] Scroll event
   */
  event ( e = null ) {
    try {
      const selection = this.get.selection();
      let top         = this.render.overflow.scrollTop;       // how much was scrolled
      let startLine   = Math.floor(top / this.settings.line); // amount of line hidden - from which index get lines
      this.render.move.page({ offset : startLine, clear : false, refocus : false });
    } catch (e) {
      // somtimes we can't caught up with the speed of scroll, then we have some error from setting cursor on
      // not existing line, we can omit it by just updating page and again setting cursor
    } finally {
      this.update.page()
    }

  }
}
export { TabJF_Render_Fill };
