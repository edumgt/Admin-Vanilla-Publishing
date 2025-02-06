function createAddButton() {
    const addButton = document.createElement('button');
    addButton.className = "items-center px-3 py-1 text-white rounded bg-gray-700 hover:bg-gray-600 space-x-2 mr-2";
    addButton.innerHTML = `<i class="fas fa-plus"></i><span>신규</span>`;

    return addButton;
}

function createDelButton() {
    const deleteButton = document.createElement('button');
    deleteButton.className = "items-center px-3 py-1 text-white rounded bg-gray-700 hover:bg-gray-600 space-x-2 mr-2";
    deleteButton.innerHTML = `<i class="fas fa-trash"></i><span>삭제</span>`;

    return deleteButton;
}

function createCloseButton() {
    const closeButton = document.createElement('button');
    closeButton.className = "items-center px-3 py-1 text-white rounded bg-gray-700 hover:bg-gray-600 space-x-2";
    closeButton.innerHTML = `<i class="fas fa-times"></i><span>닫기</span>`;

    return closeButton;
}

function createSaveButton() {
    const saveButton = document.createElement('button');
    saveButton.className = "items-center px-3 py-1 text-white rounded bg-gray-700 hover:bg-gray-600 space-x-2";
    saveButton.innerHTML = `<i class="fas fa-save"></i><span>저장</span>`;

    return saveButton;
}

// 모듈 내보내기
export { createAddButton, createDelButton, createCloseButton, createSaveButton };
