import attrs from '../attrs.js';
import functions from '../../../functions/css.js';
import varF from './var.js';
import calc from './calc.js';
let matrix; export default matrix = {
  attrs : attrs.functions.func,
  end : ")",
  subset : {
    sets : {
      'var(' : varF,
      'calc(' : calc,
      ')' : {
        single : true,
        attrs :attrs.functions.func
      },
      ',' : {
        single : true,
        attrs : attrs.comma
      },
      default : {
        functions : functions,
        run : function ( word, words, letter, sentence, sets, subset ) {
          if (this.functions.number(subset, word)) {
            return attrs.red;
          }
          return attrs.mistake;
        }
      }
    }
  }
};
