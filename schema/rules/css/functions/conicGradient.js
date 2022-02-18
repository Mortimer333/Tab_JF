import functions from '../../../functions/css.js';
import varF from './var.js';
import calc from './calc.js';
import rgb from './rgb.js';
import hsl from './hsl.js';
import hwb from './hwb.js';
let conicGradient; export default conicGradient = {
  attrs : {
    style : 'color:pink;'
  },
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
        attrs : {
          style : 'color:#F00;'
        }
      },
      ',' : {
        single : true,
        attrs : {
          style : 'color:#F00;'
        }
      },
      'center' : {
        attrs : {
          style : 'color:pink;'
        }
      },
      'top' : {
        attrs : {
          style : 'color:pink;'
        }
      },
      'bottom' : {
        attrs : {
          style : 'color:pink;'
        }
      },
      'left' : {
        attrs : {
          style : 'color:pink;'
        }
      },
      'right' : {
        attrs : {
          style : 'color:pink;'
        }
      },
      'to' : {
        attrs : {
          style : 'color:pink;'
        }
      },
      'from' : {
        attrs : {
          style : 'color:pink;'
        }
      },
      'at' : {
        attrs : {
          style : 'color:pink;'
        }
      },
      default : {
        functions : functions,
        run : function ( word, words, letter, sentence, sets, subset ) {
          if (
            this.functions.color(subset, word)
            || this.functions.length(subset, word)
            || this.functions.degree(subset, word)
            || this.functions.turn(subset, word)
            || this.functions.grad(subset, word)
            || this.functions.rad(subset, word)
            || this.functions.procent(subset, word)
          ) {
            return {
              style : 'color:#F00;'
            };
          }
          return {
            class : 'mistake'
          };
        }
      }
    }
  }
};
