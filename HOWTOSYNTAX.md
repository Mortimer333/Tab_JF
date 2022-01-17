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

- First letter of grabbed sentence, in this example it will be `.`
- Whole sentence, in this example it would be `.class`
- Checks if `set` has `default` setup (which I will explain later)
- If nothing is found it returns default styles for syntax - `{ attrs : { style : 'color:#FFF;' } }`

In out case it will stop at first check and get attributes from `.` - `attrs : { style : 'color:#F00;' }` which will color `.class` with red.

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

After adding `single it will be breaked into 5 pieces:
1. `.class`
2. `<space>`
3. `span`
3. `<space>`
4. `#id`

And highlighted correctly.


## Default

AS you already know `default` is used when no landmark was found and script has to decide how to highlight this part of sentence. You can set there attrbiutes which will be set for any part of sentence without any landmark.

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
Notice that I have replaced `span landmark` with `default`. So every word without any landmark will be highlighted with old `span` attrbiutes. Example:
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

This additional subset will allow us to start new subset and not worry about any schemats set in parent sets. Example:

```
span.class div[name="div1"] #id
```

<span class="tag" style="color:#0F0;">span</span><span class="class" style="color:#F00;">.class</span><span class="space"> </span><span class="tag" style="color:#0F0;">div</span><span style="color:#F00;" class="attribute">[</span><span style="color:#ABC;">name</span><span style="color:#0FF;">=</span><span style="color:#FF0;">"name</span><span style="color:#FF0;">"</span><span style="color:#F00;">]</span><span class="space"> </span><span class="id" style="color:#00F;">#id</span>

Everything looks correct but you can see there is a small error:

```html
<span style="color:#FF0;">"name</span>
<span style="color:#FF0;">"</span>
```
Which could led to more problems if for example you would add `=` to it.
