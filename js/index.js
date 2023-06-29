
let canvas = document.getElementById('mapCanvas');
let tileLayer = document.createElement('canvas');
let lineLayer = document.createElement('canvas');

class Tile {
  constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.nextTiles = [];
      this.backTile = [];
  }

  draw() {
      tileLayer.getContext('2d').beginPath();
      tileLayer.getContext('2d').arc(this.x, this.y, 20, 0, Math.PI * 2);
      tileLayer.getContext('2d').fillStyle = this.color;
      tileLayer.getContext('2d').fill();
      tileLayer.getContext('2d').closePath();
  }

  connectTo(nextTile) {
      this.nextTiles.push(nextTile);
  }
  backconnectTo(backTile){
      this.backTile.push(backTile);
  }

  drawConnections() {
      for (let i = 0; i < this.nextTiles.length; i++) {
          lineLayer.getContext('2d').save();
          lineLayer.getContext('2d').beginPath();
          lineLayer.getContext('2d').moveTo(this.x, this.y);
          lineLayer.getContext('2d').lineTo(this.nextTiles[i].x, this.nextTiles[i].y);
          lineLayer.getContext('2d').strokeStyle = 'black';
          lineLayer.getContext('2d').stroke();
          lineLayer.getContext('2d').closePath();
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

tileLayer.width = canvas.width;
tileLayer.height = canvas.height;
//let tileContext = tileLayer.getContext('2d');

lineLayer.width = canvas.width;
lineLayer.height = canvas.height;
//let lineContext = lineLayer.getContext('2d');

//getMapDataでクリックした時のMapIDを元にMapDataを取得する
//追加予定 : backTilesを追加して後ろのTileを参照できるようにする
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

//マップ切り替え時に行う(if 新規作成click - );
let mapTiles = generateMap(mapData);

for (let i = 0; i < mapTiles.length; i++) {
  mapTiles[i].draw();
  mapTiles[i].drawConnections();
}

canvas.getContext('2d').drawImage(lineLayer, 0 , 0);
canvas.getContext('2d').drawImage(tileLayer, 0 , 0);


//キャンバスモーダルの設定
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

// 登録ボタンがクリックされた時の処理
$('#submitBtn').click(function(event) {
  event.preventDefault();

  // 入力値を取得
  let tileTitle = $('#tileTitle').val();
  let tileContext = $('#tileContext').val();
  let tileColor = $('#tileColor').val();

  // マップ上のクリック位置を取得
  let mouseX = 0;
  let mouseY = 0;
  if (event.pageX || event.pageY) {
    mouseX = event.pageX;
    mouseY = event.pageY;
  } else if (event.clientX || event.clientY) {
    mouseX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    mouseY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }

  // 新しいタイルを作成
  let newTile = new Tile(mouseX, mouseY, tileColor);
  newTile.title = tileTitle;
  newTile.context = tileContext;

  // mapData に新しいタイルを追加
  mapData.tiles.push(newTile);

  // 再描画
  redrawMap();
  
  // フォームを閉じる
  $('#formModal').modal('hide');
});


// 編集ボタンのコード
function toggleButtons() {
  var button1 = document.getElementById("tileMove");
  var button2 = document.getElementById("tileAdd");
  var button3 = document.getElementById("tileEdit");

  if (button1.style.display === "none") {
      button1.style.display = "inline-block";
      button2.style.display = "inline-block";
      button3.style.display = "inline-block";
  } else {
      button1.style.display = "none";
      button2.style.display = "none";
      button3.style.display = "none";
  }
}

//追加
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('mousemove', handleMouseMove);

let selectedTile = null;

function handleMouseDown(event) {
  const mouseX = event.offsetX;
  const mouseY = event.offsetY;

  for (let i = 0; i < mapTiles.length; i++) {
    const tile = mapTiles[i];
    if (
      mouseX >= tile.x - 40 &&
      mouseX <= tile.x + 40 &&
      mouseY >= tile.y - 40 &&
      mouseY <= tile.y + 40
    ) {
      tile.isMouseOver(mouseX, mouseY);
      selectedTile = tile;
      break;
    }
  }

  redrawMap();
}

function handleMouseUp(event) {
  if (selectedTile) {
    selectedTile.stopDragging();
    selectedTile = null;
    redrawMap();
  }
}

function handleMouseMove(event) {
  if (selectedTile) {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;
    selectedTile.drag(mouseX, mouseY);
    redrawMap();
  }
}

function redrawMap() {
  tileLayer.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  lineLayer.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < mapTiles.length; i++) {
    mapTiles[i].draw();
    mapTiles[i].drawConnections();
  }

  canvas.getContext('2d').drawImage(lineLayer, 0, 0);
  canvas.getContext('2d').drawImage(tileLayer, 0, 0);
}

redrawMap();
