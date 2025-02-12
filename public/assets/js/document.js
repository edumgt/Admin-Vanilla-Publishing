import { createAddButton, createCloseButton } from './common.js';

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


const workarea = document.getElementById('workarea');
workarea.classList.add('flex','h-screen','mt-4');

const documentList = document.getElementById('document-list');

const addButton = createAddButton();
addButton.addEventListener('click', () => {
    openNewDocumentModal();
});
const btnArea = document.getElementById('btn-area');
btnArea.classList.add("mt-4");
btnArea.appendChild(addButton);


const viewer = document.getElementById('viewer');
viewer.classList.add('flex-1', 'flex', 'items-center', 'justify-center', 'bg-gray-50');

const newDocumentModal = document.getElementById('new-document-modal');
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const progressBar = document.getElementById('progress-bar');
const progressBarInner = progressBar.querySelector('div');
// const toast = document.getElementById('toast');

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
                        <button class="bg-blue-500 text-white ${doc.permissions === 'none' ? 'opacity-50 cursor-not-allowed' : ''}" onclick="editDocument(${index})" ${doc.permissions === 'none' ? 'disabled' : ''}>Edit</button>
                        <button class="bg-blue-500 text-white ${doc.permissions === 'none' ? 'opacity-50 cursor-not-allowed' : ''}" onclick="deleteDocument(${index})" ${doc.permissions === 'none' ? 'disabled' : ''}>Delete</button>
                    </span>
                `;
        item.addEventListener('click', () => previewDocument(doc));
        documentList.appendChild(item);
    });
}


export function editDocument(doc) {}
window.editDocument = editDocument;

export function deleteDocument(doc) {}
window.deleteDocument = deleteDocument;

function previewDocument(doc) {
    viewer.innerHTML = '';

    if (doc.permissions === 'none') {
        showToast('not-allowed','warning',lang);
        viewer.innerHTML = `
                    <button class="bg-blue-500 text-white  mt-4" onclick="requestPermission()">권한 요청</button>
                `;
        return;
    }

    if (doc.type === 'hwp') {
        viewer.innerHTML = '<p>HWP preview is not supported.</p>';
        return;
    }

    if (doc.type === 'pdf') {
        viewer.innerHTML = `<iframe src="${doc.url}" class="w-full h-full"></iframe>`;
        return;
    }



    const iframe = document.createElement('iframe');
    iframe.src = doc.url;
    
    viewer.appendChild(iframe);
}

export function requestPermission() {
    showToast('request-permission','success',lang);
}
window.requestPermission = requestPermission;

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
            showToast('well-done','success',lang);
            closeNewDocumentModal();
            progressBar.classList.add('hidden');
            progressBarInner.style.width = '0%';
        }
    }, 1000);
}

loadDocumentList();



const closeButton = createCloseButton();
closeButton.addEventListener('click', () => {
    closeNewDocumentModal();
});
const closeBtn = document.getElementById('closeBtn');
closeBtn.classList.add("mt-4","text-right");
closeBtn.appendChild(closeButton);