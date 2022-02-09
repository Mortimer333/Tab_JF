import varF from './var.js';
import singleQuote from './singleQuote.js';
import doubleQuote from './doubleQuote.js';
import url from './url.js';
let counter; export default counter = {
  attrs : {
    style : 'color:pink;'
  },
  end : ")",
  subset : {
    sets : {
      'var(' : varF,
      '"' : doubleQuote,
      "'" : singleQuote,
      'url(': url,
      ')' : {
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
      ',' : {
        single : true,
        attrs : {
          style : 'color:#F00;'
        }
      },
      'cyclic' : {
        attrs : {
          style : 'color:pink;'
        }
      },
      'numeric' : {
        attrs : {
          style : 'color:pink;'
        }
      },
      'alphabetic' : {
        attrs : {
          style : 'color:pink;'
        }
      },
      'symbolic' : {
        attrs : {
          style : 'color:pink;'
        }
      },
      'fixed' : {
        attrs : {
          style : 'color:pink;'
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
