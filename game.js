
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const gravity = 0.8;

const player = {
  x: 120,
  y: 300,
  w: 50,
  h: 80,
  vx: 0,
  vy: 0,
  speed: 5,
  jumping: false,
  punching: false,
  kicking: false,
  jumpKicking: false,
  facing: 1,
  health: 100
};

let score = 0;
let cameraX = 0;

const enemies = [];

for (let i = 0; i < 18; i++) {
  enemies.push({
    x: 700 + i * 260,
    y: 320,
    alive: true
  });
}

const keys = {
  left: false,
  right: false
};

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
addEventListener("resize", resize);

function attackEnemies(range, points) {
  enemies.forEach(enemy => {
    if (!enemy.alive) return;

    const dx = enemy.x - player.x;

    if (Math.abs(dx) < range &&
        Math.abs(enemy.y - player.y) < 90) {
      enemy.alive = false;
      score += points;
    }
  });
}

function update() {

  player.vx = 0;

  if (keys.left) {
    player.vx = -player.speed;
    player.facing = -1;
  }

  if (keys.right) {
    player.vx = player.speed;
    player.facing = 1;
  }

  if (player.jumpKicking) {
    player.vx += player.facing * 4;
  }

  player.x += player.vx;

  player.vy += gravity;
  player.y += player.vy;

  const ground = canvas.height - 140;

  if (player.y > ground) {
    player.y = ground;
    player.vy = 0;
    player.jumping = false;
    player.jumpKicking = false;
  }

  cameraX = player.x - 120;

  enemies.forEach(enemy => {
    if (!enemy.alive) return;

    const dx = enemy.x - player.x;

    if (Math.abs(dx) < 45 &&
        Math.abs(enemy.y - player.y) < 60) {
      player.health -= 0.08;
    }
  });

  document.getElementById("health").textContent =
    Math.max(0, Math.floor(player.health));

  document.getElementById("score").textContent = score;
}

function drawBackground() {

  ctx.fillStyle = "#4caf50";
  ctx.fillRect(0, canvas.height - 60, canvas.width, 60);

  for (let i = 0; i < 25; i++) {

    const x = (i * 380) - (cameraX * 0.45 % 380);

    ctx.fillStyle = "#7f8c8d";
    ctx.fillRect(x, canvas.height - 230, 90, 170);

    ctx.fillStyle = "#2ecc71";
    ctx.beginPath();
    ctx.arc(x + 45, canvas.height - 245, 80, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPlayer() {

  ctx.save();

  ctx.translate(player.x - cameraX, player.y);
  ctx.scale(player.facing, 1);

  ctx.fillStyle = "#111";
  ctx.fillRect(-15, 0, 30, 50);

  ctx.fillStyle = "#f2c28b";
  ctx.beginPath();
  ctx.arc(0, -20, 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#ff3333";
  ctx.lineWidth = 6;

  if (player.punching) {
    ctx.beginPath();
    ctx.moveTo(15, 15);
    ctx.lineTo(48, 0);
    ctx.stroke();
  }

  if (player.kicking) {
    ctx.beginPath();
    ctx.moveTo(5, 40);
    ctx.lineTo(55, 28);
    ctx.stroke();
  }

  if (player.jumpKicking) {
    ctx.strokeStyle = "#ffd700";

    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(65, -10);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-10, 5);
    ctx.lineTo(45, -15);
    ctx.stroke();
  }

  ctx.restore();
}

function drawEnemies() {

  enemies.forEach(enemy => {

    if (!enemy.alive) return;

    ctx.save();
    ctx.translate(enemy.x - cameraX, enemy.y);

    ctx.fillStyle = "#8e24aa";
    ctx.fillRect(-15, 0, 30, 45);

    ctx.fillStyle = "#f2c28b";
    ctx.beginPath();
    ctx.arc(0, -18, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  });
}

function draw() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();
  drawEnemies();
  drawPlayer();

  if (player.health <= 0) {

    ctx.fillStyle = "rgba(0,0,0,0.75)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "48px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 140, canvas.height / 2);
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();

function bindHold(id, key) {

  const btn = document.getElementById(id);

  btn.addEventListener("touchstart", e => {
    e.preventDefault();
    keys[key] = true;
  });

  btn.addEventListener("touchend", e => {
    e.preventDefault();
    keys[key] = false;
  });
}

bindHold("left", "left");
bindHold("right", "right");

document.getElementById("jump").addEventListener("touchstart", e => {

  e.preventDefault();

  if (!player.jumping) {
    player.vy = -16;
    player.jumping = true;
  }
});

document.getElementById("punch").addEventListener("touchstart", e => {

  e.preventDefault();

  if (player.punching || player.kicking || player.jumpKicking) return;

  player.punching = true;

  attackEnemies(60, 100);

  setTimeout(() => {
    player.punching = false;
  }, 180);
});

document.getElementById("kick").addEventListener("touchstart", e => {

  e.preventDefault();

  if (player.punching || player.kicking || player.jumpKicking) return;

  // Jump Kick
  if (player.jumping) {

    player.jumpKicking = true;

    attackEnemies(110, 250);

    setTimeout(() => {
      player.jumpKicking = false;
    }, 350);

  } else {

    player.kicking = true;

    attackEnemies(90, 150);

    setTimeout(() => {
      player.kicking = false;
    }, 240);
  }
});
