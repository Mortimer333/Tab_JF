import functions from '../../functions/css.js';
import attrs from './attrs.js';
let singleQuote;export default singleQuote = {
  attrs : {
    style : 'color:#0F0;'
  },
  triggers : {
    line : {
      start : [functions.line.start]
    }
  },
  end : "'",
  subset : {
    sets : {
      default : {
        attrs : {
          attrs : attrs.quote
        }
      }
    }
  }
};
