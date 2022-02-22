import attrs from '../attrs.js';
import functions from '../../../functions/css.js';
import varF from './var.js';
let calc = {
  attrs : attrs.functions.func,
  end : ")",
  subset : {
    sets : {
      'var(' : varF,
      ',' : {
        single : true,
        attrs :attrs.comma
      },
      '+' : {
        single : true,
        attrs : attrs.operator
      },
      '-' : {
        single : true,
        attrs : attrs.operator
      },
      '*' : {
        single : true,
        attrs : attrs.operator
      },
      '/' : {
        single : true,
        attrs : attrs.operator
      },
      ')' : {
        single : true,
        attrs : attrs.functions.func
      },
      default : {
        functions : functions,
        run : function ( word, words, letter, sentence, sets, subset ) {
          if (
            this.functions.number(subset, word)
            || this.functions.length(subset, word)
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
calc.subset.sets['('] = calc;
export default calc;
