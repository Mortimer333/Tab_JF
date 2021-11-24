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
          end.node - 1
        );
      }
    } else {
      let startLine = this.render.content[ start.line ];
      startLine.content = startLine.content.slice( 0, start.node + 1 );
      let startSpan = startLine.content[ start.node ];
      startSpan.content = startSpan.content.replaceAll('&nbsp;', ' ')
                                            .substr( 0, start.letter )
                                            .replaceAll(' ', '&nbsp;');
      let endLine   = this.render.content[ end.line ];
      endLine.content = endLine.content.slice( end.node );
      let endSpan = endLine.content[0];
      endSpan.content = endSpan.content.replaceAll('&nbsp;', ' ')
                                       .substr( end.letter )
                                       .replaceAll(' ', '&nbsp;');
      if ( endSpan.content.length > 0 )
        startLine.content = startLine.content.concat( endLine.content );
      this.render.content.splice( start.line + 1, end.line - start.line );
      this.render.update.minHeight();
      this.render.update.scrollWidth();
    }

    this.caret.refocus(
      start.letter,
      start.line,
      start.node,
    );
    this.render.move.page();
    this.end.select();
  }

  selectedRecursive ( previous, stopNode, removeLine = false, isPrevious = false ) {
    // previous is anchor node, and we want to work on its previous sibling
    let node = previous.previousSibling;

    if ( isPrevious       ) node = previous;
    if ( node == stopNode ) return;

    if ( node == null ) {
      let line         = this.get.line( previous );
      let previousLine = this.get.lineInDirection( line, -1 );
      this.remove.selectedRecursive(
        previousLine.children[ previousLine.children.length - 1],
        stopNode,
        true,
        true,
      );
      if ( removeLine ) line.remove();
      return;
    }
    this.remove.selectedRecursive( node, stopNode, removeLine );
    node.remove();
  }

  validateMergeLineOnRemoveWord ( dir, el, c_pos ) {
    return
      ( el.innerText.length == 0 && !el.nextSibling )
      || ( dir < 0 && c_pos == 0 )
      || (
        dir > 0 && c_pos == el.innerText.length
        && el.parentElement.children[ el.parentElement.children.length - 1 ] == el
      );
  }

  word ( dir, el = this.pos.el, c_pos = this.pos.letter ) {
    if ( this.remove.validateMergeLineOnRemoveWord( dir, el, c_pos ) ) {
      this.mergeLine( dir );
      return;
    }

    let pre, suf, newPos, text = el.innerText;

         if ( dir < 0 ) newPos = text.split("").reverse().indexOf('\u00A0', text.length - c_pos);
    else if ( dir > 0 ) newPos = text.indexOf('\u00A0', c_pos);

    if ( text.length - newPos === c_pos && dir < 0   ||   newPos === c_pos && dir > 0) {
      this.remove.one( dir );
      return;
    } else if ( newPos === -1 ) {
      const prev = el.previousSibling;
      const next = el.nextSibling;
      if ( dir < 0 && prev ) {
        this.remove.word( dir, prev, prev.innerText.length );
      } else if ( dir > 0 && next ) {
        this.remove.word( dir, next, 0 );
      }

      if ( dir < 0 ) newPos = 0;
      if ( dir > 0 ) newPos = text.length;

    } else if ( dir < 0 ) newPos = text.length - newPos;

    if ( dir < 0 ) {
      pre = text.substr( 0, newPos );
      suf = text.substr( c_pos     );
    } else {
      pre = text.substr( 0, c_pos );
      suf = text.substr( newPos   );
    }
    el.innerHTML = pre + suf;

    if ( dir < 0 ) this.set.pos( el, newPos, this.pos.line );
  }

  one ( dir ) {
    const pos  = this.pos,
          next = pos.el.nextSibling,
          prev = pos.el.previousSibling;

    let pre, suf, text = pos.el.innerText;

    if ( text.length == 0 ) {
      this.remove.oneInSibling( pos.el, dir );
      return;
    }

    if ( text.length == 1 ) {
      let res = this.remove.posElWithOnlyOneChar( dir );
      if ( res ) return;
    }

    if ( dir > 0 ) {
      if ( pos.letter >= text.length ) {
        this.remove.oneInSibling( next, dir );
        return;
      }

      pre = text.substr( 0, pos.letter  );
      suf = text.substr( pos.letter + 1 );
    } else {
      if ( pos.letter - 1 < 0 ) {
        this.remove.oneInSibling( prev, dir );
        return;
      }

      pre = text.substr( 0, pos.letter - 1 );
      suf = text.substr( pos.letter        );

      this.caret.setByChar( pos.letter - 1, pos.line );
    }
    pos.el.innerHTML = pre + suf;
  }

  oneInSibling ( node, dir ) {
    if ( node == null ) {
      this.mergeLine( dir ); // If node is null merge next line
      return;
    }

    if ( node.innerText.length == 1 ) {
      let res = this.remove.posElWithOnlyOneChar( dir );
      if ( res ) return;
    }

    if ( node.nodeType != 1   ||   node.innerText.length == 0 ) {
      let sibling = this.get.sibling(node, dir);
      this.remove.oneInSibling(sibling, dir);
      return;
    }

    this.keys  .move( dir, 0   );
    this.remove.one ( dir * -1 );
  }

  posElWithOnlyOneChar ( dir ) {
    if ( this.pos.letter == 0 && dir > 0   ||   this.pos.letter == 1 && dir < 0 ) {
      const el = this.pos.el;
      let sibling = this.get.sibling( el, dir );
      if ( sibling === null ) {
        dir *= -1;
        sibling = this.get.sibling( el, dir );

        if ( sibling === null ) {
          const span = document.createElement("span");
          const text = document.createTextNode('');
          span.appendChild( text );
          this.pos.el.parentElement.insertBefore( span, el );
          sibling = span;
        }

      }

      el.remove();
      this.set.side( sibling, dir * -1 );
      return true;
    }
    return false;
  }
}
