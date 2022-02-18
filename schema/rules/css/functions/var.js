import singleQuote from './singleQuote.js';
import doubleQuote from './doubleQuote.js';
let varF; export default varF = {
  end : ')',
  attrs : {
    style : 'color:pink;'
  },
  subset : {
    sets : {
      '(' : {
        single : true,
        attrs : {
          style : 'color:#F00;'
        }
      },
      '"' : doubleQuote,
      "'" : singleQuote,
      ',' : {
        single : true,
        attrs : {
          style : 'color:#F00;'
        }
      },
      '--' : {
        end : {
          ',' : true,
          ')' : true
        },
        triggers : {
          end : [
            function ( i, word, words, letter, sentence, group, syntax ) {
              if (letter == ')') syntax.endSubset();
            }
          ]
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
