let targetX = 0, targetY = 0;
let currentX = 0, currentY = 0;

window.addEventListener('mousemove', (e) => {
    // Calcul des angles cibles
    targetX = (e.clientX / window.innerWidth - 0.5) * 60; // Rotation Y
    targetY = (e.clientY / window.innerHeight - 0.5) * -60; // Rotation X
    
    // Curseur
    gsap.to('.cursor', { x: e.clientX, y: e.clientY, duration: 0 });
});

function lerpAnimate() {
    // Lissage manuel pour une sensation d'inertie (gyroscope)
    currentX += (targetX - currentX) * 0.05;
    currentY += (targetY - currentY) * 0.05;
    
    const cube = document.querySelector('.cube');
    if (cube) {
        cube.style.transform = `rotateY(${currentX}deg) rotateX(${currentY}deg)`;
    }
    requestAnimationFrame(lerpAnimate);
}
lerpAnimate();

// Magnetic
const area = document.querySelector('.magnetic-area');
const btn = document.querySelector('.back-btn');
area.addEventListener('mousemove', (e) => {
    const rect = area.getBoundingClientRect();
    gsap.to(btn, { 
        x: (e.clientX - rect.left - rect.width/2) * 0.6, 
        y: (e.clientY - rect.top - rect.height/2) * 0.6, 
        duration: 0.4 
    });
});
area.addEventListener('mouseleave', () => gsap.to(btn, { x:0, y:0, duration: 0.5 }));
