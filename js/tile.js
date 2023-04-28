
let canvas = document.getElementById('mapCanvas');
let tileLayer = document.createElement('canvas');
let lineLayer = document.createElement('canvas');
let content = canvas.getContext('2d');

tileLayer.width = canvas.width;
tileLayer.height = canvas.height;
let tileContext = tileLayer.getContext('2d');

lineLayer.width = canvas.width;
lineLayer.height = canvas.height;
let lineContext = lineLayer.getContext('2d');

class Tile{
  constructor(id,x, y, color, shape){
    this.id = id;
    this.x = x;
    this.y = y;
    this.shape = shape; //shape -> circle,square,triangle
    this.color = color;
    this.nextTiles = [];
    this.backTiles = [];
  }

  draw() {
    tileContext.beginPath();
    tileContext.arc(this.x, this.y, 40, 0, Math.PI * 2);
    tileContext.fillStyle = this.color;
    tileContext.fill();
    tileContext.closePath();
  }

  connectTo(nextTile,tile){
    this.nextTiles.push(nextTile);
    tile.backTiles.push(this.id);
  }

  drawConnections(){
    for(let i = 0; i < this.nextTiles.length; i++){
      lineContext.save();
      lineContext.beginPath();
      lineContext.moveTo(this.x, this.y);
      lineContext.lineTo(this.nextTiles[i].x, this.nextTiles[i].y);
      lineContext.strokeStyle = 'black';
      lineContext.stroke();
      lineContext.closePath();
    }
  }
}