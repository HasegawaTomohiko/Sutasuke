<?php

require 'dbconnect.php';

function getUserMapList($userID){
  $pdo = db_connect();
  $smt = $pdo -> prepare('SELECT mapID, mapTitle FROM map WHERE userID = :userID');
  $smt -> bindParam(':userID', $userID, PDO::PARAM_STR);
  $smt -> execute();
  return $smt -> fetchAll(PDO::FETCH_ASSOC);
}

$userMapList = getUserMapList($_COOKIE['userID']);

header('Content-Type: application/json');
echo json_encode($userMapList);
?>