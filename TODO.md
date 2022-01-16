# TO DO

1. Expand paste/cut functionality to allow pasting content outside of the editor (plain text). [DONE]
2. Add custom fonts [DONE]
3. Add Rendering [DONE]
4. Check how we handle focusout on the editor [DONE]
5. More customization and triggers [DONE]
6. Add code coloring [DONE]
7. Make coloring optional, and possible to add your own style sheet
7. Move debug tool to other project, improve it and implement back as 3rd party service
8. Server driven rendering (infinite loading), so we can open files of GB in size
9. Add Y rendering (for very long lines like min.js)


## Bugs:
- weird stuff, when deleting `;` from the css rule the whole values will be changed to mistakes and repaired on any key after.
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
- Cant remove line without any word


## Thinkers
