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

  if (currentPage.includes("system")) {
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
  if (currentPage.includes("system")) {
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
  }
});

