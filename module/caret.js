class TabJF_Caret {
  el       = null;
  isActive = false;

  isVisible () {
    return this.caret.isActive
    && (
      this.pos.line >= this.render.hidden
      && this.pos.line <= this.render.hidden + this.render.linesLimit
    );
  }

  scrollToX () {
    const left = this.render.overflow.scrollLeft;
    const caretPos = this.caret.getPos();
    if ( this.render.overflow.offsetWidth + left - 10 - this.settings.left < caretPos.left ) {
      this.render.move.overflow(
        caretPos.left - (this.render.overflow.offsetWidth + left - 10 - this.settings.left),
        0
      );
    } else if ( caretPos.left < left + 10 + this.settings.left ) {
      this.render.move.overflow(
        -(left + 10  + this.settings.left - caretPos.left),
        0
       );
    }
  }

  scrollToY () {
    const top = this.render.overflow.scrollTop;
    const caretPos = this.caret.getPos();
    if ( this.render.overflow.offsetHeight + top - 10 - this.settings.top < caretPos.top ) {
      this.render.move.overflow(
        0,
        caretPos.top - (this.render.overflow.offsetHeight + top - 10 - this.settings.top),
      );
    } else if ( caretPos.top < top + 10 + this.settings.top ) {
      this.render.move.overflow(
        -(top + 10  + this.settings.top - caretPos.top),
        0
       );
    }
  }

  set ( x, y ) {
    this.caret.el.style.left = x + 'px';
    this.caret.el.style.top  = y + 'px' ;
  }

  setByChar ( letter, line, el = null ) {
    if ( el ) this.pos.el = el;
    let posX = this.font.calculateWidth( this.pos.el.innerText.slice( 0, letter), this.pos.el );
    this.pos.letter = letter;
    this.pos.line   = line  ;

    this.caret.set(
      posX + this.settings.left + this.pos.el.offsetLeft,
      ( line * this.settings.line ) + this.settings.top
    );
  }

  getPos () {
    return {
      top  : this.caret.el.style.top .replace('px',''),
      left : this.caret.el.style.left.replace('px',''),
    }
  }

  create ( parent ) {
    const caret = document.createElement("div");
    caret.className = 'caret';
    parent.insertBefore( caret, parent.childNodes[0] );
    return caret;
  }

  hide () {
    if ( this.caret.el ) this.caret.el.style.display = "none";
    this.caret.isActive = false;
  }

  show () {
    if ( this.caret.el ) this.caret.el.style.display = "block";
    this.caret.isActive  = true;
  }

  refocus ( letter = this.pos.letter, line = this.pos.line, childIndex = this.pos.childIndex ) {
    this.pos.letter     = letter;
    this.pos.line       = line;
    this.pos.childIndex = childIndex;
    if ( !this.caret.isVisible() ) return;

    line = this.get.lineByPos( this.pos.line );
    if (
      this.pos.line <= this.render.hidden + this.render.linesLimit
      && this.pos.line >= this.render.hidden
      && line
    ) {
      this.pos.el = line.childNodes[ childIndex ];
      this.caret.setByChar(
        this.pos.letter,
        this.pos.line,
        line.childNodes[ this.pos.childIndex ]
      );
      return true;
    }
    return false;
  }

  recalculatePos ( first = true ) {
    const line = this.get.lineByPos( this.activated ? this.pos.line : this.render.hidden );
    if (!line) return;

    // If its first iteration then reset letter to lastX and childIndex to 0
    // to properly recalculate position
    if ( first ) {
      this.pos.letter     = this.lastX;
      this.pos.childIndex = 0;
    }

    // if child was not found then it means that more then one element was
    // deleted/merged so we have to lower childIndex by one. It should not
    // be possible for more then 2 elements to disappear at once
    if (!line.children[this.pos.childIndex] && first) {
      this.pos.childIndex--;
    }
    this.pos.el = line.children[this.pos.childIndex];

    const text = this.pos.el.innerText;
    if ( text.length < this.pos.letter ) {
      if ( this.pos.childIndex == line.children.length - 1 ) {
        this.pos.letter = text.length;
        return;
      }

      this.pos.letter -= text.length;
      if ( this.pos.childIndex < line.children.length - 1 ) {
        this.pos.childIndex++;
      }

      this.caret.recalculatePos( false );
      return;
    }
  }
}
export { TabJF_Caret };
