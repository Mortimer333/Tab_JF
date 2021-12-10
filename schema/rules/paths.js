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
      color : '#F00'
    },
    '#' : {
      // valid : /-?[_a-zA-Z]+[_a-zA-Z0-9-]*/,
      // end : /[^\a-zA-z0-9/-_]/,
      color : '#0F0',
    },
    '[' : {
      // valid : /-?[_a-zA-Z]+[_a-zA-Z0-9-]*/,
      color : '#00F',
      subset : {
        end : /]/,
        sets : {
          '=' : {
            color : '#0FF',
          },
          '"' : {
            color : '#FF0',
          },
          "'" : {
            color : '#FF0',
          },
          default : {
            color : '#ABC'
          }
        }
      }
    },
    ':' : {
      color : '#FEE',
    },
    '@' : {
      color : '#EBE',
    },
    ' ' : {
      color : '#DDD',
    },
    default : {
      color : '#ECB'
    }
  }
};
