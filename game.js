const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function resize(){
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
}
resize();
window.addEventListener('resize',resize);

const title=document.getElementById('title');
const hud=document.getElementById('hud');
const controls=document.getElementById('controls');
const inventory=document.getElementById('inventory');

document.getElementById('playBtn').onclick=startGame;

function startGame(){
title.style.display='none';
canvas.style.display='block';
hud.style.display='block';
controls.style.display='block';
inventory.style.display='block';
}

const world={
width:2400,
height:1800
};

const player={
x:400,
y:400,
size:34,
speed:7
};

let supplies=0;
let faith=0;

const villagers=[
{x:700,y:500,helped:false},
{x:1200,y:900,helped:false},
{x:1800,y:600,helped:false}
];

const farms=[];
for(let i=0;i<12;i++){
farms.push({
x:500+i*60,
y:1400,
grown:false
});
}

const houses=[
{x:600,y:700},
{x:900,y:800},
{x:1400,y:750}
];

const trees=[];
for(let i=0;i<50;i++){
trees.push({
x:Math.random()*world.width,
y:Math.random()*world.height
});
}

function msg(t){
document.getElementById('msg').innerText=t;
}

function updateHud(){
document.getElementById('supplies').innerText=supplies;
document.getElementById('faith').innerText=faith;
}

function interact(){

villagers.forEach(v=>{
const d=Math.hypot(player.x-v.x,player.y-v.y);

if(d<80 && !v.helped){
v.helped=true;
supplies+=5;
faith+=5;
msg("You encouraged a villager with scripture.");
}
});

farms.forEach(f=>{
if(Math.abs(player.x-f.x)<40 &&
Math.abs(player.y-f.y)<40){

if(!f.grown){
f.grown=true;
supplies+=1;
msg("You planted crops.");
}else{
supplies+=2;
msg("You harvested crops.");
}
}
});

updateHud();
}

function move(dx,dy){
player.x+=dx;
player.y+=dy;

player.x=Math.max(0,Math.min(world.width,player.x));
player.y=Math.max(0,Math.min(world.height,player.y));
}

document.getElementById('up').ontouchstart=()=>move(0,-35);
document.getElementById('down').ontouchstart=()=>move(0,35);
document.getElementById('left').ontouchstart=()=>move(-35,0);
document.getElementById('right').ontouchstart=()=>move(35,0);
document.getElementById('action').ontouchstart=()=>interact();

const keys={};

window.addEventListener('keydown',e=>{
keys[e.key]=true;
if(e.key==='e')interact();
});

window.addEventListener('keyup',e=>{
keys[e.key]=false;
});

function update(){

if(keys['w']||keys['ArrowUp'])move(0,-player.speed);
if(keys['s']||keys['ArrowDown'])move(0,player.speed);
if(keys['a']||keys['ArrowLeft'])move(-player.speed,0);
if(keys['d']||keys['ArrowRight'])move(player.speed,0);
}

function draw(){

const camX=player.x-canvas.width/2;
const camY=player.y-canvas.height/2;

ctx.fillStyle='#6aac63';
ctx.fillRect(0,0,canvas.width,canvas.height);

ctx.strokeStyle='rgba(0,0,0,0.05)';
for(let x=0;x<world.width;x+=64){
for(let y=0;y<world.height;y+=64){
ctx.strokeRect(x-camX,y-camY,64,64);
}
}

trees.forEach(t=>{
ctx.fillStyle='#5b3a1e';
ctx.fillRect(t.x-camX,t.y-camY,14,30);

ctx.fillStyle='#2f7c2f';
ctx.beginPath();
ctx.arc(t.x+7-camX,t.y-camY,30,0,Math.PI*2);
ctx.fill();
});

houses.forEach(h=>{
ctx.fillStyle='#b06f3c';
ctx.fillRect(h.x-camX,h.y-camY,120,100);

ctx.fillStyle='#73411f';
ctx.fillRect(h.x+40-camX,h.y+50-camY,30,50);
});

ctx.fillStyle='#d8c29d';
ctx.fillRect(1700-camX,300-camY,180,200);

ctx.fillStyle='white';
ctx.fillRect(1780-camX,330-camY,20,70);
ctx.fillRect(1760-camX,355-camY,60,14);

farms.forEach(f=>{
ctx.fillStyle='#70451f';
ctx.fillRect(f.x-camX,f.y-camY,42,42);

if(f.grown){
ctx.fillStyle='gold';
ctx.fillRect(f.x+14-camX,f.y-16-camY,14,20);
}
});

villagers.forEach(v=>{
ctx.fillStyle=v.helped?'#66ccff':'#ffcc66';
ctx.fillRect(v.x-camX,v.y-camY,32,32);

ctx.fillStyle='black';
ctx.fillText("!",v.x+10-camX,v.y-8-camY);
});

ctx.fillStyle='white';
ctx.fillRect(player.x-camX,player.y-camY,player.size,player.size);

ctx.fillStyle='#8b4513';
ctx.fillRect(player.x+10-camX,player.y-10-camY,12,12);

ctx.fillStyle='black';
ctx.fillRect(player.x+8-camX,player.y+8-camY,4,4);
ctx.fillRect(player.x+20-camX,player.y+8-camY,4,4);
}

function loop(){
update();
draw();
requestAnimationFrame(loop);
}

updateHud();
loop();
