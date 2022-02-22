import attrs from '../attrs.js';
import varF from './var.js';
import singleQuote from '../singleQuote.js';
import doubleQuote from '../doubleQuote.js';
let url; export default url = {
  attrs : attrs.functions.func,
  end : ")",
  subset : {
    sets : {
      'var(' : varF,
      '"' : doubleQuote,
      "'" : singleQuote,
      '#' : {
        attrs : attrs.id
      },
      'data' : {
        attrs : attrs.functions.url.data,
        end : ',',
        subset : {
          sets : {
            'base64' : {
              attrs : attrs.functions.url.dataSubset.base
            },
            ';' : {
              single : true,
              attrs : attrs.functions.url.dataSubset.semiColon
            },
            ':' : {
              single : true,
              attrs : attrs.functions.url.dataSubset.colon
            },
            default : {
              attrs : attrs.functions.url.dataSubset.default
            }
          }
        }
      },
      ')' : {
        single : true,
        attrs : attrs.functions.func
      },
      default : {
        attrs : attrs.red
      }
    }
  }
};
