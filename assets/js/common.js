function createAddButton() {
    const addButton = document.createElement('button');
    addButton.className = "items-center px-3 py-1 text-white rounded bg-gray-700 hover:bg-gray-600 space-x-2 mr-2";
    addButton.innerHTML = `<i class="fas fa-plus"></i><span>신규</span>`;

    return addButton;
}

function createDelButton() {
    const deleteButton = document.createElement('button');
    deleteButton.className = "items-center px-3 py-1 text-white rounded bg-gray-700 hover:bg-gray-600 space-x-2";
    deleteButton.innerHTML = `<i class="fas fa-trash"></i><span>삭제</span>`;

    return deleteButton;
}

// 모듈 내보내기
export { createAddButton, createDelButton };
