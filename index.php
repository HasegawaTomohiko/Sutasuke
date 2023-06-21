<?php

    // ユーザ取得プログラム(居なかったらログインと新規登録ボタンを表示させる)
    // map取得プログラム(cookieにユーザが登録されていたらそれを使ってmapテーブルを取得)、map情報をすだれ式に表示させる
    if(!isset($_COOKIE['userID'])){
        header('location:./auth.php');
    }

    $userID = $_COOKIE['userID'];

?>

<!DOCTYPE html>
<html lang="jp">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./css/reset.css">
    <link rel="stylesheet" href="./css/index.css">
    <!-- Remember to include jQuery :) -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0/jquery.min.js"></script>
    <!-- jQuery Modal -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.css" />
    <title>Sutasuke/Home</title>
</head>
<body>
    <div id="header">
        <div id="headerIcon">
            <img  class="headerimg" src="img/icon/headericon.png" alt="siteIcon">
        </div>
        <div id="headerUser">
            <div id="userIcon">
                <img src="001.png" alt="userIcon">
            </div>
            <!-- ユーザアイコンをクリックしたときのナビゲーション -->
            <div id="userNav">
                <div id="userSetting">ユーザ設定</div>
                <div id="user-icon" class="icon"></div>
                <div><?= $userID ?></div>
                <ul id="color-list">
                <li class="color-option" data-color="red" style="background-color: red;"></li>
                <li class="color-option" data-color="blue" style="background-color: blue;"></li>
                <li class="color-option" data-color="green" style="background-color: green;"></li>
                </ul>
                <div id="logout"><a href="#">logout</a></div>
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
            <!-- 編集ボタン -->
            <div id="EditButton">
                <button onclick="toggleButtons()"><img  id="editimg" src="img/site/btnedit.png"></button>
                <button id="tileMove" style="display: none;"><img id="editimg" src="img/site/tilelink.png"></button>
                <button id="tileAdd" style="display: none;"><img id="editimg" src="img/site/tileadd.png"></button>
                <button id="tileEdit" style="display: none;"><img id="editimg" src="img/site/tilemove.png"></button>
            </div>
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

    <div id="formModal" class="modal">
        <form action="" class="form">
            <h2>タイル追加</h2>
            <input type="text" placeholder="タイル名"/><br/>
            <input type="text" placeholder="タイルメモ"/><br/>
            <input type="submit" value="戻る" onclick="window.location.href='../'">
            <input type="submit" value="登録" onclick="window.location.href='../'">
        </form>
    </div>

    <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.2/jquery.modal.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.2/jquery.modal.min.css" />
    <!-- <script src="./js/tile.js"></script> -->
    <script src="./js/index.js"></script>

    <div id="footer">

    </div>


    <script src="https://code.jquery.com/jquery-3.6.4.js" integrity="sha256-a9jBBRygX1Bh5lt8GZjXDzyOB+bWve9EiO7tROUtj/E=" crossorigin="anonymous"></script>
    <!-- <script src="./js/tile.js"></script> -->
    <!-- <script src="./js/index.js"></script> -->
    <script src="./js/index.js"></script>
    <script src="./js/tab.js"></script>
</body>
</html>