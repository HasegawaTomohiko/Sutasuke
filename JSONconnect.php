<?php
include('./dbconnect.php');
$userID = 1;
$userData = getUser($userID);

print($userData);

?>