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


/* log out */
// const memberIcon = document.getElementById('memberIcon');
// const logoutModal = document.getElementById('logoutModal');
// const confirmLogout = document.getElementById('confirmLogout');
// const cancelLogout = document.getElementById('cancelLogout');
// let isLoggedIn = true;
// memberIcon.addEventListener('click', function () {
//     if (isLoggedIn) {
//         logoutModal.classList.remove('hidden');
//     } else {
//         logoutModal.classList.remove('hidden');
//     }
// });


const currentPage = window.location.pathname.split("/").pop();

const menuLinks = document.querySelectorAll(".gnb-item");

const menuLinks2 = document.querySelectorAll(".menu-item");

menuLinks2.forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
        menuLinks.forEach((link) => {
            if (link.getAttribute("href") === "work.html") {
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
        breadcrumb: "Member Statistics",
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
        breadcrumb: "회원통계",
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
        breadcrumb: "会員統計",
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
    //offCanvasItems[4].textContent = offCanvasLabels.settings;

});








