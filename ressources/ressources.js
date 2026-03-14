      let currentLang = "fr";

      const translations = {
        fr: {
          nav: {
            projects: "Projets",
            skills: "Compétences",
            resources: "Ressources",
            contact: "Contact",
          },
          resources: {
            title: "Ressources & Outils",
            description:
              "Une collection d'outils et ressources que j'utilise pour le design, le développement web et la création de contenu.",
            colors: {
              title: "Couleurs & Palettes",
              uicolors:
                "Générateur de palettes de couleurs pour Tailwind CSS avec aperçu en temps réel et export facile.",
              khroma:
                "Générateur de palettes de couleurs alimenté par l'IA qui apprend vos préférences.",
              colorkit:
                "Outil complet pour créer et gérer des palettes de couleurs avec harmonies et contrastes.",
              colorsio:
                "Plateforme collaborative pour créer et partager des palettes de couleurs.",
            },
            gradients: {
              title: "Dégradés & Effets",
              grainient:
                "Créateur de dégradés avec effet de grain pour des designs organiques et texturés.",
              shader:
                "Générateur de dégradés animés avec shaders WebGL pour des backgrounds dynamiques.",
            },
            shapes: {
              title: "Formes & Composants",
              framer:
                "Collection de formes et composants SVG pour Framer et autres outils de design.",
              cssgrid:
                "Générateur interactif pour créer des layouts CSS Grid avec aperçu visuel.",
            },
            design: {
              title: "Design & Prototypage",
              framer:
                "Plateforme complète pour le design et prototypage de sites web interactifs sans code.",
              spells:
                "Collection d'astuces et de sortilèges pour améliorer vos designs web.",
            },
            images: {
              title: "Images & Assets",
              pngimg:
                "Base de données massive d'images PNG transparentes gratuites pour tous vos projets.",
            },
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
          resources: {
            title: "Resources & Tools",
            description:
              "A collection of tools and resources I use for design, web development and content creation.",
            colors: {
              title: "Colors & Palettes",
              uicolors:
                "Color palette generator for Tailwind CSS with real-time preview and easy export.",
              khroma:
                "AI-powered color palette generator that learns your preferences.",
              colorkit:
                "Complete tool for creating and managing color palettes with harmonies and contrasts.",
              colorsio:
                "Collaborative platform for creating and sharing color palettes.",
            },
            gradients: {
              title: "Gradients & Effects",
              grainient:
                "Gradient creator with grain effect for organic and textured designs.",
              shader:
                "Animated gradient generator with WebGL shaders for dynamic backgrounds.",
            },
            shapes: {
              title: "Shapes & Components",
              framer:
                "Collection of SVG shapes and components for Framer and other design tools.",
              cssgrid:
                "Interactive generator for creating CSS Grid layouts with visual preview.",
            },
            design: {
              title: "Design & Prototyping",
              framer:
                "Complete platform for designing and prototyping interactive websites without code.",
              spells:
                "Collection of tips and tricks to improve your web designs.",
            },
            images: {
              title: "Images & Assets",
              pngimg:
                "Massive database of free transparent PNG images for all your projects.",
            },
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
            element.textContent = translation;
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
        "a, button, .resource-card",
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
