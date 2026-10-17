(function() {
    'use strict';

    /* ============================================================
       LOADING SCREEN
       ============================================================ */
    const loader = document.getElementById('loader');
    const siteContent = document.getElementById('site-content');

    function hideLoader() {
        if (!loader || !siteContent) return;
        loader.classList.add('hidden');
        siteContent.classList.add('loaded');
        setTimeout(() => {
            if (loader.parentNode) loader.parentNode.removeChild(loader);
        }, 700);
    }

    window.addEventListener('load', hideLoader);
    setTimeout(hideLoader, 4000);

    if (document.readyState === 'complete') {
        hideLoader();
    }

    /* ============================================================
       MOBILE NAVIGATION
       ============================================================ */
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const isOpen = mainNav.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen);
            document.body.classList.toggle('nav-open', isOpen);
        });

        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('nav-open');
            });
        });

        document.addEventListener('click', (e) => {
            if (
                mainNav.classList.contains('open') &&
                !mainNav.contains(e.target) &&
                !navToggle.contains(e.target)
            ) {
                mainNav.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('nav-open');
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && mainNav.classList.contains('open')) {
                mainNav.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('nav-open');
            }
        });
    }

    /* ============================================================
       HERO SLIDESHOW
       ============================================================ */
    const hero = document.querySelector('.hero');

    if (hero) {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        let currentSlide = 0;
        let slideInterval = null;
        const SLIDE_DURATION = 5000;

        function showSlide(index) {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;

            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));

            slides[index].classList.add('active');
            if (dots[index]) dots[index].classList.add('active');

            currentSlide = index;
        }

        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        function startSlideshow() {
            if (slideInterval) clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, SLIDE_DURATION);
        }

        function stopSlideshow() {
            if (slideInterval) {
                clearInterval(slideInterval);
                slideInterval = null;
            }
        }

        function resetSlideshow() {
            stopSlideshow();
            startSlideshow();
        }

        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                showSlide(idx);
                resetSlideshow();
            });
        });

        startSlideshow();

        hero.addEventListener('mouseenter', stopSlideshow);
        hero.addEventListener('mouseleave', startSlideshow);

        hero.addEventListener('touchstart', () => {
            stopSlideshow();
        }, { passive: true });
        hero.addEventListener('touchend', () => {
            setTimeout(startSlideshow, 3000);
        }, { passive: true });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopSlideshow();
            } else {
                startSlideshow();
            }
        });

        dots.forEach((dot, idx) => {
            dot.setAttribute('tabindex', '0');
            dot.setAttribute('role', 'button');
            dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
            dot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    showSlide(idx);
                    resetSlideshow();
                }
            });
        });
    }

    /* ============================================================
       ACTIVE NAV LINK
       ============================================================ */
    const navLinks = document.querySelectorAll('.main-nav a');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('active');
        }
    });

    /* ============================================================
       SCROLL REVEAL
       ============================================================ */
    if ('IntersectionObserver' in window) {
        const revealEls = document.querySelectorAll(
            '.menu-card, .featured-card, .contact-info, .contact-image'
        );

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealEls.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

})();