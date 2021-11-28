class TabJF_Render_Fill {
  event ( e = null ) {
    const selection = this.get.selection();
    let top         = this.render.overflow.scrollTop;       // how much was scrolled
    let startLine   = Math.floor(top / this.settings.line); // amount of line hidden - from which index get lines

    // Remove all rendered lines
    for (let i = 0; i < this.render.linesLimit; i++) {
      let line = this.get.lineByPos( this.render.hidden );
      if (!line) {
        break;
      }
      this.render.content[this.render.hidden + i] = this.truck.exportLine(line);
      line.remove();
    }

    this.render.move.page(startLine, false);
    this.checkSelect();
  }
}
export { TabJF_Render_Fill };
