class TabJF_Clear {
  editor () {
    Object.values(this.editor.children).forEach( p => {
      if (p.nodeName == "P") p.remove();
    });
  }
}
export { TabJF_Clear };
