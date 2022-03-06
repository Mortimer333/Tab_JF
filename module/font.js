class TabJF_Font {
  lab = null;   // Placeholder for lab where we calculate width of text

  /**
   * Creates laboratory and saves it into this.font.lab
   */
  createLab () {
    this.font.lab = document.createElement("canvas");
  }

  /**
   * Get assigned css to passed node
   * @param  {Node  } element Node from which we take style
   * @param  {String} prop    Name of searched style
   * @return {String|Boolean} Value of searched css style or false if not found
   */
  getCssStyle(element, prop) {
    return window.getComputedStyle(element, null).getPropertyValue(prop);
  }

  /**
   * Returns font config for canvas
   * @param  {Node  } el Element to take css from
   * @return {String}    Config
   */
  getCanvasFontSize(el) {
    const fontWeight = this.font.getCssStyle(el, 'font-weight') || 'normal';
    const fontSize   = this.font.getCssStyle(el, 'font-size'  ) || '16px';
    const fontFamily = this.font.getCssStyle(el, 'font-family') || 'Times New Roman';
    return `${fontWeight} ${fontSize} ${fontFamily}`;
  }

  /**
   * Calculated width of given text
   * @param  {String      } text Text which length we will calculate
   * @param  {Node        } el   Node from which we will take styles
   * @return {Float|Number} Width of text (format depends on browser)
   */
  calculateWidth ( text, el ) {
    const context = this.font.lab.getContext("2d");
    context.font = this.font.getCanvasFontSize(el);
    return context.measureText(text).width;
  }

  /**
   * Given position X find the position of clicked letter
   * @param  {string} text Search through text
   * @param  {node  } el   Node from which we can take styles
   * @param  {int   } left The X pos of click event
   * @return {int   }      Amount of letters before caret
   */
  getLetterByWidth( text, el, left ) {
    if (text.length <= 1) {
      const singleSize = this.font.calculateWidth( text, el );
      // Find if to positionc aret before or after letter
      if (singleSize/2 > left) {
        return 0;
      }
      return 1;
    }
    // Get half of the text
    const half = text.slice(0, Math.floor(text.length/2));
    const textWidth = this.font.calculateWidth( half, el );
    // Check in which half letter was clicked
    if (left > textWidth) {
      // If click was in second half, then add half amount of letters and search again
      return half.length + this.font.getLetterByWidth(
        text.slice(Math.floor(text.length/2)),
        el,
        left - textWidth
      );
    }
    // If first then just find better approximation
    return this.font.getLetterByWidth(
      half,
      el,
      left
    );
  }
}
export { TabJF_Font };
