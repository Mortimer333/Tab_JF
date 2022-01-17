# Overview

Text editor which doesn't use `contenteditable`, does render only visible part of text onto the page and has option of creating your own custom syntax highlighting. Currently half supports CSS which can be found in `/schema/rules/css.js`.

# How to use

Create instance:
```js
const editor = document.getElementById('someEditorID');
new TabJF(editor);
```
and you are done!

## Padding

If you have added some stylization to your editor (for example, you have line numbers added) which required padding the editor node, you can specify it by passing amount of pagination (script does care only for top and left pagination):

```js
new TabJF(editor, { left : 35, top : 10 });
```

## Line height

For now line height is static (_default is 20_) and can be changed by passing it to the instance:

```js
new TabJF(editor, { left : 35, top : 10, line : 20 });
```

## Styles

This editor is included with some basic styles which are disabled by default. They can be added to the page by passing `addCss` to the instance:

```js
new TabJF(editor, { left : 35, top : 10, line : 20, addCss : true });
```

But if you want to add your own styles you have to remember about few things:
- It has few classes on its own:
  - `tabjf_editor-con` - editors container
  - `tabjf_editor-con tabjf_editor` - editor
  - `tabjf_editor-con tabjf_editor caret` - the text cursor class
  - `.tabjf_editor-con .tabjf_editor p .spaces` - class for showing spaces when syntax enabled
- And few variables that must be used for editor to work properly:
  - `--min-height` - editors min height
  - `--paddingTop` - editors padding top
  - `--counter-current` - the line counter (optional, if you don't have lines)
  - `--scroll-width` - scroll width, the maximum of Y axis scroll

And I mean used - not defined, you have to include them in your classes. Example:

```css
.tabjf_editor-con .tabjf_editor {
  min-height  : calc( (var(--min-height, 0) - var(--paddingTop, 0)) * 1px);
  counter-set : editor-line var(--counter-current, 0); /* OPTIONAL */
  padding-top : calc( var(--paddingTop, 0) * 1px );
  width       : calc(var(--scroll-width, 100%) * 1px + 5px );
}
```

Remember to add this class when you are setting your own styles otherwise editor will start to behave weirdly.

## Syntax

Editor has a feature for highlighting syntax. Right now it has config file for CSS (functionality is tested but this config might be lacking for some cases) so you can use it as reference. To add your own syntax configuration pass it in `schema`:

```js
import cssDefaultStyles from `./schema/rules/css.js`; // Actual path for the default configuration
import jsConfig from './path/to/config.js';           // Your custom path to the file

const defaultCss   = new TabJF(editor , { left : 35, top : 10, line : 20, addCss : true, schema : cssDefaultStyles });
const customEditor = new TabJF(editor2, { left : 35, top : 10, line : 20, addCss : true, schema : jsConfig         });
```

More on syntax in `HOWTOSYNTAX.md`.

## Events

Editor offers handful of events which can be stopped with `stopDefault()` and replaced with your own functionality:

Each `event` returns additional information in `detail` attribute:
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
  - `y` - direction where cursor will go on Y axis

Example:

```js
const TabJFEditor = new TabJF(editor, { left : 35, top : 10, line : 20 });
editor.addEventListener("tabJFDeactivate", e => {
  // The variable `underlineButton` is an example of a button
  // which applies underline to the selected nodes.
  const underlineButton = document.getElementById('underline');

  // Here we are stopping editor deactivation when underline button was pressed.
  // The `e` contains attribute `detail` which have the real focusOut event in `event`
  if (e.detail.event.target == underlineButton) {
    e.preventDefault();
  }
})
```

### Planned features (_in a order they will be implemented_):
  - server driven rendering (_for viewing GB file without having to send them to the client_)
  - Y Rendering (_for files which are made of one big line ( any min.js for example)_)
  - [OPTIONAL] font stylization (_bold/italic/underline_) (_class/inline CSS_) (_might be done by following menu_)
