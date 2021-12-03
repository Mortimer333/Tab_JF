class TabJF_Truck {
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

  exportText ( text ) {
    const content = text.split('\n');
    const conAr = [];
    content.forEach( text => {
      conAr.push({
        content : [
          {
            attrs : [],
            content : this.replace.spaces( text ),
          }
        ]
      });
    });
    return conAr;
  }

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
      line.content.forEach( span => {
        span.content   = this.replace.spaces( span.content             );
        const spanNode = this.set.attributesFromContent( span.attrs, span.content );
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
