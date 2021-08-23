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

When we save line?
Actually this is tricky. If we wanna save statuses when something changes by one line only then we have to set this not only on debounce but on move down/up too.
But not always we can save on move as sometimes user just travels. So We need:
- changed - if change occured - this will tell us if we can save line content
- content - line content we want to revert to
- line - line number for replacement reference
- letter - letter for pos reference
- type - default false, exception center, this could be :
  - newLine
  - mergeLine
  - cut
  - paste
- data - additional variable for exceptions

# THIS IS PLAN
Or better we can save which lines where changed. With that we could save everything without exceptions.
On cut/paste we have saved start and end lines and those we will save.
This would look like this:
  - startLine
  - endLine
  - content
We would revome lines from startLine to endLine (including) and replace them with saved content. It's exception free

# 1.1

Lets just forgot about replacing existing line. Just add and remove. How much lines to add and how much to remove. It's gonna be simpler and more universal.
So if one thing was changed in line, remove it and add previous one.
If new line was inserted them we should have added where the key was pressed and on newLine exception add new line to remove.

Lets keep lines like this:
1 : line,
2 : line  

etc. as we are already saving them in arrays. This will remove the sLine variable and make it even more simpler.

Lets keep the remove setup as sLine and eLine are still the lowes as we can keep data in memory.
Hmmm but what if the one line if 3435566 and eLine is 3424335? It might be better to have sLine and length.

# Symulations

1. The letter was added - 1. aaaaaa => 1. aaabaa

Saved actions:
Add line 1 to be remove => sLine : 1, len : 1
Add line 1 to be added => 1 : aaaaaa

2. The line was cut into two - 1. aaaba => 1. aaa 2. ba

Saved actions:
Add line 1 and 2 to remove => sLine : 1, len : 2
Add line 1 to be added => 1 : aaaba

3. The line was merged into previous one - 1. aaa 2. ba => 1. aaaba

Saved actions:
Add line 1 to remove => sLine : 1, len : 1
Add line 1 and 2 to add => 1 : aaa, 2 : ba

4. Letter was removed - 1. aaaab => 1. aaaa

Add line 1 to be remove => sLine : 1, len : 1
Add line 1 to be added => 1 : aaaab

5. Data was pasted into - 1. aaa => 1. aab 2. ccc 3. ddd

Add line 1, 2 and 3 to be remove => sLine : 1, len : 3
Add line 1 to be added => 1 : aaaab

6. Data was removed - 1. aab 2. ccc 3. ddd => 1. aab

Add line 1 to be removed => sLine : 1, len 1
Add line 1, 2 and 3 to be added => 1 : aab 2 : ccc 3 : ddd

Actually 7 is just 6 and then 5.
7. Data was removed and then pasted - 1. aab 2. ccc 3. ddd => 1. aad 2.fff 3. ggg 4. eee 5. ddd

Add line 1, 2, 3 and 4 to be removed => sLine : 1, len 4
Add line 1 and 2 to be added => 1 : aab, 2 : ccc


I guess we would like to save those steps after each of those action ( if so excluding 7 ) and just use debounce to create new published version after user stops.

The problem is how we know what to put in remove. Add might be simpler as user have to be there to add/remove stuff. With remove it might be a slight problem as we have to know what action will do. For example:

When creating new line we are saving stuff before ... then we could just save stuff after the function.
Before is for add: all unchanged line. The after will be for remove: all lines that where changed.

Example with new line:

1. User presses enter - newLine().
2. Before we call this method we will save current line => add : { 4 : aabb }
3. Method gets called, content changes to this => 4. aa 5. bb
4. Here comes the remove, we saved the start line be this.pos.line and it was 4. Now we are at 5. So we can check if new line pos is higher then previous one and check by how much. We will end up with this : remove : { sLine : 4, len : 1 } which is perfect.

Example with remove selected:

1. User selects with mouse/keyboard text - 4. a|aa 5. ccc 6 .ee|e (| is where selection starts and ends)
2. User presses backspace/delete
3. Before we call function we check if selection exists. It does so we save all selected lines - add : { 4 : aaa, 5 : ccc, 6 : eee }
4. We call method
5. We saved start line - 4, and we are now at 5 (as the lines look like this: 4. a, 5. e). It checks if new line is higher and adds it to have this : remove : { sLine : 4, len : 1 }

This solution is pretty universal and easy to add.  

# Known issues
- quick deletion (like just pressing delete) will save only the first line and wont add deleted
