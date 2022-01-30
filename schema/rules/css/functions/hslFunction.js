import functions from '../../../functions/css.js';
import calcFunction from './calcFunction.js';
import varFunction from './varFunction.js';
let hslFunction; export default hslFunction = {
  attrs : {
    style : 'color:pink;'
  },
  triggers : {
    start : function () {
      this.subset.sets.a.set = false;
    }
  },
  end : ")",
  subset : {
    sets : {
      '(' : {
        single : true,
        attrs : {
          style : 'color:#F00;'
        }
      },
      'var' : varFunction,
      'calc' : calcFunction,
      ',' : {
        single : true,
        attrs : {
          style : 'color:#F00;'
        }
      },
      'a' : {
        set : false,
        single : true,
        run : function () {
          if (this.set) {
            return {
              class : 'mistake'
            };
          }
          this.set = true;
          return {
            style : 'color:pink;'
          }
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
          if (
            this.functions.number(subset, word)
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
