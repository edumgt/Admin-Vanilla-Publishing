import {
    createTanslations,
    createBadgeRenderer,
    RowNumRenderer,
    createSaveRenderer
} from './common.js';

import { initPageUI } from './accessControl.js';

document.addEventListener('DOMContentLoaded', () => {
    const BadgeRenderer = createBadgeRenderer;
    const rowNumRenderer = RowNumRenderer;
    const SaveRenderer = createSaveRenderer;
    const translations = createTanslations;

    localStorage.setItem('gridCacheTimestamp', new Date().toISOString());
    let rowsPerPage = 20;
    let gridBodyHeight = 630;
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const currentDate = new Date().toLocaleDateString('ko-KR', options).replace(/[\.]/g, '-').replace(/[\s]/g, '').substring(0, 10);

    function loadData() {
        const data = localStorage.getItem('gridData');
        return data ? JSON.parse(data) : [];
    }

    function saveData(data) {
        const filteredData = data.filter(row => row.tpCd && row.tpNm);
        localStorage.setItem('gridData', JSON.stringify(filteredData));
    }

    function updateDataCount() {
        const allData = loadData();
        const dataCountElement = document.getElementById('dataCount');
        dataCountElement.textContent = `Total : ${allData.length}`;
    }

    function initNew() {
        const rowData = { Key: generateNanoId(), tpCd: '', tpNm: '', descCntn: '', useYn: 'Y', createdAt: currentDate };
        grid.prependRow(rowData, { focus: true });
    }

    let currentRowKey = null;

    const grid = new tui.Grid({
        el: document.getElementById('grid'),
        rowHeaders: [{
            type: 'rowNum',
            header: 'No.',
            renderer: { type: rowNumRenderer }
        }, 'checkbox'],
        editingEvent: 'click',
        scrollX: true,
        scrollY: true,
        bodyHeight: gridBodyHeight,
        pageOptions: { useClient: true, perPage: rowsPerPage },
        rowHeight: 42,
        minRowHeight: 42,
        columns: [
            { header: 'Key', name: 'Key', align: 'left', sortable: true, resizable: true, width: 100, minWidth: 80 },
            { header: 'Group', name: 'tpCd', editor: 'text', validation: { required: true }, sortable: true, filter: 'text', resizable: true, width: 150 },
            { header: 'Name', name: 'tpNm', editor: 'text', sortable: true, filter: 'text', resizable: true, width: 200 },
            { header: 'Desc.', name: 'descCntn', editor: 'text', sortable: true, filter: 'text', resizable: true },
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
            { header: 'View', name: 'view', align: 'center', text: 'V', renderer: { type: BadgeRenderer }, width: 60, resizable: false },
            { header: '저장', name: 'save', align: 'center', width: 60, resizable: false, renderer: { type: SaveRenderer } }
        ],
        data: loadData(),
        columnOptions: { frozenCount: 2, frozenBorderWidth: 2 },
        draggable: true
    });

    fetch('/api/data')
            .then(res => res.json())
            .then(data => {
                grid.resetData(data);
                localStorage.setItem('gridData', JSON.stringify(data));
                updateDataCount();
            })
            .catch(err => {
                console.error('데이터 로딩 실패:', err);
                showToast('loading-error', 'error', 'ko');
            });

    initPageUI("btnContainer", localStorage.getItem("userId"), location.pathname, {
        onSearch: () => document.getElementById('searchForm').dispatchEvent(new Event('submit')),
        onAdd: () => initNew(),
        onDelete: () => {
            const chkArray = grid.getCheckedRowKeys();
            if (chkArray.length > 0) {
                fetch('/api/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ rowKeys: chkArray })
                })
                        .then(res => res.json())
                        .then(() => {
                            grid.removeCheckedRows();
                            updateDataCount();
                            showToast('select-delete', 'success', 'ko');
                        })
                        .catch(err => {
                            console.error("삭제 실패:", err);
                            showToast('delete-failed', 'warning', 'ko');
                        });
            } else {
                showToast('delete-not', 'warning', 'ko');
            }
        },
        onSave: null,
        onClose: () => window.close(),
        gridInstance: grid,
        gridOptions: {
            editableCols: ['tpCd', 'tpNm', 'descCntn', 'useYn']
        },
        buttonOrder: ['search', 'add', 'delete', 'resetSearch'] // 원하는 순서대로 버튼 표시
    });

    grid.on('click', ev => {
        const { columnName, rowKey } = ev;

        // 전체 rawData에서 rowKey 대신 고유 Key 필드로 검색
        const rawData = grid.getData();
        const row = rawData.find(r => r.Key && r.Key !== '' && r.rowKey === rowKey);

        if (!row) {
            showToast('행을 찾을 수 없습니다.', 'warning', lang);
            return;
        }

        if (columnName === 'save') {
            if (!window.canSave) return showToast('권한이 없습니다.', 'warning', lang);
            fetch('/api/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(row)
            })
                    .then(res => {
                        if (!res.ok) throw new Error('서버 오류: ' + res.status);
                        return res.json();
                    })
                    .then(() => showToast('well-done', 'success', lang))
                    .catch(err => {
                        console.error('저장 실패:', err);
                        showToast('save-failed', 'error', lang);
                    });
        }

        if (columnName === 'view') {
            if (!window.canView) return showToast('권한이 없습니다.', 'warning', lang);
            toggleModal(true, row, row.Key); // Key를 rowKey처럼 사용
        }
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
            grid.setValue(currentRowKey, 'tpCd', updatedData.tpCd);
            grid.setValue(currentRowKey, 'tpNm', updatedData.tpNm);
            grid.setValue(currentRowKey, 'descCntn', updatedData.descCntn);
            grid.setValue(currentRowKey, 'useYn', updatedData.useYn);
        }

        toggleModal(false);
        saveData(grid.getData());
        showToast('well-done', 'success', lang);
    });
});
