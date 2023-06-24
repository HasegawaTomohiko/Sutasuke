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
        $map = $pdo -> prepare('SELECT * from map WHERE userID = :userID');
        $map -> bindParam(':userID',$userID);
        $map -> execute();
        return $map -> fetch(PDO::FETCH_ASSOC);
    }

    function createMap($userID,$mapTitle){
        $pdo = db_connect();
        $createMap = $pdo -> prepare('INSERT INTO map (mapID,userID,mapTitle) value (:mapID,:userID,:mapTitle)');
        //create mapID -> uuid;
        //create updatetime and registtime.
        $createMap -> bindValue(':mapID',generateID(15));
        $createMap -> bindValue(':userID',$userID);
        $createMap -> bindValue(':mapTitle',$mapTitle);
        return $createMap -> execute();
    }

    function updateMap($mapID,$mapData){
        $pdo = db_connect();
        $updateMap = $pdo -> prepare("UPDATE map set mapUpdateDate = :mapUpdateDate, mapData = :mapData WHERE mapID = :mapID ");
        $updateMap -> bindParam(':mapUpdateDate',date('Y-m-d H:i:s'));
        $updateMap -> bindParam(':mapData',$mapData);
        $updateMap -> bindParam(':mapID',$mapID);
        return $updateMap -> execute();
    }

    function getQuest($questIDs){ //mapDataの持つquestIDの配列を引数にそのまま参照。
        $pdo = db_connect();
        $quest = $pdo -> prepare("SELECT * FROM quest WHERE IN(". substr(str_repeat(',?',count($questIDs)) , 1).")");
        $quest -> execute();
        return $quest -> fetch(PDO::FETCH_ASSOC);
    }

    function createQuest($questID,$questTitle,$questContext,$questTargetDate){
        $pdo = db_connect();
        $createQuest = $pdo -> prepare("INSERT INTO quest (questID,questTitle,questContext,questTargetDate) value (:questID,:questTitle,:questContext,:questTargetDate)");
        $createQuest -> bindParam(":questID",$questID);
        $createQuest -> bindParam(":questTitle",$questTitle);
        $createQuest -> bindParam(":questContext",$questContext);
        $createQuest -> bindParam(":questTargetDate",$questTargetDate);
        return $createQuest -> execute();
    }

    function generateID($length){
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $randomString = '';
        for($i = 0;$i < $length; $i++){
            $randomString .= $characters[rand(0, strlen($characters) - 1)];
        }
        return $randomString;
    }
?>