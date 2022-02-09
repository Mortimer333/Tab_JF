import functions from '../../../functions/css.js';
import varF from './var.js';
import calc from './calc.js';
let env; export default env = {
  attrs : {
    style : 'color:pink;'
  },
  end : ")",
  subset : {
    sets : {
      'var(' : varF,
      'calc(' : calc,
      ')' : {
        single : true,
        attrs : {
          style : 'color:#F00;'
        }
      },
      ' ' : {
        single : true,
        attrs : {
          class : 'spaces'
        }
      },
      ',' : {
        single : true,
        attrs : {
          style : 'color:#F00;'
        }
      },
      'safe-area-inset-top' : {
        attrs : {
          style : 'color:#F00;'
        }
      },
      'safe-area-inset-right' : {
        attrs : {
          style : 'color:#F00;'
        }
      },
      'safe-area-inset-bottom' : {
        attrs : {
          style : 'color:#F00;'
        }
      },
      'safe-area-inset-left' : {
        attrs : {
          style : 'color:#F00;'
        }
      },
      default : {
        functions : functions,
        run : function ( word, words, letter, sentence, sets, subset ) {
          if (this.functions.length(subset, word)) {
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
