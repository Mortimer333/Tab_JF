# TAB JF - just text editor
Single Page Text Editor

# Overview

Simple text editor which doesn't use `contenteditable`.

In time editor will be upgraded but the idea is to have normal editor which doesn't depend on any deprecated API. Noting fancy but could be forked &#128540; to be fancier.

# How to use

Just create instance of it:
```js
new TabJF(document.getElementById('id'));
```
and you are done!

## Padding

If you have added some stylization to your editor (for example, to add line numbering) which required padding you can specify it by passing amount of pagination (script does care for top and left pagination only):

```js
new TabJF(editor, { left : 35, top : 10 });
```

## Line height

For now line height is static (_default is 20_) and can be changed by passing it to the instance:

```js
new TabJF(editor, { line : 20 });
```

## Debug mode - only in dev version

Editor has simple `debug mode` which lets checking the order the methods were called, with what arguments and what they returned.

```js
const editor = new TabJF(editor, { line : 20 }, true);
```

To enable it pass `true` as third parameter and check `editor.stack.trace` to view methods.

### Planned features (_in a order they will be implemented_):
  - some code coloring (_CSS for now_) (_there will be separate version for this_)
  - server driven rendering (_for viewing GB file without having to send them to the client_)
  - Y Rendering (_for files which are made of one big line ( any min.js for example)_)
  - [OPTIONAL] font stylization (_bold/italic/underline_) (_class/inline CSS_) (_might be done by following menu_)
