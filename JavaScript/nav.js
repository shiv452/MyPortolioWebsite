// ==========================================
// nav.js - Navigation: hamburger menu + active link on scroll
// openmenu() / closemenu() called from HTML onclick attributes
// ===========================================

var sidemenu = document.getElementById('sidemenu');

// Hamburger open/close - use .show class to match CSS transform transition
function openmenu() {
    if (sidemenu) sidemenu.classList.add('show');
}

function closemenu() {
    if (sidemenu) sidemenu.classList.remove('show');
}

// Close drawer when a nav link is trapped on mobile
if (sidemenu) {
    sidemenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            sidemenu.classList.remove('show');
        });
    });
}

//=========== Active nav link on scroll
//Highlights the nav link whose section is currently in view
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
        navLinks.forEach(function (link) {
            var isActive = link.getAttribute('href') === '#' + activeId;
            link.classList.toggle('active', isActive);
        });
    }

    window.addEventListener('scroll', activate, { passive: true });
    activate(); // run once on load
})();