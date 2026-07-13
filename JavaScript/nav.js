// ==========================================
// nav.js - Navigation: hamburger menu + active link on scroll
// openmenu() / closemenu() called from HTML onclick attributes
// ===========================================

var sidemenu = document.getElementById('sidemenu');

// Dimmed backdrop behind the drawer - click it to close, like any modal
// Inserted inside <nav> (not appended to <body>) so it shares the same
// stacking context as the drawer - #header .container has z-index:1, which
// traps the drawer's z-index:999 inside that context; an overlay appended
// straight to <body> would sit in the root context and paint over it regardless.
var navOverlay = document.createElement('div');
navOverlay.className = 'nav-overlay';
navOverlay.setAttribute('aria-hidden', 'true');
navOverlay.addEventListener('click', closemenu);
var navEl = document.querySelector('nav');
if (navEl && sidemenu) {
    navEl.insertBefore(navOverlay, sidemenu);
} else {
    document.body.appendChild(navOverlay);
}

// Hamburger open/close - use .show class to match CSS transform transition
function openmenu() {
    if (sidemenu) sidemenu.classList.add('show');
    navOverlay.classList.add('show');
}

function closemenu() {
    if (sidemenu) sidemenu.classList.remove('show');
    navOverlay.classList.remove('show');
}

// Close drawer when a nav link is tapped on mobile
if (sidemenu) {
    sidemenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closemenu);
    });
}

//=========== Active nav link on scroll
//Highlights the nav link whose section is currently in view
//(updates both the original hero nav AND the cloned sticky-nav, since
// the sticky nav is a one-time clone that doesn't auto-sync otherwise)
(function () {
    var navLinks = document.querySelectorAll('nav ul li a[href^="#"]');
    var sectionIds = [];
    navLinks.forEach(function (link) {
        sectionIds.push(link.getAttribute('href').slice(1));
    });

    function activate() {
        var scrollY = window.pageYOffset;
        var activeId = sectionIds[0];
        sectionIds.forEach(function (id) {
            var el = document.getElementById(id);
            if (el && el.offsetTop - 100 <= scrollY) activeId = id;
        });
        // Target both the original nav links and any sticky-nav clone links
        var allLinks = document.querySelectorAll('nav ul li a[href^="#"], .nav-sticky-inner ul li a[href^="#"]');
        allLinks.forEach(function (link) {
            var isActive = link.getAttribute('href') === '#' + activeId;
            link.classList.toggle('active', isActive);
        });
    }

    window.addEventListener('scroll', activate, { passive: true });
    activate(); // run once on load
})();
// =========== Sticky nav on scroll ===========
// Shows a fixed nav bar once user scrolls past the hero section
(function () {
    var header = document.getElementById('header');
    var navEl = document.querySelector('nav');
    var stickyNav = null;

    function buildStickyNav() {
        if (stickyNav || !navEl) return;
        stickyNav = document.createElement('div');
        stickyNav.className = 'nav-sticky';

        var inner = document.createElement('div');
        inner.className = 'nav-sticky-inner';

        // Clone the logo, but give the clone a unique id so it never collides
        // with the real #logo in the hero (avoids duplicate-id bugs in logo.js
        // and anything else relying on getElementById('logo')).
        var logoImg = navEl.querySelector('.logo');
        if (logoImg) {
            var logoClone = logoImg.cloneNode(true);
            logoClone.removeAttribute('id');
            logoClone.classList.add('nav-sticky-logo');
            inner.appendChild(logoClone);
        }

        // Clone just the link list (not the hamburger icons, not the real #sidemenu id)
        var menuList = navEl.querySelector('ul');
        if (menuList) {
            var listClone = menuList.cloneNode(true);
            listClone.removeAttribute('id');
            // Strip the drawer's own close icon - it's a direct child of the <ul>
            // (not inside an <li>), so it rides along on clone and would otherwise
            // render as a stray, unstyled icon in the sticky nav.
            listClone.querySelectorAll('.fas, .far, .fab').forEach(function (icon) { icon.remove(); });
            inner.appendChild(listClone);
        }

        // Add a hamburger trigger for mobile/tablet widths, where the cloned
        // link list above gets hidden by CSS. Opens the SAME #sidemenu drawer
        // used by the hero nav (via the existing openmenu() function) instead
        // of building a second, separate menu system.
        var stickyBars = document.createElement('i');
        stickyBars.className = 'fas fa-bars nav-sticky-bars';
        stickyBars.setAttribute('aria-label', 'Open menu');
        stickyBars.setAttribute('role', 'button');
        stickyBars.onclick = function () {
            if (typeof openmenu === 'function') openmenu();
        };
        inner.appendChild(stickyBars);

        stickyNav.appendChild(inner);
        document.body.appendChild(stickyNav);
    }

    function handleScroll() {
        if (!header) return;
        buildStickyNav();
        if (!stickyNav) return;
        var heroBottom = header.offsetTop + header.offsetHeight;
        var scrolled = window.pageYOffset;
        stickyNav.classList.toggle('visible', scrolled > heroBottom - 80);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
})();