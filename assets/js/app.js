
// const lang = localStorage.getItem('lang');
const currentPage = window.location.pathname.split("/").pop();
let rowsPerPage = 0;
let gridBodyHeight = 0;

if (currentPage.includes("stati")) {
    rowsPerPage = 15;
    gridBodyHeight = 430;
}
if (currentPage.includes("system")) {
    rowsPerPage = 20;
    gridBodyHeight = 620;
}

const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
const currentDate = new Date().toLocaleDateString('ko-KR', options).replace(/[\.]/g, '-').replace(/[\s]/g, '').substring(0, 10);

//fetch('https://your-backend-api.com/data')
fetch('assets/mock/mock.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        loadData(data);
        localStorage.setItem('gridData', JSON.stringify(data));
    })
    .catch(error => {

        showToast('loading-error', 'error', lang);

        const storedData = localStorage.getItem('gridData');
        if (storedData) {
            loadData(JSON.parse(storedData));
        } else {
            console.log('No data available in local storage');
        }
    });


// Function to load paginated data
function loadPageData(page, perPage) {
    const allData = loadData();
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return allData.slice(start, end);
}

// Function to update the total count display
function updateDataCount() {
    const allData = loadData();
    const dataCountElement = document.getElementById('dataCount');
    dataCountElement.textContent = `Total : ${allData.length}`;
}

// Function to load data from localStorage
function loadData() {
    const data = localStorage.getItem('gridData');
    return data ? JSON.parse(data) : [];
}

// Function to save data to localStorage
function saveData(data) {
    const filteredData = data.filter(row => row.tpCd && row.tpNm);
    localStorage.setItem('gridData', JSON.stringify(filteredData));
}

class BadgeRenderer {
    constructor(props) {
        const el = document.createElement('span');
        el.className = 'px-3 py-1 text-gray-700 rounded cursor-pointer flex items-center justify-center';
        el.innerHTML = '<i class="fas fa-pencil-alt"></i>'; // 연필 아이콘 (기본)
        el.style.display = 'inline-block';
        el.style.textAlign = 'center';
        this.el = el;
        this.props = props;
    }
    getElement() {
        return this.el;
    }
    render(props) {
        this.props = props;
    }
}


const grid = new tui.Grid({
    el: document.getElementById('grid'),
    rowHeaders: ['rowNum', 'checkbox'],
    editingEvent: 'click',
    scrollX: true,
    scrollY: true,
    bodyHeight: gridBodyHeight,
    pageOptions: {
        useClient: true,
        perPage: rowsPerPage
    },
    rowHeight: 42,
    minRowHeight: 42,
    columns: [
        { header: 'Key', name: 'Key', width: 250, align: 'left', sortable: true, resizable: true, width: 100, minWidth: 80 },
        { header: 'Group', name: 'tpCd', editor: 'text', validation: { required: true }, sortable: true, filter: 'text', resizable: true, width: 150 },
        { header: 'Name', name: 'tpNm', editor: 'text', sortable: true, filter: 'text', resizable: true, width: 200 },
        { header: 'Desc.', name: 'descCntn', editor: 'text', sortable: true, filter: 'text', resizable: true, },
        {
            header: 'UseYN', name: 'useYn', width: 100, align: 'center',
            editor: {
                type: 'select',
                options: { listItems: [{ text: 'Y', value: 'Y' }, { text: 'N', value: 'N' }] }
            },
            sortable: true,
            filter: {
                type: 'select',
                options: [
                    { text: 'All', value: '' },
                    { text: 'Y', value: 'Y' },
                    { text: 'N', value: 'N' }
                ]
            }
        },
        { header: 'CreateDT', name: 'createdAt', width: 150, align: 'center', sortable: true },
        {
            header: 'View',
            name: 'view',
            align: 'center',
            text: 'V',
            renderer: {
                type: BadgeRenderer
            },
            width: 60,
            resizable: false
        }
    ],
    data: loadPageData(1, rowsPerPage),
    columnOptions: {
        frozenCount: 2,
        frozenBorderWidth: 2
    },
    draggable: true
});


updateDataCount();

document.getElementById('delrow').addEventListener('click', function () {
    const chkArray = grid.getCheckedRowKeys();
    if (chkArray.length > 0) {
        grid.removeCheckedRows();
        saveData(grid.getData());
        showToast('select-delete', 'success', lang);
        updateDataCount();
    } else {
        showToast('delete-not', 'warning', lang);
    }
});

document.getElementById('saverow').addEventListener('click', function () {

    const data = grid.getData();
    // Filter out rows without a Key value
    const validData = data.filter(row => row.Key && row.Key.trim() !== '');

    // Save only rows with valid Key values
    saveData(validData);
    updateDataCount();

    console.log(" validData : " + JSON.stringify(validData));

    // Send the data to the backend API
    fetch('https://your-backend-api.com/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(validData)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            showToast('데이터가 성공적으로 저장되었습니다.');
        })
        .catch((error) => {
            console.error('Error:', error);
            showToast('로컬 스토리지에 저장 하였으나, 원격 서버 데이터 저장에 실패했습니다.', 'warning');

        });
});

// Add new row functionality
document.getElementById('newrow').addEventListener('click', function () {
    const data = grid.getData();
    const hasEmptyRow = data.some(row => row.tpCd === '' || row.tpNm === '');
    if (hasEmptyRow) {
        showToast('input-allowed', 'info', lang);
        return;
    }

    const newRow = { Key: generateUUID(), tpCd: '', tpNm: '', descCntn: '', useYn: 'Y', createdAt: currentDate };
    grid.prependRow(newRow, { focus: true });

    saveData([...data, newRow]);
    updateDataCount();
});

// Handle View Button Click in Grid
grid.on('click', (ev) => {
    const { columnName, rowKey } = ev;

    console.log("rowKey : " + rowKey);

    if (columnName === 'view') {
        const row = grid.getRow(rowKey); // Get the row data
        toggleModal(true, row, rowKey); // Pass the row data and row key to the modal
    }

    if (ev.columnName === 'Key') {
        showToast('자동 부여 Key 로 편집 불가 합니다.', 'info');
    }
});

// 신규 입력 가능한 셀에 placeholder 설정
grid.on('editingStart', (ev) => {

    showToast('데이타 입력/수정 가능 합니다.', 'info');

});

grid.on('editingFinish', (ev) => {
    saveData(grid.getData());
    showToast('데이타를 자동 저장하였습니다.', 'info');

});


// Initialize a new row
function initNew() {
    const rowData = { Key: generateUUID(), tpCd: '', tpNm: '', descCntn: '', useYn: 'Y', createdAt: currentDate };
    grid.prependRow(rowData, { focus: true });

    updateDataCount();
}

initNew();

new Pikaday({
    field: document.getElementById('datePicker'),
    format: 'YYYY-MM-DD',
    toString(date, format) {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
    }
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
// document.getElementById('closeModalTopRight').addEventListener('click', () => {
//     toggleModal(false);
// });

// Add event listener for the bottom close button
// document.getElementById('closeModal').addEventListener('click', () => {
//     toggleModal(false);
// });

let currentRowKey = null; // To track the current row being edited

function toggleModal(show, rowData = {}, rowKey = null) {
    const modal = document.getElementById('modal');
    const modalForm = document.getElementById('modalForm');
    currentRowKey = rowKey; // Store the row key

    if (show) {
        // Clear the form
        modalForm.innerHTML = '';

        // Populate the form with row data
        for (const [key, value] of Object.entries(rowData)) {
            const formGroup = document.createElement('div');
            formGroup.className = 'flex flex-col';

            const label = document.createElement('label');
            label.className = 'text-sm  text-gray-700';
            label.textContent = key;

            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'border rounded px-3 py-2 mt-1 text-gray-900';
            input.name = key;
            input.value = value;

            formGroup.appendChild(label);
            formGroup.appendChild(input);
            modalForm.appendChild(formGroup);
        }

        modal.classList.remove('hidden'); // Show modal
    } else {
        modal.classList.add('hidden'); // Hide modal
    }
}


document.getElementById('searchByDate').addEventListener('click', function () {

    const gridData = loadData();

    const selectedDate = document.getElementById('datePicker').value;
    const groupCode = document.getElementById('groupCode').value.toLowerCase();
    const codeName = document.getElementById('codeName').value.toLowerCase();
    const description = document.getElementById('description').value.toLowerCase();



    const filteredData = gridData.filter(row => {
        const matchesDate = selectedDate ? row.createdAt === selectedDate : true;
        const matchesGroupCode = groupCode ? row.tpCd.toLowerCase().includes(groupCode) : true;
        const matchesCodeName = codeName ? row.tpNm.toLowerCase().includes(codeName) : true;
        const matchesDescription = description ? row.descCntn.toLowerCase().includes(description) : true;
        return matchesDate && matchesGroupCode && matchesCodeName && matchesDescription;
    });

    grid.resetData(filteredData);

    document.getElementById('saverow').disabled = true;
    document.getElementById('saverow').classList.add('bg-gray-400', 'cursor-not-allowed');
    document.getElementById('saverow').classList.remove('bg-gray-700', 'hover:bg-gray-600');

    document.getElementById('newrow').disabled = true;
    document.getElementById('newrow').classList.add('bg-gray-400', 'cursor-not-allowed');
    document.getElementById('newrow').classList.remove('bg-gray-700', 'hover:bg-gray-600');

    showToast('검색 클릭 시 신규, 저장 기능은 비활성화 됩니다.');

});

document.getElementById('resetSearch').addEventListener('click', function () {

    const gridData = loadData();

    // Reset search fields
    document.getElementById('groupCode').value = '';
    document.getElementById('codeName').value = '';
    document.getElementById('description').value = '';
    document.getElementById('datePicker').value = '';

    // Reset grid data
    grid.resetData(gridData);

    // Enable the Save button
    const saveButton = document.getElementById('saverow');
    saveButton.disabled = false;
    saveButton.classList.remove('bg-gray-400', 'cursor-not-allowed');
    saveButton.classList.add('bg-gray-700', 'hover:bg-gray-600');


    const newButton = document.getElementById('newrow');
    newButton.disabled = false;
    newButton.classList.remove('bg-gray-400', 'cursor-not-allowed');
    newButton.classList.add('bg-gray-700', 'hover:bg-gray-600');

    showToast('신규, 저장 기능이 활성화 됩니다.');
});

const rows = document.querySelectorAll('.tui-grid-rside-area .tui-grid-body-tbody tr');
if (rows.length > 0) {
    const lastRow = rows[rows.length - 1];
    lastRow.style.backgroundColor = '#fff'; // 마지막 행의 배경색
    lastRow.style.borderBottom = '1px solid #8f8f8f'; // 마지막 행의 테두리 색
}



const menuLinks = document.querySelectorAll(".gnb-item");
menuLinks.forEach((link) => {

    if (link.getAttribute("href") === currentPage) {
        console.log(currentPage);
        link.classList.add("active");
    } else {
        link.classList.remove("active");
    }
});

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
            code: "Code",
            permissions: "Permissions",
            logs: "Logs",
            menu: "Menu",
            settings: "Settings",
            stati: "Member Statistics",
            flow: "Sales Statistics",
            chain: "Chain Operation",
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
            code: "입출고관리",
            permissions: "권한관리",
            logs: "로그관리",
            menu: "메뉴관리",
            settings: "설정관리",
            stati: "회원통계",
            flow: "매출통계",
            chain: "체인운영",
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
            code: "コード管理",
            permissions: "権限管理",
            logs: "ログ管理",
            menu: "メニュー管理",
            settings: "設定管理",
            stati: "会員統計",
            flow: "売上統計",
            chain: "チェーン運営",
            system: "コード管理",
            orgtree: "権限管理",
            document: "文書管理",
            wms: "WMS",
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


const languageSwitcher = document.getElementById("languageSwitcher");
const breadcrumb = document.querySelector(".breadcrumb");
const buttons = document.querySelectorAll("#content button span");
const tabs = document.querySelectorAll(".tabs li a span");
const offCanvasItems = document.querySelectorAll("#offCanvas .menu-item span");


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
    if (currentPage.includes("stati")) {
        offCanvasItems[0].textContent = offCanvasLabels.stati;
    }
    if (currentPage.includes("system")) {
        offCanvasItems[0].textContent = offCanvasLabels.system;
    }
    offCanvasItems[1].textContent = offCanvasLabels.flow;
    offCanvasItems[2].textContent = offCanvasLabels.chain;
    offCanvasItems[3].textContent = offCanvasLabels.config;

    if (currentPage.includes("stati")) {
        breadcrumb.textContent = offCanvasLabels.stati;
    } else if (currentPage.includes("flow")) {
        breadcrumb.textContent = offCanvasLabels.flow;
    } else if (currentPage.includes("chain")) {
        breadcrumb.textContent = offCanvasLabels.chain;
    } else if (currentPage.includes("system")) {
        breadcrumb.textContent = offCanvasLabels.system;
    } else {
        breadcrumb.textContent = offCanvasLabels.config;
    }

    // 버튼 텍스트 변경
    const buttonLabels = translations[lang].buttons;
    buttons[0].textContent = buttonLabels.search;
    buttons[1].textContent = buttonLabels.reset;
    buttons[2].textContent = buttonLabels.new;
    buttons[3].textContent = buttonLabels.delete;
    buttons[4].textContent = buttonLabels.save;

});


document.addEventListener('DOMContentLoaded', () => {
    const appBrand = new AppBrand('logo', 'EDUMGT');
    //const lang = localStorage.getItem('lang');

    const tabLabels = translations[lang].tabs;
    tabs[0].textContent = tabLabels.system;
    tabs[1].textContent = tabLabels.organization;
    tabs[2].textContent = tabLabels.task;
    tabs[3].textContent = tabLabels.schedule;
    tabs[4].textContent = tabLabels.statistics;
    tabs[5].textContent = tabLabels.settings;

    const offCanvasLabels = translations[lang].offCanvas;
    if (currentPage.includes("stati")) {
        offCanvasItems[0].textContent = offCanvasLabels.stati;
    }
    if (currentPage.includes("system")) {
        offCanvasItems[0].textContent = offCanvasLabels.system;
    }
    offCanvasItems[1].textContent = offCanvasLabels.flow;
    offCanvasItems[2].textContent = offCanvasLabels.chain;


    if (currentPage.includes("stati")) {
        breadcrumb.textContent = offCanvasLabels.stati;
    } else if (currentPage.includes("flow")) {
        breadcrumb.textContent = offCanvasLabels.flow;
    } else if (currentPage.includes("chain")) {
        breadcrumb.textContent = offCanvasLabels.chain;
    } else if (currentPage.includes("system")) {
        breadcrumb.textContent = offCanvasLabels.system;
    } else {
        breadcrumb.textContent = offCanvasLabels.config;
    }

    // 버튼 텍스트 변경
    const buttonLabels = translations[lang].buttons;
    buttons[0].textContent = buttonLabels.search;
    buttons[1].textContent = buttonLabels.reset;
    buttons[2].textContent = buttonLabels.new;
    buttons[3].textContent = buttonLabels.delete;
    buttons[4].textContent = buttonLabels.save;
});