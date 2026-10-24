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
const ctaForm = document.getElementById('ctaForm');
if (ctaForm) {
    ctaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = document.getElementById('ctaBtn');
        const input = document.getElementById('ctaEmail');
        if (btn) btn.textContent = '✅ Sent!';
        if (btn) btn.style.background = 'linear-gradient(135deg, #00ff88, #00d4ff)';
        setTimeout(() => {
            if (btn) btn.textContent = "Let's Go →";
            if (btn) btn.style.background = '';
            if (input) input.value = '';
        }, 3000);
    });
}

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

// ── 3D HERO INTERACTIVE MODEL (Three.js) ──
function initHero3D() {
    const container = document.getElementById('hero3DCanvas');
    if (!container || typeof THREE === 'undefined') return;

    try {
        const testCanvas = document.createElement('canvas');
        const hasWebGL = Boolean(window.WebGLRenderingContext && (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')));
        if (!hasWebGL) return;
    } catch (e) {
        return;
    }

    const width = container.clientWidth || 460;
    const height = container.clientHeight || 460;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 11;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Group to hold all 3D components
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00d4ff, 3.2, 50);
    cyanLight.position.set(6, 6, 8);
    scene.add(cyanLight);

    const blueLight = new THREE.PointLight(0x2563eb, 2.5, 50);
    blueLight.position.set(-6, -4, 6);
    scene.add(blueLight);

    const goldLight = new THREE.PointLight(0xf59e0b, 1.2, 40);
    goldLight.position.set(0, -6, -4);
    scene.add(goldLight);

    // Helper to generate a crisp high-res canvas texture for the company emblem
    function createCompanyBadgeTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const x = 32, y = 36, w = 960, h = 440, r = 40;

        // Dark glassmorphism card background
        const bgGrad = ctx.createLinearGradient(x, y, x + w, y + h);
        bgGrad.addColorStop(0, 'rgba(8, 22, 52, 0.95)');
        bgGrad.addColorStop(0.5, 'rgba(12, 32, 70, 0.96)');
        bgGrad.addColorStop(1, 'rgba(6, 18, 42, 0.95)');
        ctx.fillStyle = bgGrad;

        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(x, y, w, h, r);
        } else {
            ctx.rect(x, y, w, h);
        }
        ctx.fill();

        // Glowing cyan border
        ctx.lineWidth = 7;
        const borderGrad = ctx.createLinearGradient(x, y, x + w, y + h);
        borderGrad.addColorStop(0, '#00d4ff');
        borderGrad.addColorStop(0.5, '#22d3ee');
        borderGrad.addColorStop(1, '#2563eb');
        ctx.strokeStyle = borderGrad;
        ctx.shadowColor = '#00d4ff';
        ctx.shadowBlur = 20;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Subtle tech grid lines
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.16)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + 50, y + 105);
        ctx.lineTo(x + w - 50, y + 105);
        ctx.moveTo(x + 50, y + h - 100);
        ctx.lineTo(x + w - 50, y + h - 100);
        ctx.stroke();

        // Top badge pill: "INNOVATIVE · DIGITAL · SMART"
        ctx.fillStyle = 'rgba(0, 212, 255, 0.16)';
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(x + w / 2 - 190, y + 36, 380, 48, 24);
        } else {
            ctx.rect(x + w / 2 - 190, y + 36, 380, 48);
        }
        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Glowing dot
        ctx.fillStyle = '#00d4ff';
        ctx.shadowColor = '#00d4ff';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(x + w / 2 - 150, y + 60, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.font = '700 21px "Outfit", sans-serif';
        ctx.fillStyle = '#22d3ee';
        ctx.textAlign = 'center';
        ctx.fillText('INNOVATIVE · DIGITAL · SMART', x + w / 2 + 10, y + 68);

        // Company Name: "youDigit"
        ctx.font = '900 114px "Outfit", sans-serif';
        const youText = 'you';
        const digitText = 'Digit';
        const youWidth = ctx.measureText(youText).width;
        const digitWidth = ctx.measureText(digitText).width;
        const totalW = youWidth + digitWidth;
        const startX = x + (w - totalW) / 2;

        ctx.textAlign = 'left';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
        ctx.shadowBlur = 18;
        ctx.fillText(youText, startX, y + 225);

        ctx.fillStyle = '#00d4ff';
        ctx.shadowColor = 'rgba(0, 212, 255, 0.9)';
        ctx.shadowBlur = 30;
        ctx.fillText(digitText, startX + youWidth, y + 225);
        ctx.shadowBlur = 0;

        // Subtitle: "TECHNOLOGIES"
        ctx.textAlign = 'center';
        ctx.font = '800 40px "Space Grotesk", "Outfit", sans-serif';
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = 'rgba(37, 99, 235, 0.6)';
        ctx.shadowBlur = 14;
        ctx.fillText('T E C H N O L O G I E S', x + w / 2, y + 300);
        ctx.shadowBlur = 0;

        // Bottom tag
        ctx.font = '500 22px "Outfit", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText('Smart Digital Solutions & Software', x + w / 2, y + 380);

        const tex = new THREE.CanvasTexture(canvas);
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        return tex;
    }

    // 3. Central Crystal Core (Icosahedron with high-shine metallic finish)
    const coreGeo = new THREE.IcosahedronGeometry(1.42, 1);
    const coreMat = new THREE.MeshStandardMaterial({
        color: 0x1e3a8a,
        emissive: 0x0891b2,
        emissiveIntensity: 0.35,
        metalness: 0.85,
        roughness: 0.15,
        flatShading: true,
        transparent: true,
        opacity: 0.85
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    mainGroup.add(coreMesh);

    // 3b. Company Name Emblem on the middle object ("youDigit Technologies")
    const badgeTexture = createCompanyBadgeTexture();
    const badgeMat = new THREE.MeshBasicMaterial({
        map: badgeTexture,
        transparent: true,
        side: THREE.FrontSide
    });

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            const updated = createCompanyBadgeTexture();
            badgeMat.map = updated;
            badgeMat.needsUpdate = true;
        });
    }

    // High-tech backing core block
    const backingGeo = new THREE.BoxGeometry(2.88, 1.42, 2.88);
    const backingMat = new THREE.MeshStandardMaterial({
        color: 0x06142a,
        emissive: 0x0891b2,
        emissiveIntensity: 0.18,
        roughness: 0.15,
        metalness: 0.9
    });
    const backingMesh = new THREE.Mesh(backingGeo, backingMat);
    coreMesh.add(backingMesh);

    // 4-sided badges so the company name is visible from all angles
    const badgeW = 2.85;
    const badgeH = 1.4;
    const badgeGeo = new THREE.PlaneGeometry(badgeW, badgeH);
    const badgeDist = 1.46;

    // Front badge
    const frontBadge = new THREE.Mesh(badgeGeo, badgeMat);
    frontBadge.position.set(0, 0, badgeDist);
    frontBadge.renderOrder = 10;
    coreMesh.add(frontBadge);

    // Back badge (rotated 180 deg)
    const backBadge = new THREE.Mesh(badgeGeo, badgeMat);
    backBadge.position.set(0, 0, -badgeDist);
    backBadge.rotation.y = Math.PI;
    backBadge.renderOrder = 10;
    coreMesh.add(backBadge);

    // Right badge
    const rightBadge = new THREE.Mesh(badgeGeo, badgeMat);
    rightBadge.position.set(badgeDist, 0, 0);
    rightBadge.rotation.y = Math.PI / 2;
    rightBadge.renderOrder = 10;
    coreMesh.add(rightBadge);

    // Left badge
    const leftBadge = new THREE.Mesh(badgeGeo, badgeMat);
    leftBadge.position.set(-badgeDist, 0, 0);
    leftBadge.rotation.y = -Math.PI / 2;
    leftBadge.renderOrder = 10;
    coreMesh.add(leftBadge);

    // 4. Inner Glowing Seed (Inner wireframe icosahedron)
    const seedGeo = new THREE.IcosahedronGeometry(0.9, 0);
    const seedMat = new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        wireframe: true,
        transparent: true,
        opacity: 0.6
    });
    const seedMesh = new THREE.Mesh(seedGeo, seedMat);
    mainGroup.add(seedMesh);

    // 5. Outer Geodesic Wireframe Lattice
    const wireGeo = new THREE.IcosahedronGeometry(2.9, 1);
    const wireEdges = new THREE.WireframeGeometry(wireGeo);
    const wireMat = new THREE.LineBasicMaterial({
        color: 0x0891b2,
        transparent: true,
        opacity: 0.35,
        linewidth: 1
    });
    const wireframe = new THREE.LineSegments(wireEdges, wireMat);
    mainGroup.add(wireframe);

    // 6. Glowing Vertex Nodes (Points on outer shell)
    const nodesMat = new THREE.PointsMaterial({
        color: 0x22d3ee,
        size: 0.12,
        transparent: true,
        opacity: 0.85
    });
    const nodes = new THREE.Points(wireGeo, nodesMat);
    mainGroup.add(nodes);

    // 7. Dual Orbiting Rings (Torus)
    const ring1Geo = new THREE.TorusGeometry(3.5, 0.035, 16, 120);
    const ring1Mat = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.65
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 8;
    mainGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(3.9, 0.025, 16, 120);
    const ring2Mat = new THREE.MeshBasicMaterial({
        color: 0x2563eb,
        transparent: true,
        opacity: 0.45
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z = Math.PI / 6;
    mainGroup.add(ring2);

    // 8. Orbiting Data Satellites
    const satCount = 4;
    const satellites = [];
    const satGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const satMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee });

    for (let i = 0; i < satCount; i++) {
        const sat = new THREE.Mesh(satGeo, satMat);
        mainGroup.add(sat);
        satellites.push({
            mesh: sat,
            angle: (i * Math.PI * 2) / satCount,
            radius: i % 2 === 0 ? 3.5 : 3.9,
            speed: (i % 2 === 0 ? 0.018 : -0.015),
            tiltX: i % 2 === 0 ? Math.PI / 3 : -Math.PI / 4,
            tiltZ: i % 2 === 0 ? Math.PI / 8 : Math.PI / 6
        });
    }

    // 9. Floating Particle Field (Constellation)
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        const r = 3.2 + Math.random() * 2.8;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        particlePositions[i] = r * Math.sin(phi) * Math.cos(theta);
        particlePositions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
        particlePositions[i + 2] = r * Math.cos(phi);
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
        color: 0x0891b2,
        size: 0.07,
        transparent: true,
        opacity: 0.7
    });
    const particleCloud = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particleCloud);

    // 10. Interaction (Drag, Mouse Parallax & Inertia)
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let rotX = 0.2;
    let rotY = 0.4;
    let targetRotX = 0.2;
    let targetRotY = 0.4;
    let mouseParallax = { x: 0, y: 0 };
    let targetParallax = { x: 0, y: 0 };

    const hint = document.getElementById('modelHint');

    function onPointerDown(e) {
        isDragging = true;
        const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
        prevMousePos = { x: clientX, y: clientY };
        if (hint && !hint.classList.contains('fade-out')) {
            hint.classList.add('fade-out');
        }
    }

    function onPointerMove(e) {
        const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

        if (isDragging) {
            const deltaX = clientX - prevMousePos.x;
            const deltaY = clientY - prevMousePos.y;
            targetRotY += deltaX * 0.008;
            targetRotX += deltaY * 0.008;
            prevMousePos = { x: clientX, y: clientY };
        }
    }

    function onPointerUp() {
        isDragging = false;
    }

    const heroSection = document.getElementById('hero');
    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const normX = (e.clientX - rect.left) / rect.width - 0.5;
            const normY = (e.clientY - rect.top) / rect.height - 0.5;
            targetParallax.x = normX * 0.35;
            targetParallax.y = normY * 0.35;
        });
    }

    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    function onResize() {
        if (!container) return;
        const newW = container.clientWidth;
        const newH = container.clientHeight;
        if (newW > 0 && newH > 0) {
            camera.aspect = newW / newH;
            camera.updateProjectionMatrix();
            renderer.setSize(newW, newH);
        }
    }
    window.addEventListener('resize', onResize);

    // 11. Render / Animation Loop
    let clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Idle auto-rotation when not dragging
        if (!isDragging) {
            targetRotY += 0.004;
            targetRotX = Math.sin(elapsedTime * 0.5) * 0.15;
        }

        // Smooth damping interpolation
        rotX += (targetRotX - rotX) * 0.07;
        rotY += (targetRotY - rotY) * 0.07;
        mouseParallax.x += (targetParallax.x - mouseParallax.x) * 0.05;
        mouseParallax.y += (targetParallax.y - mouseParallax.y) * 0.05;

        mainGroup.rotation.x = rotX + mouseParallax.y;
        mainGroup.rotation.y = rotY + mouseParallax.x;

        // Floating vertical bobbing
        mainGroup.position.y = Math.sin(elapsedTime * 1.6) * 0.18;

        // Internal layer rotation
        coreMesh.rotation.y += 0.003;
        seedMesh.rotation.x -= 0.005;
        wireframe.rotation.y -= 0.002;
        wireframe.rotation.z += 0.001;
        particleCloud.rotation.y += 0.001;

        // Animate satellites
        satellites.forEach(sat => {
            sat.angle += sat.speed;
            const x = sat.radius * Math.cos(sat.angle);
            const y = sat.radius * Math.sin(sat.angle);
            sat.mesh.position.set(
                x * Math.cos(sat.tiltZ) - y * Math.sin(sat.tiltZ),
                x * Math.sin(sat.tiltZ) + y * Math.cos(sat.tiltZ),
                x * Math.sin(sat.tiltX)
            );
        });

        renderer.render(scene, camera);
    }

    animate();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHero3D);
} else {
    initHero3D();
}

