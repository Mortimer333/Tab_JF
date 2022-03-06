class TabJF_Get {
  /**
   * Creates clone of passed object. Doesn't clone functions
   * @param  {Object} obj Object to clone
   * @return {Object}     Cloned object
   */
  clone ( obj ) {
    return JSON.parse(JSON.stringify( obj ));
  }

  /**
   * Clone position attribute (used for Unit tests)
   * @return {Object} Cloned position of caret
   */
  clonedPos () {
    const pos = Object.assign({}, this.pos);
    pos.el = this.pos.el;
    return pos;
  }

  /**
   * Returns main class
   * @return {Object} Main class
   */
  myself () {
    return this;
  }

  /**
   * Returns all visible lines
   * @return {Object} Visible lines in render content form
   */
  visibleLines() {
    return this.render.content.slice(this.render.hidden, this.render.hidden + this.render.linesLimit);
  }

  /**
   * Returns all selected lines (cloned)
   * @param  {Node|null} [sLine=null] Node line start
   * @param  {Node|null} [eLine=null] Node line end
   * @return {Node[]   }              Selected nodes
   */
  selectedNodes ( sLine = null, eLine = null ) {
    if ( !sLine || !eLine ) {
      const sel = this.get.selection(), revCheck = this.selection.reverse && !this.selection.expanded;
      sLine = this.get.line( revCheck ? sel.focusNode : sel.anchorNode );
      eLine = this.get.line( revCheck ? sel.anchorNode : sel.focusNode );
    }

    if ( !sLine || !eLine ) throw new Error('Couldn\'t find lines');

    return [
      sLine.cloneNode(true),
      ...this.get.selectedNodesRecursive( sLine.nextSibling, eLine )
    ];
  }

  /**
   * Recursively gather selected nodes, starting from `node` and searching of `end` (cloned)
   * @param  {Node} node Start node
   * @param  {Node} end  End node
   * @return {Node[]}    Found nodes
   */
  selectedNodesRecursive ( node, end ) {
    if ( node === null         ) throw new Error('The node doesn\'t exist in this parent');
    if ( node == end           ) return [ node.cloneNode(true) ];
    if ( node.nodeName !== "P" ) return this.get.selectedNodesRecursive( node.nextSibling, end );
    return [ node.cloneNode(true), ...this.get.selectedNodesRecursive( node.nextSibling, end ) ];
  }

  /**
   * Get seleced lines from render content based on our saved selection start and end (cloned)
   * @return {Object[]} Selected nodes in content render form (cloned)
   */
  selectedLines () {
    const sel = this.get.selection();
    if ( sel.type != 'Range') return;
    let start = this.get.clone( this.selection.start );
    let end   = this.get.clone( this.selection.end   );
    // Check if start and end are not reversed
    if (
      start.line > end.line
      || (start.line == end.line && start.node > end.node)
      || (start.line == end.line && start.node == end.node && start.letter > end.letter)
    ) {
      let tmp = start;
      start   = end;
      end     = tmp;
    }
    // If we copy only part of one line
    if ( start.line == end.line ) {
      const line = this.get.clone( this.render.content[ start.line ] );
      delete line.ends;
      delete line.groupPath;
      // If from the same node
      if ( start.node == end.node ) {
        let content = this.replace.spaceChars( line.content[ start.node ].content );
        let text    = this.replace.spaces( content.substr( start.letter, end.letter - start.letter ) );
        line.content = [ this.syntax.create.span({}, text)];
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

  /**
   * Get child index of element
   * @param  {Node} el Node
   * @return {Number|Boolean}  Child Index or false if not found
   */
  elPos ( el ) {
    for ( let i = 0; i < el.parentElement.children.length; i++ ) {
      if ( el.parentElement.children[i] == el ) return i;
    }
    return false;
  }

  /**
   * Get position of line in editor
   * @param  {Node}           line Line node
   * @return {Number|Boolean}      Child Index if found, false if not
   */
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

  /**
   * Get selection
   * @return {Object} Selection object
   */
  selection () {
    return window.getSelection ? window.getSelection() : document.selection;
  }

  /**
   * Get real position of caret (real number of letter is the main purpose because in position element you only have on which letter he is in
   * current node)
   * @return {Object} { x: 0, y: 0 } - x is letters and y is lines
   */
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

  /**
   * Given some kind og child of the line find related line
   * @param  {Node        } el Lines child
   * @return {Node|Boolean}    Found line or false
   */
  line ( el ) {
    if (!el.parentElement) return false;
    if ( el.parentElement == this.editor ) return el;
    return this.get.line( el.parentElement );
  }

  /**
   * Get line node by its position
   * @param  {Number      } pos
   * @return {Node|Boolean}     Line node or false
   */
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

  /**
   * Get closest line in given direction (0 is up, 1 is down)
   * @param  {Node     }  line        Start line
   * @param  {Number   }  dir         Direction
   * @param  {Boolean  } [first=true] Checks if this si first iteration
   * @return {Node|null}              Line node or null
   */
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

  /**
   * Get sibling, based on passed direction
   * @param  {Node     } node
   * @param  {Number   } dir  1 is next 0 is previous
   * @return {Node|null}
   */
  sibling ( node, dir ) {
         if ( dir > 0 ) return node.nextSibling;
    else if ( dir < 0 ) return node.previousSibling;
  }

  /**
   * Get child nodes index of element
   * @param  {Node} el        Element to find
   * @return {Number|Boolean} Found index or false
   */
  childIndex ( el ) {
    for (var i = 0; i < el.parentElement.childNodes.length; i++) {
      if ( el.parentElement.childNodes[i] == el ) return i;
    }
    return false;
  }

  /**
   * Get all attributes of element and return them in key => value fashion
   * @param  {Object} el
   * @return {Object}    Attrbiutes
   */
  attributes(el) {
    const attrsObj = {};
    for ( let att, i = 0, atts = el.attributes, n = atts.length; i < n; i++ ){
      att = atts[i];
      attrsObj[att.nodeName] = att.nodeValue;
    }
    return attrsObj;
  }

  /**
   * Split node based on passed position
   * @param  {Number} [pos=this.pos.letter] Split position
   * @return {Object}                       { pre: '', suf: '' }
   */
  splitNode( pos = this.pos.letter ) {
    let text = this.pos.el.innerText;
    return {
      pre : this.set.attributes( this.pos.el.attributes, text.substr( 0, pos ) ),
      suf : this.set.attributes( this.pos.el.attributes, text.substr( pos    ) )
    }
  }

  /**
   * Split whole row based on passed node and on which letter of this node
   * @param  {Node    } [el=this.pos.el     ]
   * @param  {Node    } [pos=this.pos.letter]
   * @return {Object[]}                       { pre : [node], suf: [nodes] }
   */
  splitRow( el = this.pos.el, pos = this.pos.letter ) {
    let local = this.get.splitNode( pos );
    let nodes = this.get.nextSiblingAndRemove( el.nextSibling );
    local.suf = [ local.suf, ...nodes ];
    return local;
  }

  /**
   * Get this element and all his next siblings and remove them all
   * @param  {Node  } el
   * @return {Node[]}    Nodes
   */
  nextSiblingAndRemove( el ) {
    if ( el === null ) return [];
    let nodes = [];

    let span = this.set.attributes( el.attributes, el.innerText );
    nodes.push( span );
    if ( el.nextSibling ) {
      let nextSpan = this.get.nextSiblingAndRemove( el.nextSibling );
      nodes = nodes.concat( nextSpan );
    }

    el.remove();
    return nodes;
  }

  /**
   * Get whole line content from render content type line
   * @param  {Object} line Render content type line
   * @return {String}
   */
  sentence( line ) {
    let words = '';
    line.content.forEach( span => {
      words += span.content;
    });
    return this.replace.spaceChars(words);
  }

  /**
   * Cut senetence into words
   * @param  {String  } sentence
   * @return {String[]}          Words
   */
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

  /**
   * Get currently active spans content from render content
   * @return {String} Spans content
   */
  currentSpanContent () {
    return this.replace.spaceChars(this.render.content[this.pos.line].content[this.pos.childIndex].content);
  }

  /**
   * Get closest index of space in string (be it char or actual letter)
   * @param  {String} text      Text to search in
   * @param  {Number} [start=0] Where to start search
   * @return {Number]}          Index of space from indexOf
   */
  spaceIndex ( text, start = 0 ) {
    const char = text.indexOf('\u00A0', start);
    if ( char !== -1 ) {
      return char;
    }
    return text.indexOf(' ', start);
  }
}
export { TabJF_Get };
