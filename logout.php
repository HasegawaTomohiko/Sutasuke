<?php

  setcookie("user","",time()-30);
  
  header("location:./auth.php");

?>