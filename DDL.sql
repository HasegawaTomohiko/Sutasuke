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
  tileX int(8),
  tileY int(8),
  tileCompleted TINYINT(1) DEFAULT 0,
  tileExecutable TINYINT(1) DEFAULT 0,
  PRIMARY KEY (tileID),
  FOREIGN KEY (mapID) REFERENCES map(mapID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE tileConnection (
  tilestart VARCHAR(15),
  tileto VARCHAR(15)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE quest(
  questID varchar(20),
  tileID varchar(15),
  questTitle varchar(30) DEFAULT NULL,
  questContext varchar(100) DEFAULT NULL,
  questCompleted tinyint(1) DEFAULT 0,
  questCompleteDate datetime,
  questTargetDate datetime,
  PRIMARY KEY (questID),
  FOREIGN KEY (tileID) REFERENCES tile(tileID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO map (mapID, userID, mapTitle, mapRegistDate, mapUpdateDate) VALUE
('map1', 'hasegawa', 'Map 1', NOW(), NOW()),
('map2', 'hasegawa', 'Map 2', NOW(), NOW()),
('map3', 'hasegawa', 'Map 3', NOW(), NOW());

-- タイルテーブル (tile)
INSERT INTO tile (tileID, mapID, tileTitle, tileContext, tileX, tileY, tileCompleted, tileExecutable) VALUE
('tile1', 'map1', 'Tile 1', 'Tile 1 Context', 100, 100, 0, 0),
('tile2', 'map1', 'Tile 2', 'Tile 2 Context', 200, 200, 0, 0),
('tile3', 'map2', 'Tile 3', 'Tile 3 Context', 300, 300, 0, 0),
('tile4', 'map2', 'Tile 4', 'Tile 4 Context', 400, 400, 0, 0),
('tile5', 'map3', 'Tile 5', 'Tile 5 Context', 500, 500, 0, 0);

-- タイル接続テーブル (tileConnection)
INSERT INTO tileConnection (tilestart, tileto) VALUE
('tile1', 'tile2'),
('tile2', 'tile3'),
('tile3', 'tile4'),
('tile4', 'tile5');

-- クエストテーブル (quest)
INSERT INTO quest (questID, tileID, questTitle, questContext, questCompleted, questCompleteDate, questTargetDate) VALUE
('quest1', 'tile1', 'Quest 1', 'Quest 1 Context', 0, NOW(), NOW()),
('quest2', 'tile1', 'Quest 2', 'Quest 2 Context', 0, NOW(), NOW()),
('quest3', 'tile2', 'Quest 3', 'Quest 3 Context', 0, NOW(), NOW()),
('quest4', 'tile2', 'Quest 4', 'Quest 4 Context', 0, NOW(), NOW()),
('quest5', 'tile3', 'Quest 5', 'Quest 5 Context', 0, NOW(), NOW());
