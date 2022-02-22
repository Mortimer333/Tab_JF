import attrs from '../attrs.js';
import functions from '../../../functions/css.js';
let nthChild; export default nthChild = {
  attrs: attrs.pseudo.function,
  end : ")",
  subset : {
    sets : {
      "odd" : {
        attrs : attrs.red
      },
      "even" : {
        attrs : attrs.red
      },
      "+" : {
        single : true,
        attrs : attrs.red
      },
      "-" : {
        single : true,
        attrs : attrs.red
      },
      "n" : {
        attrs : attrs.pseudo.nth.n
      },
      default : {
        functions : functions,
        run : function (word, words, letter, sentence, sets, subset) {
          if (this.functions.number(sets, word)) {
            return attrs.white;
          }

          return attrs.mistake;
        }
      }
    }
  }
}
