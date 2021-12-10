class TabJF_Syntax_Highlight {
  value(chunks, syntax) {
    let chunkCount = 0;
    const spans = [];
    let syntaxBreak = false;

    const types = {
      custom : ( chunk ) => {
        return !!syntax._.values[chunk];
      },
      procent : ( chunk ) => {
        return new RegExp(/\d%/).test(chunk);
      },
      length : ( chunk ) => {
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

        let firstLetter = chunk[0];
        let lastLetter  = chunk[chunk.length - 1];
        if ( firstLetter != '-' && isNaN(firstLetter)  || !isNaN(lastLetter) ) {
          return false;
        }

        chunk = chunk.substr(1).replace(/[0-9]/g, '');
        return chunk.length == 0 || !!units[chunk];
      }
    }

    const typeKeys = Object.keys(syntax._.type);

    for (var i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      if ( this.is.space(chunk[0]) ) {
        spans.push(this.syntax.create.space( chunk ));
        continue;
      }

      chunkCount++;
      if (
        chunkCount > 1 && !syntax._.multi
        || syntax._.multi && syntax._.max && syntax._.max < chunkCount
      ) {
        syntaxBreak = true;
      }

      if ( syntaxBreak ) {
        spans.push(this.syntax.create.mistake( chunk ));
        continue;
      }

      for (var j = 0; j < typeKeys.length; j++) {
        const key = typeKeys[j];
        if (types[ key ]( chunk )) {
          spans.push(this.syntax.create.proper( chunk ));
          break;
        }
      }

    }
    return spans;
  }

  ruleset( chunks ) {
    const spans = [];
    const notAllowedRegex = new RegExp(/[()$!\"'`%\/\\]/);
    let syntaxBreak = false;
    const classes = {
      '.' : 'class',
      '#' : 'id',
      '@' : 'method',
      default : 'tag'
    };
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      if (!syntaxBreak && notAllowedRegex.test(chunk)) {
        syntaxBreak = true;
      }

      if ( syntaxBreak ) {
        spans.push(this.syntax.create.mistake( chunk ));
        continue;
      }

      if ( this.is.space(chunk[0]) ) {
        spans.push(this.syntax.create.space( chunk ));
        continue;
      }

      spans.push(this.syntax.create[( classes[chunk[0]] || classes['default'] )]( chunk ));

    }
    return spans;
  }
}
export { TabJF_Syntax_Highlight };
