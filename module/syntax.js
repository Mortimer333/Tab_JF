import schema from '../schema/css.js';
class TabJF_Syntax {
  init () {
    const start = this.render.hidden;             // Start line
    const end   = start + this.render.linesLimit; // End Line
    const lines = this.render.content.slice(start, end);
    for (let i = 0; i < (end - start); i++) {
      const line = lines[i];
      this.render.content[i + start] = this.syntax.check.rule(line);
    }
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
