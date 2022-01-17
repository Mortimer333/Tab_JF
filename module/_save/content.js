class TabJF_Save_Content {
  /**
   * Remove lines using step instructions
   * @param {object} step Step
   */
  remove ( remove ) {
    this.render.content.splice( remove.sLine, remove.len );
  }

  /**
   * Adds line using step instructions
   * @param {object} step Step
   */
  add ( add ) {
    const positions = Object.keys( add );
    positions.forEach( linePos => {
      this.render.content.splice( linePos, 0, add[ linePos ] );
    });
  }
}
export { TabJF_Save_Content };
