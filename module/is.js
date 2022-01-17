class TabJF_Is {
  space(word) {
    return word == " " || word == "\u00A0" || word == '&nbsp;';
  }
}
export { TabJF_Is };
