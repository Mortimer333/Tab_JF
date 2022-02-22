import attrs from '../attrs.js';
import varF from './var.js';
import singleQuote from '../singleQuote.js';
import doubleQuote from '../doubleQuote.js';
let counter; export default counter = {
  attrs : attrs.functions.func,
  end : ")",
  subset : {
    sets : {
      'var(' : varF,
      ')' : {
        single : true,
        attrs : attrs.functions.func
      },
      '"' : doubleQuote,
      "'" : singleQuote,
      ',' : {
        single : true,
        attrs : attrs.comma
      },
      default : {
        attrs : attrs.red
      }
    }
  }
};
