import varFunction from './varFunction.js';
import singleQuote from './singleQuote.js';
import doubleQuote from './doubleQuote.js';
let calcFunction; export default calcFunction = {
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
      ',' : {
        single : true,
        attrs : {
          style : 'color:#F00;'
        }
      },
      '+' : {
        single : true,
        attrs : {
          style : 'color:#F00;'
        }
      },
      '-' : {
        single : true,
        attrs : {
          style : 'color:#F00;'
        }
      },
      '*' : {
        single : true,
        attrs : {
          style : 'color:#F00;'
        }
      },
      '/' : {
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
    }
  }
};
