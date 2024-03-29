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
                <img  id="iconnow" src="img/icon/001.png" alt="userIcon">
            </div>
            <!-- ユーザアイコンをクリックしたときのナビゲーション -->
        </div>
    </div>

    <div id="content">
        <!-- マップナビゲーション -->
        <div id="mapNav">
            <div id="mapCreate">
                <button type="button" id="createMap">新規作成</button>
                <!-- ここにphpで取得したマップデータを表示する、クリックされたものをmapCanvasに出力する -->
            </div>
            <div id="mapTitleView"></div>
        </div>
        <div id="mapContent">
            <div id="mapView">
            <!-- 編集ボタン -->
                <div id="EditButton">
                    <button id="editTools"><img  id="editimg" src="img/site/btnedit.png"></button>
                    <button id="tileMove" style="display: none;"><img id="editimg" src="img/site/tilemove.png"></button>
                    <button id="tileAdd" style="display: none;"><img id="editimg" src="img/site/tileadd.png"></button>
                    <button id="tileEdit" style="display: none;"><img id="editimg" src="img/site/tilelink.png"></button>
                    <button id="saveButton">更新</button>
                </div>
                <!-- マップ -->
                <div id="mapContentView">
                    <canvas id="mapCanvas" width="1600" height="900"></canvas>
                </div>
            </div>
            <!-- クエスト表示ナビゲーション -->
            <div id="mapQuestNav">
                <!-- ここにphpで取得したクエストを追加する -->
                <div id="mapTileView"></div>
                <div id="questView"></div>
                <div id="mapQuestAdd">
                    <button id="createQuest">クエスト作成</button>
                </div>
            </div>
        </div>
    </div>

    <!-- マップ追加モーダル -->
    <div id="formModalMap" class="modal">
        <form class="form">
            <h2>マップ新規作成</h2>
            <input type="text" placeholder="マップ名" id="mapTitle"/><br>
            <button type="button" id="mapAddButton">追加</button>

        </form>
    </div>

    <!-- タイル追加モーダル -->
    <div id="formModalTile" class="modal">
        <form class="form">
            <h2>タイル追加</h2>
            <input type="text" id="tileTitle" placeholder="タイルタイトル"/><br/>
            <input type="text" id="tileContext" placeholder="タイルメモ"/><br/>
            <button type="button" id="tileAddButton">追加</button>
        </form>
    </div>

    <!-- クエスト追加モーダル -->
    <div id="formModalQuest" class="modal">
        <form class="form">
            <h2>クエスト追加</h2>
            <input type="text" id="questTitle" placeholder="クエスト名"/><br/>
            <input type="text" id="questContext" placeholder="クエストメモ"><br>
            <input type="date" id="questTargetDate" placeholder="クエスト目標達成日"><br>
            <button type="button" id="questAddButton">追加</button>
        </for>
    </div>

    <div id="userNav">
        <div id="userSetting">ユーザ設定</div>
        <div id="user-icon" class="icon"></div>
        <div id="user-name"><?= $userID ?></div>
        <ul class="horizontal-list">
                <li><img id="iconsize" src="img/icon/001.png" alt="Icon 1" onclick="saveIcon(this)"></li>
                <li><img id="iconsize" src="img/icon/002.png" alt="Icon 2" onclick="saveIcon(this)"></li>
                <li><img id="iconsize" src="img/icon/003.png" alt="Icon 3" onclick="saveIcon(this)"></li>
                <li><img id="iconsize" src="img/icon/004.png" alt="Icon 4" onclick="saveIcon(this)"></li>
                <li><img id="iconsize" src="img/icon/005.png" alt="Icon 5" onclick="saveIcon(this)"></li>
                <li><img id="iconsize" src="img/icon/006.png" alt="Icon 6" onclick="saveIcon(this)"></li>
            </ul>
            <!-- 使わない -->
            <button id="iconbtn" onclick="selectIcon()">Select Icon</button>

        <div id="logout"><a href="logout.php">logout</a></div>
    </div>


  
    <script src="https://code.jquery.com/jquery-3.6.4.js" integrity="sha256-a9jBBRygX1Bh5lt8GZjXDzyOB+bWve9EiO7tROUtj/E=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.2/jquery.modal.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.2/jquery.modal.min.css" />
    <script src="./js/index.js"></script>
    <script src="./js/tab.js"></script>
</body>
</html>