// firebase-config.js
// Firebase Web SDK loaded straight from Google's CDN as ES modules -
// no npm/bundler, matching this project's zero-build-step architecture.
// This config is Firebase's public web config, not a secret: it's safe
// to commit. Authorization is enforced by Firestore Security Rules and
// Firebase Auth, not by hiding these values.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAPh1Nd1LdGpXUKK9UDn5YCS_nFzB1ATZA",
    authDomain: "shivam-portfolio-edbe0.firebaseapp.com",
    projectId: "shivam-portfolio-edbe0",
    storageBucket: "shivam-portfolio-edbe0.firebasestorage.app",
    messagingSenderId: "801318464624",
    appId: "1:801318464624:web:42164e1a2f1b560dcad8b5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
