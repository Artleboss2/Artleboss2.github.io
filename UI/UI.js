// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initLenis();
    initThreeJS();
    initGSAPAnimations();
    initCustomCursor();
    initDecodeText();
    initMagneticButtons();
    initTiltCards();
});

// 1. SMOOTH SCROLL (Lenis)
function initLenis() {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}

// 2. 3D PARTICLES BACKGROUND (Three.js)
function initThreeJS() {
    const canvas = document.querySelector('#canvas-3d');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particlesGeometry = new THREE.BufferGeometry();
    const count = 2000;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.015,
        color: 0x00ff88,
        transparent: true,
        opacity: 0.5
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 3;

    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
    });

    function animate() {
        requestAnimationFrame(animate);
        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.0005;

        // Smooth follow mouse
        particlesMesh.position.x += (mouseX - particlesMesh.position.x) * 0.05;
        particlesMesh.position.y += (-mouseY - particlesMesh.position.y) * 0.05;

        renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
}

// 3. CUSTOM CURSOR
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    window.addEventListener('mousemove', (e) => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0 });
        gsap.to(follower, { x: e.clientX - 20, y: e.clientY - 20, duration: 0.15 });
    });

    // Hover effect
    const links = document.querySelectorAll('.magnetic-btn, .component-card');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.to(follower, { scale: 1.5, background: 'rgba(0, 255, 136, 0.1)', duration: 0.3 });
        });
        link.addEventListener('mouseleave', () => {
            gsap.to(follower, { scale: 1, background: 'transparent', duration: 0.3 });
        });
    });
}

// 4. DECODE TEXT EFFECT
function initDecodeText() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_";
    const elements = document.querySelectorAll('.decode-text');

    elements.forEach(el => {
        el.addEventListener('mouseenter', event => {
            let iteration = 0;
            const originalValue = event.target.dataset.value;
            const interval = setInterval(() => {
                event.target.innerText = originalValue
                    .split("")
                    .map((letter, index) => {
                        if (index < iteration) return originalValue[index];
                        return letters[Math.floor(Math.random() * 37)];
                    })
                    .join("");

                if (iteration >= originalValue.length) clearInterval(interval);
                iteration += 1 / 3;
            }, 30);
        });
    });
}

// 5. MAGNETIC BUTTONS (GSAP)
function initMagneticButtons() {
    const magneticAreas = document.querySelectorAll('.magnetic-area');
    
    magneticAreas.forEach(area => {
        const btn = area.querySelector('.magnetic-btn');
        
        area.addEventListener('mousemove', (e) => {
            const rect = area.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, { x: x * 0.6, y: y * 0.6, duration: 0.4, ease: "power2.out" });
        });

        area.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
        });
    });
}

// 6. TILT CARDS & GLOW
function initTiltCards() {
    const cards = document.querySelectorAll('.card-inner');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Set custom properties for glow
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;

            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.5,
                ease: "power2.out"
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5 });
        });
    });
}

// 7. ENTRANCE ANIMATIONS
function initGSAPAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero timeline
    const tl = gsap.timeline();
    tl.to('body', { opacity: 1, duration: 0.5 })
      .from('.decode-text', { y: 100, opacity: 0, duration: 1, ease: "power4.out" })
      .from('.hero-subline', { opacity: 0, duration: 1 }, "-=0.5")
      .from('.magnetic-btn', { scale: 0, opacity: 0, duration: 0.8, ease: "back.out(1.7)" }, "-=0.5");

    // Scroll reveal
    gsap.utils.toArray('.reveal').forEach(elem => {
        gsap.from(elem, {
            scrollTrigger: {
                trigger: elem,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });
}
