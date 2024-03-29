<!-- ユーザログインと新規登録 -->
<!DOCTYPE html>
<html lang="jp">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./css/res.css">
    <link rel="stylesheet" href="./css/auth.css">
    <title>Sutasuke/auth</title>
</head>
<body>
    <ul class="tabbox">
        <li class="tab active">ログイン</li>
        <li class="tab">新規作成</li>
    </ul>
    <div class="formbox">
        <div class="panel active">
            <label>ログイン</label>
            <form action="./login.php" method="post">
                <input type="text" name="userID" id="userID" placeholder="userID" required="required"><br>
                <input type="password" name="password" id="password" placeholder="password" required="required"><br>
                <input type="submit" name="button" value="ログイン">
            </form>
        </div>
        <div class="panel">
            <label>新規登録</label>
            <form action="./register.php" method="post">
                <input type="text" name="userID" id="userID" placeholder="userID" required="required"><br>
                <input type="text" name="userName" id="userName" placeholder="user name" required="required"><br>
                <input type="email" name="userMail" id="userMail" placeholder="E-Mail address" required="required"><br>
                <input type="password" name="pass" id="pass" placeholder="password" required="required"><br>
                <input type="submit" name="button" value="新規登録" >
            </form>
        </div>
    </div>
    <script src="https://code.jquery.com/jquery-3.6.4.js" integrity="sha256-a9jBBRygX1Bh5lt8GZjXDzyOB+bWve9EiO7tROUtj/E=" crossorigin="anonymous"></script>
    <script src="./js/auth.js"></script>
</body>
</html>

<!-- 



 -->