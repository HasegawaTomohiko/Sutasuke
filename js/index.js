let canvas = document.getElementById('mapCanvas');
let tileLayer = document.createElement('canvas');
let lineLayer = document.createElement('canvas');

tileLayer.width = canvas.width;
tileLayer.height = canvas.height;
lineLayer.width = canvas.width;
lineLayer.height = canvas.height;

canvas.getContext('2d').drawImage(lineLayer, 0 , 0);
canvas.getContext('2d').drawImage(tileLayer, 0 , 0);

var mapData;
var mapTiles;

//Cookieの値を取得してmapTitleViewに所有しているマップを取得する。
$(document).ready( () => {
  var userID = getCookie('userID');
  var mapData ;
  
  console.log('1');
  $.ajax({
    url: 'getMapTitle.php',
    type: 'GET',
    data: {userID : userID},
    dataType: 'json',
    success: (res) => {
      console.log('success!!!!');
      var mapDataView = $('#mapTitleView');

      
      $('#mapCanvas').click(function(event) {
        event.preventDefault();
        $('#formModal').modal({
          escapeClose: false,
          clickClose: false,
          showClose: false
        });
      });
  
      //mapTitleをクリックしたときの動作
      mapDataView.on('click','.mapTitle', () => {
        var mapID = $(event.target).attr('data-mapid');
        console.log('click' + mapID);
        $.ajax({
          url: 'getMapDetail.php',
          type: 'GET',
          data: {mapID: mapID},
          dataType: 'json',
          success : (resp) => {
            console.log(resp);
            mapData = resp;
            console.log(mapData);
            console.log(mapData.tiles.length);
            console.log(mapData.tiles);
            mapTiles = generateMap(mapData);
            redrawMap(mapTiles);
          },
          error : (xhr, status, err) => {
            console.log(err);
            console.log('cant Create json Data');
          }
        })
      });

      //mapTitleViewにすべてのmapTitleを表示する
      for (var i = 0; i < res.length; i++){
        console.log(res[i].mapTitle);
        var mapTitle = res[i].mapTitle;
        var mapID = res[i].mapID;
        var mapTitleHTML = '<div class="mapTitle" data-mapid="' + mapID + '">' + mapTitle + '</div>';
        mapDataView.append(mapTitleHTML);
      }

    },
    error: (xhr, status, err) => {
      console.log('none!!!!');
      var mapDataView = $('#mapTitleView');
      mapDataView.append('<div class="mapNone">マップが存在しません</div>')
    }
  });

  //Cookie取得
  function getCookie(name){
    var cookies = document.cookie.split(';');
    for(var i = 0;i < cookies.length;i++){
      var cookie = cookies[i].trim();
      if(cookie.startsWith(name + '=')){
        return cookie.substring(name.length + 1);
      }
    }
    return '';
  }

  //マップ作成プログラム
  function generateMap(mapData) {
    let mapTiles = [];
  
    // タイルの描画情報を生成する
    for (let i = 0; i < mapData.tiles.length; i++) {
      let tileData = mapData.tiles[i];
      let tile = {
        tileID: tileData.tileID,
        tileTitle: tileData.tileTitle,
        tileContext: tileData.tileContext,
        x: tileData.tileX,
        y: tileData.tileY,
        nextTiles: tileData.nextTiles || [],
        backTiles: tileData.backTiles || [],
        tileCompleted: tileData.tileCompleted,
        tileExecutable: tileData.tileExecutable,
        questID: tileData.questID || [],
      };
      mapTiles.push(tile);
    }
  
    // タイル同士の接続を行う
    for (let i = 0; i < mapData.tiles.length; i++) {
      let tileData = mapData.tiles[i];
      let tile = mapTiles[i];
      let nextTileIds = tileData.nextTiles;
      for (let j = 0; j < nextTileIds.length; j++) {
        let nextTileId = nextTileIds[j];
        let nextTile = mapTiles.find(tile => tile.tileID === nextTileId);
        if (nextTile) {
          tile.nextTiles.push(nextTile);
        }
      }
    }
  
    return mapTiles;
  }
  
  //再描画
  function redrawMap(mapTiles) {
    tileLayer.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    lineLayer.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  
    for (let i = 0; i < mapTiles.length; i++) {
      let tile = mapTiles[i];
      drawTile(tile);
      drawConnections(tile);
    }
  
    canvas.getContext('2d').drawImage(lineLayer, 0, 0);
    canvas.getContext('2d').drawImage(tileLayer, 0, 0);
  }
  
  //タイル描画
  function drawTile(tile) {
    tileLayer.getContext('2d').beginPath();
    tileLayer.getContext('2d').arc(tile.x, tile.y, 20, 0, Math.PI * 2);
    tileLayer.getContext('2d').fillStyle = 'blue'; // タイルの色はここで指定
    tileLayer.getContext('2d').fill();
    tileLayer.getContext('2d').closePath();
  }
  
  //ライン描画
  function drawConnections(tile) {
    for (let i = 0; i < tile.nextTiles.length; i++) {
      let nextTile = tile.nextTiles[i];
      lineLayer.getContext('2d').save();
      lineLayer.getContext('2d').beginPath();
      lineLayer.getContext('2d').moveTo(tile.x, tile.y);
      lineLayer.getContext('2d').lineTo(nextTile.x, nextTile.y);
      lineLayer.getContext('2d').strokeStyle = 'black';
      lineLayer.getContext('2d').stroke();
      lineLayer.getContext('2d').closePath();
    }
  }
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
});


/* function generateMap(mapData) {
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
} */

//let tileContext = tileLayer.getContext('2d');

//let lineContext = lineLayer.getContext('2d');

//getMapDataでクリックした時のMapIDを元にMapDataを取得する
//追加予定 : backTilesを追加して後ろのTileを参照できるようにする

//マップ切り替え時に行う(if 新規作成click - );
//let mapTiles = generateMap(mapData);

/* for (let i = 0; i < mapTiles.length; i++) {
  mapTiles[i].draw();
  mapTiles[i].drawConnections();
} */



// 編集ボタンのコード

