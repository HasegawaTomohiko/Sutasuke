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



function saveIcon(icon) {

  var iconSrc = icon.src;

  var userProfile = document.getElementById('user-profile');
  userProfile.src = iconSrc;
}

function changeIcon() {
  var divSrc = document.getElementById('userIcon').src;

  var icon = document.querySelector('ul li img:checked');
  document.getElementById('userIcon').src = icon.src;
}


