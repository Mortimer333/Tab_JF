import attrs from '../attrs.js';
import functions from '../../../functions/css.js';
import varF from './var.js';
import singleQuote from '../singleQuote.js';
import doubleQuote from '../doubleQuote.js';
let polygon; export default polygon = {
  attrs : attrs.functions.func,
  end : ")",
  subset : {
    sets : {
      'var(' : varF,
      '"' : doubleQuote,
      "'" : singleQuote,
      ')' : {
        single : true,
        attrs : attrs.functions.func
      },
      ',' : {
        single : true,
        attrs : attrs.comma
      },
      'evenodd' : {
        attrs : attrs.pink
      },
      'nonzero' : {
        attrs : attrs.pink
      },
      default : {
        attrs : attrs.mistake
      }
    }
  }
};
