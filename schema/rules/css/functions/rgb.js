import attrs from '../attrs.js';
import functions from '../../../functions/css.js';
import calc from './calc.js';
import varF from './var.js';
let rgb; export default rgb = {
  attrs : attrs.functions.func,
  end : ")",
  subset : {
    sets : {
      'var(' : varF,
      'calc(' : calc,
      ',' : {
        single : true,
        attrs : attrs.comma
      },
      ')' : {
        single : true,
        attrs : attrs.functions.func
      },
      default : {
        functions : functions,
        run : function ( word, words, letter, sentence, sets, subset ) {
          if ( this.functions.number(subset, word) ) {
            return attrs.red;
          }
          return attrs.mistake;
        }
      }
    }
  }
};
