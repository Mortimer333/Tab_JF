class Test {
  moveObj = {
    'left' : {
      keyCode : 37,
      key : 'ArrowLeft'
    },
    'up' : {
      keyCode : 38,
      key : 'ArrowUp'
    },
    'right'  : {
      keyCode : 39,
      key : 'ArrowRight'
    },
    'down'  : {
      keyCode : 40,
      key : 'ArrowDown'
    },
  };
  instance;
  testData = [{"content":[{"attrs":[],"content":"1asd"},{"attrs":[],"content":" | dsa"},{"attrs":[],"content":" | dsa"}]},{"content":[{"attrs":[],"content":"2asd"},{"attrs":[],"content":"|dsa"},{"attrs":[],"content":"|dsa"}]},{"content":[{"attrs":[],"content":"3asd"},{"attrs":[],"content":"|dsa"},{"attrs":[],"content":"|dsa"}]},{"content":[{"attrs":[],"content":"4asd"},{"attrs":[],"content":"|dsa"},{"attrs":[],"content":"|dsa"}]}];

  constructor( instance, testData = this.testData ) {
    if (this.constructor === Test) {
      throw new Error('This is abstract class, can\'t be instantiated');
    }
    this.instance = instance;
    if (JSON.stringify(this.instance.render.content) != JSON.stringify(testData)) {
      this.instance.truck.import(testData);
    }
  }

  error (check, mes, params = []) {
    if (check) {
      console.info(params);
      throw new Error('FAILED [' + this.constructor.name + '] ' + mes);
    }
  }

  get = {
    activeDummyEvent : () => {
      const e = {
        target : this.instance.get.lineByPos(0).children[0]
      };
      e.x = this.instance.settings.left;
      e.y = this.instance.settings.top;
      return e;
    },
    keyDummyEvent : (e = {}) => {
      e.altKey   = e.altKey   ?? false;
      e.shiftKey = e.shiftKey ?? false;
      e.ctrlKey  = e.ctrlKey  ?? false;
      e.type     = e.type     ?? 'keydown';
      e.keyCode  = e.keyCode  ?? 'default';
      e.key      = e.key      ?? 'default';
      e.preventDefault = () => { /* Holder */ };
      return e;
    },
    pos : () => {
      return this.instance.get.clone(this.instance.pos);
    },
    posEl : () => {
      return this.instance.pos.el;
    },
    selection : () => {
      return this.instance.get.clone(this.instance.selection);
    },
    moveObj : (dir) => {
      return this.clone(this.moveObj[dir]);
    },
    content : () => {
      return this.instance.get.clone(this.instance.render.content);
    },
    line : (index) => {
      return this.instance.get.clone(this.instance.render.content[index]);
    }
  }

  clone (obj) {
    return JSON.parse(JSON.stringify(obj));
  }
}
