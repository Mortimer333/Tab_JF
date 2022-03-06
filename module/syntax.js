import css from '../schema/dictionary/css.js';
class TabJF_Syntax {
  groups    = [];     // Subsets in order they are applied
  ends      = [];     // Letters ending subset in order they should be searched
  groupPath = [];     // Path directing to group

  /**
   * Functions prepares syntax module to work and highlightes visible lines
   */
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

  /**
   * Fire trigger
   * Triggers are events fired at some point of the script. We currently have 4 triggers:
   * - Start of the line
   * - End of the line
   * - Start of subset
   * - End of subset
   * @param  {Object  } subset
   * @param  {Object  } scope
   * @param  {String[]} path Path to triggers ex: ['line', 'start']
   * @param  {mixed[] } args Arguments passed to trigger
   */
  fireTrigger(subset, scope, path, args) {
    if (!subset) return;
    const triggers = this.syntax.findTriggers(subset, path);
    if (!triggers) return;
    triggers.forEach( func => {
      func.bind(scope)(...args);
    });
  }

  /**
   * Using path this function searches if given object has triggers setup
   * @param  {Object          } subset
   * @param  {String[]        } path   Path to triggers ex: ['line', 'start']
   * @return {Object[]|Boolean}        Found triggers or false
   */
  findTriggers(subset, path) {
    if (path.length == 1) return subset[path[0]];
    if (!subset[path[path.length - 1]]) return false;
    return this.syntax.findTriggers(subset[path[path.length - 1]], path.slice(1));
  }

  /**
   * This methods iterates over all given lines in this fashion:
   * 1. Fires trigger line-start
   * 2. Paints line
   * 3. Validates results
   * 4. Fires trigger line-end
   * Each time saving painted lines in render content
   * @param  {Object[]} lines Lines from render content
   * @param  {Number  } start From which line start updating in render content
   */
  highlightLines(lines, start) {
    for (let i = 0; i < lines.length; i++) {
      this.render.content[i + start].ends      = this.get.clone( this.syntax.ends      );
      this.render.content[i + start].groupPath = this.get.clone( this.syntax.groupPath );
      const line     = lines[i];
      const sentence = this.get.sentence( line );
      let group      = this.syntax.groups[0];

      // Line start trigger
      this.syntax.fireTrigger(group?.triggers, this.settings.syntax, ['line', 'start'], [
        i + start, line, sentence, group.subset.sets, this.syntax
      ]);

      const res = this.syntax.validateResults(this.syntax.paint( sentence ));
      if ( res.words.length == 0 ) {
        res.words.push(this.syntax.create.span({}, ''));
      }
      this.render.content[i + start].content = res.words;

      group = this.syntax.groups[0];
      // Line end trigger
      this.syntax.fireTrigger(group?.triggers, this.settings.syntax, ['line', 'end'], [
        i + start, line, group.subset.sets, this.syntax
      ]);
    }
  }

  /**
   * Method fired each time there is change in line or we render new page
   */
  update() {
    // Find from which line to start highlighting
    let start  = this.activated ? this.pos.line : this.render.hidden;
    start = this.syntax.getGroupPathLineNumber(start);
    const aStart = this.render.hidden;
    const end    = this.render.linesLimit;
    const lines  = this.render.content.slice(start, aStart + end);
    // Create groups based on first line saved pathGroup
    this.syntax.groups = this.syntax.createGroups(
      this.get.clone(this.render.content[start].groupPath),
      this.settings.syntax
    );
    // Set syntax as last group
    this.syntax.groups.push( this.settings.syntax );
    this.syntax.ends      = this.render.content[start].ends;
    this.syntax.groupPath = this.render.content[start].groupPath;
    // Start painting
    this.syntax.highlightLines(lines, start);
  }

  /**
   * Find closest line with group and start painting from it
   * @param  {Number} start Where to start searching and go up
   * @return {Number}       Line index
   * @throws {Error }       Group Path was not found on any line
   */
  getGroupPathLineNumber(start) {
    for (let i = start; i >= 0; i--) {
      if (this.render.content[i].groupPath) {
        return i;
      }
    }
    throw new Error('Group Path was not found on any line');
  }

  /**
   * Create groups for painting
   * @param  {String[]} directions  GroupPath direction how to find target group
   * @param  {Object[]} schemats    Object holding all groups
   * @param  {Array   } [groups=[]] Found groups
   * @return {Array   }             Found groups
   */
  createGroups( directions, schemats, groups = [] ) {
    if (directions.length == 0) {
      return groups;
    }
    // If new group was found add it to groups to create map of group where the deppest is set the closest to index 0
    const schemat = schemats.subset.sets[directions[0]];
    groups.unshift(schemat);
    directions.shift();
    return this.syntax.createGroups(directions, schemat, groups);
  }

  /**
   * Validate if given sentence was fully highlighted, if not try again until it is
   * @param  {Object[]} res Results of painting
   * @return {Object[]}     Properly checked results
   */
  validateResults ( res ) {
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

  /**
   * Find if end landmark if present in sentence
   * @param  {String       } sentence
   * @param  {String|Object} end
   * @return {Boolean      }
   */
  findEndLandmark(sentence, end) {
    let endFound = false;
    if (typeof end == 'object') {
      Object.keys(end).forEach(function (endLandmark) {
        if (sentence.substr(-endLandmark.length) == endLandmark) {
          endFound = endLandmark;
          return;
        }
      });
    } else if (sentence.substr(-end.length) == end) {
      endFound = end;
    }
    return endFound;
  }

  /**
   * Highlight given sentence
   * @param  {String} sentence
   * @param  {Array}  [words=[]] Highlighted words
   * @return {Object}            {sentence: '', words: []}
   */
  paint( sentence, words = [] ) {
    // Set group which will tell us how to paint this sentence
    let group  = this.syntax.groups[0];
    let subset = group.subset;
    subset.sets = Object.assign({}, this.settings.syntax.global ?? {}, subset.sets);
    let end    = this.syntax.ends[0];

    for (var i = 0; i < sentence.length; i++) {
      let letter = sentence[i];
      let endFound = false;
      // Check if subset has ended
      if (end !== null) {
        endFound = this.syntax.findEndLandmark(sentence.substr(0, i + 1), end);
      }

      if ( endFound ) {
        const results = this.syntax.endSubsetChecks(i, letter, endFound, words, sentence, subset, group);
        words    = results.words;
        sentence = results.sentence;
        i        = results.i;
        group    = this.syntax.groups[0];
        subset   = group.subset;
        end      = this.syntax.ends[0];
        continue;
      }
      // Check if letter hes its own subset or is self refering itself
      if ( subset?.sets &&
        ((
            subset?.sets[letter]
            && !subset?.sets[letter]?.whole
          ) || (
            subset?.sets[sentence.substr(0, i + 1)]
            && !subset?.sets[sentence.substr(0, i + 1)]?.whole
        ))
      ) {
        const realLetter = subset?.sets[sentence.substr(0, i + 1)] ? sentence.substr(0, i + 1) : letter;
        const results = this.syntax.splitWord( subset, i, realLetter, words, sentence );
        words    = results.words;
        sentence = results.sentence;
        i        = results.i;
        group    = this.syntax.groups[0];
        subset   = group.subset;
        end      = this.syntax.ends[0];
      } else if ( group?.selfref && letter == group?.start ) {
        let oldOne = { 'subset' : { 'sets' : { [group.start] : group } } };
        const resultsFirstWord = this.syntax.splitWord( subset, i, letter, words, sentence.slice(0, i) );
        words    = resultsFirstWord.words;
        const results = this.syntax.splitWord( oldOne.subset, 0, letter, words, sentence.slice(i) );
        words    = results.words;
        sentence = results.sentence;
        i = results.i + 1;
        continue;
      }
    }
    // Check if after whole for sentence wasn't finished and if so, paint the rest of it
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

  /**
   * End subset
   * Highlighting is made of subsets, which are actiavted by ladnmarks and finished by others. This finishes current subset and opens previous one.
   * @param {Number} i        Letter iteration
   * @param {String} letter
   * @param {String} end      Ending landmark
   * @param {Array } words
   * @param {String} sentence
   * @param {Object} subset   Rules of highlighting
   * @param {Object} group
   * @return {Object}         { words: [], sentence: '', i : 0 }
   */
  endSubsetChecks(i, letter, end, words, sentence, subset, group) {
    // Get previous word
    let word = sentence.substring( 0, (i + 1) - end.length );
    // If word is not empty try to paint it and add it to words
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
    // Remove end from sentence
    sentence = sentence.substring( (i + 1) - end.length );
    this.syntax.endSubset();

    // Subset end trigger
    this.syntax.fireTrigger(group?.triggers, group, ['end'], [
      i, word, words, letter, sentence, group, this.syntax
    ]);
    let index = -1;
    // If current group has the same start as current one jump one so we don't start the same subset again,
    // or if the end of sentence is the same as the end of previous subset (we don't want to end two subsets
    // on the same landmark)
    if (
      sentence[0] == group.start
      || (
        sentence[0] == this.syntax.groups[0].end
        || (
          typeof this.syntax.groups[0].end == 'object'
          && this.syntax.groups[0].end[sentence[0]]
        )
      )
    ) {
      index = 0;
    }

    return { words, sentence, i : index };
  }

  /**
   * Ends susbset by removing first items from groups, sends and groupPath
   */
  endSubset() {
    this.syntax.groups.shift();
    this.syntax.ends  .shift();
    this.syntax.groupPath.pop();
  }

  /**
   * Split current sentence into word and rest of sentence, paint the word and check if to create new subset and start it.
   * @param  {Object} subset
   * @param  {Number} i        Letter iteration in sentence
   * @param  {String} letter
   * @param  {Array } words
   * @param  {String} sentence
   * @return {Object}          { words: [], i: 0, sentence: '' }
   */
  splitWord( subset, i, letter, words, sentence ) {
    const letterSet = subset?.sets[letter];
    // Get word
    let word = sentence.substr( 0, i - (letter.length - 1) );
    // If not empty try to paint it
    if ( word.length != 0 ) {
      let wordSet = this.syntax.getSet(subset, word);
      let attrs = wordSet.attrs;
      if ( wordSet?.ignore ) wordSet = { attrs : { style : 'color:#FFF;' } };
      if ( wordSet?.run ) {
        const results = wordSet.run.bind( wordSet );
        attrs = results( word, words, letter, sentence, subset.sets, subset, this.syntax );
      }
      words.push(this.syntax.create.span( attrs, word ));
    }
    // If set for letter has single attribute we don't add it to word when we find another landmark but make it standalone mark
    if ( letterSet?.single ) {
      let attrs = letterSet.attrs ?? { style : 'color:#FFF;' };
      if ( letterSet?.run ) {
        const results = letterSet.run.bind( letterSet );
        attrs = results( word, words, letter, sentence, subset.sets, subset, this.syntax );
      }
      words.push(this.syntax.create.span( attrs, sentence.substr( i, letter.length )));
      i += letter.length;
      word += letter;
    }
    // Remove word from sentence
    sentence = sentence.substring( word.length );

    i = word.length > 0 ? -1 : i;
    // If passed subset has its own subset start new highlighting with this set of rules
    if ( subset.sets[letter]?.subset ) {
      words.push(this.syntax.create.span( letterSet.attrs, sentence.substr( 0, letter.length )));
      const res = this.syntax.startNewSubset(letter, letterSet, word, words, sentence.substring(letter.length), subset);
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

  /**
   * Start new subset by adding it to groups, ends and groupPath and firing paint method on the rest of sentence it has
   * @param {String} letter
   * @param {Object} letterSet
   * @param {String} word
   * @param {Array} words
   * @param {String} sentence
   * @param {Object} subset
   * @return {Object}          {words: [], sentence: '', i: 0}
   */
  startNewSubset(letter, letterSet, word, words, sentence, subset) {
    this.syntax.groupPath.push(letter);
    const group = subset.sets[letter];
    console.log(letter, letterSet, word, words, sentence, subset);
    this.syntax.fireTrigger(group?.triggers, group, ['start'], [
      letter, letterSet, word, words, sentence, subset, this.syntax
    ]);

    if ( !letterSet?.single && !subset.sets[letter]?.subset ) {
      words.push(this.syntax.create.span( subset.sets[letter].attrs, letter));
    }

    // Assign start of subset
    if (!subset.sets[letter]?.start) {
      subset.sets[letter].start = letter;
    }

    this.syntax.groups.unshift( subset.sets[letter] );
    this.syntax.ends  .unshift( subset.sets[letter].end );
    const res = this.syntax.paint( sentence, words );
    return {
      words : res.words,
      sentence : res.sentence,
      i : res.i
    }
  }

  /**
   * Try to get set for letter in this hierarchy:
   * - firstly try for single letter landmark
   * - then try to check if whole word doesn't have any attributes
   * - then check if subset doesn't have default styles
   * - and at the end return the script default
   * @param  {Object} group
   * @param  {String} word
   * @return {Object}       Set for letter/word
   */
  getSet(group, word) {
    let set = group.sets[word[0]] || group.sets[word] || group.sets['default'] || { attrs : { class : 'mistake' } };
    if (set.whole && group.sets[word[0]]) {
      return group.sets[word] || group.sets['default'] || { attrs : { class : 'mistake' } };
    }
    return set;
  }

  /**
   * Try to retrive attrsibutes for set to highlight word. It will check if to ignore this set, or if set has method to run.
   * @param  {Object} set
   * @param  {String} word
   * @param  {Array} words
   * @param  {String} letter
   * @param  {String} sentence
   * @param  {Object} group
   * @return {Object}          Object looking similar to this: {attrs:{style:'color:#FFF'}}
   */
  getAttrsFromSet(set, word, words, letter, sentence, group) {
    let attrs = set.attrs;
    if (set?.ignore) set = { attrs : { style : 'color:#FFF;' } };

    if (set?.run) {
      const results = set.run.bind(set);
      attrs = results( word, words, letter, sentence, group.sets, group, this.syntax );
    }
    return attrs;
  }
}
export { TabJF_Syntax };
