import functions from '../../../functions/css.js';
import varF from './var.js';
import calc from './calc.js';
let polygon; export default polygon = {
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
        functions : functions,
        run : function ( word, words, letter, sentence, sets, subset ) {
          if (this.functions.procent(subset, word)) {
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
