import { fetchPermissions, initPageUI } from './accessControl.js';

// 👉 전역 인스턴스로 저장
let leftGridApi = null;
let rightGridApi = null;

// 그리드_저장버튼
class createSaveRenderer {
    constructor(props) {
      const el = document.createElement('span');
      el.className = 'text-blue-900 rounded cursor-pointer flex items-center justify-center';
      el.innerHTML = '<i class="fas fa-save btn-save grid-renderer-button"></i>';
      el.style.display = 'inline-block';
      el.style.textAlign = 'center';
  
      el.addEventListener('click', (ev) => {
        if (!window.canSave) {
          ev.stopPropagation();
          showToast('저장 권한이 없습니다.', 'warning', 'ko');
          return;
        }
  
        const row = props.data;
        console.log('[SAVE]', row);
      });
  
      this.eGui = el; // <- 중요: getGui()가 반환할 요소 저장
    }
  
    getGui() {
      return this.eGui;
    }
  
    // 선택적으로 호출됨 (정리용)
    destroy() {
      // 필요 시 이벤트 제거 등
    }
}

// left그리드_컬럼설정
const columnDefs = [
    {
        headerName: 'No',
        valueGetter: 'node.rowIndex + 1',   //현재 행 번호 계산       
        width: 60,
        suppressSizeToFit: true,
        suppressMovable: true,   //사용자가 컬럼 드래그로 옮기지 못하게
        cellClass: 'text-center',
        sortable: false,        //정렬하지 않게
        filter: false 
    },
    {
        checkboxSelection: true,    //개별 행에 체크박스 표시
        headerCheckboxSelection: true,      //헤더에 전체 선택용 체크박스 표시       
        width: 50,
        suppressSizeToFit: true,       //해당 컬럼이 flex 조정에서 제외(너비 자동분배에서 제외)
        sortable: false,        //정렬하지 않게
        suppressMovable: true,
        filter: false  
    },
    { field: 'year', headerName: '년도', flex: 1 }, //flex: 너비 자동분배
    { field: 'qt', headerName: '분기', flex: 1 },
    { field: 'sdate', headerName: '설문시작일', flex: 1 },
    { field: 'edate', headerName: '설문종료일', flex: 1 },
    {
        headerName: '저장',
        field: 'saveBtn',
        cellRenderer: createSaveRenderer,
        width: 80
    }
];

//mockup 데이터
const rowData = [
    { year: "2024", qt: "1", sdate: "2024-01-10", edate: "2024-01-20", saveBtn: "저장" },
    { year: "2023", qt: "4", sdate: "2023-12-01", edate: "2023-12-15", saveBtn: "저장" }
];

//left그리드_옵션설정
const gridOptions = {
    columnDefs,     //컬럼 정의 배열
    rowData,        //그리드에 렌더링할 데이터
    rowSelection: 'multiple',     //다중 행 선택 허용(체크박스 선택이 제대로 동작하려면 필수)
    defaultColDef: {       // 모든 컬럼에 공통 적용할 기본 설정
        resizable: true,    // 마우스로 칼럼 너비 조절 가능
        sortable: true,     //칼럼 클릭시 정렬 가능
        filter: true       //컬럼에 필터 아이콘 및 필터 박스 추가
    },
    onGridReady: params => {
        leftGridApi = params.api;
    },
    animateRows: true  //행 이동 시 애니메이션 효과 추가
};
  
document.addEventListener('DOMContentLoaded', () => {
    // 탭 선택
    document.getElementsByClassName("tablinks")[0].click();

    // 설문지 관리_년도 콤보 생성
    fillYearCombo();
    
    // 설문지 관리_설문지 그리드 생성
    const gridDiv = document.getElementById('grid-left');
    agGrid.createGrid(gridDiv, gridOptions);

    fetchPermissions().then((permissions) => {
        initPageUI("btnContainer", {
            onSearch: loadSurveys,
            onAdd: addQuesionSurvey,
            onDelete: delQuesionSurvey,
            buttonOrder: ['search', 'add', 'delete'],
            permissions
        });
    });
});

// 👉 탭 전환 함수
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].classList.add('hidden');
    }
  
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].classList.remove('bg-blue-500', 'text-white');
    }
  
    document.getElementById(tabName).classList.remove('hidden');
    evt.currentTarget.classList.add('bg-blue-500', 'text-white');
}

// 연도 콤보 채우기
function fillYearCombo() {
    const yearSelect = document.getElementById('searchYear');

    // 전체 옵션 추가
    const allOption = document.createElement('option');
    allOption.value = '';
    allOption.text = '전체';
    yearSelect.appendChild(allOption);

    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= currentYear - 5; y--) {
        const option = document.createElement('option');
        option.value = y;
        option.text = `${y}년`;
        yearSelect.appendChild(option);
    }
    yearSelect.value = currentYear;
}

// leftGrid 목록 조회
function loadSurveys() {
    const year = document.getElementById('searchYear').value;
    const qt = document.getElementById('searchQt').value;
  console.log(leftGridApi);
    const query = new URLSearchParams({ year, qt });
    fetch(`${backendDomain}/api/surveys/survey/search?${query}`)
        .then(res => {
            if (!res.ok) {
            throw new Error(`서버 응답 오류: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            if (leftGridApi) {
            leftGridApi.setRowData(data); // ✅ AG Grid에서 row 갱신
            } else {
            console.warn('⚠️ leftGridApi가 초기화되지 않았습니다.');
            }
        })
        .catch(err => {
            console.error('❌ Fetch 오류:', err.message);
            alert('설문 데이터를 불러오는 중 오류가 발생했습니다.');
        });
}

function addQuesionSurvey(){

}

function delQuesionSurvey(){

}

const exports = {
    openTab
};

Object.entries(exports).forEach(([key, fn]) => {
    window[key] = fn;
});