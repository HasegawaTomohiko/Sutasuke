
class Tile {
  constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.nextTiles = [];
  }

  draw() {
      tileContext.beginPath();
      tileContext.arc(this.x, this.y, 20, 0, Math.PI * 2);
      tileContext.fillStyle = this.color;
      tileContext.fill();
      tileContext.closePath();
  }

  connectTo(nextTile) {
      this.nextTiles.push(nextTile);
  }

  drawConnections() {
      for (let i = 0; i < this.nextTiles.length; i++) {
          lineContext.save();
          lineContext.beginPath();
          lineContext.moveTo(this.x, this.y);
          lineContext.lineTo(this.nextTiles[i].x, this.nextTiles[i].y);
          lineContext.strokeStyle = 'black';
          lineContext.stroke();
          lineContext.closePath();
      }
  }

  isDragging = false;
  dragStartX = 0;
  dragStartY = 0;
  isMouseOver(mouseX,mouseY){
      this.isDragging = true;
      this.dragStartX = mouseX;
      this.dragStartY = mouseY;
  }

  stopDragging(){
      this.isDragging = false;
  }
  drag(mouseX, mouseY) {
      if (this.isDragging) {
        this.x += mouseX - this.dragStartX;
        this.y += mouseY - this.dragStartY;
        this.dragStartX = mouseX;
        this.dragStartY = mouseY;
      }
  }
}

function generateMap(mapData) {
  let mapTiles = [];
  for (let i = 0; i < mapData.tiles.length; i++) {
      let tileData = mapData.tiles[i];
      let tile = new Tile(tileData.x, tileData.y,tileData.color);
      mapTiles.push(tile);
  }

  for (let i = 0; i < mapData.tiles.length; i++) {
      let tileData = mapData.tiles[i];
      let tile = mapTiles[i];
      let nextTileIds = tileData.nextTiles;
      for (let j = 0; j < nextTileIds.length; j++) {
      let nextTile = mapTiles[nextTileIds[j]];
      tile.connectTo(nextTile);
      }
  }

  return mapTiles;
}

let canvas = document.getElementById('mapCanvas');
let tileLayer = document.createElement('canvas');
let lineLayer = document.createElement('canvas');
let context = canvas.getContext('2d');

tileLayer.width = canvas.width;
tileLayer.height = canvas.height;
let tileContext = tileLayer.getContext('2d');

lineLayer.width = canvas.width;
lineLayer.height = canvas.height;
let lineContext = lineLayer.getContext('2d');

let mapData = {
  "tiles": [
      {"x": 30, "y": 30, "color": "red", "nextTiles": [1,5]},
      {"x": 80, "y": 30, "color": "green", "nextTiles": [2, 3]},
      {"x": 80, "y": 80, "color": "blue", "nextTiles": [4]},
      {"x": 130, "y": 30, "color": "yellow", "nextTiles": [5]},
      {"x": 130, "y": 80, "color": "purple", "nextTiles": [6]},
      {"x": 130, "y": 130, "color": "orange", "nextTiles": [7]},
      {"x": 180, "y": 30, "color": "pink", "nextTiles": []},
      {"x": 180, "y": 80, "color": "cyan", "nextTiles": [4, 5, 6]}
  ]
};

const test = {
    "mapCompleted":false,
    "tiles": [
      {
        "tileId": 1,
        "tileTitle": "Tile1",
        "tileContext": "This is Tile1",
        "tileColor": "red",
        "x": 40,
        "y": 60,
        "nextTiles": [2,3],
        "backTiles": [],
        "quests": [
          {
            "questTitle": "Quest1",
            "questContext": "This is Quest1",
            "questTargetDate": "2023-08-10",
            "questCompletedDate": "",
            "questCompleted": false
          }
        ]
      },
      {
        "tileId": 2,
        "tileTitle": "Tile2",
        "tileContext": "This is Tile2",
        "tileColor": "blue",
        "tileX": 150,
        "tileY": 80,
        "nextTiles": [3],
        "backTiles": [1],
        "quests": [
          {
            "questTitle": "Quest2",
            "questContext": "This is Quest2",
            "questTargetDate": "2023-08-20",
            "questCompletedDate": "",
            "questCompleted": false
          }
        ]
      },
      {
        "tileId": 3,
        "tileTitle": "Tile3",
        "tileContext": "This is Tile3",
        "tileColor": "green",
        "tileX": 260,
        "tileY": 120,
        "nextTiles": [],
        "backTiles": [1,2],
        "quests": [
          {
            "questTitle": "Quest3",
            "questContext": "This is Quest3",
            "questTargetDate": "2023-08-30",
            "questCompletedDate": "",
            "questCompleted": false
          }
        ]
      }
    ]
  };
  

let mapTiles = generateMap(mapData);

for (let i = 0; i < mapTiles.length; i++) {
  mapTiles[i].draw(tileContext);
  mapTiles[i].drawConnections(lineContext);
}

canvas.getContext('2d').drawImage(lineLayer, 0 , 0);
canvas.getContext('2d').drawImage(tileLayer, 0 , 0);

$(document).ready(function() {
  $('#mapCanvas').click(function(event) {
    event.preventDefault();
    $('#formModal').modal({
      escapeClose: false,
      clickClose: false,
      showClose: false
    });
  });
});