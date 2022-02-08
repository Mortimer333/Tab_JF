import styles from '../dictionary/css.js';
import functions from '../functions/css.js';
import variable from './css/variable.js';
import varF from './css/functions/var.js';
import calc from './css/functions/calc.js';
import rgb from './css/functions/rgb.js';
import hsl from './css/functions/hsl.js';
import hwb from './css/functions/hwb.js';
import url from './css/functions/url.js';
import blur from './css/functions/blur.js';
import brightness from './css/functions/brightness.js';

let paths; export default paths = {
  lines : {},
  subset : {
    sets : {
      '*' : {
        single : true,
        attrs : {
          style : 'color:#F00;'
        }
      },
      '.' : {
        attrs : {
          style : 'color:#F00;'
        }
      },
      '#' : {
        attrs : {
          style : 'color:#0F0;'
        }
      },
      ']' : {
        attrs : {
          style : 'color:#00F;'
        }
      },
      '[' : {
        attrs : {
          style : 'color:#00F;'
        },
        end : ']',
        subset : {
          sets : {
            '=' : {
              attrs : {
                style : 'color:#0FF;'
              }
            },
            '"' : {
              attrs : {
                style : 'color:#FF0;'
              }
            },
            "'" : {
              attrs : {
                style : 'color:#FF0;'
              }
            },
            default : {
              attrs : {
                style : 'color:#ABC;'
              }
            }
          }
        }
      },
      '{' : {
        attrs : {
          style : 'color:#AEE;'
        },
        end : '}',
        selfref : true,
        start : '{',
        subset : {
          sets : {
            ':' : {
              attrs : {
                style : 'color:#AEE;'
              },
              end : ';',
              triggers : {
                end : function (word, words, letter, sentence, group) {
                  group.subset.sets.default.wordCount = 0;
                },
                line : {
                  start : functions.line.start,
                  end : functions.line.end
                }
              },
              subset : {
                sets : {
                  ' ' : {
                    single : true,
                    attrs : {
                      class : 'spaces'
                    },
                  },
                  ',' : {
                    single : true,
                    run : function (word, words, letter, sentence, sets) {
                      if (
                        typeof sets.default.validation?.seperator == 'object'
                        && sets.default.validation?.seperator[',']
                        || typeof sets.default.validation?.seperator == 'undefined'
                      ) {
                        sets.default.wordCount = 0;
                      }
                      return { style : 'color:#F00;' };
                    }
                  },
                  '/' : {
                    single : true,
                    run : function (word, words, letter, sentence, sets) {
                      if (
                        typeof sets.default.validation?.seperator == 'object'
                        && sets.default.validation?.seperator['/']
                      ) {
                        sets.default.wordCount = 0;
                        return { style : 'color:#F00;' };
                      }
                      return { class : 'mistake' };
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
                  ')' : {
                    single : true,
                    attrs : {
                      style : 'color:#F00;'
                    }
                  },
                  'calc' : calc,
                  'var' : varF,
                  'rgb' : rgb,
                  'hsl' : hsl,
                  'hwb' : hwb,
                  'url' : url,
                  'blur' : blur,
                  'brightness' : brightness,
                  default : {
                    validation : null,
                    wordCount : 0,
                    functions : functions,
                    rule : '',
                    run : function (word, words, letter, sentence, sets) {
                      this.wordCount++;
                      const res = this.functions.validateValue(word, this.validation, words, this.wordCount);
                      return res;
                    }
                  }
                }
              }
            },
            ';' : {
              attrs : {
                style : 'color:#AEE;'
              },
              single : true
            },
            ',' : {
              attrs : {
                style : 'color:#F00;'
              }
            },
            ' ' : {
              single : true,
              attrs : {
                class : 'spaces'
              },
            },
            '--' : variable,
            '}' : {
              attrs : {
                style : 'color:#AEE;'
              }
            },
            default : {
              rules : styles,
              functions : functions,
              animation : false,
              run : function (word, words, letter, sentence, sets, subset) {
                if (
                  this.animation
                  && (
                    this.functions.procent(sets, word)
                    || word == 'from'
                    || word == 'to'
                  )
                ) {
                  return {
                    style : "color:#FFF"
                  };
                }
                let rules = this.functions.getValue.bind(this.functions)(word, this.rules);
                if (!rules) {
                  sets[':'].subset.sets.default.validation = null;
                  return { style : 'color:#FFF', class : 'mistake' };
                }

                rules = this.functions.mergeDefaultRules.bind(this.functions)( rules );
                sets[':'].subset.sets.default.validation = rules;

                sets[':'].subset.sets.default.rule = word;
                return { style : 'color:#0DA' };
              },

            }
          }
        }
      },
      '}' : {
        attrs : {
          style : 'color:#AEE;'
        }
      },
      ':' : {
        attrs : {
          style : 'color:#FEE;'
        }
      },
      '@' : {
        run : function ( word, words, letter, sentence, sets, subset ) {
          subset.sets['{'].subset.sets.default.animation = true;
          return {
            style : 'color:#EBE;'
          };
        }
      },
      ' ' : {
        attrs : {
          class : 'spaces'
        },
        single : true
      },
      default : {
        attrs : {
          style : 'color:#ECB;'
        }
      }
    }
  }
};
