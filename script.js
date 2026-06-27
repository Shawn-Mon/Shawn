/* ─────────────────────────────────────────────
   SHAWN PORTFOLIO — script.js
   Neural net canvas · Custom cursor · Role switcher
   Scroll animations · Magnetic buttons · Stats counter
   Spotlight · Ripple · Text scramble · Parallax
───────────────────────────────────────────── */

// ─── SPOTLIGHT CURSOR ──────────────────────
const spotlight = document.createElement('div');
spotlight.className = 'cursor-spotlight';
document.body.appendChild(spotlight);

window.addEventListener('mousemove', e => {
  spotlight.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
}, { passive: true });

// ─── CLICK RIPPLE ──────────────────────────
document.addEventListener('click', e => {
  const ripple = document.createElement('div');
  ripple.className = 'ripple';
  const size = Math.max(window.innerWidth, window.innerHeight) * 0.4;
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (e.clientX - size / 2) + 'px';
  ripple.style.top = (e.clientY - size / 2) + 'px';
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 700);
  // Cursor ring click flash
  document.body.classList.add('clicking');
  setTimeout(() => document.body.classList.remove('clicking'), 200);
});

// ─── SCROLL PROGRESS ───────────────────────
const scrollBar = document.getElementById('scrollBar');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
  scrollBar.style.width = pct + '%';
}, { passive: true });

// ─── NAV SCROLL + ACTIVE ───────────────────
const nav = document.getElementById('nav');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nl');

function updateNav() {
  nav.classList.toggle('scrolled', window.scrollY > 60);
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 160) current = sec.id;
  });
  navLinks.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + current);
  });
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// ─── SMOOTH SCROLL ─────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ─── CUSTOM CURSOR ─────────────────────────
const ring = document.getElementById('cursorRing');
const dot  = document.getElementById('cursorDot');
let mx = -200, my = -200;
let rx = -200, ry = -200;

window.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.transform = `translate(${mx - 2.5}px, ${my - 2.5}px)`;
}, { passive: true });

function animRing() {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
  requestAnimationFrame(animRing);
}
animRing();

document.querySelectorAll('a, button, .tp, .wcard').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

// ─── TEXT SCRAMBLE ON WORK CARD TITLES ─────
const chars = '!<>-_\\/[]{}—=+*^?#$%&@';
document.querySelectorAll('.wcard-title').forEach(title => {
  const orig = title.textContent;
  title.addEventListener('mouseenter', () => {
    let count = 0;
    const interval = setInterval(() => {
      let scrambled = '';
      for (let i = 0; i < orig.length; i++) {
        scrambled += orig[i] === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)];
      }
      title.textContent = scrambled;
      count++;
      if (count > 6) {
        clearInterval(interval);
        title.textContent = orig;
      }
    }, 50);
  });
});

// ─── HERO + CONTACT BG TEXT PARALLAX ───────
const heroBgText = document.querySelector('.hero-bg-text');
const contactBgText = document.querySelector('.contact-bg-text');
const parallaxEls = [heroBgText, contactBgText].filter(Boolean);

window.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 15;
  if (heroBgText) {
    heroBgText.style.transform = `translate(calc(-50% + ${x}px), calc(-55% + ${y}px))`;
  }
  if (contactBgText) {
    contactBgText.style.transform = `translate(calc(${x}px), calc(${y}px))`;
  }
}, { passive: true });

// ─── NEURAL NET CANVAS ─────────────────────
const canvas = document.getElementById('neural');
const ctx    = canvas.getContext('2d');
let W, H;
let particles = [];
let mouse = { x: null, y: null };

const PARTICLE_COUNT = 90;
const MAX_DIST = 130;
const COLORS = ['124,58,237', '232,121,249', '34,211,238', '163,230,53'];

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

let attractMode = false;
setInterval(() => { 
  attractMode = !attractMode; 
  const statusText = document.querySelector('.status-text');
  if (statusText) statusText.textContent = attractMode ? 'Attracting' : 'Available';
}, 4000);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r  = Math.random() * 1.8 + 0.5;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.alpha = Math.random() * 0.5 + 0.2;
    this.baseAlpha = this.alpha;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    // Mouse interaction — alternates between repel and attract
    if (mouse.x !== null) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 120) {
        const force = (120 - d) / 120;
        if (attractMode) {
          this.vx -= (dx / d) * force * 0.3;
          this.vy -= (dy / d) * force * 0.3;
          this.alpha = Math.min(1, this.baseAlpha + force * 0.5);
        } else {
          this.vx += (dx / d) * force * 0.8;
          this.vy += (dy / d) * force * 0.8;
          this.alpha = Math.max(0.1, this.baseAlpha - force * 0.3);
        }
      } else {
        this.alpha += (this.baseAlpha - this.alpha) * 0.05;
      }
    }
    // Dampen
    this.vx *= 0.99;
    this.vy *= 0.99;
    // Wrap
    if (this.x < 0) this.x = W;
    if (this.x > W) this.x = 0;
    if (this.y < 0) this.y = H;
    if (this.y > H) this.y = 0;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
}
initParticles();

window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
}, { passive: true });

function drawNeural() {
  ctx.clearRect(0, 0, W, H);

  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < MAX_DIST) {
        const opacity = (1 - d / MAX_DIST) * 0.18;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        // Color blend
        const ci = particles[i].color;
        ctx.strokeStyle = `rgba(${ci},${opacity})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
    particles[i].update();
    particles[i].draw();
  }

  // Draw mouse halo
  if (mouse.x !== null) {
    const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 120);
    grad.addColorStop(0, 'rgba(124,58,237,0.06)');
    grad.addColorStop(1, 'rgba(124,58,237,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  requestAnimationFrame(drawNeural);
}
drawNeural();

// ─── ROLE SWITCHER ─────────────────────────
const roles = document.querySelectorAll('.role');
let roleIdx = 0;
let roleInterval;

function scrambleRoleText(el, target, duration = 400) {
  const chars = '!<>-_\\/[]{}—=+*^?#';
  let start = Date.now();
  function frame() {
    const elapsed = Date.now() - start;
    const progress = Math.min(elapsed / duration, 1);
    let result = '';
    for (let i = 0; i < target.length; i++) {
      if (i < Math.floor(progress * target.length)) {
        result += target[i];
      } else {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    el.textContent = result;
    if (progress < 1) requestAnimationFrame(frame);
    else el.textContent = target;
  }
  frame();
}

function switchRole() {
  const current = roles[roleIdx];
  const nextIdx = (roleIdx + 1) % roles.length;
  const next    = roles[nextIdx];
  const nextText = next.textContent;

  current.style.transition = 'all 0.4s cubic-bezier(0.22,1,0.36,1)';
  current.style.opacity    = '0';
  current.style.transform  = 'translateY(-100%)';

  setTimeout(() => {
    current.classList.remove('active');
    current.style.cssText = '';
    current.textContent = nextText;

    next.classList.add('active');
    next.style.opacity   = '0';
    next.style.transform = 'translateY(100%)';
    next.style.position  = 'relative';

    // Scramble the text as it appears
    scrambleRoleText(next, nextText);

    requestAnimationFrame(() => {
      next.style.transition = 'all 0.4s cubic-bezier(0.22,1,0.36,1)';
      next.style.opacity    = '1';
      next.style.transform  = 'translateY(0)';
    });

    roleIdx = nextIdx;
  }, 400);
}

roleInterval = setInterval(switchRole, 2800);

// ─── MAGNETIC BUTTONS ──────────────────────
document.querySelectorAll('.mag').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top  - r.height / 2;
    el.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
    el.style.transform  = '';
    setTimeout(() => { el.style.transition = ''; }, 500);
  });
});

// ─── INTERSECTION OBSERVER (REVEAL) ────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .wcard, .skill-domain').forEach(el => {
  revealObserver.observe(el);
});

// Work cards stagger
document.querySelectorAll('.wcard').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.08}s`;
  card.style.opacity    = '0';
  card.style.transform  = 'translateY(30px)';
  card.style.transition = `opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1), border-color 0.4s, box-shadow 0.4s`;
});

const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.wcard').forEach(card => cardObserver.observe(card));

// Skill domain stagger
document.querySelectorAll('.skill-domain').forEach((el, i) => {
  const domainObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 100);
        domainObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  domainObserver.observe(el);
});

// ─── STATS COUNTER ─────────────────────────
const statNums = document.querySelectorAll('.stat-num[data-val]');
let statsTriggered = false;

function animateCount(el, target, duration = 1500) {
  let start = null;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !statsTriggered) {
      statsTriggered = true;
      statNums.forEach((el, i) => {
        setTimeout(() => {
          animateCount(el, parseInt(el.dataset.val), 1200);
        }, i * 200);
      });
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ─── SECTION TITLE GLITCH ON HOVER ─────────
document.querySelectorAll('.sec-title').forEach(el => {
  const chars = '!<>[]{}#?*@%';
  let interval;
  el.addEventListener('mouseenter', () => {
    const orig = el.innerHTML;
    let count = 0;
    interval = setInterval(() => {
      if (count > 5) { clearInterval(interval); el.innerHTML = orig; return; }
      count++;
    }, 50);
  });
  el.addEventListener('mouseleave', () => clearInterval(interval));
});

// ─── WORK CARD TILT ────────────────────────
document.querySelectorAll('.wcard').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `translateY(-4px) perspective(800px) rotateY(${x * 5}deg) rotateX(${y * -4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ─── SKILL IMAGE FALLBACK ───────────────────
document.addEventListener('error', e => {
  const img = e.target;
  if (img.tagName === 'IMG' && img.closest('.skill-item')) {
    const span = document.createElement('span');
    span.className = 'skill-fallback';
    span.textContent = (img.alt || '?').charAt(0).toUpperCase();
    img.replaceWith(span);
  }
}, true);

// ─── NAV STATUS ATTRACT/REPEL TEXT ──────────
// Status already updates in the neural net section above
