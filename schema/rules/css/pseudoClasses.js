import functions from '../../functions/css.js';
import lang from './pseudoClasses/lang.js';
import nthChild from './pseudoClasses/nthChild.js';
const color = "color:pink;";
const name = "pseudoClass";
const pseudoClass = {
  run : function (word, words, letter, sentence, sets, subset, syntax) {
    if (syntax.groups[0]?.name == name) {
      // syntax.endSubset();
    }

    return {
      style: color
    };
  }
}
let pseudoClasses; export default pseudoClasses = {
  attrs : {
    style : color
  },
  end : {
    ' ' : true,
    '{' : true,
    ')' : true
  },
  triggers : {
    end : [
      function ( i, word, words, letter, sentence, group, syntax) {
        // Weird check for pseudo class without subset in pseudo class with subset
        if (
          sentence[1] != ')'
          && this.subset.sets[syntax.groups[0].start]
        ) {
          syntax.endSubset();
        }
      }
    ]
  },
  subset : {
    sets : {
      ')' : {
        single: true,
        attrs: {
          style: 'color:red;'
        }
      },
      ' ' : {
        single: true,
        attrs: {
          class: 'spaces'
        }
      },
      "active": pseudoClass,
      "any-link": pseudoClass,
      "autofill": pseudoClass,
      "blank": pseudoClass,
      "checked": pseudoClass,
      "current": pseudoClass,
      "defined": pseudoClass,
      "dir(": {
        attrs: {
          style: color
        },
        end : ')',
        subset : {
          sets : {
            ' ' : {
              single: true,
              attrs: {
                class: 'spaces'
              }
            },
            "ltr" : {
              attrs : {
                style: 'color:red;'
              }
            },
            "rtl" : {
              attrs : {
                style: 'color:red;'
              }
            },
            default : {
              attrs : {
                class : 'mistake'
              }
            }
          }
        }
      },
      "disabled": pseudoClass,
      "empty": pseudoClass,
      "enabled": pseudoClass,
      "first": pseudoClass,
      "first-child": pseudoClass,
      "first-of-type": pseudoClass,
      "fullscreen": pseudoClass,
      "future": pseudoClass,
      "focus": pseudoClass,
      "focus-visible": pseudoClass,
      "focus-within": pseudoClass,
      "has(": {
        attrs: {
          style: color
        },
        end : ')',
        subset : {
          sets : {
            "+" : {
              single : true,
              attrs : {
                style: "color:red;"
              }
            },
            ' ' : {
              single: true,
              attrs: {
                class: 'spaces'
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
            },
            default : {
              attrs : {
                style: "color:#FFF;"
              }
            }
          }
        }
      },
      "host": pseudoClass,
      "host(": {
        attrs: {
          style: color
        },
        end : ')',
        subset : {
          sets : {} // Set selectors here
        }
      },
      "host-context(": {
        attrs: {
          style: color
        },
        end : ')',
        subset : {
          sets : {} // Set selectors here
        }
      },
      "hover": pseudoClass,
      "indeterminate": pseudoClass,
      "in-range": pseudoClass,
      "invalid": pseudoClass,
      "is(": {
        attrs: {
          style: color
        },
        end : ")",
        subset : {
          sets : { // Set selectors here
            "," : {
              single : true,
              attrs : {
                style : "color:#F00;"
              }
            }
          }
        }
      },
      "lang(": lang,
      "last-child": pseudoClass,
      "last-of-type": pseudoClass,
      "left": pseudoClass,
      "link": pseudoClass,
      "local-link": pseudoClass,
      "not(": {
        attrs: {
          style: color
        },
        end : ')',
        subset : {
          sets : { // Set selectors here
            "," : {
              single : true,
              attrs : {
                style : "color:#F00;"
              }
            }
          }
        }
      },
      "nth-child(": nthChild,
      "nth-col(": nthChild,
      "nth-last-child(": nthChild,
      "nth-last-col(": nthChild,
      "nth-last-of-type(": nthChild,
      "nth-of-type(": nthChild,
      "only-child": pseudoClass,
      "only-of-type": pseudoClass,
      "optional": pseudoClass,
      "out-of-range": pseudoClass,
      "past": pseudoClass,
      "picture-in-picture": pseudoClass,
      "placeholder-shown": pseudoClass,
      "paused": pseudoClass,
      "playing": pseudoClass,
      "read-only": pseudoClass,
      "read-write": pseudoClass,
      "required": pseudoClass,
      "right": pseudoClass,
      "root": pseudoClass,
      "scope": pseudoClass,
      // "state()": pseudoClass, - no info
      "target": pseudoClass,
      "target-within": pseudoClass,
      "user-invalid": pseudoClass,
      "valid": pseudoClass,
      "visited": pseudoClass,
      "where(": {
        attrs: {
          style: color
        },
        end : ')',
        subset : {
          sets : { // Set selectors here
            "," : {
              single : true,
              attrs : {
                style : "color:#F00;"
              }
            }
          }
        }
      },
      default : {
        run : function (word, words, letter, sentence, subset) {
          if (word == 'default') {
            return {
              style: color
            }
          }
          return {
            class : "mistake"
          };
        }
      }
    }
  }
};
