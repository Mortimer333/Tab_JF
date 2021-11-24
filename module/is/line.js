class TabJF_Is_Line {
  visible ( line ) {
    return !( line < this.render.hidden || line > this.render.hidden + this.render.linesLimit );
  }
}
