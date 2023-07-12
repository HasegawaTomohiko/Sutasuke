<?php

  require_once 'dbconnect.php';

  $tileID = $_POST['tileID'];
  $mapID = $_POST['mapID'];
  $tileTitle = htmlspecialchars($_POST['tileTitle'],ENT_QUOTES,'utf-8');
  $tileContext = htmlspecialchars($_POST['tileContext'],ENT_QUOTES,'utf-8');
  $tileX = $_POST['tileX'];
  $tileY = $_POST['tileY'];

  if(createTile($tileID,$mapID,$tileTitle,$tileContext,$tileX,$tileY)){
    $response = array();
    $response['success'] = true;
    echo json_encode($response);
  } else {
    $response = array();
    $response['success'] = false;
    echo json_encode($response);
  }
  exit;

?>