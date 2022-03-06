# Overview

Text editor written in Javascript. Displays only visible parts of viewed document which makes page lighter and quicker (_doesn't render not visible lines_). Uses its own script for simulating user interaction instead of deprecated `contenteditable`. Supports creating syntax highlights if used as code editor. More in `HOWTOSYNTAX.md`.

# How to use

Create instance:
```js
new TabJF(document.getElementById('someEditorID'));
```
and done! This should replace given node with editor.

## Using the editor

After you have create your instance of editor:
```js
const editor = new TabJF(someEditorNode);
```
You can use this variable (`editor`) to, for example, get editors content by accessing `editor.render.content`. Or if you would like to replace contents of the editor with saved previously state you can use `editor.truck.import()` method:
```js
/**
 * Populates editor.
 * Requires data transformed into readable, by editor, array. Look into truck.export or truck.exportText how to create it.
 * @param  {Object[] } importAr              Render content type array
 * @param  {Boolean  } [limit=false        ] How many lines we want to import
 * @param  {Number   } [offset=0           ] From which line we should start importing
 * @param  {Boolean  } [clear=true         ] Remove content from editor?
 * @param  {Boolean  } [reverse=false      ] Import lines in reverse order
 * @param  {Node|null} [container=null     ] Container to which import lines (default editor)
 * @param  {Boolean  } [replaceContent=true] Replace render.content with passed array in importAr
 */
import (
  importAr,
  limit = false,
  offset = 0,
  clear = true,
  reverse = false,
  container = null,
  replaceContent = true
)
```
Every method is described like this and separated into modules so you can easily use them like documentation. All available module are located in `/module/` folder.

# Stylization
## Padding

If you have added some stylization to your editor (for example, you have line numbers added) which requires padding the editor, you can specify it by passing amount of pagination (script only cares for left pagination):

```js
new TabJF(editor, { left : 35 });
```

## Line height

For now line height is static (_default is 20_) and can be changed by passing it to the instance:

```js
new TabJF(editor, { left : 35, line : 20 });
```

## CSS

Editor requires some CSS to work properly. Its added automatically when first instance is created and added at the top of head for easier overwriting. Full list of used style can be found in `/schema/styles.js`.

If you would like to customize this editor you can use this classes:
- `.tabjf_editor-con` - editors container
- `.tabjf_editor-con .tabjf_editor` - editor
- `.tabjf_editor-con .tabjf_editor .caret` - cusros
- And few variables that must be used for editor to work properly:
  - `--min-height` - minial height of editor
  - `--paddingTop` - editors padding top
  - `--counter-current` - the line counter (optional, if you want to display line numbers)
  - `--scroll-width` - scroll width, the maximum of Y axis scroll

And I mean used - not defined, you have to include them in your classes. For example:

```css
.tabjf_editor-con .tabjf_editor {
  min-height  : calc( (var(--min-height, 0) - var(--paddingTop, 0)) * 1px);
  counter-set : editor-line var(--counter-current, 0); /* OPTIONAL */
  padding-top : calc( var(--paddingTop, 0) * 1px );
  width       : calc(var(--scroll-width, 100%) * 1px + 5px );
}
```

Remember to try not overwrite those rules as this might break editor behavior.

# Syntax

Editor has a feature for syntax highlighting. Right now it has config file for CSS - you can use it as a reference. To add your own syntax configuration pass it in `schema`:

```js
import cssDefaultStyles from `/schema/rules/css.js`; // Actual path for the example configuration configuration
import jsConfig from './path/to/config.js';           // Your custom path to the file

const defaultCss   = new TabJF(editor , { left : 35, line : 20, schema : cssDefaultStyles });
const customEditor = new TabJF(editor2, { left : 35, line : 20, schema : jsConfig         });
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
const tabJFEditor = new TabJF(editor, { left : 35, line : 20 });
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
  - server driven rendering (_for viewing GB file without having to full files to the client_)
  - Y Rendering (_for files which are made of one big line ( any min.js for example)_)
  - [OPTIONAL] rich editor (_bold/italic/underline_) (_class/inline CSS_) (_might be done by context menu_)
