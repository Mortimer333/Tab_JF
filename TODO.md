# TO DO

1. [DONE] Expand paste/cut functionality to allow pasting content outside of the editor (plain text).
2. [DONE] Add custom fonts
3. [DONE] Add Rendering
4. [DONE] Check how we handle focusout on the editor
5. [DONE] More customization and triggers
6. [DONE] Add code coloring
7. Make coloring optional, and possible to add your own style sheet [DONE]
8. Move debug tool to other project, improve it and implement back as 3rd party service
9. Server driven rendering (infinite loading), so we can open files of GB in size
10. Add Y rendering (for very long lines like min.js)


## Bugs:
- weird stuff, when deleting `;` from the css rule the whole values will be changed to mistakes and repaired on any key after.
  But only sometimes. Its consistent that it happens in the same place but it doesn't follow any special rule. Second thing is it repairs itself on any action so its minor bug.
  Try this example:

```
  tag #id .color @method [name="a"] {
margin : 20px 2% 2em 4rem;
 margin   : 1px 5% e auto s e;margin-bottom:  calc(2px +
var(--asd, var(aa, "bas"))) 'asda;
padding : 10px;
margin:20px;
}

.anama1asd|dsa|dsa {
 margin : 2px;
  padding : 20px;
margin:10px 20px;
}
```

and remove `;` from `margin:10px 20px;` in `.anama1asd|dsa|dsa` class

- selection disapears when selecting from right to left and pressing ctrl

## Thinkers

- Computed style sis not adding styles with multi attrbiutes. We have to verify which one we lack. Also it does provide small amount of webkit and moz methods
