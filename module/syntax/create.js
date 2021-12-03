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
      attrs : { class : 'mistake' },
      content : text,
    }
  }

  proper( text ) {
    return {
      attrs : { class : 'proper' },
      content : text,
    }
  }
}
export { TabJF_Syntax_Create };
