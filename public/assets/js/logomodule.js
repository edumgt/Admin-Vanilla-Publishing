export const currentPage = window.location.pathname.split("/").pop();
window.currentPage = currentPage;

export const lang = localStorage.getItem('lang') || 'ko';
window.lang = lang;

localStorage.setItem('lang', lang);

/* Tool Tip */
export function createTooltip(element, text) {
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
window.createTooltip = createTooltip;

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
        a.className = 'menu-item block text-gray-800 hover:text-blue-500 text-center p-2 rounded-md';

        const icon = document.createElement('i');
        icon.className = `fas ${item.icon} menu-icon text-blue-400`;

        const span = document.createElement('span');
        span.className = 'menu-text';
        span.textContent = item.text;

        // 현재 페이지와 메뉴의 href가 같으면 active 스타일 추가
        if (item.href === currentPage) {
            icon.classList.remove('text-blue-400');
            icon.classList.add('text-gray-800');
        }

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

const iconMapping = {

    "조직도구성": "fa-sitemap",
    "근태관리": "fa-user-clock",
    "인센티브": "fa-gift",
    "업무일정": "fa-calendar-alt",
    "프로젝트일정": "fa-tasks",

    "생산일정": "fa-industry",
    "회원통계": "fa-user",
    "매출통계": "fa-chart-line",
    "체인운영": "fa-store-alt",
    "예약관리": "fa-calendar-plus",

    "회의실관리": "fa-door-open",
    "병원예약": "fa-hospital",
    "강의일정": "fa-chalkboard-teacher",
    "행정구역정보": "fa-map-marked-alt",
    "시스템로그": "fa-clipboard-list",

    "컨설팅지정": "fa-network-wired",
    "서베이": "fa-poll",
    "코드관리": "fa-server",
    "권한관리": "fa-user-shield",
    "문서관리": "fa-file-alt",

    "WMS": "fa-cubes",
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
const menuItems = (menuConfigurations[currentPage] || defaultMenuItems).map(item => ({
    ...item,
    icon: iconMapping[item.text]
}));

renderOffCanvasMenu(menuItems);

/* Dynamically create modals */
export function createModal(modalId, title, content, buttons) {
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

window.createModal = createModal;

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

export function createModal2(modalId, title, content, buttons) {
    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'hidden fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50';
    const modalContent = `
        <div class="modal-content bg-white rounded-lg shadow-sm p-6 w-1/3 relative">
            <h4 class="text-md mb-4">${title}</h4>
            ${content}
            <div class="flex justify-end space-x-2 mt-4">
                ${buttons.map(btn => `<button id="saveModal" class="${btn.class}" onclick="${btn.onClick}">${btn.label}</button>`).join('')}
            </div>
        </div>`;
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
}
window.createModal2 = createModal2;

export function createModal3(modalId, title, content, buttons) {
    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'hidden fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50';
    const modalContent = `${content}`;
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
}
window.createModal3 = createModal3;


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
            <h3 class="text-white">다국어지정</h3>
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

const appBrand = new AppBrand('logo', 'EDUMGT');

/* gearIcon */
const button = document.createElement('div');
createTooltip(button, "다국어를 지정 합니다.");

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

export function showToast(messageKey, type = 'success', lang = 'en') {
    const message = getMsg(messageKey, lang);
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} show`;
    toast.innerText = message;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}
window.showToast = showToast;

const languageSwitcher = document.getElementById("languageSwitcher");

export const breadcrumb = document.querySelector(".breadcrumb");
window.breadcrumb = breadcrumb;

const buttons = document.querySelectorAll("#content button span");

export const tabs = document.querySelectorAll(".tabs li a span");
window.tabs = tabs;

export const offCanvasItems = document.querySelectorAll("#offCanvas .menu-item span");
window.offCanvasItems = offCanvasItems;

const menuLinks = document.querySelectorAll(".gnb-item");
const menuLinks2 = document.querySelectorAll(".menu-item");

const orgniPages = ["orgni.html", "attend.html", "total.html"];
if (orgniPages.includes(currentPage)) {
    menuLinks2.forEach((link) => {
        if (link.getAttribute("href") === currentPage) {
            menuLinks.forEach((menuLink) => {
                if (menuLink.getAttribute("href") === "orgni.html") {
                    menuLink.classList.add("active");
                } else {
                    menuLink.classList.remove("active");
                }
            });
        }
    });
}

const systemPages = ["system.html", "orgtree.html", "document.html", "wms.html"];
if (systemPages.includes(currentPage)) {
    menuLinks2.forEach((link) => {
        if (link.getAttribute("href") === currentPage) {
            menuLinks.forEach((menuLink) => {
                if (menuLink.getAttribute("href") === "system.html") {
                    menuLink.classList.add("active");
                } else {
                    menuLink.classList.remove("active");
                }
            });
        }
    });
}

const workPages = ["work.html", "hospital.html", "meeting.html", "lectures.html", "city.html"];
if (workPages.includes(currentPage)) {
    menuLinks2.forEach((link) => {
        if (link.getAttribute("href") === currentPage) {
            menuLinks.forEach((menuLink) => {
                if (menuLink.getAttribute("href") === "work.html") {
                    menuLink.classList.add("active");
                } else {
                    menuLink.classList.remove("active");
                }
            });
        }
    });
}

const calendarPages = ["calendar.html", "trello.html", "timeline.html"];
if (calendarPages.includes(currentPage)) {
    menuLinks2.forEach((link) => {
        if (link.getAttribute("href") === currentPage) {
            menuLinks.forEach((menuLink) => {
                if (menuLink.getAttribute("href") === "calendar.html") {
                    menuLink.classList.add("active");
                } else {
                    menuLink.classList.remove("active");
                }
            });
        }
    });
}

const statiPages = ["stati.html", "flow.html", "chain.html"];
if (statiPages.includes(currentPage)) {
    menuLinks2.forEach((link) => {
        if (link.getAttribute("href") === currentPage) {
            menuLinks.forEach((menuLink) => {
                if (menuLink.getAttribute("href") === "stati.html") {
                    menuLink.classList.add("active");
                } else {
                    menuLink.classList.remove("active");
                }
            });
        }
    });
}

const configPages = ["config.html", "network.html", "survey.html"];
if (configPages.includes(currentPage)) {
    menuLinks2.forEach((link) => {
        if (link.getAttribute("href") === currentPage) {
            menuLinks.forEach((menuLink) => {
                if (menuLink.getAttribute("href") === "config.html") {
                    menuLink.classList.add("active");
                } else {
                    menuLink.classList.remove("active");
                }
            });
        }
    });
}

export function generateNanoId(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < length; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}
window.generateNanoId = generateNanoId;

/* dropdown.js */
const memberIcon = document.getElementById('memberIcon');
const memberMenu = document.getElementById('memberMenu');
memberMenu.classList.add("hidden");

const logoutModal = document.getElementById('logoutModal');

memberIcon.classList.add("text-gray-200", "hover:text-white", "p-2");
memberIcon.innerHTML = `<i class="fas fa-user"></i>`;

memberMenu.innerHTML = `<div class="bg-white shadow-lg p-3 rounded-md border">
                     <a class="dropdown-item" href="#">
                        <div class="d-flex">
                           <div class="me-3">
                              <div class="avatar avatar-online">
                                 <img class="rounded-circle bg-primary-subtle" src="sample/sample.svg"
                                    alt="Avatar" width="40px">
                              </div>
                           </div>
                           <div class="">
                              <h6 class="fs-4 mb-0">송주희</h6>
                              <small class="text-muted">관리자</small>
                           </div>
                        </div>
                     </a>
                     <div class="dropdown-divider"></div>
                     <a href="#" class="dropdown-item">
                        <div class="d-flex align-items-center gap-3">
                           <i class="fas fa-user fs-5"></i>
                           <span>Profile</span>
                        </div>
                     </a>
                     <a href="#" class="dropdown-item">
                        <div class="d-flex align-items-center gap-3">
                           <i class="fas fa-cog fs-5"></i>
                           <span>Settings</span>
                        </div>
                     </a>
                     <div class="dropdown-divider"></div>
                     <a href="#" class="dropdown-item" id="logoutButton">
                        <div class="d-flex align-items-center gap-3">
                           <i class="fas fa-sign-out-alt fs-5"></i>
                           <span>로그아웃</span>
                        </div>
                     </a>
                     <div class="dropdown-divider"></div>
                </div>`;

memberIcon.addEventListener('click', function (event) {
    event.stopPropagation(); 

    memberMenu.style.position = `absolute`;
    memberMenu.style.top = `45px`;
    memberMenu.style.right = `20px`;

    memberMenu.classList.remove('hidden');
    memberMenu.classList.add('show');


});

document.addEventListener('click', function (event) {
    if (!memberIcon.contains(event.target) && !memberMenu.contains(event.target)) {
        memberMenu.classList.remove('show');
        memberMenu.classList.add('hidden');
    }
});

// 로그아웃 버튼 클릭 시 모달 표시
const logoutButton = document.getElementById('logoutButton');
logoutButton.addEventListener('click', function () {
    logoutModal.classList.remove('hidden');
    logoutModal.classList.add('show');
});


function getFavorites() {
    let firstFavorite = JSON.parse(localStorage.getItem('favorite-1st')) || null;
    let quickFavorites = JSON.parse(localStorage.getItem('favorite-Quick')) || [];

    let favoriteHTML = '';

    if (firstFavorite) {
        favoriteHTML += `
            <a href="${firstFavorite.url}" class="dropdown-item dropdown-shortcuts-item col">
                <h5>${firstFavorite.title}</h5>
                <small>처음화면</small>
            </a>
        `;
    }

    quickFavorites.forEach(fav => {
        favoriteHTML += `
            <a href="${fav.url}" class="dropdown-item dropdown-shortcuts-item col">
                <h6>${fav.title}</h6>
                <small>바로가기</small>
            </a>
        `;
    });

    return favoriteHTML;
}

function renderDropdown(containerId) {
    const container = document.getElementById(containerId);
    const dropdownHTML = `
        <div class="dropdown">
            <div class="dropdown-toggle">
                <i class="fas fa-bars"></i>
            </div>
            <div id="dropdown-menu-shortcuts" class="dropdown-menu dropdown-menu-end">
                    <div>
                        ${getFavorites()}
                    </div>
            </div>
        </div>
    `;

    container.innerHTML = dropdownHTML;

    const dropdownToggle = container.querySelector('.dropdown-toggle');
    const dropdownMenu = container.querySelector('.dropdown-menu');

    dropdownToggle.addEventListener('click', () => {
        dropdownMenu.classList.toggle('show');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderDropdown('dropdown-container');
});

const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

dropdownToggles.forEach((dropdownToggle) =>
    dropdownToggle.addEventListener('click', (event) => {
        const dropdown = dropdownToggle.closest('.dropdown');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        hideAllDropdowns(event);
        dropdownMenu.classList.toggle('show');
        event.stopPropagation();
    })
);


function hideAllDropdowns(event) {
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');

    dropdownMenus.forEach((dropdownMenu) => {
        if (dropdownMenu.classList.contains('show')) {
            const dropdown = dropdownMenu.closest('.dropdown');
            const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
            if (event.currentTarget !== dropdownToggle) {
                dropdownMenu.classList.remove('show');
            }
        }
    });
}

export function saveFavorite(key) {
    const title = document.querySelector('.breadcrumb')?.innerText || 'No Title';
    const fullPath = window.location.pathname;
    const fileName = fullPath.substring(fullPath.lastIndexOf('/') + 1) || 'index.html';

    let favoriteData = { title, url: fileName };

    if (key === '1st') {
        localStorage.setItem('favorite-1st', JSON.stringify(favoriteData));
        showToast('favo-login', 'success', lang);
    } else if (key === 'Quick') {
        let quickFavorites = JSON.parse(localStorage.getItem('favorite-Quick')) || [];

        const isDuplicate = quickFavorites.some(item => item.url === fileName);
        if (isDuplicate) {
            showToast('favo-already', 'warning', lang);
            return;
        }

        if (quickFavorites.length >= 8) {
            quickFavorites.shift();
        }
        quickFavorites.push(favoriteData);
        localStorage.setItem('favorite-Quick', JSON.stringify(quickFavorites));

        showToast('favo-save', 'success', lang);
    }
    renderDropdown('dropdown-container');
}
window.saveFavorite = saveFavorite;

function addBreadcrumbBadges() {
    const breadcrumbContainer = document.querySelector('.breadcrumb');
    const favoriteContainer = document.createElement('div');
    favoriteContainer.id = 'favorite';
    favoriteContainer.style.display = 'flex';
    favoriteContainer.style.alignItems = 'center';
    favoriteContainer.style.position = 'absolute';
    favoriteContainer.style.top = '70px';
    favoriteContainer.style.right = '30px';

    favoriteContainer.innerHTML += `
        <span id="fav1" class="favo-1" onclick="saveFavorite('1st', window.location.href)">1</span>
        <span id="fav2" class="favo-2" onclick="saveFavorite('Quick', window.location.href)">Q</span>
    `;

    breadcrumbContainer.parentNode.insertBefore(favoriteContainer, breadcrumbContainer.nextSibling);
}
addBreadcrumbBadges();

const fav1 = document.getElementById("fav1");
createTooltip(fav1, "현재 페이지를 로그인 후 바로가기로 저장합니다.");
const fav2 = document.getElementById("fav2");
createTooltip(fav2, "현재 페이지를 바로가기 목록에 저장합니다.");
