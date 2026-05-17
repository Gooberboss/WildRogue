
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const player = {
  x: 200,
  y: 200,
  size: 28,
  speed: 4
};

let supplies = 0;
let faith = 0;

const villagers = [
  {x: 500, y: 260, helped: false},
  {x: 700, y: 420, helped: false},
  {x: 350, y: 520, helped: false}
];

const crops = [];
for(let i=0;i<10;i++){
  crops.push({
    x: 150 + i * 45,
    y: 650,
    grown: false
  });
}

const trees = [];
for(let i=0;i<25;i++){
  trees.push({
    x: Math.random()*1800,
    y: Math.random()*1200
  });
}

const buildings = [
  {x: 900, y: 180, w:120, h:140, type:'church'},
  {x: 1200, y: 500, w:140, h:100, type:'school'}
];

let keys = {};

window.addEventListener('keydown', e=>{
  keys[e.key] = true;
  if(e.key === 'e') interact();
});

window.addEventListener('keyup', e=>{
  keys[e.key] = false;
});

function move(dx,dy){
  player.x += dx;
  player.y += dy;
}

document.getElementById('up').ontouchstart = ()=>move(0,-25);
document.getElementById('down').ontouchstart = ()=>move(0,25);
document.getElementById('left').ontouchstart = ()=>move(-25,0);
document.getElementById('right').ontouchstart = ()=>move(25,0);
document.getElementById('action').ontouchstart = ()=>interact();

function setMessage(t){
  document.getElementById('msg').innerText = t;
}

function updateHUD(){
  document.getElementById('coins').innerText = "Supplies: " + supplies;
  document.getElementById('faith').innerText = "Faith: " + faith;
}

function distance(a,b){
  return Math.hypot(a.x-b.x,a.y-b.y);
}

function interact(){

  villagers.forEach(v=>{
    if(distance(player,v)<70 && !v.helped){
      v.helped = true;
      supplies += 5;
      faith += 2;
      setMessage("You encouraged a villager with kindness and scripture.");
    }
  });

  crops.forEach(c=>{
    if(Math.abs(player.x-c.x)<40 &&
       Math.abs(player.y-c.y)<40){

      if(!c.grown){
        c.grown = true;
        supplies += 1;
        setMessage("You planted food for the community.");
      } else {
        supplies += 2;
        setMessage("You harvested crops for the village.");
      }
    }
  });

  buildings.forEach(b=>{
    if(player.x > b.x-80 &&
       player.x < b.x+b.w+80 &&
       player.y > b.y-80 &&
       player.y < b.y+b.h+80){

      if(b.type === 'church'){
        faith += 5;
        setMessage("The church brought hope to the village.");
      }

      if(b.type === 'school'){
        faith += 3;
        supplies += 2;
        setMessage("Children learned and grew in wisdom.");
      }
    }
  });

  updateHUD();
}

function update(){

  if(keys['w'] || keys['ArrowUp']) player.y -= player.speed;
  if(keys['s'] || keys['ArrowDown']) player.y += player.speed;
  if(keys['a'] || keys['ArrowLeft']) player.x -= player.speed;
  if(keys['d'] || keys['ArrowRight']) player.x += player.speed;
}

function drawGround(){
  ctx.fillStyle = '#5ea35e';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  for(let i=0;i<canvas.width;i+=64){
    for(let j=0;j<canvas.height;j+=64){
      ctx.strokeStyle = 'rgba(0,0,0,0.05)';
      ctx.strokeRect(i,j,64,64);
    }
  }
}

function drawTrees(){
  trees.forEach(t=>{
    ctx.fillStyle = '#5b3a1e';
    ctx.fillRect(t.x,t.y,12,25);

    ctx.fillStyle = '#2c7a2c';
    ctx.beginPath();
    ctx.arc(t.x+6,t.y,24,0,Math.PI*2);
    ctx.fill();
  });
}

function drawBuildings(){
  buildings.forEach(b=>{

    if(b.type==='church'){
      ctx.fillStyle='#d8c39a';
      ctx.fillRect(b.x,b.y,b.w,b.h);

      ctx.fillStyle='#fff';
      ctx.fillRect(b.x+50,b.y+10,20,50);
      ctx.fillRect(b.x+40,b.y+25,40,12);
    }

    if(b.type==='school'){
      ctx.fillStyle='#b06f3c';
      ctx.fillRect(b.x,b.y,b.w,b.h);

      ctx.fillStyle='#222';
      ctx.fillRect(b.x+50,b.y+40,40,60);
    }
  });
}

function drawVillagers(){
  villagers.forEach(v=>{
    ctx.fillStyle = v.helped ? '#66ccff' : '#ffcc66';
    ctx.fillRect(v.x,v.y,26,26);
  });
}

function drawFarm(){
  crops.forEach(c=>{
    ctx.fillStyle='#6b4423';
    ctx.fillRect(c.x,c.y,32,32);

    if(c.grown){
      ctx.fillStyle='#ffd94d';
      ctx.fillRect(c.x+10,c.y-10,12,14);
    }
  });
}

function drawPlayer(){
  ctx.fillStyle='white';
  ctx.fillRect(player.x,player.y,player.size,player.size);

  ctx.fillStyle='#8b4513';
  ctx.fillRect(player.x+10,player.y-10,8,12);

  ctx.fillStyle='#222';
  ctx.fillRect(player.x+6,player.y+7,4,4);
  ctx.fillRect(player.x+18,player.y+7,4,4);
}

function loop(){
  update();

  drawGround();
  drawTrees();
  drawBuildings();
  drawFarm();
  drawVillagers();
  drawPlayer();

  requestAnimationFrame(loop);
}

updateHUD();
loop();
