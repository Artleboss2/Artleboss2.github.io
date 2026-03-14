      // ========== SYSTÈME DE TRADUCTION ==========
      let currentLang = "fr";
      let originalTexts = {}; // Stocke les textes originaux en français

      // Liste complète des 30 langues disponibles
      const languages = {
        fr: { name: "Français", flag: "🇫🇷", code: "fr" },
        en: { name: "English", flag: "🇬🇧", code: "en" },
        es: { name: "Español", flag: "🇪🇸", code: "es" },
        de: { name: "Deutsch", flag: "🇩🇪", code: "de" },
        it: { name: "Italiano", flag: "🇮🇹", code: "it" },
        pt: { name: "Português", flag: "🇵🇹", code: "pt" },
        ru: { name: "Русский", flag: "🇷🇺", code: "ru" },
        zh: { name: "中文", flag: "🇨🇳", code: "zh-CN" },
        ja: { name: "日本語", flag: "🇯🇵", code: "ja" },
        ko: { name: "한국어", flag: "🇰🇷", code: "ko" },
        ar: { name: "العربية", flag: "🇸🇦", code: "ar" },
        hi: { name: "हिन्दी", flag: "🇮🇳", code: "hi" },
        nl: { name: "Nederlands", flag: "🇳🇱", code: "nl" },
        pl: { name: "Polski", flag: "🇵🇱", code: "pl" },
        tr: { name: "Türkçe", flag: "🇹🇷", code: "tr" },
        sv: { name: "Svenska", flag: "🇸🇪", code: "sv" },
        no: { name: "Norsk", flag: "🇳🇴", code: "no" },
        da: { name: "Dansk", flag: "🇩🇰", code: "da" },
        fi: { name: "Suomi", flag: "🇫🇮", code: "fi" },
        cs: { name: "Čeština", flag: "🇨🇿", code: "cs" },
        el: { name: "Ελληνικά", flag: "🇬🇷", code: "el" },
        he: { name: "עברית", flag: "🇮🇱", code: "he" },
        th: { name: "ไทย", flag: "🇹🇭", code: "th" },
        vi: { name: "Tiếng Việt", flag: "🇻🇳", code: "vi" },
        id: { name: "Bahasa Indonesia", flag: "🇮🇩", code: "id" },
        ms: { name: "Bahasa Melayu", flag: "🇲🇾", code: "ms" },
        uk: { name: "Українська", flag: "🇺🇦", code: "uk" },
        ro: { name: "Română", flag: "🇷🇴", code: "ro" },
        hu: { name: "Magyar", flag: "🇭🇺", code: "hu" },
        sk: { name: "Slovenčina", flag: "🇸🇰", code: "sk" },
      };

      // Sauvegarder les textes originaux au chargement
      function saveOriginalTexts() {
        document.querySelectorAll(".translatable").forEach((element, index) => {
          originalTexts[index] = element.textContent;
        });
      }

      // Génération du dropdown de langues
      function generateLangDropdown() {
        const dropdown = document.getElementById("langDropdown");
        dropdown.innerHTML = "";

        Object.entries(languages).forEach(([code, lang]) => {
          const option = document.createElement("div");
          option.className = "lang-option";
          if (code === currentLang) {
            option.classList.add("selected");
          }
          option.innerHTML = `
                    <span class="lang-flag">${lang.flag}</span>
                    <span>${lang.name}</span>
                `;
          option.onclick = () => changeLang(code);
          dropdown.appendChild(option);
        });
      }

      function toggleLangDropdown() {
        const dropdown = document.getElementById("langDropdown");
        dropdown.classList.toggle("active");
      }

      // Fermer le dropdown si on clique ailleurs
      document.addEventListener("click", (e) => {
        const selector = document.querySelector(".lang-selector");
        const dropdown = document.getElementById("langDropdown");
        if (
          !selector.contains(e.target) &&
          dropdown.classList.contains("active")
        ) {
          dropdown.classList.remove("active");
        }
      });

      // Traduction via Google Translate API (client-side)
      async function translateText(text, targetLang) {
        // Utilise Google Translate via l'API gratuite MyMemory
        // Alternative: vous pouvez intégrer Google Translate API officielle avec votre clé
        try {
          const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=fr|${targetLang}`,
          );
          const data = await response.json();
          return data.responseData.translatedText || text;
        } catch (error) {
          console.error("Erreur de traduction:", error);
          return text; // Retourne le texte original en cas d'erreur
        }
      }

      async function changeLang(lang) {
        if (lang === currentLang) return;

        // Afficher le loading
        document.getElementById("loadingOverlay").classList.add("active");

        currentLang = lang;
        document.getElementById("currentFlag").textContent =
          languages[lang].flag;
        document.getElementById("currentLang").textContent =
          languages[lang].name;

        // Si on revient au français, restaurer les textes originaux
        if (lang === "fr") {
          document
            .querySelectorAll(".translatable")
            .forEach((element, index) => {
              element.textContent = originalTexts[index];
            });
          document.getElementById("loadingOverlay").classList.remove("active");
        } else {
          // Traduire tous les éléments
          const translatableElements =
            document.querySelectorAll(".translatable");
          const targetLangCode = languages[lang].code;

          for (let i = 0; i < translatableElements.length; i++) {
            const element = translatableElements[i];
            const originalText = originalTexts[i];
            const translatedText = await translateText(
              originalText,
              targetLangCode,
            );
            element.textContent = translatedText;

            // Petit délai pour éviter de surcharger l'API
            await new Promise((resolve) => setTimeout(resolve, 100));
          }

          document.getElementById("loadingOverlay").classList.remove("active");
        }

        generateLangDropdown();
        toggleLangDropdown();

        // Sauvegarder la préférence
        localStorage.setItem("preferredLang", currentLang);
      }

      // Charger la langue préférée au démarrage
      window.addEventListener("DOMContentLoaded", () => {
        saveOriginalTexts();
        generateLangDropdown();

        const savedLang = localStorage.getItem("preferredLang");
        if (savedLang && languages[savedLang] && savedLang !== "fr") {
          changeLang(savedLang);
        }

        // Animation d'apparition des sections
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("visible");
              }
            });
          },
          { threshold: 0.1 },
        );

        document.querySelectorAll("section").forEach((section) => {
          observer.observe(section);
        });
      });

      // ========== CURSEUR PERSONNALISÉ ==========
      const cursor = document.querySelector(".cursor");
      const follower = document.querySelector(".cursor-follower");
      let mouseX = 0,
        mouseY = 0;
      let followerX = 0,
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

      // Effet hover
      const interactiveElements = document.querySelectorAll(
        "h3, .alert-box, .lang-button, .lang-option, strong",
      );
      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", () => {
          follower.classList.add("hover");
        });
        el.addEventListener("mouseleave", () => {
          follower.classList.remove("hover");
        });
      });
