gsap.to('.blob-1', {
    x: 200, y: 100, duration: 10, repeat: -1, yoyo: true, ease: "sine.inOut"
});
gsap.to('.blob-2', {
    x: -200, y: -100, duration: 12, repeat: -1, yoyo: true, ease: "sine.inOut"
});
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 40;
    const y = (e.clientY / window.innerHeight - 0.5) * 40;
    gsap.to('.glass-card', { x, y, rotateX: -y/2, rotateY: x/2, duration: 0.5 });
});
