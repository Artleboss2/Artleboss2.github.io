      let currentLang = "fr";

      const translations = {
        fr: {
          nav: {
            projects: "Projets",
            skills: "Compétences",
            resources: "Ressources",
            contact: "Contact",
          },
          hero: {
            title: "Zynit<br>To-Do List App",
            description:
              "Application mobile moderne et intuitive pour gérer vos tâches quotidiennes. Catégorisez, planifiez et accomplissez vos objectifs avec style.",
            github: "Voir sur GitHub",
            features: "Fonctionnalités",
          },
          features: {
            title: "Fonctionnalités principales",
            tasks: {
              title: "Gestion de tâches",
              description:
                "Créez, modifiez et supprimez vos tâches facilement. Interface intuitive pour une productivité maximale.",
            },
            categories: {
              title: "Catégorisation",
              description:
                "Organisez vos tâches par catégories personnalisées. Travail, personnel, sport - tout est classé.",
            },
            reminders: {
              title: "Rappels intelligents",
              description:
                "Recevez des notifications pour ne jamais oublier vos tâches importantes.",
            },
            design: {
              title: "Design moderne",
              description:
                "Interface élégante et épurée qui rend la gestion de tâches agréable.",
            },
            mobile: {
              title: "Cross-platform",
              description:
                "Développée avec React Native pour fonctionner sur iOS et Android.",
            },
            legal: {
              title: "Conformité légale",
              description:
                "CLUF complet et conformité aux lois canadiennes sur la protection des données.",
            },
          },
          tech: {
            title: "Technologies utilisées",
          },
          cta: {
            title: "Découvrez le code source",
            description:
              "Le projet est open source et disponible sur GitHub. N'hésitez pas à explorer le code, contribuer ou l'utiliser pour vos propres projets.",
          },
          footer: {
            copyright: "© 2026 — Conçu et développé avec passion",
          },
        },
        en: {
          nav: {
            projects: "Projects",
            skills: "Skills",
            resources: "Resources",
            contact: "Contact",
          },
          hero: {
            title: "Zynit<br>To-Do List App",
            description:
              "Modern and intuitive mobile application to manage your daily tasks. Categorize, plan and achieve your goals with style.",
            github: "View on GitHub",
            features: "Features",
          },
          features: {
            title: "Main Features",
            tasks: {
              title: "Task Management",
              description:
                "Create, edit and delete your tasks easily. Intuitive interface for maximum productivity.",
            },
            categories: {
              title: "Categorization",
              description:
                "Organize your tasks by custom categories. Work, personal, sport - everything is classified.",
            },
            reminders: {
              title: "Smart Reminders",
              description:
                "Receive notifications to never forget your important tasks.",
            },
            design: {
              title: "Modern Design",
              description:
                "Elegant and clean interface that makes task management enjoyable.",
            },
            mobile: {
              title: "Cross-platform",
              description:
                "Developed with React Native to work on iOS and Android.",
            },
            legal: {
              title: "Legal Compliance",
              description:
                "Complete EULA and compliance with Canadian data protection laws.",
            },
          },
          tech: {
            title: "Technologies Used",
          },
          cta: {
            title: "Discover the Source Code",
            description:
              "The project is open source and available on GitHub. Feel free to explore the code, contribute or use it for your own projects.",
          },
          footer: {
            copyright: "© 2026 — Designed and developed with passion",
          },
        },
      };

      function toggleLanguage() {
        currentLang = currentLang === "fr" ? "en" : "fr";
        document.getElementById("langIcon").textContent =
          currentLang === "fr" ? "EN" : "FR";
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

          if (translation) {
            if (key === "hero.title") {
              element.innerHTML = translation;
            } else {
              element.textContent = translation;
            }
          }
        });
      }

      window.addEventListener("DOMContentLoaded", () => {
        const savedLang = localStorage.getItem("preferredLang");
        if (savedLang && savedLang !== currentLang) {
          toggleLanguage();
        }
      });

      
      const cursor = document.querySelector(".cursor");
      const follower = document.querySelector(".cursor-follower");
      let mouseX = 0,
        mouseY = 0;
      let followerX = 0,
        followerY = 0;

      document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
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

      const interactiveElements = document.querySelectorAll(
        "a, button, .feature-card, .tech-item",
      );
      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", () => {
          cursor.classList.add("hover");
          follower.classList.add("hover");
        });
        el.addEventListener("mouseleave", () => {
          cursor.classList.remove("hover");
          follower.classList.remove("hover");
        });
      });

      
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute("href"));
          if (target) {
            target.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        });
      });
