// ===============================================================
// Projects.js - Projects section
// Firestore-backed project cards (Cloudinary-hosted images), with the
// static cards already in index.html as an offline/first-load fallback,
// plus the infinite auto-scroll carousel.
//===============================================================

// ------ Add project image selection (uploaded to Cloudinary on submit)
var projImageFile = null;
function previewProjImage(input) {
    if (input.files && input.files[0]) {
        projImageFile = input.files[0];
        document.getElementById('proj-img-label').textContent = input.files[0].name;
        document.getElementById('projImgUploadArea').style.borderColor = 'var(--accent)';
    }
}

// ----------- Build a project card element from Firestore-shaped data
// (also used to render the initial Firestore read)
function buildProjectCard(p) {
    var card = document.createElement('div');
    card.className = 'work';
    if (p.id) card.dataset.id = p.id;

    var tagsHtml = (p.tags || []).map(function (t) { return '<span class="tag">' + escapeHtml(t) + '</span>'; }).join('');
    var linkHtml = p.link ? '<a href="' + escapeHtml(p.link) + '" target="_blank" rel="noopener noreferrer"><i class="fas fa-external-link-alt"></i></a>' : '';

    card.innerHTML =
        '<img src="' + (p.imageUrl || '/Images/website_images/web-development.png') + '" alt="' + escapeHtml(p.title) + '">' +
        '<div class="layer">' +
        '<div class="layer-tags">' + tagsHtml + '</div>' +
        '<h3>' + escapeHtml(p.title) + '</h3>' +
        '<p>' + escapeHtml(p.description || '') + '</p>' +
        linkHtml +
        '</div>';

    // Only Firestore-backed cards (real doc id) are deletable - the static
    // seed cards aren't tied to a document yet.
    if (p.id) card.appendChild(addDelBtn(card, removeProjectCard, 'ach-card-del'));
    return card;
}

function removeProjectCard(card) {
    var id = card.dataset.id;
    card.style.transition = 'opacity 0.28s, transform 0.28s';
    card.style.opacity = '0';
    card.style.transform = 'scale(0.86)';
    setTimeout(function () {
        if (card.parentNode) card.remove();
        if (window._rebuildProjectCarousel) window._rebuildProjectCarousel();
    }, 310);

    if (id) {
        import('/JavaScript/data-projects.js')
            .then(function (m) { return m.deleteProjectDoc(id); })
            .catch(function () { showToast('Failed to delete on the server - it may reappear on reload.', 'error'); });
    }
}

// ----------- Add project
// addProject() called form HTML onclick attribute
function addProject() {
    var title = document.getElementById('proj-title').value.trim();
    if (!title) { showToast('Project title is required.', 'error'); return; }
    var tagsRaw = document.getElementById('proj-tags').value.trim();
    var desc = document.getElementById('proj-desc').value.trim();
    var link = document.getElementById('proj-link').value.trim();
    var safeLink = /^https?:\/\//i.test(link) ? link : ''; // blocks javascript: URI injection
    var tags = tagsRaw ? tagsRaw.split(',').map(function (t) { return t.trim(); }).filter(Boolean) : [];
    var imageFile = projImageFile;

    var submitBtn = document.querySelector('#addProjectModal .modal-actions .btn-primary');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Saving...'; }

    import('/JavaScript/data-projects.js').then(function (m) {
        var uploadP = imageFile ? m.uploadProjectImage(imageFile) : Promise.resolve('/Images/website_images/web-development.png');
        return uploadP.then(function (imageUrl) {
            var data = { title: title, description: desc, tags: tags, link: safeLink, imageUrl: imageUrl };
            return m.addProjectDoc(data).then(function (id) {
                data.id = id;
                return data;
            });
        });
    }).then(function (data) {
        document.getElementById('workTrace').appendChild(buildProjectCard(data));
        if (window._rebuildProjectCarousel) window._rebuildProjectCarousel();

        ['proj-title', 'proj-tags', 'proj-desc', 'proj-link'].forEach(function (id) {
            document.getElementById(id).value = '';
        });
        document.getElementById('proj-img-file').value = '';
        document.getElementById('proj-img-label').textContent = 'Click to upload project image (optional)';
        document.getElementById('projImgUploadArea').style.borderColor = '';
        projImageFile = null;
        closeModal('addProjectModal');
        showToast('Project added successfully!', 'success');
    }).catch(function () {
        showToast('Failed to add project - check you are signed in as admin.', 'error');
    }).then(function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Add Project'; }
    });
}

//------ Infinite auto-scroll carousel
(function () {
    var grid = document.getElementById('workTrace') || document.getElementById('workTrack');
    if (!grid) return;

    // If already wrapped by markup, use the existing wrapper (.project-scroll-wrap)
    var wrap = grid.parentNode && grid.parentNode.classList && grid.parentNode.classList.contains('project-scroll-wrap') ? grid.parentNode : null;
    if (!wrap) {
        wrap = document.createElement('div');
        wrap.className = 'project-scroll-wrap';
        grid.parentNode.insertBefore(wrap, grid);
        wrap.appendChild(grid);
    }

    var origCards = [];

    // Rebuilds the cloned tail used for the seamless infinite loop.
    // Re-run after the Firestore load replaces the seed cards, and after
    // every add/delete, so the loop always matches what's really on screen.
    function rebuildClones() {
        Array.from(grid.querySelectorAll('.work[aria-hidden="true"]')).forEach(function (c) { c.remove(); });
        origCards = Array.from(grid.querySelectorAll('.work'));
        origCards.forEach(function (card) {
            var clone = card.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            var delBtn = clone.querySelector('.ach-card-del');
            if (delBtn) delBtn.remove();
            grid.appendChild(clone);
        });
        grid.scrollLeft = 0;
    }
    window._rebuildProjectCarousel = rebuildClones;

    // Auto-scroll engine - requestAnimationFrame loop
    var speed = 0.55;
    var paused = false;

    function trackWidth() {
        var first = grid.querySelector('.work');
        return first ? origCards.length * (first.offsetWidth + 28) : 0;
    }

    function tick() {
        if (!paused) {
            grid.scrollLeft += speed;
            var tw = trackWidth();
            if (tw > 0 && grid.scrollLeft >= tw) {
                grid.scrollLeft = 0;
            }
        }
        requestAnimationFrame(tick);
    }

    rebuildClones();
    requestAnimationFrame(tick);

    // Pause scrolling while cursor is over the carousel
    grid.addEventListener('mouseenter', function () { paused = true; });
    grid.addEventListener('mouseleave', function () { paused = false; });

    // Provide a global bridge for the existing HTML arrow buttons (which call scrollProjects)
    window.scrollProjects = function (dir) {
        var card = grid.querySelector('.work');
        var amt = card ? card.offsetWidth + 28 : 448;
        paused = true;
        var mul = (dir === 'prev' || dir === -1) ? -1 : 1;
        grid.scrollBy({ left: mul * amt, behavior: 'smooth' });
        setTimeout(function () { paused = false; }, 900);
    };
})();

// ------ Initial load: Firestore is the source of truth once it has data;
// the static cards already in index.html are only a first-load/offline seed.
(function () {
    var grid = document.getElementById('workTrace');
    if (!grid) return;

    import('/JavaScript/data-projects.js').then(function (m) {
        return m.getProjects();
    }).then(function (projects) {
        if (projects && projects.length) {
            grid.innerHTML = '';
            projects.forEach(function (p) { grid.appendChild(buildProjectCard(p)); });
        }
    }).catch(function () {
        // Offline or Firestore error - keep the static seed cards already on the page
    }).then(function () {
        if (window._rebuildProjectCarousel) window._rebuildProjectCarousel();
    });
})();
