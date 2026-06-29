// =============================================
// ui.js - core Ui utilities 
// types.js hero animation, modal helpers, toast notifications, 
// and per-section cursor color-grading spotlight
// ==============================================

/* ============== Typed Hero text =======*/
// Requires Typed.js (loaded via CDN before this file)
new Typed('.typed-role', {
    strings: [
        'Software Engineer in Test',
        'QA Automation Engineer',
        'Data Science Enthusiast',
        'Product Management Enthusiast'
    ],
    typeSpeed: 55,
    backSpeed: 30,
    loop: true
});

/* ====== Modal utilities ===========*/
// openModal / closeModal / handleOverlayClick are called from HTML onclick attributes.

function openModal(id) {
    document.getElementById(id).classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
    document.body.style.overflow = '';
}

function handleOverlayClick(e, id) {
    if (e.target.id === id) closeModal(id);
}

//=================Toast Notification =========//
// showToast() is used by multiple other files - defined here so it loads first

function showToast(msg, type) {
    var t = document.createElement('div');
    t.className = 'toast toast-' + type;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add('show'); }, 10);
    setTimeout(function () {
        t.classList.remove('show');
        setTimeout(function () { t.remove(); }, 300);
    }, 3000);
}

/* ========= Cursor color-grading spotlight ====== */
// Adds a soft radial glow that follows the mouse inside each section
(function () {
    var sections = [
        { id: 'header', color: 'rgba(99,102,241,0.12)' },
        { id: 'about', color: 'rgba(34,211,238,0.10)' },
        { id: 'portfolio', color: 'rgba(139,92,246,0.12)' },
        { id: 'contact', color: 'rgba(244,114,182,0.11)' }
    ];

    sections.forEach(function (s) {
        var el = document.getElementById(s.id);
        if (!el) return;
        if (window.getComputedStyle(el).position === 'static') el.style.position = 'relative';
        var light = document.createElement('div');
        light.className = 'cursor-light';
        light.style.setProperty('--lc', s.color);
        el.insertBefore(light, el.firstChild);

        el.addEventListener('mousemove', function (e) {
            var r = el.getBoundingClientRect();
            var x = e.clientX - r.left;
            var y = e.clientY - r.top;
            light.style.setProperty('--lcx', x + 'px');
            light.style.setProperty('--lcy', y + 'px');
        });
        el.addEventListener('mouseleave', function () {
            light.style.setProperty('--lcx', '-600px');
            light.style.setProperty('--lcy', '-600px');
        });
    });
})();

/* =============== Section Reveal Animation ========= */
(function () {
    //Selector to animate in on scroll 
    var revealSelectors = [
        '.sub-title',
        '.about-intro',
        '.work',
        '.tab-titles',
        '.ach-tab-panel',
        '.contact-left',
        '.contact-right',
        '.about-panel'
    ];

    //Collect all matching elements and add .reveal class
    var elements = [];
    revealSelectors.forEach(function (sel) {
        document.querySelectorAll(sel).forEach(function (el) {
            el.classList.add('reveal');
            elements.push(el);
        });
    });

    if (!elements.length) return;

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        elements.forEach(function (el) { observer.observe(el); });
    } else {
        //Fallback: show everything immediately
        elements.forEach(function (el) { el.classList.add('visible'); });
    }
})();

/* ==================== Contact Form =========== */
(function () {
    var form = document.getElementById('contactForm');
    var submitBtn = document.getElementById('cfSubmitBtn');
    var success = document.getElementById('cfSuccess');
    var resetBtn = document.getElementById('cfReset');
    var textarea = document.getElementById('cf-msg');
    var charUsed = document.getElementById('cfCharUsed');
    var charCount = document.querySelector('.cf-char-count');

    //Character count
    if (textarea && charUsed && charCount) {
        textarea.addEventListener('input', function () {
            var len = textarea.value.length;
            charUsed.textContent = len;
            charCount.classList.toggle('warn', len > 800);
            charCount.classList.toggle('limit', len >= 1000);
        });
    }

    //Submit: show sending state -> success overlay (Netlify handles actual POST)
    if (form && submitBtn && success) {
        form.addEventListener('submit', function (e) {
            //Let Netlify handle the POST normally (action="/thanks-you.html")
            //but show inline success feedback before redirect
            submitBtn.classList.add('sending');
            submitBtn.disabled = true;
            // The page will redirect to the /thank-you.html via form action
            // for a no-redirect inline experience, uncomment the block below:
            /*
            e.preventDefault();
            var data = new FormData(form);
            fetch('/', { method: 'POST', body: data })
            .then(function () { showSuccess(); })
            .catch(function () {
                submitBtn.classList.remove('sending');
                submitBtn.disabled = false;
                showToast('Failed to send. Please try again.', 'error');
            });
            */
        });
    }

    function showSuccess() {
        success.classList.add('show');
    }

    //Reset button hides overlay and clears form 
    if (resetBtn && form && success) {
        resetBtn.addEventListener('click', function () {
            success.classList.remove('show');
            form.reset();
            if (charUsed) charUsed.textContent = '0';
            if (charCount) { charCount.classList.remove('warn', 'limit'); }
            if (submitBtn) { submitBtn.classList.remove('sending'); submitBtn.disabled = false; }
        });
    }
})();