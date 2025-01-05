// Dynamically create modals
function createModal(modalId, title, content, buttons) {
    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'hidden fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50';

    const modalContent = `
        <div class="bg-white rounded-lg shadow-lg p-6 w-1/3 relative">
            <button class="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-lg" onclick="document.getElementById('${modalId}').classList.add('hidden');">&times;</button>
            <h2 class="text-lg font-semibold mb-4">${title}</h2>
            ${content}
            <div class="flex justify-end space-x-2 mt-4">
                ${buttons.map(btn => `<button class="${btn.class}" onclick="${btn.onClick}">${btn.label}</button>`).join('')}
            </div>
        </div>`;

    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
}

// Create specific modals
createModal(
    'modal',
    'Edit Row Details',
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

// Save modal action
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


/* log out */
const memberIcon = document.getElementById('memberIcon');
const logoutModal = document.getElementById('logoutModal');
const confirmLogout = document.getElementById('confirmLogout');
const cancelLogout = document.getElementById('cancelLogout');
let isLoggedIn = true;

memberIcon.addEventListener('click', function () {
    if (isLoggedIn) {
        logoutModal.classList.remove('hidden');
    } else {
        logoutModal.classList.remove('hidden');
    }
});



/* LNB */
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

const currentPage = window.location.pathname.split("/").pop();

const menuLinks = document.querySelectorAll(".gnb-item");

const menuLinks2 = document.querySelectorAll(".menu-item");

menuLinks2.forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
        menuLinks.forEach((link) => {
            if (link.getAttribute("href") === "config.html") {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    } 
});

const demoLinks = document.querySelectorAll('a[href="#"]');
const demoModal = document.getElementById('demoModal');
const closeDemoModal = document.getElementById('closeDemoModal');

demoLinks.forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault(); 
        demoModal.classList.remove('hidden');
    });
});

/* 다국어 */
const translations = {
    en: {
        menu: "Menu",
        tabs: {
            system: "System Management",
            organization: "Organization Management",
            task: "Task Management",
            schedule: "Schedule Management",
            statistics: "Statistics",
            settings: "Settings Management",
        },
        offCanvas: {
            code: "Member Statistics",
            permissions: "Sales Statistics",
            logs: "Production Statistics",
            menu: "Sales Statistics",
            settings: "Performance",
        },
        breadcrumb: "Statistics > Member Statistics",
        buttons: {
            search: "Search",
            reset: "Reset Search",
            new: "New",
            delete: "Delete",
            save: "Save",
        },
        alert: "Demo version does not support this feature.",
    },
    ko: {
        menu: "메뉴",
        tabs: {
            system: "시스템관리",
            organization: "조직관리",
            task: "업무관리",
            schedule: "일정관리",
            statistics: "통계",
            settings: "설정관리",
        },
        offCanvas: {
            code: "회원통계",
            permissions: "매출통계",
            logs: "생산통계",
            menu: "판매통계",
            settings: "실적",
        },
        breadcrumb: "통계 > 회원통계",
        buttons: {
            search: "검색",
            reset: "검색 초기화",
            new: "신규",
            delete: "삭제",
            save: "저장",
        },
        alert: "데모버젼에서는 지원하지 않습니다.",
    },
    ja: {
        menu: "メニュー",
        tabs: {
            system: "システム管理",
            organization: "組織管理",
            task: "業務管理",
            schedule: "スケジュール管理",
            statistics: "統計",
            settings: "設定管理",
        },
        offCanvas: {
            code: "会員統計",
            permissions: "売上統計",
            logs: "生産統計",
            menu: "販売統計",
            settings: "業績",
        },
        breadcrumb: "統計 > 会員統計",
        buttons: {
            search: "検索",
            reset: "検索をリセット",
            new: "新規",
            delete: "削除",
            save: "保存",
        },
        alert: "デモ版ではこの機能はサポートされていません。",
    },
};


const languageSwitcher = document.getElementById("languageSwitcher");
const breadcrumb = document.querySelector(".breadcrumb");
const buttons = document.querySelectorAll("#content button span");
const tabs = document.querySelectorAll(".tabs li a span");
const offCanvasItems = document.querySelectorAll("#offCanvas .menu-item span");

languageSwitcher.addEventListener("click", function (event) {
    const lang = event.target.getAttribute("data-lang");
    if (!lang || !translations[lang]) return;

    breadcrumb.textContent = translations[lang].breadcrumb;

    const tabLabels = translations[lang].tabs;
    tabs[0].textContent = tabLabels.system;
    tabs[1].textContent = tabLabels.organization;
    tabs[2].textContent = tabLabels.task;
    tabs[3].textContent = tabLabels.schedule;
    tabs[4].textContent = tabLabels.statistics;
    tabs[5].textContent = tabLabels.settings;

    const offCanvasLabels = translations[lang].offCanvas;
    offCanvasItems[0].textContent = offCanvasLabels.code;
    offCanvasItems[1].textContent = offCanvasLabels.permissions;
    offCanvasItems[2].textContent = offCanvasLabels.logs;
    offCanvasItems[3].textContent = offCanvasLabels.menu;
    offCanvasItems[4].textContent = offCanvasLabels.settings;

});

document.getElementById('gearIcon').addEventListener('click', () => {
    const floatingNav = document.getElementById('floatingNav');
    floatingNav.classList.remove('hidden'); 
});

document.getElementById('closeFloatingNav').addEventListener('click', () => {
    const floatingNav = document.getElementById('floatingNav');
    floatingNav.classList.add('hidden'); 
});



