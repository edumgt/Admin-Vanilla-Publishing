document.addEventListener('DOMContentLoaded', async () => {
    const STORAGE_KEY_INBOUND = "inboundData";
    const STORAGE_KEY_OUTBOUND = "outboundData";

    async function fetchJson(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url}`);
        return await response.json();
    }

    async function loadData(key, url) {
        const storedData = localStorage.getItem(key);
        if (storedData) {
            return JSON.parse(storedData);
        }
        const fetchedData = await fetchJson(url);
        localStorage.setItem(key, JSON.stringify(fetchedData));
        return fetchedData;
    }

    function saveDataToStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    const inboundData = await loadData(STORAGE_KEY_INBOUND, "assets/mock/inbound.json");
    const outboundData = await loadData(STORAGE_KEY_OUTBOUND, "assets/mock/outbound.json");

    console.log("Inbound Data Loaded:", inboundData);
    console.log("Outbound Data Loaded:", outboundData);

    const root = document.getElementById('root');

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
        tabButton.className = 'flex-1 py-2 text-center text-gray-600 hover:bg-gray-100';
        tabButton.innerText = tab.name;
        tabContainer.appendChild(tabButton);

        const section = document.createElement('div');
        section.id = `${tab.id}-section`;
        section.className = 'p-6 hidden';
        root.appendChild(section);
        sections[tab.id] = section;
    });

    sections['tab-inbound'].classList.remove('hidden');
    document.getElementById('tab-inbound').classList.add('active-tab');

    populateInbound(sections['tab-inbound']);
    populateOutbound(sections['tab-outbound']);
    populateDashboard(sections['tab-dashboard']);

    tabs.forEach(tab => {
        document.getElementById(tab.id).addEventListener('click', () => {
            tabs.forEach(t => {
                sections[t.id].classList.add('hidden');
                document.getElementById(t.id).classList.remove('active-tab');
            });
            sections[tab.id].classList.remove('hidden');
            document.getElementById(tab.id).classList.add('active-tab');
        });
    });

    function populateInbound(section) {
        section.innerHTML = `<div id="inbound-grid"></div>`;

        const grid = new tui.Grid({
            el: document.getElementById('inbound-grid'),
            data: inboundData,
            columns: [
                { header: 'ID', name: 'id', width: 50, align: 'center', editor: 'text' },
                { header: '날짜', name: 'date', align: 'center', editor: 'text' },
                { header: '도서명', name: 'title', align: 'center', editor: 'text' },
                { header: '수량', name: 'quantity', align: 'center', editor: 'text' }
            ],
            rowHeaders: ['checkbox'],
            copyOptions: { useFormattedValue: true },
            editable: true
        });

        addGridToolbar(section, grid, STORAGE_KEY_INBOUND);
    }

    function populateOutbound(section) {
        console.log("Initializing Outbound Grid...");
        section.innerHTML = `<div id="outbound-grid"></div>`; 

        setTimeout(() => {
            const grid = new tui.Grid({
                el: document.getElementById('outbound-grid'),
                data: outboundData,
                columns: [
                    { header: 'ID', name: 'id', width: 50, align: 'center', editor: 'text' },
                    { header: '날짜', name: 'date', align: 'center', editor: 'text' },
                    { header: '도서명', name: 'title', align: 'center', editor: 'text' },
                    { header: '수량', name: 'quantity', align: 'center', editor: 'text' }
                ],
                rowHeaders: ['checkbox'],
                copyOptions: { useFormattedValue: true },
                editable: true
            });

            addGridToolbar(section, grid, STORAGE_KEY_OUTBOUND);
        }, 1500); // Slight delay to ensure element exists
    }

    function addGridToolbar(section, grid, storageKey) {
        const toolbar = document.createElement('div');
        toolbar.className = 'flex justify-end gap-2 mt-4';

        const addButton = document.createElement('button');
        addButton.className = 'bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600';
        addButton.innerText = '추가';
        addButton.addEventListener('click', () => {
            const newItem = { id: grid.getRowCount() + 1, date: '', title: '', quantity: 0 };
            grid.appendRow(newItem);
            const updatedData = [...grid.getData(), newItem];
            saveDataToStorage(storageKey, updatedData);
        });

        const deleteButton = document.createElement('button');
        deleteButton.className = 'bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600';
        deleteButton.innerText = '삭제';
        deleteButton.addEventListener('click', () => {
            const checkedRows = grid.getCheckedRows();
            const updatedData = grid.getData().filter(row => !checkedRows.some(checked => checked.id === row.id));
            grid.removeCheckedRows();
            saveDataToStorage(storageKey, updatedData);
        });

        toolbar.appendChild(addButton);
        toolbar.appendChild(deleteButton);
        section.appendChild(toolbar);
    }

    function populateDashboard(section) {
        section.innerHTML = `<div id="stock-chart" class="mb-8"></div><div id="monthly-outbound-chart"></div>`;

        const pieOptions = {
            chart: { type: 'pie', height: 350 },
            series: [50, 30, 20],
            labels: ["The Great Gatsby", "To Kill a Mockingbird", "1984"],
            title: { text: '도서 재고 현황', align: 'center' }
        };

        const pieChart = new ApexCharts(document.querySelector("#stock-chart"), pieOptions);
        pieChart.render();

        const monthlyOutbound = Array.from({ length: 12 }, (_, i) => ({
            month: `${i + 1}월`,
            quantity: Math.floor(Math.random() * 500) + 50
        }));

        const lineOptions = {
            chart: { type: 'line', height: 350 },
            series: [{ name: '월별 출고량', data: monthlyOutbound.map(item => item.quantity) }],
            xaxis: { categories: monthlyOutbound.map(item => item.month) },
            title: { text: '2024년 월별 출고 추이', align: 'center' }
        };

        const lineChart = new ApexCharts(document.querySelector("#monthly-outbound-chart"), lineOptions);
        lineChart.render();
    }
});
