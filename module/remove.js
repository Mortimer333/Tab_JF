class TabJF_Remove {
  docEvents () {
    if ( !this.docEventsSet ) return;
    document.removeEventListener('paste'  , this.catchClipboard.bind ? this.catchClipboard.bind(this) : this.catchClipboard, true);
    document.removeEventListener('keydown', this.key.bind            ? this.key           .bind(this) : this.key           , true);
    document.removeEventListener('keyup'  , this.key.bind            ? this.key           .bind(this) : this.key           , true);
    this.docEventsSet = false;
    this.caret.hide();
  }

  selected () {
    let start = this.get.clone( this.selection.start );
    let end   = this.get.clone( this.selection.end   );

    if (
      start.line > end.line
      || ( start.line == end.line && start.node > end.node )
      || ( start.line == end.line && start.node == end.node && start.letter > end.letter )
    ) {
      let tmp = start;
      start   = end;
      end     = tmp;
    }
    const sel = this.get.selection();
    if ( sel.type != 'Range' ) return;

    if ( start.line == end.line ) {
      if ( start.node == end.node ) {
        let content = this.replace.spaceChars(
          this.render.content[ start.line ].content[ start.node ].content
        );
        let pre     = this.replace.spaces( content.substr( 0, start.letter ));
        let suf     = this.replace.spaces( content.substr( end.letter      ));
        this.render.content[ start.line ].content[ start.node ].content = pre + suf;
      } else {

        let startNode = this.render.content[ start.line ].content[ start.node ];
        let endNode   = this.render.content[ end.line   ].content[ end.node   ];

        startNode.content = this.replace.spaces(
          this.replace.spaceChars( startNode.content ).substr( 0, start.letter )
        );
        endNode.content   = this.replace.spaces(
          this.replace.spaceChars( endNode.content   ).substr( end.letter      )
        );

        if ( endNode.content.length == 0 ) end.node++;

        this.render.content[ start.line ].content.splice(
          start.node + 1,
          end.node - (start.node + 1)
        );
      }
    } else {
      let startLine = this.render.content[ start.line ];
      startLine.content = startLine.content.slice( 0, start.node + 1 );
      let startSpan = startLine.content[ start.node ];

      startSpan.content = this.replace.spaceChars( startSpan.content )
                                      .substr( 0, start.letter );
      startSpan.content = this.replace.spaces( startSpan.content );

      let endLine   = this.render.content[ end.line ];
      endLine.content = endLine.content.slice( end.node );
      let endSpan = endLine.content[0];

      endSpan.content = this.replace.spaceChars( endSpan.content )
                                    .substr( end.letter );
      endSpan.content = this.replace.spaces( endSpan.content );

      if ( endSpan.content.length > 0 || endLine.content.length > 0 ) startLine.content = startLine.content.concat( endLine.content );

      this.render.content.splice( start.line + 1, end.line - start.line );
      this.render.update.minHeight();
      this.render.update.scrollWidth();
    }

    this.caret.refocus(
      start.letter,
      start.line,
      start.node,
    );
    this.lastX = this.get.realPos().x;
    this.render.move.page();
    this.end.select();
  }

  word ( dir, childIndex = this.pos.childIndex, c_pos = this.pos.letter ) {
    const text       = this.get.currentSpanContent();
    const spanLength = text.length;
    const letter     = this.pos.letter;
    const line       = this.render.content[this.pos.line];
    let pos = {
      letter     : this.pos.letter,
      childIndex : this.pos.childIndex,
      text : ''
    };

    if (
      letter == 0 && this.pos.childIndex == 0 && dir < 0
      || letter == text.length && this.pos.childIndex == line.content.length - 1 && dir > 0
    ) {
      this.mergeLine( dir );
      return;
    }

    let nextSymbol = '';
    if ( dir < 0 ) {
      if ( letter == 0 ) {
        const previous = this.replace.spaceChars(line.content[ this.pos.childIndex - 1 ].content);
        nextSymbol = previous[previous.length - 1];
      } else {
        nextSymbol = this.replace.spaceChars(text[letter - 1]);
      }

    } else if ( dir > 0 ) {
      if ( letter == text.length ) {
        const next = this.replace.spaceChars(line.content[ this.pos.childIndex + 1 ].content);
        nextSymbol = next[0];
      } else {
        nextSymbol = this.replace.spaceChars(text[letter]);
      }

    }

    if ( this.is.space(nextSymbol) ) {
      this.remove.one(dir);
      return;
    }

    if ( dir < 0 ) {
      for (let i = this.pos.childIndex; i >= 0; i--) {
        const textSpan = this.replace.spaceChars(line.content[i].content);
        let index    = this.get.spaceIndex(textSpan.split("").reverse(), textSpan.length - pos.letter);
        if ( index != -1 ) {
          pos.letter = textSpan.length - index;
          pos.text = textSpan;
          break;
        }
        if ( i != 0 ) {
          pos.childIndex--;
          pos.letter = this.replace.spaceChars(line.content[pos.childIndex].content).length;
        }
      }

      line.content[this.pos.childIndex].content = text.substr(letter);
      line.content.splice(pos.childIndex + 1, this.pos.childIndex - pos.childIndex - 1);
      line.content[pos.childIndex].content = pos.text.substr(0, pos.letter);
      this.pos.childIndex = pos.childIndex;
      this.pos.letter = pos.letter;
      if (line.content[this.pos.childIndex].content.length == 0) {
        this.pos.letter = 0;
      }
    } else if ( dir > 0 ) {
      for (let i = this.pos.childIndex; i < line.content.length; i++) {
        const textSpan = this.replace.spaceChars(line.content[i].content);
        let index    = this.get.spaceIndex(textSpan, pos.letter);
        if ( index != -1 ) {
          pos.letter = index;
          pos.text = textSpan;
          break;
        }
        if ( i + 1 !== line.content.length) {
          pos.childIndex++;
          pos.letter = 0;
        }
      }
      line.content[pos.childIndex].content = pos.text.substr(0, pos.letter + 1);
      line.content.splice(this.pos.childIndex + 1, pos.childIndex - this.pos.childIndex - 1);
      line.content[this.pos.childIndex].content = text.substr(0, this.pos.letter );
    }
    this.caret.refocus();
    this.lastX = this.get.realPos().x;
  }

  one ( dir ) {
    const text       = this.get.currentSpanContent();
    const spanLength = text.length;
    const letter     = this.pos.letter;
    const line       = this.render.content[this.pos.line];

    if (
      letter == 0 && this.pos.childIndex == 0 && dir < 0
      || letter == text.length && this.pos.childIndex == line.content.length - 1 && dir > 0
    ) {
      this.mergeLine( dir );
      return;
    }

    /**
     * Cases:
     * - last letter in span will be deleted
     * - letter pos is 0 and we have to go to the previous one
     * - letter pos is max and we have to go to next one
     * - normal delete one
     */

    if ( dir > 0 ) {
      if ( text.length == 1 && letter == 0 ) {
        if ( line.content.length != 1 ) {
          line.content.splice(this.pos.childIndex, 1);
        } else {
          this.update.currentSpanContent('');
        }
        this.pos.letter = 0;
      } else if ( text.length == letter ) {
        this.pos.childIndex++;
        this.pos.letter = 0;
        this.remove.one( dir );
        return;
      } else {
        const pre = text.substr( 0, letter  );
        const suf = text.substr( letter + 1 );
        this.update.currentSpanContent(pre + suf);
      }
    } else if ( dir < 0 ) {
      if ( text.length == 1 && letter == 1 ) {
        if ( line.content.length != 1 ) {
          line.content.splice(this.pos.childIndex, 1);
        } else {
          this.update.currentSpanContent('');
        }
        if ( this.pos.childIndex == 0 ) {
          this.pos.letter = 0;
        } else {
          this.pos.childIndex--;
          this.pos.letter = this.replace.spaceChars(line.content[this.pos.childIndex].content).length;
        }
      } else if ( letter == 0 ) {
        this.pos.childIndex--;
        this.pos.letter = this.replace.spaceChars(line.content[this.pos.childIndex].content).length;
        this.remove.one( dir );
        return;
      } else {
        const pre = text.substr( 0, letter - 1 );
        const suf = text.substr( letter );
        this.pos.letter--;
        this.update.currentSpanContent(pre + suf);
      }
      this.caret.refocus();
      this.lastX = this.get.realPos().x;
    }
  }
}
export { TabJF_Remove };
