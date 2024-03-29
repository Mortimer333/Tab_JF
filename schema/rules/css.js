import styles from '../dictionary/css.js';
import functions from '../functions/css.js';
import pseudoClasses from './css/pseudoClasses.js';
import variable from './css/variable.js';
import varF from './css/functions/var.js';
import calc from './css/functions/calc.js';
import rgb from './css/functions/rgb.js';
import hsl from './css/functions/hsl.js';
import hwb from './css/functions/hwb.js';
import url from './css/functions/url.js';
import blur from './css/functions/blur.js';
import brightness from './css/functions/brightness.js';
import contrast from './css/functions/contrast.js';
import dropShadow from './css/functions/dropShadow.js';
import greyscale from './css/functions/greyscale.js';
import hueRotate from './css/functions/hueRotate.js';
import invert from './css/functions/invert.js';
import opacity from './css/functions/opacity.js';
import sepia from './css/functions/sepia.js';
import saturate from './css/functions/saturate.js';
import linearGradient from './css/functions/linearGradient.js';
import stylistic from './css/functions/stylistic.js';
import styleset from './css/functions/styleset.js';
import characterVariant from './css/functions/characterVariant.js';
import swash from './css/functions/swash.js';
import ornaments from './css/functions/ornaments.js';
import annotation from './css/functions/annotation.js';
import minmax from './css/functions/minmax.js';
import fitContent from './css/functions/fitContent.js';
import repeat from './css/functions/repeat.js';
import matrix from './css/functions/matrix.js';
import perspective from './css/functions/perspective.js';
import rotate from './css/functions/rotate.js';
import rotate3d from './css/functions/rotate3d.js';
import rotateX from './css/functions/rotatex.js';
import scale from './css/functions/scale.js';
import scaleX from './css/functions/scaleX.js';
import skew from './css/functions/skew.js';
import skewX from './css/functions/skewX.js';
import translate from './css/functions/translate.js';
import translateX from './css/functions/translateX.js';
import cubicBezier from './css/functions/cubicBezier.js';
import steps from './css/functions/steps.js';
import clamp from './css/functions/clamp.js';
import conicGradient from './css/functions/conicGradient.js';
import radialGradient from './css/functions/radialGradient.js';
import crossFade from './css/functions/crossFade.js';
import counter from './css/functions/counter.js';
import counters from './css/functions/counters.js';
import symbols from './css/functions/symbols.js';
import circle from './css/functions/circle.js';
import inset from './css/functions/inset.js';
import polygon from './css/functions/polygon.js';
import path from './css/functions/path.js';
import env from './css/functions/env.js';
import selectors from './css/selectors.js';
import attrs from './css/attrs.js';
import doubleQuote from './css/doubleQuote.js';
import singleQuote from './css/singleQuote.js';
selectors[':'] = pseudoClasses;
selectors[':'].subset.sets["host("].subset.sets = Object.assign(selectors[':'].subset.sets["host("].subset.sets, selectors);
selectors[':'].subset.sets["host-context("].subset.sets = Object.assign(selectors[':'].subset.sets["host-context("].subset.sets, selectors);
selectors[':'].subset.sets["not("].subset.sets = Object.assign(selectors[':'].subset.sets["not("].subset.sets, selectors);
selectors[':'].subset.sets["is("].subset.sets = Object.assign(selectors[':'].subset.sets["is("].subset.sets, selectors);
selectors[':'].subset.sets["where("].subset.sets = Object.assign(selectors[':'].subset.sets["where("].subset.sets, selectors);

let paths = {
  global : {
    '/*' : {
      attrs : attrs.comment,
      end : "*/",
      subset : {
        sets : {
          default : {
            attrs : attrs.comment
          }
        }
      }
    },
    '*/' : {
      attrs : attrs.comment
    },
    ' ' : {
      single : true,
      attrs : attrs.spaces
    }
  },
  subset : {
    sets : {
      '{' : {
        attrs : attrs.rules.braces,
        end : '}',
        selfref : true,
        start : '{',
        subset : {
          sets : {
            ':' : {
              attrs : attrs.rules.colon,
              end : ';',
              triggers : {
                end : [
                  function (i, word, words, letter, sentence, group) {
                    group.subset.sets.default.wordCount = 0;
                  }
                ]
              },
              subset : {
                sets : {
                  ' ' : {
                    single: true,
                    run : function (word, words, letter, sentence, sets) {
                      if (words.length == 0) {
                        return attrs.spaces;
                      }
                      const content = words[words.length - 1].content;
                      if (content != ' ' && content != ':') {
                        sets.default.wordCount++;
                      }
                      return attrs.spaces;
                    }
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
                      return attrs.red;
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
                        return attrs.red;
                      }
                      return attrs.mistake;
                    }
                  },
                  '"' : doubleQuote,
                  "'" : singleQuote,
                  ')' : {
                    single : true,
                    attrs : attrs.rules.parenthesis
                  },
                  'calc(' : calc,
                  'var(' : varF,
                  'rgb(' : rgb,
                  'rgba(' : rgb,
                  'hsl(' : hsl,
                  'hsla(' : hsl,
                  'hwb(' : hwb,
                  'url(' : url,
                  'blur(' : blur,
                  'brightness(' : brightness,
                  'contrast(' : contrast,
                  'drop-shadow(' : dropShadow,
                  'greyscale(' : greyscale,
                  'hue-rotate(' : hueRotate,
                  'invert(' : invert,
                  'opacity(' : opacity,
                  'sepia(' : sepia,
                  'saturate(' : saturate,
                  'linear-gradient(' : linearGradient,
                  'stylistic(' : stylistic,
                  'styleset(' : styleset,
                  'characterVariant(' : characterVariant,
                  'swash(' : swash,
                  'ornaments(' : ornaments,
                  'annotation(' : annotation,
                  'minmax(' : minmax,
                  'fit-content(' : fitContent,
                  'repeat(' : repeat,
                  'matrix(' : matrix,
                  'matrix3d(' : matrix,
                  'perspective(' : perspective,
                  'rotate(' : rotate,
                  'rotate3d(' : rotate3d,
                  'rotateX(' : rotateX,
                  'rotateY(' : rotateX,
                  'rotateZ(' : rotateX,
                  'scale(' : scale,
                  'scaleX(' : scaleX,
                  'scaleY(' : scaleX,
                  'scale3d(' : scale,
                  'skew(' : skew,
                  'skewX(' : skewX,
                  'skewY(' : skewX,
                  'translate(' : translate,
                  'translate3d(' : translate,
                  'translateX(' : translateX,
                  'translateY(' : translateX,
                  'translateZ(' : translateX,
                  'cubic-bezier(' : cubicBezier,
                  'steps(' : steps,
                  'clamp(' : clamp,
                  'max(' : clamp,
                  'min(' : clamp,
                  'conic-gradient(' : conicGradient,
                  'radial-gradient(' : radialGradient,
                  'repeating-linear-gradient(' : linearGradient,
                  'repeating-conic-gradient(' : conicGradient,
                  'repeating-radial-gradient(' : radialGradient,
                  'cross-fade(' : crossFade,
                  'counter(' : counter,
                  'counters(' : counters,
                  'symbols(' : symbols,
                  'circle(' : circle,
                  'ellipse(' : circle,
                  'inset(' : inset,
                  'polygon(' : polygon,
                  'path(' : path,
                  'env(' : env,
                  default : {
                    validation : null,
                    wordCount : 0,
                    functions : functions,
                    rule : '',
                    run : function (word, words, letter, sentence, sets) {
                      // this.wordCount++;
                      const res = this.functions.validateValue(word, this.validation, words, this.wordCount);
                      return res;
                    }
                  }
                }
              }
            },
            ';' : {
              attrs : attrs.rules.semiColon,
              single : true
            },
            ',' : {
              attrs : attrs.comma
            },
            '--' : variable,
            '}' : {
              attrs : attrs.rules.braces
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
                  return attrs.white;
                }
                let rules = this.functions.getValue.bind(this.functions)(word, this.rules);
                if (!rules) {
                  sets[':'].subset.sets.default.validation = null;
                  return attrs.mistake;
                }

                rules = this.functions.mergeDefaultRules.bind(this.functions)( rules );
                sets[':'].subset.sets.default.validation = rules;

                sets[':'].subset.sets.default.rule = word;
                return attrs.rules.rule;
              },

            }
          }
        }
      },
      '}' : {
        attrs : attrs.rules.braces
      },
      default : {
        attrs : attrs.customTag
      }
    }
  }
};
paths.subset.sets = Object.assign(paths.subset.sets, selectors);
export default paths;
