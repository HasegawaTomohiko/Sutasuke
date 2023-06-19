<?php
include('./dbconnect.php');
$userID = 1;
$questID = 1;
$userData = getUser($userID);
$questData = getQuest($questID);

$tileTitle = $userData['userName'];
$questTitle = $questData['questTitle']

// ユーザーデータから既存のタイル情報を取得
$existingTiles = isset($questData['questTitle']) ? json_decode($questData['questTitle'], true) : [];

// 新しいタイルデータを作成
$newTile = [
  'tileTitle' => $questTitle,
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

// 更新されたタイルデータをクエストデータに反映
$questData['questTitle'] = json_encode($updatedTiles);

// JSON 形式にエンコード
$jsonData = json_encode($questData);

echo $jsonData;
?>