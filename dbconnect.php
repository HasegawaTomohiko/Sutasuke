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
                        'questCompleted' => $quest['questCompleted'] ? true : false,
                        'questTargetDate' => $quest['questTargetDate'],
                    );

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

    function deleteMap($mapID){
        $pdo = db_connect();
        $deleteMap = $pdo -> prepare("DELETE FROM map WHERE mapID = :mapID");
        $deleteMap -> bindParam(':mapID',$mapID);
        return $deleteMap -> execute();
    }

    function createTile($tileID,$mapID,$tileTitle,$tileContext,$tileX,$tileY){
        $pdo = db_connect();
        $createTile = $pdo -> prepare("INSERT INTO tile (tileID,mapID,tileTitle,tileContext,tileX,tileY) VALUE (:tileID,:mapID,:tileTitle,:tileContext,:tileX,:tileY)");
        $createTile -> bindValue(":tileID",$tileID);
        $createTile -> bindValue(":mapID",$mapID);
        $createTile -> bindValue(":tileTitle",$tileTitle);
        $createTile -> bindValue(":tileContext",$tileContext);
        $createTile -> bindValue(":tileX",$tileX);
        $createTile -> bindValue(":tileY",$tileY);
        return $createTile -> execute();
    }

    function deleteTile($tileID){
        $pdo = db_connect();
        $deleteTile = $pdo -> prepare("DELETE FROM tile WHERE tileID = :tileID");
        $deleteTile -> bindParam(':tileID',$tileID);
        return $deleteTile -> execute();
    }

    function getQuest($questIDs){ //mapDataの持つquestIDの配列を引数にそのまま参照。
        $pdo = db_connect();
        $quest = $pdo -> prepare("SELECT * FROM quest WHERE IN(". substr(str_repeat(',?',count($questIDs)) , 1).")");
        $quest -> execute();
        return $quest -> fetch(PDO::FETCH_ASSOC);
    }

    function createQuest($questID,$tileID,$questTitle,$questContext,$questTargetDate){
        $pdo = db_connect();
        $createQuest = $pdo -> prepare("INSERT INTO quest (questID,tileID,questTitle,questContext,questTargetDate) value (:questID,:tileID,:questTitle,:questContext,:questTargetDate)");
        $createQuest -> bindParam(":questID",$questID);
        $createQuest -> bindParam(":tileID",$tileID);
        $createQuest -> bindParam(":questTitle",$questTitle);
        $createQuest -> bindParam(":questContext",$questContext);
        $createQuest -> bindParam(":questTargetDate",$questTargetDate);
        return $createQuest -> execute();
    }

    function updateQuest($questID, $questTitle, $questContext, $questCompleted, $questTargetDate) {
        $pdo = db_connect();
        $updateQuest = $pdo->prepare("UPDATE quest SET 
                                        questTitle = :questTitle,
                                        questContext = :questContext,
                                        questCompleted = :questCompleted,
                                        questTargetDate = :questTargetDate
                                        WHERE questID = :questID");
        $updateQuest->bindParam(":questTitle", $questTitle);
        $updateQuest->bindParam(":questContext", $questContext);
        $updateQuest->bindParam(":questCompleted", $questCompleted,PDO::PARAM_INT);
        $updateQuest->bindParam(":questTargetDate", $questTargetDate);
        $updateQuest->bindParam(":questID", $questID);
        return $updateQuest->execute();
    }

    function deleteQuest($questID){
        $pdo = db_connect();
        $deleteQuest = $pdo -> prepare("DELETE FROM quest WHERE questID = :questID");
        $deleteQuest -> bindParam(':questID',$questID);
        return $deleteQuest -> execute();
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

