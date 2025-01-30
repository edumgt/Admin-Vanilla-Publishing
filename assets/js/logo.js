const currentPage = window.location.pathname.split("/").pop();

const lang = localStorage.getItem('lang') || 'ko';
localStorage.setItem('lang', lang);

/* Tool Tip */
function createTooltip(element, text) {
    const tooltip = document.createElement("div");
    tooltip.textContent = text;
    tooltip.style.position = "absolute";
    tooltip.style.backgroundColor = "#333";
    tooltip.style.color = "#fff";
    tooltip.style.padding = "5px 10px";
    tooltip.style.borderRadius = "5px";
    tooltip.style.fontSize = "12px";
    tooltip.style.visibility = "hidden";
    tooltip.style.opacity = "0";
    tooltip.style.transition = "opacity 0.2s ease-in-out";
    tooltip.style.whiteSpace = "nowrap";
    tooltip.style.zIndex = "1000";

    document.body.appendChild(tooltip);

    element.addEventListener("mouseenter", function (event) {
        tooltip.style.left = `${event.clientX - 160}px`;
        tooltip.style.top = `${event.clientY - 40}px`;
        tooltip.style.visibility = "visible";
        tooltip.style.opacity = "1";
    });

    element.addEventListener("mousemove", function (event) {
        tooltip.style.left = `${event.clientX - 160}px`;
        tooltip.style.top = `${event.clientY - 40}px`;
    });

    element.addEventListener("mouseleave", function () {
        tooltip.style.visibility = "hidden";
        tooltip.style.opacity = "0";
    });
}

function saveModal() {
    const modalForm = document.getElementById('modalForm');
    const formData = new FormData(modalForm);
    const updatedData = {};
    for (const [key, value] of formData.entries()) {
        updatedData[key] = value;
    }

    if (currentRowKey !== null) {
        grid.setValue(currentRowKey, 'tpCd', updatedData.tpCd);
        grid.setValue(currentRowKey, 'tpNm', updatedData.tpNm);
        grid.setValue(currentRowKey, 'descCntn', updatedData.descCntn);
        grid.setValue(currentRowKey, 'useYn', updatedData.useYn);
    }
    document.getElementById('modal').classList.add('hidden');
    saveData(grid.getData());
    showToast('well-done', 'success', 'en');
}


function renderOffCanvasMenu(menuItems) {
    const offCanvas = document.createElement('div');
    offCanvas.id = 'offCanvas';
    offCanvas.className = 'fixed top-14 h-full bg-gray-100 border-r z-50';

    const flexContainer = document.createElement('div');
    flexContainer.className = 'flex flex-col h-full';

    const ul = document.createElement('ul');
    ul.className = 'flex-grow p-4 space-y-4';

    menuItems.forEach(item => {
        const li = document.createElement('li');

        const a = document.createElement('a');
        a.href = item.href;
        a.className = 'menu-item block text-gray-800 hover:text-blue-500 text-center';

        const icon = document.createElement('i');
        icon.className = `fas ${item.icon} menu-icon text-blue-400`;

        const span = document.createElement('span');
        span.className = 'menu-text';
        span.textContent = item.text;

        a.appendChild(icon);
        a.appendChild(span);
        li.appendChild(a);
        ul.appendChild(li);
    });

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'flex flex-col space-y-4 pb-4';

    const expandButton = document.createElement('button');
    expandButton.id = 'expandOffCanvas';
    expandButton.className = 'text-gray-800 hover:text-blue-500 text-xl';
    expandButton.innerHTML = '<i class="fas fa-chevron-right"></i>';

    const collapseButton = document.createElement('button');
    collapseButton.id = 'collapseOffCanvas';
    collapseButton.className = 'text-gray-800 hover:text-blue-500 text-xl';
    collapseButton.innerHTML = '<i class="fas fa-chevron-left"></i>';

    buttonsContainer.appendChild(expandButton);
    buttonsContainer.appendChild(collapseButton);

    flexContainer.appendChild(ul);
    flexContainer.appendChild(buttonsContainer);
    offCanvas.appendChild(flexContainer);

    document.getElementById('offCanvasContainer').appendChild(offCanvas);
}

// Determine the current HTML file name
const currentFileName = window.location.pathname.split('/').pop();

// Define a mapping of text to icon classes
const iconMapping = {

    "시스템로그": "fa-clipboard-list",
    "컨설팅지정": "fa-network-wired",
    "코드관리": "fa-server",
    "VM현황": "fa-server",
    "DB관리": "fa-database",
    "행정구역정보": "fa-map-marked-alt",
    "방화벽": "fa-shield-alt",
    "조직도구성": "fa-sitemap",
    "근태관리": "fa-user-clock",
    "인센티브": "fa-gift",
    "회의일정": "fa-calendar-check",
    "이벤트": "fa-calendar-day",
    "업무일정": "fa-calendar-alt",
    "프로젝트일정": "fa-tasks",
    "생산일정": "fa-industry",
    "예약관리": "fa-calendar-plus",
    "회의실관리": "fa-door-open",
    "병원예약": "fa-hospital",
    "강의일정": "fa-chalkboard-teacher",
    "회원통계": "fa-user",
    "매출통계": "fa-chart-line",
    "체인운영": "fa-store-alt",
    "판매통계": "fa-chart-pie",
    "실적": "fa-chart-bar",
    "입출고관리": "fa-warehouse",
    "권한관리": "fa-user-shield",
    "문서관리": "fa-file-alt",
    "WMS": "fa-cubes",
    "서베이": "fa-poll",


};


const menuConfigurations = {
    'attend.html': [
        { href: 'orgni.html', text: '조직도구성' },
        { href: 'attend.html', text: '근태관리' },
        { href: 'total.html', text: '인센티브' },

    ],

    'calendar.html': [
        { href: 'calendar.html', text: '업무일정' },
        { href: 'trello.html', text: '프로젝트일정' },
        { href: 'timeline.html', text: '생산일정' },

    ],

    'chain.html': [
        { href: 'stati.html', text: '회원통계' },
        { href: 'flow.html', text: '매출통계' },
        { href: 'chain.html', text: '체인운영' },

    ],

    'city.html': [
        { href: 'work.html', text: '예약관리' },
        { href: 'meeting.html', text: '회의실관리' },
        { href: 'hospital.html', text: '병원예약' },
        { href: 'lectures.html', text: '강의일정' },
        { href: 'city.html', text: '행정구역정보' }
    ],

    'config.html': [
        { href: 'config.html', text: '시스템로그' },
        { href: 'network.html', text: '컨설팅지정' },
        { href: 'survey.html', text: '서베이' }
    ],

    'document.html': [
        { href: 'system.html', text: '코드관리' },
        { href: 'orgtree.html', text: '권한관리' },
        { href: 'document.html', text: '문서관리' },
        { href: 'wms.html', text: 'WMS' }
    ],

    'flow.html': [
        { href: 'stati.html', text: '회원통계' },
        { href: 'flow.html', text: '매출통계' },
        { href: 'chain.html', text: '체인운영' },

    ],

    'hospital.html': [
        { href: 'work.html', text: '예약관리' },
        { href: 'meeting.html', text: '회의실관리' },
        { href: 'hospital.html', text: '병원예약' },
        { href: 'lectures.html', text: '강의일정' },
        { href: 'city.html', text: '행정구역정보' }
    ],

    'lectures.html': [
        { href: 'work.html', text: '예약관리' },
        { href: 'meeting.html', text: '회의실관리' },
        { href: 'hospital.html', text: '병원예약' },
        { href: 'lectures.html', text: '강의일정' },
        { href: 'city.html', text: '행정구역정보' }
    ],

    'meeting.html': [
        { href: 'work.html', text: '예약관리' },
        { href: 'meeting.html', text: '회의실관리' },
        { href: 'hospital.html', text: '병원예약' },
        { href: 'lectures.html', text: '강의일정' },
        { href: 'city.html', text: '행정구역정보' }
    ],


    'network.html': [
        { href: 'config.html', text: '시스템로그' },
        { href: 'network.html', text: '컨설팅지정' },
        { href: 'survey.html', text: '서베이' }
    ],

    'orgni.html': [
        { href: 'orgni.html', text: '조직도구성' },
        { href: 'attend.html', text: '근태관리' },
        { href: 'total.html', text: '인센티브' },

    ],

    'orgtree.html': [
        { href: 'system.html', text: '코드관리' },
        { href: 'orgtree.html', text: '권한관리' },
        { href: 'document.html', text: '문서관리' },
        { href: 'wms.html', text: 'WMS' }
    ],


    'stati.html': [
        { href: 'stati.html', text: '회원통계' },
        { href: 'flow.html', text: '매출통계' },
        { href: 'chain.html', text: '체인운영' },

    ],

    'survey.html': [
        { href: 'config.html', text: '시스템로그' },
        { href: 'network.html', text: '컨설팅지정' },
        { href: 'survey.html', text: '서베이' }
    ],

    'system.html': [
        { href: 'system.html', text: '코드관리' },
        { href: 'orgtree.html', text: '권한관리' },
        { href: 'document.html', text: '문서관리' },
        { href: 'wms.html', text: 'WMS' }
    ],

    'timeline.html': [
        { href: 'calendar.html', text: '업무일정' },
        { href: 'trello.html', text: '프로젝트일정' },
        { href: 'timeline.html', text: '생산일정' },

    ],

    'total.html': [
        { href: 'orgni.html', text: '조직도구성' },
        { href: 'attend.html', text: '근태관리' },
        { href: 'total.html', text: '인센티브' },

    ],

    'trello.html': [
        { href: 'calendar.html', text: '업무일정' },
        { href: 'trello.html', text: '프로젝트일정' },
        { href: 'timeline.html', text: '생산일정' },

    ],

    'wms.html': [
        { href: 'system.html', text: '코드관리' },
        { href: 'orgtree.html', text: '권한관리' },
        { href: 'document.html', text: '문서관리' },
        { href: 'wms.html', text: 'WMS' }
    ],

    'work.html': [
        { href: 'work.html', text: '예약관리' },
        { href: 'meeting.html', text: '회의실관리' },
        { href: 'hospital.html', text: '병원예약' },
        { href: 'lectures.html', text: '강의일정' },
        { href: 'city.html', text: '행정구역정보' }
    ],



};

const defaultMenuItems = [];

const menuItems = (menuConfigurations[currentFileName] || defaultMenuItems).map(item => ({
    ...item,
    icon: iconMapping[item.text]
}));


renderOffCanvasMenu(menuItems);

/* Dynamically create modals */
function createModal(modalId, title, content, buttons) {
    //console.log("createModal: " + modalId);

    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'hidden fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50';

    const modalContent = `
        <div class="bg-white rounded-lg shadow-sm p-6 w-1/3 relative">
            <button class="close" onclick="document.getElementById('${modalId}').classList.add('hidden');">&times;</button>
            <h4 class="text-md mb-4">${title}</h4>
            ${content}
            <div class="flex justify-end space-x-2 mt-4">
                ${buttons.map(btn => `<button id="saveModal" class="${btn.class}" onclick="${btn.onClick}">${btn.label}</button>`).join('')}
            </div>
        </div>`;

    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
}

// Create specific modals
createModal(
    'modal',
    '상세정보',
    '<form id="modalForm" class="space-y-4"></form>',
    [
        { label: '저장', class: 'bg-blue-500 text-white ', onClick: 'saveModal()' },
        { label: '닫기', class: 'bg-gray-500 text-white ', onClick: "document.getElementById('modal').classList.add('hidden');" }
    ]
);

createModal(
    'logoutModal',
    '로그아웃 하시겠습니까?',
    '',
    [
        { label: '로그아웃', class: 'bg-blue-500 text-white ', onClick: "window.location.href='index.html';" },
        { label: '닫기', class: 'bg-gray-500 text-white ', onClick: "document.getElementById('logoutModal').classList.add('hidden');" }
    ]
);

// createModal(
//     'demoModal',
//     '알림',
//     '<p>데모버젼에서는 지원하지 않습니다.</p>',
//     [
//         { label: '닫기', class: 'bg-gray-800 text-white px-3 py-1 rounded ', onClick: "document.getElementById('demoModal').classList.add('hidden');" }
//     ]
// );

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function renderFloatingNav(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id "${containerId}" not found.`);
        return;
    }

    const floatingNav = document.createElement('div');
    floatingNav.id = 'floatingNav';
    floatingNav.className = 'fixed bottom-4 right-4 bg-gray-700 text-white rounded-lg p-2 hidden space-y-4 z-50';
    floatingNav.innerHTML = `
        <div class="flex justify-between items-center">
            <h3 class="text-white">Language</h3>
            <button id="closeFloatingNav" class="text-white">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div id="languageSwitcher" class="flex space-x-2">
            <img src="assets/img/usa.svg" alt="English" data-lang="en" class="w-8 h-8 cursor-pointer">
            <img src="assets/img/kor.svg" alt="한국어" data-lang="ko" class="w-8 h-8 cursor-pointer">
            <img src="assets/img/jpn.svg" alt="日本語" data-lang="ja" class="w-6 h-6 cursor-pointer">
        </div>
    `;

    container.appendChild(floatingNav);

    const closeButton = floatingNav.querySelector('#closeFloatingNav');
    closeButton.addEventListener('click', () => {
        floatingNav.classList.add('hidden');
    });

    const languageSwitcher = floatingNav.querySelector('#languageSwitcher');
    languageSwitcher.addEventListener('click', (event) => {
        if (event.target.tagName === 'IMG') {
            const selectedLang = event.target.getAttribute('data-lang');
            //console.log(`Selected language: ${selectedLang}`);
        }
    });
}

renderFloatingNav('appContainer');


const tabsData = [
    { href: "system.html", icon: "fas fa-cogs", label: "시스템관리" },
    { href: "orgni.html", icon: "fas fa-users", label: "조직관리" },
    { href: "work.html", icon: "fas fa-briefcase", label: "업무관리" },
    { href: "calendar.html", icon: "fas fa-calendar-alt", label: "일정관리" },
    { href: "stati.html", icon: "fas fa-chart-bar", label: "통계" },
    { href: "config.html", icon: "fas fa-tools", label: "설정관리" },
];

function renderTabs(containerId) {
    const container = document.getElementById(containerId);

    // if (!container) {
    //     console.error(`Container with ID \"${containerId}\" not found.`);
    //     return;
    // }

    const tabsDiv = document.createElement("div");
    tabsDiv.className = "px-8 tabs flex";

    tabsData.forEach(tab => {
        const li = document.createElement("li");

        const anchor = document.createElement("a");
        anchor.href = tab.href;
        anchor.className = "gnb-item tab-link flex ";

        const icon = document.createElement("i");
        icon.className = tab.icon;

        const span = document.createElement("span");
        span.textContent = tab.label;

        anchor.appendChild(icon);
        anchor.appendChild(span);
        li.appendChild(anchor);
        tabsDiv.appendChild(li);
    });

    container.appendChild(tabsDiv);
}

renderTabs("tabs-container");

class AppBrand {
    constructor(containerId, brandName, logoHref = "#") {
        this.container = document.getElementById(containerId);
        this.brandName = brandName;
        this.logoHref = logoHref;
        this.render();
    }

    render() {
        this.container.innerHTML = `
                <a href="${this.logoHref}">
                    <span class="logo-text">${this.brandName}</span>
                </a>`;
    }
}

/* gearIcon */
const button = document.createElement('div');
createTooltip(button, "현재 페이지를 로그인 후 바로가기로 저장합니다.");

button.id = 'gearIcon';
button.className = 'fixed bottom-4 right-4 bg-black text-white rounded-3xl p-2 z-50';
const icon = document.createElement('i');
icon.className = 'fas fa-globe';
button.appendChild(icon);
document.getElementById('buttonContainer').appendChild(button);
document.getElementById('gearIcon').addEventListener('click', () => {
    const floatingNav = document.getElementById('floatingNav');
    floatingNav.classList.remove('hidden');
});


/* floaingNav */
document.getElementById('closeFloatingNav').addEventListener('click', () => {
    const floatingNav = document.getElementById('floatingNav');
    floatingNav.classList.add('hidden');
});

/* LNB Left Menu */
const offCanvas = document.getElementById('offCanvas');
offCanvas.classList.remove('hidden', '-translate-x-full');
offCanvas.classList.add('collapsed');
offCanvas.classList.remove('expanded');

const expandOffCanvas = document.getElementById('expandOffCanvas');
const collapseOffCanvas = document.getElementById('collapseOffCanvas');
expandOffCanvas.addEventListener('click', function () {
    offCanvas.classList.remove('collapsed');
    offCanvas.classList.add('expanded');
    expandOffCanvas.classList.add('hidden');
});
collapseOffCanvas.addEventListener('click', function () {
    offCanvas.classList.add('collapsed');
    offCanvas.classList.remove('expanded');
    collapseOffCanvas.classList.add('hidden');
});

function loadMessages() {
    fetch('assets/mock/messages.json')
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('messages', JSON.stringify(data));
        })
        .catch(error => console.error('Error loading data:', error));
}

function getMsg(key, lang = 'en') {
    const messages = JSON.parse(localStorage.getItem('messages'));
    return messages[lang][key] || key;
}


loadMessages();

function showToast(messageKey, type = 'success', lang = 'en') {
    const message = getMsg(messageKey, lang);
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} show`;
    toast.innerText = message;

    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

const languageSwitcher = document.getElementById("languageSwitcher");
const breadcrumb = document.querySelector(".breadcrumb");
const buttons = document.querySelectorAll("#content button span");
const tabs = document.querySelectorAll(".tabs li a span");
const offCanvasItems = document.querySelectorAll("#offCanvas .menu-item span");

const menuLinks = document.querySelectorAll(".gnb-item");
const menuLinks2 = document.querySelectorAll(".menu-item");
