import { createAddButton, createDelButton } from './common.js';

const apiurl = "";

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


        if (updatedRows.length > 0) {
            const updatesWithId = updatedRows.map(row => ({ id: row.id, changes: row }));
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatesWithId)
                });

                if (!response.ok) {
                    let errorMessage = `Server responded with status: ${response.status}`;

                    // 서버가 500 오류를 반환하는 경우, 상세 오류 메시지 확인
                    if (response.status === 500) {
                        try {
                            const errorData = await response.json();
                            errorMessage = errorData.message || 'Internal Server Error'; // 서버에서 message 필드 제공 여부 확인
                        } catch (jsonError) {
                            errorMessage = 'Internal Server Error (500)';
                        }
                        //showToast('server-warning', 'warning', lang); // 오류 메시지 표시
                    }



                } else {
                    showToast('well-done', 'success', lang);
                }


                const result = await response.json();
                console.log(result);


            } catch (error) {

                //showToast('process-error', 'error', lang); 
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
                    newInboundData = await fetchJson(apiurl+"/api/inbound");
                    hideLoading(section);
                    populateInbound(section, newInboundData);
                } else if (button.id === 'tab-outbound') {
                    newOutboundData = await fetchJson(apiurl+"/api/outbound");
                    hideLoading(section);
                    populateOutbound(section, newOutboundData);
                } else if (button.id === 'tab-dashboard') {
                    newInboundData = await fetchJson(apiurl+"/api/inbound");
                    newOutboundData = await fetchJson(apiurl+"/api/outbound");
                    hideLoading(section);
                    populateDashboard(section, newInboundData, newOutboundData);
                }
                section.classList.remove('hidden');
            }, 300);
        });
    });

    function createGrid(sectionId, data, updateUrl) {

        //console.log(sectionId);

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


                        const date = new Date(value);
                        if (isNaN(date.getTime())) {
                            return 'Invalid Date'; // 유효하지 않은 날짜 처리
                        }

                        return date.toISOString().split('T')[0]; // YYYY-MM-DD 형식 변환
                    }
                },
                { header: '도서명', name: 'title', align: 'center', editor: 'text', sortable: true, filter: 'select' },
                {
                    header: '수량',
                    name: 'quantity',
                    width: 80,
                    align: 'center',
                    editor: 'text',
                    sortable: true,
                    filter: 'number',
                    validation: { required: true, dataType: 'number', min: 0 },
                    formatter: ({ value }) => value ? String(value).replace(/\D/g, '') : '0' // 숫자 이외의 문자 제거
                }

            ],
            rowHeaders: ["checkbox"],
            copyOptions: { useFormattedValue: true },
            editable: true
        });


        let preventAfterChange = false; // `afterChange` 실행 여부를 제어하는 플래그

        tui.Grid.applyTheme('default');

        grid.on('editingStart', (ev) => {
            if (ev.columnName === 'date') {
                const cellEl = grid.getElement(ev.rowKey, ev.columnName);
                if (!cellEl) return;

                // 기존 DatePicker가 있으면 제거
                document.querySelectorAll('.custom-datepicker').forEach(el => el.remove());

                // 새로운 DatePicker 컨테이너 생성
                const pickerContainer = document.createElement('div');
                pickerContainer.classList.add('custom-datepicker');
                pickerContainer.style.position = 'absolute';
                pickerContainer.style.zIndex = '1000';
                pickerContainer.style.background = '#fff';
                pickerContainer.style.border = '1px solid #ddd';
                pickerContainer.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
                pickerContainer.style.padding = '5px';

                document.body.appendChild(pickerContainer);

                // 셀 위치를 기반으로 DatePicker 위치 조정
                const rect = cellEl.getBoundingClientRect();
                pickerContainer.style.top = `${rect.bottom + window.scrollY}px`;
                pickerContainer.style.left = `${rect.left + window.scrollX}px`;

                // 기존 값에서 유효한 날짜만 가져오기
                let initialDate = ev.value ? new Date(ev.value) : new Date();
                if (isNaN(initialDate.getTime())) {
                    initialDate = new Date(); // 날짜가 유효하지 않으면 현재 날짜로 설정
                }
                initialDate.setHours(0, 0, 0, 0); // 시간 제거

                // TOAST UI DatePicker 생성
                const datePicker = new tui.DatePicker(pickerContainer, {
                    showAlways: true,  // 캘린더 항상 보이도록 설정
                    date: initialDate,
                    autoClose: false,  // 날짜 변경 시 자동 닫기 방지
                    type: 'date',      // ✅ "month" 타입 추가 (년/월 변경 활성화)
                    selectableRanges: [[new Date(1900, 0, 1), new Date(2100, 11, 31)]] // 선택 가능 범위 설정
                });

                let prevDate = datePicker.getDate(); // 이전 날짜 저장

                // ✅ "날짜(일)"이 변경될 때만 캘린더를 닫도록 수정
                datePicker.on('change', () => {
                    const selectedDate = datePicker.getDate();
                    if (!selectedDate) return;

                    // "년도 또는 월만 변경" 시에는 캘린더 유지
                    if (
                        // selectedDate.getFullYear() === prevDate.getFullYear() &&
                        // selectedDate.getMonth() === prevDate.getMonth() &&
                        selectedDate.getDate() !== prevDate.getDate() // "날짜(일)"이 변경된 경우에만 처리
                    ) {
                        const formattedDate =
                            selectedDate.getFullYear() + '-' +
                            String(selectedDate.getMonth() + 1).padStart(2, '0') + '-' +
                            String(selectedDate.getDate()).padStart(2, '0');

                        console.log(`선택한 날짜: ${formattedDate}`);

                        setTimeout(() => {
                            grid.finishEditing(); // 편집 종료 후 값 변경
                            grid.setValue(ev.rowKey, ev.columnName, formattedDate);
                            pickerContainer.remove();
                        }, 50);
                    }

                    prevDate = selectedDate; // 선택된 날짜를 저장하여 다음 비교 시 사용
                });

                // ✅ "달력 UI가 다시 그려질 때" 닫히는 문제 방지
                // datePicker.on('draw', () => {
                //     console.log('캘린더가 다시 그려짐 (년/월 변경됨)');
                // });

                // 셀 외부 클릭 시 캘린더 닫기
                document.addEventListener('click', (event) => {
                    if (!pickerContainer.contains(event.target) && event.target !== cellEl) {
                        //setTimeout(() => pickerContainer.remove(), 100);
                    }
                }, { once: true });
            }
        });








        grid.on('afterChange', (ev) => {

            if (preventAfterChange) {
                preventAfterChange = false; // 플래그 초기화
                return; // `afterChange` 실행 방지
            }

            // 정상적으로 `afterChange`가 실행될 코드 작성
            console.log('afterChange triggered:', ev);


            const updatedRows = ev.changes.map(change => ({
                id: grid.getRow(change.rowKey).id,
                [change.columnName]: change.value
            }));
            if (sectionId === "tab-inbound-section") {
                updateData(apiurl+'/api/inbound/update', updatedRows);
            }
            else {
                updateData(apiurl+'/api/outbound/update', updatedRows);
            }


            setTimeout(() => { // ✅ `afterChange`가 실행된 후 값 반영
                ev.changes.forEach(change => {
                    if (change.columnName === 'date') {
                        console.log(`afterChange 적용됨: ${change.value}`);
                        grid.setValue(change.rowKey, change.columnName, change.value);
                    }
                });
            }, 100);

        });




        grid.on('editingFinish', (ev) => {


            if (ev.columnName === 'quantity') {
                let originalValue = String(ev.value);
                let newValue = originalValue.replace(/\D/g, ''); // 숫자 이외의 문자 제거
                console.log("newValue: " + newValue);

                if (originalValue !== newValue) {
                    showToast('number-only', 'warning', lang);
                    preventAfterChange = true; // 숫자가 아닌 값이 입력되었으므로 `afterChange` 방지
                } else {
                    preventAfterChange = false; // 정상적인 입력이므로 `afterChange` 실행 허용
                }

                if (newValue === '') {
                    newValue = '0'; // 빈 값이면 0으로 설정
                }

                grid.setValue(ev.rowKey, ev.columnName, Number(newValue));
            }




            if (ev.columnName === 'date') {
                let dateValue = String(ev.value);
                let dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD 형식 정규식

                if (!dateRegex.test(dateValue)) {
                    showToast('invalid-date-format', 'warning', lang);
                    preventAfterChange = true; // 날짜 형식이 잘못되었으므로 `afterChange` 방지
                    grid.setValue(ev.rowKey, ev.columnName, ''); // 잘못된 값 제거
                } else {
                    preventAfterChange = false; // 정상적인 날짜 입력이면 `afterChange` 허용
                }
            }


        });

        const addButton = createAddButton();



        addButton.addEventListener('click', () => {
            const newRow = {
                id: generateNanoId(),
                date: new Date().toISOString().split('T')[0],

                title: '',
                quantity: 0,
                isbn: ''
            };

            grid.prependRow(newRow);

            if (sectionId === "tab-inbound-section") {
                addData(apiurl+'/api/inbound/add', newRow);
            }
            else {
                addData(apiurl+'/api/outbound/add', newRow);
            }
        });


        const deleteButton = createDelButton();

        deleteButton.addEventListener('click', () => {
            const checkedRows = grid.getCheckedRows();

            if (checkedRows.length === 0) {
                // 체크된 항목이 없을 경우 toast 메시지 출력
                showToast('delete-not', 'warning', lang);
                return;
            }

            grid.removeCheckedRows();

            if (sectionId === "tab-inbound-section") {
                deleteData(apiurl+'/api/inbound/delete', checkedRows);
            }
            else {
                deleteData(apiurl+'/api/outbound/delete', checkedRows);
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
        createGrid(section.id, newInboundData, apiurl+"/api/inbound");
    }

    function populateOutbound(section, newOutboundData) {
        if (!newOutboundData) {
            section.innerHTML = `<div class="text-center text-lg font-semibold">데이터를 불러오는데 실패했습니다.</div>`;
            return;
        }
        createGrid(section.id, newOutboundData, apiurl+"/api/outbound");
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

    const inboundData = await fetchJson(apiurl+"/api/inbound");
    const outboundData = await fetchJson(apiurl+"/api/outbound");


    populateInbound(sections['tab-inbound'], inboundData);
    populateOutbound(sections['tab-outbound'], outboundData);
    populateDashboard(sections['tab-dashboard'], inboundData, outboundData);

});
