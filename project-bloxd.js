      let currentLang = localStorage.getItem("preferredLang") || "fr";

      const translations = {
        fr: {
          back: "Retour au portfolio",
          projectLabel: "PROJET #01",
          heroDesc:
            "Un texture pack personnalisé pour Bloxd.io permettant une customisation complète de l'apparence du jeu via CSS et WebGL.",
          metaType: "Type",
          metaYear: "Année",
          metaTech: "Technologies",
          titleOverview: "Vue d'ensemble",
          overviewP1:
            "Le Bloxd Texture Pack est un projet de modification visuelle pour le jeu Bloxd.io, offrant aux joueurs la possibilité de personnaliser entièrement l'apparence du jeu. Ce pack utilise des techniques CSS avancées et WebGL pour modifier les textures, la skybox, les modèles 3D et l'interface utilisateur.",
          overviewP2:
            "L'objectif principal était de créer un système flexible permettant aux joueurs d'exprimer leur créativité tout en maintenant les performances de jeu optimales.",
          titleFeatures: "Fonctionnalités principales",
          feat1Title: "🎨 Textures personnalisées",
          feat1Desc:
            "Modification complète des textures de blocs avec support de résolutions multiples et filtres d'amélioration visuelle.",
          feat2Title: "🌌 Skybox dynamique",
          feat2Desc:
            "Remplacement de la skybox par défaut avec des environnements personnalisés et des effets atmosphériques.",
          feat3Title: "🎮 Interface utilisateur",
          feat3Desc:
            "Customisation CSS avancée de l'interface avec thèmes prédéfinis et éditeur visuel en temps réel.",
          feat4Title: "📦 Modèles 3D",
          feat4Desc:
            "Support des modèles GLB personnalisés pour les objets et entités du jeu avec optimisation automatique.",
          titleChallenges: "Défis techniques",
          challenge1:
            "Optimisation des performances pour maintenir 60 FPS malgré les textures haute résolution",
          challenge2:
            "Compatibilité cross-browser avec différents moteurs de rendu WebGL",
          challenge3:
            "Système de cache intelligent pour réduire les temps de chargement",
          challenge4:
            "Gestion mémoire efficace pour éviter les fuites sur les sessions longues",
          challenge5:
            "API d'injection CSS qui ne casse pas les mises à jour du jeu",
          titleArchi: "Architecture technique",
          archiDesc:
            "Le texture pack utilise une architecture modulaire permettant aux utilisateurs de sélectionner uniquement les composants qu'ils souhaitent modifier :",
          titleImpact: "Impact et résultats",
          impactDesc:
            "Le texture pack a été bien reçu par la communauté Bloxd.io, avec des retours positifs sur la flexibilité et la facilité d'utilisation. Le projet démontre une compréhension approfondie du rendu WebGL et de l'optimisation des performances dans les applications web gourmandes en ressources.",
          linkGitHub: "Voir sur GitHub",
          linkBack: "Retour aux projets",
          footer: "© 2024 Artleboss2 — Tous droits réservés",
        },
        en: {
          back: "Back to portfolio",
          projectLabel: "PROJECT #01",
          heroDesc:
            "A custom texture pack for Bloxd.io allowing complete customization of the game's appearance via CSS and WebGL.",
          metaType: "Type",
          metaYear: "Year",
          metaTech: "Technologies",
          titleOverview: "Overview",
          overviewP1:
            "The Bloxd Texture Pack is a visual modification project for the game Bloxd.io, offering players the ability to fully customize the game's appearance. This pack uses advanced CSS techniques and WebGL to modify textures, the skybox, 3D models and the user interface.",
          overviewP2:
            "The main goal was to create a flexible system allowing players to express their creativity while maintaining optimal game performance.",
          titleFeatures: "Main Features",
          feat1Title: "🎨 Custom Textures",
          feat1Desc:
            "Complete modification of block textures with support for multiple resolutions and visual enhancement filters.",
          feat2Title: "🌌 Dynamic Skybox",
          feat2Desc:
            "Replacement of the default skybox with custom environments and atmospheric effects.",
          feat3Title: "🎮 User Interface",
          feat3Desc:
            "Advanced CSS customization of the interface with preset themes and a real-time visual editor.",
          feat4Title: "📦 3D Models",
          feat4Desc:
            "Support for custom GLB models for game objects and entities with automatic optimization.",
          titleChallenges: "Technical Challenges",
          challenge1:
            "Performance optimization to maintain 60 FPS despite high-resolution textures",
          challenge2:
            "Cross-browser compatibility with different WebGL rendering engines",
          challenge3: "Smart caching system to reduce loading times",
          challenge4:
            "Efficient memory management to avoid leaks during long sessions",
          challenge5: "CSS injection API that doesn't break game updates",
          titleArchi: "Technical Architecture",
          archiDesc:
            "The texture pack uses a modular architecture allowing users to select only the components they want to modify:",
          titleImpact: "Impact and Results",
          impactDesc:
            "The texture pack was well received by the Bloxd.io community, with positive feedback on flexibility and ease of use. The project demonstrates an in-depth understanding of WebGL rendering and performance optimization in resource-intensive web applications.",
          linkGitHub: "View on GitHub",
          linkBack: "Back to projects",
          footer: "© 2024 Artleboss2 — All rights reserved",
        },
      };

      function toggleLanguage() {
        currentLang = currentLang === "fr" ? "en" : "fr";
        localStorage.setItem("preferredLang", currentLang);
        document.getElementById("langIcon").textContent =
          currentLang === "fr" ? "EN" : "FR";
        updateContent();
      }

      function updateContent() {
        document.querySelectorAll("[data-i18n]").forEach((el) => {
          const key = el.getAttribute("data-i18n");
          if (translations[currentLang][key] !== undefined) {
            el.textContent = translations[currentLang][key];
          }
        });
      }

      
      document.getElementById("langIcon").textContent =
        currentLang === "fr" ? "EN" : "FR";
      updateContent();

      
      const cursor = document.querySelector(".cursor");
      const follower = document.querySelector(".cursor-follower");
      let mouseX = 0,
        mouseY = 0,
        followerX = 0,
        followerY = 0;

      document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
      });

      function animateFollower() {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        follower.style.transform = `translate(${followerX - 20}px, ${followerY - 20}px)`;
        requestAnimationFrame(animateFollower);
      }
      animateFollower();

      document
        .querySelectorAll(
          "a, .feature-card, .tech-tag, .project-link, .lang-switcher",
        )
        .forEach((el) => {
          el.addEventListener("mouseenter", () => {
            follower.classList.add("hover");
            cursor.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px) scale(1.5)`;
          });
          el.addEventListener("mouseleave", () => {
            follower.classList.remove("hover");
            cursor.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px) scale(1)`;
          });
        });
