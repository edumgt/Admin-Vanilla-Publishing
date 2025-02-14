const logContainer = document.getElementById('log-container');
logContainer.classList.add('w-full', 'mt-4');
logContainer.style.display = 'flex';
logContainer.style.flexWrap = 'wrap';
logContainer.style.justifyContent = 'space-between';

let cpuChartInstance = null;
let memoryChartInstance = null;
let diskChartInstance = null;
let networkChartInstance = null;

function createChart(panelId, canvasId, chartLabel, color, titleText, fullWidth = false) {
    const panel = document.createElement('div');
    panel.id = panelId;
    panel.className = 'normal-ddd-border bg-white rounded-lg';
    panel.style.flex = fullWidth ? '1 1 100%' : '1 1 calc(33.3333% - 10px)';
    panel.style.maxWidth = fullWidth ? '100%' : 'calc(33.3333% - 10px)';
    panel.style.margin = '10px 0';
    panel.style.position = 'relative';

    const canvas = document.createElement('canvas');
    canvas.id = canvasId;
    canvas.style.width = '100%';
    canvas.style.height = '350px';
    panel.appendChild(canvas);

    logContainer.appendChild(panel);

    const ctx = canvas.getContext('2d');
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
            datasets: [{
                label: chartLabel,
                data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 100)),
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

function createVisualizationPanels() {
    cpuChartInstance = createChart('cpu-panel', 'cpuChart', 'CPU 사용량 (%)', '#36a2eb', '24시간 CPU 사용량 시각화');
    memoryChartInstance = createChart('memory-panel', 'memoryChart', 'Memory 사용량 (%)', '#ff6384', '24시간 Memory 사용량 시각화');
    diskChartInstance = createChart('disk-panel', 'diskChart', 'Disk 사용량 (%)', '#4bc0c0', '24시간 Disk 사용량 시각화');
    networkChartInstance = createChart('network-panel', 'networkChart', 'Network Bandwidth (Mbps)', '#ff9f40', '네트워크 대역폭 추이', true);
}

async function fetchSystemLogs() {
    try {
        const response = await fetch('assets/mock/cpulog.json');
        const data = await response.json();

        const labels = data.logs.map(log => log.timestamp);
        const cpuUsageData = data.logs.map(log => log.cpuUsage);
        const memoryUsageData = data.logs.map(log => log.memoryUsage);
        const diskUsageData = data.logs.map(log => log.diskUsage);
        const networkUsageData = data.logs.map(log => log.networkUsage || Math.floor(Math.random() * 100));

        if (cpuChartInstance) {
            cpuChartInstance.data.labels = labels;
            cpuChartInstance.data.datasets[0].data = cpuUsageData;
            cpuChartInstance.update();
        }
        if (memoryChartInstance) {
            memoryChartInstance.data.labels = labels;
            memoryChartInstance.data.datasets[0].data = memoryUsageData;
            memoryChartInstance.update();
        }
        if (diskChartInstance) {
            diskChartInstance.data.labels = labels;
            diskChartInstance.data.datasets[0].data = diskUsageData;
            diskChartInstance.update();
        }
        if (networkChartInstance) {
            networkChartInstance.data.labels = labels;
            networkChartInstance.data.datasets[0].data = networkUsageData;
            networkChartInstance.update();
        }
    } catch (error) {
        
        console.error('시스템 로그 데이터를 가져오는 중 오류 발생:', error);
    }
}

function updateTrendCharts() {
    const updateData = (chartInstance) => {
        if (chartInstance) {
            chartInstance.data.datasets[0].data.shift();
            chartInstance.data.datasets[0].data.push(Math.floor(Math.random() * 100));
            chartInstance.update();
        }
    };

    setInterval(() => {
        updateData(cpuChartInstance);
        updateData(memoryChartInstance);
        updateData(diskChartInstance);
    }, 2000);

    setInterval(() => {
        updateData(networkChartInstance);
    }, 3000);
}

function initLogVisualization() {
    createVisualizationPanels();
    fetchSystemLogs();
    updateTrendCharts();
}

window.addEventListener('DOMContentLoaded', initLogVisualization);

