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
  backdrop-filter: greyscale(1);
  backdrop-filter: greyscale(20%);
  backdrop-filter: greyscale(0);
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
  background: linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%),
            linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%),
            linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%);
  background: linear-gradient(to left, #333, #333 50%, #eee 75%, #333 75%);
  background: linear-gradient(0.25turn, #3f87a6, #ebf8e1, #f69d3c);
  background: linear-gradient(#e66465, #9198e5);
  grid-template-columns: minmax(0.1fr) minmax(0.1fr) minmax(0.1fr);
  grid-template-columns: fit-content(10%);
  margin : repeat(4, [col-start] min-content [col-middle] max-content [col-end]);
  margin: repeat(4, [col-start] fit-content(200px) [col-end]);
  margin: matrix(1, 2, -1, 1, 80, 80);
  margin: matrix3d(1, 2, -1, 1, 80, 80);
  margin: perspective(200px);
  margin: rotate(45deg);
  margin: rotate(45grad);
  margin: rotate3d(2, -1, -1, -0.2turn);
  margin: rotateX(2deg);
  margin: rotateY(2deg);
  margin: rotateZ(2deg);
  margin: scale(2, 0.5);
  margin: scaleX(2);
  margin: scaleY(2);
  margin: scale3d(1.3, 1.3, 1.3);
  margin: skew(1.3turn, 1.3deg);
  margin: skewX(1.3turn);
  margin: skewY(1.3turn);
  margin: translate(100px, 200px);
  margin: translate3d(42px, -62px, -135px);
  margin: translateX(200px);
  margin: translateY(20%);
  margin: translateZ(-20%);
  margin: cubic-bezier(0.1, 0.7, 1.0, 0.1);
  margin: steps(2, jump-start);
  margin: steps(2, start);
  margin: clamp(20px, 100px);
  margin: min(50px, -20px);
  margin: max(45vh, 10vw);
  background: conic-gradient(
     red 6deg, orange 6deg 18deg, yellow 18deg 45deg,
     green 45deg 110deg, blue 110deg 200deg, purple 200deg);
  background: radial-gradient(circle at center, red 0, blue, green 100%);
  background: repeating-linear-gradient(transparent, #4d9f0c 40px),
            repeating-linear-gradient(0.25turn, transparent, #3f87a6 20px);
  background: repeating-radial-gradient(circle at 100%, #333, #333 10px, #eee 10px, #eee 20px);
  background: repeating-conic-gradient(
    from 3deg at 25% 25%,
    hsl(200, 100%, 50%) 0deg 15deg,
    hsl(200, 100%, 60%) 10deg 30deg
  );
  margin: cross-fade(url(white.png), url(black.png), 100%);
  margin: counter(countername, upper-roman);
  margin: counters(countername, '.', upper-roman);
  list-style: symbols(cyclic "*" "†" "‡");
  shape-outside: circle(50%);
  clip-path: circle(6rem at 12rem 8rem);
  shape-outside: inset(20px 50px 10px 0 round 50px);
  clip-path: polygon(50% 2.4%, 34.5% 33.8%, 0% 38.8%, 25% 63.1%, 19.1% 97.6%);
  margin: path(evenodd,"M 10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80");
  margin: env(safe-area-inset-left, 1.4rem);
}`;
      const tabEditor = new TabJF(editor, { left : 65, syntax : schema, height, contentText : contentText }, true);
      console.info(tabEditor);
      // Unit and Integrity test won't work with syntax enabled
      // const tIntg = new Integration(tabEditor);
      // const tUnit = new Unit(tabEditor);
      // const tSyntaxCss = new SyntaxCssTest(tabEditor);
      // console.log(tSyntaxCss);
    </script>
  </body>
</html>
