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
            orgni: "Organization Structure",
            attend: "Attendance Management",
            total: "Incentive"

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
            orgni: "조직도구성",
            attend: "근태관리",
            total: "인센티브",
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
            orgni: "組織構成",
            attend: "勤怠管理",
            total: "インセンティブ"
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

languageSwitcher.addEventListener("click", function (event) {

    let lang = event.target.getAttribute("data-lang");
    localStorage.setItem('lang', lang);
    if (!lang || !translations[lang]) return;

    let tabLabels = translations[lang].tabs;
    tabs[0].textContent = tabLabels.system;
    tabs[1].textContent = tabLabels.organization;
    tabs[2].textContent = tabLabels.task;
    tabs[3].textContent = tabLabels.schedule;
    tabs[4].textContent = tabLabels.statistics;
    tabs[5].textContent = tabLabels.settings;
  
    let offCanvasLabels = translations[lang].offCanvas;
    if (currentPage.includes("calendar")) {
        breadcrumb.textContent = offCanvasLabels.calendar;
        offCanvasItems[0].textContent = offCanvasLabels.calendar;
        offCanvasItems[1].textContent = offCanvasLabels.trello;
        offCanvasItems[2].textContent = offCanvasLabels.timeline;
    } else if (currentPage.includes("trello")) {
        breadcrumb.textContent = offCanvasLabels.trello;
        offCanvasItems[0].textContent = offCanvasLabels.calendar;
        offCanvasItems[1].textContent = offCanvasLabels.trello;
        offCanvasItems[2].textContent = offCanvasLabels.timeline;
    } else if (currentPage.includes("timeline")) {
        breadcrumb.textContent = offCanvasLabels.timeline;
        offCanvasItems[0].textContent = offCanvasLabels.calendar;
        offCanvasItems[1].textContent = offCanvasLabels.trello;
        offCanvasItems[2].textContent = offCanvasLabels.timeline;
    } else if (currentPage.includes("orgni")) {
        breadcrumb.textContent = offCanvasLabels.orgni;
        offCanvasItems[0].textContent = offCanvasLabels.orgni;
        offCanvasItems[1].textContent = offCanvasLabels.attend;
        offCanvasItems[2].textContent = offCanvasLabels.total;
    } else if (currentPage.includes("attend")) {
        breadcrumb.textContent = offCanvasLabels.attend;
        offCanvasItems[0].textContent = offCanvasLabels.orgni;
        offCanvasItems[1].textContent = offCanvasLabels.attend;
        offCanvasItems[2].textContent = offCanvasLabels.total;
    } else if (currentPage.includes("total")) {
        breadcrumb.textContent = offCanvasLabels.total;
        offCanvasItems[0].textContent = offCanvasLabels.orgni;
        offCanvasItems[1].textContent = offCanvasLabels.attend;
        offCanvasItems[2].textContent = offCanvasLabels.total;
    }

});

document.addEventListener('DOMContentLoaded', () => {
    
    let lang = localStorage.getItem('lang');
    const tabLabels = translations[lang].tabs;
    tabs[0].textContent = tabLabels.system;
    tabs[1].textContent = tabLabels.organization;
    tabs[2].textContent = tabLabels.task;
    tabs[3].textContent = tabLabels.schedule;
    tabs[4].textContent = tabLabels.statistics;
    tabs[5].textContent = tabLabels.settings;
  
    let offCanvasLabels = translations[lang].offCanvas;
    if (currentPage.includes("calendar")) {
        breadcrumb.textContent = offCanvasLabels.calendar;
        offCanvasItems[0].textContent = offCanvasLabels.calendar;
        offCanvasItems[1].textContent = offCanvasLabels.trello;
        offCanvasItems[2].textContent = offCanvasLabels.timeline;
    } else if (currentPage.includes("trello")) {
        breadcrumb.textContent = offCanvasLabels.trello;
        offCanvasItems[0].textContent = offCanvasLabels.calendar;
        offCanvasItems[1].textContent = offCanvasLabels.trello;
        offCanvasItems[2].textContent = offCanvasLabels.timeline;
    } else if (currentPage.includes("timeline")) {
        breadcrumb.textContent = offCanvasLabels.timeline;
        offCanvasItems[0].textContent = offCanvasLabels.calendar;
        offCanvasItems[1].textContent = offCanvasLabels.trello;
        offCanvasItems[2].textContent = offCanvasLabels.timeline;
    } else if (currentPage.includes("orgni")) {
        breadcrumb.textContent = offCanvasLabels.orgni;
        offCanvasItems[0].textContent = offCanvasLabels.orgni;
        offCanvasItems[1].textContent = offCanvasLabels.attend;
        offCanvasItems[2].textContent = offCanvasLabels.total;
    } else if (currentPage.includes("attend")) {
        breadcrumb.textContent = offCanvasLabels.attend;
        offCanvasItems[0].textContent = offCanvasLabels.orgni;
        offCanvasItems[1].textContent = offCanvasLabels.attend;
        offCanvasItems[2].textContent = offCanvasLabels.total;
    } else if (currentPage.includes("total")) {
        breadcrumb.textContent = offCanvasLabels.total;
        offCanvasItems[0].textContent = offCanvasLabels.orgni;
        offCanvasItems[1].textContent = offCanvasLabels.attend;
        offCanvasItems[2].textContent = offCanvasLabels.total;
    }
  });





