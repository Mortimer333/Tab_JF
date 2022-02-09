import functions from '../../../functions/css.js';
import varF from './var.js';
import calc from './calc.js';
let characterVariant; export default characterVariant = {
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
      default : {
        functions : functions,
        run : function ( word, words, letter, sentence, sets, subset ) {
          return {
            style : 'color:#F00;'
          };
        }
      }
    }
  }
};
