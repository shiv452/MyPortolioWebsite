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
    // Insert wrap at the same position col1img currently occupies, THEN move img inside
    col1img.parentNode.insertBefore(wrap, col1img);
    wrap.appendChild(col1img);

    var lb1 = document.createElement('label');
    lb1.className = 'about-pic-edit';
    lb1.title = 'Change photo';
    lb1.innerHTML = '<i class="fas fa-camera"></i>'

    var fileInp = document.createElement('input');
    fileInp.type = 'file';
    fileInp.accept = 'image/*';
    fileInp.style.display = 'none';
    fileInp.onchange = function () {
        if (!fileInp.files || !fileInp.files[0]) return;
        var file = fileInp.files[0];
        fileInp.value = '';

        showToast('Uploading photo...', 'success');
        import('/JavaScript/data-profile.js').then(function (m) {
            return m.uploadProfilePhoto(file).then(function (photoUrl) {
                return m.setProfilePhoto(photoUrl).then(function () { return photoUrl; });
            });
        }).then(function (photoUrl) {
            var pic = document.getElementById('aboutProfilePic');
            if (pic) pic.src = photoUrl;
            showToast('Profile photo updated!', 'success');
        }).catch(function () {
            showToast('Failed to update photo - check you are signed in as admin.', 'error');
        });
    };

    lb1.appendChild(fileInp);
    wrap.appendChild(lb1);

    // Initial load: Firestore is the source of truth once it has a photo;
    // the static image already in index.html is only a first-load/offline seed.
    import('/JavaScript/data-profile.js').then(function (m) {
        return m.getProfilePhoto();
    }).then(function (photoUrl) {
        if (photoUrl) col1img.src = photoUrl;
    }).catch(function () {
        // Offline or Firestore error - keep the static photo already on the page
    });
})();

/* ================= About Panel Peek/Pin ============== */
// Hover over a panel icon -> brief 2.2s peek
// Click a panel icon -> pin open; click anywhere outside -> unpin all
(function () {
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
            document.querySelectorAll('.about-panel.pinned').forEach(function (p) {
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