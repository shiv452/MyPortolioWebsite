// =========================================================
// auth.js - Admin authentication (Firebase Auth)
// Single owner account, no public sign-up. Signing in toggles
// body.is-admin, which style.css uses to reveal the add/upload/
// delete controls that already exist throughout the page.
// =========================================================
import { auth } from "/firebase-config.js";
import {
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    reauthenticateWithCredential,
    updatePassword,
    EmailAuthProvider,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

onAuthStateChanged(auth, function (user) {
    document.body.classList.toggle('is-admin', !!user);
});

(function () {
    var entryBtn = document.getElementById('adminEntry');
    var signOutBtn = document.getElementById('adminSignOutBtn');
    var changePasswordBtn = document.getElementById('changePasswordBtn');
    var forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
    var form = document.getElementById('adminLoginForm');
    var changeForm = document.getElementById('changePasswordForm');

    if (entryBtn) {
        entryBtn.addEventListener('click', function () { openModal('adminLoginModal'); });
    }

    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', function () { openModal('changePasswordModal'); });
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

    if (forgotPasswordBtn) {
        forgotPasswordBtn.addEventListener('click', function () {
            var emailInput = document.getElementById('admin-email');
            var email = emailInput ? emailInput.value.trim() : '';

            if (!email) {
                showToast('Enter your admin email first', 'error');
                if (emailInput) emailInput.focus();
                return;
            }

            forgotPasswordBtn.disabled = true;
            sendPasswordResetEmail(auth, email)
                .then(function () {
                    showToast('Password reset email sent. Check your inbox.', 'success');
                    closeModal('adminLoginModal');
                })
                .catch(function (error) {
                    var message = error.code === 'auth/user-not-found'
                        ? 'No admin account found for that email'
                        : 'Could not send reset email';
                    showToast(message, 'error');
                })
                .finally(function () {
                    forgotPasswordBtn.disabled = false;
                });
        });
    }

    if (changeForm) {
        changeForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var user = auth.currentUser;
            if (!user) {
                showToast('Sign in again before changing the password', 'error');
                return;
            }

            var currentPassword = document.getElementById('change-current-password').value;
            var newPassword = document.getElementById('change-new-password').value;
            var confirmPassword = document.getElementById('change-confirm-password').value;

            if (newPassword !== confirmPassword) {
                showToast('New passwords do not match', 'error');
                return;
            }
            if (newPassword.length < 6) {
                showToast('Password must be at least 6 characters', 'error');
                return;
            }

            var credential = EmailAuthProvider.credential(user.email, currentPassword);
            reauthenticateWithCredential(user, credential)
                .then(function () { return updatePassword(user, newPassword); })
                .then(function () {
                    changeForm.reset();
                    closeModal('changePasswordModal');
                    showToast('Password changed successfully', 'success');
                })
                .catch(function (error) {
                    var message = error.code === 'auth/wrong-password'
                        ? 'Current password is incorrect'
                        : 'Could not change password';
                    showToast(message, 'error');
                });
        });
    }

    if (signOutBtn) {
        signOutBtn.addEventListener('click', function () {
            signOut(auth).then(function () { showToast('Signed out', 'success'); });
        });
    }
})();
