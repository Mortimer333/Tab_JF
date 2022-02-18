import functions from '../../../functions/css.js';
import varF from './var.js';
import calc from './calc.js';
import minmax from './minmax.js';
import fitContent from './fitContent.js';
let repeat; export default repeat = {
  attrs : {
    style : 'color:pink;'
  },
  end : ")",
  subset : {
    sets : {
      'var(' : varF,
      'calc(' : calc,
      'minmax(' : minmax,
      'fit-content(' : fitContent,
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
      'max-content' : {
        attrs : {
          style : 'color:#F00;'
        }
      },
      'min-content' : {
        attrs : {
          style : 'color:#F00;'
        }
      },
      'auto' : {
        attrs : {
          style : 'color:#F00;'
        }
      },
      'auto-fill' : {
        attrs : {
          style : 'color:#F00;'
        }
      },
      'auto-fit' : {
        attrs : {
          style : 'color:#F00;'
        }
      },
      '[' : {
        attrs : {
          style : 'color:pink;'
        },
        end : ']',
        subset : {
          sets : {
            default : {
              attrs : {
                style : 'color:#FFF'
              }
            }
          }
        }
      },
      ']' : {
        single : true,
        attrs : {
          style : 'color:pink;'
        }
      },
      default : {
        functions : functions,
        run : function ( word, words, letter, sentence, sets, subset ) {
          if (
            this.functions.length(subset, word)
            || this.functions.number(subset, word)
            || this.functions.fraction(subset, word)
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
