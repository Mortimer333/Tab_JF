import functions from '../../functions/css.js';
const color = "color:pink;";
let pseudoClasses; export default pseudoClasses = {
  attrs : {
    style : color
  },
  end : {
    ' ' : true,
    '{' : true
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
      "active": {
        attrs: {
          style: color
        }
      },
      "any-link": {
        attrs: {
          style: color
        }
      },
      "autofill": {
        attrs: {
          style: color
        }
      },
      "blank": {
        attrs: {
          style: color
        }
      },
      "checked": {
        attrs: {
          style: color
        }
      },
      "current": {
        attrs: {
          style: color
        }
      },
      "defined": {
        attrs: {
          style: color
        }
      },
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
      "disabled": {
        attrs: {
          style: color
        }
      },
      "empty": {
        attrs: {
          style: color
        }
      },
      "enabled": {
        attrs: {
          style: color
        }
      },
      "first": {
        attrs: {
          style: color
        }
      },
      "first-child": {
        attrs: {
          style: color
        }
      },
      "first-of-type": {
        attrs: {
          style: color
        }
      },
      "fullscreen": {
        attrs: {
          style: color
        }
      },
      "future": {
        attrs: {
          style: color
        }
      },
      "focus": {
        attrs: {
          style: color
        }
      },
      "focus-visible": {
        attrs: {
          style: color
        }
      },
      "focus-within": {
        attrs: {
          style: color
        }
      },
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
      "host": {
        attrs: {
          style: color
        }
      },
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
      "hover": {
        attrs: {
          style: color
        }
      },
      "indeterminate": {
        attrs: {
          style: color
        }
      },
      "in-range": {
        attrs: {
          style: color
        }
      },
      "invalid": {
        attrs: {
          style: color
        }
      },
      "is()": {
        attrs: {
          style: color
        }
      },
      "lang()": {
        attrs: {
          style: color
        }
      },
      "last-child": {
        attrs: {
          style: color
        }
      },
      "last-of-type": {
        attrs: {
          style: color
        }
      },
      "left": {
        attrs: {
          style: color
        }
      },
      "link": {
        attrs: {
          style: color
        }
      },
      "local-link": {
        attrs: {
          style: color
        }
      },
      "not()": {
        attrs: {
          style: color
        }
      },
      "nth-child()": {
        attrs: {
          style: color
        }
      },
      "nth-col()": {
        attrs: {
          style: color
        }
      },
      "nth-last-child()": {
        attrs: {
          style: color
        }
      },
      "nth-last-col()": {
        attrs: {
          style: color
        }
      },
      "nth-last-of-type()": {
        attrs: {
          style: color
        }
      },
      "nth-of-type()": {
        attrs: {
          style: color
        }
      },
      "only-child": {
        attrs: {
          style: color
        }
      },
      "only-of-type": {
        attrs: {
          style: color
        }
      },
      "optional": {
        attrs: {
          style: color
        }
      },
      "out-of-range": {
        attrs: {
          style: color
        }
      },
      "past": {
        attrs: {
          style: color
        }
      },
      "picture-in-picture": {
        attrs: {
          style: color
        }
      },
      "placeholder-shown": {
        attrs: {
          style: color
        }
      },
      "paused": {
        attrs: {
          style: color
        }
      },
      "playing": {
        attrs: {
          style: color
        }
      },
      "read-only": {
        attrs: {
          style: color
        }
      },
      "read-write": {
        attrs: {
          style: color
        }
      },
      "required": {
        attrs: {
          style: color
        }
      },
      "right": {
        attrs: {
          style: color
        }
      },
      "root": {
        attrs: {
          style: color
        }
      },
      "scope": {
        attrs: {
          style: color
        }
      },
      "state()": {
        attrs: {
          style: color
        }
      },
      "target": {
        attrs: {
          style: color
        }
      },
      "target-within": {
        attrs: {
          style: color
        }
      },
      "user-invalid": {
        attrs: {
          style: color
        }
      },
      "valid": {
        attrs: {
          style: color
        }
      },
      "visited": {
        attrs: {
          style: color
        }
      },
      "where()": {
        attrs: {
          style: color
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
