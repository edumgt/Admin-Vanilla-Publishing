document.addEventListener('DOMContentLoaded', async () => {

    const lang = localStorage.getItem('lang');

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
        tabButton.className = 'flex-1 py-2 text-center text-gray-600 hover:bg-gray-100';
        tabButton.innerText = tab.name;
        tabContainer.appendChild(tabButton);

        const section = document.createElement('div');
        section.id = `${tab.id}-section`;
        section.className = 'p-4 hidden';
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
            showLoading(section);

            document.getElementById(tab.id).classList.add('active-tab');

            setTimeout(() => {
                hideLoading(section);
                section.classList.remove('hidden');

                if (tab.id === 'tab-inbound') {
                    populateInbound(section);
                } else if (tab.id === 'tab-outbound') {
                    populateOutbound(section);
                } else if (tab.id === 'tab-dashboard') {
                    populateDashboard(section);
                }
            }, 500);
        });
    });

    function showLoading(section) {
        section.innerHTML = `<div class="text-center text-lg font-semibold">Loading...</div>`;
    }

    function hideLoading(section) {
        section.innerHTML = "";
    }

    function createGrid(sectionId, data, storageKey) {
        const section = document.getElementById(sectionId);
        section.innerHTML = `<div id="${sectionId}-grid"></div>`;

        const grid = new tui.Grid({
            el: document.getElementById(`${sectionId}-grid`),
            data: data,
            bodyHeight: 530,
            pageOptions: {
                useClient: true,
                perPage: 15
            },
            columns: [
                { header: 'ID', name: 'id', width: 150, align: 'center', editor: false },
                { header: '날짜', name: 'date', align: 'center', editor: 'text', sortable: true, filter: 'text' },
                { header: '도서명', name: 'title', align: 'center', editor: 'text', sortable: true, filter: 'select' },
                { header: '수량', name: 'quantity', align: 'center', editor: 'text', sortable: true, filter: 'number' }
            ],
            rowHeaders: ['checkbox'],
            copyOptions: { useFormattedValue: true },
            editable: true
        });

        grid.on('afterChange', () => {
            const updatedData = grid.getData();
            saveDataToStorage(storageKey, updatedData);
        });

        addGridToolbar(section, grid, storageKey);
    }

    function populateInbound(section) {
        createGrid(section.id, inboundData, STORAGE_KEY_INBOUND);
    }

    function populateOutbound(section) {
        createGrid(section.id, outboundData, STORAGE_KEY_OUTBOUND);
    }

    function addGridToolbar(section, grid, storageKey) {
        const toolbar = document.createElement('div');
        toolbar.className = 'flex justify-end gap-2 ';
    
        const addButton = document.createElement('button');
        addButton.className = 'bg-blue-500 text-white px-3 py-1 rounded ';
        addButton.innerText = '추가';
        addButton.addEventListener('click', () => {
            const newItem = { id: crypto.randomUUID(), date: '', title: '', quantity: 0 };
            
            // 맨 위(1번 행)에 추가
            grid.prependRow(newItem);
            showToast('input-allowed','info',lang);
            const updatedData = [newItem, ...grid.getData()];
            saveDataToStorage(storageKey, updatedData);
        });
    
        // 강제 삭제 버튼
        const deleteButton = document.createElement('button');
        deleteButton.className = 'bg-yellow-500 text-white px-3 py-1 rounded';
        deleteButton.innerText = '삭제';
        deleteButton.addEventListener('click', () => {
            const checkedRows = grid.getCheckedRows();
            console.log(checkedRows);
            
            if (checkedRows.length === 0) {
                showToast('delete-not','warning',lang);
                return;
            }

            const updatedData = grid.getData().filter(row => !checkedRows.some(checked => checked.uuid === row.uuid));
            grid.removeCheckedRows();
            saveDataToStorage(storageKey, updatedData);
            showToast('select-delete','success',lang);
        });
    
        toolbar.appendChild(addButton);
        toolbar.appendChild(deleteButton);
        section.appendChild(toolbar);
    }
    

    function populateDashboard(section) {
        section.innerHTML = `<div id="stock-chart" ></div><div id="monthly-outbound-chart"></div>`;

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
            chart: { type: 'line', height: 330 },
            series: [{ name: '월별 출고량', data: monthlyOutbound.map(item => item.quantity) }],
            xaxis: { categories: monthlyOutbound.map(item => item.month) },
            title: { text: '2024년 월별 출고 추이', align: 'center' }
        };

        const lineChart = new ApexCharts(document.querySelector("#monthly-outbound-chart"), lineOptions);
        lineChart.render();
    }
});
