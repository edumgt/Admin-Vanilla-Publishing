import {
    createBadgeRenderer,
    createTanslations
} from './common.js';

import { initPageUI } from './accessControl.js';

const translations = createTanslations;
const BadgeRenderer = createBadgeRenderer;
let currentRowKey = null;

const workarea = document.getElementById("workarea");
workarea.classList.add('grid', 'grid-cols-1', 'lg:grid-cols-4', 'gap-4', 'py-1', 'mt-4');

let rowsPerPage = 15;
let gridBodyHeight = 430;

function loadData() {
    const data = localStorage.getItem('membersData');
    return data ? JSON.parse(data) : [];
}

function saveData(data) {
    const filteredData = data.filter(row => row.team && row.name);
    localStorage.setItem('membersData', JSON.stringify(filteredData));
}

function updateDataCount() {
    const allData = loadData();
    const dataCountElement = document.getElementById('dataCount');
    dataCountElement.textContent = `Total : ${allData.length}`;
}

const grid = new tui.Grid({
    el: document.getElementById('grid'),
    rowHeaders: ['rowNum', 'checkbox'],
    editingEvent: 'click',
    scrollX: true,
    scrollY: true,
    bodyHeight: gridBodyHeight,
    pageOptions: { useClient: true, perPage: rowsPerPage },
    rowHeight: 42,
    minRowHeight: 42,
    columns: [
        { header: 'Key', name: 'id', align: 'left', sortable: true, resizable: true, width: 250 },
        { header: 'Team', name: 'team', editor: 'text', validation: { required: true }, sortable: true, filter: 'text', resizable: true, width: 150 },
        { header: 'Name', name: 'name', editor: 'text', sortable: true, filter: 'text', resizable: true, width: 200 },
        { header: 'Email', name: 'email', editor: 'text', sortable: true, filter: 'text', resizable: true },
        { header: 'Address', name: 'address', editor: 'text', sortable: true, filter: 'text', resizable: true },
        { header: '입사년도', name: 'joinYear', width: 150, align: 'center', sortable: true },
        {
            header: 'View',
            name: 'view',
            align: 'center',
            text: 'V',
            renderer: { type: BadgeRenderer },
            width: 60,
            resizable: false
        }
    ],
    data: loadData(),
    columnOptions: { frozenCount: 2, frozenBorderWidth: 2 },
    draggable: true
});

updateDataCount();

fetch('/api/members')
        .then(res => res.json())
        .then(data => {
            grid.resetData(data);
            localStorage.setItem('membersData', JSON.stringify(data));
            updateDataCount();
        })
        .catch(error => {
            showToast('loading-error', 'error', 'ko');
            const storedData = localStorage.getItem('membersData');
            if (storedData) grid.resetData(JSON.parse(storedData));
        });

document.addEventListener('DOMContentLoaded', () => {
    initPageUI("btnContainer", {
        onSearch: () => {
            const gridData = loadData();
            const team = document.getElementById('team').value.toLowerCase();
            const name = document.getElementById('name').value.toLowerCase();
            const email = document.getElementById('email').value.toLowerCase();

            const filtered = gridData.filter(row => {
                const t = team ? row.team?.toLowerCase().includes(team) : true;
                const n = name ? row.name?.toLowerCase().includes(name) : true;
                const e = email ? row.email?.toLowerCase().includes(email) : true;
                return t && n && e;
            });

            grid.resetData(filtered);
            showToast('search-click', 'info', 'ko');
        },

        onAdd: () => {
            const data = grid.getData();
            const hasEmpty = data.some(row => row.team === '' || row.name === '');
            if (hasEmpty) {
                showToast('input-allowed', 'info', 'ko');
                return;
            }

            const newRow = { id: generateNanoId(), team: '', name: '', email: '', address: '', joinYear: '' };
            grid.prependRow(newRow, { focus: true });
            saveData([...data, newRow]);
            updateDataCount();
        },

        onDelete: () => {
            const chk = grid.getCheckedRowKeys();
            if (chk.length > 0) {
                grid.removeCheckedRows();
                saveData(grid.getData());
                updateDataCount();
                showToast('select-delete', 'success', 'ko');
            } else {
                showToast('delete-not', 'warning', 'ko');
            }
        },

        onSave: () => {
            if (!window.canSave) {
                showToast('저장 권한이 없습니다.', 'warning', 'ko');
                return;
            }

            const data = grid.getData();
            const validData = data.filter(row => row.id && row.id.trim() !== '');
            saveData(validData);
            updateDataCount();

            fetch('https://your-backend-api.com/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(validData)
            })
                    .then(res => res.json())
                    .then(() => showToast('well-done', 'success', 'ko'))
                    .catch(() => showToast('save-error', 'warning', 'ko'));
        },

        onClose: () => window.close(),

        gridInstance: grid,
        gridOptions: {
            editableCols: ['team', 'name', 'email', 'address']
        },
        buttonOrder: ['search', 'add', 'delete', 'save', 'resetSearch']
    });

    // 수정 권한 없으면 컬럼 editor 제거
    if (!window.canEdit) {
        const newCols = grid.getColumns().map(col => {
            if (col.editor) return { ...col, editor: null };
            return col;
        });
        grid.setColumns(newCols);
    }
});

// 그리드 클릭 처리
grid.on('click', (ev) => {
    const { columnName, rowKey } = ev;

    if (columnName === 'view') {
        if (!window.canView) {
            showToast('조회 권한이 없습니다.', 'warning', 'ko');
            return;
        }
        const row = grid.getRow(rowKey);
        if (row) toggleModal(true, row, rowKey);
    }

    if (columnName === 'id') {
        showToast('auto-key', 'info', 'ko');
    }
});

grid.on('editingStart', (ev) => {
    showToast('data-possible', 'info', 'ko');
});

grid.on('editingFinish', (ev) => {
    saveData(grid.getData());
    showToast('well-done', 'info', 'ko');
});

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

document.getElementById('saveModal').addEventListener('click', () => {
    const modalForm = document.getElementById('modalForm');
    const formData = new FormData(modalForm);
    const updatedData = {};

    for (const [key, value] of formData.entries()) {
        updatedData[key] = value;
    }

    if (currentRowKey !== null) {
        grid.setValue(currentRowKey, 'team', updatedData.team);
        grid.setValue(currentRowKey, 'name', updatedData.name);
        grid.setValue(currentRowKey, 'email', updatedData.email);
        grid.setValue(currentRowKey, 'address', updatedData.address);
        grid.setValue(currentRowKey, 'joinYear', updatedData.joinYear);
    }

    toggleModal(false);
    saveData(grid.getData());
    showToast('well-done', 'success', 'ko');
});
