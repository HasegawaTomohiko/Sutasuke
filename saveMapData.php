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

    // tileテーブルとtileConnectテーブルの更新 ****要改造****
    foreach ($mapData['tiles'] as $tile) {
        // tileテーブルの更新
        $stmt = $pdo->prepare('UPDATE tile SET tileTitle = :tileTitle, tileContext = :tileContext, tileX = :tileX, tileY = :tileY, tileCompleted = :tileCompleted, tileExecutable = :tileExecutable WHERE tileID = :tileID');
        $stmt->bindValue(':tileTitle', $tile['tileTitle'], PDO::PARAM_STR);
        $stmt->bindValue(':tileContext', $tile['tileContext'], PDO::PARAM_STR);
        $stmt->bindValue(':tileX', $tile['tileX'], PDO::PARAM_INT);
        $stmt->bindValue(':tileY', $tile['tileY'], PDO::PARAM_INT);
        $stmt->bindValue(':tileID', $tile['tileID'], PDO::PARAM_STR);

        // tileのクエストがすべて完了しているかチェック これが悪い。
        $allQuestsCompleted = true;
        foreach ($tile['quests'] as $quests) {/* 
            $stmts = $pdo->prepare('SELECT questCompleted FROM quest WHERE questID = :questID');
            $stmts->bindValue(':questID', $quests['questID'], PDO::PARAM_STR);
            $stmts->execute();
            $questCompleted = $stmts->fetchAll(PDO::FETCH_ASSOC);
 */
            $questCompleted = $quests['questCompleted'];
            if (!$questCompleted) {
                $allQuestsCompleted = false;
                break;
            }
        }

        // tileCompletedの更新(これをbindValueのみにさせてトランザクションを減らす)
        $tileCompleted = $allQuestsCompleted ? 1 : 0;
        $stmt->bindValue(':tileCompleted', $tileCompleted, PDO::PARAM_INT);

        // tileExecutableの更新
        $tileExecutable = 1;
        /*if (!empty($tile['backTiles'])) {
            foreach ($tile['backTiles'] as $backTileID) {

                
                if (!$backTileCompleted) {
                    $tileExecutable = 0;
                    break;
                }
            }
        } */

        $stmt->bindValue(':tileExecutable', $tileExecutable, PDO::PARAM_INT);

        //tileSave実行
        $stmt->execute();

        //tileConnectへの情報登録
        //一旦tileIDをキーに全削除
        $stmt = $pdo->prepare('DELETE FROM tileConnect WHERE tileStart = :tileID OR tileTo = :tileID');
        $stmt->bindValue(':tileID', $tile['tileID'], PDO::PARAM_STR);
        $stmt->execute();

        //nextTilesの存在がある場合にnextTilesに存在するlengthだけINSERTしていく。
        if (!empty($tile['nextTiles'])) {
            foreach ($tile['nextTiles'] as $nextTileID) {
                $stmts = $pdo->prepare('INSERT INTO tileConnect (tileStart, tileTo) VALUES (:tileStart, :tileTo)');
                $stmts->bindValue(':tileStart', $tile['tileID'], PDO::PARAM_STR);
                $stmts->bindValue(':tileTo', $nextTileID, PDO::PARAM_STR);
                $stmts->execute();
            }
        }
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
