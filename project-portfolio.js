      let currentLang = localStorage.getItem("preferredLang") || "fr";

      const translations = {
        fr: {
          back: "Retour au portfolio",
          projectLabel: "PROJET #03",
          heroDesc:
            "Portfolio interactif avec animations avancées, terminal intégré et jeu Snake, hébergé sur GitHub Pages.",
          metaType: "Type",
          metaYear: "Année",
          metaTech: "Technologies",
          titleOverview: "Vue d'ensemble",
          overviewP1:
            "Ce portfolio web est un projet personnel conçu pour présenter mes compétences en développement frontend de manière interactive et engageante. L'objectif était de créer une expérience utilisateur unique qui va au-delà d'un portfolio traditionnel, en intégrant des éléments ludiques et techniques démontrant ma maîtrise du JavaScript.",
          overviewP2:
            "Le site est entièrement responsive, performant et hébergé gratuitement sur GitHub Pages, démontrant également ma compétence en déploiement et gestion de projets web.",
          titleFeatures: "Fonctionnalités interactives",
          feat1Title: "🎯 Curseur personnalisé",
          feat1Desc:
            "Curseur custom avec effet de suivi fluide et particules génératives qui réagissent au mouvement de la souris.",
          feat2Title: "💻 Terminal interactif",
          feat2Desc:
            "Terminal fonctionnel avec commandes système, historique de navigation, auto-complétion et easter eggs cachés.",
          feat3Title: "🐍 Jeu Snake",
          feat3Desc:
            "Jeu Snake classique jouable directement dans le navigateur avec score et difficulté progressive.",
          feat4Title: "🟢 Effet Matrix",
          feat4Desc:
            "Animation Matrix plein écran avec code en cascade, activable via le terminal.",
          feat5Title: "🌍 Bilingue FR/EN",
          feat5Desc:
            "Système de traduction complet avec sauvegarde de préférence dans localStorage.",
          feat6Title: "📱 Responsive",
          feat6Desc:
            "Design adaptatif optimisé pour mobile, tablette et desktop avec animations fluides.",
          titleChallenges: "Défis techniques relevés",
          challenge1:
            "Animations performantes avec requestAnimationFrame pour maintenir 60 FPS",
          challenge2:
            "Gestion d'état complexe pour le jeu Snake sans framework",
          challenge3:
            "Système de particules optimisé avec limitation automatique",
          challenge4:
            "Terminal avec parsing de commandes et gestion d'historique",
          challenge5:
            "Intégration API externe pour afficher l'adresse IP et géolocalisation",
          challenge6:
            "Système i18n (internationalisation) custom sans librairie",
          challenge7: 'Design moderne évitant les clichés "AI-generated"',
          titleArchi: "Architecture et organisation",
          archiIntro:
            "Le code est structuré de manière modulaire pour faciliter la maintenance :",
          archi1:
            "Variables CSS pour thématisation cohérente et facilité de modification",
          archi2: "JavaScript organisé en sections clairement commentées",
          archi3:
            "Séparation des responsabilités : animations, terminal, jeux, traductions",
          archi4: "Pas de dépendances externes - JavaScript vanilla uniquement",
          archi5: "Code optimisé pour un chargement rapide (< 100KB total)",
          titleTerminal: "Commandes du terminal",
          terminalIntro: "Le terminal inclut plusieurs commandes utiles :",
          cmd1: "help - Liste toutes les commandes disponibles",
          cmd2: "about - Informations personnelles",
          cmd3: "skills - Compétences techniques",
          cmd4: "projects - Liste des projets",
          cmd5: "whatismyip - Affiche IP, localisation et FAI",
          cmd6: "date - Date et heure localisées",
          cmd7: "snake - Lance le jeu Snake",
          cmd8: "matrix - Active l'effet Matrix",
          cmd9: "clear - Efface le terminal",
          titlePerf: "Performances et optimisation",
          perfIntro:
            "Une attention particulière a été portée aux performances :",
          perf1: "Lazy loading des animations pour réduire l'impact initial",
          perf2:
            "Debouncing des événements de souris pour éviter les calculs inutiles",
          perf3: "Limitation du nombre de particules actives (max 20)",
          perf4: "CSS transforms pour les animations hardware-accelerated",
          perf5: "Minification et optimisation du code pour la production",
          perf6: "Score Lighthouse: 95+ en performance sur mobile",
          titleLearnings: "Apprentissages clés",
          learningsIntro:
            "Ce projet m'a permis d'approfondir mes connaissances en :",
          learning1:
            "Animation JavaScript performante et optimisation rendering",
          learning2: "Design d'interface utilisateur moderne et minimaliste",
          learning3: "Développement de jeux en JavaScript vanilla",
          learning4: "Internationalisation et gestion d'état global",
          learning5: "Intégration d'API externes et gestion d'erreurs async",
          learning6: "Déploiement continu avec GitHub Pages",
          linkGitHub: "Voir sur GitHub",
          linkBack: "Retour aux projets",
          footer: "© 2024 Artleboss2 — Tous droits réservés",
        },
        en: {
          back: "Back to portfolio",
          projectLabel: "PROJECT #03",
          heroDesc:
            "Interactive portfolio with advanced animations, integrated terminal and Snake game, hosted on GitHub Pages.",
          metaType: "Type",
          metaYear: "Year",
          metaTech: "Technologies",
          titleOverview: "Overview",
          overviewP1:
            "This web portfolio is a personal project designed to showcase my frontend development skills in an interactive and engaging way. The goal was to create a unique user experience that goes beyond a traditional portfolio, by integrating playful and technical elements demonstrating my mastery of JavaScript.",
          overviewP2:
            "The site is fully responsive, performant and hosted for free on GitHub Pages, also demonstrating my expertise in deployment and web project management.",
          titleFeatures: "Interactive Features",
          feat1Title: "🎯 Custom Cursor",
          feat1Desc:
            "Custom cursor with smooth tracking effect and generative particles that react to mouse movement.",
          feat2Title: "💻 Interactive Terminal",
          feat2Desc:
            "Functional terminal with system commands, navigation history, auto-completion and hidden easter eggs.",
          feat3Title: "🐍 Snake Game",
          feat3Desc:
            "Classic Snake game playable directly in the browser with score and progressive difficulty.",
          feat4Title: "🟢 Matrix Effect",
          feat4Desc:
            "Full-screen Matrix animation with cascading code, activable via the terminal.",
          feat5Title: "🌍 Bilingual FR/EN",
          feat5Desc:
            "Complete translation system with preference saving in localStorage.",
          feat6Title: "📱 Responsive",
          feat6Desc:
            "Adaptive design optimized for mobile, tablet and desktop with smooth animations.",
          titleChallenges: "Technical Challenges",
          challenge1:
            "Performant animations with requestAnimationFrame to maintain 60 FPS",
          challenge2:
            "Complex state management for the Snake game without a framework",
          challenge3: "Optimized particle system with automatic limitation",
          challenge4: "Terminal with command parsing and history management",
          challenge5:
            "External API integration to display IP address and geolocation",
          challenge6:
            "Custom i18n (internationalization) system without a library",
          challenge7: 'Modern design avoiding "AI-generated" clichés',
          titleArchi: "Architecture and Organization",
          archiIntro:
            "The code is structured in a modular way to facilitate maintenance:",
          archi1: "CSS variables for consistent theming and easy modification",
          archi2: "JavaScript organized in clearly commented sections",
          archi3:
            "Separation of concerns: animations, terminal, games, translations",
          archi4: "No external dependencies - vanilla JavaScript only",
          archi5: "Code optimized for fast loading (< 100KB total)",
          titleTerminal: "Terminal Commands",
          terminalIntro: "The terminal includes several useful commands:",
          cmd1: "help - Lists all available commands",
          cmd2: "about - Personal information",
          cmd3: "skills - Technical skills",
          cmd4: "projects - Project list",
          cmd5: "whatismyip - Displays IP, location and ISP",
          cmd6: "date - Localized date and time",
          cmd7: "snake - Launches the Snake game",
          cmd8: "matrix - Activates the Matrix effect",
          cmd9: "clear - Clears the terminal",
          titlePerf: "Performance and Optimization",
          perfIntro: "Particular attention was paid to performance:",
          perf1: "Lazy loading of animations to reduce initial impact",
          perf2: "Mouse event debouncing to avoid unnecessary calculations",
          perf3: "Limitation of active particles (max 20)",
          perf4: "CSS transforms for hardware-accelerated animations",
          perf5: "Minification and code optimization for production",
          perf6: "Lighthouse Score: 95+ in mobile performance",
          titleLearnings: "Key Learnings",
          learningsIntro: "This project allowed me to deepen my knowledge in:",
          learning1:
            "Performant JavaScript animation and rendering optimization",
          learning2: "Modern and minimalist user interface design",
          learning3: "Game development in vanilla JavaScript",
          learning4: "Internationalization and global state management",
          learning5: "External API integration and async error handling",
          learning6: "Continuous deployment with GitHub Pages",
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
