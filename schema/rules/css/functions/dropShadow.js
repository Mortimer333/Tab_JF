import functions from '../../../functions/css.js';
import varF from './var.js';
import calc from './calc.js';
import rgb from './rgb.js';
import hsl from './hsl.js';
import hwb from './hwb.js';

function updateWordCount ( letter, letterSet, word, words, sentence, subset ) {
  subset.sets.default.wordCount++;
}

varF.triggers = !!varF?.triggers ? varF.triggers : {};
calc.triggers = !!calc?.triggers ? calc.triggers : {};
rgb.triggers = !!rgb?.triggers ? rgb.triggers : {};
hsl.triggers = !!hsl?.triggers ? hsl.triggers : {};
hwb.triggers = !!hwb?.triggers ? hwb.triggers : {};

varF.triggers.start = !!varF.triggers?.start ? varF.triggers.start : [];
calc.triggers.start = !!calc.triggers?.start ? calc.triggers.start : [];
rgb.triggers.start = !!rgb.triggers?.start ? rgb.triggers.start : [];
hsl.triggers.start = !!hsl.triggers?.start ? hsl.triggers.start : [];
hwb.triggers.start = !!hwb.triggers?.start ? hwb.triggers.start : [];

varF.triggers.start.push(updateWordCount);
calc.triggers.start.push(updateWordCount);
rgb.triggers.start.push(updateWordCount);
hsl.triggers.start.push(updateWordCount);
hwb.triggers.start.push(updateWordCount);

let dropShadow; export default dropShadow = {
  attrs : {
    style : 'color:pink;'
  },
  end : ")",
  triggers : {
    end : [
      function () {
        this.subset.sets.default.wordCount = 0;
      }
    ]
  },
  subset : {
    sets : {
      'var(' : varF,
      'calc(' : calc,
      'rgb(' : rgb,
      'rgba(' : rgb,
      'hsl(' : hsl,
      'hsla(' : hsl,
      'hwb(' : hwb,
      ')' : {
        single : true,
        attrs : {
          style : 'color:#F00;'
        }
      },
      default : {
        functions : functions,
        wordCount : 0,
        max : 4,
        run : function ( word, words, letter, sentence, sets, subset ) {
          this.wordCount++;
          if ((
              this.functions.length(subset, word)
              || this.functions.color(subset, word)
            )
            && this.max >= this.wordCount
          ) {
            return {
              style : 'color:#F00;'
            };
          }

          return {
            class : 'mistake'
          };
        }
      }
    }
  }
};
