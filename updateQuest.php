<?php

require_once 'dbconnect.php';

$questID = $_POST['questID'];
$questTitle = $_POST['questTitle'];
$questContext = $_POST['questContext'];
$questCompleted = $_POST['questCompleted'];
$questTargetDate = $_POST['questTargetDate'];

if(updateQuest($questID,$questTitle,$questContext,$questCompleted,$questTargetDate)){
  $response = array();
  $response['success'] = true;
  echo json_encode($response);
} else {
  $response = array();
  $response['success'] = false;
  echo json_encode($response);
}


?>