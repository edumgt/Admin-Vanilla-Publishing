import {
    createSearchButton
} from './common.js';

const searchButton = createSearchButton();

let grid;
let rawData;

window.onload = function () {
    const workarea = document.getElementById('workarea');
    workarea.classList.add('mb-4', 'mt-4');
    workarea.appendChild(searchButton);

    fetchDataAndInitialize();
    document.getElementById('sidoSelect').addEventListener('change', function () {
        const selectedSido = this.value;
        populateGunguSelect(selectedSido);
    });
    searchButton.addEventListener('click', filterBySidoAndGungu);
};

function fetchDataAndInitialize() {
    fetch('assets/mock/citydata.json')
        .then(response => response.json())
        .then(data => {
            rawData = data;
            localStorage.setItem('adminData', JSON.stringify(data));
            populateSidoSelect(data);
            initializeGrid(flattenData(data));
        })
        .catch(error => console.error('Error loading data:', error));
}

function initializeGrid(data) {
    const columns = [
        { header: "읍면동", name: "읍면동" },
        { header: "우편번호", name: "우편번호",},
        { header: "위도", name: "위도"},
        { header: "경도", name: "경도"},
        { header: "약국수", name: "약국수", editor: 'text', editable: true },
        { header: "병의원수", name: "병의원수", editor: 'text', editable: true },
        { header: "학교수", name: "학교수", editor: 'text', editable: true },
        { header: "주차장수", name: "주차장수", editor: 'text', editable: true },
        { header: "주민수", name: "주민수", editor: 'text', editable: true },
        { header: "상점수", name: "상점수", editor: 'text', editable: true },
        { header: "공원수", name: "공원수", editor: 'text', editable: true },
        { header: "도서관수", name: "도서관수", editor: 'text', editable: true },
        { header: "버스정류장수", name: "버스정류장수", editor: 'text', editable: true },
        { header: "지하철역수", name: "지하철역수", editor: 'text', editable: true },
        { header: "음식점수", name: "음식점수", editor: 'text', editable: true },
        { header: "체육시설수", name: "체육시설수", editor: 'text', editable: true },
        { header: "문화시설수", name: "문화시설수", editor: 'text', editable: true },
        { header: "관광명소수", name: "관광명소수", editor: 'text', editable: true },
        { header: "주택수", name: "주택수", editor: 'text', editable: true },
        { header: "입력일자", name: "입력일자" },
        { header: "수정일자", name: "수정일자" }
    ];

    if (grid) {
        grid.destroy();
    }

    grid = new tui.Grid({
        el: document.getElementById('gridContainer'),
        columns: columns,
        data: data,
        rowHeaders: ['checkbox', 'rowNum'],
        scrollX: true,
        scrollY: true,
        bodyHeight: 220,
        frozenCount: 1,
        frozenBorderWidth: 2,
        minWidth: 1600
    });

    grid.on('editingFinish', updateLocalStorage);
    grid.on('check', handleSelectionChange);
    grid.on('uncheck', handleSelectionChange);
}

function flattenData(data) {
    return Object.values(data).flatMap(gungu => Object.values(gungu).flat());
}

function populateSidoSelect(data) {
    const sidoSelect = document.getElementById('sidoSelect');
    sidoSelect.innerHTML = '<option value="">전체</option>';

    Object.keys(data).forEach(sido => {
        const option = document.createElement('option');
        option.value = sido;
        option.textContent = sido;
        sidoSelect.appendChild(option);
    });
}

function populateGunguSelect(sido) {
    const gunguSelect = document.getElementById('gunguSelect');
    gunguSelect.innerHTML = '<option value="">전체</option>';

    if (sido && rawData[sido]) {
        Object.keys(rawData[sido]).forEach(gungu => {
            const option = document.createElement('option');
            option.value = gungu;
            option.textContent = gungu;
            gunguSelect.appendChild(option);
        });
    }
}

function filterBySidoAndGungu() {
    const selectedSido = document.getElementById('sidoSelect').value;
    const selectedGungu = document.getElementById('gunguSelect').value;

    let filteredData = [];

    if (selectedSido) {
        const sidoData = rawData[selectedSido];
        if (selectedGungu) {
            filteredData = sidoData[selectedGungu];
        } else {
            filteredData = Object.values(sidoData).flat();
        }
    } else {
        filteredData = flattenData(rawData);
    }

    initializeGrid(filteredData);
}

function updateLocalStorage(event) {
    const { rowKey, columnName, value } = event;
    const rowData = grid.getRow(rowKey);
    const updatedData = JSON.parse(localStorage.getItem('adminData'));


    for (const sido in updatedData) {
        for (const gungu in updatedData[sido]) {
            const item = updatedData[sido][gungu].find(item => item['읍면동'] === rowData['읍면동']);
            if (item) {
                item[columnName] = value;
                localStorage.setItem('adminData', JSON.stringify(updatedData));
                return;
            }
        }
    }
}

function handleSelectionChange() {
    const selectedRows = grid.getCheckedRows();

    if (selectedRows.length > 2) {
        showToast('two-compare', 'warning', lang);
        const unselectIndex = selectedRows.length - 1;
        grid.uncheck(selectedRows[unselectIndex].rowKey);
        return;
    }

    displayDetailPanels(selectedRows);
    displayComparisonPanel(selectedRows);
}

function displayDetailPanels(selectedRows) {
    const detailPanelLeft = document.getElementById('detailPanelLeft');
    const detailPanelRight = document.getElementById('detailPanelRight');
    const detailContentLeft = document.getElementById('detailContentLeft');
    const detailContentRight = document.getElementById('detailContentRight');

    if (selectedRows.length > 0) {
        detailPanelLeft.style.display = 'block';
        detailContentLeft.innerHTML = `
            <div>
                <h3>${selectedRows[0].읍면동}</h3>
                <p><i class="fas fa-envelope"></i> 우편번호: ${selectedRows[0].우편번호}</p>
                <p><i class="fas fa-map-marker-alt"></i> 위도: ${selectedRows[0].위도}</p>
                <p><i class="fas fa-map-marker-alt"></i> 경도: ${selectedRows[0].경도}</p>
                <p><i class="fas fa-prescription-bottle-alt"></i> 약국수: ${selectedRows[0].약국수}</p>
                <p><i class="fas fa-hospital"></i> 병의원수: ${selectedRows[0].병의원수}</p>
                <p><i class="fas fa-school"></i> 학교수: ${selectedRows[0].학교수}</p>
                <p><i class="fas fa-parking"></i> 주차장수: ${selectedRows[0].주차장수}</p>
                <p><i class="fas fa-users"></i> 주민수: ${selectedRows[0].주민수}</p>
                <p><i class="fas fa-store"></i> 상점수: ${selectedRows[0].상점수}</p>
                <p><i class="fas fa-tree"></i> 공원수: ${selectedRows[0].공원수}</p>
                <p><i class="fas fa-book"></i> 도서관수: ${selectedRows[0].도서관수}</p>
                <p><i class="fas fa-bus"></i> 버스정류장수: ${selectedRows[0].버스정류장수}</p>
                <p><i class="fas fa-subway"></i> 지하철역수: ${selectedRows[0].지하철역수}</p>
                <p><i class="fas fa-utensils"></i> 음식점수: ${selectedRows[0].음식점수}</p>
                <p><i class="fas fa-dumbbell"></i> 체육시설수: ${selectedRows[0].체육시설수}</p>
                <p><i class="fas fa-theater-masks"></i> 문화시설수: ${selectedRows[0].문화시설수}</p>
                <p><i class="fas fa-landmark"></i> 관광명소수: ${selectedRows[0].관광명소수}</p>
                <p><i class="fas fa-home"></i> 주택수: ${selectedRows[0].주택수}</p>
                <p>입력일자: ${selectedRows[0].입력일자}</p>
                <p>수정일자: ${selectedRows[0].수정일자}</p>
            </div>
        `;
        if (selectedRows.length == 2) {
            detailPanelRight.style.display = 'block';
            detailContentRight.innerHTML = `
                <div>
                    <h3>${selectedRows[1].읍면동}</h3>
                    <p>우편번호: ${selectedRows[1].우편번호}</p>
                    <p><i class="fas fa-map-marker-alt"></i> 위도: ${selectedRows[1].위도}</p>
                    <p><i class="fas fa-map-marker-alt"></i> 경도: ${selectedRows[1].경도}</p>
                    <p><i class="fas fa-prescription-bottle-alt"></i> 약국수: ${selectedRows[1].약국수}</p>
                    <p><i class="fas fa-hospital"></i> 병의원수: ${selectedRows[1].병의원수}</p>
                    <p><i class="fas fa-school"></i> 학교수: ${selectedRows[1].학교수}</p>
                    <p><i class="fas fa-parking"></i> 주차장수: ${selectedRows[1].주차장수}</p>
                    <p><i class="fas fa-users"></i> 주민수: ${selectedRows[1].주민수}</p>
                    <p><i class="fas fa-store"></i> 상점수: ${selectedRows[1].상점수}</p>
                    <p><i class="fas fa-tree"></i> 공원수: ${selectedRows[1].공원수}</p>
                    <p><i class="fas fa-book"></i> 도서관수: ${selectedRows[1].도서관수}</p>
                    <p><i class="fas fa-bus"></i> 버스정류장수: ${selectedRows[1].버스정류장수}</p>
                    <p><i class="fas fa-subway"></i> 지하철역수: ${selectedRows[1].지하철역수}</p>
                    <p><i class="fas fa-utensils"></i> 음식점수: ${selectedRows[1].음식점수}</p>
                    <p><i class="fas fa-dumbbell"></i> 체육시설수: ${selectedRows[1].체육시설수}</p>
                    <p><i class="fas fa-theater-masks"></i> 문화시설수: ${selectedRows[1].문화시설수}</p>
                    <p><i class="fas fa-landmark"></i> 관광명소수: ${selectedRows[1].관광명소수}</p>
                    <p><i class="fas fa-home"></i> 주택수: ${selectedRows[1].주택수}</p>
                    <p>입력일자: ${selectedRows[1].입력일자}</p>
                    <p>수정일자: ${selectedRows[1].수정일자}</p>
                </div>
            `;
        } else {
            detailPanelRight.style.display = 'none';
        }
    } else {
        detailPanelLeft.style.display = 'none';
        detailPanelRight.style.display = 'none';
    }
}

function displayComparisonPanel(selectedRows) {
    const comparisonPanel = document.getElementById('comparisonPanel');
    const comparisonContent = document.getElementById('comparisonContent');

    if (selectedRows.length === 2) {
        const [row1, row2] = selectedRows;
        const distance = calculateDistance(row1.위도, row1.경도, row2.위도, row2.경도);
        comparisonPanel.style.display = 'block';
        comparisonContent.innerHTML = `
            <div>
                <h3>거리 및 교통수단</h3>
                <p>${row1.읍면동} - ${row2.읍면동}</p>
                <p class="p-info">거리: ${distance.toFixed(2)} km</p>
                <p>교통수단: 버스, 지하철</p>
            </div>
            <div>
                <h3>충전소 위치</h3>
                <p>${row1.읍면동} 충전소: 5개</p>
                <p>${row2.읍면동} 충전소: 3개</p>
            </div>
            <div>
                <h3>전기차 충전소 위치</h3>
                <p>${row1.읍면동} 전기차 충전소: 2개</p>
                <p>${row2.읍면동} 전기차 충전소: 1개</p>
            </div>
        `;
    } else {
        comparisonPanel.style.display = 'none';
    }
}

// Haversine 공식을 사용하여 두 지점 간의 거리 계산
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // 지구의 반지름 (km)
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

// 각도를 라디안으로 변환
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}
