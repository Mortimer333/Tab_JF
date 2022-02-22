import attrs from '../attrs.js';
import varF from './var.js';
import singleQuote from '../singleQuote.js';
import doubleQuote from '../doubleQuote.js';
import url from './url.js';
let counter; export default counter = {
  attrs : attrs.functions.func,
  end : ")",
  subset : {
    sets : {
      'var(' : varF,
      '"' : doubleQuote,
      "'" : singleQuote,
      'url(': url,
      ')' : {
        single : true,
        attrs : attrs.functions.func
      },
      ',' : {
        single : true,
        attrs : attrs.comma
      },
      'cyclic' : {
        attrs : attrs.pink
      },
      'numeric' : {
        attrs : attrs.pink
      },
      'alphabetic' : {
        attrs : attrs.pink
      },
      'symbolic' : {
        attrs : attrs.pink
      },
      'fixed' : {
        attrs : attrs.pink
      },
      default : {
        attrs : attrs.red
      }
    }
  }
};
