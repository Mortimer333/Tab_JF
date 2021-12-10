import schema from '../schema/rules/paths.js';
class TabJF_Syntax {
  rulesetOpen = false;

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
    const end   = start + this.render.linesLimit; // End Line

    // We need to get all lines from start to currently shown
    const lines = this.render.content.slice(0, end);

    for (let i = 0; i < end; i++) {
      const line = lines[i];
      const res = this.syntax.paint(line);
      this.render.content[i + start].content = res;
      console.log(res);
      // if (!this.syntax.rulesetOpen) {
      //   console.log(res);
      //   this.render.content[i + start] = res[0];
      //   this.syntax.rulesetOpen = res[1];
      // } else {
      //   this.render.content[i + start] = this.syntax.check.rule(line);
      // }
    }
  }

  paint( line, group = schema, end = null ) {
    let sentence = this.get.sentence( line );
    console.log("Start paintintg sentence: ", sentence);
    const words = [];
    for (var i = 0; i < sentence.length; i++) {
      const letter = sentence[i];
      console.log("Letter: `" + letter + '`');
      if (group.sets[letter]) {
        console.log("\tHis set", group.sets[letter]);
        // Even if sentence if bonkers long with this we might
        // escape int overflow
        let word = sentence.substring(0, i );
        console.log("\tCut Word!", '`' + word + '`');
        sentence = sentence.substring(i );
        if ( word.length == 0 ) continue;
        i = 0;
        let wordSet = group.sets[word[0]] || group.sets['default'] || { color : '#FFF' };
        console.log("\tWord set", wordSet);
        words.push(this.syntax.create.span({ 'style' : 'color:' + wordSet.color }, word));
        if (wordSet?.subset) {
          console.log("\tsubset");
        }
      }
    }
    words.push(this.syntax.create.span({ 'style' : 'color:#FFF;' }, sentence))
    return words;
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
