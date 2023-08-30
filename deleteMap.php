<?php

    require('dbconnect.php');

    if(deleteMap($_POST['mapID'])){
        $response = array();
        $response['success'] = true;
        echo json_encode($response);
      } else {
        $response = array();
        $response['success'] = false;
        echo json_encode($response);
      }
?>