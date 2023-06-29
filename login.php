<?php
  include('./dbconnect.php');
  $userID = htmlspecialchars($_POST['userID'],ENT_QUOTES,'UTF-8');
  $password = htmlspecialchars($_POST['password'],ENT_QUOTES,'UTF-8');

  $user = getUser($userID);

  if($user){
    if(password_verify($password,$user['userPassword'])){
      print("認証しました");
      print("<a href='./index.php'>ホームへ進む</a>");
      setcookie('userID',$userID);
    }else{
      print("パスワードが違います");
      print("<a href='./auth.php'>ログイン入力フォームへ戻る</a>");
    }
  }else{
    print("認証できませんでした");
    print("<a href='./auth.php'>ログイン入力フォームへ戻る</a>");
  }
?>