// menuLinks2.forEach((link) => {
//     if (link.getAttribute("href") === currentPage) {
//         menuLinks.forEach((link) => {
//             if (link.getAttribute("href") === "work.html") {
//                 link.classList.add("active");
//             } else {
//                 link.classList.remove("active");
//             }
//         });
//     }
// });

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
            work: "Reservation Management",
            meeting: "Meeting Room Management",
            hospital: "Hospital Reservation",
            lectures: "Lecture Schedule",
            city: "District Information"
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
            work: "예약관리",
            meeting: "회의실관리",
            hospital: "병원예약",
            lectures: "강의일정",
            city: "행정구역정보",
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
            work: "予約管理",
            meeting: "会議室管理",
            hospital: "病院予約",
            lectures: "講義日程",
            city: "行政区情報",
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


// const languageSwitcher = document.getElementById("languageSwitcher");
// const breadcrumb = document.querySelector(".breadcrumb");
// const buttons = document.querySelectorAll("#content button span");
// const tabs = document.querySelectorAll(".tabs li a span");
// const offCanvasItems = document.querySelectorAll("#offCanvas .menu-item span");

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
    offCanvasItems[0].textContent = offCanvasLabels.work;
    offCanvasItems[1].textContent = offCanvasLabels.meeting;
    offCanvasItems[2].textContent = offCanvasLabels.hospital;
    offCanvasItems[3].textContent = offCanvasLabels.lectures;
    offCanvasItems[4].textContent = offCanvasLabels.city;
    
    if (currentPage.includes("work")) {
        breadcrumb.textContent = offCanvasLabels.work;
    } else if (currentPage.includes("meeting")) {
        breadcrumb.textContent = offCanvasLabels.meeting;
    } else if (currentPage.includes("hospital")) {
        breadcrumb.textContent = offCanvasLabels.hospital;
    } else if (currentPage.includes("lectures")) {
        breadcrumb.textContent = offCanvasLabels.lectures;
    } else {
        breadcrumb.textContent = offCanvasLabels.city;
    }

});

document.addEventListener('DOMContentLoaded', () => {
    const appBrand = new AppBrand('logo', 'EDUMGT');
    const lang = localStorage.getItem('lang');
    //console.log("lang: " + lang);


    const tabLabels = translations[lang].tabs;
    tabs[0].textContent = tabLabels.system;
    tabs[1].textContent = tabLabels.organization;
    tabs[2].textContent = tabLabels.task;
    tabs[3].textContent = tabLabels.schedule;
    tabs[4].textContent = tabLabels.statistics;
    tabs[5].textContent = tabLabels.settings;

    const offCanvasLabels = translations[lang].offCanvas;
    offCanvasItems[0].textContent = offCanvasLabels.work;
    offCanvasItems[1].textContent = offCanvasLabels.meeting;
    offCanvasItems[2].textContent = offCanvasLabels.hospital;
    offCanvasItems[3].textContent = offCanvasLabels.lectures;
    offCanvasItems[4].textContent = offCanvasLabels.city;
    
    if (currentPage.includes("work")) {
        breadcrumb.textContent = offCanvasLabels.work;
    } else if (currentPage.includes("meeting")) {
        breadcrumb.textContent = offCanvasLabels.meeting;
    } else if (currentPage.includes("hospital")) {
        breadcrumb.textContent = offCanvasLabels.hospital;
    } else if (currentPage.includes("lectures")) {
        breadcrumb.textContent = offCanvasLabels.lectures;
    } else {
        breadcrumb.textContent = offCanvasLabels.city;
    }
});








