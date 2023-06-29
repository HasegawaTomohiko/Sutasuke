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
                <img src="" alt="userIcon">
                <img  id="iconnow" src="img/icon/001.png" alt="userIcon">
            </div>
            <!-- ユーザアイコンをクリックしたときのナビゲーション -->
            <div id="userNav">
                <div id="userSetting">ユーザ設定</div>
                <div id="user-icon" class="icon"></div>
                <div id="user-name"><?= $userID ?></div>
                <ul class="horizontal-list">
                    <li><img  id="iconsize" src="img/icon/001.png" alt="Icon 1" onclick="saveIcon(this)"></li>
                    <li><img  id="iconsize" src="img/icon/002.png" alt="Icon 2"onclick="saveIcon(this)"></li>
                    <li><img  id="iconsize" src="img/icon/003.png" alt="Icon 3"onclick="saveIcon(this)"></li>
                    <li><img  id="iconsize" src="img/icon/004.png" alt="Icon 3"onclick="saveIcon(this)"></li>
                    <li><img  id="iconsize" src="img/icon/005.png" alt="Icon 3"onclick="saveIcon(this)"></li>
                    <li><img  id="iconsize" src="img/icon/006.png" alt="Icon 3"onclick="saveIcon(this)"></li>

                    </ul>
                    <button id="iconbtn" onclick="selectIcon()">Select Icon</button>

                <div id="logout"><a href="#">logout</a></div>
            </div>
        </div>
    </div>

    <div id="content">
        <!-- マップナビゲーション -->
        <div id="mapNav">
            <div id="mapCreate">
                <button type="button" onclick="openModal()">新規作成</button>

                <!-- ここにphpで取得したマップデータを表示する、クリックされたものをmapCanvasに出力する -->
                <div id="mapTitleView"></div>
            </div>
        </div>
        <div id="mapContent">
            <div id="mapView">
            <!-- 編集ボタン -->
            <div id="EditButton">
                <button id="editTools"><img  id="editimg" src="img/site/btnedit.png"></button>
                <button id="tileMove" style="display: none;"><img id="editimg" src="img/site/tilemove.png"></button>
                <button id="tileAdd" style="display: none;"><img id="editimg" src="img/site/tileadd.png"></button>
                <button id="tileEdit" style="display: none;"><img id="editimg" src="img/site/tilelink.png"></button>
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



    <!-- タイル追加モーダル -->
    <div id="formModal" class="modal">
        <form action="" class="form">
            <h2>タイル追加</h2>
            <label for="tileTitle"></label>
            <input type="text" id="tileTitle" name="tileTitle" placeholder="タイルタイトル"/><br/>
            <label for="tileContext"></label>
            <input type="text" id="tileContext" name="tileContext" placeholder="タイルメモ"/><br/>
            <label for="tileColor"></label>
            <input type="text" id="tileColor" name="tileColor" placeholder="タイルの色"/><br/>
            <button type="submit">登録</button>
        </form>
    </div>


    <div id="footer">

    </div>


    <script src="https://code.jquery.com/jquery-3.6.4.js" integrity="sha256-a9jBBRygX1Bh5lt8GZjXDzyOB+bWve9EiO7tROUtj/E=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.2/jquery.modal.min.js"></script>
    

    <div id="createMap" class="modal">
        <form maction="" class="form">
            <h2>マップ新規作成</h2>
            <input type="text" placeholder="マップ名"/><br/>
            <input type="submit" value="戻る" onclick="window.location.href='../'">
            <input type="submit" value="登録" onclick="window.location.href='../'">
        </for>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.2/jquery.modal.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.2/jquery.modal.min.css" />
    <!-- <script src="./js/tile.js"></script> -->
    <script src="./js/index.js"></script>
    <script src="./js/tab.js"></script>
    <!-- <script src="./js/tile.js"></script> -->
    <!-- <script src="./js/index.js"></script> -->
</body>
</html>