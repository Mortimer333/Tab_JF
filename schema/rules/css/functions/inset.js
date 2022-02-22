import attrs from '../attrs.js';
import functions from '../../../functions/css.js';
import varF from './var.js';
import calc from './calc.js';
let inset; export default inset = {
  attrs : attrs.functions.func,
  end : ")",
  subset : {
    sets : {
      'var(' : varF,
      'calc(' : calc,
      ')' : {
        single : true,
        attrs : attrs.functions.func
      },
      'round' : {
        attrs : attrs.pink
      },
      default : {
        functions : functions,
        run : function ( word, words, letter, sentence, sets, subset ) {
          if (
            this.functions.procent(subset, word)
            || this.functions.length(subset, word)
          ) {
            return attrs.red;
          }
          return attrs.mistake;
        }
      }
    }
  }
};
