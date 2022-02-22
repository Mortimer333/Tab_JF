import attrs from '../attrs.js';
import functions from '../../../functions/css.js';
import varF from './var.js';
import calc from './calc.js';
import url from './url.js';
let crossFade; export default crossFade = {
  attrs : attrs.functions.func,
  end : ")",
  subset : {
    sets : {
      'var(' : varF,
      'calc(' : calc,
      'url(' : url,
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
          if (this.functions.procent(subset, word)) {
            return attrs.red;
          }
          return attrs.mistake;
        }
      }
    }
  }
};
