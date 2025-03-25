import {
    createAddButton,
    createDelButton,
    createSaveButton,
    createSearchButton,
    createResetSearchButton,
    createTanslations,
    createBadgeRenderer,
    createSaveRenderer
} from './common.js';

let rowsPerPage = 1000;
let gridBodyHeight = 630;

const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
const currentDate = new Date().toLocaleDateString('ko-KR', options).replace(/[\.]/g, '-').replace(/[\s]/g, '').substring(0, 10);

fetch('/api/glos')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        loadData(data);
        localStorage.setItem('glosCrudData', JSON.stringify(data));
    })
    .catch(error => {

        showToast('loading-error', 'error', lang);

        const storedData = localStorage.getItem('glosCrudData');
        if (storedData) {
            loadData(JSON.parse(storedData));
        } else {
            console.log('No data available in local storage');
        }
    });

function loadPageData(page, perPage) {
    const allData = loadData();
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return allData.slice(start, end);
}

function updateDataCount() {
    const allData = loadData();
    const dataCountElement = document.getElementById('dataCount');
    dataCountElement.textContent = `Total : ${allData.length}`;
}

function loadData() {
    const data = localStorage.getItem('glosCrudData');
    return data ? JSON.parse(data) : [];
}

function saveData(data) {
    // const filteredData = data.filter(row => row.tpCd && row.tpNm);
    // localStorage.setItem('glosCrudData', JSON.stringify(filteredData));
}


const BadgeRenderer = createBadgeRenderer;
const SaveRenderer = createSaveRenderer;

const grid = new tui.Grid({
    el: document.getElementById('grid'),
    rowHeaders: ['rowNum', 'checkbox'],
    editingEvent: 'click',
    scrollX: true,
    scrollY: true,
    bodyHeight: gridBodyHeight,
    pageOptions: {
        useClient: true,
        perPage: rowsPerPage
    },
    rowHeight: 42,
    minRowHeight: 42,
    columns: [
        { header: 'Key', name: 'id', width: 250, align: 'left', sortable: true, resizable: true, width: 100, minWidth: 80 },
        { header: '영문단어', name: 'en', editor: 'text', validation: { required: true }, sortable: true, filter: 'text', resizable: true, width: 150 },
        { header: '한글', name: 'ko', editor: 'text', sortable: true, filter: 'text', resizable: true, width: 200 },
        { header: '설명', name: 'desc', editor: 'text', sortable: true, filter: 'text', resizable: true, },
        { header: 'Image', name: 'img', editor: 'text', sortable: true, filter: 'text', resizable: true, width: 200 },

        { header: 'CreateDT', name: 'createdAt', width: 150, align: 'center', sortable: true },
        {
            header: '상세',
            name: 'view',
            align: 'center',
            text: 'V',
            renderer: {
                type: BadgeRenderer
            },
            width: 60,
            resizable: false
        },
        {
            header: '저장',
            name: 'save',
            align: 'center',
            width: 60,
            resizable: false,

            renderer: {
                type: SaveRenderer
            }
        }

    ],
    data: loadPageData(1, rowsPerPage),
    columnOptions: {
        frozenCount: 2,
        frozenBorderWidth: 2
    }
});


updateDataCount();

const deleteButton = createDelButton();
deleteButton.addEventListener('click', function () {
    const chkArray = grid.getCheckedRowKeys();
    if (chkArray.length > 0) {
        const checkedRows = grid.getCheckedRows();
        const idsToDelete = checkedRows.map(row => row.id).filter(id => !!id);

        grid.removeCheckedRows();
        //saveData(grid.getData());

        fetch("/api/glos/delete", {
            method: "POST", // 예: POST 사용. (실제로 DELETE 메서드 or PUT도 가능)
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: idsToDelete })
        })
            .then(res => res.json())
            .then(result => {
                if (result.success) {

                    grid.removeCheckedRows();

                } else {

                }
            })
            .catch(err => {
                console.error("삭제 API 오류:", err);

            });

        showToast('select-delete', 'success', lang);
        updateDataCount();
        syncLocalStorageWithServer();
    } else {
        showToast('delete-not', 'warning', lang);
    }
});


const saveButton = createSaveButton();

saveButton.addEventListener("click", () => {
    const allRows = grid.getData();

    const newRows = allRows.filter(row => !row.id);

    Promise.all(
        newRows.map(row => {
            return fetch("/api/setGlos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    en: row.en,
                    ko: row.ko,
                    desc: row.desc,
                    img: row.img
                })
            })
                .then(res => res.json())
                .then(result => {
                    if (result.success) {
                        console.log(result.id);
                        row.id = result.id;

                    } else {
                        console.error("INSERT 실패:", result.message);
                    }
                });
        })
    )
        .then(() => {

            showToast('well-done', 'success', lang);
            syncLocalStorageWithServer();
        })
        .catch(err => {
            console.error("신규 저장 중 오류:", err);
            showToast('process-error', 'warning', lang);

        });
});


const addButton = createAddButton();
addButton.addEventListener('click', function () {
    const data = grid.getData();
    const hasEmptyRow = data.some(row => row.tpCd === '' || row.tpNm === '');
    if (hasEmptyRow) {
        showToast('input-allowed', 'info', lang);
        return;
    }

    const newRow = { en: '', ko: '', desc: '' };
    grid.prependRow(newRow, { focus: true });

    //saveData([...data, newRow]);
    updateDataCount();
});

const searchButton = createSearchButton();
btnContainer.appendChild(searchButton);

btnContainer.appendChild(addButton);
btnContainer.appendChild(deleteButton);
btnContainer.appendChild(saveButton);

const resetSearchButton = createResetSearchButton();
resetSearchButton.classList.add("ml-2")
btnContainer.appendChild(resetSearchButton);


grid.on('click', (ev) => {
    const { columnName, rowKey } = ev;
    if (columnName === 'view') {
        const row = grid.getRow(rowKey);
        toggleModal(true, row, rowKey);
    }

    if (ev.columnName === 'Key') {
        showToast('auto-key', 'info', lang);
    }

    if (columnName === 'save') {
        const rowData = grid.getRow(rowKey);

        saveRowEdit(rowData);
        //syncLocalStorageWithServer();
    }
});


grid.on('editingStart', (ev) => {
    //showToast('data-possible', 'info', lang);
});

grid.on('editingFinish', (ev) => {
    //saveData(grid.getData());
    //showToast('auto-save', 'info', lang);

});


function initNew() {
    const rowData = { en: '', ko: '', desc: '' };
    grid.prependRow(rowData, { focus: true });
    updateDataCount();
}

initNew();

new Pikaday({
    field: document.getElementById('datePicker'),
    format: 'YYYY-MM-DD',
    toString(date, format) {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
    }
});

document.getElementById('saveModal').addEventListener('click', () => {
    const modalForm = document.getElementById('modalForm');
    const formData = new FormData(modalForm);
    const updatedData = {};

    for (const [key, value] of formData.entries()) {
        updatedData[key] = value;
    }

    if (currentRowKey !== null) {
        grid.setValue(currentRowKey, 'id', updatedData.id);
        grid.setValue(currentRowKey, 'en', updatedData.en);
        grid.setValue(currentRowKey, 'ko', updatedData.ko);
        grid.setValue(currentRowKey, 'desc', updatedData.desc);
    }

    toggleModal(false);
    //saveData(grid.getData());
    showToast('well-done', 'success', lang);
});

let currentRowKey = null;

function toggleModal(show, rowData = {}, rowKey = null) {
    const modal = document.getElementById('modal');
    const modalForm = document.getElementById('modalForm');
    currentRowKey = rowKey;

    if (show) {

        modalForm.innerHTML = '';

        for (const [key, value] of Object.entries(rowData)) {

            if (key.startsWith('_')) continue;
            if (key.startsWith('view')) continue;
            if (key.startsWith('save')) continue;
            if (key.startsWith('created')) continue;
            if (key.startsWith('sort')) continue;
            if (key.startsWith('unique')) continue;
            if (key.startsWith('row')) continue;

            const formGroup = document.createElement('div');
            formGroup.className = 'flex flex-col';


            const label = document.createElement('label');
            label.className = 'text-sm text-gray-700';
            label.textContent = key;


            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'border rounded px-3 py-2 mt-1 text-gray-900';
            input.name = key;
            input.value = value || '';

            formGroup.appendChild(label);
            formGroup.appendChild(input);


            if (key === 'img') {

                const imgPreview = document.createElement('img');
                imgPreview.style.width = '300px';
                imgPreview.style.height = 'auto';
                imgPreview.style.marginTop = '0.5rem';

                imgPreview.src = value || '';


                formGroup.appendChild(imgPreview);
            }

            modalForm.appendChild(formGroup);
        }

        const reqTitle = document.createElement('h3');
        reqTitle.textContent = "정정요청 목록";
        reqTitle.className = "text-lg font-bold mt-4";
        modalForm.appendChild(reqTitle);

        // 그리드 컨테이너
        const reqGridDiv = document.createElement('div');
        reqGridDiv.id = "correctionGridContainer";
        reqGridDiv.style.height = "200px"; // 적절한 높이
        reqGridDiv.style.marginTop = "0.5rem";
        modalForm.appendChild(reqGridDiv);

        // (C) rowData.id가 있다면 -> 서버에서 정정요청 로드
        if (rowData.id) {
            fetch(`/api/getGlosReq?glos_id=${rowData.id}`)
                .then(res => res.json())
                .then(correctionData => {
                    // correctionData 예: [{id:1, glos_id:10, req_msg:"...", req_date:"2023-01-02"}, ...]
                    // (D) 모달 내부에 서브 그리드 생성
                    const subGrid = new tui.Grid({
                        el: reqGridDiv,
                        data: correctionData,
                        scrollX: false,
                        scrollY: true,
                        rowHeight: 32,
                        bodyHeight: 160,
                        columns: [
                            { header: 'ID', name: 'id', width: 50 },
                            { header: '요청내용', name: 'req_msg', width: 250 },
                            { header: '요청일자', name: 'req_date', width: 120 }
                            // 필요 시 더 많은 컬럼
                        ]
                    });
                })
                .catch(err => {
                    console.error("정정요청 로드 실패:", err);
                });
        } else {
            // rowData.id가 없으면 "신규"라 정정요청 없음
            reqGridDiv.innerHTML = "<p class='text-sm text-gray-500'>신규 데이터이므로 정정요청이 없습니다.</p>";
        }


        modal.classList.remove('hidden');
    } else {

        modal.classList.add('hidden');
    }
}



searchButton.addEventListener('click', function () {

    const gridData = loadData();

    const enVal = document.getElementById('en').value.toLowerCase().trim();
    const koVal = document.getElementById('ko').value.toLowerCase().trim();
    const descVal = document.getElementById('desc').value.toLowerCase().trim();

    const selectedDate = document.getElementById('datePicker').value;
    const filteredData = gridData.filter(row => {

        const enMatch = enVal ? (row.en || '').toLowerCase().includes(enVal) : true;
        const koMatch = koVal ? (row.ko || '').toLowerCase().includes(koVal) : true;
        const descMatch = descVal ? (row.desc || '').toLowerCase().includes(descVal) : true;
        return enMatch && koMatch && descMatch;
    });

    grid.resetData(filteredData);

    saveButton.disabled = true;
    saveButton.classList.add('bg-gray-400', 'cursor-not-allowed');
    saveButton.classList.remove('bg-gray-700', 'hover:bg-gray-600');

    addButton.disabled = true;
    addButton.classList.add('bg-gray-400', 'cursor-not-allowed');
    addButton.classList.remove('bg-gray-700', 'hover:bg-gray-600');

    showToast('search-click', 'info', lang);

});

resetSearchButton.addEventListener('click', function () {

    const gridData = loadData();

    document.getElementById('en').value = '';
    document.getElementById('ko').value = '';
    document.getElementById('desc').value = '';
    document.getElementById('datePicker').value = '';

    grid.resetData(gridData);

    saveButton.disabled = false;
    saveButton.classList.remove('bg-gray-400', 'cursor-not-allowed');
    saveButton.classList.add('bg-gray-700', 'hover:bg-gray-600');

    addButton.disabled = false;
    addButton.classList.remove('bg-gray-400', 'cursor-not-allowed');
    addButton.classList.add('bg-gray-700', 'hover:bg-gray-600');

    showToast('new-save', 'info', lang);
});

const rows = document.querySelectorAll('.tui-grid-rside-area .tui-grid-body-tbody tr');
if (rows.length > 0) {
    const lastRow = rows[rows.length - 1];
    lastRow.style.backgroundColor = '#fff';
    lastRow.style.borderBottom = '1px solid #8f8f8f';
}

function saveRowEdit(rowData) {
    fetch("/api/glos/" + rowData.id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            en: rowData.en,
            ko: rowData.ko,
            desc: rowData.desc,
            img: rowData.img
        })
    })
        .then(res => res.json())
        .then(result => {
            if (result.success) {

                showToast('well-done', 'success', lang);
            } else {

                showToast('process-error', 'warning', lang);
            }
        })
        .catch(err => {
            console.error("업데이트 에러:", err);

            showToast('process-error', 'warning', lang);
        });
}


function syncLocalStorageWithServer() {
    fetch("/api/glos")
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {

            localStorage.setItem("glosCrudData", JSON.stringify(data));


            grid.resetData(data);

            updateDataCount(data.length);
        })
        .catch(error => {
            console.error("서버 전체 조회 실패:", error);
        });
}
