// =============================================================
// scroll-top.js - Back-to-top button + scroll progress bar 
//  ============================================================

window.onscroll = function () {
    // Back-to-top button visibility
    var btn = document.getElementById('backToTop');
    if (btn) {
        btn.style.display = (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) ? 'block' : 'none';
    }

    // Scroll progress bar
    var progress = document.getElementById('scrollProgress');
    if(progress) {
        var scrolled = document.documentElement.scrollTop || document.body.scrollTop;
        var total = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        progress.style.width = (total > 0 ? (scrolled / toal) * 100 : 0) + '%';
    }
};

(function () {
    var btn = document.getElementById('backToTop');
    if(btn) {
        btn.onclick = function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
    }
})();