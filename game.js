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

document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('startBtn').addEventListener('touchstart', startGame);

function startGame(e){
  e.preventDefault();

  titleScreen.style.display = 'none';
  canvas.style.display = 'block';
  hud.style.display = 'block';
  controls.style.display = 'block';
}

const player = {
  x: 250,
  y: 250,
  size: 34
};

let supplies = 0;
let faith = 0;

const villagers = [
  {x: 550, y: 300, helped:false},
  {x: 820, y: 520, helped:false},
  {x: 1200, y: 320, helped:false}
];

const crops = [];
for(let i=0;i<10;i++){
  crops.push({
    x: 240 + i*60,
    y: 700,
    grown:false
  });
}

function updateHud(){
  document.getElementById('supplies').innerText = supplies;
  document.getElementById('faith').innerText = faith;
}

function setMessage(msg){
  document.getElementById('message').innerText = msg;
}

function interact(){

  villagers.forEach(v=>{
    const d = Math.hypot(player.x-v.x, player.y-v.y);

    if(d < 80 && !v.helped){
      v.helped = true;
      supplies += 5;
      faith += 5;
      setMessage("You helped a villager with kindness and scripture.");
    }
  });

  crops.forEach(c=>{
    if(Math.abs(player.x-c.x)<40 &&
       Math.abs(player.y-c.y)<40){

      if(!c.grown){
        c.grown = true;
        supplies += 1;
        setMessage("You planted crops for the village.");
      } else {
        supplies += 2;
        setMessage("You harvested food for the community.");
      }
    }
  });

  updateHud();
}

function move(dx,dy){
  player.x += dx;
  player.y += dy;
}

document.getElementById('up').ontouchstart = ()=>move(0,-30);
document.getElementById('down').ontouchstart = ()=>move(0,30);
document.getElementById('left').ontouchstart = ()=>move(-30,0);
document.getElementById('right').ontouchstart = ()=>move(30,0);
document.getElementById('action').ontouchstart = ()=>interact();

function draw(){

  ctx.fillStyle = '#5ea35e';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // grid
  ctx.strokeStyle = 'rgba(0,0,0,0.06)';
  for(let x=0;x<canvas.width;x+=64){
    for(let y=0;y<canvas.height;y+=64){
      ctx.strokeRect(x,y,64,64);
    }
  }

  // church
  ctx.fillStyle = '#d9c39a';
  ctx.fillRect(1000,160,150,170);

  ctx.fillStyle = '#fff';
  ctx.fillRect(1060,180,20,60);
  ctx.fillRect(1045,200,50,12);

  // trees
  for(let i=0;i<18;i++){
    const tx = (i*160)%canvas.width;
    const ty = 100 + (i%4)*180;

    ctx.fillStyle = '#5b3a1e';
    ctx.fillRect(tx,ty,14,28);

    ctx.fillStyle = '#2f7c2f';
    ctx.beginPath();
    ctx.arc(tx+7,ty,28,0,Math.PI*2);
    ctx.fill();
  }

  // crops
  crops.forEach(c=>{
    ctx.fillStyle = '#70451f';
    ctx.fillRect(c.x,c.y,40,40);

    if(c.grown){
      ctx.fillStyle = 'gold';
      ctx.fillRect(c.x+12,c.y-14,16,18);
    }
  });

  // villagers
  villagers.forEach(v=>{
    ctx.fillStyle = v.helped ? '#66ccff' : '#ffcc66';
    ctx.fillRect(v.x,v.y,30,30);
  });

  // player
  ctx.fillStyle = '#fff';
  ctx.fillRect(player.x,player.y,player.size,player.size);

  ctx.fillStyle = '#8b4513';
  ctx.fillRect(player.x+10,player.y-10,12,12);
}

function loop(){
  draw();
  requestAnimationFrame(loop);
}

updateHud();
loop();
