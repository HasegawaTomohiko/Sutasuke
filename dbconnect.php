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

    function getMapList($userID){
        $pdo = db_connect();
        $map = $pdo -> prepare('SELECT mapID, mapTitle from map WHERE userID = :userID');
        $map -> bindParam(':userID',$userID);
        $map -> execute();
        return $map -> fetch(PDO::FETCH_ASSOC);
    }

    function getMapDetails($mapID){
        $pdo = db_connect();
    
        //mapIDを基にマップの全データを取得
        $st = $pdo->prepare('SELECT * FROM map WHERE mapID = :mapID');
        $st->bindParam(':mapID', $mapID, PDO::PARAM_STR);
        $st->execute();
        $mapDetails = $st->fetch(PDO::FETCH_ASSOC);
    
        //mapIDを基にtileの情報を取得
        $stmt = $pdo->prepare('SELECT * FROM tile WHERE mapID = :mapID');
        $stmt->bindValue(':mapID', $mapID, PDO::PARAM_STR);
        $stmt->execute();
        $tiles = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        //mapIDを基にtileIDを取得し、それらが含まれているtileStartとtileToの情報を取得する
        $stmt = $pdo->prepare('SELECT * FROM tileConnection WHERE tileStart IN (SELECT tileID FROM tile WHERE mapID = :mapID) OR tileTo IN (SELECT tileID FROM tile WHERE mapID = :mapID)');
        $stmt->bindValue(':mapID', $mapID, PDO::PARAM_STR);
        $stmt->execute();
        $tileConnects = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        //mapIDを基にtileIDを取得し、それらが持っているquestIDを取得する
        $stmt = $pdo->prepare('SELECT * FROM quest WHERE tileID IN (SELECT tileID FROM tile WHERE mapID = :mapID)');
        $stmt->bindValue(':mapID', $mapID, PDO::PARAM_STR);
        $stmt->execute();
        $quests = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        $mapData = array(
            'mapID' => $mapDetails['mapID'],
            'mapTitle' => $mapDetails['mapTitle'],
            'tiles' => array()
        );
    
        foreach ($tiles as $tile) {
            $tileData = array(
                'tileID' => $tile['tileID'],
                'tileTitle' => $tile['tileTitle'],
                'tileContext' => $tile['tileContext'],
                'tileX' => $tile['tileX'],
                'tileY' => $tile['tileY'],
                'nextTiles' => array(),
                'backTiles' => array(),
                'tileCompleted' => false,
                'tileExecutable' => false,
                'quests' => array()
            );
    
            foreach ($tileConnects as $tileConnect) {
                if ($tileConnect['tilestart'] === $tile['tileID']) {
                    $tileData['nextTiles'][] = $tileConnect['tileto'];
                }
                if ($tileConnect['tileto'] === $tile['tileID']) {
                    $tileData['backTiles'][] = $tileConnect['tilestart'];
                }
            }

            if($tile['tileCompleted'] == 1){
                $tileData['tileCompleted'] = true;
            }

            if($tile['tileExecutable'] == 1 || empty($tileData['backTiles'])){
                $tileData['tileExecutable'] = true;
            }
    
            foreach ($quests as $quest) {
                if ($quest['tileID'] === $tile['tileID']) {
                    $tileData['quests'][] = array(
                        'questID' => $quest['questID'],
                        'questTitle' => $quest['questTitle'],
                        'questContext' => $quest['questContext'],
                        'questCompleted' => false,
                        'questTargetDate' => $quest['questTargetDate'],
                    );

                    if($quest['questCompleted'] == 1){
                        $tileData['quests']['questCompleted'] == true;
                    }
                }
            }
    
            $mapData['tiles'][] = $tileData;
        }
    
        return $mapData;
    }

    function createMap($mapID,$userID,$mapTitle){
        $pdo = db_connect();
        $createMap = $pdo -> prepare('INSERT INTO map (mapID,userID,mapTitle,mapRegistDate,mapUpdateDate) value (:mapID,:userID,:mapTitle,:mapRegistDate,:mapUpdateDate)');
        $createMap -> bindValue(':mapID',$mapID);
        $createMap -> bindValue(':userID',$userID);
        $createMap -> bindValue(':mapTitle',$mapTitle);
        $createMap -> bindValue(':mapRegistDate',date('Y-m-d H:i:s'));
        $createMap -> bindValue(':mapUpdateDate',date('Y-m-d H:i:s'));
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

    function generateID($length){ // 62 ^ 15
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $randomString = '';
        for($i = 0;$i < $length; $i++){
            $randomString .= $characters[rand(0, strlen($characters) - 1)];
        }
        return $randomString;
    }
?>