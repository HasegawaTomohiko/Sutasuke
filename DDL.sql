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
  questID varchar(20), /* 自動生成プログラムを作成する */
  mapID varchar(15),
  questTitle varchar(30) DEFAULT NULL,
  questContext varchar(100) DEFAULT NULL,
  questCompleted tinyint(1) DEFAULT 0,
  questCompleteDate datetime,
  questTargetDate datetime,
  PRIMARY KEY (questID),
  FOREIGN KEY (mapID) REFERENCES map(mapID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
