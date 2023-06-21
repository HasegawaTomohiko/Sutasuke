CREATE DATABASE Sutasuke;

CREATE TABLE user(
  userID varchar(30),
  userName varchar(30) DEFAULT 'user',
  userMail varchar(50) DEFAULT NULL,
  userPassword varchar(100) NOT NULL,
  userIconPath varchar(30) DEFAULT './img/icon/001.png',
  PRIMARY KEY (userID)
)ENGINE =InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE map(
  mapID varchar(15),
  userID varchar(30) NOT NULL,
  mapData varchar(2000),
  mapRegistDate datetime,
  mapUpdateDate datetime,
  PRIMARY KEY (mapID),
  FOREIGN KEY (userID) REFERENCES user(userID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE quest(
  questID varchar(20), 
  mapID varchar(15),
  questTitle varchar(30) DEFAULT NULL,
  questContext varchar(100) DEFAULT NULL,
  questCompleted tinyint(1) DEFAULT 0,
  questCompleteDate datetime,
  questTargetDate datetime,
  PRIMARY KEY (questID),
  FOREIGN KEY (mapID) REFERENCES map(mapID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


Insert into map (mapID,userID,mapData,mapRegistDate,mapUpdateDate) value ("teststeststests","hasegawa",'{
  "tiles" : [
    {
      "tileTitle" : "タイトル",
      "tileContext" : "なにやるか",
      "tileColor" : "red",
      "x" : 40,
      "y" : 30,
      "nextTiles" : [1,2],
      "backTiles" : [],
      "tileCompleted" : false,
      "tileExecutable" : true,
      "questID" : ["test1test1test1test1"]
    },
    {
      "tileTitle" : "二次関数",
      "tileContext" : "This is Tile 2",
      "tileColor" : "blue",
      "x" : 130,
      "y" : 150,
      "nextTiles" : [3],
      "backTiles" : [0],
      "tileCompleted" : false,
      "tileExecutable" : false,
      "questID" : ["test2test2test2test2"]
    },
    {
      "tileTitle" : "Tile 3",
      "tileContext" : "This is Tile 3",
      "tileColor" : "green",
      "x" : 400,
      "y" : 100,
      "nextTiles" : [3],
      "backTiles" : [0],
      "tileCompleted" : false,
      "tileExecutable" : false,
      "questID" : [test3test3test3test3]
    },
    {
      "tileTitle" : "Tile 4",
      "tileContext" : "This is Tile 4",
      "tileColor" : "green",
      "x" : 260,
      "y" : 150,
      "nextTiles" : [],
      "backTiles" : [1,2],
      "tileCompleted" : false,
      "tileExecutable" : false,
      "questID" : [test4test4test4test4]
    }
  ]
}',current_date(),current_date());

Insert into quest (questID,mapID,questTitle,questContext,questCompleted,questTargetDate) value (
  "test1test1test1test1",
  "teststeststests",
  "因数分解",
  "めちゃくちゃ難しかった記憶があるよね",
  0,
  cast("2023-7-9" as date)
);

Insert into quest (questID,mapID,questTitle,questContext,questCompleted,questTargetDate) value (
  "test2test2test2test2",
  "teststeststests",
  "微分",
  "お肉食べたい",
  0,
  cast("2023-7-10" as date)
);

Insert into quest (questID,mapID,questTitle,questContext,questCompleted,questTargetDate) value (
  "test3test3test3test3",
  "teststeststests",
  "積分",
  "うまいッ！！！！！",
  0,
  cast("2023-7-11" as date)
);

Insert into quest (questID,mapID,questTitle,questContext,questCompleted,questTargetDate) value (
  "test4test4test4test4",
  "teststeststests",
  "二次関数",
  "待ってろキャンパスライフぅぅぅぅぅぅ！！！！",
  0,
  cast("2023-7-12" as date)
);

