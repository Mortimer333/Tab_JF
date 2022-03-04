import functions from '../../functions/css.js';
import lang from './pseudoClasses/lang.js';
import attrs from './attrs.js';
import nthChild from './pseudoClasses/nthChild.js';
const pseudoClass = {
  attrs: attrs.pseudo.function
};
const operator = {
  single : true,
  attrs : attrs.operator
};
let pseudoClasses; export default pseudoClasses = {
  attrs : attrs.pseudo.function,
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
        attrs: attrs.pseudo.function
      },
      ":after": pseudoClass,
      ":before": pseudoClass,
      "active": pseudoClass,
      "any-link": pseudoClass,
      "autofill": pseudoClass,
      "blank": pseudoClass,
      "checked": pseudoClass,
      "current": pseudoClass,
      "defined": pseudoClass,
      "dir(": {
        attrs: attrs.pseudo.function,
        end : ')',
        subset : {
          sets : {
            "ltr" : {
              attrs : attrs.red
            },
            "rtl" : {
              attrs : attrs.red
            },
            default : {
              attrs : attrs.mistake
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
        attrs: attrs.pseudo.function,
        end : ')',
        subset : {
          sets : {
            "+" : operator,
            ">" : operator,
            "~" : operator,
            "||" : operator,
            default : {
              attrs : attrs.white
            }
          }
        }
      },
      "host": pseudoClass,
      "host(": {
        attrs: attrs.pseudo.function,
        end : ')',
        subset : {
          sets : { // Set selectors here
            ')' : pseudoClass
          }
        }
      },
      "host-context(": {
        attrs: attrs.pseudo.function,
        end : ')',
        subset : {
          sets : { // Set selectors here
            ')' : pseudoClass
          }
        }
      },
      "hover": pseudoClass,
      "indeterminate": pseudoClass,
      "in-range": pseudoClass,
      "invalid": pseudoClass,
      "is(": {
        attrs: attrs.pseudo.function,
        end : ")",
        subset : {
          sets : { // Set selectors here
            "," : {
              single : true,
              attrs : attrs.comma
            },
            ')' : pseudoClass
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
        attrs: attrs.pseudo.function,
        end : ')',
        subset : {
          sets : { // Set selectors here
            "," : {
              single : true,
              attrs : attrs.comma
            },
            ')' : pseudoClass
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
        attrs: attrs.pseudo.function,
        end : ')',
        subset : {
          sets : { // Set selectors here
            "," : {
              single : true,
              attrs : attrs.comma
            },
            ')' : pseudoClass
          }
        }
      },
      default : {
        run : function (word, words, letter, sentence, subset) {
          if (word == 'default') {
            return attrs.pseudo.function
          }
          return attrs.mistake;
        }
      }
    }
  }
};
