import { createTanslations } from './common.js';
const translations = createTanslations;

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

