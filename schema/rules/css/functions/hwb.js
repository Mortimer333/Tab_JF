import functions from '../../../functions/css.js';
import calc from './calc.js';
import varF from './var.js';
let hwb; export default hwb = {
  attrs : {
    style : 'color:pink;'
  },
  end : ")",
  subset : {
    sets : {
      '(' : {
        single : true,
        attrs : {
          style : 'color:#F00;'
        }
      },
      'var(' : varF,
      'calc(' : calc,
      ' ' : {
        single : true,
        attrs : {
          class : 'spaces'
        }
      },
      '/' : {
        single : true,
        attrs : {
          style : 'color:#F00;'
        }
      },
      ')' : {
        single : true,
        attrs : {
          style : 'color:#F00;'
        }
      },
      ' ' : {
        single : true,
        attrs : {
          class : 'spaces'
        }
      },
      default : {
        functions : functions,
        run : function ( word, words, letter, sentence, sets, subset ) {
          if (
            this.functions.number(subset, word)
            || this.functions.procent(subset, word)
            || this.functions.rad(subset, word)
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
