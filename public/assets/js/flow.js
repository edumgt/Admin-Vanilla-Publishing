function getDataFromLocalStorage() {

    fetch('assets/mock/stati.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('handsontableData', JSON.stringify(data));
            //console.log(localStorage.getItem('handsontableData'));
        })
        .catch(error => {
            showToast('loading-error', 'error', lang);
        });

    const data = localStorage.getItem('handsontableData');
    return data ? JSON.parse(data) : [];
}

// 로컬 스토리지에 데이터 저장하기
function saveDataToLocalStorage(data) {
    localStorage.setItem('handsontableData', JSON.stringify(data));
}

// 합계 행 계산
function calculateSumRow(data) {
    const sumRow = Array(12).fill(0);
    data.forEach(row => {
        row.slice(1).forEach((value, index) => {
            if (!isNaN(value)) {
                sumRow[index] += value;
            }
        });
    });
    return sumRow;
}

const container1 = document.getElementById('hot1');
if (container1) {
    const hot1 = new Handsontable(container1, {
        data: getDataFromLocalStorage(),
        colHeaders: ['item', '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],

        columns: [
            { data: 0, type: 'text', allowFillHandle: true },
            ...Array(12).fill({ type: 'numeric' })
        ],
        fillHandle: {
            autoInsertRow: true
        },
        colWidths: 100,
        rowHeights: 30,

        rowHeaders: true,
        filters: true,
        dropdownMenu: true,
        contextMenu: true,
        afterChange: function (changes, source) {
            if (source !== 'loadData') {
                const data = hot1.getData();
                const sumRow = calculateSumRow(data);
                hot2.loadData([sumRow]);
                updateChart(data);
                saveDataToLocalStorage(data);
            }
        },
        afterRemoveRow: function (index, amount) {
            const data = hot1.getData();
            const sumRow = calculateSumRow(data);
            hot2.loadData([sumRow]);
            updateChart(data);
            saveDataToLocalStorage(data);
        },
        licenseKey: 'non-commercial-and-evaluation' // 무료 버전 사용 시 필요
    });

    const container2 = document.getElementById('hot2');
    const hot2 = new Handsontable(container2, {
        data: [calculateSumRow(getDataFromLocalStorage())],
        colHeaders: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        columns: Array(12).fill({ type: 'numeric', readOnly: true }),
        colWidths: 110,

        rowHeaders: false,
        licenseKey: 'non-commercial-and-evaluation' // 무료 버전 사용 시 필요
    });

    const chartOptions = {
        chart: {
            type: 'line',
            height: 350
        },
        series: [],
        xaxis: {
            categories: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
        },
        colors: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FF8C33', '#33FFF5', '#8C33FF', '#FF3333', '#33FF8C', '#FF5733', '#33A1FF', '#FF33FF', '#33FF33']
    };

    const chart = new ApexCharts(document.querySelector("#chart"), chartOptions);
    chart.render();

    // 차트 업데이트
    function updateChart(data) {
        const sumRow = calculateSumRow(data);
        const series = data.map(row => ({
            name: row[0],
            data: row.slice(1)
        }));
        series.push({
            name: '합계',
            data: sumRow
        });
        chart.updateSeries(series);
    }

    updateChart(getDataFromLocalStorage());
}


