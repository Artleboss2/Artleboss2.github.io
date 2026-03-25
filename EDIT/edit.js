window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollY / maxScroll;

  const instruction = document.getElementById("instruction");
  const decoCards = document.querySelectorAll(".card.deco");
  const choiceCards = document.querySelectorAll(".card.choice");

  // --- PHASE 1 : SHUFFLE (0% à 50% du scroll) ---
  if (progress < 0.5) {
    const shufflePower = progress * 2; // Normalisé de 0 à 1
    instruction.innerText = "MÉLANGE EN COURS...";
    instruction.style.opacity = 1;

    // On fait vibrer et s'écarter toutes les cartes
    document.querySelectorAll(".card").forEach((card, i) => {
      const side = i % 2 === 0 ? 1 : -1;
      const x = Math.sin(progress * 40 + i) * 200 * shufflePower * side;
      const z = i * 5;
      const rotate = Math.sin(progress * 50) * 10 * side;

      card.style.transform = `translateX(${x}px) translateZ(${z}px) rotateZ(${rotate}deg)`;
      card.style.opacity = 1;
    });
  }

  // --- PHASE 2 : DISTRIBUTION (50% à 100% du scroll) ---
  else {
    const distProgress = (progress - 0.5) * 2; // Normalisé de 0 à 1
    instruction.innerText = "CHOISISSEZ UNE CARTE";

    // On cache le paquet décoratif
    decoCards.forEach(
      (card) => (card.style.opacity = Math.max(0, 1 - distProgress * 2)),
    );

    // On aligne les 3 cartes de choix
    const positions = [-300, 0, 300]; // Gauche, Centre, Droite
    choiceCards.forEach((card, i) => {
      const targetX = positions[i] * distProgress;
      const targetRotate = (i - 1) * 10 * distProgress; // Légère rotation en éventail

      // Si la carte n'est pas encore révélée, on applique le mouvement du scroll
      if (!card.classList.contains("revealed")) {
        card.style.transform = `translateX(${targetX}px) rotateY(0deg) rotateZ(${targetRotate}deg) scale(${1 + distProgress * 0.1})`;
      }
    });
  }
});

// Fonction déclenchée au clic
function selectCard(element) {
  // On ne permet le clic que si on a assez scrollé
  const scrollY = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollY / maxScroll < 0.7) return;

  // Animation de sélection
  const allChoices = document.querySelectorAll(".card.choice");
  allChoices.forEach((c) => {
    c.style.opacity = "0.2";
    c.style.pointerEvents = "none"; // Désactive les autres clics
  });

  element.style.opacity = "1";
  element.classList.add("revealed");
  element.innerHTML = "ACE"; // Contenu révélé
  document.getElementById("instruction").innerText = "DESTIN RÉVÉLÉ";
}
