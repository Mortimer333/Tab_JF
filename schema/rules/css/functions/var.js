import attrs from '../attrs.js';
import singleQuote from '../singleQuote.js';
import doubleQuote from '../doubleQuote.js';
let varF; export default varF = {
  end : ')',
  attrs : attrs.functions.func,
  subset : {
    sets : {
      '(' : {
        single : true,
        attrs : attrs.functions.func
      },
      '"' : doubleQuote,
      "'" : singleQuote,
      ',' : {
        single : true,
        attrs : attrs.comma
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
        attrs : attrs.functions.var.doubleDash,
        subset : {
          sets : {
            default : {
              attrs : attrs.functions.var.doubleDashSubset.default
            }
          }
        }
      },
      default : {
        attrs : attrs.functions.var.default
      }
    }
  }
}
