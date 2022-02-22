import pseudoClasses from './pseudoClasses.js';
import tags from './tags.js';
import attrs from './attrs.js';
import doubleQuote from './doubleQuote.js';
import singleQuote from './singleQuote.js';
let selectors = {
  '*' : {
    whole : true,
    single : true,
    attrs : attrs.red
  },
  '.' : {
    attrs : attrs.class
  },
  '#' : {
    attrs : attrs.id
  },
  ']' : {
    attrs : attrs.attribute.parenthesis
  },
  '[' : {
    attrs : attrs.attribute.parenthesis,
    end : ']',
    subset : {
      sets : {
        '=' : {
          single : true,
          attrs : attrs.attribute.equal
        },
        '"' : doubleQuote,
        "'" : singleQuote,
        default : {
          attrs : attrs.white
        }
      }
    }
  },
  ':' : {}, // Set pseudo classes
  '@' : {
    run : function ( word, words, letter, sentence, sets, subset ) {
      subset.sets['{'].subset.sets.default.animation = true;
      return attrs.animation;
    }
  },
  "+" : {
    single : true,
    attrs : attrs.operator
  },
  ">" : {
    single : true,
    attrs : attrs.operator
  },
  "~" : {
    single : true,
    attrs : attrs.operator
  },
  "||" : {
    single : true,
    attrs : attrs.operator
  }
};
selectors = Object.assign(selectors, tags);
export default selectors;
