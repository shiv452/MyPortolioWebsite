// =========================================================
// auth.js - Admin authentication (Firebase Auth)
// Single owner account, no public sign-up. Signing in toggles
// body.is-admin, which style.css uses to reveal the add/upload/
// delete controls that already exist throughout the page.
// =========================================================
import { auth } from "/firebase-config.js";
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

onAuthStateChanged(auth, function (user) {
    document.body.classList.toggle('is-admin', !!user);
});

(function () {
    var entryBtn = document.getElementById('adminEntry');
    var signOutBtn = document.getElementById('adminSignOutBtn');
    var form = document.getElementById('adminLoginForm');

    if (entryBtn) {
        entryBtn.addEventListener('click', function () { openModal('adminLoginModal'); });
    }

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var email = document.getElementById('admin-email').value.trim();
            var password = document.getElementById('admin-password').value;
            signInWithEmailAndPassword(auth, email, password)
                .then(function () {
                    form.reset();
                    closeModal('adminLoginModal');
                    showToast('Signed in as admin', 'success');
                })
                .catch(function () {
                    showToast('Sign-in failed - check email/password', 'error');
                });
        });
    }

    if (signOutBtn) {
        signOutBtn.addEventListener('click', function () {
            signOut(auth).then(function () { showToast('Signed out', 'success'); });
        });
    }
})();
