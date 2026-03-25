document.addEventListener("DOMContentLoaded", () => {
  initLenis();
  initThreeJS();
  initCustomCursor();
  initDecodeText();
  initMagneticSystem();
  initGSAPTransitions();
});

// 1. SMOOTH SCROLL
function initLenis() {
  const lenis = new Lenis({ duration: 1.2 });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

// 2. 3D BACKGROUND
function initThreeJS() {
  const canvas = document.querySelector("#canvas-3d");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(1500 * 3);
  for (let i = 0; i < 4500; i++) pos[i] = (Math.random() - 0.5) * 12;
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color: 0x00ff88, size: 0.015 });
  const points = new THREE.Points(geo, mat);
  scene.add(points);
  camera.position.z = 5;

  function animate() {
    requestAnimationFrame(animate);
    points.rotation.y += 0.001;
    renderer.render(scene, camera);
  }
  animate();
}

// 3. CURSOR
function initCustomCursor() {
  const cursor = document.querySelector(".cursor");
  const follower = document.querySelector(".cursor-follower");
  window.addEventListener("mousemove", (e) => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0 });
    gsap.to(follower, { x: e.clientX - 20, y: e.clientY - 20, duration: 0.15 });
  });
}

// 4. DECODE
function initDecodeText() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  document.querySelectorAll(".decode-text").forEach((el) => {
    el.addEventListener("mouseenter", (e) => {
      let iter = 0;
      const interval = setInterval(() => {
        e.target.innerText = e.target.dataset.value
          .split("")
          .map((l, i) => {
            if (i < iter) return e.target.dataset.value[i];
            return letters[Math.floor(Math.random() * 36)];
          })
          .join("");
        if (iter >= e.target.dataset.value.length) clearInterval(interval);
        iter += 1 / 3;
      }, 30);
    });
  });
}

// 5. MAGNETIC SYSTEM (Optimisé pour tous les boutons)
function initMagneticSystem() {
  document.querySelectorAll(".magnetic-area").forEach((area) => {
    const btn = area.querySelector(".nav-btn");
    area.addEventListener("mousemove", (e) => {
      const rect = area.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: x * 0.5, y: y * 0.5, duration: 0.4 });
    });
    area.addEventListener("mouseleave", () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
    });
  });
}

// 6. TRANSITIONS
function initGSAPTransitions() {
  gsap.from(".nav-btn", {
    y: 40,
    opacity: 0,
    stagger: 0.1,
    duration: 1,
    ease: "power4.out",
    delay: 0.5,
  });
}
