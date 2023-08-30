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
var clickX = -1;
var clickY = -1;

var selectTileID = null;
var startTileIndex = -1;
var endTileIndex = -1;
var startTileID = null;
var endTileID = null;

var isSelectedMap = false;
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
    type: 'POST',
    dataType: 'json',
    success: (res) => {
      console.log('success!!!!');
      var mapDataView = $('#mapTitleView');

      //mapTitleViewにすべてのmapTitleを表示する
      var mapTitleHTML = '';
      for (var i = 0; i < res.length; i++){
        console.log(res[i].mapTitle);
        var mapTitle = res[i].mapTitle;
        var mapID = res[i].mapID;
        mapTitleHTML += '<div class="map" data-mapid="' + mapID + '">' + 
        '<div class="mapTitle">' + mapTitle + '</div>' + 
        '<div class="mapDelete">' + 
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-square-fill" viewBox="0 0 16 16">' + 
        '<path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1z"/>' + 
        '</svg>' + 
        '</div>' + 
        '</div>';
      }
      mapDataView.html(mapTitleHTML);

    },
    error: (xhr, status, err) => {
      console.log('none!!!!');
      var mapDataView = $('#mapTitleView');
      mapDataView.append('<div class="mapNone">マップが存在しません</div>');
    }
  });

  
  //mapTitleをクリックしたときの動作
  $('#mapTitleView').on('click','.mapTitle', () => {
    var mapID = $(event.target).closest('.map').data('mapid');
    $('.mapDelete').hide();
    $(event.target).closest('.map').find('.mapDelete').show();
    console.log('click' + mapID);
    $.ajax({
      url: 'getMapDetail.php',
      type: 'POST',
      data: {mapID: mapID},
      dataType: 'json',
      success : (resp) => {
        selectedTile = null;
        selectedTileIndex = -1;
        isSelectedMap = true;
        moveTileIndex = -1;
        mapData = resp;
        console.log(mapData);
        //mapTiles = generateMap(mapData);
        //console.log(mapTiles);
        redrawMap(mapData);
      },
      error : (xhr, status, err) => {
        console.log(err);
        console.log(xhr);
        console.log(status);
        console.log('cant Create json Data');
      }
    })
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
    if(mapTitle != ""){
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
          $.ajax({
            url: 'getMapTitle.php',
            type: 'POST',
            data: {userID : userID},
            dataType: 'json',
            success: (res) => {
              var mapDataView = $('#mapTitleView');
        
              //mapTitleをクリックしたときの動作
              mapDataView.on('click','.mapTitle', () => {
                var mapID = $(event.target).attr('data-mapid');
                console.log('click' + mapID);
                $.ajax({
                  url: 'getMapDetail.php',
                  type: 'POST',
                  data: {mapID: mapID},
                  dataType: 'json',
                  success : (resp) => {
                    selectedTile = null;
                    selectedTileIndex = -1;
                    isSelectedMap = true;
                    moveTileIndex = -1;
                    mapData = resp;
                    console.log(mapData);
                    //mapTiles = generateMap(mapData);
                    //console.log(mapTiles);
                    redrawMap(mapData);
                  },
                  error : (xhr, status, err) => {
                    console.log(err);
                  }
                })
              });
        
              //mapTitleViewにすべてのmapTitleを表示する
              var mapTitleHTML = '';
              for (var i = 0; i < res.length; i++){
                console.log(res[i].mapTitle);
                var mapTitle = res[i].mapTitle;
                var mapID = res[i].mapID;
                mapTitleHTML += '<div class="map" data-mapid="' + mapID +  '">' 
                '<div class="mapTitle" data-mapid="' + mapID + '">' + mapTitle + '</div>' + 
                '<div class="mapDelete">' + 
                '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-square-fill" viewBox="0 0 16 16">' + 
                '<path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1z"/>' + 
                '</svg>' + 
                '</div>' + 
                '</div>';
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
    }
  });

  //mapナビクリック(バグ)
  $('#mapCanvas').on('click',(event) => {
    event.preventDefault();
    clickX = event.offsetX;
    clickY = event.offsetY;
    if(isTileAdd){
      $('#formModalTile').modal({
        escapeClose: true,
        clickClose: true,
        showClose: false,
      });
    }
  });

  $('#saveButton').click((event) => {
    event.preventDefault();
    $.ajax({
      url: 'saveMapData.php',
      type: 'POST',
      data:{
        mapData : mapData
      },
      dataType:'json',
      success: (res) => {
        redrawMap(mapData);
      },
      error: (xhr,status,err)=>{
        console.log(xhr);
        console.log(status);
        console.log(err);
      }
    });
  });

  $('#tileAddButton').on('click', (event) => {
    $('#formModalTile').modal('hide');
    event.preventDefault();
    var tileID = generateRandomString(15);
    var mapID = mapData.mapID;
    var tileTitle = $('#tileTitle').val();
    var tileContext = $('#tileContext').val();
    $('#tileTitle').val('');
    $('#tileContext').val('');
    $.ajax({
      url: 'createTile.php',
      type: 'POST',
      data: {
        tileID: tileID,
        mapID: mapID,
        tileTitle: tileTitle,
        tileContext: tileContext,
        tileX: clickX,
        tileY: clickY
      },
      dataType: 'json',
      success: (res) => {
        $.ajax({
          url: 'getMapDetail.php',
          type: 'POST',
          data: {mapID: mapID},
          dataType: 'json',
          success : (resp) => {
            selectedTile = null;
            selectedTileIndex = -1;
            isSelectedMap = true;
            moveTileIndex = -1;
            mapData = resp;
            console.log(mapData);
            redrawMap(mapData);
          },
          error : (xhr, status, err) => {
            console.log(err);
          }
        })
      },
      error: (xhr,status,err)=>{
        console.log(xhr);
        console.log(status);
        console.log(err);
      }
    });
  });
  
  $('#createQuest').click( (event) => {
    event.preventDefault();
    $('#formModalQuest').modal({
      escapeClose: true,
      clickClose: true,
      showClose: false
    });
  });

  $('#questAddButton').on('click', (event) => {
    $('#formModalQuest').modal('hide');
    event.preventDefault();
    console.log(mapData);
    var questID = generateRandomString(15);
    var tileID = mapData.tiles[selectedTileIndex].tileID;
    var questTitle = $('#questTitle').val();
    var questContext = $('#questContext').val();
    var questTargetDate = $('#questTargetDate').val();
    $('#questTitle').val('');
    $('#questContext').val('');
    $('#questTargetDate').val('');

    console.log(questTargetDate);

    $.ajax({
      url: 'createQuest.php',
      type: 'POST',
      data: {
        tileID: tileID,
        questID: questID,
        questTitle: questTitle,
        questContext: questContext,
        questTargetDate: questTargetDate
      },
      dataType: 'json',
      success: (res) => {
        $.ajax({
          url: 'getMapDetail.php',
          type: 'POST',
          data: {mapID: mapID},
          dataType: 'json',
          success : (resp) => {
            selectedTile = null;
            selectedTileIndex = -1;
            isSelectedMap = true;
            moveTileIndex = -1;
            mapData = resp;
            console.log(mapData);
            redrawMap(mapData);
          },
          error : (xhr, status, err) => {
            console.log(err);
          }
        })
        //ここにタイルの状態変化を作成する。////////////////////////////////////////////////////////////////////////////////
        console.log(mapData);
        $('#mapTileView').html('<div class="tile" id="' + mapData.tiles[selectedTileIndex].tileID +'"><div class="tileTitle" id="' + mapData.tiles[selectedTileIndex].tileID + '">' + mapData.tiles[selectedTileIndex].tileTitle + '</div>' + 
                                '<div class="tileDelete">' + 
                                '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-square-fill" viewBox="0 0 16 16">' + 
                                '<path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1z"/>' + 
                                '</svg>' + 
                                '</div>' + 
                                '</div>');
        $('#questView').empty();
        for (let j = 0; j < mapData.tiles[selectedTileIndex].quests.length; j++) {
          const quest = mapData.tiles[selectedTileIndex].quests[j];
          const questHtml =
            '<div id="' + quest.questID + '" class="questViewContent ' + (quest.questCompleted ? 'Comp' : 'unComp') + '">' +
            '<input type="checkbox" id="' + quest.questID + '" class="questCheckbox" ' + (quest.questCompleted ? 'checked' : '') + '>' +
            '<span class="questTitle">' + quest.questTitle + '</span>' +
            '<p class="questContext">' + quest.questContext + '</p>' +
            '<p class="questTargetDate">' + quest.questTargetDate + '</p>' +
            '</div>';
          $('#questView').append(questHtml);
        }

        //クエスト追加で強制的に状態変化
        mapData.tiles[selectedTileIndex].tileExecutable = true;
        mapData.tiles[selectedTileIndex].tileCompleted = false;
        updateTileStatus(selectedTileIndex);
        redrawMap(mapData);
      },
      error: (xhr,status,err)=>{
        console.log(xhr);
        console.log(status);
        console.log(err);
      }
    });

    //一度保存
    $.ajax({
      url: 'saveMapData.php',
      type: 'POST',
      data:{
        mapData : mapData
      },
      dataType:'json',
      success: (res) => {
        redrawMap(mapData);
      },
      error: (xhr,status,err)=>{
        console.log(xhr);
        console.log(status);
        console.log(err);
      }
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

  //クエストのチェックボックスの状態遷移
  $('#questView').on('change', '.questCheckbox', function() {
    const questID = $(this).attr('id');
    const questIndex = mapData.tiles[selectedTileIndex].quests.findIndex(quest => quest.questID === questID);
    mapData.tiles[selectedTileIndex].quests[questIndex].questCompleted = $(this).prop('checked');

    console.log(mapData.tiles[selectedTileIndex].quests[questIndex].questCompleted);

    $.ajax({
      url:'updateQuest.php',
      type:'POST',
      data: {
        questID:mapData.tiles[selectedTileIndex].quests[questIndex].questID,
        questTitle:mapData.tiles[selectedTileIndex].quests[questIndex].questTitle,
        questContext:mapData.tiles[selectedTileIndex].quests[questIndex].questContext,
        questCompleted:(mapData.tiles[selectedTileIndex].quests[questIndex].questCompleted ? 1 : 0),
        questTargetDate:mapData.tiles[selectedTileIndex].quests[questIndex].questTargetDate
      },
      dataType:'json',
      success: (res) => {
        console.log('updateQuest!!!!!!!!!!!!!');
        $.ajax({
          url: 'getMapDetail.php',
          type: 'POST',
          data: {mapID: mapData.mapID},
          dataType: 'json',
          success : (resp) => {
            mapData = resp;
            console.log(mapData);
            redrawMap(mapData);
          },
          error : (xhr, status, err) => {
            console.log(err);
          }
        });
        $('#questView').empty();
        for (let j = 0; j < mapData.tiles[selectedTileIndex].quests.length; j++) {
          const quest = mapData.tiles[selectedTileIndex].quests[j];
          const questHtml =
            '<div id="' + quest.questID + '" class="questViewContent ' + (quest.questCompleted ? 'Comp' : 'unComp') + '">' +
            '<input type="checkbox" id="' + quest.questID + '" class="questCheckbox" ' + (quest.questCompleted ? 'checked' : '') + '>' +
            '<span class="questTitle">' + quest.questTitle + '</span>' +
            '<p class="questContext">' + quest.questContext + '</p>' +
            '<p class="questTargetDate">' + quest.questTargetDate + '</p>' +
            '<div class="questDelete">' + 
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-square-fill" viewBox="0 0 16 16">' + 
            '<path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1z"/>' + 
            '</svg>' + 
            '</div>' + 
            '</div>';
          $('#questView').append(questHtml);
        }

        updateTileStatus(selectedTileIndex);

        console.log('update Quest!!!');
      },error : (xhr, status, err) => {
        console.log(err);
        console.log(xhr);
        console.log(status);
      }
    });
  });

  //map削除処理
  $('#mapTitleView').on('click','.mapDelete',() => {
    const mapID = $(event.target).closest('.map').data('mapid');
    console.log('map Delete!!! : ' + mapID);
    $.ajax({
      url:'deleteMap.php',
      type:'POST',
      data: {
        mapID : mapID
      },
      dataType: 'json',
      success: () => {
        mapData = null;
        $.ajax({
          url: 'getMapTitle.php',
          type: 'POST',
          dataType: 'json',
          success: (res) => {
            console.log('success!!!!');
            var mapDataView = $('#mapTitleView');
      
            //mapTitleViewにすべてのmapTitleを表示する
            var mapTitleHTML = '';
            for (var i = 0; i < res.length; i++){
              console.log(res[i].mapTitle);
              var mapTitle = res[i].mapTitle;
              var mapID = res[i].mapID;
              mapTitleHTML += '<div class="map" data-mapid="' + mapID + '">' + 
              '<div class="mapTitle">' + mapTitle + '</div>' + 
              '<div class="mapDelete">' + 
              '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-square-fill" viewBox="0 0 16 16">' + 
              '<path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1z"/>' + 
              '</svg>' + 
              '</div>' + 
              '</div>';
            }
            mapDataView.html(mapTitleHTML);
      
          },
          error: (xhr, status, err) => {
            console.log('none!!!!');
            var mapDataView = $('#mapTitleView');
            mapDataView.append('<div class="mapNone">マップが存在しません</div>');
          }
        });
      },error : (xhr, status, err) => {
        console.log(err);
        console.log(xhr);
        console.log(status);
      }
    });
  });

  //tileDelete処理
  $('#mapTileView').on('click','.tileDelete',() => {
    const tileID = mapData.tiles[selectedTileIndex].tileID;
    console.log('tile Delete!!! : ' + tileID);
    $.ajax({
      url:'deleteTile.php',
      type:'POST',
      data: {
        tileID : tileID
      },
      dataType: 'json',
      success: () => {
        $.ajax({
          url: 'getMapDetail.php',
          type: 'POST',
          data: {mapID: mapData.mapID},
          dataType: 'json',
          success : (resp) => {
            mapData = resp;
            console.log(mapData);
            redrawMap(mapData);
          },
          error : (xhr, status, err) => {
            console.log(err);
          }
        });
        $('#mapTileView').html('<div class="tile" id="' + mapData.tiles[selectedTileIndex].tileID +'"><div class="tileTitle" id="' + mapData.tiles[selectedTileIndex].tileID + '">' + mapData.tiles[selectedTileIndex].tileTitle + '</div>' + 
                                '<div class="tileDelete">' + 
                                '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-square-fill" viewBox="0 0 16 16">' + 
                                '<path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1z"/>' + 
                                '</svg>' + 
                                '</div>' + 
                                '</div>');
        $('#questView').empty();
        for (let j = 0; j < mapData.tiles[selectedTileIndex].quests.length; j++) {
          const quest = mapData.tiles[selectedTileIndex].quests[j];
          const questHtml =
            '<div id="' + quest.questID + '" class="questViewContent ' + (quest.questCompleted ? 'Comp' : 'unComp') + '">' +
            '<input type="checkbox" id="' + quest.questID + '" class="questCheckbox" ' + (quest.questCompleted ? 'checked' : '') + '>' +
            '<span class="questTitle">' + quest.questTitle + '</span>' +
            '<p class="questContext">' + quest.questContext + '</p>' +
            '<p class="questTargetDate">' + quest.questTargetDate + '</p>' +
            '<div class="questDelete">' + 
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-square-fill" viewBox="0 0 16 16">' + 
            '<path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1z"/>' + 
            '</svg>' + 
            '</div>' + 
            '</div>';
          $('#questView').append(questHtml);
        }

        updateTileStatus(selectedTileIndex);
      },error : (xhr, status, err) => {
        console.log(err);
        console.log(xhr);
        console.log(status);
      }
    });
  });

  //questDelete処理
  $('#questView').on('click','.questDelete',() => {
    const questID = $(event.target).closest('.questViewContent').attr('id');
    console.log('quest Delete!!! : ' + questID);
    $.ajax({
      url:'deleteQuest.php',
      type:'POST',
      data: {
        questID : questID
      },
      dataType: 'json',
      success: () => {
        $.ajax({
          url: 'getMapDetail.php',
          type: 'POST',
          data: {mapID: mapData.mapID},
          dataType: 'json',
          success : (resp) => {
            mapData = resp;
            console.log(mapData);
            redrawMap(mapData);
          },
          error : (xhr, status, err) => {
            console.log(err);
          }
        });
        $('#mapTileView').html('<div class="tile" id="' + mapData.tiles[selectedTileIndex].tileID +'"><div class="tileTitle" id="' + mapData.tiles[selectedTileIndex].tileID + '">' + mapData.tiles[selectedTileIndex].tileTitle + '</div>' + 
                                '<div class="tileDelete">' + 
                                '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-square-fill" viewBox="0 0 16 16">' + 
                                '<path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1z"/>' + 
                                '</svg>' + 
                                '</div>' + 
                                '</div>');
        $('#questView').empty();
        for (let j = 0; j < mapData.tiles[selectedTileIndex].quests.length; j++) {
          const quest = mapData.tiles[selectedTileIndex].quests[j];
          const questHtml =
            '<div id="' + quest.questID + '" class="questViewContent ' + (quest.questCompleted ? 'Comp' : 'unComp') + '">' +
            '<input type="checkbox" id="' + quest.questID + '" class="questCheckbox" ' + (quest.questCompleted ? 'checked' : '') + '>' +
            '<span class="questTitle">' + quest.questTitle + '</span>' +
            '<p class="questContext">' + quest.questContext + '</p>' +
            '<p class="questTargetDate">' + quest.questTargetDate + '</p>' +
            '<div class="questDelete">' + 
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-square-fill" viewBox="0 0 16 16">' + 
            '<path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1z"/>' + 
            '</svg>' + 
            '</div>' + 
            '</div>';
          $('#questView').append(questHtml);
        }

        updateTileStatus(selectedTileIndex);
      },error : (xhr, status, err) => {
        console.log(err);
        console.log(xhr);
        console.log(status);
      }
    });
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

  //再描画
  function redrawMap(mapData) {
    tileLayer.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    lineLayer.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  
    for (let i = 0; i < mapData.tiles.length; i++) {
      let tile = mapData.tiles[i];
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
    }else if(tile.tileExecutable === true){
      if(tile.quests.length != 0){
        tileLayer.getContext('2d').fillStyle = 'gray';
      }else{
        tileLayer.getContext('2d').fillStyle = 'red';
      }
    }else{
      tileLayer.getContext('2d').fillStyle = 'gray';
    }

    tileLayer.getContext('2d').fill();
    tileLayer.getContext('2d').closePath();
  }
  
  function drawConnections(tile) {
    for (let i = 0; i < tile.nextTiles.length; i++) {
      let nextTile = tile.nextTiles[i];
      let nextTileX;
      let nextTileY;
      for(let j = 0; j < mapData.tiles.length; j++) {
        if(mapData.tiles[j].tileID === nextTile){
          nextTileX = mapData.tiles[j].tileX;
          nextTileY = mapData.tiles[j].tileY;
          break;
        }
      }
      lineLayer.getContext('2d').save();
      lineLayer.getContext('2d').beginPath();
      lineLayer.getContext('2d').moveTo(tile.tileX, tile.tileY);
      lineLayer.getContext('2d').lineTo(nextTileX, nextTileY);
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


  canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('mouseup', handleMouseUp);
  canvas.addEventListener('mousemove', handleMouseMove);
  
  let selectedTile = null;
  
  function handleMouseDown(event) {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;
  
    if(mapData != null){
      
    for (let i = 0; i < mapData.tiles.length; i++) {
      const tile = mapData.tiles[i];
      if (
        mouseX >= tile.tileX - 40 &&
        mouseX <= tile.tileX + 40 &&
        mouseY >= tile.tileY - 40 &&
        mouseY <= tile.tileY + 40
      ) {
        selectedTile = true;
        selectedTileIndex = i;
        if(isTileMove){
          moveTileIndex = i;
        }
        if(isLineEdit){
          startTileIndex = i;
          startTileID = tile.tileID;
        }
        console.log( mapData.tiles[selectedTileIndex]);
        $('#mapTileView').html('<div class="tile" id="' + mapData.tiles[selectedTileIndex].tileID +'"><div class="tileTitle" id="' + mapData.tiles[selectedTileIndex].tileID + '">' + mapData.tiles[selectedTileIndex].tileTitle + '</div>' + 
                                '<div class="tileDelete">' + 
                                '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-square-fill" viewBox="0 0 16 16">' + 
                                '<path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1z"/>' + 
                                '</svg>' + 
                                '</div>' + 
                                '</div>');
        $('#questView').empty();
        let questComponent = '';
        for (let j = 0; j < mapData.tiles[selectedTileIndex].quests.length; j++) {
          const quest = mapData.tiles[selectedTileIndex].quests[j];
          const questHtml =
            '<div id="' + quest.questID + '" class="questViewContent '  + (quest.questCompleted ? 'Comp' : 'unComp') + ' ">' +
            '<input type="checkbox" id="' + quest.questID + '" class="questCheckbox" ' + (quest.questCompleted ? 'checked' : '') + '>' +
            '<span class="questTitle">' + quest.questTitle + '</span>' +
            '<p class="questContext">' + quest.questContext + '</p>' +
            '<p class="questTargetDate">' + quest.questTargetDate + '</p>' +
            '<div class="questDelete">' + 
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-square-fill" viewBox="0 0 16 16">' + 
            '<path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1z"/>' + 
            '</svg>' + 
            '</div>' + 
            '</div>';
          $('#questView').append(questHtml);
        }
        break;
      } else {
        selectedTile = false;
        selectedTileIndex = -1;
        $('#mapTileView').html('<div class="tile">タイルが選択されていません。</div>');
        $('#questView').empty();
      }
    }
    }
    redrawMap(mapData);
  }
  
  function handleMouseUp(event) {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;
    if (selectedTile && isTileMove) {
      mapData.tiles[selectedTileIndex].tileX = event.offsetX;
      mapData.tiles[selectedTileIndex].tileY = event.offsetY;
      
      redrawMap(mapData);
      moveTileIndex= -1;
      selectedTile = false;
      selectedTileIndex = -1;
    }else if(selectedTile && isLineEdit){
      for(let i = 0;i < mapData.tiles.length;i++){
        var tile = mapData.tiles[i];
        if(
          mouseX >= tile.tileX - 40 &&
          mouseX <= tile.tileX + 40 &&
          mouseY >= tile.tileY - 40 &&
          mouseY <= tile.tileY + 40
        ){
          endTileIndex = i;
          endTileID = mapData.tiles[i].tileID;
          selectedTile = false;
          //判定を後で入れる
          if (
            mapData.tiles[startTileIndex].nextTiles.includes(endTileID) &&
            mapData.tiles[endTileIndex].backTiles.includes(startTileID)
          ) {
            // 削除する場合
            mapData.tiles[startTileIndex].nextTiles = mapData.tiles[startTileIndex].nextTiles.filter(id => id !== endTileID);
            mapData.tiles[endTileIndex].backTiles = mapData.tiles[endTileIndex].backTiles.filter(id => id !== startTileID);
          } else {
            // 追加する場合
            mapData.tiles[startTileIndex].nextTiles.push(endTileID);
            mapData.tiles[endTileIndex].backTiles.push(startTileID);
          }
          break;
        }
        
        updateTileStatus(selectedTileIndex);
      }
      redrawMap(mapData);
      console.log(mapData);
      moveTileIndex= -1;
      selectedTile = false;
      selectedTileIndex = -1;
    }
  }
  
  function handleMouseMove(event) {
    if (selectedTile && isTileMove) {
      mapData.tiles[moveTileIndex].tileX = event.offsetX;
      mapData.tiles[moveTileIndex].tileY = event.offsetY;
      mapData.tiles[selectedTileIndex].tileX = event.offsetX;
      mapData.tiles[selectedTileIndex].tileY = event.offsetY;
      redrawMap(mapData);
    }else if(selectedTile && isLineEdit){
      redrawMap(mapData);
      lineLayer.getContext('2d').beginPath();
      lineLayer.getContext('2d').moveTo(mapData.tiles[startTileIndex].tileX, mapData.tiles[startTileIndex].tileY);
      lineLayer.getContext('2d').lineTo(event.offsetX,event.offsetY);
      lineLayer.getContext('2d').strokeStyle = 'black';
      lineLayer.getContext('2d').stroke();
      lineLayer.getContext('2d').closePath();
      canvas.getContext('2d').drawImage(lineLayer, 0, 0);
      canvas.getContext('2d').drawImage(tileLayer, 0, 0);
    }
  }

  function updateTileStatus(tileIndex) {

    console.log('update Status!');

    const allQuestsCompleted = mapData.tiles[tileIndex].quests.every(quest => quest.questCompleted);

    if(mapData.tiles[tileIndex].quests.length === 0){
      mapData.tiles[tileIndex].tileExecutable = false;
    }else if(mapData.tiles[tileIndex].backTiles.length === 0){
      mapData.tiles[tileIndex].tileExecutable = true;
    }

    if(allQuestsCompleted){
      mapData.tiles[tileIndex].tileCompleted = true;
      mapData.tiles[tileIndex].nextTiles.forEach(nextTileID => {
        const nextTileIndex = mapData.tiles.findIndex(t => t.tileID === nextTileID);

        const allBackTilesCompleted = mapData.tiles[nextTileIndex].backTiles.every(backTileID => {
          const backTile =mapData.tiles.find(t => t.tileID === backTileID);
          return backTile.tileCompleted;
        });

        mapData.tiles[nextTileIndex].tileExecutable = allBackTilesCompleted;
      });
    }else{
      mapData.tiles[tileIndex].tileCompleted = false;
    }
  }

  function updateTileCompleted(tileIndex){
    const allQuestsCompleted = mapData.tiles[tileIndex].quests.every(quest => quest.questCompleted);

    if(allQuestsCompleted){
      mapData.tiles[tileIndex].tileCompleted = true;
    }else{
      mapData.tiles[tileIndex].tileCompleted = false;
    }
  }
});


/* 
タイル判断ポイント

・tileAdd
・questAdd
・questUpdate
・LineAdd
・questDelete


*/