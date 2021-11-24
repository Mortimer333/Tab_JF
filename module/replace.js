class TabJF_Replace {
  spaces (string) {
    return string.replaceAll(' ', '&nbsp;');
  }

  spaceChars (string) {
    return string.replaceAll('&nbsp;', ' ');
  }
}
