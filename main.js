// ── NAV SCROLL EFFECT ──
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ── MOBILE MENU ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');

hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ── SCROLL REVEAL ──
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.12 });
reveals.forEach(el => observer.observe(el));

// ── ANIMATED COUNTERS ──
function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current) + suffix;
    }, 16);
}

const statObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            animateCounter(e.target);
            statObs.unobserve(e.target);
        }
    });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num').forEach(el => statObs.observe(el));

// ── FLOATING PARTICLES ──
function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 25; i++) {
        const p = document.createElement('div');
        p.classList.add('particle');
        const size = Math.random() * 4 + 2;
        p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      animation-duration:${Math.random() * 15 + 10}s;
      animation-delay:${Math.random() * 10}s;
      background: ${Math.random() > 0.5 ? 'var(--cyan)' : 'var(--green)'};
    `;
        container.appendChild(p);
    }
}
createParticles();

// ── TYPEWRITER EFFECT ──
const phrases = ['Digital Presence', 'Custom Web Apps', 'Smart Solutions', 'Business Growth'];
let phraseIndex = 0, charIndex = 0, deleting = false;
const typeEl = document.getElementById('typewriter');

function typewrite() {
    const phrase = phrases[phraseIndex];
    if (deleting) {
        typeEl.textContent = phrase.substring(0, charIndex--);
        if (charIndex < 0) { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; setTimeout(typewrite, 500); return; }
    } else {
        typeEl.textContent = phrase.substring(0, charIndex++);
        if (charIndex > phrase.length) { deleting = true; setTimeout(typewrite, 1800); return; }
    }
    setTimeout(typewrite, deleting ? 60 : 100);
}
typewrite();

// ── CTA FORM ──
document.getElementById('ctaForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('ctaBtn');
    const input = document.getElementById('ctaEmail');
    btn.textContent = '✅ Sent!';
    btn.style.background = 'linear-gradient(135deg, #00ff88, #00d4ff)';
    setTimeout(() => {
        btn.textContent = "Let's Go →";
        btn.style.background = '';
        input.value = '';
    }, 3000);
});

// ── NEON CURSOR TRAIL (desktop only) ──
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const trail = [];
    const TRAIL_COUNT = 8;
    for (let i = 0; i < TRAIL_COUNT; i++) {
        const dot = document.createElement('div');
        const size = 6 - i * 0.5;
        dot.style.cssText = `position:fixed;width:${size}px;height:${size}px;border-radius:50%;background:#00d4ff;pointer-events:none;z-index:99999;opacity:${(0.8 - i * 0.1).toFixed(2)};left:-20px;top:-20px;`;
        document.body.appendChild(dot);
        trail.push({ el: dot, x: -20, y: -20 });
    }

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

    function animateTrail() {
        let x = mouseX, y = mouseY;
        trail.forEach((dot, i) => {
            dot.x += (x - dot.x) * (0.35 - i * 0.03);
            dot.y += (y - dot.y) * (0.35 - i * 0.03);
            dot.el.style.left = dot.x - 3 + 'px';
            dot.el.style.top = dot.y - 3 + 'px';
            x = dot.x; y = dot.y;
        });
        requestAnimationFrame(animateTrail);
    }
    animateTrail();
}

// ── ACTIVE NAV LINK ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 140) current = s.id; });
    navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + current ? 'var(--cyan)' : '';
    });
});
