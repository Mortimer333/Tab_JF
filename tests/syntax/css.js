import { SyntaxTest } from '../syntax.js';
import testdata from './testdata.js';
import allRules from './allRules.js';
import functions from '../../schema/functions/css.js';
import dictionary from '../../schema/dictionary/css.js';

class SyntaxCssTest extends SyntaxTest {
  constructor (instance) {
    super(instance, testdata);
    this.instance.render.init();
    this.instance.syntax.init();
    this.instance.render.move.page();
  }

  rulesTestData = {
    varName : () => {
      return ['var(-aa, \'a\')'];
    },
    functions : (definition) => {
      const funcs = [];
      Object.keys(definition.functions).forEach((func, i) => {
        funcs.push(func + '()');
      });
      return funcs;
    },
    custom : (definition) => Object.keys(definition.values),
    procent : () => {
      return [Math.round(Math.random(0,100) * 10000)/100 + '%'];
    },
    number : () => {
      return [Math.round(Math.random(0,100) * 10000)/100];
    },
    time : () => {
      return [Math.round(Math.random(0,100) * 100) + 's'];
    },
    firstName : () => {
      return ['-Name_019-dasd'];
    },
    name : () => {
      return ['-Name_019-dasd'];
    },
    color : () => {
      return [
        '#FFF',
        '#000000',
        'rgba(0,0,0,0)',
        'rgb(0,0,0)',
        'hsl(30, 100%, 50%)',
        'hsla(30, 100%, 50%, .3)',
        'hwb(1.5708rad 20% 10% / 0.7)'
      ];
    },
    image : () => {
      return [
        'linear-gradient()',
        'url()'
      ];
    },
    length : () => {
      return [
        '1px',
        '1em',
        '1rem',
        '1ch',
        '1ex',
        '1vh',
        '1vw',
        '1vmin',
        '1vmax',
        '1cm',
        '1mm',
        '1in',
        '1pc',
        '1pt',
      ];
    }
  }

  createTestData() {
    const styles = allRules; //getComputedStyle(document.documentElement);
    const stylesAr = styles;
    // Object.keys(styles).forEach( key => {
    //   stylesAr.push(styles[key]);
    // });
    const notFoundTypes = {};
    stylesAr.forEach( (rule, i) => {
      let rules = functions.getValue(rule, dictionary);
      if (rules) {
        rules = functions.mergeDefaultRules(rules);
      }
      let destData = [];
      const notFound = {};
      if (rules?.type) {
        Object.keys(rules.type).forEach(type => {
          if (this.rulesTestData[type]) {
            destData = destData.concat(this.rulesTestData[type](rules));
          } else {
            notFound[type] = true;
          }
        });
      }
      console.log(rule, destData);
      if (Object.keys(notFound).length > 0) {
        notFoundTypes[rule] = notFound;
      }
      const testData = [];
      testData.push("<p><span>&nbsp;&nbsp;" + rule + ":;</span></p>");
      destData.forEach(data => {
        testData.push("<p><span>&nbsp;&nbsp;" + rule + ":" + data + ";</span></p>");
      });

      if (rules?.multi) {
        if (!rules?.max) {
          console.log(rule, 'Missing max');
          rules.max = 4;
        }

        const multiData = this.generateMulti(rules, destData);
        testData.push("<p><span>&nbsp;&nbsp;" + rule + ":" + multiData + ";</span></p>");
      }

      if (rules?.seperate) {
        const multiData1 = this.generateMulti(rules, destData);
        const multiData2 = this.generateMulti(rules, destData);

        testData.push("<p><span>&nbsp;&nbsp;" + rule + ":" + multiData1 + ", " + multiData2 + ";</span></p>");

      }

      stylesAr[i] = testData.join("\n");

    });
    return stylesAr.join("\n");
  }

  generateMulti (rules, destData) {
    const indexes = [];
    for (var i = 0; i < rules.max; i++) {
      indexes.push(Math.floor(Math.random() * rules.max));
    }
    let multiData = '';
    indexes.forEach(index => {
      multiData += destData[index] + ' ';
    });

    multiData.trim();
    return multiData;
  }

  generateCssRules() {
    let rules = [];
    Object.keys(css).forEach( rule => {
      rules = rules.concat(this.createRulePath(rule, css[rule]));
    });
    rules.forEach( (rule, i) => {
      rules[i] = '<p><span>' + rule + ':</span></p>';
    });

    return rules.join("\n");
  }

  createRulePath(path, css) {
    if (path[path.length - 1] == '_') {
      return []
    }
    let rules = [];
    if (css?._) rules.push(path);
    Object.keys(css).forEach( rule => {
      rules = rules.concat(this.createRulePath(path + '-' + rule, css[rule]));
    });
    return rules;
  }
}
export { SyntaxCssTest };
