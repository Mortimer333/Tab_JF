import singleQuote from './singleQuote.js';
import doubleQuote from './doubleQuote.js';
let varFunction; export default varFunction = {
  attrs : {
    style : 'color:pink;'
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
      '--' : {
        end : {
          ',' : true,
          ')' : true
        },
        attrs : {
          style : 'color:#F00;'
        },
        subset : {
          sets : {
            default : {
              attrs : {
                style : 'color:#F00;'
              }
            }
          }
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
      '"' : doubleQuote,
      "'" : singleQuote,
      default : {
        run :  function (word) {
          console.log(word);
          return {
            style : 'color:#e67e22;'
          }
        }
      }
    }
  }
}
