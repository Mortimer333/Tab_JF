/**
 * Class is responsible for all related operations on caret
 */
class TabJF_Caret {
  el       = null;  // Caret node (access by this.caret.el)
  isActive = false; // Variable indicating if caret is active (visible)

  /**
   * Function checks if caret is visible to user
   * @return {Boolean}
   */
  isVisible () {
    return this.caret.isActive
    && (
      this.pos.line >= this.render.hidden
      && this.pos.line <= this.render.hidden + this.render.linesLimit
    );
  }

  /**
   * Scroll to caret on X axis
   */
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

  /**
   * Scroll to caret on Y axis
   */
  scrollToY () {
    const top = this.render.overflow.scrollTop;
    const caretPos = this.caret.getPos();
    if ( this.render.overflow.offsetHeight + top - 10 < caretPos.top ) {
      this.render.move.overflow(
        0,
        caretPos.top - (this.render.overflow.offsetHeight + top - 10),
      );
    } else if ( caretPos.top < top + 10 ) {
      this.render.move.overflow(
        -(top + 10 - caretPos.top),
        0
       );
    }
  }

  /**
   * Set caret position relative to editor
   * @param {Number} x Position on X axis (where [0,0] is editors top-left corner)
   * @param {Number} y Position on Y axis (where [0,0] is editors top-left corner)
   */
  set ( x, y ) {
    this.caret.el.style.left = x + 'px';
    this.caret.el.style.top  = y + 'px' ;
  }

  /**
   * Set caret position on chosen letter
   * @param {Number} letter    Letters index number in text node
   * @param {Number} line      Lines index number
   * @param {Node  } [el=null] Update position el with this node
   */
  setByChar ( letter, line, el = null ) {
    if ( el ) this.pos.el = el;
    let posX = this.font.calculateWidth( this.pos.el.innerText.slice( 0, letter), this.pos.el );
    this.pos.letter = letter;
    this.pos.line   = line  ;
    this.caret.set(
      posX + this.settings.left + this.pos.el.offsetLeft,
      ( line * this.settings.line )
    );
  }

  /**
   * Get caret position
   * @return {Object} { top: 0, left: 0 }
   */
  getPos () {
    return {
      top  : this.caret.el.style.top .replace('px',''),
      left : this.caret.el.style.left.replace('px',''),
    }
  }

  /**
   * Create caret, attach him to passed parent and return
   * @param  {Node} parent Node to which attach caret
   * @return {Node}        Created caret node
   */
  create ( parent ) {
    const caret = document.createElement("div");
    caret.className = 'caret';
    parent.insertBefore( caret, parent.childNodes[0] );
    return caret;
  }

  /**
   * Hide caret
   */
  hide () {
    if ( this.caret.el ) this.caret.el.style.display = "none";
    this.caret.isActive = false;
  }

  /**
   * Show caret
   */
  show () {
    if ( this.caret.el ) this.caret.el.style.display = "block";
    this.caret.isActive  = true;
  }

  /**
   * Move caret into new position
   * @param  {Number} [letter=this.pos.letter        ] Index of letter position
   * @param  {Number} [line=this.pos.line            ] Index of line position
   * @param  {Number} [childIndex=this.pos.childIndex] Index of child node caret should set as his new focused node
   * @return {Boolean}                                 If caret was refocused it returns true, if not false
   */
  refocus ( letter = this.pos.letter, line = this.pos.line, childIndex = this.pos.childIndex ) {
    this.pos.letter     = letter;
    this.pos.line       = line;
    this.pos.childIndex = childIndex;
    // If caret is not visible then just update him
    if ( !this.caret.isVisible() ) return false;

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

  /**
   * Recalculate caret position to be sure its positioned correctly after any changes happend on page.
   * @param  {Boolean} [first=true] Check preventing lowering childIndex to much
   */
  recalculatePos ( first = true ) {
    const line = this.get.lineByPos( this.activated ? this.pos.line : this.render.hidden );
    if (!line) return;

    // If its first iteration then reset letter to lastX and childIndex to 0
    // to properly recalculate position. (lastX holds real position (real amount of letters caret is moved by))
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
    // If current text length is smaller then out caret position find proper caret position
    if ( text.length < this.pos.letter ) {
      // If we are in the last node then it means there was an error. Set caret at the end of line
      if ( this.pos.childIndex == line.children.length - 1 ) {
        this.pos.letter = text.length;
        return;
      }
      // Remove the amount of letters from current node and move to another if you can
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
