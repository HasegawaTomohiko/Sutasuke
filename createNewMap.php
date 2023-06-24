<?php

require_once 'dbconnect.php';

$mapTitle = $_POST['mapTitle'];

if(createMap($mapID,$mapData)){
  $response = array();
  $response['success'] = true;
  echo json_encode($response);
} else {
  $response = array();
  $response['success'] = false;
  echo json_encode($response);
}

?>