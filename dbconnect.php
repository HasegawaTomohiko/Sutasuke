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

    function getMap($userID){
        $pdo = db_connect();
        $map = $pdo -> prepare('SELECT * FROM map Where userID = :userID');
        $map -> bindValue(':userID',$userID);
        $map -> execute();
        return $map -> fetch(PDO::FETCH_ASSOC);
    }

    function createMap($userID,$mapData){
        $pdo = db_connect();
        $createMap = $pdo -> prepare('INSERT INTO map (userID,mapData) value (:userID,:mapData)');
        //create mapID -> uuid;
        //create updatetime and registtime.
        $createMap -> bindValue(':userID',$userID);
        $createMap -> bindValue(':mapData',$mapData);
        return $createMap -> execute();
    }

    function updateMap($mapID,$mapUpdateDate,$mapData){
        $pdo = db_connect();
        $updateMap = $pdo -> prepare("UPDATE map set mapUpdateDate = :mapUpdateDate, mapData = :mapData WHERE mapID = :mapID ");
        $updateMap -> bindParam(':mapUpdateDate',$mapUpdateDate);
        $updateMap -> bindParam(':mapData',$mapData);
        $updateMap -> bindParam(':mapID',$mapID);
        return $updateMap -> execute();
    }
?>