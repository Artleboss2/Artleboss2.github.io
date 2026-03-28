const BIBLE_METADATA = [
    { id: "GEN", name: "Genèse", chapters: 50, file: "genese.js" },
    { id: "EXO", name: "Exode", chapters: 40, file: "exode.js" },
    { id: "LEV", name: "Lévitique", chapters: 27, file: "levitique.js" },
    { id: "NUM", name: "Nombres", chapters: 36, file: "nombres.js" },
    { id: "DEU", name: "Deutéronome", chapters: 34, file: "deuteronome.js" },
    { id: "JOS", name: "Josué", chapters: 24, file: "josue.js" },
    { id: "JUG", name: "Juges", chapters: 21, file: "juges.js" },
    { id: "RUT", name: "Ruth", chapters: 4, file: "ruth.js" },
    { id: "1SAM", name: "1 Samuel", chapters: 31, file: "1samuel.js" },
    { id: "2SAM", name: "2 Samuel", chapters: 24, file: "2samuel.js" },
    { id: "1ROI", name: "1 Rois", chapters: 22, file: "1rois.js" },
    { id: "2ROI", name: "2 Rois", chapters: 25, file: "2rois.js" },
    { id: "1CHR", name: "1 Chroniques", chapters: 29, file: "1chroniques.js" },
    { id: "2CHR", name: "2 Chroniques", chapters: 36, file: "2chroniques.js" },
    { id: "ESD", name: "Esdras", chapters: 10, file: "esdras.js" },
    { id: "NEH", name: "Néhémie", chapters: 13, file: "nehemie.js" },
    { id: "EST", name: "Esther", chapters: 10, file: "esther.js" },
    { id: "JOB", name: "Job", chapters: 42, file: "job.js" },
    { id: "PSA", name: "Psaumes", chapters: 150, file: "psaumes.js" },
    { id: "PRO", name: "Proverbes", chapters: 31, file: "proverbes.js" },
    { id: "ECC", name: "Ecclésiaste", chapters: 12, file: "ecclesiaste.js" },
    { id: "CAN", name: "Cantique des Cantiques", chapters: 8, file: "cantique.js" },
    { id: "ESA", name: "Ésaïe", chapters: 66, file: "esaie.js" },
    { id: "JER", name: "Jérémie", chapters: 52, file: "jeremie.js" },
    { id: "LAM", name: "Lamentations", chapters: 5, file: "lamentations.js" },
    { id: "EZE", name: "Ézéchiel", chapters: 48, file: "ezechiel.js" },
    { id: "DAN", name: "Daniel", chapters: 12, file: "daniel.js" },
    { id: "OSE", name: "Osée", chapters: 14, file: "osee.js" },
    { id: "JOE", name: "Joël", chapters: 3, file: "joel.js" },
    { id: "AMO", name: "Amos", chapters: 9, file: "amos.js" },
    { id: "ABD", name: "Abdias", chapters: 1, file: "abdias.js" },
    { id: "JON", name: "Jonas", chapters: 4, file: "jonas.js" },
    { id: "MIC", name: "Michée", chapters: 7, file: "michee.js" },
    { id: "NAH", name: "Nahum", chapters: 3, file: "nahum.js" },
    { id: "HAB", name: "Habacuc", chapters: 3, file: "habacuc.js" },
    { id: "SOP", name: "Sophonie", chapters: 3, file: "sophonie.js" },
    { id: "AGG", name: "Aggée", chapters: 2, file: "aggee.js" },
    { id: "ZAC", name: "Zacharie", chapters: 14, file: "zacharie.js" },
    { id: "MAL", name: "Malachie", chapters: 4, file: "malachie.js" },
    { id: "MAT", name: "Matthieu", chapters: 28, file: "matthieu.js" },
    { id: "MAR", name: "Marc", chapters: 16, file: "marc.js" },
    { id: "LUC", name: "Luc", chapters: 24, file: "luc.js" },
    { id: "JEAN", name: "Jean", chapters: 21, file: "jean.js" },
    { id: "ACT", name: "Actes", chapters: 28, file: "actes.js" },
    { id: "ROM", name: "Romains", chapters: 16, file: "romains.js" },
    { id: "1COR", name: "1 Corinthiens", chapters: 16, file: "1corinthiens.js" },
    { id: "2COR", name: "2 Corinthiens", chapters: 13, file: "2corinthiens.js" },
    { id: "GAL", name: "Galates", chapters: 6, file: "galates.js" },
    { id: "EPH", name: "Éphésiens", chapters: 6, file: "ephesiens.js" },
    { id: "PHI", name: "Philippiens", chapters: 4, file: "philippiens.js" },
    { id: "COL", name: "Colossiens", chapters: 4, file: "colossiens.js" },
    { id: "1THES", name: "1 Thessaloniciens", chapters: 5, file: "1thessaloniciens.js" },
    { id: "2THES", name: "2 Thessaloniciens", chapters: 3, file: "2thessaloniciens.js" },
    { id: "1TIM", name: "1 Timothée", chapters: 6, file: "1timothee.js" },
    { id: "2TIM", name: "2 Timothée", chapters: 4, file: "2timothee.js" },
    { id: "TIT", name: "Tite", chapters: 3, file: "tite.js" },
    { id: "PHILE", name: "Philémon", chapters: 1, file: "philemon.js" },
    { id: "HEB", name: "Hébreux", chapters: 13, file: "hebreux.js" },
    { id: "JAC", name: "Jacques", chapters: 5, file: "jacques.js" },
    { id: "1PIE", name: "1 Pierre", chapters: 5, file: "1pierre.js" },
    { id: "2PIE", name: "2 Pierre", chapters: 3, file: "2pierre.js" },
    { id: "1JEAN", name: "1 Jean", chapters: 5, file: "1jean.js" },
    { id: "2JEAN", name: "2 Jean", chapters: 1, file: "2jean.js" },
    { id: "3JEAN", name: "3 Jean", chapters: 1, file: "3jean.js" },
    { id: "JUDE", name: "Jude", chapters: 1, file: "jude.js" },
    { id: "APO", name: "Apocalypse", chapters: 22, file: "apocalypse.js" }
];

let state = {
    xp: parseInt(localStorage.getItem('bible_xp')) || 0,
    currentBook: localStorage.getItem('bible_last_book') || "GEN",
    currentChapter: parseInt(localStorage.getItem('bible_last_chap')) || 1,
    loadedBooks: new Set()
};

function initApp() {
    console.log("Initialisation...");
    if (window.lucide) lucide.createIcons();
    populateBookSelect();
    updateXPDisplay();
    loadBookData(state.currentBook, () => {
        updateChapterSelector();
        renderBible();
    });
}

function loadBookData(bookId, callback) {
    const bookInfo = BIBLE_METADATA.find(b => b.id === bookId);
    if (!bookInfo) return;

    if (state.loadedBooks.has(bookId) || window[`BIBLE_DATA_${bookId}`]) {
        state.loadedBooks.add(bookId);
        if (callback) callback();
        return;
    }

    const loader = document.getElementById('loading');
    if (loader) loader.style.display = 'flex';

    const script = document.createElement('script');
    
    /**
     * LOGIQUE DE CHEMIN POUR GITHUB PAGES
     * Si index.html est à la racine, le chemin vers les données doit être "js/bible-data/..."
     * même si ce fichier app.js est lui-même dans "js/".
     */
    const timestamp = new Date().getTime();
    const scriptPath = `js/bible-data/${bookInfo.file}?t=${timestamp}`;
    script.src = scriptPath;
    
    console.log(`Tentative de chargement : ${scriptPath}`);

    script.onload = () => {
        console.log(`Chargé avec succès : ${bookInfo.file}`);
        state.loadedBooks.add(bookId);
        if (loader) loader.style.display = 'none';
        if (callback) callback();
    };

    script.onerror = () => {
        console.error(`404 : Fichier non trouvé à ${scriptPath}`);
        if (loader) loader.style.display = 'none';
        
        // Tentative de secours : Essayer sans le préfixe "js/" au cas où la structure serait différente
        const fallbackPath = `bible-data/${bookInfo.file}?t=${timestamp}`;
        console.log(`Tentative de secours (fallback) : ${fallbackPath}`);
        
        const fallbackScript = document.createElement('script');
        fallbackScript.src = fallbackPath;
        fallbackScript.onload = () => {
            console.log(`Chargé avec succès via fallback : ${bookInfo.file}`);
            state.loadedBooks.add(bookId);
            if (callback) callback();
        };
        fallbackScript.onerror = () => {
            const container = document.getElementById('bible-content');
            if (container) {
                container.innerHTML = `
                    <div class="p-8 text-center bg-white rounded-3xl shadow-xl border-2 border-red-100">
                        <h3 class="text-xl font-bold text-red-600 mb-2">Erreur de chargement</h3>
                        <p class="text-gray-600 text-sm mb-4">Le fichier "${bookInfo.file}" est introuvable.</p>
                        <div class="text-left bg-gray-50 p-4 rounded-xl text-[10px] font-mono text-gray-400">
                            URL testée 1 : ${scriptPath}<br>
                            URL testée 2 : ${fallbackPath}
                        </div>
                    </div>`;
            }
        };
        document.head.appendChild(fallbackScript);
    };

    document.head.appendChild(script);
}

function populateBookSelect() {
    const select = document.getElementById('book-select');
    if (!select) return;
    select.innerHTML = BIBLE_METADATA.map(b => 
        `<option value="${b.id}" ${b.id === state.currentBook ? 'selected' : ''}>${b.name}</option>`
    ).join('');
}

function updateChapterSelector() {
    const bookInfo = BIBLE_METADATA.find(b => b.id === state.currentBook);
    const select = document.getElementById('chapter-select');
    if (!select || !bookInfo) return;

    let options = "";
    for (let i = 1; i <= bookInfo.chapters; i++) {
        options += `<option value="${i}" ${i === state.currentChapter ? 'selected' : ''}>Chapitre ${i}</option>`;
    }
    select.innerHTML = options;
}

function handleBookChange() {
    const select = document.getElementById('book-select');
    state.currentBook = select.value;
    state.currentChapter = 1;
    loadBookData(state.currentBook, () => {
        updateChapterSelector();
        renderBible();
        saveState();
    });
}

function handleChapterChange() {
    const select = document.getElementById('chapter-select');
    state.currentChapter = parseInt(select.value);
    renderBible();
    saveState();
}

function renderBible() {
    const dataName = `BIBLE_DATA_${state.currentBook}`;
    const bookContent = window[dataName];
    const key = `${state.currentBook}-${state.currentChapter}`;
    const container = document.getElementById('bible-content');
    
    if (!container) return;
    const bookInfo = BIBLE_METADATA.find(b => b.id === state.currentBook);

    if (!bookContent || !bookContent[key]) {
        container.innerHTML = `
            <div class="text-center py-20">
                <div class="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
                <p class="text-gray-400">Chargement des versets...</p>
            </div>`;
        return;
    }

    const verses = bookContent[key];
    container.innerHTML = `
        <div class="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 class="text-4xl font-serif font-bold text-gray-800 mb-8 border-b pb-4 border-gray-100">${bookInfo.name} ${state.currentChapter}</h2>
            <div class="space-y-6 text-lg text-gray-700 leading-relaxed font-serif">
                ${verses.map(v => `<p class="flex items-start"><span class="text-blue-500 font-bold mr-4 text-sm mt-1 select-none opacity-50">${v.n}</span><span>${v.t}</span></p>`).join('')}
            </div>
        </div>`;
    
    const mainContainer = document.getElementById('app-container');
    if (mainContainer) mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
}

function changeChapter(dir) {
    const bookIndex = BIBLE_METADATA.findIndex(b => b.id === state.currentBook);
    const bookInfo = BIBLE_METADATA[bookIndex];
    let next = state.currentChapter + dir;

    if (next < 1) {
        if (bookIndex > 0) {
            const prevBook = BIBLE_METADATA[bookIndex - 1];
            state.currentBook = prevBook.id;
            state.currentChapter = prevBook.chapters;
            syncNavigation();
        }
    } else if (next > bookInfo.chapters) {
        if (bookIndex < BIBLE_METADATA.length - 1) {
            const nextBook = BIBLE_METADATA[bookIndex + 1];
            state.currentBook = nextBook.id;
            state.currentChapter = 1;
            syncNavigation();
        }
    } else {
        state.currentChapter = next;
        const select = document.getElementById('chapter-select');
        if (select) select.value = next;
        renderBible();
        saveState();
    }
}

function syncNavigation() {
    const bookSelect = document.getElementById('book-select');
    if (bookSelect) bookSelect.value = state.currentBook;
    loadBookData(state.currentBook, () => {
        updateChapterSelector();
        renderBible();
        saveState();
    });
}

function updateXPDisplay() {
    const badge = document.getElementById('xp-badge');
    const progress = document.getElementById('xp-progress');
    if (badge) badge.textContent = `⚡ ${state.xp} XP`;
    if (progress) progress.style.width = `${Math.min(state.xp % 100, 100)}%`;
}

function saveState() {
    localStorage.setItem('bible_xp', state.xp);
    localStorage.setItem('bible_last_book', state.currentBook);
    localStorage.setItem('bible_last_chap', state.currentChapter);
}

window.onload = initApp;
