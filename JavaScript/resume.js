// =========================================
// resume.js - Resume download + custom resume upload manager
// downloadResume() is called form HTML onclick attribute
// Uploaded resumes persist via Firestore + Cloudinary; the 4 built-in
// resumes hard-coded in index.html's <select> are static, not editable.
// =========================================

// ========= DOWNLOAD
function downloadResume() {
    const selected = document.getElementById('resumeSelect').value;
    if (!selected) {
        alert('Please select a resume first');
        return;
    }

    // Cloudinary-hosted files need fl_attachment to force a real download -
    // browsers otherwise ignore the `download` attribute on cross-origin
    // links and just navigate to the PDF inline instead.
    var href = selected;
    if (href.indexOf('res.cloudinary.com') !== -1 && href.indexOf('/upload/') !== -1) {
        href = href.replace('/upload/', '/upload/fl_attachment/');
    }

    const filename = selected.split('/').pop().split('?')[0];
    const link = document.createElement('a');
    link.href = href;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    setTimeout(function () { document.body.removeChild(link); }, 100);
}

// Builds a <option> for an uploaded (Firestore-backed) resume - also used
// to render the initial Firestore read further down this file.
function buildResumeOption(p) {
    var opt = document.createElement('option');
    opt.value = p.fileUrl;
    opt.textContent = p.name + ' (uploaded)';
    opt.dataset.uploaded = '1';
    if (p.id) opt.dataset.id = p.id;
    return opt;
}

// =============== Upload + Delete (Firestore + Cloudinary)
(function () {
    var sel = document.getElementById('resumeSelect');

    function syncDeleteBtn() {
        var btn = document.getElementById('resumeDeleteBtn');
        if (!btn || !sel) return;
        var opt = sel.options[sel.selectedIndex];
        // Only uploaded (Firestore-backed) resumes are deletable, not the
        // built-in static ones - they share the same <option> value shape,
        // so this is what actually distinguishes them.
        btn.style.display = (opt && opt.dataset.uploaded === '1') ? 'flex' : 'none';
    }

    if (sel) sel.addEventListener('change', syncDeleteBtn);
    syncDeleteBtn();

    var uploadInput = document.getElementById('resumeUploadInput');
    if (uploadInput) {
        uploadInput.addEventListener('change', function (e) {
            var file = e.target.files[0];
            if (!file) return;
            if (file.size > 8 * 1024 * 1024) {
                showToast('File too large (max 8 MB)', 'error'); this.value = ''; return;
            }
            var name = file.name.replace(/\.pdf$/i, '');
            this.value = '';

            showToast('Uploading "' + name + '"...', 'success');
            import('/JavaScript/data-resume.js').then(function (m) {
                return m.uploadResumeFile(file).then(function (fileUrl) {
                    return m.addResumeFileDoc({ name: name, fileUrl: fileUrl }).then(function (id) {
                        return { id: id, name: name, fileUrl: fileUrl };
                    });
                });
            }).then(function (data) {
                if (sel) {
                    sel.appendChild(buildResumeOption(data));
                    sel.value = data.fileUrl;
                    syncDeleteBtn();
                }
                showToast('"' + name + '" uploaded - select it and click Download!', 'success');
            }).catch(function () {
                showToast('Upload failed - check you are signed in as admin.', 'error');
            });
        });
    }
})();

//=========== Delete Resume (Firestore + Cloudinary) =======
function deleteUploadResume() {
    var sel = document.getElementById('resumeSelect');
    if (!sel) return;
    var opt = sel.options[sel.selectedIndex];
    if (!opt || opt.dataset.uploaded !== '1') return;

    var name = opt.textContent.replace(/\s*\(uploaded\)$/, '');
    if (!confirm('Remove "' + name + '" from the list?')) return;

    var id = opt.dataset.id;
    opt.remove();
    sel.value = '';
    var btn = document.getElementById('resumeDeleteBtn');
    if (btn) btn.style.display = 'none';
    showToast('"' + name + '" removed.', 'success');

    if (id) {
        import('/JavaScript/data-resume.js')
            .then(function (m) { return m.deleteResumeFileDoc(id); })
            .catch(function () { showToast('Failed to delete on the server - it may reappear on reload.', 'error'); });
    }
}

// Initial load: append any Firestore-persisted uploaded resumes to the
// select, alongside the static built-in options already in index.html.
(function () {
    var sel = document.getElementById('resumeSelect');
    if (!sel) return;

    import('/JavaScript/data-resume.js').then(function (m) {
        return m.getResumeFiles();
    }).then(function (files) {
        files.forEach(function (f) { sel.appendChild(buildResumeOption(f)); });
    }).catch(function () {
        // Offline or Firestore error - just the static built-in options remain
    });
})();
