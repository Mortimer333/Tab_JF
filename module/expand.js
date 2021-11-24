class TabJF_Expand {
  select ( stop = false ) {
    this.selection.expanded = true;
    const range            = new Range();

    // I have to do it like this because otherwise selection doesn't appear
    // but this create false data, as when we get selection even if it is reversed
    // the anchor node and focus node are correctly set
    if ( this.selection.reverse ) {
      range.setStart(this.pos.el          .childNodes[0], this.pos.letter      );
      range.setEnd  (this.selection.anchor.childNodes[0], this.selection.offset);
    } else {
      range.setStart(this.selection.anchor.childNodes[0], this.selection.offset);
      range.setEnd  (this.pos.el          .childNodes[0], this.pos.letter      );
    }

    this.get.selection().removeAllRanges();
    this.get.selection().addRange( range );

    if ( stop ) return;
    if ( this.get.selection().isCollapsed && !this.selection.reverse ) {
      this.selection.reverse = true;
      this.expand.select(true);
    } else if ( this.get.selection().isCollapsed && this.selection.reverse ) {
      this.selection.reverse = false;
      this.expand.select(true);
    }
  }
}
