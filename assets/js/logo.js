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
    showToast('해당 건의 데이타를 저장하였습니다.', 'success');
}


function renderOffCanvasMenu(menuItems) {
    const offCanvas = document.createElement('div');
    offCanvas.id = 'offCanvas';
    offCanvas.className = 'fixed top-14 h-full bg-gray-100 z-50 border-r';

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
    '시스템로그': 'fa-clipboard-list',
    '컨설팅지정': 'fa-network-wired',
    '코드관리': 'fa-server',
    'VM현황': 'fa-server',
    'DB관리': 'fa-database',
    '방화벽': 'fa-shield-alt',
    '조직도구성': 'fa-sitemap',
    '근태관리': 'fa-user-clock',
    
    '회의일정': 'fa-calendar-alt', // Changed to calendar-alt for scheduling
    '이벤트': 'fa-calendar-alt', // Changed to calendar-alt for events
    '업무일정': 'fa-calendar-alt',
    '프로젝트일정': 'fa-tasks',
    '생산일정': 'fa-tasks',
    '예약관리': 'fa-calendar-alt',
    '회의실관리': 'fa-door-open', // Changed to door-open for room management
    '병원예약': 'fa-hospital', // Changed to hospital for hospital reservations
    '강의일정': 'fa-chalkboard-teacher', // Changed to chalkboard-teacher for lectures
    '회원통계': 'fa-chart-bar', // Changed to chart-bar for statistics
    '매출통계': 'fa-chart-line', // Changed to chart-line for sales
    '체인운영': 'fa-store', // Changed to store for chain operations
    '판매통계': 'fa-chart-pie', // Changed to chart-pie for sales statistics
    '실적': 'fa-chart-area', // Changed to chart-area for performance
    '입출고관리': 'fa-warehouse', // Changed to warehouse for inventory management
    '권한관리': 'fa-user-shield', // Changed to user-shield for permissions
    '문서관리': 'fa-file-alt', // Changed to file-alt for document management
    'WMS': 'fa-cubes' // Changed to cubes for warehouse management system
};

// Define menu configurations based on the file name
const menuConfigurations = {
    'attend.html': [
        { href: 'orgni.html', text: '조직도구성' },
        { href: 'attend.html', text: '근태관리' },
        { href: '#', text: '생산일정' },
        { href: '#', text: '회의일정' },
        { href: '#', text: '이벤트' }
    ],

    'calendar.html': [
        { href: 'calendar.html', text: '업무일정' },
        { href: 'trello.html', text: '프로젝트일정' },
        { href: 'timeline.html', text: '생산일정' },
        { href: '#', text: '회의일정' },
        { href: '#', text: '이벤트' }
    ],

    'chain.html': [
        { href: 'stati.html', text: '회원통계' },
        { href: 'flow.html', text: '매출통계' },
        { href: 'chain.html', text: '체인운영' },
        { href: '#', text: '판매통계' },
        { href: '#', text: '실적' }
    ],

    'config.html': [
        { href: 'config.html', text: '시스템로그' },
        { href: 'network.html', text: '컨설팅지정' },
        { href: '#', text: 'VM현황' },
        { href: '#', text: 'DB관리' },
        { href: '#', text: '방화벽' }
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
        { href: '#', text: '판매통계' },
        { href: '#', text: '실적' }
    ],

    'hospital.html': [
        { href: 'work.html', text: '예약관리' },
        { href: 'meeting.html', text: '회의실관리' },
        { href: 'hospital.html', text: '병원예약' },
        { href: 'lectures.html', text: '강의일정' },
        { href: '#', text: '이벤트' }
    ],

    'lectures.html': [
        { href: 'work.html', text: '예약관리' },
        { href: 'meeting.html', text: '회의실관리' },
        { href: 'hospital.html', text: '병원예약' },
        { href: 'lectures.html', text: '강의일정' },
        { href: '#', text: '이벤트' }
    ],

    'meeting.html': [
        { href: 'work.html', text: '예약관리' },
        { href: 'meeting.html', text: '회의실관리' },
        { href: 'hospital.html', text: '병원예약' },
        { href: 'lectures.html', text: '강의일정' },
        { href: '#', text: '이벤트' }
    ],


    'network.html': [
        { href: 'config.html', text: '시스템로그' },
        { href: 'network.html', text: '컨설팅지정' },
        { href: '#', text: 'VM현황' },
        { href: '#', text: 'DB관리' },
        { href: '#', text: '방화벽' }
    ],

    'orgni.html': [
        { href: 'orgni.html', text: '조직도구성' },
        { href: 'attend.html', text: '근태관리' },
        { href: '#', text: '생산일정' },
        { href: '#', text: '회의일정' },
        { href: '#', text: '이벤트' }
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
        { href: '#', text: '판매통계' },
        { href: '#', text: '실적' }
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
        { href: '#', text: '회의일정' },
        { href: '#', text: '이벤트' }
    ],

    'trello.html': [
        { href: 'calendar.html', text: '업무일정' },
        { href: 'trello.html', text: '프로젝트일정' },
        { href: 'timeline.html', text: '생산일정' },
        { href: '#', text: '회의일정' },
        { href: '#', text: '이벤트' }
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
        { href: '#', text: '이벤트' }
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
    console.log(modalId);

    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'hidden fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50';

    const modalContent = `
        <div class="bg-white rounded-lg shadow-lg p-6 w-1/3 relative">
            <button class="close" onclick="document.getElementById('${modalId}').classList.add('hidden');">&times;</button>
            <h2 class="text-lg font-semibold mb-4">${title}</h2>
            ${content}
            <div class="flex justify-end space-x-2 mt-4">
                ${buttons.map(btn => `<button id="closeDemoModal" class="${btn.class}" onclick="${btn.onClick}">${btn.label}</button>`).join('')}
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
        { label: 'Save', class: 'bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600', onClick: 'saveModal()' },
        { label: 'Close', class: 'bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700', onClick: "document.getElementById('modal').classList.add('hidden');" }
    ]
);

createModal(
    'logoutModal',
    '로그아웃 하시겠습니까?',
    '',
    [
        { label: 'Logout', class: 'bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600', onClick: "window.location.href='index.html';" },
        { label: 'Cancel', class: 'bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700', onClick: "document.getElementById('logoutModal').classList.add('hidden');" }
    ]
);

createModal(
    'demoModal',
    '알림',
    '<p>데모버젼에서는 지원하지 않습니다.</p>',
    [
        { label: '닫기', class: 'bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700', onClick: "document.getElementById('demoModal').classList.add('hidden');" }
    ]
);

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
    floatingNav.className = 'fixed bottom-4 right-4 bg-gray-800 text-white rounded-lg shadow-lg p-4 z-50 hidden space-y-4';
    floatingNav.innerHTML = `
        <div class="flex justify-between items-center">
            <h3 class="text-white font-semibold">Language</h3>
            <button id="closeFloatingNav" class="text-white text-lg">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div id="languageSwitcher" class="flex space-x-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg" alt="English" data-lang="en" class="w-8 h-8 cursor-pointer">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/09/Flag_of_South_Korea.svg" alt="한국어" data-lang="ko" class="w-8 h-8 cursor-pointer">
            <img src="https://upload.wikimedia.org/wikipedia/commons/9/9e/Flag_of_Japan.svg" alt="日本語" data-lang="ja" class="w-6 h-6 cursor-pointer">
        </div>
    `;

    container.appendChild(floatingNav);

    // Add event listener to close button
    const closeButton = floatingNav.querySelector('#closeFloatingNav');
    closeButton.addEventListener('click', () => {
        floatingNav.classList.add('hidden');
    });

    // Add event listeners to language switcher images
    const languageSwitcher = floatingNav.querySelector('#languageSwitcher');
    languageSwitcher.addEventListener('click', (event) => {
        if (event.target.tagName === 'IMG') {
            const selectedLang = event.target.getAttribute('data-lang');
            console.log(`Selected language: ${selectedLang}`);
            // Add your language switching logic here
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

    if (!container) {
        console.error(`Container with ID \"${containerId}\" not found.`);
        return;
    }

    const tabsDiv = document.createElement("div");
    tabsDiv.className = "tabs flex";

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
            <div class="app-brand">
                <a href="${this.logoHref}" class="app-logo">
                    <span class="logo-text">${this.brandName}</span>
                </a>
            </div>
        `;
    }
}

// Initialize the AppBrand component
document.addEventListener('DOMContentLoaded', () => {
    const appBrand = new AppBrand('logo', 'EDUMGT');
});

/* gearIcon */
const button = document.createElement('button');
button.id = 'gearIcon';
button.className = 'fixed bottom-4 right-4 bg-gray-700 text-white rounded-full p-3 z-50';
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
    floatingNav.classList.add('hidden'); // Hide the floating menu
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


function showToast(message, type = 'success') {
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
