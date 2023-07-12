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

// switchBtn をクリックした場合の処理
switchBtn.addEventListener('click', (event)=> {
  // イベントの伝播を停止し、タブを開閉する
  event.stopPropagation();
  changeElement(nav);
});

// ドキュメント全体に対してクリックイベントを追加
document.addEventListener('click', (event) => {
  // クリックされた要素が switchBtn または nav の子孫要素である場合は何もしない
  if (event.target === switchBtn || nav.contains(event.target)) {
    return;
  }

  // タブを閉じる
  nav.style.display = 'none';
});




//アイコンの要素クリックでやるほうがよくね関数呼び出し
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
