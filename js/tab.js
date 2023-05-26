//iconをクリックしたらusernavの表示/非表示
let switchBtn = document.getElementById('userIcon');
let nav = document.getElementById('userNav');
let changeElement = (el)=> {
  if(el.style.display=='none'){
    el.style.display='block';
  }else{
    el.style.display='none';
  }
}

switchBtn.addEventListener('click', ()=> {
  changeElement(nav);
}, false);