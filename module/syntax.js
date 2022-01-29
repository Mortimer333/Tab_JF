import css from '../schema/dictionary/css.js';
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
      let group = this.syntax.groups[0];
      // Line start trigger
      if (group?.triggers) {
        const triggers = group.triggers;
        if (triggers?.line?.start) {
          triggers?.line.start.bind(this.settings.syntax)(
            i + start,
            line,
            sentence,
            group.subset.sets
          );
        }
      }

      const res      = this.syntax.validateResults(this.syntax.paint( sentence ));
      if ( res.words.length == 0 ) {
        res.words.push(this.syntax.create.span({}, ''));
      }
      this.render.content[i + start].content = res.words;

      group = this.syntax.groups[0];
      // Line end trigger
      if (group?.triggers) {
        const triggers = group.triggers;
        if (triggers?.line?.end) {
          triggers?.line.end.bind(this.settings.syntax)(
            i + start,
            line,
            group.subset.sets
          );
        }
      }

    }
  }

  update() {
    let start  = this.activated ? this.pos.line : this.render.hidden;
    start = this.syntax.getGroupPathLineNumber(start);
    const aStart = this.render.hidden;
    const end    = this.render.linesLimit;
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
    let group  = this.syntax.groups[0];
    let subset = group.subset;
    let end    = this.syntax.ends[0];

    for (var i = 0; i < sentence.length; i++) {
      let letter = sentence[i];

      if ( subset?.sets && subset?.sets[letter] || subset?.sets[sentence.substr(0, i + 1)] ) {
        const realLetter = subset?.sets[letter] ? letter : sentence.substr(0, i + 1);
        const results = this.syntax.splitWord( subset, i, realLetter, words, sentence, '\t' + debug );
        words    = results.words;
        sentence = results.sentence;
        i        = results.i;
        group    = this.syntax.groups[0];
        subset   = group.subset;
        end      = this.syntax.ends[0];
      } else if ( group?.selfref && letter == group?.start ) {
        let oldOne = { 'subset' : { 'sets' : { [group.start] : group } } };
        const resultsFirstWord = this.syntax.splitWord( subset, i, letter, words, sentence.slice(0, i), '\t' + debug );
        words    = resultsFirstWord.words;
        const results = this.syntax.splitWord( oldOne.subset, 0, letter, words, sentence.slice(i), '\t' + debug );
        words    = results.words;
        sentence = results.sentence;
        letter = sentence[0];
        i = results.i;
        continue;
      }

      if ( end !== null && (letter == end || typeof end == 'object' && end[letter]) ) {
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

        this.syntax.endSubset();

        // Subset end trigger
        if (group?.triggers) {
          const triggers = group.triggers;
          if (triggers?.end) {
            triggers?.end.bind(group.subset.sets[letter])( word, words, letter, sentence, group, this.syntax );
          }
        }

        return { words, sentence, i : 0 };
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

  endSubset() {
    this.syntax.groups.shift();
    this.syntax.ends  .shift();
    this.syntax.groupPath.pop();
  }

  splitWord( subset, i, letter, words, sentence, debug ) {
    const letterSet = subset?.sets[letter];
    let word = sentence.substr( 0, i - (letter.length - 1) );

    if ( word.length != 0 ) {
      let wordSet = this.syntax.getSet(subset, word);
      let attrs = wordSet.attrs;
      if ( wordSet?.ignore ) wordSet = { attrs : { style : 'color:#FFF;' } };
      if ( wordSet?.run ) {
        const results = wordSet.run.bind( wordSet );
        attrs = results( word, words, letter, sentence, subset.sets, subset );
      }
      words.push(this.syntax.create.span( attrs, word ));
    }

    if ( letterSet?.single ) {
      let attrs = letterSet.attrs ?? { style : 'color:#FFF;' };
      if ( letterSet?.run ) {
        const results = letterSet.run.bind( letterSet );
        attrs = results( word, words, letter, sentence, subset.sets, subset );
      }
      words.push(this.syntax.create.span( attrs, sentence.substr( i, letter.length )));
      i += letter.length;
      word += letter;
    }

    sentence = sentence.substring( word.length );

    i = word.length > 0 ? -1 : i;

    if ( subset.sets[letter]?.subset ) {
      words.push(this.syntax.create.span( letterSet.attrs, sentence.substr( 0, letter.length )));
      this.syntax.groupPath.push(letter);
      const res = this.syntax.startNewSubset(letter, letterSet, word, words, sentence.substring(letter.length), debug, subset);
      words = res.words;
      sentence = res.sentence;
      i = res.i;
    }

    return {
      words,
      sentence,
      i
    };
  }

  startNewSubset(letter, letterSet, word, words, sentence, debug, subset) {
    const group = subset.sets[letter];
    if (group?.triggers) {
      const triggers = group.triggers;
      if (triggers?.start) {
        triggers?.start.bind(group)(
          letter,
          letterSet,
          word,
          words,
          sentence,
          subset
        );
      }
    }

    if ( !letterSet?.single && !subset.sets[letter]?.subset ) {
      words.push(this.syntax.create.span( subset.sets[letter].attrs, letter));
    }
    this.syntax.groups.unshift( subset.sets[letter] );
    this.syntax.ends  .unshift( subset.sets[letter].end );
    const res = this.syntax.paint( sentence, words, debug + '\t' );
    return {
      words : res.words,
      sentence : res.sentence,
      i : res.i
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
      attrs = results( word, words, letter, sentence, group.sets, group );
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
