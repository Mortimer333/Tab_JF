class TabJF_Clear {
  editor (onlyLines = true) {
    Object.values(this.editor.childNodes).forEach( p => {
      if ( p.nodeName == "P" && onlyLines ) p.remove();
      else if ( p != this.caret.el && p != this.font.lab && !onlyLines ) p.remove();
    });
  }
}
export { TabJF_Clear };
