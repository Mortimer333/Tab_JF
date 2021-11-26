class Unit extends Test {
  expected = '[{"content":[{"attrs":[],"content":"test"}]},{"content":[{"attrs":[],"content":"test"}]}]';

  constructor(instance) {
    super();
    this.instance = instance;
    this.init();
  }

  createLine () {
    const p    = document.createElement('p')
    const span = document.createElement('span')
    const text = document.createTextNode('test')
    span.appendChild(text);
    p.appendChild(span);
    return p;
  }

  init () {
    this.iterateTests(this.tests);
    console.log("SUCCESS UNIT");
  }

  iterateTests (tests) {
    tests = Object.values(tests);
    tests.forEach( test => {
      if (typeof test == 'function') {
        test();
      } else {
        this.iterateTests(test);
      }
    });
  }

  tests = {
    truck : {
      export : () => {
        const html = [
          this.createLine(),
          this.createLine()
        ];

        const result = this.instance.truck.export(html);
        this.error(
          JSON.stringify(result) != this.expected,
          '[TRUCK:EXPORT] Failed',
          [result, this.expected]
        );
      },
      exportText : () => {
        const text = "test\ntest";
        const result = this.instance.truck.exportText(text);
        this.error(
          JSON.stringify(result) != this.expected,
          '[TRUCK:EXPORT_TEXT] Failed',
          [result, this.expected]
        );
      }
    },
    replace : {
      spaces : () => {
        const test = "1. test test2 ";
        const result = this.instance.replace.spaces(test);
        const expected = "1.&nbsp;test&nbsp;test2&nbsp;";
        this.error(
          result != expected,
          '[REPLACE:SPACES] Failed',
          [result, expected]
        );
      },
      spaceChars : () => {
        const test = "1.&nbsp;test&nbsp;test2&nbsp;";
        const result = this.instance.replace.spaceChars(test);
        const expected = "1. test test2 ";
        this.error(
          result != expected,
          '[REPLACE:SPACECHARS] Failed',
          [result, expected]
        );
      }
    },
    font : {
      calculateWidth : () => {
        const letters = "test";
        const span = document.createElement("span");
        span.innerHTML = letters;
        this.instance.editor.appendChild(span);
        const realWidth = span.offsetWidth;
        span.remove();
        const width = this.instance.font.calculateWidth(letters);
        this.error(
          width != realWidth,
          '[FONT:CALCULATEWIDTH] Failed',
          [letters, width, realWidth]
        );
      },
      getLetterByWidth : () => {
        const letters = "test";
        const width = this.instance.font.calculateWidth(letters);
        const x = (width/2) - 1;
        const el = document.createElement("span");
        el.appendChild(document.createTextNode(letters));
        const letter = this.instance.font.getLetterByWidth(x, el);
        this.error(
          letter != 2,
          '[FONT:GETLETTERBYWIDTH] Failed',
          [letters, x, el, letter]
        );
      }
    },

    get : {
      attributes : () => {
        const span = document.createElement("span");
        span.setAttribute('style','color:red;');
        span.setAttribute('class','test class');
        const attrs = this.instance.get.attributes(span);
        this.error(
          attrs[0].nodeName != 'style' || attrs[0].nodeValue != 'color:red;' ||
          attrs[1].nodeName != 'class' || attrs[1].nodeValue != 'test class',
          '[GET:ATTRIBUTES] Failed',
          [span, attrs]
        );
      },
      clone : () => {
        let obj = {'test' : 'test'};
        this.error(
          obj == this.instance.get.clone(obj),
          '[GET:CLONE] Failed',
          [obj]
        );
      },
      myself : () => {
        this.error(
          this.instance != this.instance.get.myself(),
          '[GET:MYSELF] Failed',
          []
        );
      },
      elPos : () => {
        const p    = document.createElement("p");
        const span = document.createElement("span");
        p.appendChild(span);
        const pos = this.instance.get.elPos(span);

        this.error(
          pos != 0,
          '[GET:ELPOS] Failed',
          [p.childNodes, pos]
        );
      },
      linePos : () => {
        const line = this.instance.editor.children[2];
        const pos = this.instance.get.linePos(line);
        this.error(
          pos != 0,
          '[GET:LINEPOS] Failed',
          [line, pos]
        );
      },
      selection : () => {
        const selection = window.getSelection ? window.getSelection() : document.selection;
        const instSelection = this.instance.get.selection();
        this.error(
          selection != instSelection,
          '[GET:SELECTION] Failed',
          [selection, instSelection]
        );
      },
      line : () => {
        const span = this.instance.editor.children[2].children[0];
        const line = this.instance.get.line(span);
        this.error(
          this.instance.editor.children[2] != line,
          '[GET:LINE] Failed',
          [this.instance.editor.children[2], line]
        );
      },
      lineByPos : () => {
        const realLine = this.instance.editor.children[2];
        const line = this.instance.get.lineByPos(0);
        this.error(
          realLine != line,
          '[GET:LINEBYPOS] Failed',
          [realLine, line]
        );
      },
      lineInDirection : () => {
        const realLine = this.instance.editor.children[2];
        const line = this.instance.get.lineInDirection(realLine, 1);
        this.error(
           this.instance.editor.children[3] != line,
          '[GET:LINEINDIRECTION] Failed',
          [realLine, line]
        );
      },
      childIndex : () => {
        const p    = document.createElement("p");
        const span = document.createElement("span");
        p.appendChild(span);
        const pos = this.instance.get.childIndex(span);

        this.error(
          pos != 0,
          '[GET:CHILDINDEX] Failed',
          [p.childNodes, pos]
        );
      }
    },
    caret : {
      create : () => {
        const el = document.createElement("p");
        const caret = this.instance.caret.create(el);
        this.error(
          caret.tagName != 'DIV' || caret.className != 'caret',
          '[CARET:CREATE] Failed',
          [caret]
        );
      }
    }
  }
}
