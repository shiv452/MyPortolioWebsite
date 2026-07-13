// =============================================
// achievement.js - Achievement section
// Tab switching, certificates lightbox, and certificate modal,
// and animated remove helpers for award cards and cert thumbnails
// ==============================================

// Tab switching 
//switchAchTab() is called from HTML onclick attribute

function switchAchTab(tab) {
    document.querySelectorAll('.ach-tab').forEach(function (btn) {
        btn.classList.toggle('active', btn.getAttribute('onclick').indexOf("'" + tab + "'") !== -1);
    });
    document.querySelectorAll('.ach-pane').forEach(function (pane) {
        pane.classList.toggle('active', pane.id === 'ach' + tab.charAt(0).toUpperCase() + tab.slice(1));
    });
}

// Certificate Lightbox
// openLightbox() / closeLightbox() called from HTML onclick attributes
function openLightbox(src) {
    var lb = document.getElementById('certLightbox');
    var img = document.getElementById('certLbImg');
    if (!lb || !img) return;
    // Support both image sources and PDF documents
    if (src && src.toLowerCase().indexOf('.pdf') !== -1) {
        // Replace inner content with an embedded PDF viewer
        var inner = lb.querySelector('.cert-lb-inner');
        if (!inner) return;
        inner.innerHTML = '<button class="cert-lb-close" onclick="closeLightbox(event)">&times;</button>' +
            '<object data="' + src + '" type="application/pdf" width="100%" height="700px">' +
            '<p>Your browser does not support viewing PDFs inline. <a href="' + src + '" target="_blank">Open PDF</a></p>' +
            '</object>';
        lb.classList.add('active');
        document.body.style.overflow = 'hidden';
        return;
    }
    // Otherwise treat as image
    img.src = src;
    img.alt = 'Certificate';
    // Ensure inner wrapper has expected structure in case it was replaced earlier
    var inner = lb.querySelector('.cert-lb-inner');
    if (inner && !inner.querySelector('img')) {
        inner.innerHTML = '<button class="cert-lb-close" onclick="closeLightbox(event)">&times;</button><img id="certLbImg" src="' + src + '" alt="Certificate">';
    }
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox(e) {
    // Only close when clicking the overlay background OR the close button
    // Don't close when clicking inside the image itself
    if (e && e.target && e.target.closest) {
        var inner = e.target.closest('.cert-lb-inner');
        var closeBtn = e.target.closest('.cert-lb-close');
        // Clicked inside the inner box but NOT on the close button → do nothing
        if (inner && !closeBtn) return;
    }
    var lb = document.getElementById('certLightbox');
    if (lb) lb.classList.remove('active');
    document.body.style.overflow = '';
}

//Certificates Image Preview (uploaded to Cloudinary on submit, see addCertificate())
var certImageFile = null;
function previewCertImage(input) {
    if (input.files && input.files[0]) {
        certImageFile = input.files[0];
        var lbl = document.getElementById('cert-img-label');
        if (lbl) lbl.textContent = input.files[0].name;
        var up = document.getElementById('uploadArea');
        if (up) up.style.borderColor = 'var(--accent)';
    }
}

// Builds a .cert-thumb element from Firestore-shaped data (also used to
// render the initial Firestore read further down this file).
function buildCertThumb(p) {
    var thumb = document.createElement('div');
    thumb.className = 'cert-thumb';
    if (p.id) thumb.dataset.id = p.id;
    var src = p.imageUrl;
    thumb.setAttribute('onclick', "openLightbox('" + src.replace(/'/g, "\\'") + "')");
    thumb.innerHTML = '<img src="' + src + '" alt="' + escapeHtml(p.title) + '">';
    // Only Firestore-backed thumbs (real doc id) are deletable - the static
    // seed thumbs aren't tied to a document yet.
    if (p.id) thumb.appendChild(addDelBtn(thumb, removeCert, 'cert-del-btn'));
    return thumb;
}


// Award image preview
var awardImageData = '';
function previewAwardImage(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            awardImageData = e.target.result;
            document.getElementById('award-img-label').textContent = input.files[0].name;
            document.getElementById('awardUploadArea').style.borderColor = 'var(--accent2, #22d3ee)';
        };
        reader.readAsDataURL(input.files[0]);
    }
}


//Icon Picker selection
(function () {
    document.addEventListener('click', function (e) {
        var opt = e.target.closest('#awardiconPicker div');
        if (!opt) return;
        document.querySelectorAll('#awardiconPicker div').forEach(function (o) { o.classList.remove('selected'); });
        opt.classList.add('selected');
    });
})();


// Add certificate
// addCertificate() called from HTML onclick attribute.
function addCertificate() {
    var titleEl = document.getElementById('cert-title');
    var title = titleEl ? titleEl.value.trim() : '';
    if (!title) { showToast('Certificate title is required.', 'error'); return; }
    var topic = document.getElementById('cert-topic').value.trim();
    var author = document.getElementById('cert-author').value.trim();
    var desc = document.getElementById('cert-desc').value.trim();
    var imageFile = certImageFile;

    var submitBtn = document.querySelector('#addCertModal .modal-actions .btn-primary');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Saving...'; }

    import('/JavaScript/data-certificates.js').then(function (m) {
        var uploadP = imageFile ? m.uploadCertificateImage(imageFile) : Promise.resolve('/Images/website_images/software testing.png');
        return uploadP.then(function (imageUrl) {
            var data = { title: title, topic: topic, author: author, description: desc, imageUrl: imageUrl };
            return m.addCertificateDoc(data).then(function (id) {
                data.id = id;
                return data;
            });
        });
    }).then(function (data) {
        var certGrid = document.getElementById('certsGrid');
        if (certGrid) certGrid.insertBefore(buildCertThumb(data), certGrid.firstChild);

        document.getElementById('cert-title').value = '';
        document.getElementById('cert-topic').value = '';
        document.getElementById('cert-author').value = '';
        document.getElementById('cert-desc').value = '';
        document.getElementById('cert-img').value = '';
        document.getElementById('cert-img-label').textContent = 'Click to upload certificate image';
        document.getElementById('uploadArea').style.borderColor = '';
        certImageFile = null;
        closeModal('addCertModal');
        showToast('Certificate added!', 'success');
    }).catch(function () {
        showToast('Failed to add certificate - check you are signed in as admin.', 'error');
    }).then(function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Add Certificate'; }
    });
}

// Add Award
// addAward() called from modal onclick
function addAward() {
    var title = document.getElementById('award-title').value.trim();
    if (!title) { showToast('Award title is required.', 'error'); return; }

    var org = document.getElementById('award-org').value.trim();
    var desc = document.getElementById('award-desc').value.trim();

    //get selected icon + color class from picker
    var selected = document.querySelector('#awardiconPicker .selected');
    var icon = selected ? selected.getAttribute('data-icon') : 'fa-trophy';
    var cls = selected ? (selected.getAttribute('data-cls') || '') : '';

    var grid = document.querySelector('#achProf .ach-award-grid');
    if (!grid) return;

    var imgHTML = '';
    if (awardImageData) {
        var safeData = awardImageData.replace(/'/g, "\\'");
        imgHTML = '<div class="ach-award-img" onclick="openLightbox(\'' + safeData + '\')"><img src="' + awardImageData + '" alt="' + escapeHtml(title) + '"><span>VIEW</span></div>';
    }

    var card = document.createElement('div');
    card.className = 'ach-award-card';
    card.innerHTML =
        '<div class="ach-award-badge ' + cls + '"><i class="fas ' + icon + '"></i></div>' +
        '<div class="ach-award-info">' +
        (org ? '<span class="ach-award-org">' + escapeHtml(org) + '</span>' : '') +
        '<h4 class="ach-award-title">' + escapeHtml(title) + '</h4>' +
        (desc ? '<p class="ach-award-desc">' + escapeHtml(desc) + '</p>' : '') +
        '</div>' +
        imgHTML;

    card.appendChild(addDelBtn(card, removeAward, 'ach-card-del'));
    grid.insertBefore(card, grid.firstChild);

    //Reset form
    document.getElementById('award-title').value = '';
    document.getElementById('award-org').value = '';
    document.getElementById('award-desc').value = '';
    document.getElementById('award-img').value = '';
    document.getElementById('award-img-label').textContent = 'Click to upload award image (optional)';
    document.getElementById('awardUploadArea').style.borderColor = '';
    awardImageData = '';

    //Reset icon selection back to first option
    document.querySelectorAll('#awardiconPicker div').forEach(function (opt, i) {
        opt.classList.toggle('selected', i === 0);
    });

    closeModal('addAwardModal');
    showToast('Award added!', 'success');
    //Recheck carousel after adding a new card
    if (typeof window._checkAwardCarousel == 'function') {
        setTimeout(window._checkAwardCarousel, 50);
    }
}

// Remove Helpers
function removeAward(card) {
    card.style.transition = 'opacity 0.28s, transform 0.28s';
    card.style.opacity = '0';
    card.style.transform = 'scale(0.86)';
    setTimeout(function () {
        if (card.parentNode) card.remove();
        if (typeof window._checkAwardCarousel === 'function') window._checkAwardCarousel();
    }, 310);
}

function removeCert(thumb) {
    var id = thumb.dataset.id;
    thumb.style.transition = 'opacity 0.28s, transform 0.28s';
    thumb.style.opacity = '0';
    thumb.style.transform = 'scale(0.82)';
    setTimeout(function () { if (thumb.parentNode) thumb.remove(); }, 300);

    if (id) {
        import('/JavaScript/data-certificates.js')
            .then(function (m) { return m.deleteCertificateDoc(id); })
            .catch(function () { showToast('Failed to delete on the server - it may reappear on reload.', 'error'); });
    }
}

// delete button factory
//Returns a x button wired to removeFn(parent) on click

function addDelBtn(parent, removeFn, cls) {
    var btn = document.createElement('button');
    btn.innerHTML = '&times;';
    btn.title = 'Remove';
    btn.className = cls || '';
    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        removeFn(parent);
    });
    return btn;
}

// INIT : WIRED DELETE BUTTONS
// Awards are still session-only (next phase). Certificates: these wire up
// the static seed thumbnails already in index.html; if Firestore has real
// certificates the block below replaces certsGrid's content entirely
// before this matters.
(function () {
    document.querySelectorAll('#achProf .ach-award-grid .ach-award-card').forEach(function (card) {
        card.appendChild(addDelBtn(card, removeAward, 'ach-card-del'));
    });
    document.querySelectorAll('#certsGrid .cert-thumb').forEach(function (thumb) {
        thumb.appendChild(addDelBtn(thumb, removeCert, 'cert-del-btn'));
    });
})();

// Initial load: Firestore is the source of truth once it has data; the
// static thumbnails already in index.html are only a first-load/offline seed.
(function () {
    var certGrid = document.getElementById('certsGrid');
    if (!certGrid) return;

    import('/JavaScript/data-certificates.js').then(function (m) {
        return m.getCertificates();
    }).then(function (certs) {
        if (certs && certs.length) {
            certGrid.innerHTML = '';
            certs.forEach(function (c) { certGrid.appendChild(buildCertThumb(c)); });
        }
    }).catch(function () {
        // Offline or Firestore error - keep the static seed thumbnails already on the page
    });
})();

//================================================================
//              AWARD AUTO-SCROLL CAROUSEL
// Automatically enables a snake-scroll carousel when the awards grid
// would be too tall to fit in one screen-frame (~3 rows).
// Row 1 scrolls LEFT, row 2 scrolls RIGHT, row 3 LEFT .... (alternating).
// Hovers pause the animation so the user can read / delete cards.
// Automatically disables and returns to the normal grid when enough
// cards are removed that they fit again.
//==================================================================
(function () {
    var _active = false;
    var _busy = false; //re-entrancy guard during DOM rebuilds

    //How many grid columns the CSS uses at this viewport width
    function colCount() {
        return window.innerWidth <= 768 ? 1 : 2;
    }

    //Count only real (non-clone) award cards whenever they live
    function realCount() {
        var grid = document.querySelector('#achProf .ach-award-grid');
        if (!grid) return 0;
        return grid.querySelectorAll('.ach-award-card:not(.ach-clone)').length;
    }

    //carousel needed when cards would full more than 3 rows
    // Only enable carousel on mobile/tablet viewports (<=1024px)
    function shouldEnable() {
        if (window.innerWidth > 1024) return false; // desktop: never auto-scroll
        return realCount() > colCount() * 3;
    }

    //--------------- ENABLE
    function enable() {
        _busy = true;
        var grid = document.querySelector('#achProf .ach-award-grid');
        if (!grid) { _busy = false; return; }

        //Gather originals (they may already be in strips if rebuilding)
        var cards = Array.from(grid.querySelectorAll('.ach-award-card:not(.ach-clone)'));
        var cols = colCount();

        //Wipe current content (strips or flat cards)
        grid.innerHTML = '';
        grid.classList.add('carousel-mode');

        //Add indicator badge
        var badge = document.createElement('div');
        badge.className = 'award-carousel-badge';
        badge.id = 'awardCarouselBadge';
        badge.innerHTML = '<i class="fas fa-sync-alt"></i> Auto-scroll';
        grid.appendChild(badge);

        //Slice cards into rows of `cols` and build one strip per row
        for (var r = 0; r < cards.length; r += cols) {
            var rowCards = cards.slice(r, r + cols);

            var strip = document.createElement('div');
            strip.className = 'award-strip';

            var track = document.createElement('div');
            track.className = 'award-track ' + (Math.floor(r / cols) % 2 === 0 ? 'dir-left' : 'dir-right');
            track.style.setProperty('--n', String(rowCards.length));

            //Original cards first
            rowCards.forEach(function (c) { track.appendChild(c); });

            //Clone duplicates for seamless infinite loop
            rowCards.forEach(function (c) {
                var clone = c.cloneNode(true);
                clone.classList.add('ach-clone');
                clone.setAttribute('aria-hidden', 'true');
                // Disable all interaction on clones.
                clone.style.pointerEvents = 'none';
                track.appendChild(clone);
            });

            strip.appendChild(track);
            grid.appendChild(strip);
        }

        // FIX: store cols under consistent key; was "carousel", read as "carouselCols"
        grid.dataset.carouselCols = String(cols);
        _active = true;
        _busy = false; // FIX: was incorrectly set to true, permanently blocking all future checks
    }

    //----------------------- DISABLE
    function disable() {
        _busy = true;
        var grid = document.querySelector('#achProf .ach-award-grid');
        if (!grid) { _busy = false; return; }

        // Rescue originals from inside tracks before clearing
        var cards = Array.from(grid.querySelectorAll('.ach-award-card:not(.ach-clone)'));

        grid.classList.remove('carousel-mode');
        grid.innerHTML = '';

        cards.forEach(function (c) { grid.appendChild(c); });

        _active = false;
        _busy = false;
    }

    //---- CHECK (called externally via window._checkAwardCarousel)
    // FIX: was nested inside enable(), so it was never defined until enable() ran,
    // and window._checkAwardCarousel was never registered on page load.
    function check() {
        if (_busy) return;
        var cols = colCount();
        if (shouldEnable()) {
            // Rebuilds if not active, or if columns changed (e.g. resize)
            var grid = document.querySelector('#achProf .ach-award-grid');
            var prevCols = grid ? parseInt(grid.dataset.carouselCols || '0', 10) : 0;
            if (!_active || prevCols !== cols) {
                enable();
            }
        } else {
            if (_active) disable();
        }
    }

    //Expose so removeAward() and addAward() can trigger a recheck
    window._checkAwardCarousel = check;

    // Recheck on window resize (column count may change)
    var _resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(_resizeTimer);
        _resizeTimer = setTimeout(check, 280);
    });

    //Initial check after DOM is settled
    setTimeout(check, 0);
})();