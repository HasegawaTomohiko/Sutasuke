<?php

  include('./dbconnect.php');
  $userID = htmlspecialchars($_POST['userID']);
  $userName = htmlspecialchars($_POST['userName']);
  $userMail = htmlspecialchars($_POST['userMail']);
  $password = htmlspecialchars($_POST['pass']);

  if(!getUser($userID)){
    if(createUser($userID,$userName,$userMail,password_hash($password,PASSWORD_DEFAULT))){
      // 登録が完了した
      // 今回はパスワードをハッシュ化させているのでpassword_verifyを使用して認証する。
      print("登録が完了しました");
      print("<a href='./auth.php'>ログイン入力フォームへ移動する</a>");
    }else{
      print("登録できませんでした");
      print("<a href='./auth.php'>もう一度やり直してください</a>");
      // 登録が出来なかった
      /* 
      1. データベースにトラブル
      2. userIDと重複した(?なわけ)
      */
    }
  }else{
    print("すでにuserIDが利用されています。他のuserIDに変更してください。");
    print("<a href='./auth.php'>もう一度やり直してください</a>");
    // 新規登録が出来ない。
    /* 
    1:すでにuserIDが存在する -> このuserIDはすでに存在します
    2:データベースに接続できない -> データベースに接続できません！
    */
  }
?>