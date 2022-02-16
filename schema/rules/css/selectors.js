import pseudoClasses from './pseudoClasses.js';
import tags from './tags.js';
let selectors = {
  '*' : {
    single : true,
    attrs : {
      style : 'color:#F00;'
    }
  },
  '.' : {
    attrs : {
      style : 'color:#F00;'
    }
  },
  '#' : {
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
  ':' : {}, // Set pseudo classes
  '@' : {
    run : function ( word, words, letter, sentence, sets, subset ) {
      subset.sets['{'].subset.sets.default.animation = true;
      return {
        style : 'color:#EBE;'
      };
    }
  },
  ' ' : {
    attrs : {
      class : 'spaces'
    },
    single : true
  },
  "+" : {
    single : true,
    attrs : {
      style: "color:red;"
    }
  },
  ">" : {
    single : true,
    attrs : {
      style: "color:red;"
    }
  },
  "~" : {
    single : true,
    attrs : {
      style: "color:red;"
    }
  },
  "||" : {
    single : true,
    attrs : {
      style: "color:red;"
    }
  }
};
selectors = Object.assign(selectors, tags);
export default selectors;
