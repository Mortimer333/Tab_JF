import singleQuote from './singleQuote.js';
import doubleQuote from './doubleQuote.js';
let varFunction; export default varFunction = {
  end : ')',
  attrs : {
    style : 'color:pink;'
  },
  subset : {
    sets : {
      ')' : {
        single : true,
        attrs : {
          style : 'color:#F00;'
        }
      },
      '(' : {
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
      ' ' : {
        single : true,
        attrs : {
          class : 'spaces'
        }
      },
      '--' : {
        end : {
          ',' : true,
          ')' : true
        },
        triggers : {
          end : function ( word, words, letter, sentence, group, syntax ) {
            if (letter == ')') syntax.endSubset();
          }
        },
        attrs : {
          style : 'color:#F00;'
        },
        subset : {
          sets : {
            default : {
              attrs : {
                style : 'color:#FF0;'
              }
            }
          }
        }
      },
      default : {
        attrs : {
          style : 'color:#F0F;'
        }
      }
    }
  }
}
