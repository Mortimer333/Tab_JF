/**
 * Holds all custom actions such as:
 * - copy       (ctrl + c)
 * - paste      (ctrl + v)
 * - cut        (ctrl + x)
 * - select all (ctrl + a)
 * - undo       (ctrl + z)
 * - redo       (ctrl + y)
 */
class TabJF_Action {
  copyGround = null;

  /**
   * Script at all times only show some part of document, so we have to render somewhere all lines the user wants to copy and fire copy method on
   * them. This creates the place where we can do it. Its between overflow el and actual editor
   */
  createCopyGround() {
    this.action.copyGround = document.createElement('div');
    this.render.overflow.insertBefore(this.action.copyGround, this.editor);
  }

  /**
   * Custom ctrl + c action.
   * It copies selected text in two ways:
   * - into default clipboard
   * - into our custom clipboard for easier pasting into editor
   */
  copy () {
    // Get selected nodes, already translated into editor content object
    const clipboard = this.get.selectedLines();
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
      We don't prevent default so in normal copied element saved into default clipboard each line will be seperated with two "\n" chars but
      in our custom clipboard they will be prerfectly coppied.
    */
    this.clipboard = this.get.clone( clipboard );
    const ground = this.action.copyGround;
    // Render coppied text into copy ground
    this.truck.import(
      this.clipboard,
      false,
      0,
      false,
      false,
      ground,
      false
    );
    let firstText = ground.children[0].children[0].childNodes[0];
    let lastText  = ground.children[ ground.children.length - 1 ]
    lastText      = lastText.children  [ lastText.children  .length - 1 ];
    lastText      = lastText.childNodes[ lastText.childNodes.length - 1 ];
    // Create selection on them
    const range = new Range();
    range.setStart( firstText, 0 );
    range.setEnd  ( lastText , lastText.nodeValue.length );
    this.get.selection().removeAllRanges();
    this.get.selection().addRange( range );
    // We have to wait until browser will finsh its cycle and render new content. The easiest way to do it is to set timeout with 0 as wait time.
    // Then we execute copy command, remove content of ground and recreate old selection.
    setTimeout( function() {
      document.execCommand('copy');
      this.copiedHere   = true;
      ground.innerHTML = '';
      this.checkSelect();
    }.bind( this ), 0);
  }

  /**
   * Custom paste method (ctrl + v)
   * Script catches paste event on document , populates our clipboard if it's empty and fires this function.
   */
  paste () {
    const event = this.event.dispatch('tabJFPaste', {
      pos       : this.get.clonedPos(),
      event     : null,
      clipboard : this.get.clone(this.clipboard),
    });
    if ( event.defaultPrevented ) return;
    // Deletes all selected node
    this.remove.selected();
    // Findes first and last lines, and saves them as prefix and sufix to later attach to existing lines in editor.
    const clipboard = this.get.clone( this.clipboard );
    const first     = clipboard[0];
    const last      = clipboard[ clipboard.length - 1 ];
    let firstLine     = this.render.content[ this.pos.line ];
    let firstLineSpan = firstLine  .content[ this.pos.childIndex ];
    let firstPreText  = this.replace.spaceChars( firstLineSpan.content ).substr( 0, this.pos.letter );
    let firstSufText  = this.replace.spaceChars( firstLineSpan.content ).substr( this.pos.letter    );

    // Set content to be prefix
    firstLineSpan.content = firstPreText;

    // Cut the rest of spans
    let firstLineSpans = firstLine.content.splice( this.pos.childIndex + 1 );

    // Add spans from the first copy line
    firstLine.content  = firstLine.content.concat( first.content  );

    // Rest of the lines to just inject into editor
    let middleLines = this.get.clone(clipboard.slice( 1, clipboard.length - 1 ));
    let lastLetter, lastChildIndex;
    // If editor has content of 1 it means the content shouldn't be made as new line but just injected in current one without dividing it
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
    // Insert middle lines
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
    // Update page
    this.render.update.minHeight();
    this.render.update.scrollWidth();
    this.update.selection.start();
    // update page, because pasting happens at the end of cycle
    this.update.page()
  }

  /**
   * Custom cut action (ctrl + x)
   */
  cut () {
    const event = this.event.dispatch('tabJFCut', {
      pos       : this.get.clonedPos(),
      event     : null,
      clipboard : this.get.clone(this.clipboard),
    });
    if ( event.defaultPrevented ) return;

    // Firstly preform custom copy action
    this.action.copy();
    // Them remove all selected nodes
    this.remove.selected();
    // Update constants
    this.render.update.minHeight();
    this.render.update.scrollWidth();
  }

  /**
   * Custom previous version action (ctrl + z)
   */
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
    // Restore previous version and update constants
    this._save.restore();
    this.lastX = this.get.realPos().x;
    this.render.update.minHeight();
    this.render.update.scrollWidth();
  }

  /**
   * Custom action for applying newer version (ctrl + y)
   */
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

    // Apply newer version and update constants
    this._save.recall();
    this.lastX = this.get.realPos().x;
    this.render.update.minHeight();
    this.render.update.scrollWidth();
  }

  /**
   * Custom action fro selectin whole text (ctrl + a)
   */
  selectAll () {
    const event = this.event.dispatch('tabJFSelectAll', {
      pos       : this.get.clonedPos(),
      event     : null,
    });
    if ( event.defaultPrevented ) return;
    // Set selection start at the top of page
    this.update.selection.start( 0, 0, 0 );
    const last     = this.render.content[ this.render.content.length - 1 ];
    const lastSpan = last.content[ last.content.length - 1 ];
    const lastNode = this.replace.spaceChars( lastSpan.content );
    // Set selection end at the bottom of page
    this.update.selection.end(
      lastNode.length,
      this.render.content.length - 1,
      last.content.length - 1
    );
    this.selection.active = true;
    // Show user the selection
    this.checkSelect();
  }
}
export { TabJF_Action };
