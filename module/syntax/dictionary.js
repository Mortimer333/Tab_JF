class TabJF_Syntax_Dictionary {
  getValue( words, group ) {
    let name = '';
    for (var i = words.length - 1; i >= 0; i--) {
      const word = words[i].content;
      if ( word.indexOf('&nbsp;') === -1 ) {
        name = this.replace.spaceChars(word);
        break;
      }
    }

    if ( group?.trim ) {
      name = name.trim();
    }

    let route = [name];
    if ( group?.joiners ) {
      route = this.syntax.dictionary.createRoute( name, group.joiners );
    }

    let value = this.syntax.dictionary.directToValue( route, group.dictionary.rules );
    if ( !value ) {
      words[i].attrs.style = 'color:#d0d0d0;';
      words[i].attrs.class = 'error'         ;
    } else {
      words[i].attrs = group.dictionary.styles.name;
      if ( value._?.ref ) {
        route = this.syntax.dictionary.redirect( route, value._.ref.split('.') );
        value = this.syntax.dictionary.directToValue( route, group.dictionary.rules );
      }
    }


    this.syntax.dict.value = value._;
    return words;
  }

  createRoute (name, joiners) {
    const route = [];
    for (let i = 0; i < name.length; i++) {
      const letter = name[i];
      if ( joiners[letter] ) {
        route.push(name.substr(0, i));
        name = name.substr(i + 1);
        i = 0;
      }
    }

    if ( name.length > 0 ) route.push(name);
    return route;
  }

  directToValue ( route, dictionary ) {
    if ( !dictionary[route[0]] ) return false;

    if ( route.length == 1 ) return dictionary[route[0]];

    return this.syntax.dictionary.directToValue( route.slice(1), dictionary[route[0]] );
  }

  redirect ( route, directions ) {
    const actions = {
      '$up' : ( route ) => {
        return route.slice(0, -1);
      },
      default : ( route ) => {
        return route;
      }
    }

    directions.forEach( direction => {
      if ( direction[0] == '$' ) {
        route = (actions[ direction ] || actions['default'])( route );
      } else {
        route.push(direction);
      }
    });

    return route;
  }

  validateValue ( words, group ) {
    let error     = false;
    let wordCount = 0;
    const value = this.syntax.dict.value;
    if (!value) {
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if ( this.is.space(word.content) ) {
          words[i] = this.syntax.create.space( word.content );
          continue;
        }
        words[i] = this.syntax.create.mistake(word.content);
      }
      return words;
    }
    const typeKeys = Object.keys(value.type);

    for (let i = 0; i < words.length; i++) {
      let validated = false;
      const word = words[i];

      if ( this.is.space(word.content) ) {
        words[i] = this.syntax.create.space( word.content );
        continue;
      }

      wordCount++;

      if ( word.content == group.value.seperators.reset ) {
        wordCount = 0;
        error = false;
        words[i] = this.syntax.create.span(
          group?.sets[word]?.attrs ?? { style : 'color:#FFF;' },
          word
        );
        continue;
      }

      if (
        wordCount > 1 && !value.multi
        || value.multi && value.max && value.max < wordCount
      ) {
        error = true;
      }

      if ( error ) {
        words[i] = this.syntax.create.mistake(word.content);
        continue;
      }

      for (var j = 0; j < typeKeys.length; j++) {
        const key = typeKeys[j];
        if (group.functions[ key ]( value, word.content )) {
          words[i] = this.syntax.create.span( group.dictionary.styles.value, word.content );
          validated = true;
          break;
        }
      }

      if ( validated ) continue;

      words[i] = this.syntax.create.mistake(word.content);
    }

    return words;
  }

  getValues ( words, seperatos ) {

  }
}
export { TabJF_Syntax_Dictionary };
