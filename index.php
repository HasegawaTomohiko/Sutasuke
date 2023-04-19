<?php

    // ユーザ取得プログラム(居なかったらログインと新規登録ボタンを表示させる)
    // map取得プログラム(cookieにユーザが登録されていたらそれを使ってmapテーブルを取得)、map情報をすだれ式に表示させる
    // 

?>

<!DOCTYPE html>
<html lang="jp">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sutasuke/Home</title>
</head>
<body>
    <h1>Sutasuke のホームです。</h1>

    <!-- ここをmapメニューをクリックしたときにそれぞれのmapDataを読み込んでmyCanvasに再出力する -->
    <div id="content">
        <canvas id="myCanvas"></canvas>
    </div>
</body>
</html>