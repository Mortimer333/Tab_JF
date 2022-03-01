import colorsDictionary from '../dictionary/colors.js';
let functions; export default functions = {
  default : function ( group, value, words, key ) {
    console.error('Unknow validation function was used ', key);
    return false;
  },
  pass : function () {
    return true;
  },
  varName : function ( group, value, words ) {
    const checks = {
      firstMinus : false,
      secondMinus : false,
      parenthesis : false,
      varCheck : false
    };

    const allowed = {
      '-' : true,
      ' ' : true,
      '(' : true,
      'var' : true
    };

    for (let i = words.length - 1; i >= 0 ; i--) {
      const word = words[i].content;
      if ( !allowed[word] ) {
        break;
      }

      if ( word == 'var') {
        checks.varCheck = true;
        break;
      }

      if ( word !== '-' && (i == words.length - 1 || i == words.length - 2) ) {
        break;
      }

      if ( word == '-' && !checks.firstMinus && !checks.secondMinus ) {
        checks.firstMinus = true;
      } else if ( word == '-' && checks.firstMinus && !checks.secondMinus ) {
        checks.secondMinus = true;
      }

      if ( word == '(' && !checks.parenthesis ) {
        checks.parenthesis = true;
      }
    }
    if (Object.values(checks).indexOf(false) !== -1) {
      return false;
    }
    return { 'style' : 'color:#F00;' };
  },
  functions : function ( group, value ) {
    return !!group.functions[value] ? { 'style' : 'color:#F00;' } : false;
  },
  custom : function ( group, value ) {
    return !!group.values[value];
  },
  procent : function ( group, value ) {
    if (value == 0) {
      return true;
    }

    return new RegExp(/\d%/).test(value);
  },
  number : function ( group, value ) {
    return !isNaN(value);
  },
  integer : function ( group, value ) {
    return !isNaN(value) && (
      function(x) {
        return (x | 0) === x;
      }
    )( parseFloat( value ) );
  },
  time : function ( group, value ) {
    if (
      value.length == 1
      || value[ value.length - 1 ] != 's'
      || isNaN(value.substr( 0, value.length - 1 ))
    ) return false;
    return true;
  },
  firstName : function ( group, value, words ) {

    for (var i = words.length - 1; i >= 0; i--) {
      if (
        words[i].content == ','
        || words[i].content == ':'
      ) break;
      if ( words[i].content != '&nbsp;') return false;
    }

    if ( this.name( group, value ) ) return false;

    return true;
  },
  name : function ( group, value ) {
    return value.substr(0, 2) !== '--'
      && (isNaN(value[0]) || value[0] === '-')
      && value[0] !== '_'
      && /^[0-9A-Za-z_-\s\-]+$/.test(value);
  },
  color : function ( group, value ) {
    var el = document.createElement('div');
    el.style.backgroundColor = value;
    return !!el.style.backgroundColor;
  },
  image : function ( group, value ) {
    const imageFuncs = ["repeating-linear-gradient", "linear-gradient", "url"];
    return imageFuncs.indexOf(value) !== -1;
  },
  length : function ( group, value ) {
    if (value == 0) {
      return true;
    }

    const units = {
      px : true,
      em : true,
      rem : true,
      ch : true,
      ex : true,
      vh : true,
      vw : true,
      vmin : true,
      vmax : true,
      cm : true,
      mm : true,
      in : true,
      pc : true,
      pt : true,
    };

    const maxUnitLength = 4;
    const minUnitLength = 2;
    const numberMin = value.substr(0, value.length - maxUnitLength);
    const numberMax = value.substr(0, value.length - minUnitLength);

    if (isNaN(numberMin) && isNaN(numberMax)) {
      return false;
    }

    let unit = value.substr(-maxUnitLength);
    if (units[unit]) {
      return true;
    }

    unit = value.substr(-minUnitLength);
    return units[unit];
  },
  unit : function ( group, value, unit ) {
    let number = value.substr(0, value.length - unit.length);

    if ( isNaN(number) ) {
      return false;
    }

    return value.substr(-unit.length) == unit;
  },
  degree : function ( group, value ) {
    return this.unit( group, value, 'deg');
  },
  fraction : function ( group, value ) {
    return this.unit( group, value, 'fr');
  },
  turn : function ( group, value ) {
    return this.unit( group, value, 'turn');
  },
  rad : function ( group, value ) {
    return this.unit( group, value, 'rad');
  },
  grad : function ( group, value ) {
    return this.unit( group, value, 'grad');
  },

  clone: function (object) {
    if (typeof object != 'object') return object;
    return JSON.parse(JSON.stringify(object));
  },

  getValue : function ( name, rules ) {
    let route = this.createRoute( name, {'-' : true} );
    let value = this.directToValue( route, rules );
    while (value?.ref) {
      route = this.redirect( route, value.ref.split('.') );
      value = this.directToValue( route, rules );
    }

    if (value?.combine) {
      value.combine.forEach( direction => {
        let newRoute = this.redirect( [...route], direction.split('.') );
        let newValue = this.getValue( newRoute.join('-'), rules );
        value = this.mergeObjects(value, newValue);
      });
    }

    return value;
  },


  redirect: function ( route, directions ) {
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
  },

  createRoute : function (name, joiners) {
    const route = [];
    for (let i = 0; i < name.length; i++) {
      const letter = name[i];
      if ( joiners[letter] ) {
        let part = name.substr(0, i);
        if (part.length != 0) {
          route.push(part);
        }
        name = name.substr(i + 1);
        i = 0;
      }
    }

    if ( name.length > 0 ) route.push(name);
    return route;
  },

  directToValue : function ( route, dictionary ) {
    if ( !dictionary[route[0]] ) return false;

    if ( route.length == 1 ) return this.clone(dictionary[route[0]]._);

    return this.directToValue( route.slice(1), dictionary[route[0]] );
  },

  validateValue: function ( word, realValidation, words, wordCount = 1 ) {
    let validation = this.clone(realValidation);
    if (!validation) {
      if ( this.isSpace(word) ) {
        return { class : 'spaces' };
      }
      return { class : 'mistake', style : 'color:#FFF;' };
    }

    const typeKeys = Object.keys(validation.type);
    if ( this.isSpace(word) ) {
      return { class : 'spaces' };
    }

    if (
      wordCount > 1 && !validation.multi
      || validation.multi && validation.max && validation.max < wordCount
    ) {
      return { class : 'mistake', style : 'color:#FFF;' };
    }

    for (var j = 0; j < typeKeys.length; j++) {
      const key = typeKeys[j];
      const result = (this[ key ] || this['default']).bind(this)( validation, word, words, key );
      if (result) {
        if (typeof result == 'object') {
          return result;
        }
        return { style : 'color:#0F0;' };
      }
    }

    return { class : 'mistake', style : 'color:#FFF;' };
  },

  isSpace : function (word) {
    return word == " " || word == "\u00A0" || word == '&nbsp;';
  },

  defaultRules : {
    type : {
      functions : true,
      custom : true
    },
    functions : {
      'calc' : true,
      'var' : true
    },
    values : {
      inherit : true,
      initial : true,
      revert : true,
      unset : true
    }
  },

  mergeDefaultRules: function (rules) {
    const defaultObj = this.clone(this.defaultRules);
    return this.mergeObjects(defaultObj, rules);
  },

  mergeObjects: function(parent, child) {
    // Child is overwriting parent
    Object.keys(child).forEach( name => {
      if (typeof child[name] == 'object' && typeof parent[name] == 'object') {
        parent[name] = this.mergeObjects(parent[name], child[name]);
      } else if (Array.isArray(child[name]) && Array.isArray(parent[name])) {
        parent[name] = parent[name].concat(child[name]);
      } else {
        parent[name] = child[name];
      }
    });
    return parent;
  }
}
