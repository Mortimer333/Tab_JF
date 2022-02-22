import attrs from '../attrs.js';
import varF from './var.js';
import calc from './calc.js';
let characterVariant; export default characterVariant = {
  attrs : attrs.functions.func,
  end : ")",
  subset : {
    sets : {
      'var(' : varF,
      'calc(' : calc,
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
