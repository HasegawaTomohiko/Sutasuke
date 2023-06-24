<<<<<<< HEAD
<?php

  require 'dbconnect.php';

  function saveMapData($mapData){
    
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

      // tileConnectテーブルの更新
      // 一旦、tileStartに関連するレコードを削除
      $stmt = $pdo->prepare('DELETE FROM tileConnect WHERE tileStart = :tileStart');
      $stmt->bindValue(':tileStart', $tile['tileID'], PDO::PARAM_STR);
      $stmt->execute();

      // tileToに関連するレコードを挿入
      foreach ($tile['nextTiles'] as $nextTile) {
        $stmt = $pdo->prepare('INSERT INTO tileConnect (tileStart, tileTo) VALUES (:tileStart, :tileTo)');
        $stmt->bindValue(':tileStart', $tile['tileID'], PDO::PARAM_STR);
        $stmt->bindValue(':tileTo', $nextTile, PDO::PARAM_STR);
        $stmt->execute();
      }
    }

    // questテーブルの更新
    // 一旦、マップに関連するクエストのレコードを削除
    $stmt = $pdo->prepare('DELETE FROM quest WHERE tileID IN (SELECT tileID FROM tile WHERE mapID = :mapID)');
    $stmt->bindValue(':mapID', $mapData['mapID'], PDO::PARAM_STR);
    $stmt->execute();

    // 新しいクエストのレコードを挿入
    foreach ($mapData['tiles'] as $tile) {
      foreach ($tile['questID'] as $questID) {
        $stmt = $pdo->prepare('INSERT INTO quest (questID, tileID, questTitle, questContext, questCompleted, questCompleteDate, questTargetDate) VALUES (:questID, :tileID, :questTitle, :questContext, :questCompleted, :questCompleteDate, :questTargetDate)');
        $stmt->bindValue(':questID', $questID, PDO::PARAM_STR);
        $stmt->bindValue(':tileID', $tile['tileID'], PDO::PARAM_STR);
        $stmt->bindValue(':questTitle', $tile['questTitle'], PDO::PARAM_STR);
        $stmt->bindValue(':questContext', $tile['questContext'], PDO::PARAM_STR);
        $stmt->bindValue(':questCompleted', $tile['questCompleted'], PDO::PARAM_INT);
        $stmt->bindValue(':questCompleteDate', $tile['questCompleteDate'], PDO::PARAM_STR);
        $stmt->bindValue(':questTargetDate', $tile['questTargetDate'], PDO::PARAM_STR);
        $stmt->execute();
      }
    }
  }

  $mapData = json_decode($_POST['mapData'], true);

  saveMapData($mapData);

  $res = array('success' => true);
  header('Content-Type: application/json');
  echo json_encode($res);


?>