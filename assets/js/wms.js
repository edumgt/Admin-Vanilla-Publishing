document.addEventListener('DOMContentLoaded', async () => {
    
    function showLoading(section) {
        section.innerHTML = `<div class="text-center text-lg font-semibold mt-4">데이터를 불러오는 중...</div>`;
    }
    
    function hideLoading(section) {
        section.innerHTML = ""; 
    }

    
    async function fetchJson(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${url} - Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            showToast('process-error', 'error', lang);
            return null;
        }
    }

    async function updateData(url, updatedRows) {
        console.log('Sending updates:', updatedRows);

        if (updatedRows.length > 0) {
            const updatesWithId = updatedRows.map(row => ({ id: row.id, changes: row }));
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatesWithId)
                });

                if (!response.ok) {
                    throw new Error(`Server responded with status: ${response.status}`);

                }

                const result = await response.json();
                showToast('well-done', 'success', lang);
                console.log('Server response:', result);
            } catch (error) {
                showToast('process-error', 'error', lang);
                console.error('Fetch error:', error);
            }
        }
    }


    async function addData(url, newRow) {
        console.log("Sending new row to server:", newRow);
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRow)
            });

            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Server response:", result);
            showToast('input-allowed', 'success', lang);
        } catch (error) {
            console.error("Fetch error:", error);
            showToast('process-error', 'error', lang);
        }
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
        showToast('well-done', 'success', lang);
    }


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

  

    document.querySelectorAll("button").forEach(button => {
        button.addEventListener('click', async () => {
            tabs.forEach(t => {
                sections[t.id].classList.add('hidden');
                document.getElementById(t.id).classList.remove('active-tab');
            });

            const section = sections[button.id];
            document.getElementById(button.id).classList.add('active-tab');

            showLoading(section); // 로딩 표시

            setTimeout(async () => {
                let newInboundData, newOutboundData;
                if (button.id === 'tab-inbound') {
                    newInboundData = await fetchJson("http://localhost:3000/api/inbound");
                    hideLoading(section);
                    populateInbound(section, newInboundData);
                } else if (button.id === 'tab-outbound') {
                    newOutboundData = await fetchJson("http://localhost:3000/api/outbound");
                    hideLoading(section);
                    populateOutbound(section, newOutboundData);
                } else if (button.id === 'tab-dashboard') {
                    newInboundData = await fetchJson("http://localhost:3000/api/inbound");
                    newOutboundData = await fetchJson("http://localhost:3000/api/outbound");
                    hideLoading(section);
                    populateDashboard(section, newInboundData, newOutboundData);
                }
                section.classList.remove('hidden');
            }, 300);
        });
    });
    
    function createGrid(sectionId, data, updateUrl) {

        console.log(sectionId);

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
                { 
                    header: '날짜', 
                    name: 'date', 
                    width: 150, 
                    align: 'center', 
                    editor: 'text', 
                    sortable: true, 
                    filter: 'text',
                    formatter: ({ value }) => {
                        if (!value) return '';
                        const date = new Date(value);
                        return date.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환
                    }
                },
                { header: '도서명', name: 'title', align: 'center', editor: 'text', sortable: true, filter: 'select' },
                { header: '수량', name: 'quantity', width: 80, align: 'center', editor: 'text', sortable: true, filter: 'number' }
            ],
            rowHeaders: ["checkbox"],
            copyOptions: { useFormattedValue: true },
            editable: true
        });
        
        
        
        
        
        
        
        

        grid.on('afterChange', ev => {
            const updatedRows = ev.changes.map(change => ({
                id: grid.getRow(change.rowKey).id,
                [change.columnName]: change.value
            }));
            if (sectionId === "tab-inbound-section") {
                updateData('http://localhost:3000/api/inbound/update', updatedRows);
            }
            else {
                updateData('http://localhost:3000/api/outbound/update', updatedRows);
            }
        });

        const addButton = document.createElement('button');
        addButton.className = "items-center px-3 py-1 text-white rounded bg-gray-700 hover:bg-gray-600 space-x-2 mr-2";
        addButton.innerHTML = `<i class="fas fa-plus"></i><span>신규</span>`;

        addButton.addEventListener('click', () => {
            const newRow = {
                id: generateUUID(),
                date: new Date().toISOString().split('T')[0], // YYYY-MM-DD 형식으로 변환
                title: '',
                quantity: 0,
                isbn: ''
            };

            grid.prependRow(newRow);

            if (sectionId === "tab-inbound-section") {
                addData('http://localhost:3000/api/inbound/add', newRow);
            }
            else {
                addData('http://localhost:3000/api/outbound/add', newRow);
            }
        });

        const deleteButton = document.createElement('button');
        deleteButton.className = "items-center px-3 py-1 text-white rounded bg-gray-700 hover:bg-gray-600 space-x-2";
        deleteButton.innerHTML = `<i class="fas fa-trash"></i><span>삭제</span>`;

        deleteButton.addEventListener('click', () => {
            const checkedRows = grid.getCheckedRows();

            if (checkedRows.length === 0) {
                // 체크된 항목이 없을 경우 toast 메시지 출력
                showToast('delete-not','warning',lang);
                return;
            }

            grid.removeCheckedRows();

            if (sectionId === "tab-inbound-section") {
                deleteData('http://localhost:3000/api/inbound/delete', checkedRows);
            }
            else {
                deleteData('http://localhost:3000/api/outbound/delete', checkedRows);
            }

        });

        section.appendChild(addButton);
        section.appendChild(deleteButton);
    }

    function populateInbound(section, newInboundData) {
        if (!newInboundData) {
            section.innerHTML = `<div class="text-center text-lg font-semibold">데이터를 불러오는데 실패했습니다.</div>`;
            return;
        }
        createGrid(section.id, newInboundData, "http://localhost:3000/api/inbound");
    }
    
    function populateOutbound(section, newOutboundData) {
        if (!newOutboundData) {
            section.innerHTML = `<div class="text-center text-lg font-semibold">데이터를 불러오는데 실패했습니다.</div>`;
            return;
        }
        createGrid(section.id, newOutboundData, "http://localhost:3000/api/outbound");
    }
    
    


    function populateDashboard(section) {
        section.innerHTML = `<div id="stock-chart" class="w-full border border-gray-300 rounded-lg p-2 "></div>
            <div id="monthly-outbound-chart" class="w-full border border-gray-300 rounded-lg p-2  mt-4"></div>`;

        const inboundDict = Object.fromEntries(inboundData.map(book => [book.isbn, book.quantity]));
        const outboundDict = Object.fromEntries(outboundData.map(book => [book.isbn, book.quantity]));

        const stockData = [];
        inboundData.forEach(book => {
            const inboundQty = book.quantity;
            const outboundQty = outboundDict[book.isbn] || 0;
            const stockRemaining = inboundQty - outboundQty;

            if (stockRemaining !== 0) {  
                stockData.push({ title: book.title, quantity: stockRemaining });
            }
        });


        const titles = stockData.map(item => item.title);
        const stockValues = stockData.map(item => item.quantity);

        
        if (stockData.length > 0) {
            const pieOptions = {
                chart: { type: 'pie', height: 350 },
                series: stockValues,
                labels: titles,
                title: { text: '재고 차이가 있는 도서 목록', align: 'center' }
            };

            const pieChart = new ApexCharts(document.querySelector("#stock-chart"), pieOptions);
            pieChart.render();
        } else {
            document.querySelector("#stock-chart").innerHTML = `<div class="text-center text-lg font-semibold">모든 재고가 일치합니다</div>`;
        }

        const monthlyOutbound = Array.from({ length: 12 }, (_, i) => ({
            month: `${i + 1}월`,
            quantity: Math.floor(Math.random() * 500) + 50
        }));

        const lineOptions = {
            chart: { type: 'line', height: 300 },
            series: [{ name: '월별 출고량', data: monthlyOutbound.map(item => item.quantity) }],
            xaxis: { categories: monthlyOutbound.map(item => item.month) },
            title: { text: '2024년 월별 출고 추이', align: 'center' }
        };

        const lineChart = new ApexCharts(document.querySelector("#monthly-outbound-chart"), lineOptions);
        lineChart.render();

    }

    const inboundData = await fetchJson("http://localhost:3000/api/inbound");
    const outboundData = await fetchJson("http://localhost:3000/api/outbound");


    populateInbound(sections['tab-inbound'], inboundData);
    populateOutbound(sections['tab-outbound'], outboundData);
    populateDashboard(sections['tab-dashboard'], inboundData, outboundData);

});
