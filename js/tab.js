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
  // Get the src of the icon.
  var iconSrc = icon.src;

  // Set the src of the user's profile.
  var userProfile = document.getElementById('user-profile');
  userProfile.src = iconSrc;
}

function changeIcon() {
  // Get the src of the div element.
  var divSrc = document.getElementById('userIcon').src;

  // Set the src of the icon.
  var icon = document.querySelector('ul li img:checked');
  document.getElementById('userIcon').src = icon.src;
}


