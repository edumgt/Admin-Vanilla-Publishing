// log-container에 데이터 시각화 패널 추가
const logContainer = document.getElementById('log-container');

let cpuChartInstance = null; // CPU 차트 인스턴스 저장
let memoryChartInstance = null; // Memory 차트 인스턴스 저장
let diskChartInstance = null; // Disk 차트 인스턴스 저장

function createChart(panelId, canvasId, chartLabel, data, color, titleText) {
    const panel = document.createElement('div');
    panel.id = panelId;
    panel.className = 'log-panel bg-white p-4 rounded-lg';
    panel.style.flex = '1 1 calc(33.3333% - 20px)';
    panel.style.maxWidth = 'calc(33.3333% - 20px)';
    panel.style.margin = '10px';
    panel.style.position = 'relative';

    const canvas = document.createElement('canvas');
    canvas.id = canvasId;
    canvas.style.width = '100%';
    canvas.style.height = '300px';
    panel.appendChild(canvas);

    logContainer.appendChild(panel);

    const ctx = canvas.getContext('2d');
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
            datasets: [{
                label: chartLabel,
                data,
                borderColor: color,
                backgroundColor: `${color}50`,
                fill: true,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: titleText },
            },
            scales: {
                x: { title: { display: true, text: '시간 (24시간 형식)' } },
                y: { beginAtZero: true, max: 100, title: { display: true, text: chartLabel } },
            },
        },
    });
}

logContainer.style.display = 'flex';
logContainer.style.flexWrap = 'nowrap';
logContainer.style.justifyContent = 'space-between';


// 데이터 시각화를 위한 패널 생성
function createVisualizationPanels() {
    // 컨테이너 스타일 설정
    logContainer.style.display = 'flex';
    logContainer.style.flexWrap = 'wrap'; // 차트를 한 줄에 3개씩 배치
    logContainer.style.justifyContent = 'space-between';

    // CPU 차트 생성
    const cpuData = Array.from({ length: 24 }, () => Math.floor(Math.random() * 100));
    cpuChartInstance = createChart('cpu-panel', 'cpuChart', 'CPU 사용량 (%)', cpuData, '#36a2eb', '24시간 CPU 사용량 시각화');

    // Memory 차트 생성
    const memoryData = Array.from({ length: 24 }, () => Math.floor(Math.random() * 100));
    memoryChartInstance = createChart('memory-panel', 'memoryChart', 'Memory 사용량 (%)', memoryData, '#ff6384', '24시간 Memory 사용량 시각화');

    // Disk 차트 생성
    const diskData = Array.from({ length: 24 }, () => Math.floor(Math.random() * 100));
    diskChartInstance = createChart('disk-panel', 'diskChart', 'Disk 사용량 (%)', diskData, '#4bc0c0', '24시간 Disk 사용량 시각화');
}

// 시스템 로그 데이터를 가져오는 함수
async function fetchSystemLogs() {
    // 예제: 실제로는 서버 API를 통해 데이터 가져오기
    try {
        const response = await fetch('assets/mock/cpulog.json'); // API 엔드포인트
        const data = await response.json();

        // 데이터 매핑
        const labels = data.logs.map(log => log.timestamp);
        const cpuUsageData = data.logs.map(log => log.cpuUsage);
        const memoryUsageData = data.logs.map(log => log.memoryUsage);
        const diskUsageData = data.logs.map(log => log.diskUsage);

        // 기존 차트 삭제
        if (cpuChartInstance) cpuChartInstance.destroy();
        if (memoryChartInstance) memoryChartInstance.destroy();
        if (diskChartInstance) diskChartInstance.destroy();

        // CPU 차트 업데이트
        cpuChartInstance = createChart('cpu-panel', 'cpuChart', 'CPU 사용량 (%)', cpuUsageData, '#36a2eb', '24시간 CPU 사용량 시각화');

        // Memory 차트 업데이트
        memoryChartInstance = createChart('memory-panel', 'memoryChart', 'Memory 사용량 (%)', memoryUsageData, '#ff6384', '24시간 Memory 사용량 시각화');

        // Disk 차트 업데이트
        diskChartInstance = createChart('disk-panel', 'diskChart', 'Disk 사용량 (%)', diskUsageData, '#4bc0c0', '24시간 Disk 사용량 시각화');
    } catch (error) {
        console.error('시스템 로그 데이터를 가져오는 중 오류 발생:', error);
    }
}

// 초기화
function initLogVisualization() {
    //createVisualizationPanels();
    fetchSystemLogs();
}

// 페이지 로드 시 초기화 호출
window.addEventListener('DOMContentLoaded', initLogVisualization);
