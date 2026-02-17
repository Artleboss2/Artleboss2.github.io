const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('p-canvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const points = [];
for (let i = 0; i < 5000; i++) {
    points.push(new THREE.Vector3((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10));
}
const geometry = new THREE.BufferGeometry().setFromPoints(points);
const material = new THREE.PointsMaterial({ color: 0x00ff88, size: 0.02 });
const mesh = new THREE.Points(geometry, material);
scene.add(mesh);
camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.y += 0.002;
    renderer.render(scene, camera);
}
animate();
