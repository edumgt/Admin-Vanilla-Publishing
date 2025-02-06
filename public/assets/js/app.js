import { createAddButton, createDelButton, createSaveButton, createTanslations } from './common.js';

let rowsPerPage = 20;
let gridBodyHeight = 630;

const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
const currentDate = new Date().toLocaleDateString('ko-KR', options).replace(/[\.]/g, '-').replace(/[\s]/g, '').substring(0, 10);

//fetch('https://your-backend-api.com/data')
fetch('assets/mock/mock.json')
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

        showToast('loading-error', 'error', lang);

        const storedData = localStorage.getItem('gridData');
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
    const data = localStorage.getItem('gridData');
    return data ? JSON.parse(data) : [];
}

function saveData(data) {
    const filteredData = data.filter(row => row.tpCd && row.tpNm);
    localStorage.setItem('gridData', JSON.stringify(filteredData));
}

class BadgeRenderer {
    constructor(props) {
        const el = document.createElement('span');
        el.className = 'px-3 py-1 text-gray-700 rounded cursor-pointer flex items-center justify-center';
        el.innerHTML = '<i class="fas fa-pencil-alt"></i>'; 
        el.style.display = 'inline-block';
        el.style.textAlign = 'center';
        this.el = el;
        this.props = props;
    }
    getElement() {
        return this.el;
    }
    render(props) {
        this.props = props;
    }
}


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
        grid.removeCheckedRows();
        saveData(grid.getData());
        showToast('select-delete', 'success', lang);
        updateDataCount();
    } else {
        showToast('delete-not', 'warning', lang);
    }
});


const saveButton = createSaveButton();
saveButton.addEventListener('click', function () {
    const data = grid.getData();
    const validData = data.filter(row => row.Key && row.Key.trim() !== '');

    saveData(validData);
    updateDataCount();

    fetch('https://your-backend-api.com/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(validData)
    })
        .then(response => response.json())
        .then(data => {
            showToast('well-done', 'success', lang);
        })
        .catch((error) => {
            showToast('save-error', 'warning', lang);

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

    const newRow = { Key: generateNanoId(), tpCd: '', tpNm: '', descCntn: '', useYn: 'Y', createdAt: currentDate };
    grid.prependRow(newRow, { focus: true });

    saveData([...data, newRow]);
    updateDataCount();
});

btnContainer.appendChild(addButton);
btnContainer.appendChild(deleteButton);
btnContainer.appendChild(saveButton);

// Handle View Button Click in Grid
grid.on('click', (ev) => {
    const { columnName, rowKey } = ev;
    if (columnName === 'view') {
        const row = grid.getRow(rowKey); 
        toggleModal(true, row, rowKey);
    }

    if (ev.columnName === 'Key') {
        showToast('auto-key', 'info', lang);
    }
});


grid.on('editingStart', (ev) => {
    showToast('데이타 입력/수정 가능 합니다.', 'info');
});

grid.on('editingFinish', (ev) => {
    saveData(grid.getData());
    showToast('데이타를 자동 저장하였습니다.', 'info');
});


function initNew() {
    const rowData = { Key: generateNanoId(), tpCd: '', tpNm: '', descCntn: '', useYn: 'Y', createdAt: currentDate };
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


document.getElementById('searchByDate').addEventListener('click', function () {

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

    saveButton.disabled = true;
    saveButton.classList.add('bg-gray-400', 'cursor-not-allowed');
    saveButton.classList.remove('bg-gray-700', 'hover:bg-gray-600');

    addButton.disabled = true;
    addButton.classList.add('bg-gray-400', 'cursor-not-allowed');
    addButton.classList.remove('bg-gray-700', 'hover:bg-gray-600');

    showToast('search-click', 'info', lang);

});

document.getElementById('resetSearch').addEventListener('click', function () {

    const gridData = loadData();

    document.getElementById('groupCode').value = '';
    document.getElementById('codeName').value = '';
    document.getElementById('description').value = '';
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


//console.log("createTanslations:" + createTanslations.ko.offCanvas.stati);
const translations = createTanslations;
//console.log("translations:" + translations.ko.offCanvas.stati);

// const translations = {
//     en: {
//         menu: "Menu",
//         tabs: {
//             system: "System",
//             organization: "Organization",
//             task: "Task",
//             schedule: "Schedule",
//             statistics: "Statistics",
//             settings: "Settings",
//         },
//         offCanvas: {
//             code: "Code",
//             permissions: "Permissions",
//             logs: "Logs",
//             menu: "Menu",
//             settings: "Settings",
//             stati: "Member Statistics",
//             flow: "Sales Statistics",
//             chain: "Chain Operation",
//             system: "Code Management",
//             orgtree: "Permission Management",
//             document: "Document Management",
//             wms: "WMS"
//         },

//         buttons: {
//             search: "Search",
//             reset: "Reset Search",
//             new: "New",
//             delete: "Delete",
//             save: "Save",
//         },

//     },
//     ko: {
//         menu: "메뉴",
//         tabs: {
//             system: "시스템관리",
//             organization: "조직관리",
//             task: "업무관리",
//             schedule: "일정관리",
//             statistics: "통계",
//             settings: "설정관리",
//         },
//         offCanvas: {
//             code: "입출고관리",
//             permissions: "권한관리",
//             logs: "로그관리",
//             menu: "메뉴관리",
//             settings: "설정관리",
//             stati: "회원통계",
//             flow: "매출통계",
//             chain: "체인운영",
//             system: "코드관리",
//             orgtree: "권한관리",
//             document: "문서관리",
//             wms: "WMS",
//         },

//         buttons: {
//             search: "검색",
//             reset: "검색 초기화",
//             new: "신규",
//             delete: "삭제",
//             save: "저장",
//         },

//     },
//     ja: {
//         menu: "メニュー",
//         tabs: {
//             system: "システム管理",
//             organization: "組織管理",
//             task: "業務管理",
//             schedule: "スケジュール管理",
//             statistics: "統計",
//             settings: "設定管理",
//         },
//         offCanvas: {
//             code: "コード管理",
//             permissions: "権限管理",
//             logs: "ログ管理",
//             menu: "メニュー管理",
//             settings: "設定管理",
//             stati: "会員統計",
//             flow: "売上統計",
//             chain: "チェーン運営",
//             system: "コード管理",
//             orgtree: "権限管理",
//             document: "文書管理",
//             wms: "WMS",
//         },

//         buttons: {
//             search: "検索",
//             reset: "検索をリセット",
//             new: "新規",
//             delete: "削除",
//             save: "保存",
//         },

//     },
// };



languageSwitcher.addEventListener("click", function (event) {
    let lang = event.target.getAttribute("data-lang");
    localStorage.setItem('lang', lang);
    if (!lang || !translations[lang]) return;


    let tabLabels = translations[lang].tabs;
    tabs[0].textContent = tabLabels.system;
    tabs[1].textContent = tabLabels.organization;
    tabs[2].textContent = tabLabels.task;
    tabs[3].textContent = tabLabels.schedule;
    tabs[4].textContent = tabLabels.statistics;
    tabs[5].textContent = tabLabels.settings;


    let offCanvasLabels = translations[lang].offCanvas;
    if (currentPage.includes("system")) {
        offCanvasItems[0].textContent = offCanvasLabels.system;
        offCanvasItems[1].textContent = offCanvasLabels.orgtree;
        offCanvasItems[2].textContent = offCanvasLabels.document;
        offCanvasItems[3].textContent = offCanvasLabels.wms;
    }

    if (currentPage.includes("system")) {
        breadcrumb.textContent = offCanvasLabels.system;
    } else if (currentPage.includes("orgtree")) {
        breadcrumb.textContent = offCanvasLabels.orgtree;
    } else if (currentPage.includes("document")) {
        breadcrumb.textContent = offCanvasLabels.document;
    } else if (currentPage.includes("wms")) {
        breadcrumb.textContent = offCanvasLabels.system;
    }

    let buttonLabels = translations[lang].buttons;
    buttons[0].textContent = buttonLabels.search;
    buttons[1].textContent = buttonLabels.reset;

    addButton.innerHTML = `<i class="fas fa-plus"></i><span>` + buttonLabels.new + `</span>`;
    deleteButton.innerHTML = `<i class="fas fa-trash"></i><span>` + buttonLabels.delete + `</span>`;
    saveButton.innerHTML = `<i class="fas fa-save"></i><span>` + buttonLabels.save + `</span>`;


});


document.addEventListener('DOMContentLoaded', () => {
    let lang = localStorage.getItem('lang');

    let tabLabels = translations[lang].tabs;
    tabs[0].textContent = tabLabels.system;
    tabs[1].textContent = tabLabels.organization;
    tabs[2].textContent = tabLabels.task;
    tabs[3].textContent = tabLabels.schedule;
    tabs[4].textContent = tabLabels.statistics;
    tabs[5].textContent = tabLabels.settings;

    let offCanvasLabels = translations[lang].offCanvas;
    if (currentPage.includes("system")) {
        offCanvasItems[0].textContent = offCanvasLabels.system;
        offCanvasItems[1].textContent = offCanvasLabels.orgtree;
        offCanvasItems[2].textContent = offCanvasLabels.document;
        offCanvasItems[3].textContent = offCanvasLabels.wms;
    }

    if (currentPage.includes("system")) {
        breadcrumb.textContent = offCanvasLabels.system;
    } else if (currentPage.includes("orgtree")) {
        breadcrumb.textContent = offCanvasLabels.orgtree;
    } else if (currentPage.includes("document")) {
        breadcrumb.textContent = offCanvasLabels.document;
    } else if (currentPage.includes("wms")) {
        breadcrumb.textContent = offCanvasLabels.system;
    }

    let buttonLabels = translations[lang].buttons;
    buttons[0].textContent = buttonLabels.search;
    buttons[1].textContent = buttonLabels.reset;

    addButton.innerHTML = `<i class="fas fa-plus"></i><span>` + buttonLabels.new + `</span>`;
    deleteButton.innerHTML = `<i class="fas fa-trash"></i><span>` + buttonLabels.delete + `</span>`;
    saveButton.innerHTML = `<i class="fas fa-save"></i><span>` + buttonLabels.save + `</span>`;
});