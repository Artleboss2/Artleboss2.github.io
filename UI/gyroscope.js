window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 180;
    const y = (e.clientY / window.innerHeight - 0.5) * -180;
    gsap.to('.cube', { rotateY: x, rotateX: y, duration: 1.5, ease: "power2.out" });
});
