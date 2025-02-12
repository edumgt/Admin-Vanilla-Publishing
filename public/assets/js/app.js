import { 
    createAddButton, 
    createDelButton, 
    createSaveButton, 
    createSearchButton,
    createResetSearchButton,
    createTanslations, 
    createBadgeRenderer } from './common.js';

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


const BadgeRenderer = createBadgeRenderer;

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
});


grid.on('editingStart', (ev) => {
    showToast('data-possible', 'info', lang);
});

grid.on('editingFinish', (ev) => {
    saveData(grid.getData());
    showToast('auto-save', 'info', lang);
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

const translations = createTanslations;

languageSwitcher.addEventListener("click", function (event) {
    let lang = event.target.getAttribute("data-lang");
    localStorage.setItem('lang', lang);
    if (!lang || !translations[lang]) return;

    let buttonLabels = translations[lang].buttons;
    searchButton.innerHTML = `<i class="fas fa-search"></i><span>` + buttonLabels.search + `</span>`;
    addButton.innerHTML = `<i class="fas fa-plus"></i><span>` + buttonLabels.new + `</span>`;
    deleteButton.innerHTML = `<i class="fas fa-trash"></i><span>` + buttonLabels.delete + `</span>`;
    saveButton.innerHTML = `<i class="fas fa-save"></i><span>` + buttonLabels.save + `</span>`;
    resetSearchButton.innerHTML = `<i class="fas fa-undo"></i><span>` + buttonLabels.reset + `</span>`;
});


document.addEventListener('DOMContentLoaded', () => {
    let lang = localStorage.getItem('lang');

    let buttonLabels = translations[lang].buttons;
    searchButton.innerHTML = `<i class="fas fa-search"></i><span>` + buttonLabels.search + `</span>`;
    addButton.innerHTML = `<i class="fas fa-plus"></i><span>` + buttonLabels.new + `</span>`;
    deleteButton.innerHTML = `<i class="fas fa-trash"></i><span>` + buttonLabels.delete + `</span>`;
    saveButton.innerHTML = `<i class="fas fa-save"></i><span>` + buttonLabels.save + `</span>`;
    resetSearchButton.innerHTML = `<i class="fas fa-undo"></i><span>` + buttonLabels.reset + `</span>`;
});