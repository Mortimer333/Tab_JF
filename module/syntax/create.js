class TabJF_Syntax_Create {
  /**
   * Creates span for render content
   * @param  {Object} attrs {style:'color:#FFF'}
   * @param  {String} text
   * @return {Object}       {attrs:{style:'color:#FFF'},content:''}
   */
  span(attrs, text) {
    return {
      attrs,
      content : this.replace.spaces( text ),
    }
  }
}
export { TabJF_Syntax_Create };
