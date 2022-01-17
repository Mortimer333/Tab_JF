class TabJF_Syntax {
  rulesetOpen = false;
  groups = [];
  ends   = [];
  groupPath = [];

  init () {
    const start = this.render.hidden;             // Start line
    let end     = start + this.render.linesLimit; // End Line
    if (end > this.render.content.length) {
      end = this.render.content.length;
    }

    // We need to get all lines from start to currently shown
    const lines = this.render.content.slice(0, end);

    this.syntax.groups = [ this.settings.syntax ];
    this.syntax.ends   = [ null ];
    this.syntax.highlightLines(lines, start);
  }

  highlightLines(lines, start) {
    for (let i = 0; i < lines.length; i++) {
      this.render.content[i + start].ends      = this.get.clone( this.syntax.ends      );
      this.render.content[i + start].groupPath = this.get.clone( this.syntax.groupPath );
      const line     = lines[i];
      const sentence = this.get.sentence( line );
      const res      = this.syntax.validateResults(this.syntax.paint( sentence ));
      if ( res.words.length == 0 ) {
        res.words.push(this.syntax.create.span({}, ''));
      }
      this.render.content[i + start].content = res.words;
    }
  }

  update() {
    let start  = this.activated ? this.pos.line : this.render.hidden;
    start = this.syntax.getGroupPathLineNumber(start);
    const aStart = this.render.hidden;
    const end    = this.settings.line;
    const lines  = this.render.content.slice(start, aStart + end);
    this.syntax.groups = this.syntax.createGroups(
      this.get.clone(this.render.content[start].groupPath),
      this.settings.syntax
    );
    this.syntax.groups.push( this.settings.syntax );
    this.syntax.ends      = this.render.content[start].ends;
    this.syntax.groupPath = this.render.content[start].groupPath;
    this.syntax.highlightLines(lines, start);
  }

  getGroupPathLineNumber(start) {
    for (let i = start; i >= 0; i--) {
      if (this.render.content[i].groupPath) {
        return i;
      }
    }
    throw new Error('Group Path was not found on any line');
  }

  createGroups( directions, schemats, groups = [] ) {
    if (directions.length == 0) {
      return groups;
    }
    const schemat = schemats.subset.sets[directions[0]];
    groups.unshift(schemat);
    directions.shift();
    return this.syntax.createGroups(directions, schemat, groups);
  }

  validateResults ( res, rec = false ) {
    if ( res.sentence.length > 0 ) {
      return {
        words : res.words.concat(
          this.syntax.validateResults(
            this.syntax.paint( res.sentence ),
            true
          ).words
        ),
        sentence : ''
      };
    }
    return res;
  }

  paint( sentence, words = [], debug = '\t' ) {
    const group  = this.syntax.groups[0];
    const subset = group.subset;
    const end    = this.syntax.ends[0];

    for (var i = 0; i < sentence.length; i++) {
      let letter = sentence[i];
      if ( subset?.sets && subset?.sets[letter] ) {
        const results = this.syntax.splitWord( subset, i, letter, words, sentence, '\t' + debug );
        words    = results.words;
        sentence = results.sentence;
        i = results.i;
        letter = sentence[0];
      } else if ( group?.selfref && letter == group?.start ) {
        let oldOne = { 'subset' : { 'sets' : { [group.start] : group } } };
        const resultsFirstWord = this.syntax.splitWord( subset, i, letter, words, sentence.slice(0, i), '\t' + debug );
        words    = resultsFirstWord.words;
        const results = this.syntax.splitWord( oldOne.subset, 0, letter, words, sentence.slice(i), '\t' + debug );
        words    = results.words;
        sentence = results.sentence;
        letter = sentence[0];
        i = results.i;
      }

      if ( end !== null && letter == end ) {
        let word = sentence.substring( 0, i );

        if ( word.length != 0 ) {
          let wordSet = this.syntax.getSet(subset, word);
          words.push( this.syntax.create.span(
              this.syntax.getAttrsFromSet(
                wordSet,
                word,
                words,
                letter,
                sentence,
                subset
              ),
              word
          ));
        }

        sentence = sentence.substring( i );
        this.syntax.groups.shift();
        this.syntax.ends  .shift();
        this.syntax.groupPath.pop();
        return { words, sentence, i : -1 };
      }
    }

    if ( sentence.length > 0 ) {
      let attr = this.syntax.getAttrsFromSet(
        this.syntax.getSet(subset, sentence),
        sentence,
        words,
        '',
        sentence,
        subset
      );
      words.push(this.syntax.create.span(attr, sentence));
      sentence = '';
    }
    return { words, sentence };
  }

  splitWord( subset, i, letter, words, sentence, debug ) {
    const letterSet = subset?.sets[letter];
    // Even if sentence if bonkers long with this we might escape int overflow
    let word = sentence.substring( 0, i );

    if ( word.length != 0 ) {
      let wordSet = this.syntax.getSet(subset, word);
      let attrs = wordSet.attrs;
      if ( wordSet?.ignore ) wordSet = { attrs : { style : 'color:#FFF;' } };
      if ( wordSet?.run ) {
        const results = wordSet.run.bind( wordSet );
        attrs = results( word, words, letter, sentence, subset.sets );
      }
      words.push(this.syntax.create.span( attrs, word ));
    }

    if ( letterSet?.single && !subset.sets[letter]?.subset ) {
      let attrs = letterSet.attrs ?? { style : 'color:#FFF;' };
      if ( letterSet?.run ) {
        const results = letterSet.run.bind( letterSet );
        attrs = results( word, words, letter, sentence, subset.sets );
      }
      words.push(this.syntax.create.span( attrs, sentence.substring( i, i + 1 )));
      i++;
    }
    sentence = sentence.substring( i );
    if ( letterSet?.single ) i = -1;
    else i = 0;
    if ( subset.sets[letter]?.subset ) {
      words.push(this.syntax.create.span( letterSet.attrs, sentence.substring( 0, 1 )));
      this.syntax.groupPath.push(letter);
      const res = this.syntax.startNewSubset(letter, letterSet, word, words, sentence.substring(1), debug, subset);
      words = res.words;
      sentence = res.sentence;
    }

    return {
      words,
      sentence,
      i
    };
  }

  startNewSubset(letter, letterSet, word, words, sentence, debug, subset) {
    if ( !letterSet?.single && !subset.sets[letter]?.subset ) {
      words.push(this.syntax.create.span( subset.sets[letter].attrs, letter));
    }
    this.syntax.groups.unshift( subset.sets[letter] );
    this.syntax.ends  .unshift( subset.sets[letter].end );
    const res = this.syntax.paint( sentence, words, debug + '\t' );
    // Subset end trigger
    if (subset.sets[letter]?.triggers) {
      const triggers = subset.sets[letter].triggers;
      if (triggers?.end) {
        triggers?.end.bind(subset.sets[letter])( word, words, letter, sentence, subset.sets[letter].subset.sets );
      }
    }
    words = res.words;
    sentence = res.sentence;
    return {
      words,
      sentence
    }
  }

  getSet(group, word) {
    return group.sets[word[0]] || group.sets[word] || group.sets['default'] || { attrs : { style : 'color:#FFF;' } };
  }

  getAttrsFromSet(set, word, words, letter, sentence, group) {
    let attrs = set.attrs;
    if (set?.ignore) set = { attrs : { style : 'color:#FFF;' } };

    if (set?.run) {
      const results = set.run.bind(set);
      attrs = results( word, words, letter, sentence, group.sets );
    }
    return attrs;
  }

  chainSearch( chunks ) {
    const chunk = chunks[0];
    if ( this.settings.syntax[chunk] ) {
      if (chunks.length == 1) {
        return this.settings.syntax[chunk];
      } else {
        this.syntax.chainSearch(chunks.slice(1));
      }
    } else {
      return false;
    }
  }
}
export { TabJF_Syntax };
