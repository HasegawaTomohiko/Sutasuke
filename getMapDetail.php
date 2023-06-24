
<?php

  require('./dbconnect.php');

  $mapID = $_POST['mapID'];

  $mapData = getMapDetails($mapID);

  echo json_encode($mapData);


?>