import attrs from '../attrs.js';
import functions from '../../../functions/css.js';
import varF from './var.js';
import calc from './calc.js';
let steps; export default steps = {
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
      'jump-start' : {
        attrs : attrs.red
      },
      'jump-end' : {
        attrs : attrs.red
      },
      'jump-both' : {
        attrs : attrs.red
      },
      'jump-none' : {
        attrs : attrs.red
      },
      'start' : {
        attrs : attrs.red
      },
      'end' : {
        attrs : attrs.red
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
