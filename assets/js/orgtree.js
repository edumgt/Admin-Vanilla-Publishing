// menuLinks2.forEach((link) => {
//   if (link.getAttribute("href") === currentPage) {
//     menuLinks.forEach((link) => {
//       if (link.getAttribute("href") === "system.html") {
//         link.classList.add("active");
//       } else {
//         link.classList.remove("active");
//       }
//     });
//   }
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
      system: "Code Management",
      orgtree: "Permission Management",
      document: "Document Management",
      wms: "WMS"

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
      wms: "WMS"
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

// 언어 변경 이벤트 핸들러
languageSwitcher.addEventListener("click", function (event) {
  const lang = event.target.getAttribute("data-lang");
  localStorage.setItem('lang', lang);
  if (!lang || !translations[lang]) return;



  // 탭 메뉴 텍스트 변경
  const tabLabels = translations[lang].tabs;
  tabs[0].textContent = tabLabels.system;
  tabs[1].textContent = tabLabels.organization;
  tabs[2].textContent = tabLabels.task;
  tabs[3].textContent = tabLabels.schedule;
  tabs[4].textContent = tabLabels.statistics;
  tabs[5].textContent = tabLabels.settings;

  // OffCanvas 메뉴 텍스트 변경
  const offCanvasLabels = translations[lang].offCanvas;
  offCanvasItems[0].textContent = offCanvasLabels.system;
  offCanvasItems[1].textContent = offCanvasLabels.orgtree;
  offCanvasItems[2].textContent = offCanvasLabels.document;
  offCanvasItems[3].textContent = offCanvasLabels.wms;
  if (currentPage.includes("system")) {
    breadcrumb.textContent = offCanvasLabels.system;
  } else if (currentPage.includes("orgtree")) {
    breadcrumb.textContent = offCanvasLabels.orgtree;
  } else if (currentPage.includes("document")) {
    breadcrumb.textContent = offCanvasLabels.document;
  } else {
    breadcrumb.textContent = offCanvasLabels.wms;
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

  // OffCanvas 메뉴 텍스트 변경
  const offCanvasLabels = translations[lang].offCanvas;
  offCanvasItems[0].textContent = offCanvasLabels.system;
  offCanvasItems[1].textContent = offCanvasLabels.orgtree;
  offCanvasItems[2].textContent = offCanvasLabels.document;
  offCanvasItems[3].textContent = offCanvasLabels.wms;
  if (currentPage.includes("system")) {
    breadcrumb.textContent = offCanvasLabels.system;
  } else if (currentPage.includes("orgtree")) {
    breadcrumb.textContent = offCanvasLabels.orgtree;
  } else if (currentPage.includes("document")) {
    breadcrumb.textContent = offCanvasLabels.document;
  } else {
    breadcrumb.textContent = offCanvasLabels.wms;
  }
});

