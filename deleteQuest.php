<?php

    require('dbconnect.php');

    if(deleteQuest($_POST['questID'])){
        $response = array();
        $response['success'] = true;
        echo json_encode($response);
      } else {
        $response = array();
        $response['success'] = false;
        echo json_encode($response);
      }
?>