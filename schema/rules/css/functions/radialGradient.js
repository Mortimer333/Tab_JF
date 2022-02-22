import attrs from '../attrs.js';
import functions from '../../../functions/css.js';
import varF from './var.js';
import calc from './calc.js';
import rgb from './rgb.js';
import hsl from './hsl.js';
import hwb from './hwb.js';
let radialGradient; export default radialGradient = {
  attrs : attrs.functions.func,
  end : ")",
  subset : {
    sets : {
      'var(' : varF,
      'calc(' : calc,
      'rgb(' : rgb,
      'rgba(' : rgb,
      'hsl(' : hsl,
      'hsla(' : hsl,
      'hwb(' : hwb,
      ')' : {
        single : true,
        attrs : attrs.functions.func
      },
      ',' : {
        single : true,
        attrs : attrs.comma
      },
      'ellipse' : {
        attrs : attrs.pink
      },
      'circle' : {
        attrs : attrs.pink
      },
      'closest-side' : {
        attrs : attrs.pink
      },
      'closest-corner' : {
        attrs : attrs.pink
      },
      'farthest-side' : {
        attrs : attrs.pink
      },
      'farthest-corner' : {
        attrs : attrs.pink
      },
      'center' : {
        attrs : attrs.pink
      },
      'top' : {
        attrs : attrs.pink
      },
      'bottom' : {
        attrs : attrs.pink
      },
      'left' : {
        attrs : attrs.pink
      },
      'right' : {
        attrs : attrs.pink
      },
      'at' : {
        attrs : attrs.pink
      },
      default : {
        functions : functions,
        run : function ( word, words, letter, sentence, sets, subset ) {
          if (
            this.functions.color(subset, word)
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
