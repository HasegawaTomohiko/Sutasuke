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
    font-size: 2rem;
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
    <!-- アイコンの色　後で編集 -->
    <div class="container">
      
      <div class="result">
        <?php
          include('./dbconnect.php');
          $userID = htmlspecialchars($_POST['userID'], ENT_QUOTES, 'UTF-8');
          $password = htmlspecialchars($_POST['password'], ENT_QUOTES, 'UTF-8');

          $user = getUser($userID);

          if ($user) {
            if (password_verify($password, $user['userPassword'])) {
              echo "<img src=\"img/site/check.png\">";
              echo "<p>認証しました</p>";
              echo "<a id=\"button\"  href='./index.php'>ホームへ進む</a>";
              setcookie('userID', $userID);
            } else {
              echo "<img src=\"img/site/ban.png\">";
              echo "<p>パスワードが違います</p>";
              echo "<a id=\"button\"  href='./auth.php'>ログイン入力フォームへ戻る</a>";
            }
          } else {
            echo "<img src=\"img/site/ban.png\">";
            echo "<p>認証できませんでした</p>";
            echo "<a id=\"button\" href='./auth.php'>ログイン入力フォームへ戻る</a>";
          }
          
        ?>
        
      </div>
  </div>
</body>
</html>