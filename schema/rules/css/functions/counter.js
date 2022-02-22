import attrs from '../attrs.js';
import varF from './var.js';
let counter; export default counter = {
  attrs : attrs.functions.func,
  end : ")",
  subset : {
    sets : {
      'var(' : varF,
      ')' : {
        single : true,
        attrs : attrs.functions.func
      },
      ',' : {
        single : true,
        attrs : attrs.comma
      },
      default : {
        attrs : attrs.red
      }
    }
  }
};
