class TabJF_Render_Update {
  minHeight( lines = this.render.content.length ) {
    lines = lines < this.render.linesLimit ? this.render.linesLimit : lines;
    this.editor.style.setProperty("--min-height", this.settings.line * lines);
  }

  scrollWidth() {
    this.render.maxLineWidth = 0;
    const p = document.createElement('p');
    this.editor.appendChild(p);
    this.render.content.forEach(( line, i ) => {
      this.render.update.scrollWidthWithLine( p, line, i );
    });
    p.remove();
    this.editor.style.setProperty("--scroll-width", this.render.maxLineWidth + this.settings.left );
  }

  scrollWidthWithLine( lineEl, lineContent, lineIndex ) {
    let text = '';
    lineContent.content.forEach( item => {
      text += item.content;
    });
    const width = this.font.calculateWidth( text, lineEl );
    if ( this.render.maxLineWidth < width ) {
      this.render.maxLineWidth = width;
      this.render.maxLine      = lineIndex;
    }
  }

  scrollWidthWithCurrentLine() {
    const line = this.render.content[this.pos.line];
    if (!line) {
      return;
    }
    const lineEl = this.get.lineByPos(this.pos.line);
    // Line not found
    if (!lineEl) return;
    const width = this.render.update.scrollWidthWithLine( lineEl, line, this.pos.line );
    this.editor.style.setProperty("--scroll-width", width + this.settings.left );
  }
}
export { TabJF_Render_Update };
