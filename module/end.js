/**
 * Holds all related functions which ends something
 */
class TabJF_End {
  /**
   * Ends selection
   * Clear selection, resets saved selection and unpresses shift key
   */
  select () {
    this.get.selection().empty();
    const sel    = this.selection;
    sel.update   = false;
    sel.reverse  = false;
    sel.active   = false;
    sel.expanded = false;
    sel.end      = { line : -1, letter : -1, node : -1 };
    this.pressed.shift = false; // forcing the state, might not be the same as in real world
    // Updates start with current position
    this.update.selection.start();
  }
}
export { TabJF_End };
