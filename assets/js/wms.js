document.addEventListener('DOMContentLoaded', async () => {
    const lang = 'ko';

    async function fetchJson(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url}`);
        return await response.json();
    }

    async function updateData(url, updatedRows) {
        console.log(updatedRows);
        if (updatedRows.length > 0) {
            const updatesWithId = updatedRows.map(row => ({ id: row.id, changes: row }));
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatesWithId)
            });
        }
    }

    async function addData(url, newRow) {
        console.log(newRow);
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newRow)
        });
    }

    async function deleteData(url, deletedRows) {
        console.log(deletedRows);
        if (deletedRows.length > 0) {
            await fetch(url, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(deletedRows)
            });
        }
    }

    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    const inboundData = await fetchJson("assets/mock/inbound.json");
    const outboundData = await fetchJson("assets/mock/outbound.json");

    const root = document.getElementById('root');
    root.className = 'mt-4';

    const tabs = [
        { id: 'tab-inbound', name: '입고 관리' },
        { id: 'tab-outbound', name: '출고 관리' },
        { id: 'tab-dashboard', name: '대시보드' }
    ];

    const tabContainer = document.createElement('div');
    tabContainer.className = 'flex border-b';
    root.appendChild(tabContainer);

    const sections = {};

    tabs.forEach(tab => {
        const tabButton = document.createElement('button');
        tabButton.id = tab.id;
        tabButton.className = 'flex-1 text-center text-gray-600 hover:bg-gray-100';
        tabButton.innerText = tab.name;
        tabContainer.appendChild(tabButton);

        const section = document.createElement('div');
        section.id = `${tab.id}-section`;
        section.className = 'py-2 hidden';
        root.appendChild(section);
        sections[tab.id] = section;
    });

    sections['tab-inbound'].classList.remove('hidden');
    document.getElementById('tab-inbound').classList.add('active-tab');

    populateInbound(sections['tab-inbound']);
    populateOutbound(sections['tab-outbound']);
    populateDashboard(sections['tab-dashboard']);

    tabs.forEach(tab => {
        document.getElementById(tab.id).addEventListener('click', async () => {
            tabs.forEach(t => {
                sections[t.id].classList.add('hidden');
                document.getElementById(t.id).classList.remove('active-tab');
            });

            const section = sections[tab.id];
            document.getElementById(tab.id).classList.add('active-tab');

            setTimeout(() => {
                section.classList.remove('hidden');
                if (tab.id === 'tab-inbound') populateInbound(section);
                else if (tab.id === 'tab-outbound') populateOutbound(section);
                else if (tab.id === 'tab-dashboard') populateDashboard(section);
            }, 500);
        });
    });

    function createGrid(sectionId, data, updateUrl) {
        const section = document.getElementById(sectionId);
        section.innerHTML = `<div id="${sectionId}-grid"></div>`;

        const grid = new tui.Grid({
            el: document.getElementById(`${sectionId}-grid`),
            data: data,
            bodyHeight: 560,
            pageOptions: { useClient: true, perPage: 15 },
            columns: [
                { header: 'ID', name: 'id', width: 180, align: 'center' },
                { header: 'ISBN', name: 'isbn', width: 200, align: 'center', editor: 'text', sortable: true },
                { header: '날짜', name: 'date', width: 150, align: 'center', editor: 'text', sortable: true, filter: 'text' },
                { header: '도서명', name: 'title', align: 'center', editor: 'text', sortable: true, filter: 'select' },
                { header: '수량', name: 'quantity', width: 80, align: 'center', editor: 'text', sortable: true, filter: 'number' }
            ],
            rowHeaders: ['checkbox'],
            copyOptions: { useFormattedValue: true },
            editable: true
        });

        grid.on('afterChange', ev => {
            const updatedRows = ev.changes.map(change => ({
                id: grid.getRow(change.rowKey).id,
                [change.columnName]: change.value
            }));
            updateData(updateUrl, updatedRows);
        });

        const addButton = document.createElement('button');
        addButton.innerText = '추가';
        addButton.addEventListener('click', () => {
            const newRow = { id: generateUUID(), isbn: '', date: '', title: '', quantity: 0 };
            grid.prependRow(newRow);
            grid.startEditingAt(0, 'isbn');
            addData(updateUrl, newRow);
        });
        section.appendChild(addButton);

        const deleteButton = document.createElement('button');
        deleteButton.innerText = '삭제';
        deleteButton.addEventListener('click', () => {
            const checkedRows = grid.getCheckedRows();
            grid.removeCheckedRows();
            deleteData(updateUrl, checkedRows);
        });
        section.appendChild(deleteButton);
    }

    function populateInbound(section) {
        createGrid(section.id, inboundData, "assets/mock/updateInbound.json");
    }

    function populateOutbound(section) {
        createGrid(section.id, outboundData, "assets/mock/updateOutbound.json");
    }

    function populateDashboard(section) {
        section.innerHTML = `<div id="stock-chart" class="w-full border border-gray-300 rounded-lg p-2 "></div>
        <div id="monthly-outbound-chart" class="w-full border border-gray-300 rounded-lg p-2 mt-4"></div>`;
    }
});
