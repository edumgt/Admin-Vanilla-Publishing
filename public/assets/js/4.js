

const grid = new tui.Grid({
    el: document.getElementById('myGrid'),
    bodyHeight: 630,
    data: [],
    columns: [],
    scrollX: false,
    scrollY: true,
    rowHeaders: ['rowNum'],
    pageOptions: {
        useClient: true,
        perPage: 20
    },
    columnOptions: {
        resizable: true
    },
    contextMenu: ({ rowKey, columnName }, event) => [
        [
            {
                name: 'toggleColumns',
                label: '컬럼 선택 표시',
                action: () => {
                    showColumnTogglePopup(event);  // ← 이벤트 위치 전달
                }
            }
        ]
    ]

});


const hostInput = document.getElementById('host');
const userInput = document.getElementById('user');
const passwordInput = document.getElementById('password');
const dbInput = document.getElementById('database');
const queryInput = document.getElementById('query');
const btnConnect = document.getElementById('btnConnect');
const btnQuery = document.getElementById('btnQuery');

btnConnect.addEventListener('click', async () => {
    const payload = {
        host: hostInput.value,
        user: userInput.value,
        password: passwordInput.value,
        database: dbInput.value
    };

    try {
        const response = await fetch('/db/dynamicConnect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (result.success) {
            alert('DB Connection Succeeded!\n' + JSON.stringify(result.data));
        } else {
            alert('DB Connection Failed:\n' + result.message + '\n' + result.error);
        }
    } catch (err) {
        alert('Fetch Error: ' + err.message);
    }
});

btnQuery.addEventListener('click', async () => {
    const payload = { query: queryInput.value };

    try {
        const response = await fetch('/db/query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (result.success) {
            const rows = result.data;
            const columns = createDynamicColumns(rows);
            grid.setColumns(columns);
            grid.resetData(rows);
        } else {
            alert('Query Failed:\n' + result.message + '\n' + result.error);
        }
    } catch (err) {
        alert('Fetch Error: ' + err.message);
    }
});

function createDynamicColumns(rows) {
    if (!Array.isArray(rows) || rows.length === 0) return [];

    return Object.keys(rows[0]).map(key => ({
        header: key,
        name: key,
        sortable: true,    // 정렬 활성화
        filter: 'text',    // 필터(기본 텍스트 필터)
        editor: 'text'     // inline 편집 활성화
    }));
}
const perPageSelect = document.getElementById('perPage');
perPageSelect.addEventListener('change', () => {
    const newPerPage = parseInt(perPageSelect.value, 10);
    grid.setPerPage(newPerPage);
});
function showColumnTogglePopup(event) {
    const columns = grid.getColumns();
    const container = document.getElementById('columnCheckboxContainer');
    const modal = document.getElementById('columnModal');
    container.innerHTML = '';

    columns.forEach(col => {
        const wrapper = document.createElement('div');
        wrapper.className = 'flex items-center gap-2 mb-1';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.dataset.col = col.name;
        checkbox.checked = col.hidden !== true;

        const label = document.createElement('label');
        label.textContent = col.header;

        wrapper.appendChild(checkbox);
        wrapper.appendChild(label);
        container.appendChild(wrapper);
    });

    // 위치 설정 (마우스 클릭 위치 근처에)
    modal.style.left = `${event.clientX + 10}px`;
    modal.style.top = `${event.clientY + 10}px`;
    modal.classList.remove('hidden');
}

document.getElementById('applyColumnToggle').addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('#columnCheckboxContainer input[type="checkbox"]');
    checkboxes.forEach(cb => {
        if (cb.checked) {
            grid.showColumn(cb.dataset.col);
        } else {
            grid.hideColumn(cb.dataset.col);
        }
    });
    document.getElementById('columnModal').classList.add('hidden');
});

document.getElementById('closeColumnModal').addEventListener('click', () => {
    document.getElementById('columnModal').classList.add('hidden');
});

document.addEventListener('click', (e) => {
    const modal = document.getElementById('columnModal');
    if (!modal.contains(e.target) && !e.target.closest('.tui-grid-cell')) {
        modal.classList.add('hidden');
    }
});
document.getElementById('myGrid').addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showColumnTogglePopup(e);
});  