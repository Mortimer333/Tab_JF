class TabJF_Update_Selection {
  /**
   * Updates start of selection
   * @param  {Number} [letter=this.pos.letter]
   * @param  {Number} [line=this.pos.line]
   * @param  {Number} [index=this.pos.childIndex]
   */
  start (
    letter = this.pos.letter,
    line = this.pos.line,
    index = this.pos.childIndex
  ) {
    const start  = this.selection.start;
    start.letter = letter;
    start.line   = line;
    start.node   = index;
  }

  /**
   * Updates end of selection
   * @param  {Number} [letter=this.pos.letter]
   * @param  {Number} [line=this.pos.line]
   * @param  {Number} [index=this.pos.childIndex]
   */
  end (
    letter = this.pos.letter,
    line = this.pos.line,
    index = this.pos.childIndex
  ) {
    const end  = this.selection.end;
    end.letter = letter;
    end.line   = line;
    end.node   = index;
  }
}
export { TabJF_Update_Selection };
