import attrs from './attrs.js';
let variable; export default variable = {
  attrs : attrs.variable,
  end :{
    ':' : true,
    ' ' : true
  },
  triggers : {
    start : [
      function ( letter, letterSet, word, words, sentence, subset ) {
        subset.sets[':'].subset.sets.default.validation = {
          type : {
            pass : true
          },
          multi : true,
          seperated : true
        };
      }
    ]
  },
  subset : {
    sets : {
      default : {
        attrs : attrs.variable
      }
    }
  }
};
