import varF from './var.js';
import singleQuote from './singleQuote.js';
import doubleQuote from './doubleQuote.js';
let counter; export default counter = {
  attrs : {
    style : 'color:pink;'
  },
  end : ")",
  subset : {
    sets : {
      'var(' : varF,
      ')' : {
        single : true,
        attrs : {
          style : 'color:#F00;'
        }
      },
      '"' : doubleQuote,
      "'" : singleQuote,
      ',' : {
        single : true,
        attrs : {
          style : 'color:#F00;'
        }
      },
      default : {
        attrs : {
          style : 'color:#F00;'
        }
      }
    }
  }
};
