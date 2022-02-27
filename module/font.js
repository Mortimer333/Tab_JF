class TabJF_Font {
  lab = null;

  createLab () {
    this.font.lab = document.createElement("canvas");
  }

  getCssStyle(element, prop) {
    return window.getComputedStyle(element, null).getPropertyValue(prop);
  }

  getCanvasFontSize(el) {
    const fontWeight = this.font.getCssStyle(el, 'font-weight') || 'normal';
    const fontSize = this.font.getCssStyle(el, 'font-size') || '16px';
    const fontFamily = this.font.getCssStyle(el, 'font-family') || 'Times New Roman';

    return `${fontWeight} ${fontSize} ${fontFamily}`;
  }

  calculateWidth ( text, el ) {
    const context = this.font.lab.getContext("2d");
    context.font = this.font.getCanvasFontSize(el);
    return context.measureText(text).width;
  }

  getLetterByWidth ( x, el ) {
    x              -= el.offsetLeft;
    const text      = el.innerText;
    const lineWidth = this.font.calculateWidth( text + '', el );
    let procent     = 0;
    if (lineWidth != 0) {
      procent = x/lineWidth;
    }
    return Math.round( text.length * procent );
  }
}
export { TabJF_Font };
