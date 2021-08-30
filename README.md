# TAB JF - just an editor
Single Page Text Editor

# Overview

Simple editor which doesn't use `contenteditable`. Works with every font, all normal actions are supported (version control, special actions (ctrl + c, ctrl + v, ctrl + a etc.)).

In time editor will be upgraded but the idea is to have normal editor which doesn't depend on any deprecated API. Noting fancy but could be forked &#128540; to be fancier.

# How to use

Just create instance of it:
```js
new TabJF(document.getElementById('id'));
```
and you are done!

## Editor was stylized

If you have added some stylization to your editor (for example, to add line numbering) you can specify the **"margin"** of the editor by passing simple object:

```js
new TabJF(editor, { left : 35, top : 10 });
```
Now text will be moved by `35px` to right and `10px` to bottom;

## Line height

For now line height is static (_default is 20_) and can be changed by passing it to the instance:

```js
new TabJF(editor, { line : 20 });
```

## Debug mode

Editor has simple `debug mode` which lets checking the order the methods were called, with what arguments and what they returned.

```js
const editor = new TabJF(editor, { line : 20 }, true);
```

To enable it pass `true` as third parameter and check `editor.stack.trace` to view methods.

_Later there will patch which will separate versions with debug from normal version so the script size will be smaller._

### Planned features (_in a order they will be implemented_):
  - rendering - only show on page the used part +-80 lines (_performance driven_)
  - some code coloring (_CSS for now_) (_there will be separate version for this_)
  - font stylization (_bold/italic/underline_) (_class/inline CSS_) (_might be done by following menu_)
