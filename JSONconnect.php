<?php
include('./dbconnect.php');
$userID = 1;
$questID = 1;
$userData = getUser($userID);
$questData = getquest($questID);

$tileTitle = $userData['userName'];

// ユーザーデータから既存のタイル情報を取得
$existingTiles = $questData['questTile'];

// 新しいタイルデータを作成
$newTile = [
  'tileTitle' => $tileTitle,
  'tileContext' => 'なにやるか',
  'tileColor' => 'red',
  'x' => 40,
  'y' => 30,
  'nextTiles' => [1,2],
  'backTiles' => [],
  'tileCompleted' => false,
  'tileExecutable' => true,
  'questID' => []
];

// 既存のタイルデータに新しいタイルを追加
$updatedTiles = $existingTiles;
$updatedTiles[] = $newTile;

// 更新されたタイルデータをユーザーデータに反映
$userData['tiles'] = $updatedTiles;

// JSON 形式にエンコード
$jsonData = json_encode($userData);

echo $jsonData;
?>