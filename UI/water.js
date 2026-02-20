const filter = document.querySelector("feDisplacementMap");
let baseScale = 30;

window.addEventListener("mousemove", (e) => {
  gsap.to(".cursor", { x: e.clientX, y: e.clientY, duration: 0 });

  // La distorsion augmente quand on bouge vite
  const velocity = Math.abs(e.movementX) + Math.abs(e.movementY);
  const targetScale = 30 + velocity * 0.5;

  gsap.to(filter, {
    attr: { scale: targetScale },
    duration: 0.5,
    onComplete: () => {
      gsap.to(filter, { attr: { scale: 30 }, duration: 1 });
    },
  });
});

// Magnetic
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
