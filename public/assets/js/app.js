import {
    createAddButton,
    createDelButton,
    createSaveButton,
    createSearchButton,
    createResetSearchButton,
    createTanslations,
    createBadgeRenderer,
    RowNumRenderer,
    createSaveRenderer
} from './common.js';



const BadgeRenderer = createBadgeRenderer;
const rowNumRenderer = RowNumRenderer;
const SaveRenderer = createSaveRenderer;
localStorage.setItem('gridCacheTimestamp', new Date().toISOString());
let rowsPerPage = 20;
let gridBodyHeight = 630;
const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
const currentDate = new Date().toLocaleDateString('ko-KR', options).replace(/[\.]/g, '-').replace(/[\s]/g, '').substring(0, 10);

fetch('/api/data')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        loadData(data);
        localStorage.setItem('gridData', JSON.stringify(data));
    })
    .catch(error => {
        console.error('Fetch error:', error);
        showToast('loading-error', 'error', lang);
    });


function loadPageData(page, perPage) {
    return loadData();
}

function updateDataCount() {
    const allData = loadData();
    const dataCountElement = document.getElementById('dataCount');
    dataCountElement.textContent = `Total : ${allData.length}`;
}


function loadData() {
    const data = localStorage.getItem('gridData');
    return data ? JSON.parse(data) : [];
}

function saveData(data) {
    const filteredData = data.filter(row => row.tpCd && row.tpNm);
    localStorage.setItem('gridData', JSON.stringify(filteredData));
}

const grid = new tui.Grid({
    el: document.getElementById('grid'),
    rowHeaders: [{
        type: 'rowNum',
        header: 'No.',
        renderer: {
            type: rowNumRenderer
        }
    }, 'checkbox'],

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
        { header: 'Key', name: 'Key', width: 250, align: 'left', sortable: true, resizable: true, width: 100, minWidth: 80 },
        { header: 'Group', name: 'tpCd', editor: 'text', validation: { required: true }, sortable: true, filter: 'text', resizable: true, width: 150 },
        { header: 'Name', name: 'tpNm', editor: 'text', sortable: true, filter: 'text', resizable: true, width: 200 },
        { header: 'Desc.', name: 'descCntn', editor: 'text', sortable: true, filter: 'text', resizable: true, },
        {
            header: 'UseYN', name: 'useYn', width: 100, align: 'center',
            editor: {
                type: 'select',
                options: { listItems: [{ text: 'Y', value: 'Y' }, { text: 'N', value: 'N' }] }
            },
            sortable: true,
            filter: {
                type: 'select',
                options: [
                    { text: 'All', value: '' },
                    { text: 'Y', value: 'Y' },
                    { text: 'N', value: 'N' }
                ]
            }
        },
        { header: 'CreateDT', name: 'createdAt', width: 150, align: 'center', sortable: true },
        {
            header: 'View',
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
    },
    draggable: true
});

updateDataCount();

const deleteButton = createDelButton();
deleteButton.addEventListener('click', function () {
    const chkArray = grid.getCheckedRowKeys();

    if (chkArray.length > 0) {

        fetch('/api/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rowKeys: chkArray })
        })
            .then(response => response.json())
            .then(result => {
                showToast('select-delete', 'success', lang);
                updateDataCount();

                grid.removeCheckedRows();

            })
            .catch(error => {
                console.error("Delete error:", error);
                showToast('delete-failed', 'warning', lang);
            });


    } else {
        showToast('delete-not', 'warning', lang);
    }
});


const addButton = createAddButton();
addButton.addEventListener('click', function () {
    const data = grid.getData();
    const hasEmptyRow = data.some(row => row.tpCd === '' || row.tpNm === '');
    if (hasEmptyRow) {
        showToast('input-allowed', 'info', lang);
        return;
    }
    initNew();

});

const searchButton = createSearchButton();
btnContainer.appendChild(searchButton);
btnContainer.appendChild(addButton);
btnContainer.appendChild(deleteButton);

const resetSearchButton = createResetSearchButton();
resetSearchButton.classList.add("ml-2")
btnContainer.appendChild(resetSearchButton);

let savePermission = true; // 전역 변수로 선언
let viewPermission = true; // 전역 변수로 선언

grid.on('click', (ev) => {
    const { columnName, rowKey } = ev;

    if (columnName === 'save') {
        if (!savePermission) {
            showToast('권한이 없습니다.', 'warning', lang);
            return;
        }

        const row = grid.getRow(rowKey);
        console.log("rowKey: " + rowKey);

        try {
            const response = fetch('/api/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(row)
            });

            if (!response.ok) throw new Error('Save failed');

            const result = response.json();

        } catch (err) {
            console.error('Save failed:', err);
            showToast('save-failed', 'error', lang);
        }

        showToast('well-done', 'success', lang);
    }
    if (columnName === 'view') {
        if (!viewPermission) {
            showToast('권한이 없습니다.', 'warning', lang);
            return;
        }
        const row = grid.getRow(rowKey);
        toggleModal(true, row, rowKey);
    }

    if (ev.columnName === 'Key') {
        showToast('auto-key', 'info', lang);
    }
});

function initNew() {
    const rowData = { Key: generateNanoId(), tpCd: '', tpNm: '', descCntn: '', useYn: 'Y', createdAt: currentDate };
    grid.prependRow(rowData, { focus: true });
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
        grid.setValue(currentRowKey, 'tpCd', updatedData.tpCd);
        grid.setValue(currentRowKey, 'tpNm', updatedData.tpNm);
        grid.setValue(currentRowKey, 'descCntn', updatedData.descCntn);
        grid.setValue(currentRowKey, 'useYn', updatedData.useYn);
    }

    toggleModal(false);
    saveData(grid.getData());
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
            const formGroup = document.createElement('div');
            formGroup.className = 'flex flex-col';

            const label = document.createElement('label');
            label.className = 'text-sm text-gray-700';
            label.textContent = key;

            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'border rounded px-3 py-2 mt-1 text-gray-900';
            input.name = key;
            input.value = value;

            formGroup.appendChild(label);
            formGroup.appendChild(input);
            modalForm.appendChild(formGroup);
        }

        modal.classList.remove('hidden');
    } else {
        modal.classList.add('hidden');
    }
}


searchButton.addEventListener('click', function () {
    const gridData = loadData();

    const selectedDate = document.getElementById('datePicker').value;
    const groupCode = document.getElementById('groupCode').value.toLowerCase();
    const codeName = document.getElementById('codeName').value.toLowerCase();
    const description = document.getElementById('description').value.toLowerCase();

    const filteredData = gridData.filter(row => {
        const matchesDate = selectedDate ? row.createdAt === selectedDate : true;
        const matchesGroupCode = groupCode ? row.tpCd.toLowerCase().includes(groupCode) : true;
        const matchesCodeName = codeName ? row.tpNm.toLowerCase().includes(codeName) : true;
        const matchesDescription = description ? row.descCntn.toLowerCase().includes(description) : true;
        return matchesDate && matchesGroupCode && matchesCodeName && matchesDescription;
    });

    grid.resetData(filteredData);

    addButton.disabled = true;
    addButton.classList.add('bg-gray-400', 'cursor-not-allowed');
    addButton.classList.remove('bg-gray-700', 'hover:bg-gray-600');

    showToast('search-click', 'info', lang);

});

resetSearchButton.addEventListener('click', function () {

    const gridData = loadData();

    document.getElementById('groupCode').value = '';
    document.getElementById('codeName').value = '';
    document.getElementById('description').value = '';
    document.getElementById('datePicker').value = '';

    grid.resetData(gridData);

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

const translations = createTanslations;

languageSwitcher.addEventListener("click", function (event) {
    let lang = event.target.getAttribute("data-lang");
    localStorage.setItem('lang', lang);
    if (!lang || !translations[lang]) return;

    let buttonLabels = translations[lang].buttons;
    searchButton.innerHTML = `<i class="fas fa-search"></i><span>` + buttonLabels.search + `</span>`;
    addButton.innerHTML = `<i class="fas fa-plus"></i><span>` + buttonLabels.new + `</span>`;
    deleteButton.innerHTML = `<i class="fas fa-trash"></i><span>` + buttonLabels.delete + `</span>`;
    resetSearchButton.innerHTML = `<i class="fas fa-undo"></i><span>` + buttonLabels.reset + `</span>`;
});


document.addEventListener('DOMContentLoaded', () => {
    let lang = localStorage.getItem('lang');

    let buttonLabels = translations[lang].buttons;
    searchButton.innerHTML = `<i class="fas fa-search"></i><span>` + buttonLabels.search + `</span>`;
    addButton.innerHTML = `<i class="fas fa-plus"></i><span>` + buttonLabels.new + `</span>`;
    deleteButton.innerHTML = `<i class="fas fa-trash"></i><span>` + buttonLabels.delete + `</span>`;
    resetSearchButton.innerHTML = `<i class="fas fa-undo"></i><span>` + buttonLabels.reset + `</span>`;


});

function applyButtonPermissions(permissions) {
    const toggleButton = function (button, allowed) {
        button.disabled = !allowed;
        if (!allowed) {
            button.classList.add('bg-gray-300', 'cursor-not-allowed');
            button.classList.remove('bg-gray-700', 'hover:bg-gray-600');
        } else {
            button.classList.remove('bg-gray-300', 'cursor-not-allowed');
            button.classList.add('bg-gray-700', 'hover:bg-gray-600');
        }
    };

    toggleButton(searchButton, permissions.canSearch);
    toggleButton(addButton, permissions.canAdd);
    toggleButton(deleteButton, permissions.canDelete);
    toggleButton(resetSearchButton, permissions.canResetSearch);

    savePermission = permissions.canSave;
    viewPermission = permissions.canView;
}


function fetchPermissionsByMenuPath(memberId, menuPath, callback) {
    fetch('/api/permissions?memberId=' + memberId + '&menuPath=' + encodeURIComponent(menuPath.replace("\/", "")))
        .then(function (res) {
            if (!res.ok) {
                throw new Error('권한 조회 실패');
            }
            return res.json();
        })
        .then(function (permissions) {
            callback(null, permissions);
        })
        .catch(function (err) {
            callback(err, null);
        });
}


document.addEventListener('DOMContentLoaded', function () {

    localStorage.setItem('memberId', 'test0001');

    var memberId = localStorage.getItem('memberId'); // 예: 로그인 후 저장된 사용자 ID
    var menuPath = location.pathname;

    fetchPermissionsByMenuPath(memberId, menuPath, function (err, permissions) {
        if (err) {
            console.error('권한 정보 로딩 실패:', err);
            showToast('권한 정보 로딩 실패', 'error', 'ko');
            return;
        }

        applyButtonPermissions(permissions);
    });
});

