class TabJF_Replace {
  spaces (string) {
    if (string.length !== 0) {
      string = string.replaceAll(' ', '&nbsp;').replaceAll(this.spaceUChar, '&nbsp;');
    }
    return string;
  }

  spaceChars (string) {
    return string.replaceAll('&nbsp;', ' ');
  }
}
export { TabJF_Replace };
