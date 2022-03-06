class TabJF_Render_Update {
  /**
   * Update min height used for setting height of editor
   * @param  {Number} [lines=this.render.content.length] Amount of lines
   */
  minHeight( lines = this.render.content.length ) {
    lines = lines < this.render.linesLimit ? this.render.linesLimit : lines;
    this.editor.style.setProperty("--min-height", this.settings.line * lines);
  }

  /**
   * Updates the width of editor to longest line
   */
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

  /**
   * Iterates over lines content, adds it into one big sentence and then calculates its width.
   * Then checks if maxLineWidth is smaller then calculated width and if so replaces it.
   * @param  {Node  } lineEl      Line node
   * @param  {Object} lineContent Line render content
   * @param  {Number} lineIndex   Line position
   */
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

  /**
   * Checks if current line is bigger then set --scroll-width
   */
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
