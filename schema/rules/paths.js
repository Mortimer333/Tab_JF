import styles from '../dictionary/styles.js';
import functions from '../functions/styles.js';
console.log(functions);
let paths; export default paths = {
  // I need to describe
  // what part of the word I need
  // how this part must look like (rules)
  // color
  // what starts a word
  // what ends a word
  sets : {
    '.' : {
      // valid : /-?[_a-zA-Z]+[_a-zA-Z0-9-]*/,
      // end : /[^\a-zA-z0-9/-_]/,
      attrs : {
        style : 'color:#F00;'
      }
    },
    '#' : {
      // valid : /-?[_a-zA-Z]+[_a-zA-Z0-9-]*/,
      // end : /[^\a-zA-z0-9/-_]/,
      attrs : {
        style : 'color:#0F0;'
      }
    },
    ']' : {
      attrs : {
        style : 'color:#00F;'
      }
    },
    '[' : {
      // valid : /-?[_a-zA-Z]+[_a-zA-Z0-9-]*/,
      attrs : {
        style : 'color:#00F;'
      },
      end : ']',
      subset : {
        sets : {
          '=' : {
            attrs : {
              style : 'color:#0FF;'
            }
          },
          '"' : {
            attrs : {
              style : 'color:#FF0;'
            }
          },
          "'" : {
            attrs : {
              style : 'color:#FF0;'
            }
          },
          default : {
            attrs : {
              style : 'color:#ABC;'
            }
          }
        }
      }
    },
    '{' : {
      attrs : {
        style : 'color:#AEE;'
      },
      end : '}',
      subset : {
        dictionary : {
          rules : styles,
          styles : {
            name : {
              style : 'color:#0DA'
            },
            value : {
              style : 'color:#F00'
            }
          }
        },
        functions : functions,
        trim : true,
        joiners : {
          '-' : true
        },
        value : {
          seperators : {
            max : ' ',
            reset : ','
          }
        },
        name : {
          start : ';',
          end : ':'
        },
        sets : {
          ':' : {
            attrs : {
              style : 'color:#AEE;'
            }
          },
          ';' : {
            attrs : {
              style : 'color:#AEE;'
            }
          },
          ',' : {
            attrs : {
              style : 'color:#F00;'
            }
          },
          ' ' : {
            attrs : {
              class : 'spaces'
            },
            // @TODO for now leave it be. It means to create a subset only for spaces, if anything else then space
            // will appear then stop subset and add this word with class spaces
            // subset : {
            //   regex : true,
            //   rules : {
            //     '[^ ]' : {
            //       end : true
            //     }
            //   }
            // }
          }
        }
      }
    },
    '}' : {
      attrs : {
        style : 'color:#AEE;'
      }
    },
    ':' : {
      attrs : {
        style : 'color:#FEE;'
      }
    },
    '@' : {
      attrs : {
        style : 'color:#EBE;'
      }
    },
    ' ' : {
      attrs : {
        style : 'color:#DDD;'
      }
    },
    default : {
      attrs : {
        style : 'color:#ECB;'
      }
    }
  }
};
