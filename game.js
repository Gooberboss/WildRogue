const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function resize(){
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
}
resize();
addEventListener('resize',resize);

const player={
x:200,
y:0,
vx:0,
vy:0,
w:55,
h:85,
dir:1,
hp:100,
jumping:false,
attack:'',
combo:0
};

const gravity=0.8;
const ground=()=>canvas.height-150;

player.y=ground();

let cameraX=0;
let score=0;

const enemies=[];

for(let i=0;i<18;i++){
enemies.push({
x:700+i*260,
y:ground(),
alive:true,
flash:0
});
}

function hitEnemies(range,points){
enemies.forEach(e=>{
if(!e.alive)return;

const dx=Math.abs(e.x-player.x);
const dy=Math.abs(e.y-player.y);

if(dx<range && dy<100){
e.flash=6;
e.alive=false;
score+=points;
}
});
}

function update(){

player.vy+=gravity;
player.y+=player.vy;

if(player.y>ground()){
player.y=ground();
player.vy=0;
player.jumping=false;
}

player.x+=player.vx;

cameraX+=(player.x-cameraX-220)*0.08;

enemies.forEach(e=>{
if(!e.alive)return;

if(Math.abs(e.x-player.x)<50){
player.hp-=0.03;
}
if(e.flash>0)e.flash--;
});

document.getElementById('hp').textContent=Math.floor(player.hp);
document.getElementById('score').textContent=score;
}

function drawBackground(){

const sky=ctx.createLinearGradient(0,0,0,canvas.height);
sky.addColorStop(0,"#7fc9ff");
sky.addColorStop(1,"#dff6ff");

ctx.fillStyle=sky;
ctx.fillRect(0,0,canvas.width,canvas.height);

for(let i=0;i<12;i++){

const x=(i*400)-(cameraX*0.3%400);

ctx.fillStyle="#7a8ea5";
ctx.fillRect(x,220,120,260);

ctx.fillStyle="#4caf50";
ctx.beginPath();
ctx.arc(x+60,190,95,0,Math.PI*2);
ctx.fill();
}

ctx.fillStyle="#4CAF50";
ctx.fillRect(0,ground()+55,canvas.width,120);
}

function drawPlayer(){

ctx.save();
ctx.translate(player.x-cameraX,player.y);
ctx.scale(player.dir,1);

ctx.shadowBlur=18;
ctx.shadowColor="rgba(0,0,0,0.35)";

ctx.fillStyle="#1b1b1b";
ctx.fillRect(-18,0,36,55);

ctx.fillStyle="#d22";
ctx.fillRect(-22,5,44,18);

ctx.beginPath();
ctx.arc(0,-22,20,0,Math.PI*2);
ctx.fillStyle="#f2c28b";
ctx.fill();

ctx.strokeStyle="#ffcc00";
ctx.lineWidth=8;

if(player.attack==="punch"){
ctx.beginPath();
ctx.moveTo(18,12);
ctx.lineTo(60,-4);
ctx.stroke();
}

if(player.attack==="kick"){
ctx.beginPath();
ctx.moveTo(5,40);
ctx.lineTo(65,22);
ctx.stroke();
}

if(player.attack==="jumpkick"){
ctx.beginPath();
ctx.moveTo(-5,15);
ctx.lineTo(75,-12);
ctx.stroke();
}

ctx.restore();
}

function drawEnemies(){

enemies.forEach(e=>{

if(!e.alive)return;

ctx.save();
ctx.translate(e.x-cameraX,e.y);

ctx.shadowBlur=12;

ctx.fillStyle=e.flash>0?"white":"#7b1fa2";
ctx.fillRect(-18,0,36,52);

ctx.beginPath();
ctx.arc(0,-20,18,0,Math.PI*2);
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
ctx.fillText("GAME OVER",canvas.width/2-170,canvas.height/2);
}
}

function loop(){
update();
draw();
requestAnimationFrame(loop);
}

loop();

// JOYSTICK
const stick=document.getElementById('joystickStick');
let dragging=false;

function moveStick(x,y){

const rect=document.getElementById('joystickBase').getBoundingClientRect();

const cx=rect.left+70;
const cy=rect.top+70;

let dx=x-cx;
let dy=y-cy;

const dist=Math.sqrt(dx*dx+dy*dy);
const max=40;

if(dist>max){
dx=dx/dist*max;
dy=dy/dist*max;
}

stick.style.transform=`translate(${dx}px,${dy}px)`;

player.vx=(dx/max)*7;

if(dx>5)player.dir=1;
if(dx<-5)player.dir=-1;
}

document.getElementById('joystickArea').addEventListener('touchstart',e=>{
dragging=true;
moveStick(e.touches[0].clientX,e.touches[0].clientY);
});

document.addEventListener('touchmove',e=>{
if(!dragging)return;
moveStick(e.touches[0].clientX,e.touches[0].clientY);
});

document.addEventListener('touchend',()=>{
dragging=false;
stick.style.transform='translate(0px,0px)';
player.vx=0;
});

function attack(type){

player.attack=type;

if(type==="punch")hitEnemies(80,100);
if(type==="kick")hitEnemies(110,180);
if(type==="jumpkick")hitEnemies(140,300);

if(type==="jumpkick"){
player.vx=player.dir*10;
}

setTimeout(()=>{
player.attack='';
},220);
}

document.getElementById('punch').onclick=()=>{
attack("punch");
};

document.getElementById('kick').onclick=()=>{

if(player.jumping){
attack("jumpkick");
}else{
attack("kick");
}
};

document.getElementById('jump').onclick=()=>{

if(!player.jumping){
player.vy=-17;
player.jumping=true;
}
};
