function createSearchButton() {
    const searchButton = document.createElement('button');
    searchButton.className = "items-center px-3 py-1 text-white rounded bg-gray-700 hover:bg-gray-600 space-x-2 mr-2";
    searchButton.innerHTML = `<i class="fas fa-search"></i><span>검색</span>`;

    return searchButton;
}

function createAddButton() {
    const addButton = document.createElement('button');
    addButton.className = "items-center px-3 py-1 text-white rounded bg-gray-700 hover:bg-gray-600 space-x-2 mr-2";
    addButton.innerHTML = `<i class="fas fa-plus"></i><span>신규</span>`;

    return addButton;
}

function createDelButton() {
    const deleteButton = document.createElement('button');
    deleteButton.className = "items-center px-3 py-1 text-white rounded bg-gray-700 hover:bg-gray-600 space-x-2 mr-2";
    deleteButton.innerHTML = `<i class="fas fa-trash"></i><span>삭제</span>`;

    return deleteButton;
}

function createCloseButton() {
    const closeButton = document.createElement('button');
    closeButton.className = "items-center px-3 py-1 text-white rounded bg-gray-700 hover:bg-gray-600 space-x-2";
    closeButton.innerHTML = `<i class="fas fa-times"></i><span>닫기</span>`;

    return closeButton;
}

function createSaveButton() {
    const saveButton = document.createElement('button');
    saveButton.className = "items-center px-3 py-1 text-white rounded bg-gray-700 hover:bg-gray-600 space-x-2";
    saveButton.innerHTML = `<i class="fas fa-save"></i><span>저장</span>`;

    return saveButton;
}

function createResetSearchButton() {
    const resetSearchButton = document.createElement('button');
    resetSearchButton.className = "items-center px-3 py-1 text-white rounded bg-gray-700 hover:bg-gray-600 space-x-2";
    resetSearchButton.innerHTML = `<i class="fas fa-undo"></i><span>검색 초기화</span>`;

    return resetSearchButton;
}


const createTanslations = {
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
            glos: "Dict. Management",
            orgtree: "Permission Management",
            document: "Document Management",
            wms: "WMS",
            config: "System log",
            network: "Consultant",

            locker: "Locker",

            survey: "Survey",
            work: "Reservation Management",
            meeting: "Meeting Room Management",
            hospital: "Hospital Reservation",
            lectures: "Lecture Schedule",
            city: "District Information",



            stati: "Member Statistics",
            flow: "Sales Statistics",
            chain: "Chain Operation",

            calendar: "Work Schedule",
            trello: "Project Schedule",
            timeline: "Production Schedule",
            orgni: "Organization Structure",
            attend: "Attendance Management",
            total: "Incentive",

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
            glos: "용어관리",
            orgtree: "권한관리",
            document: "문서관리",
            wms: "WMS",
            config: "시스템 로그",

            locker: "사물함",

            network: "컨설팅 지정",
            survey: "서베이",
            work: "예약관리",
            meeting: "회의실관리",
            hospital: "병원예약",

            lectures: "강의일정",
            city: "행정구역정보",



            stati: "회원통계",
            flow: "매출통계",
            chain: "체인운영",

            calendar: "업무일정",
            trello: "프로젝트일정",
            timeline: "생산일정",
            orgni: "조직도구성",
            attend: "근태관리",

            total: "인센티브",



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
            glos: "Dict. 管理",
            orgtree: "権限管理",
            document: "文書管理",
            wms: "WMS",
            config: "システムログ",
            network: "コンサルティングの指定",

            locker: "사물함",

            survey: "サーベイ",
            work: "予約管理",
            meeting: "会議室管理",
            hospital: "病院予約",
            lectures: "講義日程",
            city: "行政区情報",


            stati: "会員統計",
            flow: "売上統計",
            chain: "チェーン運営",

            calendar: "業務日程",
            trello: "プロジェクト日程",
            timeline: "生産日程",
            orgni: "組織構成",
            attend: "勤怠管理",
            total: "インセンティブ"
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


class createBadgeRenderer {
    constructor(props) {
        const el = document.createElement('span');
        el.className = 'text-blue-900 rounded cursor-pointer flex items-center justify-center';
        el.innerHTML = '<i class="fas fa-pencil-alt"></i>';
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
    
        // rowKey, grid
        const { rowKey, grid } = props;
        // 해당 행 전체 데이터
        const rowData = grid.getRow(rowKey);
    
        // (핵심) id 유무에 따라 disabled
        if (!rowData.id) {
          // id == null, undefined, 0 등 falsy
          this.el.style.pointerEvents = 'none'; // 클릭 불가
          this.el.style.opacity = '0.5';       // 반투명
        } else {
          this.el.style.pointerEvents = 'auto'; // 클릭 가능
          this.el.style.opacity = '1';          // 완전 표시
        }
      }
}

class createSaveRenderer {
    constructor(props) {
      // 1) span or div 생성
      const el = document.createElement('span');
      // 2) 원하는 스타일/클래스
      el.className = 'text-blue-900 rounded cursor-pointer flex items-center justify-center';
      el.innerHTML = '<i class="fas fa-save"></i>'; // 저장 아이콘 (fa-save)
      
      el.style.display = 'inline-block';
      el.style.textAlign = 'center';
  
      this.el = el;
      this.props = props;
    }
  
    // TUI Grid에서 DOM 엘리먼트를 얻을 때 사용
    getElement() {
      return this.el;
    }
  
    render(props) {
        this.props = props;
    
        // rowKey, grid
        const { rowKey, grid } = props;
        // 해당 행 전체 데이터
        const rowData = grid.getRow(rowKey);
    
        // (핵심) id 유무에 따라 disabled
        if (!rowData.id) {
          // id == null, undefined, 0 등 falsy
          this.el.style.pointerEvents = 'none'; // 클릭 불가
          this.el.style.opacity = '0.5';       // 반투명
        } else {
          this.el.style.pointerEvents = 'auto'; // 클릭 가능
          this.el.style.opacity = '1';          // 완전 표시
        }
      }
  }

  
  
  class RowNumRenderer {
    constructor(props) {
      const el = document.createElement('span');
      this.el = el;
  
      const { grid, rowKey } = props;
      const row = grid.getRow(rowKey);
      const allRows = grid.getData();
      const rowIndex = allRows.findIndex(r => r.rowKey === rowKey);
  
      if (row?.tpCd === '' && row?.tpNm === '') {
        el.innerText = 'New';
        el.style.color = "#ee3333";
      } else {
        el.innerText = String(rowIndex + 1); // ✅ 항상 1부터 시작
      }
    }
  
    getElement() {
      return this.el;
    }
  }
  
  


export {
    createAddButton,
    createDelButton,
    createCloseButton,
    createSaveButton,
    createSearchButton,
    createResetSearchButton,
    createTanslations,
    createBadgeRenderer,
    createSaveRenderer,
    RowNumRenderer
};
