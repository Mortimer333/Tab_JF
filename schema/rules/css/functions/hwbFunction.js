import functions from '../../../functions/css.js';
import calcFunction from './calcFunction.js';
import varFunction from './varFunction.js';
let hwbFunction; export default hwbFunction = {
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
      'var' : varFunction,
      'calc' : calcFunction,
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
