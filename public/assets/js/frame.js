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
    } else if (currentPage.includes("system")) {
        breadcrumb.textContent = offCanvasLabels.system;
        offCanvasItems[0].textContent = offCanvasLabels.system;
        offCanvasItems[1].textContent = offCanvasLabels.orgtree;
        offCanvasItems[2].textContent = offCanvasLabels.document;
        offCanvasItems[3].textContent = offCanvasLabels.wms;
    } else if (currentPage.includes("orgtree")) {
        breadcrumb.textContent = offCanvasLabels.orgtree;
        offCanvasItems[0].textContent = offCanvasLabels.system;
        offCanvasItems[1].textContent = offCanvasLabels.orgtree;
        offCanvasItems[2].textContent = offCanvasLabels.document;
        offCanvasItems[3].textContent = offCanvasLabels.wms;
    } else if (currentPage.includes("document")) {
        breadcrumb.textContent = offCanvasLabels.document;
        offCanvasItems[0].textContent = offCanvasLabels.system;
        offCanvasItems[1].textContent = offCanvasLabels.orgtree;
        offCanvasItems[2].textContent = offCanvasLabels.document;
        offCanvasItems[3].textContent = offCanvasLabels.wms;
    } else if (currentPage.includes("wms")) {
        breadcrumb.textContent = offCanvasLabels.wms;
        offCanvasItems[0].textContent = offCanvasLabels.system;
        offCanvasItems[1].textContent = offCanvasLabels.orgtree;
        offCanvasItems[2].textContent = offCanvasLabels.document;
        offCanvasItems[3].textContent = offCanvasLabels.wms;
    } else if (currentPage.includes("network")) {
        breadcrumb.textContent = offCanvasLabels.network;
        offCanvasItems[0].textContent = offCanvasLabels.config;
        offCanvasItems[1].textContent = offCanvasLabels.network;
        offCanvasItems[2].textContent = offCanvasLabels.survey;
    } else if (currentPage.includes("survey")) {
        breadcrumb.textContent = offCanvasLabels.survey;
        offCanvasItems[0].textContent = offCanvasLabels.config;
        offCanvasItems[1].textContent = offCanvasLabels.network;
        offCanvasItems[2].textContent = offCanvasLabels.survey;
    } else if (currentPage.includes("config")) {
        breadcrumb.textContent = offCanvasLabels.config;
        offCanvasItems[0].textContent = offCanvasLabels.config;
        offCanvasItems[1].textContent = offCanvasLabels.network;
        offCanvasItems[2].textContent = offCanvasLabels.survey;
    } else if (currentPage.includes("work")) {
        breadcrumb.textContent = offCanvasLabels.work;
        offCanvasItems[0].textContent = offCanvasLabels.work;
        offCanvasItems[1].textContent = offCanvasLabels.meeting;
        offCanvasItems[2].textContent = offCanvasLabels.hospital;
        offCanvasItems[3].textContent = offCanvasLabels.lectures;
        offCanvasItems[4].textContent = offCanvasLabels.city;
    } else if (currentPage.includes("meeting")) {
        breadcrumb.textContent = offCanvasLabels.meeting;
        offCanvasItems[0].textContent = offCanvasLabels.work;
        offCanvasItems[1].textContent = offCanvasLabels.meeting;
        offCanvasItems[2].textContent = offCanvasLabels.hospital;
        offCanvasItems[3].textContent = offCanvasLabels.lectures;
        offCanvasItems[4].textContent = offCanvasLabels.city;
    } else if (currentPage.includes("hospital")) {
        breadcrumb.textContent = offCanvasLabels.hospital;
        offCanvasItems[0].textContent = offCanvasLabels.work;
        offCanvasItems[1].textContent = offCanvasLabels.meeting;
        offCanvasItems[2].textContent = offCanvasLabels.hospital;
        offCanvasItems[3].textContent = offCanvasLabels.lectures;
        offCanvasItems[4].textContent = offCanvasLabels.city;
    } else if (currentPage.includes("lectures")) {
        breadcrumb.textContent = offCanvasLabels.lectures;
        offCanvasItems[0].textContent = offCanvasLabels.work;
        offCanvasItems[1].textContent = offCanvasLabels.meeting;
        offCanvasItems[2].textContent = offCanvasLabels.hospital;
        offCanvasItems[3].textContent = offCanvasLabels.lectures;
        offCanvasItems[4].textContent = offCanvasLabels.city;
    } else if (currentPage.includes("city")) {
        breadcrumb.textContent = offCanvasLabels.city;
        offCanvasItems[0].textContent = offCanvasLabels.work;
        offCanvasItems[1].textContent = offCanvasLabels.meeting;
        offCanvasItems[2].textContent = offCanvasLabels.hospital;
        offCanvasItems[3].textContent = offCanvasLabels.lectures;
        offCanvasItems[4].textContent = offCanvasLabels.city;
    } else if (currentPage.includes("stati")) {
        breadcrumb.textContent = offCanvasLabels.stati;
        offCanvasItems[0].textContent = offCanvasLabels.stati;
        offCanvasItems[1].textContent = offCanvasLabels.flow;
        offCanvasItems[2].textContent = offCanvasLabels.chain;
    } else if (currentPage.includes("flow")) {
        breadcrumb.textContent = offCanvasLabels.flow;
        offCanvasItems[0].textContent = offCanvasLabels.stati;
        offCanvasItems[1].textContent = offCanvasLabels.flow;
        offCanvasItems[2].textContent = offCanvasLabels.chain;
    } else if (currentPage.includes("chain")) {
        breadcrumb.textContent = offCanvasLabels.chain;
        offCanvasItems[0].textContent = offCanvasLabels.stati;
        offCanvasItems[1].textContent = offCanvasLabels.flow;
        offCanvasItems[2].textContent = offCanvasLabels.chain;
    }


});

document.addEventListener('DOMContentLoaded', () => {

    let lang = localStorage.getItem('lang');
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
    } else if (currentPage.includes("system")) {
        breadcrumb.textContent = offCanvasLabels.system;
        offCanvasItems[0].textContent = offCanvasLabels.system;
        offCanvasItems[1].textContent = offCanvasLabels.orgtree;
        offCanvasItems[2].textContent = offCanvasLabels.document;
        offCanvasItems[3].textContent = offCanvasLabels.wms;
    } else if (currentPage.includes("orgtree")) {
        breadcrumb.textContent = offCanvasLabels.orgtree;
        offCanvasItems[0].textContent = offCanvasLabels.system;
        offCanvasItems[1].textContent = offCanvasLabels.orgtree;
        offCanvasItems[2].textContent = offCanvasLabels.document;
        offCanvasItems[3].textContent = offCanvasLabels.wms;
    } else if (currentPage.includes("document")) {
        breadcrumb.textContent = offCanvasLabels.document;
        offCanvasItems[0].textContent = offCanvasLabels.system;
        offCanvasItems[1].textContent = offCanvasLabels.orgtree;
        offCanvasItems[2].textContent = offCanvasLabels.document;
        offCanvasItems[3].textContent = offCanvasLabels.wms;
    } else if (currentPage.includes("wms")) {
        breadcrumb.textContent = offCanvasLabels.wms;
        offCanvasItems[0].textContent = offCanvasLabels.system;
        offCanvasItems[1].textContent = offCanvasLabels.orgtree;
        offCanvasItems[2].textContent = offCanvasLabels.document;
        offCanvasItems[3].textContent = offCanvasLabels.wms;
    } else if (currentPage.includes("network")) {
        breadcrumb.textContent = offCanvasLabels.network;
        offCanvasItems[0].textContent = offCanvasLabels.config;
        offCanvasItems[1].textContent = offCanvasLabels.network;
        offCanvasItems[2].textContent = offCanvasLabels.survey;
    } else if (currentPage.includes("survey")) {
        breadcrumb.textContent = offCanvasLabels.survey;
        offCanvasItems[0].textContent = offCanvasLabels.config;
        offCanvasItems[1].textContent = offCanvasLabels.network;
        offCanvasItems[2].textContent = offCanvasLabels.survey;
    } else if (currentPage.includes("config")) {
        breadcrumb.textContent = offCanvasLabels.config;
        offCanvasItems[0].textContent = offCanvasLabels.config;
        offCanvasItems[1].textContent = offCanvasLabels.network;
        offCanvasItems[2].textContent = offCanvasLabels.survey;
    } else if (currentPage.includes("work")) {
        breadcrumb.textContent = offCanvasLabels.work;
        offCanvasItems[0].textContent = offCanvasLabels.work;
        offCanvasItems[1].textContent = offCanvasLabels.meeting;
        offCanvasItems[2].textContent = offCanvasLabels.hospital;
        offCanvasItems[3].textContent = offCanvasLabels.lectures;
        offCanvasItems[4].textContent = offCanvasLabels.city;
    } else if (currentPage.includes("meeting")) {
        breadcrumb.textContent = offCanvasLabels.meeting;
        offCanvasItems[0].textContent = offCanvasLabels.work;
        offCanvasItems[1].textContent = offCanvasLabels.meeting;
        offCanvasItems[2].textContent = offCanvasLabels.hospital;
        offCanvasItems[3].textContent = offCanvasLabels.lectures;
        offCanvasItems[4].textContent = offCanvasLabels.city;
    } else if (currentPage.includes("hospital")) {
        breadcrumb.textContent = offCanvasLabels.hospital;
        offCanvasItems[0].textContent = offCanvasLabels.work;
        offCanvasItems[1].textContent = offCanvasLabels.meeting;
        offCanvasItems[2].textContent = offCanvasLabels.hospital;
        offCanvasItems[3].textContent = offCanvasLabels.lectures;
        offCanvasItems[4].textContent = offCanvasLabels.city;
    } else if (currentPage.includes("lectures")) {
        breadcrumb.textContent = offCanvasLabels.lectures;
        offCanvasItems[0].textContent = offCanvasLabels.work;
        offCanvasItems[1].textContent = offCanvasLabels.meeting;
        offCanvasItems[2].textContent = offCanvasLabels.hospital;
        offCanvasItems[3].textContent = offCanvasLabels.lectures;
        offCanvasItems[4].textContent = offCanvasLabels.city;
    } else if (currentPage.includes("city")) {
        breadcrumb.textContent = offCanvasLabels.city;
        offCanvasItems[0].textContent = offCanvasLabels.work;
        offCanvasItems[1].textContent = offCanvasLabels.meeting;
        offCanvasItems[2].textContent = offCanvasLabels.hospital;
        offCanvasItems[3].textContent = offCanvasLabels.lectures;
        offCanvasItems[4].textContent = offCanvasLabels.city;
    } else if (currentPage.includes("stati")) {
        breadcrumb.textContent = offCanvasLabels.stati;
        offCanvasItems[0].textContent = offCanvasLabels.stati;
        offCanvasItems[1].textContent = offCanvasLabels.flow;
        offCanvasItems[2].textContent = offCanvasLabels.chain;
    } else if (currentPage.includes("flow")) {
        breadcrumb.textContent = offCanvasLabels.flow;
        offCanvasItems[0].textContent = offCanvasLabels.stati;
        offCanvasItems[1].textContent = offCanvasLabels.flow;
        offCanvasItems[2].textContent = offCanvasLabels.chain;
    } else if (currentPage.includes("chain")) {
        breadcrumb.textContent = offCanvasLabels.chain;
        offCanvasItems[0].textContent = offCanvasLabels.stati;
        offCanvasItems[1].textContent = offCanvasLabels.flow;
        offCanvasItems[2].textContent = offCanvasLabels.chain;
    }
});

