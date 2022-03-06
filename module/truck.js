class TabJF_Truck {
  /**
   * Export contents of editor (or passed html) by converting it into render content type. Used for transforming html nodes into editor readable type
   * @param  {Node[]} [html=null] Array of nodes
   * @return {Object}             Something similar to: [{content:[{content:'text',attrs:{}}]}]
   */
  export ( html = null ) {
    const exportAr = [];
    if ( !html ) html = this.editor.children;

    Object.values( html ).forEach( function( p ) {
      let line = this.truck.exportLine( p );
      if ( line ) {
        exportAr.push( line );
      }
    }, this);
    return exportAr;
  }

  /**
   * Convert node into render content type
   * @param  {Node  } p It has to be paragraph
   * @return {Object}   Something similar to: {content:[{content:'text',attrs:{}}]}
   */
  exportLine ( p ) {
    if ( p.nodeName !== "P" ) return false;

    const lineContent = [];
    Object.values( p.children ).forEach( span => {
      lineContent.push({
        attrs   : this.get.attributes( span           ),
        content : this.replace.spaces( span.innerText ),
      });
    });
    if (lineContent.length == 0) {
      lineContent.push({
        attrs   : {},
        content : '',
      });
    }
    return {
      content : lineContent,
    };
  }

  /**
   * Convert text into render content type
   * @param  {String} text
   * @return {Object}      Something similar to: [{content:[{content:'text',attrs:{}}]}]
   */
  exportText ( text ) {
    const content = text.split('\n');
    const conAr = [];
    content.forEach( text => {
      conAr.push({
        content : [
          {
            attrs : {},
            content : this.replace.spaces( text ),
          }
        ]
      });
    });
    return conAr;
  }

  /**
   * Populates editor
   * Requires transformed data into readable by editor array. Look into truck.export or truck.exportText how to create it.
   * @param  {Object[] } importAr              Render content type array
   * @param  {Boolean  } [limit=false        ] How many lines we want to import
   * @param  {Number   } [offset=0           ] From which line we should start importing
   * @param  {Boolean  } [clear=true         ] Remove content from editor?
   * @param  {Boolean  } [reverse=false      ] Import lines in reverse order
   * @param  {Node|null} [container=null     ] Container to which import lines (default editor)
   * @param  {Boolean  } [replaceContent=true] Replace render.content with passed array in importAr
   */
  import (
    importAr,
    limit = false,
    offset = 0,
    clear = true,
    reverse = false,
    container = null,
    replaceContent = true
  ) {
    if ( clear && !container ) this.clear.editor();
    if ( !container          ) container = this.editor;

    let firstLine;
    for (let i = offset; i < importAr.length; i++) {
      if ( limit && i === limit + offset ) break; // If we wanna import only part of the saved state
      const line     = importAr[i];
      const lineNode = document.createElement("p");
      line.content.forEach( (span, i) => {
        span.content   = this.replace.spaces( span.content );
        const spanNode = this.set.attributesFromContent( span.attrs, span.content );
        if (!spanNode?.childNodes) {
          console.log(span.attrs, span.content);
        }
        if ( spanNode.childNodes.length == 0 ) spanNode.appendChild(document.createTextNode(''));
        lineNode.appendChild(spanNode);
      });
      if ( reverse ) {
        if ( !firstLine ) firstLine = this.get.lineByPos(0);
        container.insertBefore( lineNode, firstLine );
      } else container.appendChild( lineNode );
    }
    if ( replaceContent ) this.render.content = importAr;
  }
}
export { TabJF_Truck };
