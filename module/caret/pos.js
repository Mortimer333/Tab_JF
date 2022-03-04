class TabJF_Caret_Pos {
  toY ( pos ) {
    return (
      Math.floor(
        ( pos ) / this.settings.line
      ) * this.settings.line
    )
  }
}
export { TabJF_Caret_Pos };
