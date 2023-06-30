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
var selectedTile = null;
var selectedTileIndex = -1;
var moveTileIndex = -1;

var isTileMove = false;
var isTileAdd  = false;
var isLineEdit = false;

//IDランダム生成機
function generateRandomString(length){
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

//Cookieの値を取得してmapTitleViewに所有しているマップを取得する。
$(document).ready( () => {
  var userID = getCookie('userID');
  var mapData;
  $.ajax({
    url: 'getMapTitle.php',
    type: 'GET',
    data: {userID : userID},
    dataType: 'json',
    success: (res) => {
      console.log('success!!!!');
      var mapDataView = $('#mapTitleView');

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
            selectedTile = null;
            selectedTileIndex = -1;
            moveTileIndex = -1;
            mapData = resp;
            console.log(mapData.tiles.length);
            mapTiles = generateMap(mapData);
            console.log(mapTiles);
            redrawMap(mapTiles);
          },
          error : (xhr, status, err) => {
            console.log(err);
            console.log('cant Create json Data');
          }
        })
      });

      //mapTitleViewにすべてのmapTitleを表示する
      var mapTitleHTML = '';
      for (var i = 0; i < res.length; i++){
        console.log(res[i].mapTitle);
        var mapTitle = res[i].mapTitle;
        var mapID = res[i].mapID;
        mapTitleHTML += '<div class="mapTitle" data-mapid="' + mapID + '">' + mapTitle + '</div>';
      }
      mapDataView.html(mapTitleHTML);

    },
    error: (xhr, status, err) => {
      console.log('none!!!!');
      var mapDataView = $('#mapTitleView');
      mapDataView.append('<div class="mapNone">マップが存在しません</div>');
    }
  });

  //新規作成クリック
  $('#createMap').click( (event) => {
    event.preventDefault();
    $('#formModalMap').modal({
      escapeClose: true,
      clickClose: true,
      showClose: false,
    });
  });


  //マップ新規作成処理
  $('#mapAddButton').click ( (event) => {
    $('#formModalMap').modal('hide');
    event.preventDefault();
    var mapID = generateRandomString(15);
    var mapTitle = $('#mapTitle').val();
    $('#mapTitle').val('');
    console.log(mapTitle);
    $.ajax({
      url: 'createNewMap.php',
      type: 'POST',
      data: {
        mapID: mapID,
        userID: getCookie("userID"),
        mapTitle: mapTitle
      },
      dataType: 'json',
      success : (rep) => {
        console.log('add Mapdata!');
        $.ajax({
          url: 'getMapTitle.php',
          type: 'GET',
          data: {userID : userID},
          dataType: 'json',
          success: (res) => {
            console.log('success!!!!');
            var mapDataView = $('#mapTitleView');
      
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
                  selectedTile = null;
                  selectedTileIndex = -1;
                  moveTileIndex = -1;
                  mapData = resp;
                  console.log(mapData);
                  mapTiles = generateMap(mapData);
                  console.log(mapTiles);
                  redrawMap(mapTiles);
                },
                error : (xhr, status, err) => {
                  console.log(err);
                  console.log('cant Create json Data');
                }
              })
            });
      
            //mapTitleViewにすべてのmapTitleを表示する
            var mapTitleHTML = '';
            for (var i = 0; i < res.length; i++){
              console.log(res[i].mapTitle);
              var mapTitle = res[i].mapTitle;
              var mapID = res[i].mapID;
              mapTitleHTML += '<div class="mapTitle" data-mapid="' + mapID + '">' + mapTitle + '</div>';
            }
            mapDataView.html(mapTitleHTML);
      
          },
          error: (xhr, status, err) => {
            console.log('none!!!!');
            var mapDataView = $('#mapTitleView');
            mapDataView.append('<div class="mapNone">マップが存在しません</div>');
          }
        });
      },
      error : (xhr, status, err) => {
        console.log(err);
      }
    });
  });

  //mapナビクリック(バグ)
  $('#mapCanvas').click(function(event) {
    if(isTileAdd){
      event.preventDefault();
      $('#formModalTile').modal({
        escapeClose: true,
        clickClose: true,
        showClose: false,
      });
    }
  });

  $('tileAddButton').click( (event) => {

  });
  
  $('#createQuest').click( (event) => {
    event.preventDefault();
    $('#formModalQuest').modal({
      escapeClose: true,
      clickClose: true,
      showClose: false
    });
  });

  //編集ツールの表示/非表示
  $('#editTools').click( () => {
    toggleButtons();
  });
  $('#tileMove').click( () => {
    isTileAdd  = false;
    isLineEdit = false;
    isTileMove = true;
    console.log('isTileMove : ' + isTileMove);
  });
  $('#tileAdd').click( () => {
    isTileMove = false;
    isLineEdit = false;
    isTileAdd  = true;
    console.log('isTileAdd : ' + isTileAdd);
  });
  $('#tileEdit').click( () => {
    isTileMove = false;
    isTileAdd  = false;
    isLineEdit  = true;
    console.log('isLineAdd : ' + isLineEdit);
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
        tileX: tileData.tileX,
        tileY: tileData.tileY,
        nextTiles: tileData.nextTiles || [],
        backTiles: tileData.backTiles || [],
        tileCompleted: tileData.tileCompleted,
        tileExecutable: tileData.tileExecutable,
        quests: tileData.quests || [],
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
    tileLayer.getContext('2d').arc(tile.tileX, tile.tileY, 20, 0, Math.PI * 2);

    if(tile.tileCompleted === true){
      tileLayer.getContext('2d').fillStyle = 'blue';
    }else if(tile.tileExecutable === true || tile.backTiles.length === 0){
      tileLayer.getContext('2d').fillStyle = 'red';
    }else{
      tileLayer.getContext('2d').fillStyle = 'gray';
    }

    tileLayer.getContext('2d').fill();
    tileLayer.getContext('2d').closePath();
  }
  
  //ライン描画
  function drawConnections(tile) {
    for (let i = 0; i < tile.nextTiles.length; i++) {
      let nextTile = tile.nextTiles[i];
      lineLayer.getContext('2d').save();
      lineLayer.getContext('2d').beginPath();
      lineLayer.getContext('2d').moveTo(tile.tileX, tile.tileY);
      lineLayer.getContext('2d').lineTo(nextTile.tileX, nextTile.tileY);
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
        isTileAdd = false;
        isLineEdit = false;
        isTileMove = false;
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
        mouseX >= tile.tileX - 40 &&
        mouseX <= tile.tileX + 40 &&
        mouseY >= tile.tileY - 40 &&
        mouseY <= tile.tileY + 40
      ) {
        //バグ
        //tile.isMouseOver(mouseX, mouseY);
        selectedTile = true;
        selectedTileIndex = i;
        if(isTileMove){
          moveTileIndex = i;
        }
        $('#mapTileView').html('<div id="mapTitle">' + mapTiles[selectedTileIndex].tileTitle + '</div>');
        var questViewContent = '';
        for(let j = 0;j < mapTiles[selectedTileIndex].quests.length;j++){
          questViewContent += '<div id="' + mapTiles[selectedTileIndex].quests[j].questID + '" class="questViewContent">' + mapTiles[selectedTileIndex].quests[j].questTitle + '</div>';
        }
        $('#questView').html(questViewContent);
        break;
      }
    }

    //ここでタイルを取得出来る。
    redrawMap(mapTiles);
  }
  
  function handleMouseUp(event) {
    if (selectedTile && isTileMove) {
      //バグ
      //selectedTile.stopDragging();
      selectedTile = false;
      mapTiles[moveTileIndex].tileX = event.offsetX;
      mapTiles[moveTileIndex].tileY = event.offsetY;
      mapData.tiles[selectedTileIndex].tileX = event.offsetX;
      mapData.tiles[selectedTileIndex].tileY = event.offsetY;
      redrawMap(mapTiles);
      moveTileIndex= -1;

    }
  }
  
  function handleMouseMove(event) {
    if (selectedTile && isTileMove) {
      //バグ
      //selectedTile.drag(mouseX, mouseY);
      mapTiles[moveTileIndex].tileX = event.offsetX;
      mapTiles[moveTileIndex].tileY = event.offsetY;
      mapData.tiles[selectedTileIndex].tileX = event.offsetX;
      mapData.tiles[selectedTileIndex].tileY = event.offsetY;
      redrawMap(mapTiles);
    }
  }
});

// 登録ボタンがクリックされた時の処理
$('#submitBtn').click(function(event) {
  event.preventDefault();

  // 入力値を取得
  let tileTitle = $('#tileTitle').val();
  let tileContext = $('#tileContext').val();

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
  /* let newTile = new Tile(mouseX, mouseY, tileColor);
  newTile.title = tileTitle;
  newTile.context = tileContext; */

  // mapData に新しいタイルを追加
  mapData.tiles.push(newTile);

  // 再描画
  redrawMap();
  
  // フォームを閉じる
  $('#formModal').modal('hide');
});


// 編集ボタンのコード

