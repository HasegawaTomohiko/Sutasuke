
<?php

  require('./dbconnect.php');

  $mapID = $_POST['mapID'];

  try {
      $mapData = getMapDetails($mapID);
      header('Content-Type: application/json');
      echo json_encode($mapData);
  } catch (PDOException $e) {
      header('Content-Type: application/json');
      echo json_encode(array('error' => $e->getMessage()));
  }
?>