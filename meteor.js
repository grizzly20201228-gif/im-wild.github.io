// cinematic meteor rain - slow, full-screen, glowing trails, sparks
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.pointerEvents = "none";
canvas.style.zIndex = "0";
const ctx = canvas.getContext("2d");

let meteors = [];
let sparks = [];
const meteorCount = 100;
const trailLength = 25;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function random(min, max) {
  return Math.random() * (max - min) + min;
}

class Meteor {
  constructor() {
    this.reset();
  }

  reset() {
    if (Math.random() < 0.5) {
      this.x = random(0, canvas.width);
      this.y = random(-canvas.height * 0.5, 0);
    } else {
      this.x = canvas.width;
      this.y = random(0, canvas.height);
    }

    this.length = random(80, 150);
    this.speed = random(2, 5);
    this.opacity = random(0.4, 0.9);
    this.width = random(1, 3);

    const angle = (Math.PI * 3) / 4;
    this.vx = this.speed * Math.cos(angle);
    this.vy = this.speed * Math.sin(angle);

    this.trail = [];
    for (let i = 0; i < trailLength; i++) {
      this.trail.push({
        x: this.x,
        y: this.y,
        opacity: this.opacity * (i / trailLength),
      });
    }

    this.gradient = ctx.createLinearGradient(0, 0, 0, this.length);
    this.gradient.addColorStop(0, "rgba(255,255,255,1)");
    this.gradient.addColorStop(0.5, "rgba(56,189,248,0.6)");
    this.gradient.addColorStop(1, "rgba(14,165,233,0)");
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.trail.pop();
    this.trail.unshift({ x: this.x, y: this.y, opacity: this.opacity });
    if (Math.random() < 0.2)
      sparks.push(new Spark(this.x, this.y, this.vx * 0.15, this.vy * 0.15));
    if (this.x < -this.length || this.y > canvas.height + this.length)
      this.reset();
  }

  draw() {
    for (let i = 0; i < this.trail.length - 1; i++) {
      const p = this.trail[i];
      const next = this.trail[i + 1];
      ctx.strokeStyle = `rgba(56,189,248,${p.opacity})`;
      ctx.lineWidth = this.width;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(next.x, next.y);
      ctx.stroke();
    }
    ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.width * 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

class Spark {
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx + random(-0.3, 0.3);
    this.vy = vy + random(-0.3, 0.3);
    this.life = random(10, 15);
    this.opacity = 1;
    this.size = random(0.5, 1.2);
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    this.opacity = this.life / 15;
  }
  draw() {
    ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

for (let i = 0; i < meteorCount; i++) meteors.push(new Meteor());

function animate() {
  ctx.fillStyle = "rgba(15, 23, 42, 0.15)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  meteors.forEach((m) => {
    m.update();
    m.draw();
  });

  sparks.forEach((s, i) => {
    s.update();
    s.draw();
    if (s.life <= 0) sparks.splice(i, 1);
  });

  requestAnimationFrame(animate);
}

animate();
