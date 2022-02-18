const color = "color:pink;";
import functions from '../../../functions/css.js';
// There is like 10k lang tags we are just going to allow anything there and hame small amount of them
const lang = {
  whole : true,
  attrs : {
    style : "color:grey"
  }
}
let nthChild; export default nthChild = {
  attrs: {
    style: color
  },
  end : ")",
  subset : {
    sets : {
      "odd" : {
        attrs : {
          style : "color:#F00;"
        }
      },
      "even" : {
        attrs : {
          style : "color:#F00;"
        }
      },
      "+" : {
        single : true,
        attrs : {
          style : "color:#F00;"
        }
      },
      "-" : {
        single : true,
        attrs : {
          style : "color:#F00;"
        }
      },
      "n" : {
        attrs : {
          style : "color:pink;"
        }
      },
      default : {
        functions : functions,
        run : function (word, words, letter, sentence, sets, subset) {
          if (this.functions.number(sets, word)) {
            return {
              style : "#FFF;"
            };
          }

          return {
            class : "mistake"
          };
        }
      }
    }
  }
}
