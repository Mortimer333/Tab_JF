import attrs from '../attrs.js';
import functions from '../../../functions/css.js';
import varF from './var.js';
import calc from './calc.js';
let env; export default env = {
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
      ',' : {
        single : true,
        attrs : attrs.comma
      },
      'safe-area-inset-top' : {
        attrs : attrs.red
      },
      'safe-area-inset-right' : {
        attrs : attrs.red
      },
      'safe-area-inset-bottom' : {
        attrs : attrs.red
      },
      'safe-area-inset-left' : {
        attrs : attrs.red
      },
      default : {
        functions : functions,
        run : function ( word, words, letter, sentence, sets, subset ) {
          if (this.functions.length(subset, word)) {
            return attrs.red;
          }
          return attrs.mistake;
        }
      }
    }
  }
};
