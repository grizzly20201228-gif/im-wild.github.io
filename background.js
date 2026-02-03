// background.js - futuristic animated tech background
const canvasBG = document.createElement("canvas");
document.body.appendChild(canvasBG);
canvasBG.style.position = "fixed";
canvasBG.style.top = "0";
canvasBG.style.left = "0";
canvasBG.style.width = "100%";
canvasBG.style.height = "100%";
canvasBG.style.pointerEvents = "none";
canvasBG.style.zIndex = "-1";
const ctxBG = canvasBG.getContext("2d");

let particles = [];
const particleCount = 200; // subtle floating particles

function resizeBG() {
  canvasBG.width = window.innerWidth;
  canvasBG.height = window.innerHeight;
}
window.addEventListener("resize", resizeBG);
resizeBG();

function random(min, max) {
  return Math.random() * (max - min) + min;
}

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(0, canvasBG.width);
    this.y = random(0, canvasBG.height);
    this.size = random(1, 3);
    this.speedX = random(-0.2, 0.2);
    this.speedY = random(0.1, 0.4);
    this.opacity = random(0.1, 0.4);
    this.color = `rgba(0, 212, 255, ${this.opacity})`;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.y > canvasBG.height || this.x < 0 || this.x > canvasBG.width) {
      this.reset();
      this.y = 0;
    }
  }

  draw() {
    ctxBG.fillStyle = this.color;
    ctxBG.beginPath();
    ctxBG.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctxBG.fill();
  }
}

// create particles
for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

// animate background gradient and particles
let gradientShift = 0;
function animateBG() {
  // animated radial gradient for futuristic feel
  gradientShift += 0.002;
  const grad = ctxBG.createLinearGradient(
    0,
    0,
    canvasBG.width,
    canvasBG.height,
  );
  grad.addColorStop(0, `rgba(15, 23, 42, 1)`);
  grad.addColorStop(
    0.5,
    `rgba(10, 20, 50, ${0.6 + 0.2 * Math.sin(gradientShift)})`,
  );
  grad.addColorStop(1, `rgba(5, 10, 30, 1)`);
  ctxBG.fillStyle = grad;
  ctxBG.fillRect(0, 0, canvasBG.width, canvasBG.height);

  // draw particles
  particles.forEach((p) => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(animateBG);
}

animateBG();
