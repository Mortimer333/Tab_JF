<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Tab JF</title>
    <?php
      $v = filemtime(__DIR__ . '/master.css');
    ?>
    <link rel="stylesheet" href="./master.css?v=<?= $v ?>">
  </head>
  <body>
    <div id="editor">
      <p><span>a</span></p>
    </div>
    <?php
      $v = filemtime(__DIR__ . '/main.js');
    ?>
    <script src="./main.js?v=<?= $v ?>" charset="utf-8"></script>
    <script type="text/javascript">
      const tabEditor = new TabJF(editor, { left : 35 });
    </script>
  </body>
</html>
