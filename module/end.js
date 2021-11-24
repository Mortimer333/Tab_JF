class TabJF_End {
    select () {
      this.get.selection().empty();
      const sel    = this.selection;
      sel.anchor   = null;
      sel.offset   = -1;
      sel.line     = -1;
      sel.reverse  = false;
      sel.active   = false;
      sel.expanded = false;
      this.pressed.shift = false; // forcing the state, might not be the same as in real world
      this.update.selection.start();
      sel.end = { line : -1, letter : -1, node : -1 };
    }
}
