import functions from '../../../functions/css.js';
import varFunction from './varFunction.js';
let calcFunction; export default calcFunction = {
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
      ',' : {
        single : true,
        attrs : {
          style : 'color:#F00;'
        }
      },
      '+' : {
        single : true,
        attrs : {
          style : 'color:#F00;'
        }
      },
      '-' : {
        single : true,
        attrs : {
          style : 'color:#F00;'
        }
      },
      '*' : {
        single : true,
        attrs : {
          style : 'color:#F00;'
        }
      },
      '/' : {
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
      ')' : {
        single : true,
        attrs : {
          style : 'color:#F00;'
        }
      },
      default : {
        functions : functions,
        run : function ( word, words, letter, sentence, sets, subset ) {
          console.log(word);
          if (
            this.functions.number(subset, word)
            || this.functions.length(subset, word)
            || this.functions.procent(subset, word)
          ) {
            return {
              style : 'color:#F00;'
            }
          }
          return {
            class : 'mistake'
          }
        }
      }
    }
  }
};
