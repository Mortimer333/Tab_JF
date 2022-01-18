import { SyntaxTest } from '../syntax.js';
import testdata from './testdata.js';

class SyntaxCssTest extends SyntaxTest {
  constructor (instance) {
    super(instance, testdata);
    this.instance.render.init();
    this.instance.syntax.init();
    this.instance.render.move.page();
  }
}
export { SyntaxCssTest };
