class TabJF_Syntax_Check {
  rule ( line ) {
    const sentence = this.get.sentence( line );
    // Later seperate sentence by ; to apply the same color to all the parts
    // and join them by it
    const words    = this.get.css.words( sentence );
    const newLine  = this.get.clone( line );
    newLine.content = [];

    let wordIndex = 0;
    const word = this.is.space(words[0][0]) ? words[1] : words[0];
    if (word == words[1]) {
      wordIndex++;
      newLine.content.push({
        attrs   : { class : 'spaces' },
        content : this.replace.spaces( words[0] ),
      });
    }
    // Check for spaces
    const chunks = word.split('-');
    const syntax = this.syntax.chainSearch(chunks);
    if ( syntax ) {
      return this.syntax.colorize.rule( newLine, syntax, wordIndex, words, word );
    }
    return line;
  }
}
export { TabJF_Syntax_Check };
