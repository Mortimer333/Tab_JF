let functions; export default functions = {
  custom : ( group, value ) => {
    return !!group.values[value];
  },
  procent : ( group, value ) => {
    return new RegExp(/\d%/).test(value);
  },
  length : ( group, value ) => {
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

    let firstLetter = value[0];
    let lastLetter  = value[value.length - 1];
    if ( firstLetter != '-' && isNaN(firstLetter) || !isNaN(lastLetter) ) {
      return false;
    }

    value = value.substr(1).replace(/[0-9]/g, '');
    return value.length == 0 || !!units[value];
  }
}
