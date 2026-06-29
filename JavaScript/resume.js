// =========================================
// resume.js - Resume download + custom resume upload manger
// downloadResume() is called form HTML onclick attribute
// =========================================

// ========= DOWNLOAD
function downloadResume() {
    const selected = document.getElementById('resumeSelect').value;
    if (!selected) {
        alert('Please select a resume first');
        return;
    }

    const filename = selected.split('/').pop();
    const link = document.createElement('a');
    link.href = selected;
    link.download = filename;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    setTimeout(function () { document.body.removeChild(link); }, 100);
}

// =============== Upload + Delete (session-only)
// Everything is session-only for now-Firebase will make it permanent 
(function () {
    var sel = document.getElementById('resumeSelect');

    function syncDeleteBtn() {
        var btn = document.getElementById('resumeDeleteBtn');
        if (!btn || !sel) return;
        var opt = sel.options[sel.selectedIndex];
        btn.style.display = (opt && opt.value) ? 'flex' : 'none';
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
            var reader = new FileReader();
            reader.onload = function (ev) {
                var name = file.name.replace(/\.pdf$/i, '');
                if (sel) {
                    var opt = document.createElement('option');
                    opt.value = ev.target.result;
                    opt.textContent = name + ' (uploaded)';
                    opt.dataset.uploaded = '1';
                    sel.appendChild(opt);
                    sel.value = ev.target.result;
                    syncDeleteBtn();
                }
                showToast('"' + name + '" uploaded - select it and click Download!', 'success');
            };
            reader.readAsDataURL(file);
            this.value = '';
        });
    }
})();

//=========== Delete Resume (session-only)=======
function deleteUploadResume() {
    var sel = document.getElementById('resumeSelect');
    if (!sel) return;
    var opt = sel.options[sel.selectedIndex];
    if (!opt || !opt.value) return;

    var name = opt.textContent.replace(/\s*\(uploaded\)$/, '');
    if (!confirm('Remove "' + name + '" from the list?')) return;

    opt.remove();
    sel.value = '';
    var btn = document.getElementById('resumeDeleteBtn');
    if (btn) btn.style.display = 'none';
    showToast('"' + name + '" removed.', 'success');
}