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




//アイコン色
const colorOptions = document.querySelectorAll('.color-option');
const userIcon = document.getElementById('userIcon');

colorOptions.forEach(option => {
  option.addEventListener('click', function() {
    const color = this.getAttribute('data-color');
    userIcon.style.backgroundColor = color;
  });
});



