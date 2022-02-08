<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Tab JF</title>
    <?php
      function cacheBurst($path)
      {
        $v = filemtime(__DIR__ . '/master.css');
        return $path . '?v=' . $v;
      }
    ?>
    <link rel="stylesheet" href="<?= cacheBurst('./master.css'); ?>">
  </head>
  <body>
    <div id="editor" name="aa">
      <p><span>tag #id .color @method [name="a"] {</span></p>
      <p><span>margin : 20px 2% 2em 4rem 5%;</span></p>
      <p><span>&nbsp;margin&nbsp;&nbsp;&nbsp;: 1px 5% e auto s e;margin-bottom:&nbsp; calc(2px + </span></p>
      <p><span>var(--asd, var(aa, "bas"))) 'asda;padding : 10px;a"s"d()dd' var(asd)</span></p>
      <p><span>} sss</span></p>
      <p><span></span></p>
      <p><span>.test {</span></p>
      <p><span>&nbsp;&nbsp;margin:20px;</span></p>
      <p><span>&nbsp;&nbsp;background: rgb(0,0,0) center;</span></p>
      <p><span>}</span></p>
      <p><span>margin:aa;</span></p>
      <p><span>.anama1asd</span><span>|dsa</span><span>|dsa</span></p>
      <!-- <p><span>2asd</span><span>|dsa</span><span>|dsa</span></p>
      <p><span>3asd</span><span>|dsa</span><span>|dsa</span></p>
      <p><span>4asd</span><span>|dsa</span><span>|dsa</span></p>
      <p><span>5ksa|</span></p>
      <p><span></span></p>
      <p><span></span></p>
      <p><span>1. aaaaaaaaa</span></p>
      <p><span>2. bbbbbbb</span><span>1asdasd</span><span>2asdasd</span><span>3asdasd</span><span>ggggg</span></p>
      <p><span>3. ccccccccc</span></p>
      <p><span>4. ddddddd</span></p>
      <p><span>5. eeeeeeeeeee</span></p>
      <p><span>6. eeeeeeeeeee</span></p>
      <p><span>7. eeeeeeeeeee</span></p>
      <p><span>8. eeeeeeeeeee</span></p>
      <p><span>9. eeeeeeeeeee</span></p>
      <p><span>10. eeeeeeeeeee</span></p>
      <p><span>Hello, my name is Michał. How are you? Do you want to fuck? Do you need a friend? How much is your butt? MAAAAAAAAAAAAAAAAAANY money? MAAAAAAAAAAAAAAAAAAAANBNNNNNNNNNY, MAAAAAAAAAAAAANNNNNNNNNNNYYYYYYYYYYY money? asd</span></p>
      <p><span>11. eeeeeeeeeee</span></p>
      <p><span>12. eeeeeeeeeee</span></p>
      <p><span>13. eeeeeeeeeee</span></p>
      <p><span>14. eeeeeeeeeee</span></p>
      <p><span>15. eeeeeeeeeee</span></p>
      <p><span>16. eeeeeeeeeee</span></p>
      <p><span>17. eeeeeeeeeee</span></p>
      <p><span>18. eeeeeeeeeee</span></p>
      <p><span>19. eeeeeeeeeee</span></p>
      <p><span>20. eeeeeeeeeee</span></p>
      <p><span>21. eeeeeeeeeee</span></p>
      <p><span>22. eeeeeeeeeee</span></p>
      <p><span>23. eeeeeeeeeee</span></p>
      <p><span>24. eeeeeeeeeee</span></p>
      <p><span>25. eeeeeeeeeee</span></p>
      <p><span>26. eeeeeeeeeee</span></p>
      <p><span>27. eeeeeeeeeee</span></p>
      <p><span>28. eeeeeeeeeee</span></p>
      <p><span>29. eeeeeeeeeee</span></p>
      <p><span>30. eeeeeeeeeee</span></p>
      <p><span>31. eeeeeeeeeee</span></p>
      <p><span>32. eeeeeeeeeee</span></p>
      <p><span>33. eeeeeeeeeee</span></p>
      <p><span>34. eeeeeeeeeee</span></p>
      <p><span>35. eeeeeeeeeee</span></p>
      <p><span>36. eeeeeeeeeee</span></p>
      <p><span>37. eeeeeeeeeee</span></p>
      <p><span>38. eeeeeeeeeee</span></p>
      <p><span>39. eeeeeeeeeee</span></p>
      <p><span>40. eeeeeeeeeee</span></p>
      <p><span>41. eeeeeeeeeee</span></p>
      <p><span>42. eeeeeeeeeee</span></p>
      <p><span>43. eeeeeeeeeee</span></p>
      <p><span>44. eeeeeeeeeee</span></p>
      <p><span>45. eeeeeeeeeee</span></p>
      <p><span>46. eeeeeeeeeee</span></p>
      <p><span>47. eeeeeeeeeee</span></p>
      <p><span>48. eeeeeeeeeee</span></p>
      <p><span>49. eeeeeeeeeee</span></p>
      <p><span>50. eeeeeeeeeee</span></p>
      <p><span>51. eeeeeeeeeee</span></p>
      <p><span>52. eeeeeeeeeee</span></p>
      <p><span>53. eeeeeeeeeee</span></p>
      <p><span>54. eeeeeeeeeee</span></p>
      <p><span>55. eeeeeeeeeee</span></p>
      <p><span>56. eeeeeeeeeee</span></p>
      <p><span>57. eeeeeeeeeee</span></p>
      <p><span>58. eeeeeeeeeee</span></p>
      <p><span>59. eeeeeeeeeee</span></p>
      <p><span>60. eeeeeeeeeee</span></p> -->
    </div>
    <script src="<?= cacheBurst('./../main.js'); ?>" charset="utf-8" type="module"></script>
    <script src="<?= cacheBurst('./base.js'); ?>" charset="utf-8"></script>
    <script src="<?= cacheBurst('./integration.js'); ?>" charset="utf-8"></script>
    <script src="<?= cacheBurst('./unit.js'); ?>" charset="utf-8"></script>
    <script type="module">
      import schema from '../schema/rules/css.js';
      import { SyntaxCssTest } from './syntax/css.js';
      import { TabJF } from './../main.js';
      const editor = document.getElementById('editor');
      const height = window.innerHeight;
      console.info(editor);
      const contentText = `* {
  padding: 0;
  margin: 0;
}

@keyframes tabjf_blink {
  0%   { opacity: 1; }
  50%  { opacity: 0; }
  100% { opacity: 1; }
}

.tabjf_editor-con {
  --editor-bg : #3e3e3e;
  background-color : var(--editor-bg);
  max-height: calc( var(--max-height, 200) * 1px);
  overflow: auto;
}

.tabjf_editor .caret {
  width     : 1px ;
  height    : 20px;
  position  : absolute   ;
  background-color : #FFF;
  animation : tabjf_blink 1s linear infinite;
  backdrop-filter: url(data:png/image;base64,);
  backdrop-filter: blur(2px);
  backdrop-filter: blur(0);
  backdrop-filter: blur(20rem);
  backdrop-filter: brightness(.20);
  backdrop-filter: brightness(20%);
  backdrop-filter: contrast(.20);
  backdrop-filter: drop-shadow(rgba(0,0,0,.3) 2px 3px 2px);
  backdrop-filter: grayscale(1);
  backdrop-filter: grayscale(20%);
  backdrop-filter: grayscale(0);
  backdrop-filter: hue-rotate(0deg);
  backdrop-filter: hue-rotate(.4turn);
  backdrop-filter: invert(-10%);
  backdrop-filter: invert(-.2);
  backdrop-filter: opacity(20%);
  backdrop-filter: opacity(.5);
  backdrop-filter: sepia(20%);
  backdrop-filter: sepia(.5);
  backdrop-filter: saturate(.5);
  backdrop-filter: saturate(-1000%);
}`;
      const tabEditor = new TabJF(editor, { left : 65, syntax : schema, height, contentText : contentText }, true);
      console.info(tabEditor);
      // Unit and Integrity test won't work with syntax enabled
      // const tIntg = new Integration(tabEditor);
      // const tUnit = new Unit(tabEditor);
      const tSyntaxCss = new SyntaxCssTest(tabEditor);
      console.log(tSyntaxCss);
    </script>
  </body>
</html>
