class Integration extends Test {

  constructor(instance) {
    super(instance);
    console.info(this.instance);
    const e = this.get.activeDummyEvent();
    this.instance.active(e);
    this.init();
  }

  init() {
    /*** MOVE ***/
    this.tests.moveOne();
    this.tests.moveWord();
    /*** SELECT ***/
    this.tests.selectOne();
    this.tests.selectWord();
    /*** USAGE ***/
    this.tests.insert();
    /*** ACTIONS ***/
    this.tests.actions();
    console.info("SUCCESS INTEGRATION");
  }

  move = {
    word : (dir) => {
      const obj   = this.get.moveObj(dir);
      obj.ctrlKey = true;
      const e     = this.get.keyDummyEvent(obj);
      this.instance.key(e);
    },
    one : (dir) => {
      const e = this.get.keyDummyEvent(this.get.moveObj(dir));
      this.instance.key(e);
    }
  }

  select = {
    one : (dir) => {
      const obj    = this.get.moveObj(dir);
      obj.shiftKey = true;
      const e      = this.get.keyDummyEvent(obj);
      this.instance.key(e);
    },
    word : (dir) => {
      const obj    = this.get.moveObj(dir);
      obj.ctrlKey  = true;
      obj.shiftKey = true;
      const e      = this.get.keyDummyEvent(obj);
      this.instance.key(e);
    }
  }

  insert (key, keyCode, e = {}) {
    e = Object.assign(e, {
      key : key,
      keyCode : keyCode
    });
    e = this.get.keyDummyEvent(e);
    this.instance.key(e);
  }

  tests = {
    actions : () => {
      // Set caret at the start of second line
      this.instance.lastX = 0;
      this.instance.caret.refocus( 0, 1, 0 );
      let selectedLine = this.get.line(1);
      // Down and left should select only current line
      this.select.one('down');
      this.select.one('left');
      this.insert('c', 67, { ctrlKey : true });
      this.error(
        JSON.stringify(this.instance.clipboard) != JSON.stringify([selectedLine]),
        '[ACTION:COPY] Failed',
        [this.instance.clipboard, selectedLine]
      );

      this.insert('x', 88, { ctrlKey : true });
      selectedLine = this.get.line(1);
      this.error(
        selectedLine.content.length != 1,
        '[ACTION:CUT] Failed',
        [selectedLine]
      );

      this.instance.copiedHere = true;
      document.dispatchEvent(new Event('paste'));
      selectedLine = this.get.line(1);
      this.error(
        selectedLine.content.length - 1 != this.instance.clipboard[0].content.length,
        '[ACTION:PASTE] Failed',
        [this.instance.clipboard, selectedLine]
      );

      this.insert('a', 65, { ctrlKey : true });
      let selection = this.get.selection();
      let content = this.get.content();
      let lastLine = content[content.length - 1];
      let lastSpan = lastLine.content[lastLine.content.length - 1];
      this.error(
        selection.start.line != 0 || selection.start.letter != 0 || selection.start.node != 0
        || selection.end.line != content.length - 1 || selection.end.letter != lastSpan.content.length
        || selection.end.node != lastLine.content.length - 1,
        '[ACTION:SELECTALL] Failed',
        [content, selection]
      );

      const afterChanges = this.get.content();
      this.insert('z', 90, { ctrlKey : true });
      this.error(
        JSON.stringify(this.get.content()) != JSON.stringify(this.testData),
        '[ACTION:UNDO] Failed',
        [this.get.content(), this.testData]
      );

      this.insert('y', 89, { ctrlKey : true });
      this.error(
        JSON.stringify(this.get.content()) != JSON.stringify(afterChanges),
        '[ACTION:REDO] Failed',
        [this.get.content(), this.testData]
      );
    },
    insert : () => {
      /** SKIP **/
      for (var i = 112; i <= 123; i++) {
        let posNow = this.get.pos();
        this.insert('F' + (i - 111), i);
        let posAfter = this.get.pos();
        this.error(
          JSON.stringify(posNow) != JSON.stringify(posAfter),
          '[INSERT:SKIP] [F' + (i - 111) + '] Failed',
          [posNow, posAfter]
        );
      }
      /** KEYS **/
      // TAB
      let posNow = this.get.pos();
      this.insert('Tab', 9);
      let posEl = this.get.posEl();
      let posAfter = this.get.pos();

      let tab = posEl.innerText.substr(posNow.letter, posAfter.letter - posNow.letter);
      this.error(
        tab != '\u00A0\u00A0',
        '[INSERT:TAB] Failed',
        [tab.length, tab, posEl.innerText]
      );

      // ENTER
      this.insert('Enter', 13);
      posAfter = this.get.pos();
      let lineFirst = this.instance.get.lineByPos(0);

      this.error(
        lineFirst.innerText != '\u00A0\u00A0' || posAfter.line != 1 || posAfter.childIndex != 0 || posAfter.letter != 0,
        '[INSERT:ENTER] Failed',
        [posAfter, lineFirst.innerText]
      );

      // PAGE UP
      this.insert('Page Up', 33);
      posAfter = this.get.pos();

      this.error(
        posAfter.line != 0 || posAfter.childIndex != 0 || posAfter.letter != 0,
        '[INSERT:PAGEUP] Failed',
        [posAfter, lineFirst.innerText]
      );

      // PAGE DOWN
      this.insert('Page Down', 34);
      posAfter = this.get.pos();

      let content = this.get.content();
      let lastLine = content[content.length - 1];
      let lastSpan = lastLine.content[lastLine.content.length - 1];
      this.error(
        posAfter.line != content.length - 1 || posAfter.childIndex != lastLine.content.length - 1
        || posAfter.letter != lastSpan.content.length ,
        '[INSERT:PAGEDOWN] Failed',
        [posAfter, lastLine]
      );

      // HOME
      posNow = this.get.pos();
      this.insert('Home', 36);
      posAfter = this.get.pos();

      this.error(
        posAfter.line != posNow.line || posAfter.childIndex != 0
        || posAfter.letter != 0,
        '[INSERT:HOME] Failed',
        [posAfter, lastLine]
      );

      // END
      posNow = this.get.pos();
      this.insert('End', 35);
      posAfter = this.get.pos();
      lastLine = content[ posNow.line ];
      lastSpan = lastLine.content[lastLine.content.length - 1];

      this.error(
        posAfter.line != posNow.line || posAfter.childIndex != lastLine.content.length - 1
        || posAfter.letter != lastSpan.content.length,
        '[INSERT:END] Failed',
        [posAfter, lastLine]
      );

      this.tests.letter('a', 65);
      this.tests.letter('c', 67);
      this.tests.letter('v', 86);
      this.tests.letter('x', 88);
      this.tests.letter('y', 89);
      this.tests.letter('z', 90);
      this.tests.letter('*', 106);
      this.tests.letter('-', 109);

      this.instance.caret.refocus(
        3,
        1,
        0
      );
      this.instance.lastX = this.instance.get.realPos().x;
      // <p><span>1as|d</span><span> | dsa</span><span | dsa</span></p>

      posNow = this.get.pos();
      this.insert('Backspace', 8);
      posAfter = this.get.pos();

      this.error(
        posNow.letter - 1 != posAfter.letter || posNow.line != posAfter.line ||
        posNow.node != posAfter.node,
        '[INSERT:DELETE] Failed',
        [posNow, posAfter]
      );

      posNow = this.get.pos();
      this.insert('Delete', 46);
      posAfter = this.get.pos();

      this.error(
        posNow.letter != posAfter.letter || posNow.line != posAfter.line ||
        posNow.node != posAfter.node,
        '[INSERT:DELETE] Failed',
        [posNow, posAfter]
      );

      this.instance.caret.refocus(
        0,
        1,
        0
      );
      this.instance.lastX = this.instance.get.realPos().x;
      // <p><span>[caret]1asd</span><span> | dsa</span><span | dsa</span></p>
      // Checking merge line from the start of the line

      posNow = this.get.pos();
      lastLine = this.instance.get.clone(this.instance.render.content[posNow.line - 1]);
      lastSpan = lastLine.content[lastLine.content.length - 1];
      let lastText = this.instance.replace.spaceChars(lastSpan.content);
      this.insert('Backspace', 8);
      posAfter = this.get.pos();

      this.error(
        lastText.length != posAfter.letter || posNow.line - 1 != posAfter.line ||
        lastLine.content.length - 1 != posAfter.childIndex,
        '[INSERT:BACKSPACE] [MERGE:LINE] Failed',
        [posNow, posAfter]
      );

      this.instance.toSide(1, 0);
      // <p><span>1asd</span><span> | dsa</span><span | dsa[caret]</span></p>

      // Checking merge line from the end of the line
      posNow = this.get.pos();
      let nextLine = this.get.line(posNow.line + 1);
      this.insert('Delete', 46);
      posAfter = this.get.pos();
      let currentLine = this.instance.render.content[posAfter.line];

      this.error(
        posNow.letter != posAfter.letter || posNow.line != posAfter.line ||
        posNow.childIndex + nextLine.content.length != currentLine.content.length - 1,
        '[INSERT:DELETE] [MERGE:LINE] Failed',
        [posNow.childIndex, currentLine, nextLine]
      );

      posNow = this.get.pos();
      this.insert('Enter', 13);
      posAfter = this.get.pos();

      this.error(
        posAfter.letter != 0 || posNow.line + 1 != posAfter.line ||
        posAfter.childIndex != 0,
        '[INSERT:ENTER] [NEW:LINE] Failed',
        [posNow, posAfter]
      );
    },
    letter : (letter, keyCode) => {
      let posNow = this.get.pos();
      this.insert(letter, keyCode);
      let posAfter = this.get.pos();
      let el = this.get.posEl();
      let letterSub = el.innerText.substr(posNow.letter, posAfter.letter - posNow.letter);

      this.error(
        letterSub != letter,
        '[INSERT:' + letter.toUpperCase() + '] Failed',
        [letterSub, letter, el.innerText]
      );
    },
    selectWord : () => {
      // <p><span>1asd</span><span> | dsa</span><span | dsa</span></p>
      // <p><span>2asd</span><span>|dsa</span><span>|dsa</span></p>

      let selNow   = this.get.selection();
      this.select.word('right');
      let selAfter = this.get.selection();
      this.error(
        selAfter.start.line != 0 || selAfter.start.letter != 0 || selAfter.start.node != 0
        || selAfter.end.line != 0 || selAfter.end.letter != 1 || selAfter.end.node != 1,
        '[SELECT:WORD] [DIR:RIGHT] Failed',
        [selNow, selAfter]
      );

      selNow   = this.get.selection();
      this.select.word('down');
      selAfter = this.get.selection();
      this.error(
        selAfter.start.line != 0 || selAfter.start.letter != 0 || selAfter.start.node != 0
        || selAfter.end.line != 1 || selAfter.end.letter != 1 || selAfter.end.node != 1,
        '[SELECT:WORD] [DIR:DOWN] Failed',
        [selNow, selAfter]
      );

      selNow   = this.get.selection();
      this.select.word('left');
      selAfter = this.get.selection();
      this.error(
        selAfter.start.line != 0 || selAfter.start.letter != 0 || selAfter.start.node != 0
        || selAfter.end.line != 1 || selAfter.end.letter != 0 || selAfter.end.node != 0,
        '[SELECT:WORD] [DIR:LEFT] Failed',
        [selNow, selAfter]
      );

      selNow   = this.get.selection();
      this.select.word('up');
      selAfter = this.get.selection();
      this.error(
        selAfter.start.line != 0 || selAfter.start.letter != 0 || selAfter.start.node != 0
        || selAfter.end.line != 0 || selAfter.end.letter != 0 || selAfter.end.node != 0,
        '[SELECT:WORD] [DIR:LEFT] Failed',
        [selNow, selAfter]
      );
    },
    selectOne : () => {
      let selNow   = this.get.selection();
      this.select.one('right');
      let selAfter = this.get.selection();
      this.error(
        selAfter.start.line != 0 || selAfter.start.letter != 0 || selAfter.start.node != 0
        || selAfter.end.line != 0 || selAfter.end.letter != 1 || selAfter.end.node != 0,
        '[SELECT:ONE] [DIR:RIGHT] Failed',
        [selNow, selAfter]
      );

      selNow   = this.get.selection();
      this.select.one('down');
      selAfter = this.get.selection();
      this.error(
        selAfter.start.line != 0 || selAfter.start.letter != 0 || selAfter.start.node != 0
        || selAfter.end.line != 1 || selAfter.end.letter != 1 || selAfter.end.node != 0,
        '[SELECT:ONE] [DIR:DOWN] Failed',
        [selNow, selAfter]
      );

      selNow   = this.get.selection();
      this.select.one('left');
      selAfter = this.get.selection();
      this.error(
        selAfter.start.line != 0 || selAfter.start.letter != 0 || selAfter.start.node != 0
        || selAfter.end.line != 1 || selAfter.end.letter != 0 || selAfter.end.node != 0,
        '[SELECT:ONE] [DIR:LEFT] Failed',
        [selNow, selAfter]
      );

      selNow   = this.get.selection();
      this.select.one('up');
      selAfter = this.get.selection();
      this.error(
        selAfter.start.line != 0 || selAfter.start.letter != 0 || selAfter.start.node != 0
        || selAfter.end.line != 0 || selAfter.end.letter != 0 || selAfter.end.node != 0,
        '[SELECT:ONE] [DIR:UP] Failed',
        [selNow, selAfter]
      );
    },
    moveWord : () => {
      // <p><span>1asd</span><span> | dsa</span><span | dsa</span></p>
      // <p><span>2asd</span><span>|dsa</span><span>|dsa</span></p>

      // Right
      let posNow   = this.get.pos();
      this.move.word('right');
      let posAfter = this.get.pos();
      this.error(
        posAfter.letter != 1 || posAfter.childIndex != 1,
        '[MOVEWORD] [DIR:RIGHT] Failed',
        [posNow, posAfter]
      );

      // Down
      posNow   = this.get.pos();
      this.move.word('down');
      posAfter = this.get.pos();
      this.error(
        posAfter.line != 1 || posAfter.letter != 1 || posAfter.childIndex != 1,
        '[MOVEWORD] [DIR:DOWN] Failed',
        [posNow, posAfter]
      );

      // Left
      posNow   = this.get.pos();
      this.move.word('left');
      posAfter = this.get.pos();
      this.error(
        posAfter.letter != 0 || posAfter.line != 1 || posAfter.childIndex != 0,
        '[MOVEWORD] [DIR:LEFT] Failed',
        [posNow, posAfter]
      );

      // Up
      posNow   = this.get.pos();
      this.move.word('up');
      posAfter = this.get.pos();
      this.error(
        posAfter.letter != 0 || posAfter.line != 0 || posAfter.childIndex != 0,
        '[MOVEWORD] [DIR:UP] Failed',
        [posNow, posAfter]
      );
    },
    moveOne : () => {
      // Right
      let posNow   = this.get.pos();
      this.move.one('right');
      let posAfter = this.get.pos();
      this.error(
        posAfter.letter - 1 != posNow.letter,
        '[MOVE] [DIR:RIGHT] Failed',
        [posNow.letter, posAfter.letter]
      );

      // Down
      posNow   = this.get.pos();
      this.move.one('down');
      posAfter = this.get.pos();
      this.error(
        posAfter.line - 1 != posNow.line,
        '[MOVE] [DIR:DOWN] Failed',
        [posAfter.line, posNow.line]
      );

      // Left
      posNow   = this.get.pos();
      this.move.one('left');
      posAfter = this.get.pos();
      this.error(
        posAfter.letter + 1 != posNow.letter,
        '[MOVE] [DIR:LEFT] Failed',
        [posAfter.letter, posNow.letter]
      );

      // Up
      posNow   = this.get.pos();
      this.move.one('up');
      posAfter = this.get.pos();
      this.error(
        posAfter.line + 1 != posNow.line,
        '[MOVE] [DIR:UP] Failed',
        [posAfter.line, posNow.line]
      );
    }
  }
}
