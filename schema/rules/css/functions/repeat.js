import attrs from '../attrs.js';
import functions from '../../../functions/css.js';
import varF from './var.js';
import calc from './calc.js';
import minmax from './minmax.js';
import fitContent from './fitContent.js';
let repeat; export default repeat = {
  attrs : attrs.functions.func,
  end : ")",
  subset : {
    sets : {
      'var(' : varF,
      'calc(' : calc,
      'minmax(' : minmax,
      'fit-content(' : fitContent,
      ')' : {
        single : true,
        attrs : attrs.functions.func
      },
      ',' : {
        single : true,
        attrs : attrs.comma
      },
      'max-content' : {
        attrs : attrs.red
      },
      'min-content' : {
        attrs : attrs.red
      },
      'auto' : {
        attrs : attrs.red
      },
      'auto-fill' : {
        attrs : attrs.red
      },
      'auto-fit' : {
        attrs : attrs.red
      },
      '[' : {
        attrs : attrs.pink,
        end : ']',
        subset : {
          sets : {
            default : {
              attrs : attrs.white
            }
          }
        }
      },
      ']' : {
        single : true,
        attrs : attrs.pink
      },
      default : {
        functions : functions,
        run : function ( word, words, letter, sentence, sets, subset ) {
          if (
            this.functions.length(subset, word)
            || this.functions.number(subset, word)
            || this.functions.fraction(subset, word)
            || this.functions.procent(subset, word)
          ) {
            return attrs.red;
          }
          return attrs.mistake;
        }
      }
    }
  }
};
