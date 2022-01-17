class TabJF_Set {
  docEvents () {
    if ( this.docEventsSet ) return;
    document.addEventListener('paste'  , this.catchClipboard.bind ? this.catchClipboard.bind(this) : this.catchClipboard, true);
    document.addEventListener('keydown', this.key.bind            ? this.key           .bind(this) : this.key           , true);
    document.addEventListener('keyup'  , this.key.bind            ? this.key           .bind(this) : this.key           , true);
    this.docEventsSet = true;
  }

  preciseMethodsProxy ( scope, path ) {
    if (path.length == 1)
      scope[ path[0] ] = new Proxy( scope[ path[0] ], this._proxySaveHandle );
    else {
      this.set.preciseMethodsProxy( scope[ path[0] ], path.slice(1) );
    }
  }

  methodsProxy ( object, keys ) {
    for (var i = 0; i < keys.length; i++) {
      let propertyName = keys[i];
      const type = typeof object[ propertyName ];
      if ( type == 'function') {
        if ( object[ propertyName ] == this.set.methodsProxy )  continue;
        object[ propertyName ] = new Proxy( object[ propertyName ], this._proxyHandle );
      } else if ( type == 'object' && object[ propertyName ] !== null && propertyName[0] != '_' ) {
        this.set.methodsProxy( object[ propertyName ], Object.keys( object[ propertyName ] ) );
      }
    };
  }

  side ( node, dirX, newLine = this.pos.line, childIndex = this.pos.childIndex ) {
    let letter = this.pos.letter;
    this.pos.childIndex = childIndex;
    this.pos.el = node;
         if ( dirX > 0 ) letter = node.innerText.length;
    else if ( dirX < 0 ) letter = 0;
    this.caret.setByChar( letter, newLine );
  }

  pos ( node, letter, line, childIndex ) {
    this.pos.childIndex = childIndex;
    this.pos.letter = letter;
    this.pos.line   = line;
    this.caret.setByChar( letter, line, node );
  }

  attributes(attributes, text) {
    let newSpan = document.createElement("span");
    for ( let att, i = 0, atts = attributes, n = atts.length; i < n; i++ ){
      att = atts[i];
      newSpan.setAttribute( att.nodeName, att.nodeValue );
    }
    newSpan.innerHTML = text;
    return newSpan;
  }

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
