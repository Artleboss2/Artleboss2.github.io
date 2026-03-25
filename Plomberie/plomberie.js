document.addEventListener("DOMContentLoaded", () => {
  // 1. Smooth Scroll Initialisation
  const lenis = new Lenis();
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // 2. GSAP Config
  gsap.registerPlugin(ScrollTrigger);

  // 3. Hero Animations (One-time reveal)
  gsap.from(".reveal-text", {
    y: 60,
    opacity: 0,
    duration: 1.5,
    stagger: 0.3,
    ease: "power4.out",
  });

  // 4. Scroll-Triggered Reveal (Correction : attend le scroll)
  const revealItems = gsap.utils.toArray(".reveal-item, .service-card");
  revealItems.forEach((item) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: "top 85%", // Se déclenche quand l'élément entre dans la vue
        toggleActions: "play none none reverse",
      },
      y: 50,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
    });
  });

  // 5. Parallax sur les images des services
  gsap.utils.toArray(".card-image-mask img").forEach((img) => {
    gsap.to(img, {
      scrollTrigger: {
        trigger: img,
        scrub: true,
      },
      y: -40,
      ease: "none",
    });
  });

  // 6. Compteur (Déclenché uniquement au scroll)
  const counter = document.getElementById("year-counter");
  if (counter) {
    const obj = { val: 2024 };
    gsap.to(obj, {
      val: 1937,
      scrollTrigger: {
        trigger: ".heritage",
        start: "top 70%",
      },
      duration: 2.5,
      onUpdate: () => {
        counter.innerText = Math.floor(obj.val);
      },
    });
  }

  // 7. Effet Magnétique (Optimisé)
  const btns = document.querySelectorAll(".btn-magnetic");
  btns.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const { clientX: x, clientY: y } = e;
      const { left, top, width, height } = btn.getBoundingClientRect();
      const moveX = (x - left - width / 2) * 0.4;
      const moveY = (y - top - height / 2) * 0.4;
      gsap.to(btn, { x: moveX, y: moveY, duration: 0.3 });
    });
    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
    });
  });
});
