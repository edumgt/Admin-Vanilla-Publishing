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
      system: "Code Management",
      orgtree: "Permission Management",
      document: "Document Management",
      wms: "WMS",
      config: "System log",
      network: "Consultant",
      survey: "Survey",

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
      system: "코드관리",
      orgtree: "권한관리",
      document: "문서관리",
      wms: "WMS",
      config: "시스템 로그",
      network: "컨설팅 지정",
      survey: "서베이",
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
      system: "コード管理",
      orgtree: "権限管理",
      document: "文書管理",
      wms: "WMS",
      config: "システムログ",
      network: "コンサルティングの指定",
      survey: "サーベイ"
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
  }
});

