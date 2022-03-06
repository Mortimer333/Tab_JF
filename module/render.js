class TabJF_Render {
  hidden       = 0    ; // How many lines was hidden
  /**
   * @type {Object[]} Content of editor:
   * {
   *    "content": [
   *      {
   *        "attrs": {
   *          "style": "color:#F00;"
   *        },
   *        "content": "text"
   *      }
   *    ]
   *  }
   */
  content      = null ;
  linesLimit   = 80   ; // How many lines to show - dynamically changed depending on editors height
  maxLineWidth = 0    ; // The width editor must keep up
  overflow     = null ; // Node with overflow setup
  focusLost    = false; // if we have scrolled past caret

  /**
   * Remove scroll event from overflow node
   */
  removeScroll () {
    this.render.overflow.removeEventListener('scroll', this.render.fill.event, true);
  }

  /**
   * Prepare and start rendering of the content
   * @param  {Boolean} [importObj=false  ] Already prepared content to render
   * @param  {Boolean} [contentText=false] Content to render in text to be prepared by this function
   */
  init ( importObj = false, contentText = false ) {
    if      ( importObj   ) this.render.content = importObj;                            // Proper content obj: [{content:[{content:'text',attrs:{}}]}]
    else if ( contentText ) this.render.content = this.truck.exportText( contentText ); // Text content line: line1\nline2 text1\nline3
    else                    this.render.content = this.truck.export();                  // If we don't have saved state, save current state
    this.clear.editor( false );
    this.render.linesLimit = Math.ceil( this.settings.height / this.settings.line ) + 2;
    // Create overflow
    const overflow = document.createElement("div");
    overflow.addEventListener('scroll', this.render.fill.event, true);
    overflow.className = "tabjf_editor-con";
    // Update constants
    this.render.update.minHeight();
    this.render.update.scrollWidth();
    // Insert overflow and append editor to him
    this.editor.parentElement.insertBefore(overflow, this.editor);
    overflow.appendChild( this.editor );
    this.render.overflow = overflow;
  }
}
export { TabJF_Render };
