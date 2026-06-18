// ===================================================
// about.js - About section interactions
// Profiles picture swap and collapsible panel peek/pin behavior
// ====================================================


/* =========== Change Profile Picture ================= */
// Wrap the About column-1 image in a .about-pic-wrap div and 
// overlays a camera icon label that triggers a file-picker.
// Photo is session-only for now-Firebase will make it permanent.
(function () {
    var col1img = document.querySelector('.about-intro .about-col-1 img');
    if (!col1img) return;
    col1img.id = 'aboutProfilePic';

    var wrap = document.createElement('div');
    wrap.className = 'about-pic-wrap';
    col1img.appendChild(col1img);

    var lb1 = document.createElement('label');
    lb1.className = 'about-pic-edit';
    lb1.title = 'Change photo';
    lb1.innerHTML = '<i class"fas fa-camera"></i>'

    var fileInp = document.createElement('input');
    fileInp.type = 'file';
    fileInp.accept = 'image/*';
    fileInp.style.display = 'none';
    fileInp.onchange = function() {
        if(!fileInp.files || !fileInp.files[0]) return;
        var reader = new FileReader();
        reader.onload = function (ev) {
            var pic = document.getElementById('aboutProfilePic');
            if (pic) pic.src = ev.target.result;
            showToast('Profile photo update!', 'success');
        };
        reader.readAsDataURL(fileInp.files[0]);
    };

    lb1.appendChild(fileInp);
    wrap.appendChild(lb1);
})();

/* ================= About Panel Peek/Pin ============== */ 
// Hover over a panel icon -> brief 2.2s peek
// Click a panel icon -> pin open; click anywhere outside -> unpin all
(function (){
    // Wrap non-header children in .panel-body for CSS height transition
    document.querySelectorAll('.about-panel').forEach(function (panel) {
        var header = panel.querySelector('.panel-header');
        if (!header || panel.querySelector('.panel-body')) return;
        var body = document.createElement('div');
        body.className = 'panel-body';
        Array.from(panel.children).forEach(function (child) {
            if (child !== header) body.appendChild(child);
        });
        panel.appendChild(body);
    });

    // Attach hover-peek and click-pin behavior
    document.querySelectorAll('.about-panel').forEach(function (panel) {
        var icon = panel.querySelector('.panel-icon');
        if (!icon) return;
        var peekTimer = null;

        icon.addEventListener('mouseenter', function () {
            if (panel.classList.contains('pinned')) return;
            clearTimeout(peekTimer);
            panel.classList.add('peeking');
            peekTimer = setTimeout(function () {
                panel.classList.remove('peeking');
            }, 2200);
        });

        icon.addEventListener('click', function (e) {
            e.stopPropagation();
            clearTimeout(peekTimer);
            panel.classList.remove('peeking');
            var wasPinned = panel.classList.contains('pinned');
            document.querySelectorAll('.about-panel-pinned').forEach(function (p) {
                p.classList.remove('pinned');
            });
            if (!wasPinned) panel.classList.add('pinned');
        });
    });

    // Click outside -> unpin all
    document.addEventListener('click', function (e) {
        if (!e.target.closest || !e.target.closest('.about-panel')) {
            document.querySelectorAll('.about-panel.pinned').forEach(function (p) {
                p.classList.remove('pinned');
            });
        }
    });
})();