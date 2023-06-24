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
  mapTitle varchar(30) NOT NULL,
  mapRegistDate datetime,
  mapUpdateDate datetime,
  PRIMARY KEY (mapID),
  FOREIGN KEY (userID) REFERENCES user(userID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


 CREATE TABLE tile(
  tileID VARCHAR(15),
  mapID VARCHAR(15),
  tileTitle VARCHAR(30),
  tileContext VARCHAR(500),
  tileCompleted TINYINT(1) DEFAULT 0,
  tileExecutable TINYINT(1) DEFAULT 0,
  PRIMARY KEY (tileID),
  FOREIGN KEY (mapID) REFERENCES map(mapID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE tileConnection (
  tilestart VARCHAR(15);
  tileto VARCHAR(15);
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


<<<<<<< HEAD
INSERT INTO quest (questID,questTitle,questContext,questTargetDate) value (
  "test1test1test1test1",
  "テスト001-因数分解",
  "因数分解、素因数分解",
  "2023-7-19"
);

INSERT INTO quest (questID,questTitle,questContext,questTargetDate) value (
  "test2test2test2test2",
  "テスト002-微積分",
  "微分 積分",
  "2023-7-30"
);

INSERT INTO quest (questID,questTitle,questContext,questTargetDate) value (
  "test3test3test3test3",
  "テスト003-二次関数",
  "関数って難しいよね",
  "2023-7-30"
);

INSERT INTO map (mapID,userID,mapTitle,mapData,mapUpdateDate,mapRegistDate) value (
  "teststeststests",
  "hasegawa",
  "テストマップ",
  GETDATE(),
  GETDATE,
);

INSERT INTO map (mapID,userID,mapTitle,mapData,mapUpdateDate,mapRegistDate) value (
  "test2dayadtest2",
  "hasegawa",
  "テストマップ2",
  GETDATE(),
  GETDATE()

);

