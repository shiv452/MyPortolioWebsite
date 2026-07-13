// data-projects.js - Firestore + Cloudinary access for the Projects section.
// Loaded via dynamic import() from projects.js (which stays a classic script
// so its functions remain reachable from inline onclick="" attributes in HTML).
import { db } from "/firebase-config.js";
import {
    collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const CLOUD_NAME = 'wpebvbjp';
const UPLOAD_PRESET = 'portfolio_unsigned';

export async function getProjects() {
    var q = query(collection(db, 'projects'), orderBy('createdAt', 'asc'));
    var snap = await getDocs(q);
    return snap.docs.map(function (d) { return Object.assign({ id: d.id }, d.data()); });
}

export async function addProjectDoc(data) {
    var ref = await addDoc(collection(db, 'projects'), Object.assign({}, data, { createdAt: serverTimestamp() }));
    return ref.id;
}

export function deleteProjectDoc(id) {
    return deleteDoc(doc(db, 'projects', id));
}

export async function uploadProjectImage(file) {
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
