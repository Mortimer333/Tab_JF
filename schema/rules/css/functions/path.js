import functions from '../../../functions/css.js';
import varF from './var.js';
import singleQuote from './singleQuote.js';
import doubleQuote from './doubleQuote.js';
let polygon; export default polygon = {
  attrs : {
    style : 'color:pink;'
  },
  end : ")",
  subset : {
    sets : {
      'var(' : varF,
      '"' : doubleQuote,
      "'" : singleQuote,
      ')' : {
        single : true,
        attrs : {
          style : 'color:#F00;'
        }
      },
      ',' : {
        single : true,
        attrs : {
          style : 'color:#F00;'
        }
      },
      'evenodd' : {
        attrs : {
          style : 'color:pink;'
        }
      },
      'nonzero' : {
        attrs : {
          style : 'color:pink;'
        }
      },
      default : {
        attrs : {
          class : 'mistake'
        }
      }
    }
  }
};
