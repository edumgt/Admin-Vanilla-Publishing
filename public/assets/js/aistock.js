/* AI·반도체 기업 정보 페이지 */

// ── 기업 데이터 ──────────────────────────────────────────────────────────────
const COMPANIES = [
    {
        id: 'nvda', name: 'NVIDIA', ticker: 'NVDA', sector: '반도체',
        logo: '🟢', logoColor: '#f0fff4',
        ceo: 'Jensen Huang (황젠슨)',
        ceoTitle: '공동창업자 & CEO',
        founded: 1993, hq: '캘리포니아, 산타클라라',
        employees: '32,000+',
        revenue2024: 600.8,   // 억 달러 (FY2025 = 역년 2024)
        revenueGrowth: '+122%',
        marketCap: 34000,     // 억 달러
        pe: 45,
        mainProducts: 'H100/H200/B200 GPU, DGX 서버, CUDA, NIM 마이크로서비스',
        summary: 'AI 가속 컴퓨팅 시장의 절대 강자. 데이터센터 GPU 점유율 80%+. H100/H200 칩은 ChatGPT·Gemini·Claude 등 LLM 학습의 핵심 인프라. 2025년 블랙웰 아키텍처(B200) 본격 출하.',
        stockChange: '+190%',
        changeDir: 'up',
        website: 'nvidia.com',
        keyMetrics: { 'Data Center 매출': '$473B', 'GPU 점유율': '~80%', '순이익률': '55%', 'R&D 비중': '12%' }
    },
    {
        id: 'msft', name: 'Microsoft', ticker: 'MSFT', sector: 'AI·클라우드',
        logo: '🟦', logoColor: '#ebf4ff',
        ceo: '사티아 나델라 (Satya Nadella)',
        ceoTitle: 'CEO',
        founded: 1975, hq: '워싱턴, 레드먼드',
        employees: '228,000+',
        revenue2024: 2450.0,
        revenueGrowth: '+16%',
        marketCap: 32000,
        pe: 36,
        mainProducts: 'Azure OpenAI, Copilot, Azure AI, GitHub Copilot, Teams AI',
        summary: 'OpenAI에 130억 달러+ 투자, Azure에 OpenAI 모델 통합. Copilot을 전 제품군에 탑재. Azure AI 매출 성장률 70%+. 기업용 AI 확산의 최대 수혜주.',
        stockChange: '+22%',
        changeDir: 'up',
        website: 'microsoft.com',
        keyMetrics: { 'Azure 성장률': '+33%', 'Copilot 구독': '1억+', '순이익률': '36%', 'R&D 비중': '14%' }
    },
    {
        id: 'googl', name: 'Alphabet (Google)', ticker: 'GOOGL', sector: 'AI·클라우드',
        logo: '🔵', logoColor: '#f0f4ff',
        ceo: '순다르 피차이 (Sundar Pichai)',
        ceoTitle: 'CEO',
        founded: 1998, hq: '캘리포니아, 마운틴뷰',
        employees: '181,000+',
        revenue2024: 3502.0,
        revenueGrowth: '+14%',
        marketCap: 22000,
        pe: 22,
        mainProducts: 'Gemini, TPU v5, Google Cloud AI, Vertex AI, NotebookLM',
        summary: 'Gemini 1.5/2.0 모델 시리즈 출시. TPU v5로 자체 AI 칩 경쟁력 강화. Google Cloud AI 매출 연 28% 성장. DeepMind·Google Brain 통합으로 AI 연구 역량 집중.',
        stockChange: '+35%',
        changeDir: 'up',
        website: 'abc.xyz',
        keyMetrics: { 'Cloud 성장률': '+28%', 'Search AI 점유율': '91%', '순이익률': '26%', 'TPU 세대': 'v5p' }
    },
    {
        id: 'meta', name: 'Meta Platforms', ticker: 'META', sector: 'AI',
        logo: '🔷', logoColor: '#eff6ff',
        ceo: '마크 저커버그 (Mark Zuckerberg)',
        ceoTitle: '공동창업자 & CEO',
        founded: 2004, hq: '캘리포니아, 멘로파크',
        employees: '72,000+',
        revenue2024: 1648.0,
        revenueGrowth: '+22%',
        marketCap: 16000,
        pe: 28,
        mainProducts: 'Llama 4, Meta AI Assistant, Ray-Ban AI, MTIA 칩',
        summary: 'Llama 오픈소스 모델 시리즈로 오픈소스 AI 생태계 주도. 2025년 AI 인프라에 600~650억 달러 투자 계획. Ray-Ban 스마트글라스에 AI 통합. 광고 타겟팅에 AI 적용으로 ARPU 개선.',
        stockChange: '+62%',
        changeDir: 'up',
        website: 'meta.com',
        keyMetrics: { 'DAU': '33억+', 'Llama 다운로드': '7억+', '순이익률': '35%', 'AI 투자': '$60B+' }
    },
    {
        id: 'amzn', name: 'Amazon', ticker: 'AMZN', sector: 'AI·클라우드',
        logo: '🟠', logoColor: '#fffbeb',
        ceo: '앤디 재시 (Andy Jassy)',
        ceoTitle: 'CEO',
        founded: 1994, hq: '워싱턴, 시애틀',
        employees: '1,500,000+',
        revenue2024: 6380.0,
        revenueGrowth: '+11%',
        marketCap: 23000,
        pe: 45,
        mainProducts: 'AWS Bedrock, Trainium/Inferentia 칩, Alexa+, Nova 모델',
        summary: 'AWS가 클라우드 AI 서비스 중 가장 큰 시장점유율(31%). Trainium2 칩으로 NVIDIA 의존 탈피 추진. Amazon Bedrock을 통해 Anthropic Claude·Llama·Titan 모델 제공. AGI 개발사 Anthropic에 40억 달러 투자.',
        stockChange: '+28%',
        changeDir: 'up',
        website: 'amazon.com',
        keyMetrics: { 'AWS 점유율': '31%', 'AWS 성장률': '+21%', 'AWS 영업이익': '$39B', 'AI 투자': '$100B+' }
    },
    {
        id: 'aapl', name: 'Apple', ticker: 'AAPL', sector: 'AI',
        logo: '⬛', logoColor: '#f7f7f7',
        ceo: '팀 쿡 (Tim Cook)',
        ceoTitle: 'CEO',
        founded: 1976, hq: '캘리포니아, 쿠퍼티노',
        employees: '160,000+',
        revenue2024: 3909.0,
        revenueGrowth: '+2%',
        marketCap: 33000,
        pe: 33,
        mainProducts: 'Apple Intelligence, M4 칩, Siri AI, iPhone AI 기능',
        summary: 'Apple Intelligence를 iOS 18/macOS에 통합. M4 칩의 NPU로 온디바이스 AI 추론 강화. OpenAI와 파트너십으로 ChatGPT Siri 통합. 하드웨어+AI 에코시스템 시너지.',
        stockChange: '+12%',
        changeDir: 'up',
        website: 'apple.com',
        keyMetrics: { 'iPhone 매출': '$201B', 'Services 성장': '+13%', '순이익률': '26%', 'M4 NPU': '38TOPs' }
    },
    {
        id: 'tsmc', name: 'TSMC', ticker: 'TSM', sector: '반도체',
        logo: '🔴', logoColor: '#fff5f5',
        ceo: '웨이 저자 (Wei Zhe-Jia, C.C. Wei)',
        ceoTitle: 'CEO & Vice Chairman',
        founded: 1987, hq: '대만, 신주',
        employees: '73,000+',
        revenue2024: 908.0,
        revenueGrowth: '+34%',
        marketCap: 10800,
        pe: 28,
        mainProducts: '2nm/3nm/4nm 공정, CoWoS 패키징, N2 공정(2025)',
        summary: 'NVIDIA H100/B200, Apple M4, AMD MI300 등 세계 최첨단 AI 칩의 위탁 제조. CoWoS 첨단 패키징 수요 폭증. 2nm 공정 2025년 양산 목표. 미국 애리조나 팹 건설 진행 중.',
        stockChange: '+80%',
        changeDir: 'up',
        website: 'tsmc.com',
        keyMetrics: { '선단공정 비중': '69%', '설비투자': '$38B', 'CoWoS 수율': '90%+', '고객사': 'NVDA·AAPL·AMD' }
    },
    {
        id: 'amd', name: 'AMD', ticker: 'AMD', sector: '반도체',
        logo: '🔺', logoColor: '#fff5f5',
        ceo: '리사 수 (Lisa Su)',
        ceoTitle: 'CEO',
        founded: 1969, hq: '캘리포니아, 산타클라라',
        employees: '26,000+',
        revenue2024: 257.8,
        revenueGrowth: '+14%',
        marketCap: 2200,
        pe: 55,
        mainProducts: 'MI300X/MI325X GPU, EPYC CPU, Ryzen AI',
        summary: 'MI300X가 NVIDIA H100의 유력 대안으로 부상. Microsoft·Meta·Oracle 등이 MI300X 도입. 2024년 AI 가속기 매출 목표 50억 달러. Instinct MI350/MI400 로드맵 공개.',
        stockChange: '+18%',
        changeDir: 'up',
        website: 'amd.com',
        keyMetrics: { 'AI 가속기 매출': '$5B 목표', 'EPYC 점유율': '~35%', 'MI300X vs H100': '+20% 메모리', '순이익률': '6%' }
    },
    {
        id: 'intc', name: 'Intel', ticker: 'INTC', sector: '반도체',
        logo: '🔵', logoColor: '#ebf8ff',
        ceo: '립-부 탄 (Lip-Bu Tan)',
        ceoTitle: 'CEO (2025.03~)',
        founded: 1968, hq: '캘리포니아, 산타클라라',
        employees: '124,000+',
        revenue2024: 531.0,
        revenueGrowth: '-2%',
        marketCap: 850,
        pe: 'N/A',
        mainProducts: 'Gaudi 3 AI 가속기, 18A 공정, Core Ultra, Foundry 서비스',
        summary: '파운드리 전략 대전환 중. Gaudi 3 AI 가속기로 AI 시장 재진입 시도. 18A 공정(2025년)으로 파운드리 사업 경쟁력 회복 목표. 2025년 구조조정 완료 후 반등 기대.',
        stockChange: '-42%',
        changeDir: 'down',
        website: 'intel.com',
        keyMetrics: { 'Gaudi 3 성능': 'H100 대비 경쟁', '파운드리 수주': '마이크로소프트 등', '18A 공정': '2025 양산', '구조조정': '1.5만명 감원' }
    },
    {
        id: 'qcom', name: 'Qualcomm', ticker: 'QCOM', sector: '반도체',
        logo: '🟣', logoColor: '#fdf4ff',
        ceo: '크리스티아노 아몬 (Cristiano Amon)',
        ceoTitle: 'CEO',
        founded: 1985, hq: '캘리포니아, 샌디에이고',
        employees: '51,000+',
        revenue2024: 389.6,
        revenueGrowth: '+9%',
        marketCap: 1700,
        pe: 18,
        mainProducts: 'Snapdragon X Elite, Snapdragon 8 Gen 4, Oryon CPU',
        summary: '스마트폰 AP 시장의 강자. Snapdragon X Elite로 온디바이스 AI PC 시장 공략. Windows on ARM 전략 수혜. 자동차 AI 칩 시장 진출로 사업 다각화. NPU 성능 경쟁 주도.',
        stockChange: '+5%',
        changeDir: 'up',
        website: 'qualcomm.com',
        keyMetrics: { 'QTL 라이선스': '$1.5B/분기', 'Auto 매출': '+55% YoY', 'On-device AI': '75TOPS', 'PC 시장 점유': '확대 중' }
    },
    {
        id: 'samsung', name: '삼성전자', ticker: '005930.KS', sector: '반도체',
        logo: '🔷', logoColor: '#f0f9ff',
        ceo: '전영현 (DS 부문장)',
        ceoTitle: 'DS부문장 부회장',
        founded: 1969, hq: '경기도 수원',
        employees: '270,000+',
        revenue2024: 3000.0,
        revenueGrowth: '+16%',
        marketCap: 3200,
        pe: 14,
        mainProducts: 'HBM3E, DRAM, NAND, Exynos, 파운드리 2nm GAA',
        summary: 'HBM3E 메모리로 AI 반도체 핵심 부품 공급. NVIDIA HBM3E 공급 인증 획득(2025). 2nm GAA 파운드리 기술 개발 중. AI 데이터센터 메모리 수요 급증으로 반도체 부문 반등.',
        stockChange: '-8%',
        changeDir: 'down',
        website: 'samsung.com/sec',
        keyMetrics: { 'HBM 점유율': '~40%', 'DRAM 점유율': '~45%', 'NAND 점유율': '~35%', '파운드리': '2nm GAA 개발' }
    },
    {
        id: 'anthropic', name: 'Anthropic', ticker: '비상장', sector: 'AI',
        logo: '🤖', logoColor: '#fef3c7',
        ceo: '다리오 아모데이 (Dario Amodei)',
        ceoTitle: '공동창업자 & CEO',
        founded: 2021, hq: '캘리포니아, 샌프란시스코',
        employees: '1,000+',
        revenue2024: 17.0,
        revenueGrowth: '+400%',
        marketCap: 614,
        pe: 'N/A',
        mainProducts: 'Claude 3.5 Sonnet/Haiku/Opus, Claude API, Claude.ai',
        summary: 'OpenAI 출신이 설립한 AI 안전 중심 AGI 연구소. Claude 3.5 Sonnet은 코딩·추론 벤치마크 1위. Amazon 40억 달러·Google 5억 달러 투자. 기업용 Claude API 채택 급증.',
        stockChange: '비상장',
        changeDir: 'up',
        website: 'anthropic.com',
        keyMetrics: { '기업가치': '$61.5B', 'Amazon 투자': '$4B', 'Google 투자': '$0.5B', '모델': 'Claude 3.5' }
    },
    {
        id: 'openai', name: 'OpenAI', ticker: '비상장', sector: 'AI',
        logo: '✨', logoColor: '#f0fdf4',
        ceo: '샘 올트먼 (Sam Altman)',
        ceoTitle: 'CEO',
        founded: 2015, hq: '캘리포니아, 샌프란시스코',
        employees: '3,000+',
        revenue2024: 37.0,
        revenueGrowth: '+300%',
        marketCap: 1570,
        pe: 'N/A',
        mainProducts: 'GPT-4o, o3, Sora, DALL-E 3, ChatGPT, OpenAI API',
        summary: 'ChatGPT로 전 세계 AI 대중화를 이끈 기업. GPT-4o 멀티모달 모델, o3 추론 모델 공개. Microsoft와 전략적 파트너십. 2025년 $40B 펀딩 라운드 완료. AI 검색·에이전트 시장 확장 중.',
        stockChange: '비상장',
        changeDir: 'up',
        website: 'openai.com',
        keyMetrics: { '기업가치': '$157B', 'ChatGPT 유저': '3억+', 'API 수익': '$37B 목표', '투자자': 'Microsoft·SoftBank' }
    }
];

// ── 주요 일정 데이터 ─────────────────────────────────────────────────────────
const EVENTS = [
    { date: '2025-07-01', company: 'NVIDIA', type: 'earnings', title: 'NVIDIA Q1 FY2026 실적 발표', detail: 'Blackwell 출하량, 데이터센터 매출 가이던스 주목' },
    { date: '2025-07-16', company: 'TSMC', type: 'earnings', title: 'TSMC 2Q2025 실적 발표', detail: 'N3/N2 공정 수율, CoWoS 수요 업데이트' },
    { date: '2025-07-23', company: 'Alphabet', type: 'earnings', title: 'Google Q2 2025 실적', detail: 'Google Cloud AI 성장률, Gemini 수익화 현황' },
    { date: '2025-07-29', company: 'Meta', type: 'earnings', title: 'Meta Q2 2025 실적', detail: 'AI 광고 효율, Llama 상용화 진행 상황' },
    { date: '2025-07-30', company: 'Microsoft', type: 'earnings', title: 'Microsoft FQ4 2025 실적', detail: 'Azure AI 성장률, Copilot 구독 수 공개' },
    { date: '2025-08-01', company: 'Amazon', type: 'earnings', title: 'Amazon Q2 2025 실적', detail: 'AWS AI 서비스 성장, Trainium2 진척 상황' },
    { date: '2025-08-05', company: 'AMD', type: 'earnings', title: 'AMD Q2 2025 실적', detail: 'MI300X 판매량, AI 가속기 매출 가이던스' },
    { date: '2025-09-10', company: 'Apple', type: 'product', title: 'Apple iPhone 17 발표', detail: 'Apple Intelligence 강화, A19 칩 NPU 성능 공개 예상' },
    { date: '2025-09-22', company: 'Qualcomm', type: 'conf', title: 'Snapdragon Summit 2025', detail: 'Snapdragon 8 Elite 2세대, AI PC용 신규 칩 발표 예정' },
    { date: '2025-10-15', company: 'NVIDIA', type: 'conf', title: 'NVIDIA AI Summit', detail: 'B300/Rubin 아키텍처 로드맵 업데이트 기대' },
    { date: '2025-10-28', company: 'Alphabet', type: 'earnings', title: 'Google Q3 2025 실적', detail: 'Gemini 2.0 상용화 성과, TPU v5p 공급 현황' },
    { date: '2025-10-29', company: 'Microsoft', type: 'earnings', title: 'Microsoft FQ1 2026 실적', detail: 'Copilot+ PC 판매, Enterprise AI 구독 성장' },
    { date: '2025-11-12', company: '삼성전자', type: 'conf', title: '삼성 AI Forum 2025', detail: 'HBM4 로드맵, On-device AI 전략 발표' },
    { date: '2025-11-20', company: 'Intel', type: 'product', title: 'Intel Innovation 2025', detail: '18A 공정 양산 업데이트, Gaudi 4 예고 가능성' },
    { date: '2026-01-06', company: 'NVIDIA', type: 'conf', title: 'CES 2026 기조연설', detail: 'Jensen Huang CEO 기조연설, 신규 AI 플랫폼 발표 예상' },
    { date: '2026-01-20', company: 'TSMC', type: 'earnings', title: 'TSMC Q4 2025 실적', detail: '2nm 양산 현황, 2026년 설비투자 계획 공개' },
    { date: '2026-02-25', company: 'Anthropic', type: 'product', title: 'Claude 4 출시 예상', detail: '추론 능력 강화, 에이전트 워크플로우 최적화 버전' },
    { date: '2026-03-17', company: 'NVIDIA', type: 'conf', title: 'GTC 2026', detail: 'Rubin GPU 아키텍처, AI 에이전트 플랫폼 발표 예상' },
    { date: '2026-04-01', company: '삼성전자', type: 'dividend', title: '삼성전자 결산 배당', detail: '반도체 부문 실적 반등에 따른 배당 주목' },
    { date: '2026-05-15', company: 'OpenAI', type: 'product', title: 'GPT-5 출시 예상', detail: '추론·멀티모달 능력 대폭 향상 기대' }
];

// ── 상태 ─────────────────────────────────────────────────────────────────────
let selectedId = null;
let activeSector = '전체';
let activeEventType = '전체';
let searchQuery = '';

const SECTORS = ['전체', 'AI', 'AI·클라우드', '반도체'];
const EVENT_TYPES = ['전체', 'earnings', 'product', 'conf', 'agm', 'dividend'];
const EVENT_TYPE_LABELS = { '전체': '전체', earnings: '실적', product: '신제품', conf: '컨퍼런스', agm: '주총', dividend: '배당' };
const EVENT_TYPE_CSS   = { earnings: 'type-earnings', product: 'type-product', conf: 'type-conf', agm: 'type-agm', dividend: 'type-dividend' };

// ── KPI 렌더 ─────────────────────────────────────────────────────────────────
function renderKPI() {
    const listed = COMPANIES.filter(c => c.ticker !== '비상장');
    const totalMcap = listed.reduce((a, c) => a + c.marketCap, 0);
    const topRevenue = [...COMPANIES].sort((a, b) => b.revenue2024 - a.revenue2024)[0];
    const topGrowth  = COMPANIES.filter(c => c.revenueGrowth.startsWith('+')).sort((a, b) => {
        return parseFloat(b.revenueGrowth) - parseFloat(a.revenueGrowth);
    })[0];
    const upcomingCount = EVENTS.filter(e => new Date(e.date) >= new Date()).length;

    const row = document.getElementById('kpi-row');
    row.innerHTML = `
        ${kpiCard('기업 수', COMPANIES.length + '개', 'fas fa-building', 'text-blue-500', 'AI·반도체 주요 기업')}
        ${kpiCard('상장사 시총 합계', '$' + (totalMcap / 100).toFixed(1) + 'T', 'fas fa-chart-line', 'text-green-500', '조 달러 기준')}
        ${kpiCard('매출 1위', topRevenue.name, 'fas fa-trophy', 'text-yellow-500', '$' + topRevenue.revenue2024.toFixed(0) + 'B (FY2024)')}
        ${kpiCard('예정 이벤트', upcomingCount + '건', 'fas fa-calendar-alt', 'text-purple-500', '2025~2026 주요 일정')}
    `;
}

function kpiCard(label, value, icon, iconClass, sub) {
    return `
    <div class="bg-white rounded-xl shadow p-4 flex items-center gap-4">
        <div class="rounded-full bg-gray-100 p-3"><i class="${icon} ${iconClass} text-xl"></i></div>
        <div>
            <div class="text-xs text-gray-500">${label}</div>
            <div class="text-xl font-bold text-gray-800">${value}</div>
            <div class="text-xs text-gray-400">${sub}</div>
        </div>
    </div>`;
}

// ── 섹터 탭 렌더 ────────────────────────────────────────────────────────────
function renderSectorTabs() {
    const wrap = document.getElementById('sector-tabs');
    wrap.innerHTML = SECTORS.map(s => `
        <button class="sector-tab ${s === activeSector ? 'active' : ''}" data-sector="${s}">${s}</button>
    `).join('');
    wrap.querySelectorAll('.sector-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            activeSector = btn.dataset.sector;
            renderSectorTabs();
            renderGrid();
        });
    });
}

// ── 기업 카드 그리드 렌더 ────────────────────────────────────────────────────
function renderGrid() {
    const q = searchQuery.toLowerCase();
    const filtered = COMPANIES.filter(c => {
        const sectorOk = activeSector === '전체' || c.sector === activeSector;
        const searchOk = !q || c.name.toLowerCase().includes(q) || c.ticker.toLowerCase().includes(q);
        return sectorOk && searchOk;
    });

    const grid = document.getElementById('company-grid');
    grid.innerHTML = filtered.map(c => companyCard(c)).join('');
    grid.querySelectorAll('.company-card').forEach(card => {
        card.addEventListener('click', () => {
            selectedId = card.dataset.id;
            document.querySelectorAll('.company-card').forEach(x => x.classList.remove('selected'));
            card.classList.add('selected');
            renderDetail(selectedId);
        });
    });
}

function sectorBadge(sector) {
    const map = { 'AI': 'badge-ai', 'AI·클라우드': 'badge-cloud', '반도체': 'badge-semi' };
    return `<span class="badge-sector ${map[sector] || 'badge-ai'}">${sector}</span>`;
}

function companyCard(c) {
    const changeHtml = c.changeDir === 'up'
        ? `<span class="change-up text-xs font-semibold"><i class="fas fa-arrow-up"></i> ${c.stockChange}</span>`
        : `<span class="change-down text-xs font-semibold"><i class="fas fa-arrow-down"></i> ${c.stockChange}</span>`;
    return `
    <div class="company-card ${selectedId === c.id ? 'selected' : ''}" data-id="${c.id}">
        <div class="flex items-center gap-3 mb-2">
            <div class="company-logo" style="background:${c.logoColor}">${c.logo}</div>
            <div class="flex-1 min-w-0">
                <div class="font-semibold text-sm text-gray-800 truncate">${c.name}</div>
                <div class="text-xs text-gray-400">${c.ticker}</div>
            </div>
            ${c.ticker !== '비상장' ? changeHtml : '<span class="text-xs text-gray-400">비상장</span>'}
        </div>
        <div class="flex items-center gap-2 mb-2">
            ${sectorBadge(c.sector)}
            <span class="text-xs text-gray-500">CEO: ${c.ceo.split(' ')[0]}</span>
        </div>
        <div class="flex justify-between text-xs text-gray-600 mt-1">
            <span>매출 <b>$${c.revenue2024 >= 1000 ? (c.revenue2024/100).toFixed(1)+'T' : c.revenue2024+'B'}</b></span>
            <span class="${c.revenueGrowth.startsWith('-') ? 'change-down' : 'change-up'} font-semibold">${c.revenueGrowth}</span>
        </div>
        <div class="mt-2 text-xs text-gray-400 leading-snug line-clamp-2" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${c.summary}</div>
    </div>`;
}

// ── 상세 패널 렌더 ────────────────────────────────────────────────────────────
function renderDetail(id) {
    const c = COMPANIES.find(x => x.id === id);
    if (!c) return;
    const panel = document.getElementById('detail-panel');
    panel.classList.remove('hidden');

    const companyEvents = EVENTS.filter(e => e.company === c.name)
        .sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 4);

    const metricsHtml = Object.entries(c.keyMetrics).map(([k, v]) => `
        <div class="kpi-chip flex-1"><div class="text-gray-400" style="font-size:0.65rem;">${k}</div><div class="font-bold text-gray-700 text-sm">${v}</div></div>
    `).join('');

    const evHtml = companyEvents.length
        ? companyEvents.map(e => `
            <div class="flex gap-2 items-start py-1 border-b border-gray-100 last:border-0">
                <span class="event-date-badge" style="min-width:56px;">${e.date.slice(5)}</span>
                <div><span class="event-type-badge ${EVENT_TYPE_CSS[e.type]}">${EVENT_TYPE_LABELS[e.type]}</span>
                <div class="text-xs text-gray-600 mt-1">${e.title}</div></div>
            </div>`).join('')
        : '<div class="text-xs text-gray-400 py-2">등록된 일정 없음</div>';

    document.getElementById('detail-content').innerHTML = `
        <div class="flex items-center gap-3 mb-4">
            <div class="company-logo text-2xl" style="background:${c.logoColor};width:52px;height:52px;">${c.logo}</div>
            <div>
                <div class="font-bold text-lg text-gray-800">${c.name}</div>
                <div class="text-xs text-gray-400">${c.ticker} &nbsp;|&nbsp; 설립 ${c.founded}</div>
            </div>
        </div>
        <div class="text-xs text-gray-600 leading-relaxed mb-4">${c.summary}</div>
        <div class="mb-3">
            <div class="text-xs text-gray-500 mb-1">CEO / 대표</div>
            <div class="font-semibold text-sm">${c.ceo}</div>
            <div class="text-xs text-gray-400">${c.ceoTitle}</div>
        </div>
        <div class="mb-3">
            <div class="text-xs text-gray-500 mb-1">주요 제품·서비스</div>
            <div class="text-xs text-gray-700">${c.mainProducts}</div>
        </div>
        <div class="mb-4">
            <div class="flex justify-between text-xs text-gray-500 mb-1">
                <span>FY2024 매출</span>
                <span class="font-bold ${c.revenueGrowth.startsWith('-') ? 'change-down' : 'change-up'}">${c.revenueGrowth} YoY</span>
            </div>
            <div class="revenue-bar-wrap mb-1">
                <div class="revenue-bar" style="width:${Math.min(100, c.revenue2024 / 65)}%"></div>
            </div>
            <div class="text-sm font-bold text-gray-800">$${c.revenue2024 >= 1000 ? (c.revenue2024/100).toFixed(2)+'T' : c.revenue2024+'B'}</div>
        </div>
        <div class="grid grid-cols-2 gap-2 mb-4">${metricsHtml}</div>
        <div>
            <div class="text-xs font-semibold text-gray-600 mb-2">예정 이벤트</div>
            ${evHtml}
        </div>
    `;
}

// ── 이벤트 필터 탭 렌더 ──────────────────────────────────────────────────────
function renderEventFilterTabs() {
    const row = document.getElementById('event-filter-row');
    row.innerHTML = EVENT_TYPES.map(t => `
        <button class="sector-tab ${t === activeEventType ? 'active' : ''}" style="font-size:0.68rem;padding:2px 10px;" data-etype="${t}">${EVENT_TYPE_LABELS[t]}</button>
    `).join('');
    row.querySelectorAll('[data-etype]').forEach(btn => {
        btn.addEventListener('click', () => {
            activeEventType = btn.dataset.etype;
            renderEventFilterTabs();
            renderEvents();
        });
    });
}

// ── 이벤트 리스트 렌더 ───────────────────────────────────────────────────────
function renderEvents() {
    const now = new Date();
    const filtered = EVENTS
        .filter(e => activeEventType === '전체' || e.type === activeEventType)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    const list = document.getElementById('event-list');
    list.innerHTML = filtered.map(e => {
        const isPast = new Date(e.date) < now;
        return `
        <div class="event-row ${isPast ? 'opacity-50' : ''}">
            <div class="event-date-badge">
                <div>${e.date.slice(5, 7)}월</div>
                <div style="font-size:1rem;">${e.date.slice(8, 10)}</div>
                <div style="font-size:0.6rem;color:#5a85bb">${e.date.slice(0, 4)}</div>
            </div>
            <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                    <span class="event-type-badge ${EVENT_TYPE_CSS[e.type]}">${EVENT_TYPE_LABELS[e.type]}</span>
                    <span class="text-xs font-semibold text-gray-700">${e.company}</span>
                    ${isPast ? '<span class="text-xs text-gray-400">(완료)</span>' : ''}
                </div>
                <div class="text-sm font-medium text-gray-800">${e.title}</div>
                <div class="text-xs text-gray-500 mt-0.5">${e.detail}</div>
            </div>
        </div>`;
    }).join('');
}

// ── 차트 렌더 ────────────────────────────────────────────────────────────────
function renderCharts() {
    // 매출 비교 막대 차트 (상위 10개)
    const top10 = [...COMPANIES]
        .sort((a, b) => b.revenue2024 - a.revenue2024)
        .slice(0, 10);

    const barColors = top10.map(c => ({
        'AI': 'rgba(0,88,163,0.75)',
        'AI·클라우드': 'rgba(107,70,193,0.75)',
        '반도체': 'rgba(16,185,129,0.75)'
    }[c.sector] || 'rgba(0,88,163,0.75)'));

    new Chart(document.getElementById('revenue-chart'), {
        type: 'bar',
        data: {
            labels: top10.map(c => c.name.length > 10 ? c.name.slice(0, 10) + '…' : c.name),
            datasets: [{
                label: '매출 ($B)',
                data: top10.map(c => c.revenue2024),
                backgroundColor: barColors,
                borderRadius: 6,
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: { legend: { display: false }, tooltip: {
                callbacks: { label: ctx => ` $${ctx.raw >= 1000 ? (ctx.raw/100).toFixed(2)+'T' : ctx.raw+'B'}` }
            }},
            scales: { x: { ticks: { font: { size: 10 } } }, y: { ticks: { font: { size: 10 } } } }
        }
    });

    // 시가총액 파이 차트 (상장사만, 상위 7개)
    const listed = COMPANIES.filter(c => c.ticker !== '비상장')
        .sort((a, b) => b.marketCap - a.marketCap).slice(0, 7);
    const pieColors = ['#0058a3','#63b3ed','#10b981','#f59e0b','#6b46c1','#e53e3e','#ed8936'];

    new Chart(document.getElementById('market-chart'), {
        type: 'doughnut',
        data: {
            labels: listed.map(c => c.name),
            datasets: [{
                data: listed.map(c => c.marketCap),
                backgroundColor: pieColors,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'right', labels: { font: { size: 10 }, boxWidth: 12 } },
                tooltip: { callbacks: { label: ctx => ` $${(ctx.raw / 100).toFixed(1)}T` } }
            }
        }
    });
}

// ── 검색 이벤트 ──────────────────────────────────────────────────────────────
document.getElementById('company-search').addEventListener('input', e => {
    searchQuery = e.target.value;
    renderGrid();
});

// ── 초기화 ───────────────────────────────────────────────────────────────────
renderKPI();
renderSectorTabs();
renderGrid();
renderEventFilterTabs();
renderEvents();
renderCharts();
