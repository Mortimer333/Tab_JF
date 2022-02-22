import attrs from '../attrs.js';
import functions from '../../../functions/css.js';
import varF from './var.js';
import calc from './calc.js';
let clamp; export default clamp = {
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
