const observerOptions = {
    threshold: 0.2 // Déclenche quand 20% de l'élément est visible
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        } else {
            // Optionnel : retirer la classe pour rejouer l'animation en remontant
            // entry.target.classList.remove('active');
        }
    });
}, observerOptions);

// On cible tous les éléments à animer
document.querySelectorAll('.reveal-text, .card, .zoom-text').forEach(el => {
    observer.observe(el);
});
