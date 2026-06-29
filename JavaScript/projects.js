// ===============================================================
// Projects.js - Projects section
// Add-project modal logic and infinite auto-scroll carousel
//===============================================================

// ------ Add project image preview
var projImageData = '';
function previewProjImage(input) {
    if(input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            projImageData = e.target.result;
            document.getElementById('proj-img-label').textContent = input.files[0].name;
            document.getElementById('projImgUploadArea').style.borderColor = 'var(--accent)';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// ----------- Add project 
// addProject() called form HTML onclick attribute
function addProject() {
    var title = document.getElementById('proj-title').value.trim();
    if(!title) { showToast('Project title is required.', 'error'); return; }
    var tagsRaw = document.getElementById('proj-tags').value.trim();
    var desc = document.getElementById('proj-desc').value.trim();
    var link = document.getElementById('proj-link').value.trim();
    var imgUrl = projImageData || '/Images/website_images/web-development.png';
    var tags = tagsRaw
    ? tagsRaw.split(',').map(function (t) { return '<span class="tag">' + t.trim() + '</span>'; }).join('') : '';
    var linkHtml = link? '<a href="' + link + '" target="_blank" rel="noopener noreferrer"><i class="fas fa-external-link-alt"></i></a>' : '';

    var card = document.createElement('div');
    card.className = 'work';
    card.innerHTML = 
        '<img src="' + imgUrl + '" alt="' + title + '">' +
        '<div class="layer">' +
            '<div class="layer-tags">' + tags + '</div>' +
            '<h3>' + title + '</h3>' +
            '<p>' + desc +'</p>' +
            linkHtml +
        '</div>';

    document.getElementById('workTrack').appendChild(card);

    ['proj-title', 'proj-tags', 'proj-desc', 'proj-link'].forEach(function (id) {
        document.getElementById(id).value = '';
    });
    document.getElementById('proj-img-file').value = '';
    document.getElementById('proj-img-label').textContent = 'Click to upload projects image (optional)';
    document.getElementById('projImgUploadArea').style.borderColor = '';
    projImageData = '';
    closeModal('addProjectModal');
    showToast('Project added successfully!', 'success');
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

    // Duplicate original cards for seamless infinite loop
    var origCards = Array.from(grid.querySelectorAll('.work'));
    origCards.forEach(function (card) {
        var clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        // remove delete button clones -- only originals are deletable
        var delBtn = clone.querySelector('.ach-card-del');
        if (delBtn) delBtn.remove();
        grid.appendChild(clone);
    });

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