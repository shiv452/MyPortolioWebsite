// data-profile.js - Firestore + Cloudinary access for the About-page profile photo.
// A single doc (profile/main) rather than a collection, since there's only
// ever one photo. Loaded via dynamic import() from about.js.
import { db } from "/firebase-config.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const CLOUD_NAME = 'wpebvbjp';
const UPLOAD_PRESET = 'portfolio_unsigned';

export async function getProfilePhoto() {
    var snap = await getDoc(doc(db, 'profile', 'main'));
    return snap.exists() ? snap.data().photoUrl : null;
}

export function setProfilePhoto(photoUrl) {
    return setDoc(doc(db, 'profile', 'main'), { photoUrl: photoUrl }, { merge: true });
}

export async function uploadProfilePhoto(file) {
    var form = new FormData();
    form.append('file', file);
    form.append('upload_preset', UPLOAD_PRESET);
    var res = await fetch('https://api.cloudinary.com/v1_1/' + CLOUD_NAME + '/image/upload', {
        method: 'POST',
        body: form
    });
    if (!res.ok) throw new Error('Cloudinary upload failed');
    var json = await res.json();
    return json.secure_url;
}
