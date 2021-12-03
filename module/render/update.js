class TabJF_Render_Update {
  minHeight ( lines = this.render.content.length ) {
    lines = lines < this.render.linesLimit ? this.render.linesLimit : lines;
    this.editor.style.setProperty("--min-height", this.settings.line * lines);
  }

  scrollWidth () {
    this.render.maxLineWidth = 0;
    this.render.content.forEach( line => {
      let text = '';
      line.content.forEach( item => {
        text += item.content;
      });

      const width = this.font.calculateWidth( text );
      if ( this.render.maxLineWidth < width ) this.render.maxLineWidth = width;
    });
    this.editor.style.setProperty("--scroll-width", this.render.maxLineWidth + this.settings.left );
  }

  spaceWidth() {
    const width = this.font.calculateWidth('\u00A0');
    this.editor.style.setProperty("--space-width", width );
  }
}
export { TabJF_Render_Update };
