function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Toast Functionality
function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type} show`;
  toast.innerText = message;

  toastContainer.appendChild(toast);

  // Automatically remove the toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}


/* log out */
const memberIcon = document.getElementById('memberIcon');
const logoutModal = document.getElementById('logoutModal');
const confirmLogout = document.getElementById('confirmLogout');
const cancelLogout = document.getElementById('cancelLogout');
let isLoggedIn = true;

memberIcon.addEventListener('click', function () {
  if (isLoggedIn) {
    logoutModal.classList.remove('hidden');
  } else {
    logoutModal.classList.remove('hidden');
  }
});


confirmLogout.addEventListener('click', function () {
  isLoggedIn = false;
  memberIcon.innerHTML = '<i class="fas fa-user"></i>';
  logoutModal.classList.add('hidden');
});

cancelLogout.addEventListener('click', function () {
  logoutModal.classList.add('hidden');
});

/* LNB */
const offCanvas = document.getElementById('offCanvas');
offCanvas.classList.remove('hidden', '-translate-x-full');
offCanvas.classList.add('collapsed');
offCanvas.classList.remove('expanded');


// const expandOffCanvas = document.getElementById('expandOffCanvas');
// const collapseOffCanvas = document.getElementById('collapseOffCanvas');
// expandOffCanvas.addEventListener('click', function () {
//   offCanvas.classList.remove('collapsed');
//   offCanvas.classList.add('expanded');
//   expandOffCanvas.classList.add('hidden');
// });
// collapseOffCanvas.addEventListener('click', function () {
//   offCanvas.classList.add('collapsed');
//   offCanvas.classList.remove('expanded');
//   collapseOffCanvas.classList.add('hidden');
// });

// 현재 페이지 URL 가져오기
const currentPage = window.location.pathname.split("/").pop();

// 모든 메뉴 링크 가져오기
const menuLinks = document.querySelectorAll(".gnb-item");

// 활성화 상태 설정
menuLinks.forEach((link) => {

  if (link.getAttribute("href") === currentPage) {
    console.log(currentPage);
    link.classList.add("active");
  } else {
    link.classList.remove("active");
  }
});

const demoLinks = document.querySelectorAll('a[href="#"]');
const demoModal = document.getElementById('demoModal');
const closeDemoModal = document.getElementById('closeDemoModal');

// 링크 클릭 이벤트
demoLinks.forEach(link => {
  link.addEventListener('click', function (event) {
    event.preventDefault(); // 기본 동작 막기
    demoModal.classList.remove('hidden');
  });
});

// 모달 닫기 버튼 클릭 이벤트
closeDemoModal.addEventListener('click', function () {
  demoModal.classList.add('hidden');
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
      code: "Code Management",
      permissions: "Permissions Management",
      logs: "Logs Management",
      menu: "Menu Management",
      settings: "Settings Management",
    },
    breadcrumb: "Code Management",
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
      code: "코드관리",
      permissions: "권한관리",
      logs: "로그관리",
      menu: "메뉴관리",
      settings: "설정관리",
    },
    breadcrumb: "코드관리",
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
      code: "コード管理",
      permissions: "権限管理",
      logs: "ログ管理",
      menu: "メニュー管理",
      settings: "設定管理",
    },
    breadcrumb: "コード管理",
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

// 언어 변경 이벤트 핸들러
languageSwitcher.addEventListener("click", function (event) {
  const lang = event.target.getAttribute("data-lang");
  if (!lang || !translations[lang]) return;

  // Breadcrumb 텍스트 변경
  breadcrumb.textContent = translations[lang].breadcrumb;

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
  offCanvasItems[0].textContent = offCanvasLabels.code;
  offCanvasItems[1].textContent = offCanvasLabels.permissions;
  offCanvasItems[2].textContent = offCanvasLabels.logs;
  offCanvasItems[3].textContent = offCanvasLabels.menu;
  //offCanvasItems[4].textContent = offCanvasLabels.settings;

  // 버튼 텍스트 변경
  const buttonLabels = translations[lang].buttons;
  buttons[0].textContent = buttonLabels.search;
  buttons[1].textContent = buttonLabels.reset;
  buttons[2].textContent = buttonLabels.new;
  buttons[3].textContent = buttonLabels.delete;
  buttons[4].textContent = buttonLabels.save;

});

// document.getElementById('closeFloatingNav').addEventListener('click', () => {
//   const floatingNav = document.getElementById('floatingNav');
//   floatingNav.classList.add('hidden'); // Hide the floating menu
// });

// document.getElementById('closeFloatingNav').addEventListener('click', () => {
//   const floatingNav = document.getElementById('floatingNav');
//   floatingNav.classList.add('hidden'); // Hide the floating menu
// });



