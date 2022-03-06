class TabJF_Is_Line {
  /**
   * Checks if given line is visible
   * @param  {Number} line Line number
   * @return {Boolean}      
   */
  visible ( line ) {
    return !( line < this.render.hidden || line > this.render.hidden + this.render.linesLimit );
  }
}
export { TabJF_Is_Line };
