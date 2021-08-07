## Save

The idea to reverse changes by tracking back what was done is to expensive and over complicated.
What actually can happen? How many operations do we have to keep track of?
- insert
  - letter
  - paste/selection
  - new line
- delete
 - one letter
 - word
 - selection
 - line

Problems:
- remove function are called one by another (remove one calls remove.work, mergeLine etc) so it's hard to know which one has done what without ton of code
- selection is tricky as we would have to keep track of every selection ever to make method universal and not made of exceptions

Possible solutions
- track the state of current line and restore it. We save what function was used but only for few exceptions. Normally we restore whole line so that's something we can universally keep track of. Each time a save dump comes we add in which line it was saved.
  Needed exceptions:
  - newLine - remove saved line
    - problem is when new line appears and later is merged with line under it => solution : force save after newLine/mergeLine
  - mergeLine - split line on current caret position
  - past/cut/remove selection - we could copy clipboard and start position. Depending on action (cut/remove we can count as one) we paste selection or remove by given selection length (how many characters was selected)
    - we could also do the selection from start node to end node but this might fail easily when nodes will be replaced by other functionality and will lose their reference

This solution also works if we where to add font styling. We have to figure out how to save changed lines count and those lines. Then just backtrack one by one. We could even let them choose to which version they want to go back and let them label them. Give them option to display what was changed, choose version and merge those changes. Like git but not with branches but rather commits.  
