const currentPage = window.location.pathname.split("/").pop();
const menuLinks = document.querySelectorAll(".gnb-item");
const menuLinks2 = document.querySelectorAll(".menu-item");
menuLinks2.forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
        menuLinks.forEach((link) => {
            if (link.getAttribute("href") === "calendar.html") {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    } 
});


/* 다국어 */
const translations = {
    en: {
        menu: "Menu",
        tabs: {
            system: "System",
            organization: "Organization",
            task: "Task",
            schedule: "Schedule",
            statistics: "Statistics",
            settings: "Settings",
        },
        offCanvas: {
            calendar: "Work Schedule",
            trello: "Project Schedule",
            timeline: "Production Schedule",

        },
        
        buttons: {
            search: "Search",
            reset: "Reset Search",
            new: "New",
            delete: "Delete",
            save: "Save",
        },
        
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
            calendar: "업무일정",
            trello: "프로젝트일정",
            timeline: "생산일정",
        },
        
        buttons: {
            search: "검색",
            reset: "검색 초기화",
            new: "신규",
            delete: "삭제",
            save: "저장",
        },
        
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
            calendar: "業務日程",
            trello: "プロジェクト日程",
            timeline: "生産日程",
        },
        
        buttons: {
            search: "検索",
            reset: "検索をリセット",
            new: "新規",
            delete: "削除",
            save: "保存",
        },
        
    },
};


const languageSwitcher = document.getElementById("languageSwitcher");
const breadcrumb = document.querySelector(".breadcrumb");
const buttons = document.querySelectorAll("#content button span");
const tabs = document.querySelectorAll(".tabs li a span");
const offCanvasItems = document.querySelectorAll("#offCanvas .menu-item span");

languageSwitcher.addEventListener("click", function (event) {
    const lang = event.target.getAttribute("data-lang");
    localStorage.setItem('lang', lang);
    if (!lang || !translations[lang]) return;

    

    const tabLabels = translations[lang].tabs;
    tabs[0].textContent = tabLabels.system;
    tabs[1].textContent = tabLabels.organization;
    tabs[2].textContent = tabLabels.task;
    tabs[3].textContent = tabLabels.schedule;
    tabs[4].textContent = tabLabels.statistics;
    tabs[5].textContent = tabLabels.settings;

    const offCanvasLabels = translations[lang].offCanvas;
    offCanvasItems[0].textContent = offCanvasLabels.calendar;
    offCanvasItems[1].textContent = offCanvasLabels.trello;
    offCanvasItems[2].textContent = offCanvasLabels.timeline;
    if (currentPage.includes("calendar")) {
        breadcrumb.textContent = offCanvasLabels.calendar;
    } else if (currentPage.includes("trello")) {
        breadcrumb.textContent = offCanvasLabels.trello;
    } else if (currentPage.includes("timeline")) {
        breadcrumb.textContent = offCanvasLabels.timeline;
    } else {
        breadcrumb.textContent = offCanvasLabels.timeline;
    }

});

document.addEventListener('DOMContentLoaded', () => {
    const appBrand = new AppBrand('logo', 'EDUMGT');
    const lang = localStorage.getItem('lang');
    //console.log("lang: " + lang);
  
    
  
    // 탭 메뉴 텍스트 변경
    const tabLabels = translations[lang].tabs;
    tabs[0].textContent = tabLabels.system;
    tabs[1].textContent = tabLabels.organization;
    tabs[2].textContent = tabLabels.task;
    tabs[3].textContent = tabLabels.schedule;
    tabs[4].textContent = tabLabels.statistics;
    tabs[5].textContent = tabLabels.settings;
  
    const offCanvasLabels = translations[lang].offCanvas;
    offCanvasItems[0].textContent = offCanvasLabels.calendar;
    offCanvasItems[1].textContent = offCanvasLabels.trello;
    offCanvasItems[2].textContent = offCanvasLabels.timeline;
    if (currentPage.includes("calendar")) {
        breadcrumb.textContent = offCanvasLabels.calendar;
    } else if (currentPage.includes("trello")) {
        breadcrumb.textContent = offCanvasLabels.trello;
    } else if (currentPage.includes("timeline")) {
        breadcrumb.textContent = offCanvasLabels.timeline;
    } else {
        breadcrumb.textContent = offCanvasLabels.timeline;
    }
  });





