class TabJF_Keys {
  enter ( e ) {
    this.newLine( e );
  }

  backspace ( e ) {
    if ( !this.selection.active ) {
      if ( this.pressed.ctrl ) this.remove.word(-1);
      else                     this.remove.one (-1);
    } else {
      const sel = this.get.selection();
      if ( sel.type != "Range") this.remove.one (-1);
      else                      this.remove.selected();
    }
  }

  tab ( e ) {
    e.preventDefault();
    let tab = '';
    for ( let i = 0; i < 2; i++ ) {
      tab += '&nbsp;';
    }
    this.insert( tab );
  }

  escape ( e ) {
    this.caret.hide();
    this.end.select();
  }

  space ( e ) {
    this.insert('&nbsp;');
  }

  delete ( e ) {
    if ( !this.selection.active ) {
      if ( this.pressed.ctrl ) this.remove.word( 1 );
      else                     this.remove.one ( 1 );
    } else this.remove.selected();
  }

  moveCtrl ( dir, el = this.pos.el, c_pos = this.pos.letter ) {
    let newPos, text = el.innerText;

    // Find closest space considering direction
         if ( dir < 0 ) newPos = text.split("").reverse().indexOf('\u00A0', text.length - c_pos );
    else if ( dir > 0 ) newPos = text.indexOf('\u00A0', c_pos );
    // If closes space is in the same space as caret then just move one in chosen direction
    if ( text.length - newPos === c_pos && dir < 0 ) {
      c_pos--;
    } else if ( newPos === c_pos && dir > 0 ) {
      c_pos++;
    // If space wasn't found then it means we have to check closes nodes
    } else if ( newPos === -1 ) {
      const prev = el.previousSibling, next = el.nextSibling;
      // If direction is inversed and our node has sibling before it then run moveCtrl using
      // that sibling
      if ( dir < 0 && prev ) {
        this.keys.moveCtrl( dir, prev, prev.innerText.length );
        return;
      }

      // Same for forward direction but using sibling after our node
      if ( dir > 0 && next ) {
        this.keys.moveCtrl( dir, next, 0 );
        return;
      }

      // If caret is already on the end of line (no siblings in chosen direction idicates it) then
      // move it to the start or end of next/previous line
      if (
          c_pos == 0
          && this.pos.line > 0
          && dir < 0 // Going left
        ||
          c_pos == text.length && this.pos.line >= 0
          && this.pos.line < this.render.content.length - 1
          && dir > 0 // Going right
      ) {
        if ( dir < 0 ) {
          const line = this.get.lineByPos( this.pos.line - 1 );
          const el   = line.childNodes[ line.childNodes.length - 1 ];
          this.set.side( el, dir * -1, this.pos.line - 1 );
          this.keys.moveCtrl( dir );
          return;
        } else {
          const line = this.get.lineByPos( this.pos.line );
          const el = line.childNodes[0];
          this.set.side( el, dir * -1, this.pos.line + 1 );
          this.keys.moveCtrl( dir );
          return;
        }
      } else {
        // Otherwise set it to side of current node
        this.set.side( el, dir );
      }
      this.pos.childIndex = this.get.childIndex(el);
      this.lastX = this.get.realPos().x;
      return;
    } else {
           if ( dir < 0 ) c_pos = text.length - newPos;
      else if ( dir > 0 ) c_pos = newPos;
    }

    this.set.pos( el, c_pos, this.pos.line );
    this.pos.childIndex = this.get.childIndex( el );
    this.lastX = this.get.realPos().x;
  }

  move ( dirX, dirY, recuresionCheck = false ) {
    if (this.get.selection().type == 'Range') {
      this.caret.refocus(
        this.selection.end.letter,
        this.selection.end.line,
        this.selection.end.node
      );
    }

    const oldLine = this.pos.line;

    if ( this.selection.active && !this.pressed.shift ) {
      if ( this.selection.reverse && !this.selection.expanded && dirX < 0 ) dirX = 0;
      else if ( dirX > 0 ) dirX = 0;
    }

    if ( this.pressed.ctrl && dirX != 0 ) this.keys.moveCtrl( dirX );
    else if ( dirX != 0 ) this.keys.moveX( dirY, dirX );

    if ( dirY != 0 ) this.keys.moveY( dirY, dirX );

    if (
      this.pos.el.innerText.length == 0 &&
      (
        this.pos.el.previousSibling && dirX < 0
        ||
        this.pos.el.nextSibling && dirX > 0
      ) &&
      !recuresionCheck
    ) {
      let temp = this.pos.el;
      this.keys.move(dirX, 0, true);
      temp.remove();
    }

    if ( this.pressed.shift ) {
      this.update.selection.end();
      this.checkSelect();
    } else this.end.select();

  }

  moveX ( dirY, dirX ) {
    let el = this.pos.el, prev = el.previousSibling;
    if ( this.pos.letter + dirX <= -1 ) {
      if ( prev && prev.nodeType == 1 ) {
        this.pos.el = prev;
        this.pos.childIndex--;
        this.pos.letter = prev.innerText.length;
      } else {
        let previousLine = this.get.lineInDirection( el.parentElement, -1 );
        if ( !previousLine ) return;
        this.pos.el         = previousLine.children[ previousLine.children.length - 1 ];
        this.pos.childIndex = previousLine.children.length - 1;
        this.caret.setByChar( this.pos.el.innerText.length, this.pos.line - 1 );
        this.lastX          = this.get.realPos().x;
        this.caret.scrollToX();
        return;
      }

    } else if (
      this.pos.letter + dirX > el.innerText.length
      && el.nextSibling
      && el.nextSibling.nodeType == 1
    ) {
      this.pos.el     = el.nextSibling;
      this.pos.letter = 0;
      this.pos.childIndex++;
    } else if ( this.pos.letter + dirX > el.innerText.length ) {
      let nextLine = this.get.lineInDirection( el.parentElement, 1 );
      if ( !nextLine ) return;
      this.pos.el = nextLine.children[0];
      this.pos.childIndex = 0;
      this.caret.setByChar( 0, this.pos.line + 1 );
      this.lastX = this.get.realPos().x;
      this.caret.scrollToX();
      return;
    }
    this.caret.setByChar( this.pos.letter + dirX, this.pos.line );
    this.lastX = this.get.realPos().x;
    this.caret.scrollToX();
  }

  moveY ( dirY, dirX ) {

    const line = this.pos.line;
    if ( line + dirY <= -1 ) return;
    if ( line + dirY >= this.render.content.length ) return;

    let realLetters = this.get.realPos().x;

    let newLine = this.get.lineInDirection( this.pos.el.parentElement, dirY );
    if ( !newLine ) return;

    if ( newLine.innerText.length < realLetters + dirX ) {
      this.pos.childIndex = newLine.children.length - 1;
      this.pos.line       = line + dirY;
      this.pos.letter     = newLine.innerText.length;
    } else {

      let currentLetterCount = 0;

      for ( let i = 0; i < newLine.children.length; i++ ) {
        let child           = newLine.children[i];
        currentLetterCount += child.innerText.length;
        if ( currentLetterCount >= this.lastX ) {
          this.pos.childIndex = this.get.childIndex(child);
          this.pos.line       = line + dirY;
          this.pos.letter     = this.lastX - (currentLetterCount - child.innerText.length);
          break;
        } else if ( i + 1 == newLine.children.length ) {
          this.pos.childIndex = newLine.children.length - 1;
          this.pos.line       = line + dirY;
          this.pos.letter     = child.innerText.length;
        }
      }
    }

    if (
      dirY > 0
      && this.pos.line + dirY + 3 >= this.render.linesLimit + this.render.hidden
    ) {
      this.render.move.overflow( 0, this.settings.line  );
    } else if ( dirY < 0 && this.pos.line + dirY <= this.render.hidden ) {
      this.render.move.overflow( 0, -this.settings.line );
    }
    this.caret.refocus();
  }
}
export { TabJF_Keys };
