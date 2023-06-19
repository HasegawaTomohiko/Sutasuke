<?php
include('./dbconnect.php');
$userID = 1;
$questID = 1;
$questData = getquest($questID);
$userData = getUser($userID);

echo $userData['userName'];
echo $questData['questTitle'];

?>