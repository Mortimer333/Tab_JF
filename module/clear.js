/**
 * Holds all related methods for clearing/purging nodes
 */
class TabJF_Clear {
  /**
   * Deletes contents of editor and adds caret (as this is only element that shouldn't be deleted)
   * @param  {Boolean} [onlyLines=true]               [description]
   * @return {[type]}                   [description]
   */
  editor (onlyLines = true) {
    this.editor.innerHTML = '';
    if ( this.caret.el ) this.editor.appendChild(this.caret.el);
  }
}
export { TabJF_Clear };
