# Overview

This document will explain how to write your own syntax using this editor highlight syntax.

## Basic Structure

To start writing instructions for your syntax you have to prefix them with `subset` (_later will be explained why_):

```js
const syntax = {
  subset : {
    [...]
  }
}
```

Every single description of your syntax will go into `sets` attribute inside `subset`:

```js
const syntax = {
  subset : {
    sets : {
      [...]
    }
  }
}
```
But firstly some theory:

Script works by iterating over letters in each line and checking `landmarks` to stop and create syntax highlight. For example:

```js
const syntax = {
  subset : {
    sets : {
      '.' : {
        attrs : {
          style : 'color:#F00;'
        }
      }
    }
  }
}
```

We have inserted new `landmark` to this syntax instruction which will make script stop when encoutered `.` in sentence and apply syntax to everything _behind_ it using _previous word landmark_. Example:

```
.class
```

Firstly the script will encounter `landmark` (`.`) and try to create highlight for previous part of the sentence. It will notice that the cut part is empty and decide to ignore it.
Secondly it will iterate to the end of the line without encountering any new `landmarks`. At the end it will try to set highlight for the rest of unused sentence which is `.class`. It will check for `landmarks` in this order:

- First letter of grabbed sentence (in this example it will be `.`)
- Whole sentence (in this example it would be `.class`)
- Checks if `default` setup exists (which I will explain later)
- If nothing is found it returns default styles for syntax - `{ attrs : { style : 'color:#FFF;' } }`

In our case it will stop at first check and get attributes from `.` - `attrs : { style : 'color:#F00;' }` which will color `.class` with red.

### More examples

This is our syntax:

```js
const syntax = {
  subset : {
    sets : {
      '.' : {
        attrs : {
          class : 'class',
          style : 'color:#F00;'
        }
      },
      ' ' : {
        attrs : {
          class : 'space'
        }
      },
      '#' : {
        attrs : {
          class : 'id',
          style : 'color:#00F;'
        }
      },
      'span' : {
        attrs : {
          class : 'span-tag',
          style : 'color:#0F0;'
        }
      }
    }
  }
}
```

And this is our sentence:

```
span.class #id .class2
```

Following our rules from before this will create this html:
```html
<span class="span-tag" style="color:#0F0;">span</span>
<span class="class" style="color:#F00;">.class</span>
<span class="space"> </span>
<span class="id" style="color:#00F;">#id</span>
<span class="space"> </span>
<span class="class" style="color:#F00;">.class2</span>
```

## Single symbols

You might have notice already problem with this design. What will happen if `landmark` is not met at right time? It only checks current letter in search for `landmarks` so if whole word is an `landmark` and it doesn't have other `landmarks` just before and after it then it will highlight it incorrectly. For example:
```
.class span #id
```
With our previous syntax this will be broken into 4 pieces:
1. `.class`
2. `<space>span`
3. `<space>`
4. `#id`

Space got added to the `span` which will cause script to add class `space` to the span instead of `span-tag`.

In that case we can set `single` attribute to the space `landmark`.

```js
[...]
      ' ' : {
        attrs : {
          class : 'space'
        },
        single : true
      }
[...]
```
This will create an `standalone landmark` a.k.a. `standmark` each time this letter is found. It will be highlighted with chosen attributes and removed from sentence. So lets try our example:

After adding `single` sentence will be broken into 5 pieces:
1. `.class`
2. `<space>`
3. `span`
3. `<space>`
4. `#id`

And highlighted correctly.


## Default

As you already know `default` is used when no `landmark` setup was found and script has to decide how to highlight this part of sentence. You can define how script will highlight parts of the sentence without any `landmarks` assigned:

```js
const syntax = {
  subset : {
    sets : {
      '.' : {
        attrs : {
          class : 'class',
          style : 'color:#F00;'
        }
      },
      ' ' : {
        attrs : {
          class : 'space'
        },
        single : true
      },
      '#' : {
        attrs : {
          class : 'id',
          style : 'color:#00F;'
        }
      },
      default : {
        attrs : {
          class : 'tag',
          style : 'color:#0F0;'
        }
      }
    }
  }
}
```
Notice that I have replaced `span landmark` with `default`. So every word without any `landmark` will be highlighted with `span` attributes. Example:
```
span.class div #id
```

The result will be:

```html
<span class="tag" style="color:#0F0;">span</span>
<span class="class" style="color:#F00;">.class</span>
<span class="space"> </span>
<span class="tag" style="color:#0F0;">div</span>
<span class="space"> </span>
<span class="id" style="color:#00F;">#id</span>
```

Quite useful and works for user created tags.

## Subsets

There are situations which require using completly diffrent set of syntax. For those we have `subset` attribute. Its made out of few parts:
- `attrs` - just like any `landmark` you have to set its attribute for highlighting
- `end` - on which letter subset will end
- `subset` - contains `sets` of landmarks used in this set.

Example:
```js
[...]
      '[' : {
        attrs : {
          class : 'attribute',
          style : 'color:#F00;'
        },
        end : ']',
        subset : {
          sets : {
            '=' : {
              attrs : {
                style : 'color:#0FF;'
              },
              single : true
            },
            '"' : {
              attrs : {
                style : 'color:#FF0;'
              }
            },
            "'" : {
              attrs : {
                style : 'color:#FF0;'
              }
            },
            default : {
              attrs : {
                style : 'color:#ABC;'
              }
            }
          }
        }
      },
      ']' : {
        attrs : {
          class : 'attribute',
          style : 'color:#F00;'
        },
        single : true
      }
[...]
```

### Important
Letter which starts the subset is interpreted as having `single` attribute.
Also, remember to add the letter which `ends` the subset, to the `sets` so script can find attributes for it.

Lets see how it will look with currently created schema:

```
span.class div[name="div1"] #id
```

```html
<span class="tag" style="color:#0F0;">span</span>
<span class="class" style="color:#F00;">.class</span>
<span class="space"> </span>
<span class="tag" style="color:#0F0;">div</span>
<span style="color:#F00;" class="attribute">[</span>
<span style="color:#ABC;">name</span>
<span style="color:#0FF;">=</span>
<span style="color:#FF0;">"name</span>
<span style="color:#FF0;">"</span>
<span style="color:#F00;">]</span>
<span class="space"> </span>
<span class="id" style="color:#00F;">#id</span>
```

Everything looks almost correct but you can see there is a small error:

```html
<span style="color:#FF0;">"name</span>
<span style="color:#FF0;">"</span>
```
Which could lead to more problems if for example we would add `=` to the attribute declaration, script would highlight it with red instead of leaving it yellow. But we can repeair it with another `subset`, so we can replace old rules:


```js
[...]
            '"' : {
              attrs : {
                style : 'color:#FF0;'
              },
              end : '"',
              subset : {
                sets : {
                  default : {
                    attrs : {
                      style : 'color:#FF0;'
                    }
                  }
                }
              }
            },
            "'" : {
              attrs : {
                style : 'color:#FF0;'
              },
              end : "'",
              subset : {
                sets : {
                  default : {
                    attrs : {
                      style : 'color:#FF0;'
                    }
                  }
                }
              }
            },
[...]
```
With this any symbol between apostrophe or quotation mark will be colored with `#FF0`.
As you can see we can create subsets infinitely.

### Multiple end landmarks

What if your subset should end on two different `landmarks`? You can define `end` as an object for those situations:

```js
end : {
  ',' : true,
  ')' : true
}
```
Now subset will end if it encounters `,` or `)`.
This will be really helpful when creating syntax for CSS `var` function. It can looks like this:
```css
  margin: var(--margin-value);
```
or with default if `--margin-value` doesn't exist:
```css
margin: var(--margin-value, 10);
```
Each time we have to end subset, so on `,` or `)`. Example:
```js
[...]
  '--' : {
    end : {
      ',' : true,
      ')' : true
    },
    attrs : {
      style : 'color:#F00;'
    },
    subset : {
      sets : {
        default : {
          attrs : {
            style : 'color:#F00;'
          }
        }
      }
    }
  }
[...]
```
This will start subset on `--` and finish it on either `,` or `)`.

## Syntax validation

We can highlight code based on `landmarks` but what if code is just incorrect? It might be preceded with proper `landmark` but it contains not allowed characters. For that cases we can use user defined methods/functions and validate chosen word.

```js
const syntax = {
  subset : {
    sets : {
      '.' : {
        attrs : {
          class : 'class',
          style : 'color:#F00;'
        }
      },
      ' ' : {
        attrs : {
          class : 'space'
        },
        single : true
      },
      '#' : {
        attrs : {
          class : 'id',
          style : 'color:#00F;'
        }
      },
      default : {
        tags : ['span', 'div'],
        run : function (word, words, letter, sentence, sets) {
          if (this.tags.includes(word)) {
            return {
              attrs : {
                class : 'tag',
                style : 'color:#0F0;'
              }
            };
          }
          return {
            attrs : {
              class : 'mistake',
              style : 'color:#F00;'
            }
          };
        }
      }
    }
  }
}
```
The attribute `run` if exists will be excuted (with scope of `landmark`, as you can see example uses `this` key word to access `tags` outside of the method) each time `landmark` assigned to it will be found. This method must return object - `{ attrs : {} }`. Script will use returned object as this word attributes and render them as such.

For more flexbility you can create methods in seperate file and just include them as module in the `landmark` object:

```js
import functions from '../functions/css.js';
[...]
      default : {
        functions : functions,
        run : function (word, words, letter, sentence, sets, subset, syntax) {
          if (this.functions.isProperTag(word)) {
            return {
              attrs : {
                class : 'tag',
                style : 'color:#0F0;'
              }
            };
          }
          return {
            attrs : {
              class : 'mistake',
              style : 'color:#F00;'
            }
          };
        }
      }
[...]
```

Second important thing just after scope are passed values to the function:
- `word` - currently validated word
- `words` - all already highlighted words in current line
- `letter` - `landmark` letter
- `sentence` - the rest of sentence
- `sets` - current `set` - it contains alle rules used in current highlighting so you could access other `landmarks` and change them.
- `subset` - parent of `sets`
- `syntax` - the actual `syntax` module. You can overwrite what you want and use all methods inside of it

### How to use `sets` in `run` function

Lets take for example CSS margin:

```
margin : 10px 20px 10px 20px;
```

Margin can have maximum of 4 values. So to validate it we have to increament counter each time we have value after `:`.

```js
[...]
    ':' : {
      attrs : {
        style : 'color:#AEE;'
      },
      end : ';',
      subset : {
        sets : {
          default : {
            wordCount : 0,
            functions : functions,
            run : function (word, words, letter, sentence, sets) {
              this.wordCount++;
              return this.functions.validateValue(word, this.wordCount);
            }
          }
        }
      }
[...]
```
But `background-position` have multiple values seperated with comma:
```css
background-position: 0 0, center;
```
So we have to reset counter each time we find `,`:
```js
[...]
          ',' : {
            single : true,
            run : function (word, words, letter, sentence, sets) {
              sets.default.wordCount = 0;
              return { style : 'color:#F00;' };
            }
          },
[...]
```
Thanks to `sets` we can easly reset `wordCount` and have properly working validation.

## Triggers

Triggers work basically like `run` function but at specific moment of highlighting the document. Their scope and passed arguments differs from trigger to trigger.

Triggers are set in array for easier manipulation and scalability:

```js
triggers : {
  end : [
    function (word, words, letter, sentence, sets) {
      sets.default.wordCount = 0;
    }
  ]
}
```
They can be attached to any `set` but some of them are only fired at special situations. Below is list of all triggers:

### Subset has started

There is trigger fired when subset has ended. You can add it like this:
```js
[...]
          ':' : {
            end : ';',
            triggers : {
              start : [
                function ( letter, letterSet, word, words, sentence, subset, syntax ) {
                  sets.default.wordCount = 0;
                }
              ]
            },
            subset : {
              [...]
            }
          },
[...]
```
Passed variables:
- `letter` - Letter used to start `subset`
- `letterSet` - Found letter `set`
- `word` - Current word
- `words` - Already highlighted words
- `sentence` - Rest of sentence
- `subset` - contains all parent sets (including that which was just started) so you could access this subset by going `subset[letter]`
- `syntax` - The actual syntax module

### Subset has ended

There is trigger fired when subset has ended. You can add it like this:
```js
[...]
          ':' : {
            end : ';',
            triggers : {
              end : [
                function ( i, word, words, letter, sentence, group, syntax ) {
                  sets.default.wordCount = 0;
                }
              ]
            },
            subset : {
              [...]
            }
          },
[...]
```
Passed variables:
- `i` - Letter iteration in this sentence, this variable gets reseted after each subset end
- `word` - Current word
- `words` - Already highlighted words
- `letter` - Letter that ended subset
- `sentence` - Rest of sentence
- `group` - This subsets set (example: {end:')', subset:{...}, attrs:{...}, start:'var('})
- `syntax` - The actual syntax module

### Before new line is highlighted

Just before new line will be highlighted by script there is a trigger:

```js
[...]
          ':' : {
            end : ';',
            triggers : {
              line : {
                start : [
                  function ( lineNumber, line, sentence, sets, syntax ) {
                    // do something at start
                  }
                ]
              }
            },
            subset : {
              [...]
            }
          },
[...]
```
Passed variables:
- `lineNumber` - number of current line
- `line` - the actual object in `render.content`
- `sentence` - the whole sentence
- `sets` - current group
- `syntax` - the actual syntax module

It scope differs from `end` as it takes the whole passed syntax schema as its scope. So you can access all sets and subsets without problem.
Line number is number of current line, line is an object from which script renders visible for user paragraph.

### After new line was highlighted

Same as `line.start` but after line was highlighted:

```js
[...]
          ':' : {
            end : ';',
            triggers : {
              line : {
                end : [
                    function ( lineNumber, line, sets, syntax ) {
                    // do something at end
                  }
                ]
              }
            },
            subset : {
              [...]
            }
          },
[...]
```

Notice that `sentence` was removed as it will always be empty.

### Why `syntax` is allowed for usage in triggers?

Lets go back to the variable example with multiple ends:

```css
margin: var(--margin-value);
```
with extended example of solution:
```js
{
  end : ')',
  subset : {
    sets : {
      [...]
      '--' : {
        end : {
          ',' : true,
          ')' : true
        },
        triggers : {
          end : [
            function ( i, word, words, letter, sentence, group, syntax ) {
              if (letter == ')') syntax.endSubset();
            }
          ]
        },
        attrs : {
          style : 'color:#F00;'
        },
        subset : {
          sets : {
            default : {
              style : 'color:#F00;'
            }
          }
        }
      },
      [...]
    }
  }
}
```
As you can see those two subset have the same end `)`. But one `landmark` can only end one `subset` at time so to actually exit all `subsets` the example would have to look like this:
```css
margin: var(--margin-value));
```
Or parent `subset` should have two ends - `)` and `;`. But this approach will make the parent of the parent give faulty results.
As you can see there is not much to do if two subsets have to end on the same letter. To accomodate those exception I can't foresee I've allowed using syntax module in triggers. For example:
```js
'--' : {
  [...]
  triggers : {
    end : [
      function ( i, word, words, letter, sentence, group, syntax ) {
        if (letter == ')') syntax.endSubset();
      }
    ]
  },
  [...]
}
```
You can end another `subset` if the `end landmark` was `)`. When you can manipulate whole structure from inside there isn't much problem whatsoever.

## Global Sets

If you have that should be added to every subset you can create them in special attribute `global` at the top of schema:
```js
{
  global : {
    ' ' : {
      single : true,
      attrs : {
        class : 'space'
      }
    }
  },
  subset : {
    [...]
  }
}
```
`sets` created here will be added to all `subsets` you have created but won't overwrite them. So you can still define `space landmark` which would have special `triggers` and it won't get overwritten.
