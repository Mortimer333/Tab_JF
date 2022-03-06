class TabJF_Keys {
  /**
   * Creates new line
   * @param  {Object|null} [e=null] Keydown event
   */
  enter ( e = null ) {
    this.newLine( e );
  }

  /**
   * Call center for backspace action. It checks selection and if control is pressed
   * @param  {Object|null} [e=null] Keydown event
   */
  backspace ( e = null ) {
    if ( !this.selection.active ) {
      if ( this.pressed.ctrl ) this.remove.word(-1);
      else                     this.remove.one (-1);
    } else {
      const sel = this.get.selection();
      if ( sel.type != "Range") this.remove.one (-1);
      else                      this.remove.selected();
    }
  }

  /**
   * Creates equivalent of tab by adding spaces equal to `tabWidth` attribute
   * @param  {Object|null} [e=null] Keydown event
   */
  tab ( e = null ) {
    e.preventDefault();
    let tab = '';
    for ( let i = 0; i < this.tabWidth; i++ ) {
      tab += '&nbsp;';
    }
    this.insert( tab );
  }

  /**
   * On escape remove selection (but don't delete nodes)
   * @param  {Object|null} [e=null] Keydown event
   */
  escape ( e = null ) {
    this.end.select();
  }

  /**
   * Insert space
   * @param  {Object|null} [e=null] Keydown event
   */
  space ( e = null ) {
    this.insert('&nbsp;');
  }

  /**
   * Delete ket action based on selection and if control was pressed
   * @param  {Object|null} [e=null] Keydown event
   */
  delete ( e = null ) {
    if ( !this.selection.active ) {
      if ( this.pressed.ctrl ) this.remove.word( 1 );
      else                     this.remove.one ( 1 );
    } else {
     const sel = this.get.selection();
     if ( sel.type != "Range") this.remove.one (1);
     else                      this.remove.selected();
   }
  }

  /**
   * Move caret to closest space. It works when control is pressed.
   * @param  {Number} dir                     Direction in which to search for space
   * @param  {Node  } [el=this.pos.el       ] Element to search in
   * @param  {Number} [c_pos=this.pos.letter] Start index
   */
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

    this.set.pos( el, c_pos, this.pos.line, this.get.childIndex( el ) );
    this.lastX = this.get.realPos().x;
  }

  /**
   * Move caret in chosen direction
   * @param  {Number}  dirX                   1 go right, -1 go left
   * @param  {Number}  dirY                   1 go down, -1 go up
   * @param  {Boolean} [recursionCheck=false] Prevents recursion error
   */
  move ( dirX, dirY, recursionCheck = false ) {
    // Remove selection and move caret tot he end of it
    if (this.get.selection().type == 'Range') {
      this.caret.refocus(
        this.selection.end.letter,
        this.selection.end.line,
        this.selection.end.node
      );
    }

    const oldLine = this.pos.line;
    // If selection was active don't actually move cursor on X axis, it makes it look like an error it
    if ( this.selection.active && !this.pressed.shift ) {
      if ( this.selection.reverse && !this.selection.expanded && dirX < 0 ) dirX = 0;
      else if ( dirX > 0 ) dirX = 0;
    }

    // Call center for X axis
    if ( this.pressed.ctrl && dirX != 0 ) this.keys.moveCtrl( dirX );
    else if ( dirX != 0 ) this.keys.moveX( dirY, dirX );

    // Call center for Y axis
    if ( dirY != 0 ) this.keys.moveY( dirY, dirX );

    // If current element was empty move to another and remove it if it wasn't the last node inside of line
    if (
      this.pos.el.innerText.length == 0
      && (
        this.pos.el.previousSibling && dirX < 0
        || this.pos.el.nextSibling && dirX > 0
      )
      && !recursionCheck
    ) {
      let temp = this.pos.el;
      this.keys.move(dirX, 0, true);
      temp.remove();
    }

    // If shift is pressed aside moving caret extend selection with it
    if ( this.pressed.shift ) {
      this.update.selection.end();
      this.checkSelect();
    } else this.end.select();

  }

  /**
   * Move caret on X axis
   * @param  {Number} dirY [NOT USED] Direction where caret will go on Y axis (might be useful later)
   * @param  {Number} dirX 1 go right, -1 go left
   */
  moveX ( dirY, dirX ) {
    let el = this.pos.el, prev = el.previousSibling;

    if ( this.pos.letter + dirX <= -1 ) {   // Check if we have to go another node because we are at last letter
      if ( prev && prev.nodeType == 1 ) {   // Go to another node
        this.pos.el = prev;
        this.pos.childIndex--;
        this.pos.letter = prev.innerText.length;
      } else {                              // Go to another line
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

  /**
   * Move caret on Y axis
   * @param  {Number} dirY 1 go down, -1 go up
   * @param  {Number} dirX [NOT USED] Direction where caret will go on X axis (might be useful later)
   */
  moveY ( dirY, dirX ) {
    const line = this.pos.line;
    // Check if there are lines to go to
    if ( line + dirY <= -1 ) return;
    if ( line + dirY >= this.render.content.length ) return;
    // Get line
    let realLetters = this.get.realPos().x;
    this.pos.line   = line + dirY;
    let newLine = this.get.lineByPos( line + dirY );
    if ( !newLine ) return;
    // If there is not enough letter in next line to set caret in the same place on X axis then move it to the end of line
    if ( newLine.innerText.length < realLetters + dirX ) {
      this.pos.childIndex = newLine.children.length - 1;
      this.pos.letter     = newLine.children[this.pos.childIndex].innerText.length;
    } else {

      let currentLetterCount = 0;
      // Find node on which we can set caret on X axis so it will be in the same place as before
      for ( let i = 0; i < newLine.children.length; i++ ) {
        let child           = newLine.children[i];
        currentLetterCount += child.innerText.length;
        if ( currentLetterCount >= this.lastX ) {
          this.pos.childIndex = this.get.childIndex(child);
          this.pos.letter     = this.lastX - (currentLetterCount - child.innerText.length);
          break;
        } else if ( i + 1 == newLine.children.length ) {
          this.pos.childIndex = newLine.children.length - 1;
          this.pos.letter     = child.innerText.length;
        }
      }
    }
    // Move page so cursor is still visible
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
