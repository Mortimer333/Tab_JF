import functions from '../../functions/css.js';
let parenthesis; export default parenthesis = {
  attrs : {
    style : 'color:#F00;'
  },
  end : ')',
  start : '(',
  selfref : true,
  triggers : {
    line : {
      start : functions.line.start
    }
  },
  subset : {
    sets : {
      ')' : {
        attrs : {
          style : 'color:#F00;'
        }
      },
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
      '"' : {
        attrs : {
          style : 'color:#0F0;'
        },
        triggers : {
          line : {
            start : functions.line.start
          }
        },
        end : '"',
        subset : {
          sets : {
            ' ' : {
              single : true,
              attrs : {
                class : 'spaces'
              }
            },
            default : {
              attrs : {
                style : 'color:#0F0;'
              }
            }
          }
        }
      },
      "'" : {
        attrs : {
          style : 'color:#0F0;'
        },
        triggers : {
          line : {
            start : functions.line.start
          }
        },
        end : "'",
        subset : {
          sets : {
            ' ' : {
              single : true,
              attrs : {
                class : 'spaces'
              }
            },
            default : {
              attrs : {
                style : 'color:#0F0;'
              }
            }
          }
        }
      },
      default : {
        functions : functions,
        validation : {
          type : {
            functions : true,
            length : true,
            procent : true,
            varName : true,
            number : true,
            rad : true
          },
          functions : {
            calc : true,
            var : true
          }
        },
        run : function (word, words, letter, sentence, subset) {
          return this.functions.validateValue(word, this.validation, words);
        }
      }
    }
  }
};
