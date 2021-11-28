class TabJF_Font {
  lab = null;

  createLab () {
    this.font.lab = document.createElement("span");
    this.editor.insertBefore( this.font.lab, this.editor.childNodes[0] );
  }

  calculateWidth ( letters ) {
    this.font.lab.innerHTML = letters.replaceAll('\n','');
    const width             = this.font.lab.offsetWidth;
    this.font.lab.innerHTML = '';
    return width;
  }

  getLetterByWidth ( x, el ) {
    x              -= el.offsetLeft;
    const text      = el.innerText;
    const lineWidth = this.font.calculateWidth( text + '' );
    let procent     = 0;
    if (lineWidth != 0) {
      procent = x/lineWidth;
    }
    return Math.round( text.length * procent );
  }
}
export { TabJF_Font };
