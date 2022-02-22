import functions from '../../functions/css.js';
import attrs from './attrs.js';
let doubleQuote;export default doubleQuote = {
  attrs : {
    style : 'color:#0F0;'
  },
  triggers : {
    line : {
      start : [functions.line.start]
    }
  },
  end : '"',
  subset : {
    sets : {
      default : {
        attrs : attrs.quote
      }
    }
  }
};
