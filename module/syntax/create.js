class TabJF_Syntax_Create {
  span(attrs, text) {
    return {
      attrs,
      content : this.replace.spaces( text ),
    }
  }

  space( spaces ) {
    return {
      attrs : { class : 'spaces' },
      content : this.replace.spaces( spaces ),
    }
  }

  mistake( text ) {
    return {
      attrs : { class : 'mistake', style : 'color:#FFF;' },
      content : text,
    }
  }

  proper( text ) {
    return {
      attrs : { class : 'proper' },
      content : text,
    }
  }

  class( text ) {
    return {
      attrs : { class : 'class' },
      content : text,
    }
  }

  id( text ) {
    return {
      attrs : { class : 'id' },
      content : text,
    }
  }

  method( text ) {
    return {
      attrs : { class : 'method' },
      content : text,
    }
  }

  tag( text ) {
    return {
      attrs : { class : 'tag' },
      content : text,
    }
  }
}
export { TabJF_Syntax_Create };
