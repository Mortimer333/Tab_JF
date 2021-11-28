class TabJF_Caret_Pos {
  toY ( pos ) {
    return (
      Math.floor(
        ( pos - this.settings.top ) / this.settings.line
      ) * this.settings.line
    ) + this.settings.top
  }
}
export { TabJF_Caret_Pos };
