
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const player = {
  x: 100,
  y: 0,
  width: 40,
  height: 70,
  velY: 0,
  jumping: false,
  attacking: false,
  kicking: false,
  jumpKicking: false,
  facing: 1,
  hp: 100
};

const gravity = 0.8;
const ground = () => canvas.height - 140;

player.y = ground();

let score = 0;

const keys = {
  left: false,
  right: false
};

const enemies = [];

for (let i = 0; i < 12; i++) {
  enemies.push({
    x: 500 + i * 240,
    y: ground(),
    alive: true
  });
}

function attack(range, points) {
  enemies.forEach(enemy => {
    if (!enemy.alive) return;

    const dx = Math.abs(enemy.x - player.x);
    const dy = Math.abs(enemy.y - player.y);

    if (dx < range && dy < 80) {
      enemy.alive = false;
      score += points;
    }
  });
}

function update() {

  if (keys.left) {
    player.x -= 5;
    player.facing = -1;
  }

  if (keys.right) {
    player.x += 5;
    player.facing = 1;
  }

  if (player.jumpKicking) {
    player.x += player.facing * 6;
  }

  player.velY += gravity;
  player.y += player.velY;

  if (player.y > ground()) {
    player.y = ground();
    player.velY = 0;
    player.jumping = false;
    player.jumpKicking = false;
  }

  enemies.forEach(enemy => {
    if (!enemy.alive) return;

    if (Math.abs(enemy.x - player.x) < 40) {
      player.hp -= 0.03;
    }
  });

  document.getElementById("hp").textContent =
    Math.max(0, Math.floor(player.hp));

  document.getElementById("score").textContent = score;
}

function drawBackground() {

  ctx.fillStyle = "#4CAF50";
  ctx.fillRect(0, ground()+50, canvas.width, 120);

  for (let i = 0; i < 20; i++) {
    const x = (i * 180) - (player.x * 0.4 % 180);

    ctx.fillStyle = "#777";
    ctx.fillRect(x, ground()-100, 60, 100);

    ctx.beginPath();
    ctx.arc(x+30, ground()-120, 55, 0, Math.PI * 2);
    ctx.fillStyle = "#2ecc71";
    ctx.fill();
  }
}

function drawPlayer() {

  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.scale(player.facing, 1);

  ctx.fillStyle = "#111";
  ctx.fillRect(-15, 0, 30, 45);

  ctx.beginPath();
  ctx.arc(0, -18, 16, 0, Math.PI * 2);
  ctx.fillStyle = "#f2c28b";
  ctx.fill();

  ctx.strokeStyle = "red";
  ctx.lineWidth = 6;

  if (player.attacking) {
    ctx.beginPath();
    ctx.moveTo(15, 10);
    ctx.lineTo(45, 0);
    ctx.stroke();
  }

  if (player.kicking) {
    ctx.beginPath();
    ctx.moveTo(0, 35);
    ctx.lineTo(50, 25);
    ctx.stroke();
  }

  if (player.jumpKicking) {
    ctx.strokeStyle = "gold";

    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(65, -10);
    ctx.stroke();
  }

  ctx.restore();
}

function drawEnemies() {

  enemies.forEach(enemy => {

    if (!enemy.alive) return;

    ctx.save();
    ctx.translate(enemy.x, enemy.y);

    ctx.fillStyle = "#7b1fa2";
    ctx.fillRect(-15, 0, 30, 45);

    ctx.beginPath();
    ctx.arc(0, -18, 15, 0, Math.PI * 2);
    ctx.fillStyle = "#f2c28b";
    ctx.fill();

    ctx.restore();
  });
}

function draw() {

  ctx.clearRect(0,0,canvas.width,canvas.height);

  drawBackground();
  drawEnemies();
  drawPlayer();

  if (player.hp <= 0) {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "48px Arial";
    ctx.fillText("Game Over", canvas.width/2 - 120, canvas.height/2);
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();

function holdButton(id, key) {

  const btn = document.getElementById(id);

  btn.addEventListener("touchstart", e => {
    e.preventDefault();
    keys[key] = true;
  });

  btn.addEventListener("touchend", e => {
    e.preventDefault();
    keys[key] = false;
  });

  btn.addEventListener("mousedown", () => {
    keys[key] = true;
  });

  btn.addEventListener("mouseup", () => {
    keys[key] = false;
  });
}

holdButton("left", "left");
holdButton("right", "right");

document.getElementById("jump").addEventListener("click", () => {

  if (!player.jumping) {
    player.velY = -16;
    player.jumping = true;
  }
});

document.getElementById("attack").addEventListener("click", () => {

  if (player.attacking) return;

  player.attacking = true;

  attack(70, 100);

  setTimeout(() => {
    player.attacking = false;
  }, 180);
});

document.getElementById("kick").addEventListener("click", () => {

  if (player.jumping) {

    player.jumpKicking = true;

    attack(110, 250);

    setTimeout(() => {
      player.jumpKicking = false;
    }, 350);

  } else {

    player.kicking = true;

    attack(90, 150);

    setTimeout(() => {
      player.kicking = false;
    }, 220);
  }
});
