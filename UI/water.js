// Simple interaction: augmentation du scale de distorsion au clic
const text = document.getElementById('distort');
const filter = document.querySelector('feDisplacementMap');

window.addEventListener('mousemove', (e) => {
    const val = (e.clientX / window.innerWidth) * 100;
    filter.setAttribute('scale', val);
});
