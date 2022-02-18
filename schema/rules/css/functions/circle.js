import functions from '../../../functions/css.js';
import varF from './var.js';
import calc from './calc.js';
let circle; export default circle = {
  attrs : {
    style : 'color:pink;'
  },
  end : ")",
  subset : {
    sets : {
      'var(' : varF,
      'calc(' : calc,
      ')' : {
        single : true,
        attrs : {
          style : 'color:#F00;'
        }
      },
      'at' : {
        attrs : {
          style : 'color:pink;'
        }
      },
      'closest-side' : {
        attrs : {
          style : 'color:pink;'
        }
      },
      'farthest-side' : {
        attrs : {
          style : 'color:pink;'
        }
      },
      default : {
        functions : functions,
        run : function ( word, words, letter, sentence, sets, subset ) {
          if (
            this.functions.procent(subset, word)
            || this.functions.length(subset, word)
          ) {
            return {
              style : 'color:#F00;'
            };
          }
          return {
            class : 'mistake'
          };
        }
      }
    }
  }
};
