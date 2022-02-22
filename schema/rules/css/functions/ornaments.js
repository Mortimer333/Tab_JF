import attrs from '../attrs.js';
import functions from '../../../functions/css.js';
import varF from './var.js';
import calc from './calc.js';
let ornaments; export default ornaments = {
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
      default : {
        functions : functions,
        run : function ( word, words, letter, sentence, sets, subset ) {
          return attrs.red;
        }
      }
    }
  }
};
