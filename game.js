const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const title = document.getElementById('title');
const hud = document.getElementById('hud');
const controls = document.getElementById('controls');
const inventory = document.getElementById('inventory');

function startGame(){
  title.style.display = 'none';
  hud.style.display = 'block';
  controls.style.display = 'block';
  inventory.style.display = 'block';
}

document.getElementById('playBtn').addEventListener('click', startGame);

const world = {
  width: 2200,
  height: 1800
};

const player = {
  x: 400,
  y: 400,
  size: 34
};

let supplies = 0;
let faith = 0;

const villagers = [
  {x:700,y:500,helped:false},
  {x:1200,y:900,helped:false},
  {x:1700,y:700,helped:false}
];

const crops = [];
for(let i=0;i<12;i++){
  crops.push({
    x:500+i*55,
    y:1400,
    grown:false
  });
}

const trees = [];
for(let i=0;i<45;i++){
  trees.push({
    x:Math.random()*world.width,
    y:Math.random()*world.height
  });
}

const houses = [
  {x:600,y:700},
  {x:950,y:780},
  {x:1300,y:650}
];

function updateHud(){
  document.getElementById('supplies').innerText = supplies;
  document.getElementById('faith').innerText = faith;
}

function message(t){
  document.getElementById('msg').innerText = t;
}

function interact(){

  villagers.forEach(v=>{
    const d = Math.hypot(player.x-v.x, player.y-v.y);

    if(d < 90 && !v.helped){
      v.helped = true;
      supplies += 5;
      faith += 5;
      message("You shared scripture and encouraged a villager.");
    }
  });

  crops.forEach(c=>{
    if(Math.abs(player.x-c.x)<50 &&
       Math.abs(player.y-c.y)<50){

      if(!c.grown){
        c.grown = true;
        supplies += 1;
        message("You planted crops.");
      } else {
        supplies += 2;
        message("You harvested crops.");
      }
    }
  });

  updateHud();
}

function move(dx,dy){
  player.x += dx;
  player.y += dy;

  player.x = Math.max(0, Math.min(world.width, player.x));
  player.y = Math.max(0, Math.min(world.height, player.y));
}

document.getElementById('up').ontouchstart = ()=>move(0,-40);
document.getElementById('down').ontouchstart = ()=>move(0,40);
document.getElementById('left').ontouchstart = ()=>move(-40,0);
document.getElementById('right').ontouchstart = ()=>move(40,0);
document.getElementById('action').ontouchstart = ()=>interact();

function draw(){

  const camX = player.x - canvas.width/2;
  const camY = player.y - canvas.height/2;

  ctx.fillStyle = '#6aac63';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.strokeStyle = 'rgba(0,0,0,0.05)';
  for(let x=0;x<world.width;x+=64){
    for(let y=0;y<world.height;y+=64){
      ctx.strokeRect(x-camX,y-camY,64,64);
    }
  }

  trees.forEach(t=>{
    ctx.fillStyle='#5b3a1e';
    ctx.fillRect(t.x-camX,t.y-camY,14,28);

    ctx.fillStyle='#2f7c2f';
    ctx.beginPath();
    ctx.arc(t.x+7-camX,t.y-camY,28,0,Math.PI*2);
    ctx.fill();
  });

  houses.forEach(h=>{
    ctx.fillStyle='#b06f3c';
    ctx.fillRect(h.x-camX,h.y-camY,120,100);

    ctx.fillStyle='#73411f';
    ctx.fillRect(h.x+45-camX,h.y+50-camY,30,50);
  });

  ctx.fillStyle='#d9c39a';
  ctx.fillRect(1700-camX,250-camY,180,220);

  ctx.fillStyle='white';
  ctx.fillRect(1780-camX,290-camY,20,70);
  ctx.fillRect(1760-camX,318-camY,60,14);

  crops.forEach(c=>{
    ctx.fillStyle='#70451f';
    ctx.fillRect(c.x-camX,c.y-camY,42,42);

    if(c.grown){
      ctx.fillStyle='gold';
      ctx.fillRect(c.x+14-camX,c.y-16-camY,14,20);
    }
  });

  villagers.forEach(v=>{
    ctx.fillStyle = v.helped ? '#66ccff' : '#ffcc66';
    ctx.fillRect(v.x-camX,v.y-camY,32,32);

    ctx.fillStyle='black';
    ctx.fillText('!',v.x+12-camX,v.y-8-camY);
  });

  ctx.fillStyle='white';
  ctx.fillRect(canvas.width/2, canvas.height/2, player.size, player.size);

  ctx.fillStyle='#8b4513';
  ctx.fillRect(canvas.width/2+10, canvas.height/2-10, 12, 12);
}

function loop(){
  draw();
  requestAnimationFrame(loop);
}

updateHud();
loop();
