class TabJF_Is {
  /**
   * Checks if given string is an instance of space
   * @param  {String} word
   * @return {Boolean}
   */
  space(word) {
    return word == " " || word == "\u00A0" || word == '&nbsp;';
  }
}
export { TabJF_Is };
