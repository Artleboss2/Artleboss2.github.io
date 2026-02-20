document.addEventListener("mousemove", (e) => {
  // Cursor
  gsap.to(".cursor", { x: e.clientX, y: e.clientY, duration: 0 });
  gsap.to(".cursor-follower", {
    x: e.clientX - 20,
    y: e.clientY - 20,
    duration: 0.15,
  });

  // Tilt Effect
  const x = (e.clientX / window.innerWidth - 0.5) * 30;
  const y = (e.clientY / window.innerHeight - 0.5) * 30;
  gsap.to(".glass-card", {
    x: x,
    y: y,
    rotateX: -y / 2,
    rotateY: x / 2,
    duration: 0.6,
  });
  gsap.to(".glass-text", { x: -x * 0.5, y: -y * 0.5, duration: 0.8 });
});

// Magnetic Button
const area = document.querySelector(".magnetic-area");
const btn = document.querySelector(".back-btn");
area.addEventListener("mousemove", (e) => {
  const rect = area.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  gsap.to(btn, { x: x * 0.6, y: y * 0.6, duration: 0.4 });
});
area.addEventListener("mouseleave", () => {
  gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
});
