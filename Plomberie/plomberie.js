document.addEventListener('DOMContentLoaded', () => {

    // 1. Initialisation de Lenis pour le Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Synchronisation GSAP avec Lenis
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    // 2. Animations Hero (Reveal Text)
    const tlHero = gsap.timeline();
    tlHero.from('.reveal-text', {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.2
    }).from('.reveal-text-sub', {
        opacity: 0,
        duration: 0.8
    }, "-=0.8");

    // 3. Reverse-Scroll Parallax & Mask Reveal
    // Animation pour les cartes de service
    gsap.utils.toArray('.service-card').forEach((card) => {
        const image = card.querySelector('img');
        
        gsap.fromTo(image, 
            { y: '20%' }, 
            {
                y: '-10%',
                ease: 'none',
                scrollTrigger: {
                    trigger: card,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            }
        );

        // Mask Reveal
        gsap.from(card, {
            clipPath: 'inset(100% 0% 0% 0%)',
            y: 50,
            opacity: 0,
            duration: 1.2,
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                end: 'top 50%',
                toggleActions: 'play reverse play reverse' // Effet reverse au back-scroll
            }
        });
    });

    // 4. Compteur de l'Héritage
    const counterObj = { value: 2024 };
    gsap.to(counterObj, {
        value: 1937,
        duration: 3,
        ease: 'power2.inOut',
        scrollTrigger: {
            trigger: '.heritage',
            start: 'top 70%',
        },
        onUpdate: () => {
            document.getElementById('year-counter').innerText = Math.round(counterObj.value);
        }
    });

    // 5. Effet Magnétique sur les boutons
    const magneticBtns = document.querySelectorAll('.btn-magnetic');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
});
