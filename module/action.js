class TabJF_Action {
  copy () {
    const clipboard = this.get.selectedNodes();
    const event = this.event.dispatch('tabJFCopy', {
      pos       : this.get.clonedPos(),
      event     : null,
      clipboard : this.get.clone( clipboard ),
    });
    if ( event.defaultPrevented ) return;

    /*
      As coping to clipboard sucks without https server -
      https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
      we will do it in 2 parts:
       - copy to cliboard plain text as this is supported
       - keep in our clipboard variable to proper stuff with styles and all
    */
    this.clipboard = this.get.clone( clipboard );
    this.truck.import(
      this.clipboard,
      false,
      0,
      false,
      false,
      this.font.lab,
      false
    );
    let firstText = this.font.lab.children[0].children[0].childNodes[0];
    let lastText  = this.font.lab.children[ this.font.lab.children.length - 1 ]
    lastText      = lastText.children  [ lastText.children  .length - 1 ];
    lastText      = lastText.childNodes[ lastText.childNodes.length - 1 ];

    const range = new Range();
    range.setStart( firstText, 0 );
    range.setEnd  ( lastText , lastText.nodeValue.length );
    this.get.selection().removeAllRanges();
    this.get.selection().addRange( range );

    // moving it to timeout as the exec copy appears to work on the end of stack
    // or something similar
    setTimeout( function(){
      document.execCommand('copy');
      this.copiedHere         = true;
      this.font.lab.innerHTML = '';
      this.checkSelect();
    }.bind( this ), 0);
  }

  paste () {
    const event = this.event.dispatch('tabJFPaste', {
      pos       : this.get.clonedPos(),
      event     : null,
      clipboard : this.get.clone(this.clipboard),
    });
    if ( event.defaultPrevented ) return;

    this.remove.selected();
    const clipboard = this.get.clone( this.clipboard );
    const first     = clipboard[0];
    const last      = clipboard[ clipboard.length - 1 ];
    let firstLine     = this.render.content[ this.pos.line ];
    let firstLineSpan = firstLine  .content[ this.pos.childIndex ];
    let firstPreText  = this.replace.spaceChars( firstLineSpan.content ).substr( 0, this.pos.letter );
    let firstSufText  = this.replace.spaceChars( firstLineSpan.content ).substr( this.pos.letter    );

    // Set content to be prefix
    firstLineSpan.content = firstPreText;

    // cut the rest of spans
    let firstLineSpans = firstLine.content.splice( this.pos.childIndex + 1 );

    // add spans from the first copy line
    firstLine.content  = firstLine.content.concat( first.content  );

    let middleLines = this.get.clone(clipboard.slice( 1, clipboard.length - 1 ));
    let lastLetter, lastChildIndex;
    if ( clipboard.length > 1 ) {
      let lastLine   = clipboard[clipboard.length - 1];
      lastChildIndex = lastLine.content.length - 1;
      lastLetter     = this.replace.spaceChars(
        lastLine.content[lastLine.content.length - 1].content
      ).length;
      lastLine.content[lastLine.content.length - 1].content += firstSufText;
      lastLine.content = lastLine.content.concat( firstLineSpans );
      middleLines = middleLines.concat( [ lastLine ] );
    } else {
      lastLetter = first.content[ first.content.length - 1 ].content.length;
      lastChildIndex = this.pos.childIndex + first.content.length;
      firstLine.content[ firstLine.content.length - 1 ].content += firstSufText;
      firstLine.content = firstLine.content.concat( firstLineSpans );
    }

    this.render.content.splice(
      this.pos.line + 1,
      0,
      ...middleLines
    );

    this.render.move.page();
    this.render.set.overflow(
      null,
      (
        (this.pos.line + clipboard.length - 1)
        - (Math.floor(this.render.linesLimit/2))
      ) * this.settings.line
    );
    this.caret.refocus(
      lastLetter,
      this.pos.line + clipboard.length - 1,
      lastChildIndex
    );
    this.lastX = this.get.realPos().x;
    this.render.update.minHeight();
    this.render.update.scrollWidth();
    this.update.selection.start();
    // update page, because pasting happens at the end of cycle
    this.update.page()
  }

  cut () {
    this.action.copy();
    this.remove.selected();
    this.render.update.minHeight();
    this.render.update.scrollWidth();

    const event = this.event.dispatch('tabJFCut', {
      pos       : this.get.clonedPos(),
      event     : null,
      clipboard : this.get.clone(this.clipboard),
    });
    if ( event.defaultPrevented ) return;
  }

  undo () {
    const versionBefore = this.get.clone(this._save.versions[this._save.version] ?? {});
    const versionNumberBefore = this._save.version;

    const event = this.event.dispatch('tabJFUndo', {
      pos           : this.get.clonedPos(),
      event         : null,
      versionNumber : this._save.version - 1,
      version       : this.get.clone(this._save.versions[this._save.version - 1] ?? {}),
      versionNumberBefore,
      versionBefore,
    });
    if ( event.defaultPrevented ) return;

    this._save.restore();
    this.lastX = this.get.realPos().x;
    this.render.update.minHeight();
    this.render.update.scrollWidth();
  }

  redo () {
    const versionBefore = this.get.clone(this._save.versions[this._save.version] ?? {});
    const versionNumberBefore = this._save.version;

    const event = this.event.dispatch('tabJFRedo', {
      pos           : this.get.clonedPos(),
      event         : null,
      versionNumber : this._save.version + 1,
      version       : this.get.clone(this._save.versions[this._save.version + 1] ?? {}),
      versionNumberBefore,
      versionBefore
    });
    if ( event.defaultPrevented ) return;

    this._save.recall();
    console.log(this.get.realPos().x);
    this.lastX = this.get.realPos().x;
    this.render.update.minHeight();
    this.render.update.scrollWidth();
  }

  selectAll () {
    const event = this.event.dispatch('tabJFSelectAll', {
      pos       : this.get.clonedPos(),
      event     : null,
    });
    if ( event.defaultPrevented ) return;

    this.update.selection.start( 0, 0, 0 );
    const last     = this.render.content[ this.render.content.length - 1 ];
    const lastSpan = last.content[ last.content.length - 1 ];
    const lastNode = this.replace.spaceChars( lastSpan.content );
    this.update.selection.end(
      lastNode.length,
      this.render.content.length - 1,
      last.content.length - 1
    );
    this.selection.active = true;
    this.checkSelect();
  }
}
export { TabJF_Action };
