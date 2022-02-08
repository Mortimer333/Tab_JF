import varF from './var.js';
import singleQuote from './singleQuote.js';
import doubleQuote from './doubleQuote.js';
let url; export default url = {
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
      'var(' : varF,
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
      ')' : {
        single : true,
        attrs : {
          style : 'color:#F00;'
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
