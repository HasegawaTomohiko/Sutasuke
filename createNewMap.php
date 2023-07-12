<?php

require_once 'dbconnect.php';

$mapID = $_POST['mapID'];
$userID = $_POST['userID'];
$mapTitle = $_POST['mapTitle'];

if(createMap($mapID,$userID,$mapTitle)){
  $response = array();
  $response['success'] = true;
  echo json_encode($response);
} else {
  $response = array();
  $response['success'] = false;
  echo json_encode($response);
}

?>