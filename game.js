const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const player = {
  x: 100,
  y: 100,
  size: 24,
  speed: 3
};

const npc = {
  x: 400,
  y: 250,
  size: 26,
  helped: false
};

const farm = [];
for (let i = 0; i < 6; i++) {
  farm.push({
    x: 150 + i * 40,
    y: 400,
    grown: false
  });
}

let keys = {};

window.addEventListener('keydown', e => {
  keys[e.key] = true;

  if (e.key === 'e') {
    interact();
  }
});

window.addEventListener('keyup', e => {
  keys[e.key] = false;
});

canvas.addEventListener('touchstart', e => {
  const touch = e.touches[0];
  const tx = touch.clientX;
  const ty = touch.clientY;

  if (tx < canvas.width / 2) player.x -= 20;
  else player.x += 20;

  if (ty < canvas.height / 2) player.y -= 20;
  else player.y += 20;

  interact();
});

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function interact() {
  if (distance(player, npc) < 50 && !npc.helped) {
    npc.helped = true;
    document.getElementById('message').innerText =
      "You encouraged a villager with scripture and kindness.";
  }

  farm.forEach(crop => {
    if (Math.abs(player.x - crop.x) < 30 &&
        Math.abs(player.y - crop.y) < 30) {

      crop.grown = true;
      document.getElementById('message').innerText =
        "You planted a crop to help feed the village.";
    }
  });
}

function update() {
  if (keys['ArrowUp'] || keys['w']) player.y -= player.speed;
  if (keys['ArrowDown'] || keys['s']) player.y += player.speed;
  if (keys['ArrowLeft'] || keys['a']) player.x -= player.speed;
  if (keys['ArrowRight'] || keys['d']) player.x += player.speed;
}

function drawGround() {
  ctx.fillStyle = '#5ea35e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < canvas.width; i += 64) {
    for (let j = 0; j < canvas.height; j += 64) {
      ctx.strokeStyle = 'rgba(0,0,0,0.05)';
      ctx.strokeRect(i, j, 64, 64);
    }
  }
}

function drawChurch() {
  ctx.fillStyle = '#c8b28a';
  ctx.fillRect(600, 120, 100, 120);

  ctx.fillStyle = '#8b5a2b';
  ctx.fillRect(640, 180, 20, 60);

  ctx.fillStyle = '#fff';
  ctx.fillRect(645, 130, 10, 40);
  ctx.fillRect(630, 145, 40, 10);
}

function drawFarm() {
  farm.forEach(crop => {
    ctx.fillStyle = '#6b4423';
    ctx.fillRect(crop.x, crop.y, 28, 28);

    if (crop.grown) {
      ctx.fillStyle = '#ffd94d';
      ctx.fillRect(crop.x + 8, crop.y - 10, 10, 12);
    }
  });
}

function drawNPC() {
  ctx.fillStyle = npc.helped ? '#66ccff' : '#ffcc66';
  ctx.fillRect(npc.x, npc.y, npc.size, npc.size);

  ctx.fillStyle = '#222';
  ctx.fillRect(npc.x + 6, npc.y + 6, 4, 4);
  ctx.fillRect(npc.x + 16, npc.y + 6, 4, 4);
}

function drawPlayer() {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(player.x, player.y, player.size, player.size);

  ctx.fillStyle = '#222';
  ctx.fillRect(player.x + 5, player.y + 5, 4, 4);
  ctx.fillRect(player.x + 15, player.y + 5, 4, 4);

  ctx.fillStyle = '#8b4513';
  ctx.fillRect(player.x + 9, player.y - 8, 6, 10);
}

function gameLoop() {
  update();

  drawGround();
  drawChurch();
  drawFarm();
  drawNPC();
  drawPlayer();

  requestAnimationFrame(gameLoop);
}

gameLoop();
