import attrs from '../attrs.js';
import functions from '../../../functions/css.js';
import calc from './calc.js';
import varF from './var.js';
import rgb from './rgb.js';
import hsl from './hsl.js';
import hwb from './hwb.js';

let linearGradient; export default linearGradient = {
  attrs : attrs.functions.func,
  end : ")",
  subset : {
    sets : {
      'to' : {
        attrs : attrs.pink
      },
      'left' : {
        attrs : attrs.pink
      },
      'right' : {
        attrs : attrs.pink
      },
      'bottom' : {
        attrs :attrs.pink
      },
      'top' : {
        attrs : attrs.pink
      },
      'var(' : varF,
      'calc(' : calc,
      'rgb(' : rgb,
      'rgba(' : rgb,
      'hsl(' : hsl,
      'hsla(' : hsl,
      'hwb(' : hwb,
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
          if (
            this.functions.color(subset, word)
            || this.functions.length(subset, word)
            || this.functions.turn(subset, word)
            || this.functions.procent(subset, word)
            || this.functions.degree(subset, word)
          ) {
            return attrs.red;
          }
          return attrs.mistake;
        }
      }
    }
  }
};
