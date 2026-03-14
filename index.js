let currentLang = "fr";

      const translations = {
        fr: {
          nav: {
            projects: "Projets",
            repos: "Repos",
            skills: "Compétences",
            resources: "Ressources",
            contact: "Contact",
          },
          hero: {
            title: "Développeur passionné par le gaming et la création",
            description:
              "Je développe des applications, texture packs et outils créatifs pour la communauté gaming. Spécialisé dans la customisation de jeux, les applications mobiles et l'automatisation système.",
            cta: "Découvrir mes projets",
          },
          projects: {
            title: "Projets sélectionnés",
            project1: {
              title: "Zynit — To-Do List App",
              description:
                "Application mobile de gestion de tâches avec interface moderne et intuitive. Système de catégorisation, rappels et synchronisation multi-plateforme. Développée avec des standards juridiques complets (CLUF) et conformité aux lois canadiennes sur la protection des données.",
            },
            project2: {
              title: "Bloxd Texture Pack",
              description:
                "Texture pack personnalisé pour Bloxd.io permettant de modifier l'apparence des blocs, skybox, items et modèles 3D. Système de customisation CSS avancé pour personnaliser l'interface du jeu.",
            },
            project3: {
              title: "Batch Multitool",
              description:
                "Outil multifonction développé en Batch pour automatiser des tâches basiques système. Interface en ligne de commande intuitive pour faciliter l'administration Windows.",
            },
            project4: {
              title: "Portfolio GitHub",
              description:
                "Portfolio professionnel interactif avec animations réactives au curseur, particules génératives et design moderne. Terminal interactif intégré et jeu Snake. Optimisé pour les performances et l'expérience utilisateur.",
            },
            project5: {
              title: "St-Mars E L Inc — Refonte Web",
              description:
                "Refonte numérique premium pour une entreprise familiale de plomberie et chauffage à Montréal, fondée en 1937. Design «Luxe Industriel» avec animations de scroll inversé, effets parallaxe et identité visuelle modernisée sur 4 générations.",
            },
            project6: {
              title: "NFT Generator",
              description:
                "Générateur d'NFT interactif permettant de créer et visualiser des actifs numériques uniques directement dans le navigateur. Interface web moderne avec génération algorithmique de combinaisons d'attributs et prévisualisation en temps réel.",
            },
            project7: {
              title: "Phone Simulation",
              description:
                "Simulation interactive d'interface smartphone dans le navigateur. Reproduction fidèle des interactions tactiles, notifications, applications et gestes courants d'un téléphone moderne. Expérience immersive entièrement construite en technologies web.",
            },
            project8: {
              title: "UI Components Library",
              description:
                "Collection de composants et maquettes d'interfaces utilisateur modernes. Ensemble de designs réutilisables incluant boutons, cartes, modales et layouts avancés. Vitrine de compétences en design system et cohérence visuelle.",
            },
            project9: {
              title: "Music Page",
              description:
                "Page musicale interactive avec lecteur audio personnalisé, gestion de licences et notices légales intégrées. Interface immersive dédiée à la découverte et l'écoute de créations musicales, avec documentation complète des droits d'auteur.",
            },
          },
          repos: {
            title: "Tous mes repositories",
            filter: { all: "Tous", web: "Web", tools: "Outils", resources: "Ressources", contrib: "Contributions" },
            badge: { own: "Personnel", fork: "Fork" },
            r1: "Portfolio interactif avec terminal, Snake, curseur custom et particules génératives.",
            r2: "Refonte web «Luxe Industriel» pour St-Mars E L Inc, plomberie Montréal depuis 1937.",
            r3: "Version alternative du site de plomberie, explorations de design différentes.",
            r4: "Application mobile de to-do list avec conformité CLUF et lois canadiennes.",
            r5: "Suivi et gestion de bibliothèque de jeux vidéo en JavaScript.",
            r6: "Texture pack complet pour Bloxd.io — blocs, skybox, items et modèles 3D custom.",
            r7: "Outil multifonction en Batch pour automatiser les tâches d'administration Windows.",
            r8: "Animation de démarrage stylisée pour le terminal PowerShell.",
            r9: "Fork de Log234/Schematic-Converter — outil de conversion de fichiers schématiques.",
            r10: "Script personnalisé pour TradingView — analyse et indicateurs techniques.",
            r11: "Bot automatisé pour maintenir et optimiser la structure des repositories GitHub.",
            r12: "Liste curatée d'outils, ressources et modèles IA — régulièrement mis à jour.",
            r13: "Techniques et ressources pour le prompt engineering — LLMs, templates, exemples.",
            r14: "Grand tutoriel pour tout ce que les gens ne savent pas comment faire.",
            r15: "Fichier .md complet pour la fonctionnalité de skills de Claude AI.",
            r16: "Challenge de création de fichiers Markdown — documentation et formatage avancé.",
            r17: "Fichiers de configuration du profil GitHub — README et présentation.",
            r18: "Fork de public-apis/public-apis — liste collective de +1400 APIs gratuites. MIT.",
            r19: "Fork de horsicq/XTranslation — contribution à la localisation française (dict_fr.po).",
          },
          skills: {
            title: "Expertise technique",
            frontend: { title: "Frontend & Design", item3: "Animations Web" },
            gamedev: { title: "Game Development", item2: "Modélisation 3D (GLB)", item4: "Customisation de jeux" },
            mobile: { title: "Mobile Development", item2: "Applications Cross-Platform", item3: "UI/UX Mobile", item4: "Architecture d'applications", item5: "Gestion de données" },
            automation: { title: "Système & Automation", item3: "Automatisation de tâches", item4: "Administration système" },
            tools: { title: "Outils & Technologies", item3: "Édition d'images", item4: "Gestion de fichiers", item6: "Documentation juridique" },
          },
          footer: { copyright: "© 2026 — Conçu et développé avec passion" },
          terminal: {
            welcome: "Bienvenue dans le terminal interactif!",
            helpPrompt: "Tapez 'help' pour voir les commandes disponibles.",
            helpTitle: "Commandes disponibles:",
            help: "• help - Affiche cette aide",
            about: "• about - À propos de moi",
            skills: "• skills - Liste mes compétences",
            projects: "• projects - Liste mes projets",
            repos: "• repos - Liste tous mes repositories",
            contact: "• contact - Informations de contact",
            github: "• github - Ouvre mon GitHub",
            clear: "• clear - Efface le terminal",
            date: "• date - Affiche la date actuelle",
            whoami: "• whoami - Qui suis-je?",
            social: "• social - Liens vers mes réseaux sociaux",
            matrix: "• matrix - Active l'effet Matrix 🟢",
            snake: "• snake - Lance le jeu Snake 🐍",
            whatismyip: "• whatismyip - Affiche votre adresse IP",
            snakeControls: "Utilisez les flèches ← ↑ → ↓ pour jouer",
            snakeClose: "Fermer (ESC)",
            snakeScore: "Score:",
            gameOver: "Game Over!",
            finalScore: "Score final:",
          },
        },
        en: {
          nav: {
            projects: "Projects",
            repos: "Repos",
            skills: "Skills",
            resources: "Resources",
            contact: "Contact",
          },
          hero: {
            title: "Developer passionate about gaming and creation",
            description:
              "I develop applications, texture packs and creative tools for the gaming community. Specialized in game customization, mobile applications and system automation.",
            cta: "Discover my projects",
          },
          projects: {
            title: "Selected Projects",
            project1: {
              title: "Zynit — To-Do List App",
              description:
                "Mobile task management application with modern and intuitive interface. Categorization system, reminders and multi-platform synchronization. Developed with complete legal standards (EULA) and compliance with Canadian data protection laws.",
            },
            project2: {
              title: "Bloxd Texture Pack",
              description:
                "Custom texture pack for Bloxd.io allowing to modify the appearance of blocks, skybox, items and 3D models. Advanced CSS customization system to personalize the game interface.",
            },
            project3: {
              title: "Batch Multitool",
              description:
                "Multifunction tool developed in Batch to automate basic system tasks. Intuitive command-line interface to facilitate Windows administration.",
            },
            project4: {
              title: "GitHub Portfolio",
              description:
                "Interactive professional portfolio with cursor-reactive animations, generative particles and modern design. Integrated interactive terminal and Snake game. Optimized for performance and user experience.",
            },
            project5: {
              title: "St-Mars E L Inc — Web Redesign",
              description:
                'Premium digital redesign for a family-owned plumbing and heating company in Montreal, founded in 1937. "Luxury Industrial" design with reverse scroll animations, parallax effects and modernized visual identity spanning 4 generations.',
            },
            project6: {
              title: "NFT Generator",
              description:
                "Interactive NFT generator allowing you to create and visualize unique digital assets directly in the browser. Modern web interface with algorithmic generation of attribute combinations and real-time preview.",
            },
            project7: {
              title: "Phone Simulation",
              description:
                "Interactive smartphone interface simulation in the browser. Faithful reproduction of touch interactions, notifications, apps and common gestures of a modern phone. Fully immersive experience built with web technologies.",
            },
            project8: {
              title: "UI Components Library",
              description:
                "Collection of modern user interface components and mockups. Set of reusable designs including buttons, cards, modals and advanced layouts. Showcase of design system skills and visual consistency.",
            },
            project9: {
              title: "Music Page",
              description:
                "Interactive music page with custom audio player, license management and integrated legal notices. Immersive interface dedicated to discovering and listening to musical creations, with complete copyright documentation.",
            },
          },
          repos: {
            title: "All my repositories",
            filter: { all: "All", web: "Web", tools: "Tools", resources: "Resources", contrib: "Contributions" },
            badge: { own: "Personal", fork: "Fork" },
            r1: "Interactive portfolio with terminal, Snake game, custom cursor and generative particles.",
            r2: "'Luxury Industrial' web redesign for St-Mars E L Inc, Montreal plumbing since 1937.",
            r3: "Alternative version of the plumbing site, exploring different design directions.",
            r4: "Mobile to-do list app with EULA compliance and Canadian data laws.",
            r5: "Video game library tracker and manager built in JavaScript.",
            r6: "Full texture pack for Bloxd.io — custom blocks, skybox, items and 3D models.",
            r7: "Multitool in Batch to automate Windows system administration tasks.",
            r8: "Stylized startup animation for the PowerShell terminal.",
            r9: "Fork of Log234/Schematic-Converter — schematic file conversion tool.",
            r10: "Custom script for TradingView — technical analysis and indicators.",
            r11: "Automated bot to maintain and optimize GitHub repository structure.",
            r12: "Curated list of AI tools, resources and models — regularly updated.",
            r13: "Prompt engineering techniques and resources — LLMs, templates, examples.",
            r14: "Big tutorial covering things most people don't know how to do.",
            r15: "Complete .md file for Claude AI's skills functionality.",
            r16: "Markdown file creation challenge — documentation and advanced formatting.",
            r17: "GitHub profile config files — README and presentation.",
            r18: "Fork of public-apis/public-apis — collective list of 1400+ free APIs. MIT.",
            r19: "Fork of horsicq/XTranslation — French localization contribution (dict_fr.po).",
          },
          skills: {
            title: "Technical Expertise",
            frontend: { title: "Frontend & Design", item3: "Web Animations" },
            gamedev: { title: "Game Development", item2: "3D Modeling (GLB)", item4: "Game Customization" },
            mobile: { title: "Mobile Development", item2: "Cross-Platform Apps", item3: "Mobile UI/UX", item4: "App Architecture", item5: "Data Management" },
            automation: { title: "System & Automation", item3: "Task Automation", item4: "System Administration" },
            tools: { title: "Tools & Technologies", item3: "Image Editing", item4: "File Management", item6: "Legal Documentation" },
          },
          footer: { copyright: "© 2026 — Designed and developed with passion" },
          terminal: {
            welcome: "Welcome to the interactive terminal!",
            helpPrompt: "Type 'help' to see available commands.",
            helpTitle: "Available commands:",
            help: "• help - Shows this help",
            about: "• about - About me",
            skills: "• skills - List my skills",
            projects: "• projects - List my projects",
            repos: "• repos - List all my repositories",
            contact: "• contact - Contact information",
            github: "• github - Open my GitHub",
            clear: "• clear - Clear the terminal",
            date: "• date - Show current date",
            whoami: "• whoami - Who am I?",
            social: "• social - Links to my social networks",
            matrix: "• matrix - Activate Matrix effect 🟢",
            snake: "• snake - Launch Snake game 🐍",
            whatismyip: "• whatismyip - Show your IP address",
            snakeControls: "Use arrow keys ← ↑ → ↓ to play",
            snakeClose: "Close (ESC)",
            snakeScore: "Score:",
            gameOver: "Game Over!",
            finalScore: "Final score:",
          },
        },
      };

      function toggleLanguage() {
        currentLang = currentLang === "fr" ? "en" : "fr";
        document.getElementById("langIcon").textContent = currentLang === "fr" ? "EN" : "FR";
        updateContent();
        localStorage.setItem("preferredLang", currentLang);
      }

      function updateContent() {
        document.querySelectorAll("[data-i18n]").forEach((element) => {
          const key = element.getAttribute("data-i18n");
          const keys = key.split(".");
          let translation = translations[currentLang];
          for (const k of keys) {
            translation = translation[k];
          }
          if (translation) element.textContent = translation;
        });
        updateTerminalLanguage();
      }

      function updateTerminalLanguage() {
        const t = translations[currentLang].terminal;
        document.querySelector(".snake-controls").textContent = t.snakeControls;
        document.querySelector(".snake-close button").textContent = t.snakeClose;
        document.querySelector(".snake-score").innerHTML = `${t.snakeScore} <span id="snakeScore">0</span>`;
      }

      window.addEventListener("DOMContentLoaded", () => {
        const savedLang = localStorage.getItem("preferredLang");
        if (savedLang && savedLang !== currentLang) toggleLanguage();
      });

      // ========== REPO FILTERS ==========
      document.querySelectorAll(".repo-filter").forEach((btn) => {
        btn.addEventListener("click", () => {
          document.querySelectorAll(".repo-filter").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          const filter = btn.getAttribute("data-filter");
          document.querySelectorAll(".repo-card").forEach((card) => {
            if (filter === "all" || card.getAttribute("data-category") === filter) {
              card.classList.remove("hidden");
            } else {
              card.classList.add("hidden");
            }
          });
        });
      });

      // ========== TERMINAL ==========
      const terminal = document.getElementById("terminal");
      const terminalOutput = document.getElementById("terminalOutput");
      const terminalInput = document.getElementById("terminalInput");
      let commandHistory = [];
      let historyIndex = -1;

      const commands = {
        help: {
          execute: () => {
            const t = translations[currentLang].terminal;
            return `<div class="terminal-success">${t.helpTitle}</div><div class="terminal-info">${t.help}<br>${t.about}<br>${t.skills}<br>${t.projects}<br>${t.repos}<br>${t.contact}<br>${t.github}<br>${t.clear}<br>${t.date}<br>${t.whoami}<br>${t.social}<br>${t.whatismyip}<br>${t.matrix}<br>${t.snake}</div>`;
          },
        },
        about: {
          execute: () =>
            `<div class="terminal-success">À propos de moi:</div><div class="terminal-info">Développeur passionné par le gaming et la création.<br>Applications mobiles, texture packs, outils d'automatisation,<br>redesigns web et projets créatifs.<br><br>Spécialités: Mobile Dev, Web Dev, Game Modding, Automation</div>`,
        },
        skills: {
          execute: () =>
            `<div class="terminal-success">Compétences principales:</div><div class="terminal-info">Frontend: HTML5, CSS3, JavaScript, React Native<br>Mobile: Cross-platform Apps, UI/UX Design<br>Game Dev: Texture Packs, WebGL, 3D Modeling<br>Automation: Batch, Shell Scripting<br>Tools: Git, VS Code, GitHub Pages</div>`,
        },
        projects: {
          execute: () =>
            `<div class="terminal-success">Projets sélectionnés (9):</div><div class="terminal-info">01. Zynit - Application mobile de to-do list<br>02. Bloxd Texture Pack - Customisation CSS pour Bloxd.io<br>03. Batch Multitool - Automatisation Windows<br>04. Portfolio GitHub - Ce site!<br>05. St-Mars E L Inc - Refonte web plomberie Montréal<br>06. NFT Generator - Générateur d'actifs numériques<br>07. Phone Simulation - Simulation d'interface mobile<br>08. UI Components - Bibliothèque de composants UI<br>09. Music Page - Lecteur musical interactif</div>`,
        },
        repos: {
          execute: () =>
            `<div class="terminal-success">Tous les repositories (19 publics):</div><div class="terminal-info">🌐 WEB: Artleboss2.github.io · Plomberie · Zynit · Game-Tracker · Bloxd-Texture-Pack<br>⬡ OUTILS: Batch-Multitool · Powershell-Starting-Animation · Schematic-Converter · TradingView-Script · Perfect-Repository-Bot<br>◇ RESSOURCES: awesome-ai · awesome-prompt-engineering · Everything-Explained · CLAUDE-SKILLS · .Md-challenge · Artleboss2 (profile)<br>⟡ CONTRIBUTIONS: public-apis · XTranslation<br><br>Visitez github.com/Artleboss2 pour tous les repos.</div>`,
        },
        contact: {
          execute: () =>
            `<div class="terminal-success">Contact:</div><div class="terminal-info">GitHub: github.com/Artleboss2<br>Email: contact@artleboss.com<br>Discord: Disponible sur demande<br>LinkedIn: À venir</div>`,
        },
        github: {
          execute: () => {
            window.open("https://github.com/Artleboss2", "_blank");
            return `<div class="terminal-success">Ouverture de GitHub dans un nouvel onglet...</div>`;
          },
        },
        clear: {
          execute: () => { terminalOutput.innerHTML = ""; return ""; },
        },
        date: {
          execute: () => {
            const now = new Date();
            const locale = currentLang === "fr" ? "fr-FR" : "en-US";
            return `<div class="terminal-info">${now.toLocaleString(locale, { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: "short" })}</div>`;
          },
        },
        whoami: {
          execute: () => `<div class="terminal-info">artleboss2 - Développeur & Créateur</div>`,
        },
        social: {
          execute: () =>
            `<div class="terminal-success">Réseaux sociaux:</div><div class="terminal-info">🐙 GitHub: github.com/Artleboss2<br>💼 LinkedIn: À venir<br>💬 Discord: Disponible sur demande<br>📧 Email: contact@artleboss.com</div>`,
        },
        matrix: {
          execute: () => { activateMatrix(); return `<div class="terminal-success">Effet Matrix activé! Il s'arrêtera après 10 secondes ou appuyez sur ESC.</div>`; },
        },
        snake: {
          execute: () => { startSnake(); return `<div class="terminal-success">Lancement du jeu Snake! Utilisez les flèches pour jouer.</div>`; },
        },
        whatismyip: {
          execute: async () => {
            try {
              const r = await fetch("https://api.ipify.org?format=json");
              const d = await r.json();
              const r2 = await fetch(`https://ipapi.co/${d.ip}/json/`);
              const info = await r2.json();
              return `<div class="terminal-success">Votre adresse IP:</div><div class="terminal-info">IP: ${d.ip}<br>Ville: ${info.city || "Inconnue"}<br>Région: ${info.region || "Inconnue"}<br>Pays: ${info.country_name || "Inconnu"}<br>FAI: ${info.org || "Inconnu"}</div>`;
            } catch (e) {
              return `<div class="terminal-error">Erreur lors de la récupération de l'IP.</div>`;
            }
          },
        },
      };

      const easterEggs = {
        hello: "Hello! 👋 Bienvenue sur mon portfolio!",
        hi: "Salut! Comment puis-je vous aider?",
        bonjour: 'Bonjour! Tapez "help" pour voir les commandes.',
        sudo: "Désolé, vous n'avez pas les permissions sudo ici 😄",
        hack: "Accès refusé. Mais j'apprécie la tentative! 🔒",
        ls: "portfolio.html  zynit/  bloxd-texture-pack/  batch-multitool/  plomberie/  nft-generator/  phonesimulation/  ui/  music.html  awesome-ai/  awesome-prompt-engineering/",
        pwd: "/home/artleboss2/portfolio",
        exit: "Vous ne pouvez pas quitter le terminal, mais vous pouvez le fermer! 😉",
        konami: "Code Konami détecté! Mais je n'ai pas encore d'easter egg pour ça... 🎮",
      };

      function toggleTerminal() {
        terminal.classList.toggle("minimized");
        if (!terminal.classList.contains("minimized")) terminalInput.focus();
      }
      function closeTerminal() { terminal.classList.add("hidden"); }
      function addToOutput(content) {
        const line = document.createElement("div");
        line.className = "terminal-line";
        line.innerHTML = content;
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
      }

      function executeCommand(cmd) {
        const trimmedCmd = cmd.trim().toLowerCase();
        if (trimmedCmd) { commandHistory.push(cmd); historyIndex = commandHistory.length; }
        addToOutput(`<span class="terminal-prompt">$</span> <span class="terminal-command">${cmd}</span>`);
        if (!trimmedCmd) return;
        if (easterEggs[trimmedCmd]) { addToOutput(`<div class="terminal-info">${easterEggs[trimmedCmd]}</div>`); return; }
        if (commands[trimmedCmd]) {
          const result = commands[trimmedCmd].execute();
          if (result instanceof Promise) {
            addToOutput(`<div class="terminal-info">⏳ Chargement...</div>`);
            result.then((output) => {
              const lines = terminalOutput.querySelectorAll(".terminal-line");
              lines[lines.length - 1].remove();
              if (output) addToOutput(output);
            });
          } else if (result) {
            addToOutput(result);
          }
        } else {
          addToOutput(`<div class="terminal-error">Commande inconnue: "${cmd}". Tapez "help" pour voir les commandes disponibles.</div>`);
        }
      }

      terminalInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { executeCommand(terminalInput.value); terminalInput.value = ""; }
        else if (e.key === "ArrowUp") { e.preventDefault(); if (historyIndex > 0) { historyIndex--; terminalInput.value = commandHistory[historyIndex]; } }
        else if (e.key === "ArrowDown") { e.preventDefault(); if (historyIndex < commandHistory.length - 1) { historyIndex++; terminalInput.value = commandHistory[historyIndex]; } else { historyIndex = commandHistory.length; terminalInput.value = ""; } }
        else if (e.key === "Tab") { e.preventDefault(); const v = terminalInput.value.toLowerCase(); const m = Object.keys(commands).filter((c) => c.startsWith(v)); if (m.length === 1) terminalInput.value = m[0]; }
      });

      function activateMatrix() {
        const canvas = document.createElement("canvas");
        Object.assign(canvas.style, { position: "fixed", top: "0", left: "0", width: "100%", height: "100%", zIndex: "99999", pointerEvents: "none" });
        document.body.appendChild(canvas);
        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const letters = "ARTLEBOSS2•ZYNIT•GITHUB•PORTFOLIO•HTML•CSS•JS•01•10•11•00";
        const fontSize = 14, columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);
        function draw() {
          ctx.fillStyle = "rgba(0,0,0,0.05)";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = "#4ade80";
          ctx.font = fontSize + "px JetBrains Mono";
          for (let i = 0; i < drops.length; i++) {
            ctx.fillText(letters[Math.floor(Math.random() * letters.length)], i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
          }
        }
        const interval = setInterval(draw, 33);
        const closeMatrix = (e) => { if (e.key === "Escape") { clearInterval(interval); canvas.remove(); document.removeEventListener("keydown", closeMatrix); } };
        document.addEventListener("keydown", closeMatrix);
        setTimeout(() => { clearInterval(interval); canvas.remove(); document.removeEventListener("keydown", closeMatrix); }, 10000);
      }

      // ========== SNAKE ==========
      const snakeGameContainer = document.getElementById("snakeGame");
      const snakeCanvas = document.getElementById("snakeCanvas");
      let snakeScoreDisplay = document.getElementById("snakeScore");
      const gridSize = 20;
      let snake = [{ x: 10, y: 10 }], food = { x: 15, y: 15 }, direction = { x: 1, y: 0 }, nextDirection = { x: 1, y: 0 };
      let score = 0, gameLoop = null, gameSpeed = 150;

      function startSnake() {
        snake = [{ x: 10, y: 10 }]; food = generateFood(); direction = { x: 1, y: 0 }; nextDirection = { x: 1, y: 0 };
        score = 0; gameSpeed = 150;
        snakeScoreDisplay = document.getElementById("snakeScore");
        if (snakeScoreDisplay) snakeScoreDisplay.textContent = score;
        snakeCanvas.innerHTML = "";
        snakeCanvas.style.gridTemplateColumns = `repeat(${gridSize}, 20px)`;
        snakeCanvas.style.gridTemplateRows = `repeat(${gridSize}, 20px)`;
        for (let i = 0; i < gridSize * gridSize; i++) {
          const cell = document.createElement("div");
          cell.className = "snake-cell";
          cell.dataset.index = i;
          snakeCanvas.appendChild(cell);
        }
        snakeGameContainer.classList.add("active");
        if (gameLoop) clearInterval(gameLoop);
        gameLoop = setInterval(updateSnake, gameSpeed);
        renderSnake();
      }

      function closeSnake() { snakeGameContainer.classList.remove("active"); if (gameLoop) { clearInterval(gameLoop); gameLoop = null; } }
      function generateFood() {
        let f;
        do { f = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) }; }
        while (snake.some((s) => s.x === f.x && s.y === f.y));
        return f;
      }

      function updateSnake() {
        direction = nextDirection;
        const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
        if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) { gameOver(); return; }
        if (snake.some((s) => s.x === head.x && s.y === head.y)) { gameOver(); return; }
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
          score += 10;
          const sd = document.getElementById("snakeScore");
          if (sd) sd.textContent = score;
          food = generateFood();
          if (score % 50 === 0 && gameSpeed > 50) { gameSpeed -= 10; clearInterval(gameLoop); gameLoop = setInterval(updateSnake, gameSpeed); }
        } else { snake.pop(); }
        renderSnake();
      }

      function renderSnake() {
        document.querySelectorAll(".snake-cell").forEach((c) => c.classList.remove("snake", "food"));
        snake.forEach((s) => { const c = document.querySelector(`[data-index="${s.y * gridSize + s.x}"]`); if (c) c.classList.add("snake"); });
        const fc = document.querySelector(`[data-index="${food.y * gridSize + food.x}"]`);
        if (fc) fc.classList.add("food");
      }

      function gameOver() {
        clearInterval(gameLoop); gameLoop = null;
        const t = translations[currentLang].terminal;
        closeSnake();
        if (terminal.classList.contains("minimized")) terminal.classList.remove("minimized");
        addToOutput(`<div class="terminal-error">🐍 ${t.gameOver}</div>`);
        addToOutput(`<div class="terminal-success">${t.finalScore} ${score}</div>`);
        addToOutput(`<div class="terminal-info">Tapez "snake" pour rejouer!</div>`);
        terminalInput.focus();
      }

      document.addEventListener("keydown", (e) => {
        if (!snakeGameContainer.classList.contains("active")) return;
        switch (e.key) {
          case "ArrowUp": e.preventDefault(); if (direction.y === 0) nextDirection = { x: 0, y: -1 }; break;
          case "ArrowDown": e.preventDefault(); if (direction.y === 0) nextDirection = { x: 0, y: 1 }; break;
          case "ArrowLeft": e.preventDefault(); if (direction.x === 0) nextDirection = { x: -1, y: 0 }; break;
          case "ArrowRight": e.preventDefault(); if (direction.x === 0) nextDirection = { x: 1, y: 0 }; break;
          case "Escape": e.preventDefault(); closeSnake(); break;
        }
      });

      setTimeout(() => { terminal.classList.remove("minimized"); }, 3000);

      // ========== CURSOR ==========
      const cursor = document.querySelector(".cursor");
      const follower = document.querySelector(".cursor-follower");
      let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

      document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX; mouseY = e.clientY;
        cursor.style.left = mouseX + "px";
        cursor.style.top = mouseY + "px";
      });

      function animateFollower() {
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        follower.style.left = followerX + "px";
        follower.style.top = followerY + "px";
        requestAnimationFrame(animateFollower);
      }
      animateFollower();

      document.querySelectorAll("a, button, .project-card, .repo-card, .tech-tag, .skill-category li, .terminal-btn, .repo-filter").forEach((el) => {
        el.addEventListener("mouseenter", () => { cursor.classList.add("hover"); follower.classList.add("hover"); });
        el.addEventListener("mouseleave", () => { cursor.classList.remove("hover"); follower.classList.remove("hover"); });
      });

      // ========== PARTICLES ==========
      const particlesContainer = document.getElementById("particles");
      let particles = [];

      function createParticle(x, y) {
        if (particles.length > 20) { const o = particles.shift(); o.remove(); }
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.style.left = x + "px";
        particle.style.top = y + "px";
        const angle = Math.random() * Math.PI * 2, velocity = Math.random() * 2 + 1;
        const vx = Math.cos(angle) * velocity, vy = Math.sin(angle) * velocity;
        particlesContainer.appendChild(particle);
        particles.push(particle);
        let opacity = 1, posX = x, posY = y;
        function animate() {
          opacity -= 0.02; posX += vx; posY += vy;
          particle.style.opacity = opacity;
          particle.style.transform = `translate(${posX - x}px,${posY - y}px)`;
          if (opacity > 0) requestAnimationFrame(animate);
          else { particle.remove(); particles = particles.filter((p) => p !== particle); }
        }
        animate();
      }

      let particleInterval;
      document.addEventListener("mousemove", (e) => {
        clearInterval(particleInterval);
        particleInterval = setInterval(() => createParticle(e.clientX, e.clientY), 50);
      });

      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute("href"));
          if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });

      const observer = new IntersectionObserver(
        (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.style.opacity = "1"; entry.target.style.transform = "translateY(0)"; } }); },
        { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
      );

      document.querySelectorAll(".project-card, .skill-category, .repo-card").forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 0.6s cubic-bezier(0.4,0,0.2,1)";
        observer.observe(el);
      });
