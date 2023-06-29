<?php
// dbconnect.phpを読み込む
require_once 'dbconnect.php';

// JSONデータをサーバー上に保存する関数
function saveMapData($mapData) {
    $pdo = db_connect();

    // mapテーブルの更新
    $stmt = $pdo->prepare('UPDATE map SET mapTitle = :mapTitle, mapContext = :mapContext WHERE mapID = :mapID');
    $stmt->bindValue(':mapTitle', $mapData['mapTitle'], PDO::PARAM_STR);
    $stmt->bindValue(':mapContext', $mapData['mapContext'], PDO::PARAM_STR);
    $stmt->bindValue(':mapID', $mapData['mapID'], PDO::PARAM_STR);
    $stmt->execute();

    // tileテーブルとtileConnectテーブルの更新
    foreach ($mapData['tiles'] as $tile) {
        // tileテーブルの更新
        $stmt = $pdo->prepare('UPDATE tile SET tileTitle = :tileTitle, tileContext = :tileContext, tileX = :tileX, tileY = :tileY WHERE tileID = :tileID');
        $stmt->bindValue(':tileTitle', $tile['tileTitle'], PDO::PARAM_STR);
        $stmt->bindValue(':tileContext', $tile['tileContext'], PDO::PARAM_STR);
        $stmt->bindValue(':tileX', $tile['tileX'], PDO::PARAM_INT);
        $stmt->bindValue(':tileY', $tile['tileY'], PDO::PARAM_INT);
        $stmt->bindValue(':tileID', $tile['tileID'], PDO::PARAM_STR);
        $stmt->execute();

        // tileのクエストがすべて完了しているかチェック
        $allQuestsCompleted = true;
        foreach ($tile['questID'] as $questID) {
            $stmt = $pdo->prepare('SELECT questCompleted FROM quest WHERE questID = :questID');
            $stmt->bindValue(':questID', $questID, PDO::PARAM_STR);
            $stmt->execute();
            $questCompleted = $stmt->fetchColumn();

            if (!$questCompleted) {
                $allQuestsCompleted = false;
                break;
            }
        }

        // tileCompletedの更新
        $tileCompleted = $allQuestsCompleted ? 1 : 0;
        $stmt = $pdo->prepare('UPDATE tile SET tileCompleted = :tileCompleted WHERE tileID = :tileID');
        $stmt->bindValue(':tileCompleted', $tileCompleted, PDO::PARAM_INT);
        $stmt->bindValue(':tileID', $tile['tileID'], PDO::PARAM_STR);
        $stmt->execute();

        // tileExecutableの更新
        $tileExecutable = 1;
        if (!empty($tile['backTiles'])) {
            foreach ($tile['backTiles'] as $backTileID) {
                $stmt = $pdo->prepare('SELECT tileCompleted FROM tile WHERE tileID = :backTileID');
                $stmt->bindValue(':backTileID', $backTileID, PDO::PARAM_STR);
                $stmt->execute();
                $backTileCompleted = $stmt->fetchColumn();

                if (!$backTileCompleted) {
                    $tileExecutable = 0;
                    break;
                }
            }
        }
        $stmt = $pdo->prepare('UPDATE tile SET tileExecutable = :tileExecutable WHERE tileID = :tileID');
        $stmt->bindValue(':tileExecutable', $tileExecutable, PDO::PARAM_INT);
        $stmt->bindValue(':tileID', $tile['tileID'], PDO::PARAM_STR);
        $stmt->execute();
    }
}

// JSONデータを取得
$mapData = json_decode($_POST['mapData'], true);

// JSONデータをサーバー上に保存
saveMapData($mapData);

// レスポンスを返す（成功時）
$response = array('success' => true, 'message' => 'Map data updated successfully.');
header('Content-Type: application/json');
echo json_encode($response);
?>
