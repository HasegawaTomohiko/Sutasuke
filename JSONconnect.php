<?php
include('./dbconnect.php');
$userID = 1;
$userData = getUser($userID);

echo $userData['userName'];

?>