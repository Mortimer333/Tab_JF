let variable; export default variable = {
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
  attrs : {
    style : 'color:#F00;'
  },
  subset : {
    sets : {
      default : {
        attrs : {
          style : 'color:#F00;'
        }
      }
    }
  }
};
