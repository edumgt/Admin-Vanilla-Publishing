/* CEO 다이어리 — AI·반도체 리더 활동 타임라인 */
import { buildApiUrl } from './common.js';

// ── CEO 목록 (aistock.js 데이터와 동기) ──────────────────────────────────────
const CEOS = [
    { id: 'nvda',      ticker: 'NVDA',       name: 'Jensen Huang',    nameKo: '젠슨 황',    company: 'NVIDIA',          title: '공동창업자 & CEO', avatar: '🟢', color: '#f0fff4' },
    { id: 'msft',      ticker: 'MSFT',       name: 'Satya Nadella',   nameKo: '사티아 나델라', company: 'Microsoft',       title: 'CEO',              avatar: '🟦', color: '#ebf4ff' },
    { id: 'googl',     ticker: 'GOOGL',      name: 'Sundar Pichai',   nameKo: '순다르 피차이', company: 'Alphabet(Google)', title: 'CEO',              avatar: '🔵', color: '#f0f4ff' },
    { id: 'meta',      ticker: 'META',       name: 'Mark Zuckerberg', nameKo: '마크 저커버그', company: 'Meta Platforms',  title: '창업자 & CEO',     avatar: '🔷', color: '#eff6ff' },
    { id: 'amzn',      ticker: 'AMZN',       name: 'Andy Jassy',      nameKo: '앤디 재시',   company: 'Amazon',          title: 'CEO',              avatar: '🟠', color: '#fffbeb' },
    { id: 'aapl',      ticker: 'AAPL',       name: 'Tim Cook',        nameKo: '팀 쿡',      company: 'Apple',           title: 'CEO',              avatar: '⬛', color: '#f7f7f7' },
    { id: 'tsmc',      ticker: 'TSM',        name: 'C.C. Wei',        nameKo: '웨이 저자',   company: 'TSMC',            title: 'CEO & Vice Chair', avatar: '🔴', color: '#fff5f5' },
    { id: 'amd',       ticker: 'AMD',        name: 'Lisa Su',         nameKo: '리사 수',     company: 'AMD',             title: 'CEO',              avatar: '🔺', color: '#fff5f5' },
    { id: 'intel',     ticker: 'INTC',       name: 'Lip-Bu Tan',      nameKo: '립-부 탄',    company: 'Intel',           title: 'CEO (2025.03~)',   avatar: '🔵', color: '#ebf8ff' },
    { id: 'qcom',      ticker: 'QCOM',       name: 'Cristiano Amon',  nameKo: '크리스티아노 아몬', company: 'Qualcomm',    title: 'CEO',              avatar: '🟣', color: '#fdf4ff' },
    { id: 'samsung',   ticker: '005930',     name: '전영현',           nameKo: '전영현',      company: '삼성전자',        title: 'DS부문장 부회장',  avatar: '🔷', color: '#f0f9ff' },
    { id: 'openai',    ticker: 'OPENAI',     name: 'Sam Altman',      nameKo: '샘 올트먼',   company: 'OpenAI',          title: 'CEO',              avatar: '✨', color: '#f0fdf4' },
    { id: 'anthropic', ticker: 'ANTHROPIC',  name: 'Dario Amodei',    nameKo: '다리오 아모데이', company: 'Anthropic',   title: '공동창업자 & CEO', avatar: '🤖', color: '#fef3c7' },
];

// ── 국가 이모지 매핑 ─────────────────────────────────────────────────────────
const FLAG = {
    '미국':      '🇺🇸', '일본':       '🇯🇵', '한국':     '🇰🇷',
    '대만':      '🇹🇼', '중국':       '🇨🇳', '인도':     '🇮🇳',
    '사우디아라비아': '🇸🇦', 'UAE':    '🇦🇪', '프랑스':   '🇫🇷',
    '독일':      '🇩🇪', '영국':       '🇬🇧', '벨기에':   '🇧🇪',
    '싱가포르':  '🇸🇬', '이스라엘':   '🇮🇱', '캐나다':   '🇨🇦',
    '기타':      '🌐',
};

const ACTIVITY_COLORS = {
    '실적발표':  '#e53e3e', '기조연설':  '#d69e2e', '서밋':      '#805ad5',
    '컨퍼런스':  '#319795', '의회증언':  '#2b6cb0', '투자발표':  '#276749',
    '파트너십':  '#b7791f', '신제품발표':'#c53030', '미팅':      '#4a5568',
    '방문':      '#dd6b20', '기고':      '#6b21a8', '기타':      '#a0aec0',
};

// ── 상태 ─────────────────────────────────────────────────────────────────────
let currentCeo = CEOS[0];
let allArticles = [];
let searchQuery = '';
let activeActivity = '전체';
let activityChartInst = null;
let monthlyChartInst = null;

// ── CEO 셀렉터 렌더 ──────────────────────────────────────────────────────────
function renderCeoSelector() {
    const wrap = document.getElementById('ceo-selector');
    wrap.innerHTML = CEOS.map(c => `
        <div class="ceo-card ${c.id === currentCeo.id ? 'active' : ''}" data-id="${c.id}">
            <div class="ceo-avatar" style="background:${c.color}">${c.avatar}</div>
            <div>
                <div style="font-size:.8rem;font-weight:700;color:#2d3748;">${c.nameKo}</div>
                <div style="font-size:.68rem;color:#718096;">${c.company}</div>
            </div>
        </div>
    `).join('');
    wrap.querySelectorAll('.ceo-card').forEach(card => {
        card.addEventListener('click', () => {
            const ceo = CEOS.find(c => c.id === card.dataset.id);
            if (ceo && ceo.id !== currentCeo.id) {
                currentCeo = ceo;
                searchQuery = '';
                activeActivity = '전체';
                document.getElementById('diary-search').value = '';
                renderCeoSelector();
                fetchAndRender();
            }
        });
    });
}

// ── 프로필 헤더 업데이트 ────────────────────────────────────────────────────
function updateProfile(articles) {
    const header = document.getElementById('ceo-profile-header');
    header.classList.remove('hidden');
    document.getElementById('profile-avatar').textContent   = currentCeo.avatar;
    document.getElementById('profile-company').textContent  = currentCeo.company;
    document.getElementById('profile-name').textContent     = `${currentCeo.name} (${currentCeo.nameKo})`;
    document.getElementById('profile-title').textContent    = currentCeo.title;
    document.getElementById('profile-news-count').textContent   = articles.length;
    const countries = [...new Set(articles.map(a => a.country).filter(Boolean))];
    document.getElementById('profile-country-count').textContent = countries.length;
    const latest = articles[0]?.date || '';
    document.getElementById('profile-latest-date').textContent = latest;
}

// ── 활동 필터 탭 ─────────────────────────────────────────────────────────────
function renderActivityFilter(articles) {
    const types = ['전체', ...Object.keys(ACTIVITY_COLORS)].filter(t => {
        if (t === '전체') return true;
        return articles.some(a => a.activity === t);
    });
    const row = document.getElementById('activity-filter-row');
    row.innerHTML = types.map(t => `
        <button class="filter-tab ${t === activeActivity ? 'active' : ''}" data-act="${t}">${t}</button>
    `).join('');
    row.querySelectorAll('.filter-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            activeActivity = btn.dataset.act;
            renderActivityFilter(articles);
            renderTimeline(articles);
        });
    });
}

// ── 타임라인 렌더 ───────────────────────────────────────────────────────────
function renderTimeline(articles) {
    const q = searchQuery.toLowerCase();
    const filtered = articles.filter(a => {
        const actOk = activeActivity === '전체' || a.activity === activeActivity;
        const qOk = !q || [a.title, a.summary, a.country, a.activity, a.source]
            .join(' ').toLowerCase().includes(q);
        return actOk && qOk;
    });

    document.getElementById('diary-count-label').textContent =
        filtered.length > 0 ? `${filtered.length}건` : '';

    const timeline = document.getElementById('diary-timeline');
    const empty    = document.getElementById('diary-empty');

    if (!filtered.length) {
        timeline.innerHTML = '';
        empty.classList.remove('hidden');
        return;
    }
    empty.classList.add('hidden');

    // 날짜별 그룹
    const byDate = {};
    filtered.forEach(a => {
        byDate[a.date] = byDate[a.date] || [];
        byDate[a.date].push(a);
    });
    const dates = Object.keys(byDate).sort((a, b) => b.localeCompare(a));

    timeline.innerHTML = dates.map(d => {
        const [y, m, day] = d.split('-');
        const monthNames = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const entries = byDate[d].map(a => entryHtml(a, y, m, day, monthNames)).join('');
        return entries;
    }).join('');

    // 외부 링크 열기
    timeline.querySelectorAll('a.diary-link').forEach(a => {
        a.addEventListener('click', e => {
            e.stopPropagation();
        });
    });
}

function entryHtml(a, y, m, day, monthNames) {
    const flag    = FLAG[a.country] || '🌐';
    const actCss  = (a.activity || '기타').replace(/·/g, '-');
    const dotColor = ACTIVITY_COLORS[a.activity] || '#a0aec0';
    const link    = a.link && a.link !== '#'
        ? `<a href="${a.link}" target="_blank" rel="noopener" class="diary-link text-blue-500 hover:underline ml-1">↗</a>`
        : '';
    return `
    <div class="diary-entry">
        <div class="diary-date-col">
            <div class="diary-date-day">${day}</div>
            <div class="diary-date-month">${monthNames[+m] || m}.</div>
            <div class="diary-date-year">${y}</div>
        </div>
        <div class="diary-dot" style="border-color:${dotColor};"></div>
        <div class="diary-card activity-${a.activity || '기타'}">
            <div class="flex flex-wrap items-center gap-2 mb-2">
                <span class="activity-badge ab-${a.activity || '기타'}">${a.activity || '기타'}</span>
                <span class="country-chip"><span class="flag">${flag}</span>${a.country || '미국'}</span>
                <span class="source-tag ml-auto">${a.source || ''} ${a.time || ''}</span>
            </div>
            <div class="diary-title">${a.title}${link}</div>
            <div class="diary-summary">${a.summary || ''}</div>
        </div>
    </div>`;
}

// ── 방문국 통계 ──────────────────────────────────────────────────────────────
function renderCountryStat(articles) {
    const cnt = {};
    articles.forEach(a => { if (a.country) cnt[a.country] = (cnt[a.country] || 0) + 1; });
    const sorted = Object.entries(cnt).sort((a, b) => b[1] - a[1]);
    const max = sorted[0]?.[1] || 1;

    document.getElementById('country-stat-list').innerHTML = sorted.slice(0, 10).map(([cn, n]) => `
        <div class="visit-country-bar">
            <span style="min-width:28px;font-size:1.1rem;">${FLAG[cn] || '🌐'}</span>
            <span style="min-width:80px;font-size:.75rem;font-weight:600;color:#4a5568;">${cn}</span>
            <div class="flex-1">
                <div class="visit-bar-fill" style="width:${(n/max)*100}%;"></div>
            </div>
            <span style="min-width:20px;text-align:right;font-size:.75rem;font-weight:700;color:#2d3748;">${n}</span>
        </div>
    `).join('');
}

// ── 활동 도넛 차트 ───────────────────────────────────────────────────────────
function renderActivityChart(articles) {
    const cnt = {};
    articles.forEach(a => { if (a.activity) cnt[a.activity] = (cnt[a.activity] || 0) + 1; });
    const labels = Object.keys(cnt);
    const data   = Object.values(cnt);
    const colors = labels.map(l => ACTIVITY_COLORS[l] || '#a0aec0');

    if (activityChartInst) activityChartInst.destroy();
    activityChartInst = new Chart(document.getElementById('activity-chart'), {
        type: 'doughnut',
        data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 2, borderColor: '#fff' }] },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'right', labels: { font: { size: 9 }, boxWidth: 10, padding: 6 } }
            }
        }
    });
}

// ── 월별 활동 막대 차트 ──────────────────────────────────────────────────────
function renderMonthlyChart(articles) {
    const cnt = {};
    articles.forEach(a => {
        if (!a.date) return;
        const ym = a.date.slice(0, 7);
        cnt[ym] = (cnt[ym] || 0) + 1;
    });
    const sorted = Object.keys(cnt).sort();
    const labels = sorted.map(s => s.replace('-', '.'));
    const data   = sorted.map(s => cnt[s]);

    if (monthlyChartInst) monthlyChartInst.destroy();
    monthlyChartInst = new Chart(document.getElementById('monthly-chart'), {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: 'rgba(0,88,163,.65)',
                borderRadius: 4,
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { font: { size: 9 }, maxRotation: 45 } },
                y: { ticks: { font: { size: 9 }, stepSize: 1 } }
            }
        }
    });
}

// ── 데이터 fetch + 전체 렌더 ─────────────────────────────────────────────────
async function fetchAndRender() {
    const overlay = document.getElementById('loading-overlay');
    overlay.style.display = 'flex';

    try {
        const url = buildApiUrl(`/api/ceo-news?ticker=${currentCeo.ticker}&company=${encodeURIComponent(currentCeo.company)}`);
        const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
        if (!res.ok) throw new Error('API error');
        const json = await res.json();
        allArticles = json.articles || [];
    } catch (e) {
        console.warn('CEO news fetch failed, using empty data:', e);
        allArticles = [];
    }

    overlay.style.display = 'none';

    updateProfile(allArticles);
    renderActivityFilter(allArticles);
    renderTimeline(allArticles);
    renderCountryStat(allArticles);
    renderActivityChart(allArticles);
    renderMonthlyChart(allArticles);
}

// ── 검색 이벤트 ──────────────────────────────────────────────────────────────
document.getElementById('diary-search').addEventListener('input', e => {
    searchQuery = e.target.value;
    renderTimeline(allArticles);
});

// ── 초기화 ───────────────────────────────────────────────────────────────────
renderCeoSelector();
fetchAndRender();
