/**
 * File Manager for Portfolio
 * Handles upload, delete, and display of documents, images, and videos
 */

class FileManager {
    constructor() {
        this.storageKey = 'portfolio_files';
        this.files = this.loadFiles();
        this.maxFileSize = 50 * 1024 * 1024; // 50MB
        this.allowedDocTypes = ['pdf', 'doc', 'docx', 'xlsx', 'ppt', 'pptx'];
        this.allowedImageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        this.allowedVideoTypes = ['mp4', 'webm', 'ogg', 'mov'];
    }

    loadFiles() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : { documents: [], images: [], videos: [] };
        } catch (error) {
            console.error('Error loading files:', error);
            return { documents: [], images: [], videos: [] };
        }
    }

    saveFiles() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.files));
        } catch (error) {
            console.error('Error saving files:', error);
        }
    }

    getFileExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    }

    isValidFile(file, type) {
        const ext = this.getFileExtension(file.name);
        let allowedTypes;

        switch(type) {
            case 'document':
                allowedTypes = this.allowedDocTypes;
                break;
            case 'image':
                allowedTypes = this.allowedImageTypes;
                break;
            case 'video':
                allowedTypes = this.allowedVideoTypes;
                break;
            default:
                return false;
        }

        return allowedTypes.includes(ext) && file.size <= this.maxFileSize;
    }

    async uploadFile(file, type) {
        if (!this.isValidFile(file, type)) {
            throw new Error(`Invalid file type or size for ${type}`);
        }

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const fileData = {
                    id: Date.now(),
                    name: file.name,
                    type: type,
                    size: file.size,
                    data: e.target.result,
                    uploadedAt: new Date().toLocaleString(),
                    mimeType: file.type
                };

                this.files[type + 's'].push(fileData);
                this.saveFiles();
                resolve(fileData);
            };

            reader.onerror = (error) => {
                reject(new Error('Failed to read file'));
            };

            reader.readAsDataURL(file);
        });
    }

    deleteFile(id, type) {
        const typeKey = type + 's';
        this.files[typeKey] = this.files[typeKey].filter(f => f.id !== id);
        this.saveFiles();
    }

    getFiles(type) {
        return this.files[type + 's'] || [];
    }

    downloadFile(id, type) {
        const typeKey = type + 's';
        const file = this.files[typeKey].find(f => f.id === id);
        
        if (!file) return;

        const link = document.createElement('a');
        link.href = file.data;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
}

// Initialize the File Manager
const fileManager = new FileManager();

// Document Upload Handler
function setupDocumentUpload() {
    const docInput = document.getElementById('docUploadInput');
    const docDropZone = document.getElementById('docDropZone');

    if (!docInput || !docDropZone) return;

    // Drag and drop
    docDropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        docDropZone.classList.add('drag-active');
    });

    docDropZone.addEventListener('dragleave', () => {
        docDropZone.classList.remove('drag-active');
    });

    docDropZone.addEventListener('drop', async (e) => {
        e.preventDefault();
        docDropZone.classList.remove('drag-active');
        
        const files = e.dataTransfer.files;
        for (let file of files) {
            await uploadDocumentFile(file);
        }
    });

    // Click to upload
    docInput.addEventListener('change', async (e) => {
        const files = e.target.files;
        for (let file of files) {
            await uploadDocumentFile(file);
        }
        docInput.value = '';
    });
}

async function uploadDocumentFile(file) {
    const statusDiv = document.getElementById('docUploadStatus');
    
    try {
        const uploadedFile = await fileManager.uploadFile(file, 'document');
        showNotification(`✓ ${file.name} uploaded successfully!`, 'success');
        renderDocuments();
        
        if (statusDiv) {
            statusDiv.innerHTML = `<p class="success-message">✓ Document uploaded successfully!</p>`;
            setTimeout(() => { statusDiv.innerHTML = ''; }, 3000);
        }
    } catch (error) {
        showNotification(`✗ Error: ${error.message}`, 'error');
        if (statusDiv) {
            statusDiv.innerHTML = `<p class="error-message">✗ ${error.message}</p>`;
            setTimeout(() => { statusDiv.innerHTML = ''; }, 3000);
        }
    }
}

function renderDocuments() {
    const docList = document.getElementById('docList');
    if (!docList) return;

    const documents = fileManager.getFiles('document');
    
    docList.innerHTML = documents.map(doc => `
        <div class="file-item doc-item">
            <div class="file-icon">
                <i class="fas fa-file-pdf"></i>
            </div>
            <div class="file-info">
                <div class="file-name">${doc.name}</div>
                <div class="file-meta">${fileManager.formatFileSize(doc.size)} • ${doc.uploadedAt}</div>
            </div>
            <div class="file-actions">
                <button class="btn-icon download-btn" onclick="fileManager.downloadFile(${doc.id}, 'document')" title="Download">
                    <i class="fas fa-download"></i>
                </button>
                <button class="btn-icon delete-btn" onclick="deleteDocumentFile(${doc.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function deleteDocumentFile(id) {
    if (confirm('Are you sure you want to delete this document?')) {
        fileManager.deleteFile(id, 'document');
        renderDocuments();
        showNotification('Document deleted successfully!', 'info');
    }
}

// Image Upload Handler
function setupImageUpload() {
    const imgInput = document.getElementById('imgUploadInput');
    const imgDropZone = document.getElementById('imgDropZone');

    if (!imgInput || !imgDropZone) return;

    imgDropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        imgDropZone.classList.add('drag-active');
    });

    imgDropZone.addEventListener('dragleave', () => {
        imgDropZone.classList.remove('drag-active');
    });

    imgDropZone.addEventListener('drop', async (e) => {
        e.preventDefault();
        imgDropZone.classList.remove('drag-active');
        
        const files = e.dataTransfer.files;
        for (let file of files) {
            await uploadImageFile(file);
        }
    });

    imgInput.addEventListener('change', async (e) => {
        const files = e.target.files;
        for (let file of files) {
            await uploadImageFile(file);
        }
        imgInput.value = '';
    });
}

async function uploadImageFile(file) {
    const statusDiv = document.getElementById('imgUploadStatus');
    
    try {
        const uploadedFile = await fileManager.uploadFile(file, 'image');
        showNotification(`✓ ${file.name} uploaded successfully!`, 'success');
        renderImages();
        
        if (statusDiv) {
            statusDiv.innerHTML = `<p class="success-message">✓ Image uploaded successfully!</p>`;
            setTimeout(() => { statusDiv.innerHTML = ''; }, 3000);
        }
    } catch (error) {
        showNotification(`✗ Error: ${error.message}`, 'error');
        if (statusDiv) {
            statusDiv.innerHTML = `<p class="error-message">✗ ${error.message}</p>`;
            setTimeout(() => { statusDiv.innerHTML = ''; }, 3000);
        }
    }
}

function renderImages() {
    const imgGallery = document.getElementById('imgGallery');
    if (!imgGallery) return;

    const images = fileManager.getFiles('image');
    
    imgGallery.innerHTML = images.map(img => `
        <div class="gallery-item">
            <img src="${img.data}" alt="${img.name}" class="gallery-img">
            <div class="gallery-overlay">
                <div class="gallery-actions">
                    <button class="btn-icon" onclick="fileManager.downloadFile(${img.id}, 'image')" title="Download">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="btn-icon" onclick="deleteImageFile(${img.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <p class="gallery-name">${img.name}</p>
        </div>
    `).join('');
}

function deleteImageFile(id) {
    if (confirm('Are you sure you want to delete this image?')) {
        fileManager.deleteFile(id, 'image');
        renderImages();
        showNotification('Image deleted successfully!', 'info');
    }
}

// Video Upload Handler
function setupVideoUpload() {
    const vidInput = document.getElementById('vidUploadInput');
    const vidDropZone = document.getElementById('vidDropZone');

    if (!vidInput || !vidDropZone) return;

    vidDropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        vidDropZone.classList.add('drag-active');
    });

    vidDropZone.addEventListener('dragleave', () => {
        vidDropZone.classList.remove('drag-active');
    });

    vidDropZone.addEventListener('drop', async (e) => {
        e.preventDefault();
        vidDropZone.classList.remove('drag-active');
        
        const files = e.dataTransfer.files;
        for (let file of files) {
            await uploadVideoFile(file);
        }
    });

    vidInput.addEventListener('change', async (e) => {
        const files = e.target.files;
        for (let file of files) {
            await uploadVideoFile(file);
        }
        vidInput.value = '';
    });
}

async function uploadVideoFile(file) {
    const statusDiv = document.getElementById('vidUploadStatus');
    
    try {
        const uploadedFile = await fileManager.uploadFile(file, 'video');
        showNotification(`✓ ${file.name} uploaded successfully!`, 'success');
        renderVideos();
        
        if (statusDiv) {
            statusDiv.innerHTML = `<p class="success-message">✓ Video uploaded successfully!</p>`;
            setTimeout(() => { statusDiv.innerHTML = ''; }, 3000);
        }
    } catch (error) {
        showNotification(`✗ Error: ${error.message}`, 'error');
        if (statusDiv) {
            statusDiv.innerHTML = `<p class="error-message">✗ ${error.message}</p>`;
            setTimeout(() => { statusDiv.innerHTML = ''; }, 3000);
        }
    }
}

function renderVideos() {
    const vidGallery = document.getElementById('vidGallery');
    if (!vidGallery) return;

    const videos = fileManager.getFiles('video');
    
    vidGallery.innerHTML = videos.map(vid => `
        <div class="video-item">
            <video width="100%" height="100%" controls class="video-player">
                <source src="${vid.data}" type="${vid.mimeType}">
                Your browser does not support the video tag.
            </video>
            <div class="video-overlay">
                <div class="video-actions">
                    <button class="btn-icon" onclick="fileManager.downloadFile(${vid.id}, 'video')" title="Download">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="btn-icon" onclick="deleteVideoFile(${vid.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <p class="video-name">${vid.name}</p>
        </div>
    `).join('');
}

function deleteVideoFile(id) {
    if (confirm('Are you sure you want to delete this video?')) {
        fileManager.deleteFile(id, 'video');
        renderVideos();
        showNotification('Video deleted successfully!', 'info');
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            ${message}
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Initialize all file managers on page load
document.addEventListener('DOMContentLoaded', () => {
    setupDocumentUpload();
    setupImageUpload();
    setupVideoUpload();
    renderDocuments();
    renderImages();
    renderVideos();
});
