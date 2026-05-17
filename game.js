
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const titleScreen = document.getElementById('titleScreen');
const hud = document.getElementById('hud');
const controls = document.getElementById('controls');

document.getElementById('startBtn').onclick = () => {
  titleScreen.style.display = 'none';
  canvas.style.display = 'block';
  hud.style.display = 'block';
  controls.style.display = 'block';
};

const player = {
  x: 200,
  y: 200,
  size: 32,
  speed: 4
};

let supplies = 0;
let faith = 0;

const villagers = [
  {x: 500, y: 300, helped:false},
  {x: 800, y: 500, helped:false}
];

const crops = [];
for(let i=0;i<8;i++){
  crops.push({
    x: 180 + i*50,
    y: 650,
    grown:false
  });
}

function updateHUD(){
  document.getElementById('supplies').innerText = supplies;
  document.getElementById('faith').innerText = faith;
}

function setMessage(msg){
  document.getElementById('message').innerText = msg;
}

function interact(){

  villagers.forEach(v=>{
    const d = Math.hypot(player.x-v.x, player.y-v.y);

    if(d < 70 && !v.helped){
      v.helped = true;
      supplies += 5;
      faith += 5;

      setMessage("You helped a villager and shared scripture.");
    }
  });

  crops.forEach(c=>{
    if(Math.abs(player.x-c.x)<40 &&
       Math.abs(player.y-c.y)<40){

      if(!c.grown){
        c.grown = true;
        supplies += 1;
        setMessage("You planted crops for the community.");
      } else {
        supplies += 2;
        setMessage("You harvested food for villagers.");
      }
    }
  });

  updateHUD();
}

const keys = {};

window.addEventListener('keydown', e=>{
  keys[e.key] = true;

  if(e.key === 'e'){
    interact();
  }
});

window.addEventListener('keyup', e=>{
  keys[e.key] = false;
});

function move(dx,dy){
  player.x += dx;
  player.y += dy;
}

document.getElementById('up').ontouchstart = ()=>move(0,-30);
document.getElementById('down').ontouchstart = ()=>move(0,30);
document.getElementById('left').ontouchstart = ()=>move(-30,0);
document.getElementById('right').ontouchstart = ()=>move(30,0);
document.getElementById('action').ontouchstart = ()=>interact();

function update(){
  if(keys['w']||keys['ArrowUp']) player.y -= player.speed;
  if(keys['s']||keys['ArrowDown']) player.y += player.speed;
  if(keys['a']||keys['ArrowLeft']) player.x -= player.speed;
  if(keys['d']||keys['ArrowRight']) player.x += player.speed;
}

function draw(){

  ctx.fillStyle = '#5ea35e';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // trees
  for(let i=0;i<20;i++){
    let tx = (i*140)%canvas.width;
    let ty = 80 + (i%5)*140;

    ctx.fillStyle = '#5b3a1e';
    ctx.fillRect(tx,ty,12,28);

    ctx.fillStyle = '#2c7a2c';
    ctx.beginPath();
    ctx.arc(tx+6,ty,26,0,Math.PI*2);
    ctx.fill();
  }

  // church
  ctx.fillStyle = '#d7c29d';
  ctx.fillRect(900,180,140,160);

  ctx.fillStyle = 'white';
  ctx.fillRect(960,190,20,60);
  ctx.fillRect(945,210,50,12);

  // crops
  crops.forEach(c=>{
    ctx.fillStyle = '#6b4423';
    ctx.fillRect(c.x,c.y,36,36);

    if(c.grown){
      ctx.fillStyle = 'gold';
      ctx.fillRect(c.x+10,c.y-12,14,16);
    }
  });

  // villagers
  villagers.forEach(v=>{
    ctx.fillStyle = v.helped ? '#66ccff' : '#ffcc66';
    ctx.fillRect(v.x,v.y,28,28);
  });

  // player
  ctx.fillStyle = 'white';
  ctx.fillRect(player.x,player.y,player.size,player.size);

  ctx.fillStyle = '#8b4513';
  ctx.fillRect(player.x+10,player.y-10,10,12);
}

function gameLoop(){
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

updateHUD();
gameLoop();
