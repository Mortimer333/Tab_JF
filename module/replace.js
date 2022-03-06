class TabJF_Replace {
  /**
   * Replace spaces with HTML space char
   * @param  {String} string Text with spaces
   * @return {String}        Text with space chars
   */
  spaces (string) {
    if (string.length != 0) {
      string = string.replaceAll(' ', '&nbsp;').replaceAll(this.spaceUChar, '&nbsp;');
    }
    return string;
  }

  /**
   * Replace HTML space char with spaces
   * @param  {String} string Text with space chars
   * @return {String}        Text with spaces
   */
  spaceChars (string) {
    return string.replaceAll('&nbsp;', ' ');
  }
}
export { TabJF_Replace };
