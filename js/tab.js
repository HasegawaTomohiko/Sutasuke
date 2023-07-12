//iconをクリックしたらusernavの表示/非表示  functionかけ
let switchBtn = document.getElementById('userIcon');
let nav = document.getElementById('userNav');
let changeElement = (el)=> {
  if(el.style.display=='none'){
    el.style.display='block';
  }else{
    el.style.display='none';
  }
}


switchBtn.addEventListener('click', (event)=> {

  event.stopPropagation();
  changeElement(nav);
});

// ドキュメント全体に対してクリックイベントを追加
document.addEventListener('click', (event) => {
  if (event.target === switchBtn || nav.contains(event.target)) {
    return;
  }

  // タブを閉じる
  nav.style.display = 'none';
});




//アイコンの要素クリックでやるほうがいいかも
//アイコン選択 選択したアイコンのsrcを変数に
function saveIcon(element) {
  var src = element.getAttribute("src");
  console.log(src); // 取得したsrcをコンソールに表示（必要に応じて他の処理を追加）

  // 他の処理を追加する場合はここに記述する
  
  var iconNow = document.getElementById("iconnow");
  iconNow.src = src;
}

//アイコン変更機能は完成したが
//これをユーザーごとに情報を保存するプログラムが必要
