// data-certificates.js - Firestore + Cloudinary access for the Certificates section.
// Loaded via dynamic import() from achievements.js (kept a classic script so its
// functions remain reachable from inline onclick="" attributes in HTML).
import { db } from "/firebase-config.js";
import {
    collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const CLOUD_NAME = 'wpebvbjp';
const UPLOAD_PRESET = 'portfolio_unsigned';

export async function getCertificates() {
    // desc: addCertificate() always inserted new certs at the front - keep that order
    var q = query(collection(db, 'certificates'), orderBy('createdAt', 'desc'));
    var snap = await getDocs(q);
    return snap.docs.map(function (d) { return Object.assign({ id: d.id }, d.data()); });
}

export async function addCertificateDoc(data) {
    var ref = await addDoc(collection(db, 'certificates'), Object.assign({}, data, { createdAt: serverTimestamp() }));
    return ref.id;
}

export function deleteCertificateDoc(id) {
    return deleteDoc(doc(db, 'certificates', id));
}

export async function uploadCertificateImage(file) {
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
