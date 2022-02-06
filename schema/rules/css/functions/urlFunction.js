import varFunction from './varFunction.js';
import singleQuote from './singleQuote.js';
import doubleQuote from './doubleQuote.js';
let urlFunction; export default urlFunction = {
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
      'var' : varFunction,
      '"' : doubleQuote,
      "'" : singleQuote,
      '#' : {
        attrs : {
          style : 'color:#0FF;'
        }
      },
      'data' : {
        attrs : {
          style : 'color:#F0F;'
        },
        end : ',',
        subset : {
          sets : {
            'base64' : {
              attrs : {
                style : 'color:#FFF;'
              }
            },
            ';' : {
              single : true,
              attrs : {
                style : 'color:#FB0;'
              }
            },
            ':' : {
              single : true,
              attrs : {
                style : 'color:#FB0;'
              }
            },
            default : {
              attrs : {
                style : 'color:#0F0;'
              }
            }
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
        attrs : {
          style : 'color:#F00;'
        }
      }
    }
  }
};
