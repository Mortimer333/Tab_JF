class TabJF_Get_Css {
  words( sentence ) {
    let word = '';
    let words = [];
    const seprators = {
      ':' : true,
      ';' : true,
      '(' : true,
      ')' : true,
    };
    const joiners = {
      "'" : true,
      '"' : true
    };
    let spaces = false;
    let open   = false;

    if ( this.is.space( sentence[0] ) ) spaces = true;

    for (let i = 0; i < sentence.length; i++) {
      const letter  = sentence[i];
      const isSpace = this.is.space(letter);

      if ( letter === open ) {
        word += letter;
        words.push(word);
        word = '';
        open = false;
        continue;
      } else if ( open ) {
        word += letter;
        continue;
      }

      if ( seprators[letter] ) {
        if ( word.length > 0 ) words.push(word);
        words.push(letter);
        word = '';
      } else if ( !open && joiners[letter] ) {
        if ( word.length > 0 ) words.push(word);
        word = open = letter;
      } else if ( isSpace && spaces == false || !isSpace && spaces == true ) {
        if ( word.length > 0 ) words.push(word);
        word = letter;
      } else {
        word += letter;
      }

      if ( isSpace ) spaces = true;
      else           spaces = false;
    }
    words.push( word );
    return words;
  }
}
export { TabJF_Get_Css };
