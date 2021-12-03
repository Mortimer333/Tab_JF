class TabJF_Get {
  clone ( obj ) {
    return JSON.parse(JSON.stringify( obj ));
  }

  clonedPos () {
    const pos = Object.assign({}, this.pos);
    pos.el = this.pos.el;
    return pos;
  }

  myself () {
    return this;
  }

  selectedLines ( sLine = null, eLine = null ) {
    if ( !sLine || !eLine ) {
      const sel = this.get.selection(), revCheck = this.selection.reverse && !this.selection.expanded;
      sLine = this.get.line( revCheck ? sel.focusNode : sel.anchorNode );
      eLine = this.get.line( revCheck ? sel.anchorNode : sel.focusNode );
    }

    if ( !sLine || !eLine ) throw new Error('Couldn\'t find lines');

    return [
      sLine.cloneNode(true),
      ...this.get.selectedLinesRecursive( sLine.nextSibling, eLine )
    ];
  }

  selectedLinesRecursive ( node, end ) {
    if ( node === null         ) throw new Error('The node doesn\'t exist in this parent');
    if ( node == end           ) return [ node.cloneNode(true) ];
    if ( node.nodeName !== "P" ) return this.get.selectedLinesRecursive( node.nextSibling, end );
    return [ node.cloneNode(true), ...this.get.selectedLinesRecursive( node.nextSibling, end ) ];
  }

  selectedNodes () {
    let start = this.get.clone( this.selection.start );
    let end   = this.get.clone( this.selection.end   );
    if (
      start.line > end.line
      || (start.line == end.line && start.node > end.node)
      || (start.line == end.line && start.node == end.node && start.letter > end.letter)
    ) {
      let tmp = start;
      start   = end;
      end     = tmp;
    }
    const sel = this.get.selection();
    if ( sel.type != 'Range') return;

    if ( start.line == end.line ) {
      const line = this.get.clone( this.render.content[ start.line ] );
      if ( start.node == end.node ) {
        let content = this.replace.spaceChars( line.content[ start.node ].content );
        let text    = this.replace.spaces( content.substr( start.letter, end.letter - start.letter ) );
        line.content[ start.node ].content = text;
        return [ line ];
      } else {
        let startNode = line.content[ start.node ];
        let endNode   = line.content[ end.node   ];
        startNode.content = this.replace.spaces(
          this.replace.spaceChars( startNode.content ).substr( start.letter )
        );
        endNode.content   = this.replace.spaces(
          this.replace.spaceChars( endNode.content   ).substr( 0, end.letter )
        );
        line.content = [ startNode ].concat(
          line.content.slice( start.node + 1, end.node + 1 )
        );
        return [ line ];
      }
    }
    let linesBetween = this.render.content.slice( start.line + 1, end.line );
    let startLine    = this.get.clone( this.render.content[ start.line ]);
    let endLine      = this.get.clone( this.render.content[ end.line   ]);
    endLine.content = endLine.content.slice( 0, end.node + 1 );
    let endSpan = endLine.content[ endLine.content.length - 1 ];

    endSpan.content = endSpan.content.replaceAll('&nbsp;', ' ');
    endSpan.content = endSpan.content.substr( 0, end.letter );
    endSpan.content = endSpan.content.replaceAll(' ', '&nbsp;');

    startLine.content = startLine.content.slice( start.node );
    let startNode = startLine.content[0];
    startNode.content = startNode.content.replaceAll('&nbsp;', ' ');
    startNode.content = startNode.content.substr( start.letter );
    startNode.content = startNode.content.replaceAll(' ', '&nbsp;');
    return [ startLine ].concat( linesBetween, [ endLine ] );
  }

  elPos ( el ) {
    for ( let i = 0; i < el.parentElement.children.length; i++ ) {
      if ( el.parentElement.children[i] == el ) return i;
    }
    return false;
  }

  linePos ( line ) {
    let linePos = 0;
    for ( let i = 0; i < this.editor.children.length; i++ ) {
      let child = this.editor.children[i];
      if ( line == child ) return linePos;
      // we only increase if there was actual line in editor between our target
      if (child.nodeName && child.nodeName == "P") linePos++;
    }
    return false;
  }

  selection () {
    return window.getSelection ? window.getSelection() : document.selection;
  }

  realPos () {
    const children = Object.values( this.pos.el.parentElement.children );
    let letters = 0;
    for ( let i = 0; i < children.length; i++ ) {
      if ( this.pos.el == children[i] ) break;
      letters += children[i].innerText.length;
    }
    letters += this.pos.letter;

    return {
      x : letters,
      y : this.pos.line
    }
  }

  line ( el ) {
    if ( el.parentElement == this.editor ) return el;
    return this.get.line( el.parentElement );
  }

  lineByPos ( pos ) {
    pos -= this.render.hidden;
    if (pos >= 0) {
      let linePos = -1;
      for (var i = 0; i < this.editor.children.length; i++) {
        let line = this.editor.children[i];
        if ( line.nodeName == "P") linePos++;
        if ( linePos == pos      ) return line;
      }
    } else {
      let linePos = 0;
      for (var i = this.editor.children.length - 1; i > -1 ; i--) {
        let line = this.editor.children[i];
        if ( line.nodeName == "P") linePos++;
        if ( linePos == pos * -1 ) return line;
      }
    }
    return false;
  }

  lineInDirection ( line, dir, first = true ) {

    if ( first  && line?.nodeName != "P" ) throw new Error("Parent has wrong tag, can't find proper lines");
    if ( !first && line?.nodeName == "P" ) return line;

    let newLine;
    if ( line === null ) return line;

         if ( dir < 0 ) newLine = line.previousSibling;
    else if ( dir > 0 ) newLine = line.nextSibling;

    if ( newLine === null ) return newLine;
    if ( newLine.nodeType != 1 ) {
      let newNewLine; // xd
           if ( dir < 0 ) newNewLine = newLine.previousSibling;
      else if ( dir > 0 ) newNewLine = newLine.nextSibling;
      newLine.remove(); // there shouldn't be any text there
      return this.get.lineInDirection( newNewLine, dir, false );
    }

    if ( newLine.nodeName != "P" ) return this.get.lineInDirection( newLine, dir, false );
    if ( dir == -1   ||   dir == 1   ) return newLine;
    return this.get.lineInDirection( newLine, dir < 0 ? dir + 1 : dir - 1, true );
  }

  sibling ( node, dir ) {
         if ( dir > 0 ) return node.nextSibling;
    else if ( dir < 0 ) return node.previousSibling;
  }

  childIndex ( el ) {
    for (var i = 0; i < el.parentElement.childNodes.length; i++) {
      if ( el.parentElement.childNodes[i] == el ) return i;
    }
    return false;
  }

  attributes(el) {
    const attrsObj = [];
    for ( let att, i = 0, atts = el.attributes, n = atts.length; i < n; i++ ){
      att = atts[i];
      attrsObj.push({
        nodeName  : att.nodeName,
        nodeValue : att.nodeValue,
      });
    }
    return attrsObj;
  }

  splitNode() {
    let text = this.pos.el.innerText;
    return {
      pre : this.set.attributes( this.pos.el.attributes, text.substr( 0, this.pos.letter ) ),
      suf : this.set.attributes( this.pos.el.attributes, text.substr( this.pos.letter    ) )
    }
  }

  splitRow() {
    let local = this.get.splitNode();
    let nodes = this.get.nextSiblignAndRemove( this.pos.el.nextSibling );
    local.suf = [ local.suf, ...nodes ];
    return local;
  }

  nextSiblignAndRemove( el ) {
    if ( el === null ) return [];
    let nodes = [];

    let span = this.set.attributes( el.attributes, el.innerText );
    nodes.push( span );
    if ( el.nextSibling ) {
      let nextSpan = this.get.nextSiblignAndRemove( el.nextSibling );
      nodes = nodes.concat( nextSpan );
    }

    el.remove();
    return nodes;
  }

  sentence( line ) {
    let words = '';
    line.content.forEach( span => {
      words += span.content;
    });
    return this.replace.spaceChars(words);
  }

  words( sentence ) {

    let word = '';
    words = [];
    let spaces = false;

    if ( this.is.space( sentence[0] ) ) spaces = true;

    for (let i = 0; i < sentence.length; i++) {
      const letter  = sentence[i];
      const isSpace = this.is.space(letter);

      if ( isSpace && spaces == false || !isSpace && spaces == true ) {
        words.push(word);
        word = letter;
      } else word += letter;

      if ( isSpace ) spaces = true;
      else           spaces = false;
    }
    words.push( word );
    return words;
  }
}
export { TabJF_Get };
