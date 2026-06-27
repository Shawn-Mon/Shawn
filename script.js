// ============================================
// 1. SCROLL PROGRESS BAR
// ============================================
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
    const p = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    progressBar.style.width = p + '%';
});

// ============================================
// 2. NAVBAR — SCROLL BEHAVIOR + ACTIVE LINK
// ============================================
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

function updateNav() {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 50);

    let current = '';
    sections.forEach(sec => {
        const top = sec.offsetTop - 150;
        const bottom = top + sec.offsetHeight;
        if (scrollY >= top && scrollY < bottom) current = sec.id;
    });

    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
}
window.addEventListener('scroll', updateNav);
updateNav();

// ============================================
// 3. CUSTOM CURSOR WITH TRAIL
// ============================================
const dot = document.querySelector('.cursor-dot');
const trail = document.querySelector('.cursor-trail');
let mx = 0, my = 0;
let dotX = 0, dotY = 0;
const trailDots = [];
const trailCount = 8;

for (let i = 0; i < trailCount; i++) {
    const d = document.createElement('div');
    d.className = 'trail-dot';
    d.style.opacity = 1 - i / trailCount;
    d.style.transform = `scale(${1 - i * 0.1})`;
    trail.appendChild(d);
    trailDots.push({ el: d, x: -100, y: -100 });
}

let frameCount = 0;
window.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    frameCount++;
});

function animCursor() {
    dotX += (mx - dotX) * 0.35;
    dotY += (my - dotY) * 0.35;
    dot.style.transform = `translate(${dotX - 3}px, ${dotY - 3}px)`;

    trailDots[0].x += (mx - trailDots[0].x) * 0.25;
    trailDots[0].y += (my - trailDots[0].y) * 0.25;
    for (let i = 1; i < trailCount; i++) {
        trailDots[i].x += (trailDots[i - 1].x - trailDots[i].x) * 0.35;
        trailDots[i].y += (trailDots[i - 1].y - trailDots[i].y) * 0.35;
    }
    trailDots.forEach(d => {
        d.el.style.transform = `translate(${d.x - 1.5}px, ${d.y - 1.5}px)`;
    });

    requestAnimationFrame(animCursor);
}
animCursor();

// ============================================
// 4. SCRAMBLE TEXT EFFECT
// ============================================
const scrambleEl = document.getElementById('scramble');
const phrases = ['Full-Stack Developer', 'UI Engineer', 'Creative Developer', 'Problem Solver', 'Code Artisan'];
let pi = 0, frame = 0, resolving = false;
const chars = '!<>-_\\/[]{}—=+*^?#________';

function scrambleText() {
    const target = phrases[pi];
    const len = target.length;
    const progress = Math.min(frame / 30, 1);

    let output = '';
    for (let i = 0; i < len; i++) {
        if (i < Math.floor(progress * len)) {
            output += target[i];
        } else {
            output += chars[Math.floor(Math.random() * chars.length)];
        }
    }
    scrambleEl.textContent = output;

    if (progress < 1) {
        frame++;
        requestAnimationFrame(scrambleText);
    } else {
        setTimeout(() => {
            pi = (pi + 1) % phrases.length;
            frame = 0;
            requestAnimationFrame(scrambleText);
        }, 2500);
    }
}
scrambleText();

// ============================================
// 5. TEXT SCRAMBLE ON HEADING HOVER
// ============================================
document.querySelectorAll('.section-header h2').forEach(h2 => {
    const original = h2.textContent;
    h2.addEventListener('mouseenter', () => {
        let count = 0;
        const interval = setInterval(() => {
            let s = '';
            for (let i = 0; i < original.length; i++) {
                s += chars[Math.floor(Math.random() * chars.length)];
            }
            h2.textContent = s;
            count++;
            if (count > 8) {
                clearInterval(interval);
                h2.textContent = original;
            }
        }, 40);
    });
});

// ============================================
// 6. 3D TILT ON HERO VISUAL
// ================ ============================
const tiltArea = document.getElementById('tilt-area');
const morphFrame = document.getElementById('morph-frame');

if (tiltArea && morphFrame) {
    tiltArea.addEventListener('mousemove', e => {
        const r = tiltArea.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        morphFrame.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${y * -8}deg)`;
    });
    tiltArea.addEventListener('mouseleave', () => {
        morphFrame.style.transform = 'perspective(800px) rotateY(0) rotateX(0)';
    });
}

// ============================================
// 7. MAGNETIC BUTTONS
// ============================================
document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

// ============================================
// 8. WORK CARD TILT
// ============================================
document.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${y * -3}deg)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateY(0) rotateX(0)';
    });
});

// ============================================
// 9. SKILL RING COUNTER ANIMATION
// ============================================
const skillsSection = document.querySelector('.skills');
const ringPcts = document.querySelectorAll('.ring-pct');

const ringObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal-rings');
            ringPcts.forEach(el => {
                const target = parseInt(el.dataset.target);
                let current = 0;
                const step = Math.ceil(target / 40);
                const interval = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(interval);
                    }
                    el.textContent = current;
                }, 30);
            });
            ringObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

if (skillsSection) ringObserver.observe(skillsSection);

// ============================================
// 10. STAGGERED REVEAL — SECTION CHILDREN
// ============================================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll('.work-card, .skill-ring-wrap, .contact-card');
            items.forEach((el, i) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                setTimeout(() => {
                    el.style.transition = 'all 0.6s cubic-bezier(0.22,1,0.36,1)';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 150 * i);
            });
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.work, .skills, .contact').forEach(s => revealObserver.observe(s));

// ============================================
// 11. GRID BACKGROUND WITH MOUSE WARP
// ============================================
const canvas = document.getElementById('grid-canvas');
const ctx = canvas.getContext('2d');
let W, H, cols, rows;
const spacing = 50;
let gridPoints = [];
let mouse = { x: -1000, y: -1000, dx: 0, dy: 0 };
let prevMouse = { x: -1000, y: -1000 };

function resizeGrid() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    cols = Math.ceil(W / spacing) + 1;
    rows = Math.ceil(H / spacing) + 1;
    initGrid();
}
resizeGrid();
window.addEventListener('resize', resizeGrid);

function initGrid() {
    gridPoints = [];
    for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
            gridPoints.push({
                ox: c * spacing,
                oy: r * spacing,
                x: c * spacing,
                y: r * spacing,
                vx: 0, vy: 0
            });
        }
    }
}

canvas.addEventListener('mousemove', e => {
    prevMouse.x = mouse.x;
    prevMouse.y = mouse.y;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.dx = mouse.x - prevMouse.x;
    mouse.dy = mouse.y - prevMouse.y;
});

canvas.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
});

function drawGrid() {
    ctx.clearRect(0, 0, W, H);

    const radius = 180;

    gridPoints.forEach(p => {
        const dx = p.ox - mouse.x;
        const dy = p.oy - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < radius) {
            const force = (1 - dist / radius);
            const angle = Math.atan2(dy, dx);
            const push = force * 12;
            const tx = p.ox + Math.cos(angle) * push;
            const ty = p.oy + Math.sin(angle) * push;
            p.vx += (tx - p.x) * 0.08;
            p.vy += (ty - p.y) * 0.08;
        }

        const dx2 = p.x - mouse.x;
        const dy2 = p.y - mouse.y;
        const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        if (dist2 < radius) {
            const force2 = (1 - dist2 / radius) * 0.3;
            p.vx += mouse.dx * force2;
            p.vy += mouse.dy * force2;
        }

        p.vx *= 0.85;
        p.vy *= 0.85;
        p.x += p.vx;
        p.y += p.vy;
    });

    ctx.strokeStyle = 'rgba(99, 102, 241, 0.07)';
    ctx.lineWidth = 0.5;

    for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        for (let c = 0; c <= cols; c++) {
            const idx = r * (cols + 1) + c;
            if (c === 0) ctx.moveTo(gridPoints[idx].x, gridPoints[idx].y);
            else ctx.lineTo(gridPoints[idx].x, gridPoints[idx].y);
        }
        ctx.stroke();
    }

    for (let c = 0; c < cols; c++) {
        ctx.beginPath();
        for (let r = 0; r <= rows; r++) {
            const idx = r * (cols + 1) + c;
            if (r === 0) ctx.moveTo(gridPoints[idx].x, gridPoints[idx].y);
            else ctx.lineTo(gridPoints[idx].x, gridPoints[idx].y);
        }
        ctx.stroke();
    }

    requestAnimationFrame(drawGrid);
}
drawGrid();

// ============================================
// 12. SMOOTH SCROLL FOR NAV LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});
