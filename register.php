<!DOCTYPE html>
<html lang="jp">
<head>
  <style>
.container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}
body{
  background-color: rgb(181, 228, 180);
}

h1 {
  margin-bottom: 20px;
}

img{
  height: 100px;
}

.result {
  height: 400px;
  margin-top: 20px;
  padding: 30px 30px 30px 30px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 10px 10px 0 rgba(0, 0, 0, .5);
}

p {
  margin-bottom: 10px;
  color: gray;
    font-size: 1.5rem;
}

a {
  display: inline-block;
  margin-top: 10px;
  text-decoration: none;
}

/* ボタン */
a#button{
  background: #00897B;
  border: none;
  margin-top: 50px;
  width: 100%;
  padding: 10px 0;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
}
a#button:hover {
  /* マウスが載ったとき */
  background: #00c8b4;

  border: 1px solid #2c628b;
}

  </style>
</head>
<body>
<div class="container">
  <div class="result">
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
            echo "<img src=\"img/site/check.png\">";
            print("<p>登録が完了しました</p>");
            print("<a id=\"button\" href='./auth.php'>ログイン入力フォームへ移動する</a>");
          }else{
            echo "<img src=\"img/site/ban.png\">";
            print("<p>登録できませんでした</p>");
            print("<a id=\"button\" href='./auth.php'>もう一度やり直してください</a>");
            // 登録が出来なかった
            /* 
            1. データベースにトラブル
            2. userIDと重複した(?なわけ)
            */
          }
        }else{
          echo "<img src=\"img/site/ban.png\">";
          print("<p>すでにuserIDが利用されています。<br/>他のuserIDに変更してください。</p>");
          print("<a id=\"button\" href='./auth.php'>もう一度やり直してください</a>");
          // 新規登録が出来ない。
          /* 
          1:すでにuserIDが存在する -> このuserIDはすでに存在します
          2:データベースに接続できない -> データベースに接続できません！
          */
        }
        ?>
        </div>
  </div>

</div>
  </div>
</body>
</html>