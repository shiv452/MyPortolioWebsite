// data-memories.js - Firestore + Cloudinary access for the "Glimpse of
// Memories" photo gallery. Loaded via dynamic import() from the inline
// script in memories.html.
import { db } from "/firebase-config.js";
import {
    collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const CLOUD_NAME = 'wpebvbjp';
const UPLOAD_PRESET = 'portfolio_unsigned';

export async function getMemories() {
    var q = query(collection(db, 'memories'), orderBy('createdAt', 'asc'));
    var snap = await getDocs(q);
    return snap.docs.map(function (d) { return Object.assign({ id: d.id }, d.data()); });
}

export async function addMemoryDoc(imageUrl) {
    var ref = await addDoc(collection(db, 'memories'), { imageUrl: imageUrl, createdAt: serverTimestamp() });
    return ref.id;
}

export function deleteMemoryDoc(id) {
    return deleteDoc(doc(db, 'memories', id));
}

export async function uploadMemoryImage(file) {
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
