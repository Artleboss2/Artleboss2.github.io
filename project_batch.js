      let currentLang = localStorage.getItem("preferredLang") || "fr";

      const translations = {
        fr: {
          back: "Retour au portfolio",
          projectLabel: "PROJET #02",
          heroDesc:
            "Outil multifonction en ligne de commande pour l'automatisation de tâches système Windows avec interface intuitive.",
          metaType: "Type",
          metaYear: "Année",
          metaTech: "Technologies",
          titleOverview: "Vue d'ensemble",
          overviewP1:
            "Batch Multitool est une suite d'outils en ligne de commande conçue pour simplifier et automatiser les tâches courantes d'administration système Windows. Le projet combine la puissance des scripts Batch avec une interface utilisateur accessible, permettant même aux utilisateurs novices d'effectuer des opérations système complexes.",
          overviewP2:
            "L'outil a été développé avec un accent sur la sécurité, la fiabilité et la facilité d'utilisation, tout en offrant des fonctionnalités avancées pour les utilisateurs expérimentés.",
          titleFeatures: "Fonctionnalités principales",
          feat1Title: "🔧 Nettoyage système",
          feat1Desc:
            "Suppression automatique des fichiers temporaires, cache et données inutiles avec options de nettoyage personnalisables.",
          feat2Title: "📊 Diagnostics",
          feat2Desc:
            "Analyse complète du système avec rapports détaillés sur l'utilisation du disque, RAM, CPU et réseau.",
          feat3Title: "⚡ Optimisation",
          feat3Desc:
            "Scripts d'optimisation pour améliorer les performances Windows, désactiver les services inutiles et gérer le démarrage.",
          feat4Title: "🔒 Sécurité",
          feat4Desc:
            "Vérification des permissions, scan de sécurité basique et gestion des pare-feu avec logs détaillés.",
          feat5Title: "📁 Gestion fichiers",
          feat5Desc:
            "Opérations batch sur fichiers : renommage en masse, organisation automatique, recherche avancée.",
          feat6Title: "🌐 Réseau",
          feat6Desc:
            "Outils de diagnostic réseau, test de connectivité, affichage configuration IP et gestion Wi-Fi.",
          titleArchi: "Architecture",
          archiDesc:
            "Le multitool est structuré en modules indépendants, chacun responsable d'un domaine spécifique de l'administration système :",
          titleChallenges: "Défis techniques",
          challenge1:
            "Gestion des privilèges administrateur avec détection automatique et élévation",
          challenge2:
            "Compatibilité entre différentes versions de Windows (7, 8, 10, 11)",
          challenge3:
            "Validation des entrées utilisateur pour éviter les erreurs système critiques",
          challenge4:
            "Logging complet des opérations pour faciliter le débogage",
          challenge5: "Interface en couleur dans CMD sans dépendances externes",
          challenge6:
            "Gestion d'erreurs robuste avec rollback automatique en cas de problème",
          titleUseCases: "Cas d'usage",
          useCasesIntro: "Le Batch Multitool est particulièrement utile pour :",
          useCase1:
            "Maintenance régulière de systèmes Windows personnels ou professionnels",
          useCase2:
            "Support technique à distance avec génération de rapports automatiques",
          useCase3: "Préparation de machines avant déploiement ou vente",
          useCase4: "Automatisation de tâches répétitives d'administration",
          useCase5:
            "Formation aux concepts de scripting et d'administration système",
          titleLearnings: "Apprentissages clés",
          learningsIntro:
            "Ce projet m'a permis de développer une expertise approfondie en :",
          learning1:
            "Scripting Batch avancé et bonnes pratiques de développement CLI",
          learning2:
            "Architecture modulaire et maintenable pour les scripts shell",
          learning3: "Sécurité et validation des opérations système critiques",
          learning4:
            "Gestion d'erreurs et logging dans les environnements de production",
          learning5: "Design d'interfaces utilisateur textuelles intuitives",
          linkGitHub: "Voir sur GitHub",
          linkBack: "Retour aux projets",
          footer: "© 2024 Artleboss2 — Tous droits réservés",
        },
        en: {
          back: "Back to portfolio",
          projectLabel: "PROJECT #02",
          heroDesc:
            "Multi-function command-line tool for automating Windows system tasks with an intuitive interface.",
          metaType: "Type",
          metaYear: "Year",
          metaTech: "Technologies",
          titleOverview: "Overview",
          overviewP1:
            "Batch Multitool is a suite of command-line tools designed to simplify and automate common Windows system administration tasks. The project combines the power of Batch scripts with an accessible user interface, allowing even novice users to perform complex system operations.",
          overviewP2:
            "The tool was developed with an emphasis on security, reliability and ease of use, while offering advanced features for experienced users.",
          titleFeatures: "Main Features",
          feat1Title: "🔧 System Cleaning",
          feat1Desc:
            "Automatic removal of temporary files, cache and unnecessary data with customizable cleaning options.",
          feat2Title: "📊 Diagnostics",
          feat2Desc:
            "Complete system analysis with detailed reports on disk, RAM, CPU and network usage.",
          feat3Title: "⚡ Optimization",
          feat3Desc:
            "Optimization scripts to improve Windows performance, disable unnecessary services and manage startup.",
          feat4Title: "🔒 Security",
          feat4Desc:
            "Permission checks, basic security scan and firewall management with detailed logs.",
          feat5Title: "📁 File Management",
          feat5Desc:
            "Batch file operations: mass renaming, automatic organization, advanced search.",
          feat6Title: "🌐 Network",
          feat6Desc:
            "Network diagnostic tools, connectivity testing, IP configuration display and Wi-Fi management.",
          titleArchi: "Architecture",
          archiDesc:
            "The multitool is structured in independent modules, each responsible for a specific area of system administration:",
          titleChallenges: "Technical Challenges",
          challenge1:
            "Administrator privilege management with automatic detection and elevation",
          challenge2:
            "Compatibility across different Windows versions (7, 8, 10, 11)",
          challenge3: "User input validation to prevent critical system errors",
          challenge4: "Complete operation logging to facilitate debugging",
          challenge5: "Color interface in CMD without external dependencies",
          challenge6:
            "Robust error handling with automatic rollback in case of issues",
          titleUseCases: "Use Cases",
          useCasesIntro: "The Batch Multitool is particularly useful for:",
          useCase1:
            "Regular maintenance of personal or professional Windows systems",
          useCase2: "Remote technical support with automatic report generation",
          useCase3: "Machine preparation before deployment or sale",
          useCase4: "Automation of repetitive administration tasks",
          useCase5: "Training in scripting and system administration concepts",
          titleLearnings: "Key Learnings",
          learningsIntro:
            "This project allowed me to develop in-depth expertise in:",
          learning1:
            "Advanced Batch scripting and CLI development best practices",
          learning2: "Modular and maintainable architecture for shell scripts",
          learning3: "Security and validation of critical system operations",
          learning4: "Error handling and logging in production environments",
          learning5: "Design of intuitive text-based user interfaces",
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
