const COMMON_BUTTON_BASE_CLASS = "items-center px-3 py-1 text-white rounded bg-gray-700 hover:bg-gray-600 space-x-2";

function createIconButton({
    iconClass,
    label,
    action,
    marginRight = true,
    className = COMMON_BUTTON_BASE_CLASS,
}) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = marginRight ? `${className} mr-2` : className;
    button.innerHTML = `<i class="${iconClass}"></i><span>${label}</span>`;

    if (action) {
        button.dataset.action = action;
    }

    return button;
}

function createSearchButton() {
    return createIconButton({
        iconClass: 'fas fa-search',
        label: '검색',
        action: 'search',
    });
}

function createAddButton() {
    return createIconButton({
        iconClass: 'fas fa-plus',
        label: '신규',
        action: 'add',
    });
}

function createDelButton() {
    return createIconButton({
        iconClass: 'fas fa-trash',
        label: '삭제',
        action: 'delete',
    });
}

function createCloseButton() {
    return createIconButton({
        iconClass: 'fas fa-times',
        label: '닫기',
        action: 'close',
        marginRight: false,
    });
}

function createSaveButton() {
    return createIconButton({
        iconClass: 'fas fa-save',
        label: '저장',
        action: 'save',
        marginRight: false,
    });
}

function createResetSearchButton() {
    return createIconButton({
        iconClass: 'fas fa-undo',
        label: '검색 초기화',
        action: 'reset-search',
        marginRight: false,
    });
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
            document: "문서분석",
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

function getTranslation(lang = 'ko') {
    const normalizedLanguage = (lang || 'ko').toLowerCase();

    return createTanslations[normalizedLanguage] || createTanslations.ko;
}

function setButtonDisabled(buttonElement, isDisabled = true) {
    if (!buttonElement) {
        return;
    }

    buttonElement.disabled = Boolean(isDisabled);
    buttonElement.style.opacity = isDisabled ? '0.5' : '1';
    buttonElement.style.cursor = isDisabled ? 'not-allowed' : 'pointer';
}


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
    RowNumRenderer,
    createIconButton,
    getTranslation,
    setButtonDisabled,
};
