
const canvas=document.getElementById('game');
const ctx=canvas.getContext('2d');

function resize(){
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
}
resize();
window.addEventListener('resize',resize);

const player={
x:120,
y:0,
vx:0,
vy:0,
w:40,
h:70,
dir:1,
jumping:false,
attack:'',
hp:100
};

const gravity=0.8;

function ground(){
return canvas.height-150;
}

player.y=ground();

let score=0;
let cameraX=0;

const enemies=[];

for(let i=0;i<15;i++){
enemies.push({
x:600+i*250,
y:ground(),
alive:true
});
}

const keys={
left:false,
right:false
};

function attack(range,points){

enemies.forEach(enemy=>{

if(!enemy.alive)return;

const dx=Math.abs(enemy.x-player.x);
const dy=Math.abs(enemy.y-player.y);

if(dx<range && dy<80){
enemy.alive=false;
score+=points;
}

});

}

function update(){

player.vx=0;

if(keys.left){
player.vx=-6;
player.dir=-1;
}

if(keys.right){
player.vx=6;
player.dir=1;
}

if(player.attack==="jumpkick"){
player.vx+=player.dir*5;
}

player.x+=player.vx;

player.vy+=gravity;
player.y+=player.vy;

if(player.y>ground()){
player.y=ground();
player.vy=0;
player.jumping=false;
}

cameraX=player.x-120;

enemies.forEach(enemy=>{

if(!enemy.alive)return;

if(Math.abs(enemy.x-player.x)<45){
player.hp-=0.03;
}

});

document.getElementById('hp').textContent=Math.floor(player.hp);
document.getElementById('score').textContent=score;

}

function drawBackground(){

const sky=ctx.createLinearGradient(0,0,0,canvas.height);
sky.addColorStop(0,"#6ec6ff");
sky.addColorStop(1,"#dff6ff");

ctx.fillStyle=sky;
ctx.fillRect(0,0,canvas.width,canvas.height);

for(let i=0;i<20;i++){

const x=(i*320)-(cameraX*0.3%320);

ctx.fillStyle="#777";
ctx.fillRect(x,ground()-120,80,120);

ctx.beginPath();
ctx.arc(x+40,ground()-140,70,0,Math.PI*2);
ctx.fillStyle="#66cc77";
ctx.fill();

}

ctx.fillStyle="#4CAF50";
ctx.fillRect(0,ground()+50,canvas.width,120);

}

function drawPlayer(){

ctx.save();

ctx.translate(player.x-cameraX,player.y);
ctx.scale(player.dir,1);

ctx.fillStyle="#111";
ctx.fillRect(-16,0,32,50);

ctx.fillStyle="#cc2222";
ctx.fillRect(-20,5,40,18);

ctx.beginPath();
ctx.arc(0,-20,18,0,Math.PI*2);
ctx.fillStyle="#f2c28b";
ctx.fill();

ctx.strokeStyle="#ffcc00";
ctx.lineWidth=7;

if(player.attack==="punch"){

ctx.beginPath();
ctx.moveTo(15,10);
ctx.lineTo(55,0);
ctx.stroke();

}

if(player.attack==="kick"){

ctx.beginPath();
ctx.moveTo(0,38);
ctx.lineTo(60,20);
ctx.stroke();

}

if(player.attack==="jumpkick"){

ctx.beginPath();
ctx.moveTo(-5,15);
ctx.lineTo(75,-10);
ctx.stroke();

}

ctx.restore();

}

function drawEnemies(){

enemies.forEach(enemy=>{

if(!enemy.alive)return;

ctx.save();

ctx.translate(enemy.x-cameraX,enemy.y);

ctx.fillStyle="#7b1fa2";
ctx.fillRect(-16,0,32,48);

ctx.beginPath();
ctx.arc(0,-18,17,0,Math.PI*2);
ctx.fillStyle="#f2c28b";
ctx.fill();

ctx.restore();

});

}

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

drawBackground();
drawEnemies();
drawPlayer();

if(player.hp<=0){

ctx.fillStyle="rgba(0,0,0,0.7)";
ctx.fillRect(0,0,canvas.width,canvas.height);

ctx.fillStyle="white";
ctx.font="50px Arial";
ctx.fillText("GAME OVER",canvas.width/2-150,canvas.height/2);

}

}

function loop(){

update();
draw();

requestAnimationFrame(loop);

}

loop();

function bindButton(id,key){

const btn=document.getElementById(id);

btn.addEventListener('touchstart',e=>{
e.preventDefault();
keys[key]=true;
});

btn.addEventListener('touchend',e=>{
e.preventDefault();
keys[key]=false;
});

}

bindButton('left','left');
bindButton('right','right');

document.getElementById('jump').addEventListener('touchstart',e=>{

e.preventDefault();

if(!player.jumping){
player.vy=-16;
player.jumping=true;
}

});

function doAttack(type){

player.attack=type;

if(type==="punch")attack(70,100);
if(type==="kick")attack(100,160);
if(type==="jumpkick")attack(130,250);

setTimeout(()=>{
player.attack='';
},220);

}

document.getElementById('punch').addEventListener('touchstart',e=>{

e.preventDefault();
doAttack('punch');

});

document.getElementById('kick').addEventListener('touchstart',e=>{

e.preventDefault();

if(player.jumping){
doAttack('jumpkick');
}else{
doAttack('kick');
}

});
