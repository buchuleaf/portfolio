// js/script.js
document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Section fade-in transition observer
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section-transition').forEach(section => {
        sectionObserver.observe(section);
    });

    // Active navigation link highlighting
    const navLinksContainer = document.getElementById('nav-links');
    if (navLinksContainer) {
        const navLinks = navLinksContainer.querySelectorAll('.nav-item');
        const sections = document.querySelectorAll('.section-target'); // Sections to track

        const activateNavLink = (sectionId) => {
            navLinks.forEach(link => {
                link.classList.remove('active-nav-link');
                // Check if the link's href matches the sectionId (ignoring the '#')
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active-nav-link');
                }
            });
        };
        
        // Special case for hero section as it might be taller
        const heroSection = document.getElementById('hero');
        if (heroSection && heroSection.classList.contains('section-target')) {
             // Check if hero is initially visible (top of page)
            const heroRect = heroSection.getBoundingClientRect();
            if (heroRect.top <= 50 && heroRect.bottom >= 50) { // 50px offset from top
                 activateNavLink(heroSection.id);
            }
        }


        const navObserverOptions = {
            rootMargin: "-50% 0px -50% 0px", // Trigger when section is in the middle of the viewport
            threshold: 0 // Trigger as soon as any part is visible within the rootMargin
        };
        
        // Fallback for initial load or if no section is perfectly centered
        let lastKnownActiveSectionId = null;
        if (heroSection && heroSection.classList.contains('section-target')) {
            const heroRect = heroSection.getBoundingClientRect();
            if (heroRect.top <= (window.innerHeight / 2) && heroRect.bottom >= (window.innerHeight / 2)) {
                 lastKnownActiveSectionId = heroSection.id;
            }
        }


        const navHighlighterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    activateNavLink(entry.target.id);
                    lastKnownActiveSectionId = entry.target.id;
                }
            });
             // If after checking all entries, none are "isIntersecting" (e.g. scrolling fast between sections)
            // and we have a last known active section, ensure it remains active.
            // This helps avoid moments where no link is active.
            let anyIntersecting = false;
            entries.forEach(e => { if(e.isIntersecting) anyIntersecting = true; });
            if(!anyIntersecting && lastKnownActiveSectionId) {
                // Check if the lastKnownActiveSectionId is still somewhat visible,
                // to prevent highlighting a far-off section during fast scrolls.
                const sectionEl = document.getElementById(lastKnownActiveSectionId);
                if(sectionEl) {
                    const rect = sectionEl.getBoundingClientRect();
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                         activateNavLink(lastKnownActiveSectionId);
                    }
                }
            }

        }, navObserverOptions);

        sections.forEach(section => {
            navHighlighterObserver.observe(section);
        });
    }
});