
async function fetchDocuments() {
    const response = await fetch('assets/mock/documents.json');
    return await response.json();
}

const icons = {
    pdf: '📄',
    word: '📝',
    excel: '📊',
    hwp: '📚'
};

const documentList = document.getElementById('document-list');
const viewer = document.getElementById('viewer');
const newDocumentModal = document.getElementById('new-document-modal');
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const progressBar = document.getElementById('progress-bar');
const progressBarInner = progressBar.querySelector('div');
const toast = document.getElementById('toast');

async function loadDocumentList() {
    const documents = await fetchDocuments();
    documents.forEach((doc, index) => {
        const item = document.createElement('div');
        item.className = 'flex items-center justify-start p-2 hover:bg-gray-100';
        item.dataset.index = index;
        item.innerHTML = `
                    <span class="flex-1">${icons[doc.type]}</span>
                    <span class="flex-1">${doc.title}</span>
                    <span class="flex-1">${doc.permissions}</span>
                    <span class="flex-1">${doc.uploadDate}</span>
                    <span class="flex-1">${doc.uploader}</span>
                    <span class="flex-1 flex gap-2">
                        <button class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded ${doc.permissions === 'none' ? 'opacity-50 cursor-not-allowed' : ''}" onclick="editDocument(${index})" ${doc.permissions === 'none' ? 'disabled' : ''}>Edit</button>
                        <button class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded ${doc.permissions === 'none' ? 'opacity-50 cursor-not-allowed' : ''}" onclick="deleteDocument(${index})" ${doc.permissions === 'none' ? 'disabled' : ''}>Delete</button>
                    </span>
                `;
        item.addEventListener('click', () => previewDocument(doc));
        documentList.appendChild(item);
    });
}

function previewDocument(doc) {
    viewer.innerHTML = '';

    if (doc.permissions === 'none') {
        showToast('You do not have permission to view this document.');
        viewer.innerHTML = `
                    <button class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mt-4" onclick="requestPermission()">Request Permission</button>
                `;
        return;
    }

    if (doc.type === 'hwp') {
        viewer.innerHTML = '<p>HWP preview is not supported.</p>';
        return;
    }

    const iframe = document.createElement('iframe');
    iframe.src = doc.url;
    iframe.className = 'w-11/12 h-5/6';
    viewer.appendChild(iframe);
}

function requestPermission() {
    showToast('Permission requested!');
}

function openNewDocumentModal() {
    newDocumentModal.classList.remove('hidden');
}

function closeNewDocumentModal() {
    newDocumentModal.classList.add('hidden');
}

dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileUpload);

dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropZone.classList.add('bg-gray-200');
});

dropZone.addEventListener('dragleave', () => dropZone.classList.remove('bg-gray-200'));
dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropZone.classList.remove('bg-gray-200');
    handleFileUpload(event.dataTransfer.files);
});

function handleFileUpload(files) {
    progressBar.classList.remove('hidden');
    let progress = 0;
    const interval = setInterval(() => {
        progress += 20;
        progressBarInner.style.width = `${progress}%`;
        if (progress >= 100) {
            clearInterval(interval);
            showToast('File uploaded successfully!');
            closeNewDocumentModal();
            progressBar.classList.add('hidden');
            progressBarInner.style.width = '0%';
        }
    }, 1000);
}

loadDocumentList();
