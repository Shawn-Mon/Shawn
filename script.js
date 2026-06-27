// Intersection Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.hidden').forEach(s => observer.observe(s));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const t = document.querySelector(a.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior: 'smooth' });
    });
});

// Progress bar
window.addEventListener('scroll', () => {
    const p = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    document.getElementById('progress-bar').style.width = p + '%';
});

// Typewriter
const el = document.getElementById('typewriter');
const phrases = ['Full-Stack Developer', 'UI Engineer', 'Problem Solver', 'Code Artisan'];
let pi = 0, ci = 0, del = false, pause = false;

function type() {
    const cur = phrases[pi];
    if (!del) {
        el.textContent = cur.substring(0, ci + 1);
        ci++;
        if (ci === cur.length) {
            pause = true;
            setTimeout(() => { pause = false; del = true; }, 2000);
        }
    } else {
        el.textContent = cur.substring(0, ci - 1);
        ci--;
        if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(type, pause ? 2500 : del ? 40 : 80);
}
type();

// Cursor
const dot = document.querySelector('.cursor-dot');
const wrap = document.querySelector('.cursor-wrapper');
let mx = 0, my = 0, dx = 0, dy = 0, ox = 0, oy = 0;

window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function animCursor() {
    dx += (mx - dx) * 0.5;
    dy += (my - dy) * 0.5;
    ox += (mx - ox) * 0.15;
    oy += (my - oy) * 0.15;
    dot.style.transform = `translate(${dx - 3}px, ${dy - 3}px)`;
    wrap.style.transform = `translate(${ox}px, ${oy}px)`;
    requestAnimationFrame(animCursor);
}
animCursor();

document.querySelectorAll('a, button, .btn, .card-btn, .logo').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// 3D Tilt
const tc = document.getElementById('tilt-card');
const pc = tc?.querySelector('.profile-container');
if (tc && pc) {
    tc.addEventListener('mousemove', e => {
        const r = tc.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        pc.style.transform = `perspective(1000px) rotateX(${y * -10}deg) rotateY(${x * 10}deg)`;
    });
    tc.addEventListener('mouseleave', () => {
        pc.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
}

// Magnetic buttons
document.querySelectorAll('.magnetic-btn').forEach(b => {
    b.addEventListener('mousemove', e => {
        const r = b.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        b.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });
    b.addEventListener('mouseleave', () => { b.style.transform = ''; });
});

// Particles
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mp = { x: -1000, y: -1000 };

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

canvas.addEventListener('mousemove', e => { mp.x = e.clientX; mp.y = e.clientY; });
canvas.addEventListener('mouseleave', () => { mp.x = -1000; mp.y = -1000; });

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.3;
        this.sx = (Math.random() - 0.5) * 0.3;
        this.sy = (Math.random() - 0.5) * 0.3;
        this.o = Math.random() * 0.3 + 0.05;
    }
    update() {
        this.x += this.sx;
        this.y += this.sy;
        const dx = mp.x - this.x, dy = mp.y - this.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 150) {
            const f = (150 - d) / 150;
            this.x -= dx * f * 0.008;
            this.y -= dy * f * 0.008;
        }
        if (this.x < 0 || this.x > canvas.width) this.sx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.sy *= -1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.o})`;
        ctx.fill();
    }
}

const count = Math.min(Math.floor((canvas.width * canvas.height) / 10000), 80);
for (let i = 0; i < count; i++) particles.push(new Particle());

function animParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
        p.update();
        p.draw();
        for (let j = i + 1; j < particles.length; j++) {
            const dx = p.x - particles[j].x, dy = p.y - particles[j].y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < 120) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - d / 120) * 0.04})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    });
    requestAnimationFrame(animParticles);
}
animParticles();
