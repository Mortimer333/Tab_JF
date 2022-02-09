import functions from '../../../functions/css.js';
import varF from './var.js';
import calc from './calc.js';
let steps; export default steps = {
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
      'jump-start' : {
        attrs : {
          style : 'color:#F00;'
        }
      },
      'jump-end' : {
        attrs : {
          style : 'color:#F00;'
        }
      },
      'jump-both' : {
        attrs : {
          style : 'color:#F00;'
        }
      },
      'jump-none' : {
        attrs : {
          style : 'color:#F00;'
        }
      },
      'start' : {
        attrs : {
          style : 'color:#F00;'
        }
      },
      'end' : {
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
      default : {
        functions : functions,
        run : function ( word, words, letter, sentence, sets, subset ) {
          if (this.functions.number(subset, word)) {
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
