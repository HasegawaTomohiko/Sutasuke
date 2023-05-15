<?php

    function db_connect(){
        try{
            $pdo = new PDO(
                'mysql:host=localhost;dbname=Sutasuke;charset=utf8',
                'root',
                ''
            );
            return $pdo;
        }catch(PDOException $e){
            exit('接続に失敗:'.$e -> getMessage());
        }
    }

    function getUser($userID){
        $pdo = db_connect();
        $user = $pdo -> prepare("SELECT * FROM user Where userID = :userID");
        $user -> bindValue(':userID', $userID);
        $user -> execute();
        return $user -> fetch(PDO::FETCH_ASSOC);
    }

    function createUser($userID,$userName,$userMail,$userpass){
        $pdo = db_connect();
        $createUser = $pdo -> prepare('INSERT INTO user (userID,userName,userMail,userPassword) value (:userID,:userName,:userMail,:userPassword)');
        $createUser -> bindValue(':userID',$userID);
        $createUser -> bindValue(':userName',$userName);
        $createUser -> bindValue(':userMail',$userMail);
        $createUser -> bindValue(':userPassword',$userpass);
        return $createUser -> execute();
    }

    function getMap(){

    }

    function createMap(){

    }

    function updateMap(){
        
    }

?>