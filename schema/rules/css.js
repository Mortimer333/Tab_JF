import styles from '../dictionary/css.js';
import functions from '../functions/css.js';
let paths; export default paths = {
  subset : {
    sets : {
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
        subset : {
          sets : {
            // 'calc' : {
            //   attrs : {
            //     style : 'text-decoration:underline;'
            //   }
            // },
            ':' : {
              attrs : {
                style : 'color:#AEE;'
              },
              end : ';',
              single : true,
              triggers : {
                end : function (word, words, letter, sentence, sets) {
                  sets.default.wordCount = 0;
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
                  '(' : {
                    attrs : {
                      style : 'color:#F00;'
                    },
                    end : ')',
                    start : '(',
                    selfref : true,
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
                              number : true
                            },
                            functions : {
                              calc : true,
                              var : true
                            }
                          },
                          run : function (word, words, letter, sentence, sets) {
                            return this.functions.validateValue(word, this.validation, words);
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
                  default : {
                    validation : null,
                    wordCount : 0,
                    functions : functions,
                    rule : '',
                    run : function (word, words, letter, sentence, sets) {
                      this.wordCount++;
                      return this.functions.validateValue(word, this.validation, words, this.wordCount);
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
            default : {
              rules : styles,
              functions : functions,
              run : function (word, words, letter, sentence, sets) {
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
        attrs : {
          style : 'color:#EBE;'
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
