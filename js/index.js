let canvas = $('#mapCanvas')[0];
let tileLayer = $('<canvas></canvas>')[0];
let lineLayer = $('<canvas></canvas>')[0];

class Tile {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.nextTiles = [];
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

  isMouseOver(mouseX, mouseY) {
    this.isDragging = true;
    this.dragStartX = mouseX;
    this.dragStartY = mouseY;
  }

  stopDragging() {
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
    let tile = new Tile(tileData.x, tileData.y, tileData.color);
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

lineLayer.width = canvas.width;
lineLayer.height = canvas.height;

let mapData = {
  tiles: [
    { x: 30, y: 30, color: 'red', nextTiles: [1, 5] },
    { x: 80, y: 30, color: 'green', nextTiles: [2, 3] },
    { x: 80, y: 80, color: 'blue', nextTiles: [4] },
    { x: 130, y: 30, color: 'yellow', nextTiles: [5] },
    { x: 130, y: 80, color: 'purple', nextTiles: [6] },
    { x: 130, y: 130, color: 'orange', nextTiles: [7] },
    { x: 180, y: 30, color: 'pink', nextTiles: [] },
    { x: 180, y: 80, color: 'cyan', nextTiles: [4, 5, 6] },
  ],
};

let mapTiles = generateMap(mapData);

for (let i = 0; i < mapTiles.length; i++) {
  mapTiles[i].draw();
  mapTiles[i].drawConnections();
}

canvas.getContext('2d').drawImage(lineLayer, 0, 0);
canvas.getContext('2d').drawImage(tileLayer, 0, 0);

function toggleButtons() {
  var button1 = $('#tileMove');
  var button2 = $('#tileAdd');
  var button3 = $('#tileEdit');

  if (button1.css('display') === 'none') {
    button1.css('display', 'inline-block');
    button2.css('display', 'inline-block');
    button3.css('display', 'inline-block');
  } else {
    button1.css('display', 'none');
    button2.css('display', 'none');
    button3.css('display', 'none');
  }
}

canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('mousemove', handleMouseMove);

let selectedTile = null;
let isTileMoving = false;

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
  if (selectedTile && isTileMoving) {
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

$('#tileMove').on('click', function () {
  isTileMoving = !isTileMoving; // タイル移動フラグを切り替える
});

$('#tileAdd').on('click', function () {
  isTileMoving = false; // タイル移動フラグを無効にする
  // 他のボタンを押した場合の処理を追加する
});

$('#tileEdit').on('click', function () {
  isTileMoving = false; // タイル移動フラグを無効にする
  // 他のボタンを押した場合の処理を追加する
});

redrawMap();
