const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("p-canvas"),
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const count = 8000;
const positions = new Float32Array(count * 3);
const originalPositions = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 15;
  originalPositions[i] = positions[i];
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
const material = new THREE.PointsMaterial({
  color: 0x00ff88,
  size: 0.02,
  transparent: true,
  opacity: 0.6,
});
const points = new THREE.Points(geometry, material);
scene.add(points);

camera.position.z = 5;

let mouse = new THREE.Vector2(-999, -999);
window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  gsap.to(".cursor", { x: e.clientX, y: e.clientY, duration: 0 });
});

function animate() {
  requestAnimationFrame(animate);
  const posAttr = geometry.attributes.position;

  // Interaction logique : les particules fuient le curseur
  const vector = new THREE.Vector3(mouse.x, mouse.y, 0).unproject(camera);
  const dir = vector.sub(camera.position).normalize();
  const distance = -camera.position.z / dir.z;
  const pos = camera.position.clone().add(dir.multiplyScalar(distance));

  for (let i = 0; i < count; i++) {
    let ix = i * 3,
      iy = i * 3 + 1,
      iz = i * 3 + 2;

    const dx = posAttr.array[ix] - pos.x;
    const dy = posAttr.array[iy] - pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 1.5) {
      posAttr.array[ix] += dx * 0.05;
      posAttr.array[iy] += dy * 0.05;
    } else {
      // Retour à la position d'origine
      posAttr.array[ix] += (originalPositions[ix] - posAttr.array[ix]) * 0.02;
      posAttr.array[iy] += (originalPositions[iy] - posAttr.array[iy]) * 0.02;
    }
  }

  posAttr.needsUpdate = true;
  points.rotation.y += 0.001;
  renderer.render(scene, camera);
}
animate();

// Magnetic Back Button Logic
const area = document.querySelector(".magnetic-area");
const btn = document.querySelector(".back-btn");
area.addEventListener("mousemove", (e) => {
  const rect = area.getBoundingClientRect();
  gsap.to(btn, {
    x: (e.clientX - rect.left - rect.width / 2) * 0.6,
    y: (e.clientY - rect.top - rect.height / 2) * 0.6,
    duration: 0.4,
  });
});
area.addEventListener("mouseleave", () =>
  gsap.to(btn, { x: 0, y: 0, duration: 0.5 }),
);
