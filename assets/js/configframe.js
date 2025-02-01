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
            config: "System log",
            network: "Consultant",
            survey: "Survey",
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
            config: "시스템 로그",
            network: "컨설팅 지정",
            survey: "서베이",
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
            config: "システムログ",
            network: "コンサルティングの指定",
            survey: "サーベイ"
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
    offCanvasItems[0].textContent = offCanvasLabels.config;
    offCanvasItems[1].textContent = offCanvasLabels.network;
    offCanvasItems[2].textContent = offCanvasLabels.survey;

    if (currentPage.includes("network")) {
        breadcrumb.textContent = offCanvasLabels.network;
    } else if (currentPage.includes("survey")) {
        breadcrumb.textContent = offCanvasLabels.survey;
    } else if (currentPage.includes("config")) {
        breadcrumb.textContent = offCanvasLabels.config;
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
    offCanvasItems[0].textContent = offCanvasLabels.config;
    offCanvasItems[1].textContent = offCanvasLabels.network;
    offCanvasItems[2].textContent = offCanvasLabels.survey;

    if (currentPage.includes("network")) {
        breadcrumb.textContent = offCanvasLabels.network;
    } else if (currentPage.includes("survey")) {
        breadcrumb.textContent = offCanvasLabels.survey;
    } else if (currentPage.includes("config")) {
        breadcrumb.textContent = offCanvasLabels.config;
    }
});


