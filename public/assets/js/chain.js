const hotelData = [
    { "name": "Hotel A", "address": "123 Seoul St.", "phone": "010-1234-5678", "region": "Seoul" },
    { "name": "Hotel B", "address": "124 Busan St.", "phone": "010-1234-5679", "region": "Busan" },
    { "name": "Hotel C", "address": "125 Daegu St.", "phone": "010-1234-5680", "region": "Daegu" },
    { "name": "Hotel D", "address": "126 Incheon St.", "phone": "010-1234-5681", "region": "Incheon" },
    { "name": "Hotel E", "address": "127 Gwangju St.", "phone": "010-1234-5682", "region": "Gwangju" },
    { "name": "Hotel F", "address": "128 Daejeon St.", "phone": "010-1234-5683", "region": "Daejeon" },
    { "name": "Hotel G", "address": "129 Ulsan St.", "phone": "010-1234-5684", "region": "Ulsan" },
    { "name": "Hotel H", "address": "130 Sejong St.", "phone": "010-1234-5685", "region": "Sejong" },
    { "name": "Hotel I", "address": "131 Gyeonggi St.", "phone": "010-1234-5686", "region": "Gyeonggi" },
    { "name": "Hotel J", "address": "132 Gangwon St.", "phone": "010-1234-5687", "region": "Gangwon" },
    { "name": "Hotel K", "address": "133 Chungbuk St.", "phone": "010-1234-5688", "region": "Chungbuk" },
    { "name": "Hotel L", "address": "134 Chungnam St.", "phone": "010-1234-5689", "region": "Chungnam" },
    { "name": "Hotel M", "address": "135 Jeonbuk St.", "phone": "010-1234-5690", "region": "Jeonbuk" },
    { "name": "Hotel N", "address": "136 Jeonnam St.", "phone": "010-1234-5691", "region": "Jeonnam" },
    { "name": "Hotel O", "address": "137 Gyeongbuk St.", "phone": "010-1234-5692", "region": "Gyeongbuk" },
    { "name": "Hotel P", "address": "138 Gyeongnam St.", "phone": "010-1234-5693", "region": "Gyeongnam" },
    { "name": "Hotel Q", "address": "139 Jeju St.", "phone": "010-1234-5694", "region": "Jeju" },
    { "name": "Hotel BC", "address": "177 Gyeongnam St.", "phone": "010-1234-5732", "region": "Gyeongnam" }
];

createModal3(
    'tmpModal',
    '수정 이력',
    `<div id="historyModal" class="rounded">
            <pre id="historyContent"></pre>
            <button id="closeHistoryBtn" class="bg-gray-500 text-white mt-2">닫기</button>
        </div>`,
    []
);

hotelData.forEach((hotel, index) => {
    hotel.id = generateNanoId();

    hotel.rowNo = index + 1;
    hotel.visitors = Array.from({ length: 12 }, () => Math.floor(Math.random() * 101) + 100);
    //console.log(hotel.visitors);
});

// 데이터 로컬 스토리지에 저장
function saveDataToLocalStorage(data) {
    localStorage.setItem('hotelData', JSON.stringify(data));
}

// 수정 이력을 로컬 스토리지에 저장
function saveHistoryToLocalStorage(history) {
    const storedHistory = localStorage.getItem('historyData');
    const historyData = storedHistory ? JSON.parse(storedHistory) : [];
    historyData.push(history);
    localStorage.setItem('historyData', JSON.stringify(historyData));
}

// 로컬 스토리지에서 데이터 로드
function loadDataFromLocalStorage() {
    const storedData = localStorage.getItem('hotelData');
    return storedData ? JSON.parse(storedData) : hotelData;
}

// 로컬 스토리지에서 수정 이력 로드
function loadHistoryFromLocalStorage() {
    const storedHistory = localStorage.getItem('historyData');
    return storedHistory ? JSON.parse(storedHistory) : [];
}

function saveColumnOrder() {
    if (!gridOptions.api) return;  // ✅ gridOptions.api가 존재하는지 확인
    const columnState = gridOptions.api.getColumnState();
    localStorage.setItem('columnOrder', JSON.stringify(columnState));
}

function loadColumnOrder() {
    const storedColumnOrder = localStorage.getItem('columnOrder');
    return storedColumnOrder ? JSON.parse(storedColumnOrder) : null;
}

// AG Grid 초기화
const columnDefs = [
    { headerName: 'Row No', field: 'rowNo', cellClass: 'custom-cell', headerClass: 'custom-header', editable: false, flex: 0.5 },
    { headerName: 'UUID', field: 'id', cellClass: 'custom-cell', headerClass: 'custom-header', editable: false, flex: 1 },
    {
        headerName: 'Region', field: 'region', cellClass: 'custom-cell', headerClass: 'custom-header', editable: true, flex: 1,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['Seoul', 'Busan', 'Daegu', 'Incheon', 'Gwangju', 'Daejeon', 'Ulsan', 'Sejong', 'Gyeonggi', 'Gangwon', 'Chungbuk', 'Chungnam', 'Jeonbuk', 'Jeonnam', 'Gyeongbuk', 'Gyeongnam', 'Jeju']
        }
    },
    { headerName: 'Name', field: 'name', cellClass: 'custom-cell', headerClass: 'custom-header', editable: true, flex: 1 },
    { headerName: 'Address', field: 'address', cellClass: 'custom-cell', headerClass: 'custom-header', editable: true, flex: 1 },
    { headerName: 'Phone', field: 'phone', cellClass: 'custom-cell', headerClass: 'custom-header', editable: true, flex: 1 },
    {
        headerName: 'Actions',
        field: 'actions',

        headerClass: 'custom-header',
        cellRenderer: function (params) {
            const button = document.createElement('button');
            button.textContent = '수정 이력 보기';
            button.className = 'history-button';
            button.addEventListener('click', function () {
                const historyData = loadHistoryFromLocalStorage();
                const rowHistory = historyData.filter(hist => hist.id === params.data.id);
                const historyContent = document.getElementById('historyContent');
                historyContent.textContent = JSON.stringify(rowHistory, null, 2);
                document.getElementById('tmpModal').style.display = 'block';
                document.getElementById('historyModal').style.display = 'block';
            });
            return button;
        },
        flex: 1
    }
];

const gridOptions = {
    columnDefs: columnDefs,
    rowData: loadDataFromLocalStorage(),
    rowClass: 'custom-row',
    defaultColDef: {
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
        editable: true,
    },
    pagination: true,
    paginationPageSize: 10,
    paginationPageSizeSelector: [10, 20, 50, 100],
    animateRows: true,
    getDataPath: function (data) {
        return [data.region, data.name];
    },
    autoGroupColumnDef: {
        headerName: 'Region',
        cellRendererParams: {
            suppressCount: true
        }
    },
    icons: {
        sortAscending: '<i class="fas fa-sort-up"></i>',
        sortDescending: '<i class="fas fa-sort-down"></i>',
        filter: '<i class="fas fa-filter"></i>',
        groupExpanded: '<i class="fas fa-minus-square"></i>',
        groupContracted: '<i class="fas fa-plus-square"></i>'
    },
    onCellValueChanged: function (event) {

        const updatedData = [];
        event.api.forEachNode(function (node) {
            updatedData.push(node.data);
        });
        saveDataToLocalStorage(updatedData);


        const history = {
            timestamp: new Date().toISOString(),
            originalValue: event.oldValue,
            newValue: event.newValue,
            field: event.colDef.field,
            id: event.data.id
        };
        saveHistoryToLocalStorage(history);
    },

    

    // 컬럼 이동 시 상태 저장
    onColumnMoved: function (event) {
        if (!event.api) return;  // ✅ event.api가 존재하는지 확인
        const columnState = event.api.getColumnState();
        localStorage.setItem('columnOrder', JSON.stringify(columnState));
    },

    // 그리드 로드 시 저장된 컬럼 순서 적용
    onGridReady: function (params) {
        const storedColumnOrder = loadColumnOrder();
        if (storedColumnOrder) {
            params.api.applyColumnState({ state: storedColumnOrder, applyOrder: true });
        }
        setTimeout(() => params.api.sizeColumnsToFit(), 100);
    },
    rowHeight: 40,
    headerHeight: 40,
    onRowClicked: onRowClicked,
};

document.addEventListener('DOMContentLoaded', function () {
    const eGridDiv = document.querySelector('#myGrid');
    eGridDiv.classList.add('custom-grid');
    new agGrid.createGrid(eGridDiv, gridOptions);
    saveDataToLocalStorage(gridOptions.rowData);

    document.getElementById('closeHistoryBtn').addEventListener('click', function () {
        document.getElementById('tmpModal').style.display = 'none';
        document.getElementById('historyModal').style.display = 'none';
    });

});



const lineChartOptions = {
    series: [{
        name: "Visitors",
        data: []
    }],
    chart: {
        height: 350,
        type: 'line'
    },
    stroke: {
        curve: 'smooth' // 이 부분이 선의 유연성을 조정합니다.
    },
    title: {
        text: 'Monthly Visitors'
    },
    xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
};


const pieChartOptions = {
    series: [],
    chart: {
        height: 350,
        type: 'pie'
    },
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    title: {
        text: 'Visitors Distribution'
    }
};


const lineChart = new ApexCharts(document.querySelector("#lineChart"), lineChartOptions);
lineChart.render();

const pieChart = new ApexCharts(document.querySelector("#pieChart"), pieChartOptions);
pieChart.render();

// 행 클릭 시 호출되는 함수
function onRowClicked(event) {
    const visitors = event.data.visitors;
    if (visitors) {
        lineChart.updateSeries([{
            name: "Visitors",
            data: visitors
        }]);

        pieChart.updateSeries(visitors);
    } else {
        //console.log('Visitors data not found for the selected row.');
    }
}
