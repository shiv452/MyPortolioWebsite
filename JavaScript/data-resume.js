// data-resume.js - Firestore + Cloudinary access for uploaded resume files.
// The 4 built-in resumes hard-coded in index.html's <select> are static
// assets, not managed here - only owner-uploaded resumes are persisted.
// Loaded via dynamic import() from resume.js (kept a classic script so its
// functions remain reachable from inline onclick="" attributes in HTML).
import { db } from "/firebase-config.js";
import {
    collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const CLOUD_NAME = 'wpebvbjp';
const UPLOAD_PRESET = 'portfolio_unsigned';

export async function getResumeFiles() {
    var q = query(collection(db, 'resumeFiles'), orderBy('createdAt', 'asc'));
    var snap = await getDocs(q);
    return snap.docs.map(function (d) { return Object.assign({ id: d.id }, d.data()); });
}

export async function addResumeFileDoc(data) {
    var ref = await addDoc(collection(db, 'resumeFiles'), Object.assign({}, data, { createdAt: serverTimestamp() }));
    return ref.id;
}

export function deleteResumeFileDoc(id) {
    return deleteDoc(doc(db, 'resumeFiles', id));
}

export async function uploadResumeFile(file) {
    var form = new FormData();
    form.append('file', file);
    form.append('upload_preset', UPLOAD_PRESET);
    // Cloudinary stores PDFs under the "image" resource type (it supports
    // page rendering/transformations for them), same endpoint as the other
    // sections' image uploads.
    var res = await fetch('https://api.cloudinary.com/v1_1/' + CLOUD_NAME + '/image/upload', {
        method: 'POST',
        body: form
    });
    if (!res.ok) throw new Error('Cloudinary upload failed');
    var json = await res.json();
    return json.secure_url;
}
