
// UUID Generator Function
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}


// Close modal
document.getElementById('closeModal').addEventListener('click', () => {
    toggleModal(false);
});

document.getElementById('saveModal').addEventListener('click', () => {
    const modalForm = document.getElementById('modalForm');
    const formData = new FormData(modalForm);
    const updatedData = {};

    // Collect updated values from the form
    for (const [key, value] of formData.entries()) {
        updatedData[key] = value;
    }

    if (currentRowKey !== null) {
        grid.setValue(currentRowKey, 'tpCd', updatedData.tpCd);
        grid.setValue(currentRowKey, 'tpNm', updatedData.tpNm);
        grid.setValue(currentRowKey, 'descCntn', updatedData.descCntn);
        grid.setValue(currentRowKey, 'useYn', updatedData.useYn);
    }

    // Hide the modal and show a success toast
    toggleModal(false);
    saveData(grid.getData());
    showToast('해당 건의 데이타를 저장하였습니다.', 'success');
});

// Add event listener for the top-right close button
document.getElementById('closeModalTopRight').addEventListener('click', () => {
    toggleModal(false);
});

// Add event listener for the bottom close button
document.getElementById('closeModal').addEventListener('click', () => {
    toggleModal(false);
});



// Toast Functionality
// function showToast(message, type = 'success') {
//     const toastContainer = document.getElementById('toast-container');
//     const toast = document.createElement('div');
//     toast.className = `toast toast-${type} show`;
//     toast.innerText = message;

//     toastContainer.appendChild(toast);

//     // Automatically remove the toast after 3 seconds
//     setTimeout(() => {
//         toast.classList.remove('show');
//         setTimeout(() => toast.remove(), 300);
//     }, 3000);
// }


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

// const offCanvas = document.getElementById('offCanvas');
// offCanvas.classList.remove('hidden', '-translate-x-full'); 
// offCanvas.classList.add('collapsed');
// offCanvas.classList.remove('expanded');

// const expandOffCanvas = document.getElementById('expandOffCanvas');
// const collapseOffCanvas = document.getElementById('collapseOffCanvas');
// expandOffCanvas.addEventListener('click', function () {
//     offCanvas.classList.remove('collapsed');
//     offCanvas.classList.add('expanded');
//     expandOffCanvas.classList.add('hidden');
// });
// collapseOffCanvas.addEventListener('click', function () {
//     offCanvas.classList.add('collapsed');
//     offCanvas.classList.remove('expanded');
//     collapseOffCanvas.classList.add('hidden');
// });




// document.getElementById('hamburgerButton').addEventListener('click', () => {
//     const offCanvas = document.getElementById('offCanvas');
//     offCanvas.classList.remove('hidden', '-translate-x-full'); // Show the off-canvas menu
// });


// 현재 페이지 URL 가져오기
const currentPage = window.location.pathname.split("/").pop();

// 모든 GNB 메뉴 링크 가져오기
const menuLinks = document.querySelectorAll(".gnb-item");

// 모든 LNB 메뉴 링크 가져오기
const menuLinks2 = document.querySelectorAll(".menu-item");

// GNB의 1번 파일이 stati.html 의 경우 활성화 상태 설정
menuLinks2.forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
        menuLinks.forEach((link) => {
            if (link.getAttribute("href") === "stati.html") {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
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
            code: "Member Statistics",
            permissions: "Sales Statistics",
            logs: "Production Statistics",
            menu: "Sales Statistics",
            settings: "Performance",
        },
        breadcrumb: "Member Statistics",
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
            code: "회원통계",
            permissions: "매출통계",
            logs: "생산통계",
            menu: "판매통계",
            settings: "실적",
        },
        breadcrumb: "회원통계",
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
            code: "会員統計",
            permissions: "売上統計",
            logs: "生産統計",
            menu: "販売統計",
            settings: "業績",
        },
        breadcrumb: "会員統計",
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

});


// 로컬 스토리지에서 데이터 가져오기
function getDataFromLocalStorage() {

    fetch('assets/mock/stati.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('handsontableData', JSON.stringify(data));
            console.log(localStorage.getItem('handsontableData'));
        })
        .catch(error => {
            showToast('서버 데이타 로딩 중 오류 입니다.', 'error');
        });

    const data = localStorage.getItem('handsontableData');
    return data ? JSON.parse(data) : [];
}

// 로컬 스토리지에 데이터 저장하기
function saveDataToLocalStorage(data) {
    localStorage.setItem('handsontableData', JSON.stringify(data));
}

// 합계 행 계산
function calculateSumRow(data) {
    const sumRow = Array(12).fill(0);
    data.forEach(row => {
        row.slice(1).forEach((value, index) => {
            if (!isNaN(value)) {
                sumRow[index] += value;
            }
        });
    });
    return sumRow;
}

// 차트 업데이트
function updateChart(data) {
    const sumRow = calculateSumRow(data);
    const series = data.map(row => ({
        name: row[0],
        data: row.slice(1)
    }));
    series.push({
        name: '합계',
        data: sumRow
    });
    chart.updateSeries(series);
}

const container1 = document.getElementById('hot1');
const hot1 = new Handsontable(container1, {
    data: getDataFromLocalStorage(),
    colHeaders: ['item', '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],

    columns: [
        { data: 0, type: 'text', allowFillHandle: true }, // Enable fill for the 'item' column
        ...Array(12).fill({ type: 'numeric' })
    ],
    fillHandle: {
        autoInsertRow: true
    },
    colWidths: 110,
    rowHeights: 25,

    rowHeaders: true,
    filters: true,
    dropdownMenu: true,
    contextMenu: true,
    afterChange: function (changes, source) {
        if (source !== 'loadData') {
            const data = hot1.getData();
            const sumRow = calculateSumRow(data);
            hot2.loadData([sumRow]);
            updateChart(data);
            saveDataToLocalStorage(data);
        }
    },
    afterRemoveRow: function (index, amount) {
        const data = hot1.getData();
        const sumRow = calculateSumRow(data);
        hot2.loadData([sumRow]);
        updateChart(data);
        saveDataToLocalStorage(data);
    },
    licenseKey: 'non-commercial-and-evaluation' // 무료 버전 사용 시 필요
});

const container2 = document.getElementById('hot2');
const hot2 = new Handsontable(container2, {
    data: [calculateSumRow(getDataFromLocalStorage())],
    colHeaders: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    columns: Array(12).fill({ type: 'numeric', readOnly: true }),
    colWidths: 110,

    rowHeaders: false,
    licenseKey: 'non-commercial-and-evaluation' // 무료 버전 사용 시 필요
});

const chartOptions = {
    chart: {
        type: 'line',
        height: 350
    },
    series: [],
    xaxis: {
        categories: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
    },
    colors: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FF8C33', '#33FFF5', '#8C33FF', '#FF3333', '#33FF8C', '#FF5733', '#33A1FF', '#FF33FF', '#33FF33']
};

const chart = new ApexCharts(document.querySelector("#chart"), chartOptions);
chart.render();

// 초기 차트 데이터 설정
updateChart(getDataFromLocalStorage());

// document.getElementById('closeFloatingNav').addEventListener('click', () => {
//     const floatingNav = document.getElementById('floatingNav');
//     floatingNav.classList.add('hidden'); // Hide the floating menu
// });

/* gearIcon */
// const button = document.createElement('button');
// button.id = 'gearIcon';
// button.className = 'fixed bottom-4 right-4 bg-gray-800 text-white rounded-full p-3 shadow-lg z-50';
// const icon = document.createElement('i');
// icon.className = 'fas fa-globe';
// button.appendChild(icon);
// document.getElementById('buttonContainer').appendChild(button);
// document.getElementById('gearIcon').addEventListener('click', () => {
//     const floatingNav = document.getElementById('floatingNav');
//     floatingNav.classList.remove('hidden');
// });


