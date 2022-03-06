class TabJF_Set {
  /**
   * Setup all events on document or window
   */
  docEvents () {
    if ( this.docEventsSet ) return;
    document.addEventListener('paste'  , this.catchClipboard       .bind(this));
    document.addEventListener('keydown', this.key                  .bind(this));
    document.addEventListener('keyup'  , this.key                  .bind(this));
    window  .addEventListener('resize' , this.update.resizeDebounce.bind(this));
    this.docEventsSet = true;
  }

  /**
   * Find method and set VC proxy on her
   * @param  {Object  } scope Current scope to which path led
   * @param  {String[]} path  Path to method
   */
  preciseMethodsProxy ( scope, path ) {
    if (path.length == 1)
      scope[ path[0] ] = new Proxy( scope[ path[0] ], this._proxySaveHandle );
    else {
      this.set.preciseMethodsProxy( scope[ path[0] ], path.slice(1) );
    }
  }

  /**
   * Move caret to side of passed node
   * @param  {Node  } node
   * @param  {Number} dirX                             -1 go left, 1 go right
   * @param  {Number} [newLine=this.pos.line         ] New line position
   * @param  {Number} [childIndex=this.pos.childIndex] New child index
   */
  side ( node, dirX, newLine = this.pos.line, childIndex = this.pos.childIndex ) {
    let letter = this.pos.letter;
    this.pos.childIndex = childIndex;
    this.pos.el = node;
         if ( dirX > 0 ) letter = node.innerText.length;
    else if ( dirX < 0 ) letter = 0;
    this.caret.setByChar( letter, newLine );
  }

  /**
   * Set caret position and update it on page
   * @param  {Node} node
   * @param  {Number} letter
   * @param  {Number} line
   * @param  {Number} childIndex
   */
  pos ( node, letter, line, childIndex ) {
    this.pos.childIndex = childIndex;
    this.pos.letter = letter;
    this.pos.line   = line;
    this.caret.setByChar( letter, line, node );
  }

  /**
   * Creates span and sets attrbiutes and text in it
   * @param  {Object[]} attributes [{nodeName: "style", nodeValue: "color:#FFF"}]
   * @param  {String  } text
   * @return {Node    }            Created span
   */
  attributes(attributes, text) {
    let newSpan = document.createElement("span");
    for ( let att, i = 0, atts = attributes, n = atts.length; i < n; i++ ){
      att = atts[i];
      newSpan.setAttribute( att.nodeName, att.nodeValue );
    }
    newSpan.innerHTML = text;
    return newSpan;
  }

  /**
   * Creates span and sets attributes in a way they are described in render content
   * @param  {Object} attributes {style: "color:#FFF"}
   * @param  {String} text
   * @return {Node  }            Span
   */
  attributesFromContent(attributes, text) {
    if (!attributes) {
      return;
    }
    let newSpan = document.createElement("span");
    Object.keys(attributes).forEach( name => {
      newSpan.setAttribute( name, attributes[name] );
    });
    newSpan.innerHTML = text;
    return newSpan;
  }
}
export { TabJF_Set };
