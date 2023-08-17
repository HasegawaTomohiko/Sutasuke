<?php
// dbconnect.phpを読み込む
require_once 'dbconnect.php';

// JSONデータをサーバー上に保存する関数
function saveMapData($mapData) {
    $pdo = db_connect();

    // mapテーブルの更新
    $stmt = $pdo->prepare('UPDATE map SET mapTitle = :mapTitle WHERE mapID = :mapID');
    $stmt->bindValue(':mapTitle', $mapData['mapTitle'], PDO::PARAM_STR);
    $stmt->bindValue(':mapID', $mapData['mapID'], PDO::PARAM_STR);
    $stmt->execute();

    // tileテーブルとtileConnectテーブルの更新 ****要改造****
    foreach ($mapData['tiles'] as $tile) {
        // tileテーブルの更新
        $stmt = $pdo->prepare('UPDATE tile SET tileTitle = :tileTitle, tileContext = :tileContext, tileX = :tileX, tileY = :tileY, tileCompleted = :tileCompleted, tileExecutable = :tileExecutable WHERE tileID = :tileID');
        $stmt->bindValue(':tileTitle', $tile['tileTitle'], PDO::PARAM_STR);
        $stmt->bindValue(':tileContext', $tile['tileContext'], PDO::PARAM_STR);
        $stmt->bindValue(':tileX', $tile['tileX'], PDO::PARAM_INT);
        $stmt->bindValue(':tileY', $tile['tileY'], PDO::PARAM_INT);
        $stmt->bindValue(':tileID', $tile['tileID'], PDO::PARAM_STR);

        // tileのクエストがすべて完了しているかチェック
        $tileCompleted = $tile['tileCompleted'] ? 1 : 0;
        $stmt->bindValue(':tileCompleted', $tileCompleted, PDO::PARAM_INT);

        // tileExecutableの更新
        $tileExecutable = $tile['tileExecutable'] ? 1 : 0;
        $stmt->bindValue(':tileExecutable', $tileExecutable, PDO::PARAM_INT);

        //tileSave実行
        $stmt->execute();

        //tileConnectへの情報登録
        //一旦tileIDをキーに全削除
        $stmt = $pdo->prepare('DELETE FROM tileConnection WHERE tileStart = :tileID');
        $stmt->bindValue(':tileID', $tile['tileID'], PDO::PARAM_STR);
        $stmt->execute();

        //nextTilesの存在がある場合にnextTilesに存在するlengthだけINSERTしていく。
        if (!empty($tile['nextTiles'])) {
            foreach ($tile['nextTiles'] as $nextTileID) {
                $stmts = $pdo->prepare('INSERT INTO tileConnection (tileStart, tileTo) VALUES (:tileStart, :tileTo)');
                $stmts->bindValue(':tileStart', $tile['tileID'], PDO::PARAM_STR);
                $stmts->bindValue(':tileTo', $nextTileID, PDO::PARAM_STR);
                $stmts->execute();
            }
        }
    }
}

// JSONデータを取得
$mapData = $_POST['mapData'];

// JSONデータをサーバー上に保存
saveMapData($mapData);

// レスポンスを返す（成功時）
$response = array('success' => true, 'message' => 'Map data updated successfully.');
header('Content-Type: application/json');
echo json_encode($response);
?>
