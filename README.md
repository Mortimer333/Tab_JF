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
new TabJF(editor, { left : 35, top : 10, line : 20 });
```

## Events

Editor offers handful of events which you can stop and substitute with your own functionality.

Each editor returns additional information in `detail` attribute:
- `tabJFCopy` - Fired before part of editor was copied. Details:
  - `pos` - current position of caret
  - `instance` - the instance of the editor
  - `event` - null
  - `clipboard` - pasted part. It will be an normal object, not a list of nodes
- `tabJFPaste` - Fired before something was pasted into editor. Details:
  - `pos` - current position of caret
  - `instance` - the instance of the editor
  - `event` - null
  - `clipboard` - copied part. It will be an normal object, not a list of nodes
- `tabJFCut` - Fired before something was cut from editor. Details:
  - `pos` - current position of caret
  - `instance` - the instance of the editor
  - `event` - null
  - `clipboard` - cut part. It will be an normal object, not a list of nodes
- `tabJFUndo` - Fired before editor reformed into its previous version (ctrl + z). Details:
  - `pos` - current position of caret
  - `instance` - the instance of the editor
  - `event` - null
  - `versionNumber` - version to which editor will be transformed too
  - `version` - actual object holding new version
  - `versionNumberBefore` - current version
  - `versionBefore` - object holding instructions for current version (could be `undefined`)
- `tabJFRedo` - Fired before editor is changed to the future version (ctrl + y). Details:
  - `pos` - current position of caret
  - `instance` - the instance of the editor
  - `event` - null
  - `versionNumber` - version to which editor will be transformed too
  - `version` - actual object holding new version
  - `versionNumberBefore` - current version
  - `versionBefore` - object holding instructions for current version (could be `undefined`)
- `tabJFSelectAll` - Fired before editor is fully selected (ctrl + a). Details:
  - `pos` - current position of caret
  - `instance` - the instance of the editor
  - `event` - null
- `tabJFSelectStop` - Fired before user stopped selecting nodes with his mouse. Details:
  - `pos` - current position of caret
  - `instance` - the instance of the editor
  - `event` - Mouse Up event
  - `selection` - selected part of editors content
- `tabJFActivate` - Fired before editor is clicked and activated. Details:
  - `pos` - current position of caret
  - `instance` - the instance of the editor
  - `event` - Click event
- `tabJFDeactivate` - Fired before deactivating editor. Details:
  - `pos` - current position of caret
  - `instance` - the instance of the editor
  - `event` - Focus Out event
- `tabJFKeyDown` - Fired before resolving key down action. Details:
  - `pos` - current position of caret
  - `instance` - the instance of the editor
  - `event` - Key Down event
- `tabJFKeyUp` - Fired before resolving key up action. Details:
  - `instance` - the instance of the editor
  - `pos` - current position of caret
  - `event` - Key Up event
- `tabJFMove` - Fired before caret will be moved. Details:
  - `pos` - current position of caret
  - `instance` - the instance of the editor
  - `event` - Key Down event
  - `selection` - currently selected editors content
  - `x` - direction where cursor will go on X axis
  - `Y` - direction where cursor will go on Y axis

Each event can be stopped with `stopDefault()` and replaced with your own function:

```js
const TabJFEditor = new TabJF(editor, { left : 35, top : 10, line : 20 });
editor.addEventListener("tabJFDeactivate", e => {
  // underlineButton here is a example button which applies underline to the selected nodes
  // and which clicked shouldn't remove focus out of editor
  if (e.target == underlineButton) {
    e.preventDefault();
  }
})
```

## Debug mode - only in dev version

Editor has simple `debug mode` which lets checking the order the methods were called, with what arguments and what they returned.

```js
new TabJF(editor, { left : 35, top : 10, line : 20 }, true);
```

To enable it pass `true` as third parameter and check `editor.stack.trace` to view methods.

### Planned features (_in a order they will be implemented_):
  - some code coloring (_CSS for now_) (_there will be separate version for this_)
  - server driven rendering (_for viewing GB file without having to send them to the client_)
  - Y Rendering (_for files which are made of one big line ( any min.js for example)_)
  - [OPTIONAL] font stylization (_bold/italic/underline_) (_class/inline CSS_) (_might be done by following menu_)
