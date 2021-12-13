import schema from '../schema/rules/paths.js';
class TabJF_Syntax {
  rulesetOpen = false;
  groups = [];
  ends   = [];
  dict   = {
    value : false,
    name : {
      active : false
    }
  }

  /**
   * How I want it to work:
   * First is mapping (it always makes for less iteration):
   * - map words
   * - during mapping mark them based on given Reaction Chain
   * - mark groups... actually during mapping we could just paint them as we go
   * - okay so we will iterate over each letter and set grouping
   * - can I during grouping set highlight? Yea I think I can just I have to get just entered word
   *
   */

  init () {
    const start = this.render.hidden;             // Start line
    let end     = start + this.render.linesLimit; // End Line
    if (end > this.render.content.length) {
      end = this.render.content.length;
    }

    // We need to get all lines from start to currently shown
    const lines = this.render.content.slice(0, end);

    this.syntax.groups = [schema];
    this.syntax.ends   = [ null ];
    this.syntax.dicts  = [ null ];
    console.log("line end", end);
    for (let i = 0; i < end; i++) {
      const line = lines[i];
      console.log("=== New Line", line);
      const sentence = this.get.sentence( line );
      const res = this.syntax.validateResults(this.syntax.paint( sentence ));
      this.render.content[i + start].content = res.words;
      console.log("=== Line End");
      console.log();
    }
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

  paint( sentence, oldGroup = null, oldEnd = null, debug = '\t' ) {
    const group = this.syntax.groups[0];
    const end   = this.syntax.ends[0];
    let words          = [];
    let dictValueStart = 0;

    for (var i = 0; i < sentence.length; i++) {
      const letter = sentence[i];

      if ( group?.sets && group?.sets[letter] ) {
        const letterSet = group?.sets[letter];

        // Even if sentence if bonkers long with this we might escape int overflow
        let word = sentence.substring( 0, i );

        if (word.length != 0) {
          let wordSet = group.sets[word[0]] || group.sets['default'] || { attrs : { style : 'color:#FFF;' } };
          words.push(this.syntax.create.span( wordSet.attrs,  word));
        }

        // What I want to do with dictionary?
        // - When name is active then wait for it to be finished (nameEnd trigger) and then try to find
        //   its value
        //   - if it has trim set to true then ignor spaces (might set it that its true for default)
        //   - if it has joiners then cut it into `directions` (an array of made of names of values to go by)
        //   - find the value by using `directions`
        //   - each direction has additional step `_` which is just a container for values
        // - With value we can start validating chunks of it
        //   - each value will have a type which indicates how to validate it (types will have to be explained in
        //     `functions`)
        //   - if type is not specified then the { custom : true } is used
        //   - some of values might have `ref` key word which means to copy some else setting and merge with this one

        // name : value ;
        // const name = value ;
        // public const name = value;

        if ( group?.name && group.name.end == letter && this.syntax.dict.name.active ) {
          this.syntax.dict.name.active = false;
          words = this.syntax.dictionary.getValue(words, group);
          dictValueStart = words.length + 1;
        } else if ( group?.name && group.name.start == letter && !this.syntax.dict.name.active ) {
          this.syntax.dict.name.active = true;
          let newValues = this.syntax.dictionary.validateValue(words.splice(dictValueStart), group);
          words = words.concat( newValues );
        }

        if (letterSet?.single || group.dictionary) {
          words.push(this.syntax.create.span( letterSet.attrs, sentence.substring( i, i + 1 )));
          i++;
        }
        sentence = sentence.substring( i );

        if (letterSet?.single || group.dictionary) i = -1;
        else                                       i = 0;

        if ( group.sets[letter]?.subset ) {

          if ( group.sets[letter].subset?.dictionary ) this.syntax.dict.name.active = true;

          words.push(this.syntax.create.span( group.sets[letter].attrs,  letter));
          this.syntax.groups.unshift( group.sets[letter].subset );
          this.syntax.ends  .unshift( group.sets[letter].end );
          const res = this.syntax.paint( sentence.substr( 1 ), group, end, debug + '\t' );
          words = words.concat( res.words );
          sentence = res.sentence;
        }
      }

      if ( letter == end ) {
        if ( group?.dictionary ) this.syntax.dict.name.active = false;
        this.syntax.groups.shift();
        this.syntax.ends  .shift();
        return { words, sentence };
      }
    }

    if ( sentence.length > 0 ) {
      const first = sentence[0];
      if (group?.sets && group?.sets[first]) {
        words.push(this.syntax.create.span( group.sets[first].attrs,  sentence));
      } else {
        words.push(this.syntax.create.span({ 'style' : 'color:#FFF;' }, sentence))
      }
      sentence = '';
    }

    return { words, sentence };
  }

  chainSearch( chunks ) {
    const chunk = chunks[0];
    if (schema[chunk]) {
      if (chunks.length == 1) {
        return schema[chunk];
      } else {
        this.syntax.chainSearch(chunks.slice(1));
      }
    } else {
      return false;
    }
  }
}
export { TabJF_Syntax };
