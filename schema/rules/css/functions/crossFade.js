import functions from '../../../functions/css.js';
import varF from './var.js';
import calc from './calc.js';
import url from './url.js';
let crossFade; export default crossFade = {
  attrs : {
    style : 'color:pink;'
  },
  end : ")",
  subset : {
    sets : {
      'var(' : varF,
      'calc(' : calc,
      'url(' : url,
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
      default : {
        functions : functions,
        run : function ( word, words, letter, sentence, sets, subset ) {
          if (this.functions.procent(subset, word)) {
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
