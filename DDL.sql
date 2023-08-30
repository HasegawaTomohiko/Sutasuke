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
  FOREIGN KEY (userID) REFERENCES user(userID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


 CREATE TABLE tile(
  tileID VARCHAR(15),
  mapID VARCHAR(15),
  tileTitle VARCHAR(30) NOT NULL,
  tileContext VARCHAR(500),
  tileX int(8),
  tileY int(8),
  tileCompleted TINYINT(1) DEFAULT 0,
  tileExecutable TINYINT(1) DEFAULT 0,
  PRIMARY KEY (tileID),
  FOREIGN KEY (mapID) REFERENCES map(mapID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE tileConnection (
  tilestart VARCHAR(15),
  tileto VARCHAR(15),
  FOREIGN KEY (tilestart) REFERENCES tile(tileID) ON DELETE CASCADE,
  FOREIGN KEY (tileto) REFERENCES tile(tileID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE quest(
  questID varchar(20),
  tileID varchar(15),
  questTitle varchar(30) DEFAULT NULL,
  questContext varchar(100) DEFAULT NULL,
  questCompleted tinyint(1) DEFAULT 0,
  questTargetDate datetime,
  PRIMARY KEY (questID),
  FOREIGN KEY (tileID) REFERENCES tile(tileID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
