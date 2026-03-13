import { analyzeVideoFile, formatBytes, formatDuration, formatPercent } from './video-ai-detector.js';

const chartContext = document.getElementById('frameChart').getContext('2d');
const toggleChartButton = document.getElementById('toggleChartBtn');
const uploadBox = document.getElementById('uploadBox');
const fileInput = document.getElementById('fileInput');
const videoPlayer = document.getElementById('videoPlayer');
const videoPlaceholder = document.getElementById('videoPlaceholder');
const analysisStatus = document.getElementById('analysisStatus');
const fileName = document.getElementById('fileName');
const metaDuration = document.getElementById('metaDuration');
const metaResolution = document.getElementById('metaResolution');
const metaBitrate = document.getElementById('metaBitrate');
const metaSamples = document.getElementById('metaSamples');
const verdictBadge = document.getElementById('verdictBadge');
const verdict = document.getElementById('verdict');
const resultSummary = document.getElementById('resultSummary');
const resultCard = document.getElementById('resultCard');
const aiProbability = document.getElementById('aiProbability');
const confidence = document.getElementById('confidence');
const frameAverage = document.getElementById('frameAverage');
const temporalDelta = document.getElementById('temporalDelta');
const highlightList = document.getElementById('highlightList');
const indicatorList = document.getElementById('indicatorList');
const chartEmptyState = document.getElementById('chartEmptyState');

let currentChartType = 'line';
let previewObjectUrl;

const frameChart = new Chart(chartContext, {
  type: currentChartType,
  data: {
    labels: [],
    datasets: [{
      label: 'AI 가능성 점수',
      data: [],
      borderColor: '#0f766e',
      backgroundColor: 'rgba(15, 118, 110, 0.22)',
      borderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 5,
      pointBackgroundColor: '#0f766e',
      fill: true,
      tension: 0.32,
    }],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 16,
          color: '#334155',
        },
      },
      tooltip: {
        callbacks: {
          label(context) {
            return ` ${Math.round(context.parsed.y)}%`;
          },
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          color: '#64748b',
          callback(value) {
            return `${value}%`;
          },
        },
        grid: {
          color: 'rgba(226, 232, 240, 0.9)',
        },
      },
      x: {
        ticks: {
          color: '#64748b',
        },
        grid: {
          display: false,
        },
      },
    },
  },
});

function setBadge(tone, label) {
  verdictBadge.className = `status-badge status-${tone}`;
  verdictBadge.textContent = label;
  resultCard.dataset.tone = tone;
}

function renderEmptyHighlights(message) {
  highlightList.innerHTML = `<li class="highlight-item is-empty">${message}</li>`;
}

function renderIndicators(indicators = []) {
  if (!indicators.length) {
    indicatorList.innerHTML = `
      <article class="indicator-tile indicator-empty">
        <strong>분석 대기 중</strong>
        <p>업로드 후 세부 지표가 채워집니다.</p>
      </article>
    `;
    return;
  }

  indicatorList.innerHTML = indicators.map((indicator) => `
    <article class="indicator-tile">
      <div class="indicator-head">
        <strong>${indicator.label}</strong>
        <span class="indicator-score">${formatPercent(indicator.score)}</span>
      </div>
      <div class="indicator-track">
        <div class="indicator-bar" style="width: ${Math.round(indicator.score * 100)}%"></div>
      </div>
      <p>${indicator.description}</p>
    </article>
  `).join('');
}

function renderHighlights(highlights = []) {
  if (!highlights.length) {
    renderEmptyHighlights('판정 근거를 계산하지 못했습니다.');
    return;
  }

  highlightList.innerHTML = highlights.map((highlight) => `
    <li class="highlight-item">
      <strong>${highlight.label} ${formatPercent(highlight.score)}</strong>
      <span>${highlight.detail}</span>
    </li>
  `).join('');
}

function updateChart(frameSeries = []) {
  if (!frameSeries.length) {
    frameChart.data.labels = [];
    frameChart.data.datasets[0].data = [];
    frameChart.update();
    chartEmptyState.classList.remove('hidden');
    return;
  }

  frameChart.data.labels = frameSeries.map((frame) => frame.label);
  frameChart.data.datasets[0].data = frameSeries.map((frame) => Math.round(frame.score * 100));
  frameChart.update();
  chartEmptyState.classList.add('hidden');
}

function renderMetadata(report) {
  const { metadata } = report;
  const bitrate = metadata.bitrateMbps > 0 ? `${metadata.bitrateMbps.toFixed(2)} Mbps` : '-';

  fileName.textContent = metadata.name ? `${metadata.name} (${formatBytes(metadata.size)})` : '-';
  metaDuration.textContent = formatDuration(metadata.duration);
  metaResolution.textContent = metadata.width && metadata.height ? `${metadata.width} × ${metadata.height}` : '-';
  metaBitrate.textContent = bitrate;
  metaSamples.textContent = `${report.frameSeries.length}개`;
}

function setLoadingState(file) {
  analysisStatus.textContent = `${file.name} 분석 중`;
  verdict.textContent = '프레임 샘플링 중';
  resultSummary.textContent = '업로드한 영상에서 대표 프레임을 추출하고 생성형 패턴을 계산하고 있습니다.';
  aiProbability.textContent = '-';
  confidence.textContent = '-';
  frameAverage.textContent = '-';
  temporalDelta.textContent = '-';
  setBadge('idle', '분석 중');
  renderEmptyHighlights('메타데이터와 프레임 신호를 분석하고 있습니다.');
  renderIndicators([]);
  updateChart([]);
}

function renderError(message) {
  analysisStatus.textContent = '분석 실패';
  verdict.textContent = '오류';
  resultSummary.textContent = message;
  aiProbability.textContent = '-';
  confidence.textContent = '-';
  frameAverage.textContent = '-';
  temporalDelta.textContent = '-';
  setBadge('mixed', '오류');
  renderEmptyHighlights(message);
  renderIndicators([]);
  updateChart([]);
}

function renderReport(report) {
  analysisStatus.textContent = '분석 완료';
  verdict.textContent = report.verdict;
  resultSummary.textContent = report.summary;
  aiProbability.textContent = formatPercent(report.aiProbability);
  confidence.textContent = formatPercent(report.confidence);
  frameAverage.textContent = formatPercent(report.averageFrameScore);
  temporalDelta.textContent = `${Math.round(report.frameAverages.temporalDelta * 100)}%`;
  setBadge(report.tone, report.badge);
  renderMetadata(report);
  renderHighlights(report.highlights);
  renderIndicators(report.indicators);
  updateChart(report.frameSeries);
}

async function handleFile(file) {
  if (!file) {
    return;
  }

  if (!file.type.startsWith('video/')) {
    renderError('동영상 파일만 업로드할 수 있습니다.');
    return;
  }

  if (previewObjectUrl) {
    URL.revokeObjectURL(previewObjectUrl);
  }

  previewObjectUrl = URL.createObjectURL(file);
  videoPlayer.src = previewObjectUrl;
  videoPlaceholder.classList.add('hidden');
  setLoadingState(file);

  try {
    const report = await analyzeVideoFile(file, { sampleCount: 8 });
    renderReport(report);
  } catch (error) {
    renderError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
  }
}

function setDragState(isActive) {
  uploadBox.classList.toggle('is-dragover', isActive);
}

uploadBox.addEventListener('click', () => fileInput.click());
uploadBox.addEventListener('dragover', (event) => {
  event.preventDefault();
  setDragState(true);
});
uploadBox.addEventListener('dragleave', () => setDragState(false));
uploadBox.addEventListener('drop', (event) => {
  event.preventDefault();
  setDragState(false);
  handleFile(event.dataTransfer.files[0]);
});

fileInput.addEventListener('change', (event) => {
  handleFile(event.target.files[0]);
});

toggleChartButton.addEventListener('click', () => {
  currentChartType = currentChartType === 'line' ? 'bar' : 'line';
  frameChart.config.type = currentChartType;
  frameChart.update();
  toggleChartButton.textContent = currentChartType === 'line' ? 'Bar 차트로 보기' : 'Line 차트로 보기';
});

window.addEventListener('beforeunload', () => {
  if (previewObjectUrl) {
    URL.revokeObjectURL(previewObjectUrl);
  }
});

setBadge('idle', '대기');
renderEmptyHighlights('영상 업로드 후 주요 판정 근거가 표시됩니다.');
renderIndicators([]);
updateChart([]);
