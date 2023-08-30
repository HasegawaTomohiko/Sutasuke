<?php

    require('dbconnect.php');

    if(deleteTile($_POST['tileID'])){
        $response = array();
        $response['success'] = true;
        echo json_encode($response);
      } else {
        $response = array();
        $response['success'] = false;
        echo json_encode($response);
      }
?>