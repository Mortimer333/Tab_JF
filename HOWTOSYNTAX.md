# Overview

This document will explain how to write your own syntax using this editor highlight syntax.

## Basic Structure

This template is something you have to start with:

```js
const syntax = {
  subset : {
    sets : {
      [...]
    }
  }
}
```

Everything there is will go into `sets` attribute.
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

We have inserted new `landmark` to this syntax schema which will make script stop when encoutered `.` in sentence and apply syntax to everything _behind_ it using _previous word landmark_. Example:

```
.class
```

Firstly the script will encounter `landmark` and try to create highlight for previous part of the sentence but will notice that the cut part is empty and decide to ignore it.
Secondly it will iterate to the end of the line and try to set highlight for the rest of unused sentence which is `.class`. It will check for `landmarks` in this order:

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
With our previous syntax this will be breaked into 4 pieces:
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
This will create a `endstop` each time this letter is found. It will be highlighted with chosen attributes and removed from sentence. So lets try our example:

After adding `single` sentence will be breaked into 5 pieces:
1. `.class`
2. `<space>`
3. `span`
3. `<space>`
4. `#id`

And highlighted correctly.


## Default

As you already know `default` is used when no `landmark` was found and script has to decide how to highlight this part of sentence. You can define how script will highlight parts of the sentence without any `landmarks` assigned:

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
Notice that I have replaced `span landmark` with `default`. So every word without any `landmark` will be highlighted with old `span` attrbiutes. Example:
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

Everything looks correct but you can see there is a small error:

```html
<span style="color:#FF0;">"name</span>
<span style="color:#FF0;">"</span>
```
Which could lead to more problems if for example we would add `=` to the attribute declaration, script would highlight it with red instead of leaving it yellow. But we can repeair it with another `subset` so we can replace old rules:


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

## Syntax validation

We can highlight code based on `landmarks` but what if code is just incorect? It might be preceded with proper `landmark` but it contains not allowed characters. For that cases we can use user defined methods/functions and validate chosen word.

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
The attribute `run` if exists will be excuted (with scope of `landmark`, as you can see example uses `this` key word to access `tags` outside of the method) each time `landmark` assigned to it will be found. This method must return object - `{ attrs : {} }`. Script will use returned object as this word attributes and renders it as such.

For more flexbility you can create methods in seperate file and just include them as module in the `landmark` object:

```js
import functions from '../functions/css.js';
[...]
      default : {
        functions : functions,
        run : function (word, words, letter, sentence, sets) {
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
- `letter` - letter used for searching for `landmark`
- `sentence` - the rest of sentence left to highlight
- `sets` - current `set` - it contains alle rules used in current highlighting so you could access other `landmarks` and change them.

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

Triggers work basically like `run` function but at specific moment of parsing the page. Their scope differs from trigger to trigger.

### Subset has ended.

There is trigger fired when subset has ended. You can add it like this:
```js
[...]
          ':' : {
            end : ';',
            triggers : {
              end : function (word, words, letter, sentence, sets) {
                sets.default.wordCount = 0;
              }
            },
            subset : {
              [...]
            }
          },
[...]
```
And it works basically like `run` function with the same scope.

### Before new line is highlighted

Just before new line will be highlighted by script there is a trigger:

```js
[...]
          ':' : {
            end : ';',
            triggers : {
              line : {
                start : function ( lineNumber, line, sentence, sets ) {
                  // do something at start
                }
              }
            },
            subset : {
              [...]
            }
          },
[...]
```

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
                end : function ( lineNumber, line, sets ) {
                  // do something at end
                }
              }
            },
            subset : {
              [...]
            }
          },
[...]
```

Notice that `sentence` was removed as it will always be empty.
