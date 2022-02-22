# TO DO

1. [DONE] Expand paste/cut functionality to allow pasting content outside of the editor (plain text).
2. [DONE] Add custom fonts
3. [DONE] Add Rendering
4. [DONE] Check how we handle focusout on the editor
5. [DONE] More customization and triggers
6. [DONE] Add code coloring
7. [DONE] Make coloring optional, and possible to add your own style sheet
8. Move debug tool to other project, improve it and implement back as 3rd party service
9. Server driven rendering (infinite loading), so we can open files of GB in size
10. Add Y rendering (for very long lines like min.js)


## Bugs:

- On doubleclick save selection
- When scrolled selection starts from top but should from click point
- When selected lower line and scrolling up:
Uncaught Error: Line not found when recalculating caret position
    recalculatePos http://localhost/tab_jf/module/caret.js:106
    page http://localhost/tab_jf/module/update.js:7
    event http://localhost/tab_jf/module/render/fill.js:12
    init http://localhost/tab_jf/module/render.js:20
    TabJF http://localhost/tab_jf/main.js:124
    <anonymous> http://localhost/tab_jf/tests/:104
caret.js:106:22


## Thinkers

- Add webkit and moz styles
- Add notes (/**/)
