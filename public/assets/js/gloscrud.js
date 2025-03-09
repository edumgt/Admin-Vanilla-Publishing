import {
    createAddButton,
    createDelButton,
    createSaveButton,
    createSearchButton,
    createResetSearchButton,
    createTanslations,
    createBadgeRenderer,
    createSaveRenderer
} from './common.js';

let rowsPerPage = 1000;
let gridBodyHeight = 630;

const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
const currentDate = new Date().toLocaleDateString('ko-KR', options).replace(/[\.]/g, '-').replace(/[\s]/g, '').substring(0, 10);

fetch('/api/glos')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        loadData(data);
        localStorage.setItem('glosCrudData', JSON.stringify(data));
    })
    .catch(error => {

        showToast('loading-error', 'error', lang);

        const storedData = localStorage.getItem('glosCrudData');
        if (storedData) {
            loadData(JSON.parse(storedData));
        } else {
            console.log('No data available in local storage');
        }
    });

function loadPageData(page, perPage) {
    const allData = loadData();
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return allData.slice(start, end);
}

function updateDataCount() {
    const allData = loadData();
    const dataCountElement = document.getElementById('dataCount');
    dataCountElement.textContent = `Total : ${allData.length}`;
}

function loadData() {
    const data = localStorage.getItem('glosCrudData');
    return data ? JSON.parse(data) : [];
}

function saveData(data) {
    // const filteredData = data.filter(row => row.tpCd && row.tpNm);
    // localStorage.setItem('glosCrudData', JSON.stringify(filteredData));
}


const BadgeRenderer = createBadgeRenderer;
const SaveRenderer = createSaveRenderer;

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
        { header: 'Key', name: 'id', width: 250, align: 'left', sortable: true, resizable: true, width: 100, minWidth: 80 },
        { header: '영문단어', name: 'en', editor: 'text', validation: { required: true }, sortable: true, filter: 'text', resizable: true, width: 150 },
        { header: '한글', name: 'ko', editor: 'text', sortable: true, filter: 'text', resizable: true, width: 200 },
        { header: '설명', name: 'desc', editor: 'text', sortable: true, filter: 'text', resizable: true, },
        { header: 'Image', name: 'img', editor: 'text', sortable: true, filter: 'text', resizable: true, width: 200 },

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
        },
        {
            header: 'Save',
            name: 'save',
            align: 'center',
            width: 60,
            resizable: false,
            // (옵션) 직접 렌더러 사용 가능. 아래는 간단히 'S' 표시
            renderer: {
              type: SaveRenderer // 이미 사용 중인 함수 재활용 가능
            }
          }
          
    ],
    data: loadPageData(1, rowsPerPage),
    columnOptions: {
        frozenCount: 2,
        frozenBorderWidth: 2
    }
});


updateDataCount();

const deleteButton = createDelButton();
deleteButton.addEventListener('click', function () {
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


const saveButton = createSaveButton();
saveButton.addEventListener('click', function () {
    const data = grid.getData();
    const validData = data.filter(row => row.Key && row.Key.trim() !== '');

    saveData(validData);
    updateDataCount();

    fetch('https://your-backend-api.com/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(validData)
    })
        .then(response => response.json())
        .then(data => {
            showToast('well-done', 'success', lang);
        })
        .catch((error) => {
            showToast('save-error', 'warning', lang);

        });
});


const addButton = createAddButton();
addButton.addEventListener('click', function () {
    const data = grid.getData();
    const hasEmptyRow = data.some(row => row.tpCd === '' || row.tpNm === '');
    if (hasEmptyRow) {
        showToast('input-allowed', 'info', lang);
        return;
    }

    const newRow = { Key: generateNanoId(), tpCd: '', tpNm: '', descCntn: '', useYn: 'Y', createdAt: currentDate };
    grid.prependRow(newRow, { focus: true });

    saveData([...data, newRow]);
    updateDataCount();
});

const searchButton = createSearchButton();
btnContainer.appendChild(searchButton);

btnContainer.appendChild(addButton);
btnContainer.appendChild(deleteButton);
btnContainer.appendChild(saveButton);

const resetSearchButton = createResetSearchButton();
resetSearchButton.classList.add("ml-2")
btnContainer.appendChild(resetSearchButton);


grid.on('click', (ev) => {
    const { columnName, rowKey } = ev;
    if (columnName === 'view') {
        const row = grid.getRow(rowKey);
        toggleModal(true, row, rowKey);
    }

    if (ev.columnName === 'Key') {
        showToast('auto-key', 'info', lang);
    }

    if (columnName === 'save') {
        const rowData = grid.getRow(rowKey);
        // 실제로 DB UPDATE를 보내는 함수
        saveRowEdit(rowData);
      }
});


grid.on('editingStart', (ev) => {
    showToast('data-possible', 'info', lang);
});

grid.on('editingFinish', (ev) => {
    saveData(grid.getData());
    showToast('auto-save', 'info', lang);
});


function initNew() {
    const rowData = { Key: generateNanoId(), tpCd: '', tpNm: '', descCntn: '', useYn: 'Y', createdAt: currentDate };
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

    for (const [key, value] of formData.entries()) {
        updatedData[key] = value;
    }

    if (currentRowKey !== null) {
        grid.setValue(currentRowKey, 'tpCd', updatedData.tpCd);
        grid.setValue(currentRowKey, 'tpNm', updatedData.tpNm);
        grid.setValue(currentRowKey, 'descCntn', updatedData.descCntn);
        grid.setValue(currentRowKey, 'useYn', updatedData.useYn);
    }

    toggleModal(false);
    saveData(grid.getData());
    showToast('well-done', 'success', lang);
});

let currentRowKey = null;

function toggleModal(show, rowData = {}, rowKey = null) {
    const modal = document.getElementById('modal');
    const modalForm = document.getElementById('modalForm');
    currentRowKey = rowKey;

    if (show) {
        // 모달 열기 전에, 기존 내용 비움
        modalForm.innerHTML = '';

        for (const [key, value] of Object.entries(rowData)) {
            // (1) formGroup 생성
            const formGroup = document.createElement('div');
            formGroup.className = 'flex flex-col';

            // (2) label
            const label = document.createElement('label');
            label.className = 'text-sm text-gray-700';
            label.textContent = key; // 예: 'img', 'desc' 등

            // (3) input (text) - 기본적으로 rowData[key]를 표시
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'border rounded px-3 py-2 mt-1 text-gray-900';
            input.name = key;
            input.value = value || '';

            formGroup.appendChild(label);
            formGroup.appendChild(input);

            // (4) 추가: 만약 key가 'img'라면, 아래에 실제 이미지 태그를 추가
            if (key === 'img') {
                // 이미지 미리보기
                const imgPreview = document.createElement('img');
                imgPreview.style.width = '300px';  // 적절한 크기로
                imgPreview.style.height = 'auto';
                imgPreview.style.marginTop = '0.5rem';
                // img src 할당 (없으면 빈 값)
                imgPreview.src = value || '';

                // formGroup에 이미지 태그도 함께 넣기
                formGroup.appendChild(imgPreview);
            }

            modalForm.appendChild(formGroup);
        }

        // 모달 열기
        modal.classList.remove('hidden');
    } else {
        // 모달 닫기
        modal.classList.add('hidden');
    }
}



searchButton.addEventListener('click', function () {

    const gridData = loadData();

    // 2) 검색창 값 읽기 (소문자로 변환)
    const enVal = document.getElementById('en').value.toLowerCase().trim();
    const koVal = document.getElementById('ko').value.toLowerCase().trim();
    const descVal = document.getElementById('desc').value.toLowerCase().trim();

    const selectedDate = document.getElementById('datePicker').value;
    const filteredData = gridData.filter(row => {
        // row.en, row.ko, row.desc가 존재해야 함
        // (row.en이 없는 경우도 있을 수 있으니, 대비로 ''+row.en 처리하기도 함)
        const enMatch = enVal ? (row.en || '').toLowerCase().includes(enVal) : true;
        const koMatch = koVal ? (row.ko || '').toLowerCase().includes(koVal) : true;
        const descMatch = descVal ? (row.desc || '').toLowerCase().includes(descVal) : true;
        return enMatch && koMatch && descMatch;
    });



    grid.resetData(filteredData);

    saveButton.disabled = true;
    saveButton.classList.add('bg-gray-400', 'cursor-not-allowed');
    saveButton.classList.remove('bg-gray-700', 'hover:bg-gray-600');

    addButton.disabled = true;
    addButton.classList.add('bg-gray-400', 'cursor-not-allowed');
    addButton.classList.remove('bg-gray-700', 'hover:bg-gray-600');

    showToast('search-click', 'info', lang);

});

resetSearchButton.addEventListener('click', function () {

    const gridData = loadData();

    document.getElementById('en').value = '';
    document.getElementById('ko').value = '';
    document.getElementById('desc').value = '';
    document.getElementById('datePicker').value = '';

    grid.resetData(gridData);

    saveButton.disabled = false;
    saveButton.classList.remove('bg-gray-400', 'cursor-not-allowed');
    saveButton.classList.add('bg-gray-700', 'hover:bg-gray-600');

    addButton.disabled = false;
    addButton.classList.remove('bg-gray-400', 'cursor-not-allowed');
    addButton.classList.add('bg-gray-700', 'hover:bg-gray-600');

    showToast('new-save', 'info', lang);
});

const rows = document.querySelectorAll('.tui-grid-rside-area .tui-grid-body-tbody tr');
if (rows.length > 0) {
    const lastRow = rows[rows.length - 1];
    lastRow.style.backgroundColor = '#fff';
    lastRow.style.borderBottom = '1px solid #8f8f8f';
}

function saveRowEdit(rowData) {
    // rowData 예: { id, en, ko, desc, img, createdAt, ... }
    if (!rowData.id) {
      alert("id가 없습니다. 저장 불가");
      return;
    }
  
    fetch("/api/glos/" + rowData.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        en: rowData.en,
        ko: rowData.ko,
        desc: rowData.desc,
        img: rowData.img
      })
    })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          alert("DB 업데이트 성공: " + JSON.stringify(rowData));
        } else {
          alert("DB 업데이트 실패: " + result.message);
        }
      })
      .catch(err => {
        console.error("업데이트 에러:", err);
        alert("업데이트 중 오류가 발생했습니다.");
      });
  }
  
  

