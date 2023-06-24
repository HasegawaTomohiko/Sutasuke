<?php

require_once 'dbconnect.php';

$mapID = $_POST['mapID'];
$mapData = $_POST['mapData'];

if(updateMap($mapID,$mapData)){
  $response = array();
  $response['success'] = true;
  echo json_encode($response);
} else {
  $response = array();
  $response['success'] = false;
  echo json_encode($response);
}

?>