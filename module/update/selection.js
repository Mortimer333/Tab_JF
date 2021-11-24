class TabJF_Update_Selection {
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
