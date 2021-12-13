class TabJF_Replace {
  spaces (string) {
    return string.replaceAll(' ', '&nbsp;').replaceAll(this.spaceUChar, '&nbsp;');
  }

  spaceChars (string) {
    return string.replaceAll('&nbsp;', ' ').replaceAll(this.spaceUChar, ' ');
  }
}
export { TabJF_Replace };
