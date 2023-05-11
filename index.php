<?php

    // ユーザ取得プログラム(居なかったらログインと新規登録ボタンを表示させる)
    // map取得プログラム(cookieにユーザが登録されていたらそれを使ってmapテーブルを取得)、map情報をすだれ式に表示させる

?>

<!DOCTYPE html>
<html lang="jp">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./css/reset.css">
    <link rel="stylesheet" href="./css/index.css">
    <title>Sutasuke/Home</title>
</head>
<body>
    <div id="header">
        <div id="headerIcon">
            <img src="" alt="siteIcon">
        </div>
        <div id="headerUser">
            <img src="" alt="userIcon">
            <!-- ユーザアイコンをクリックしたときのナビゲーション -->
            <div id="userNav">
                <div id="userSetting">ユーザ設定</div>
                <div id="logout">ログアウト</div>
            </div>
        </div>
    </div>

    <div id="content">
        <!-- マップナビゲーション -->
        <div id="mapNav">
            <div id="mapCreate">
                <button>新規作成</button>
            </div>
            <!-- ここにphpで取得したマップデータを表示する、クリックされたものをmapCanvasに出力する -->
        </div>
        <div id="mapContent">
            <div id="mapView">
                <!-- マップ編集ツール -->
                <div id="mapEdit">
                    <div id="mapEditMode"></div>
                    <div id="mapEditTools">
                        <div id="mapTileAdd"></div>
                        <div id="mapTileMove"></div>
                        <div id="mapLineEdit"></div>
                    </div>
                </div>
                <!-- マップ -->
                <div id="mapContentView">
                    <canvas id="mapCanvas" width="1600" height="900"></canvas>
                </div>
            </div>
            <!-- クエスト表示ナビゲーション -->
            <div id="mapQuestNav">
                <!-- ここにphpで取得したクエストを追加する -->
                <div id="mapQuestAdd">
                    <button>クエスト作成</button>
                </div>
            </div>
        </div>
    </div>

    <div id="footer">

    </div>

    <script src="https://code.jquery.com/jquery-3.6.4.js" integrity="sha256-a9jBBRygX1Bh5lt8GZjXDzyOB+bWve9EiO7tROUtj/E=" crossorigin="anonymous"></script>
    <!-- <script src="./js/tile.js"></script> -->
    <script src="./js/index.js"></script>
</body>
</html>