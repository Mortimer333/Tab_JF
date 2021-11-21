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
    <link rel="stylesheet" href="<?= cacheBurst('./smaster.css'); ?>">
  </head>
  <body>
    <div id="editor">
      <p><span>1asd</span><span>|dsa</span><span>|dsa</span></p>
      <p><span>2asd</span><span>|dsa</span><span>|dsa</span></p>
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
      <p><span>60. eeeeeeeeeee</span></p>
    </div>
    <script src="<?= cacheBurst('./../main.js'); ?>" charset="utf-8"></script>
    <script src="<?= cacheBurst('./base.js'); ?>" charset="utf-8"></script>
    <script src="<?= cacheBurst('./integration.js'); ?>" charset="utf-8"></script>
    <script src="<?= cacheBurst('./unit.js'); ?>" charset="utf-8"></script>
    <script type="text/javascript">
      const editor = document.getElementById('editor');
      const tabEditor = new TabJF(editor, { left : 0 }, true);
      const tIntg = new Integration(tabEditor);
      const tUnit = new Unit(tabEditor);
    </script>
  </body>
</html>
