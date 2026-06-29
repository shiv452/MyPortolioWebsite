// ==========================================
// logo.js - Logo 3-D spin / pop on click
// Wraps the nav logo in #logoWrap and triggers
// the logoPop keyframe animation on click.
// ==========================================
(function () {
    var logo = document.getElementById('logo');
    if (!logo) return;

    // Wrap logo in a centering flex div
    var wrap = document.createElement('div');
    wrap.id = 'logoWrap';
    logo.parentNode.insertBefore(wrap, logo);
    wrap.appendChild(logo);

    // Trigger pop animation on click
    logo.addEventListener('click', function () {
        logo.classList.remove('logo-idle');
        // Force reflow so re-adding the class restarts the animation
        void logo.offsetWidth;
        logo.classList.add('logo-idle');
    });

    // Scroll to top on logo click
    logo.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();