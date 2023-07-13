<?php

  require_once 'dbconnect.php';

  $questID = $_POST['questID'];
  $tileID = $_POST['tileID'];
  $questTitle = htmlspecialchars($_POST['questTitle'],ENT_QUOTES,'utf-8');
  $questContext = htmlspecialchars($_POST['questContext'],ENT_QUOTES,'utf-8');
  $questTargetDate = $_POST['questTargetDate'];

  if(createQuest($questID,$tileID,$questTitle,$questContext,$questTargetDate)){
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