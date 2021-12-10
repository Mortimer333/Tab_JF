class TabJF_Syntax_Colorize {
  rule ( newLine, syntax, wordIndex, words, word ) {
    // Colorize the main word
    newLine.content.push(
      this.syntax.create.span(
        { class : 'rule' },
        word
      )
    );

    wordIndex++;
    if ( words[wordIndex] == ":" ) {
      newLine.content.push(
        this.syntax.create.span(
          { class : 'semicolon' },
          words[wordIndex]
        )
      );
    } else if ( this.is.space(words[wordIndex][0]) && words[wordIndex + 1][0] == ":" ) {
      newLine.content.push(
        this.syntax.create.space( words[wordIndex] )
      );
      newLine.content.push(
        this.syntax.create.span(
          { class : 'semicolon' },
          words[wordIndex + 1]
        )
      );
      wordIndex++;
    }
    wordIndex++;

    const spans = this.syntax.highlight.value(words.slice(wordIndex), syntax);
    newLine.content = newLine.content.concat(spans);
    return newLine;
  }

  ruleset ( line ) {
    const sentence = this.get.sentence( line );
    const words    = this.get.css.words( sentence );
    const newLine = this.get.clone( line );
    newLine.content = this.syntax.highlight.ruleset( words );
    return [newLine, !!~sentence.indexOf('{')];
  }
}
export { TabJF_Syntax_Colorize };
