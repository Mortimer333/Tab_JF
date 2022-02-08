import functions from '../../../functions/css.js';
import varF from './var.js';
let calc; export default calc = {
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
      'var' : varF,
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
