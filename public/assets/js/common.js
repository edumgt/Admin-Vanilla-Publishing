const COMMON_BUTTON_BASE_CLASS = "items-center px-3 py-1 text-white rounded bg-gray-700 hover:bg-gray-600 space-x-2";
const DEFAULT_API_ORIGIN = window.location.origin && window.location.origin !== "null"
    ? window.location.origin
    : "http://localhost:8000";
const API_BASE = window.APP_API_BASE || DEFAULT_API_ORIGIN;
window.APP_API_BASE = API_BASE;

function buildApiUrl(path = "") {
    if (!path) {
        return API_BASE;
    }
    return new URL(path, API_BASE).toString();
}

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
            system:       "AI Market",
            organization: "Schedule",
            task:         "Financials",
            schedule:     "Investment Info",
            statistics:   "Data Mgmt",
            settings:     "Settings",
        },
        offCanvas: {
            aistock:   "AI Company Info",
            ceodirary: "CEO Diary",
            calendar:  "Earnings Calendar",
            timeline:  "Event Timeline",
            trello:    "Research Tasks",
            flow:      "Financial Analysis",
            stati:     "Market Statistics",
            chain:     "Sector / Supply Chain",
            glos:      "Investment Glossary",
            document:  "News Doc Analysis",
            system:    "Ticker Code Mgmt",
            orgtree:   "Permission Mgmt",
        },
        buttons: {
            search: "Search",
            reset:  "Reset Search",
            new:    "New",
            delete: "Delete",
            save:   "Save",
        },
    },
    ko: {
        menu: "메뉴",
        tabs: {
            system:       "AI·시장분석",
            organization: "일정·이벤트",
            task:         "재무·통계",
            schedule:     "투자정보",
            statistics:   "데이터관리",
            settings:     "설정관리",
        },
        offCanvas: {
            aistock:   "AI기업정보",
            ceodirary: "CEO 다이어리",
            calendar:  "실적·이벤트 일정",
            timeline:  "이벤트 타임라인",
            trello:    "리서치 태스크",
            flow:      "매출·재무분석",
            stati:     "시장통계",
            chain:     "섹터·공급망",
            glos:      "투자 용어사전",
            document:  "뉴스 문서분석",
            system:    "종목 코드 관리",
            orgtree:   "권한관리",
        },
        buttons: {
            search: "검색",
            reset:  "검색 초기화",
            new:    "신규",
            delete: "삭제",
            save:   "저장",
        },
    },
    ja: {
        menu: "メニュー",
        tabs: {
            system:       "AI·市場分析",
            organization: "スケジュール",
            task:         "財務·統計",
            schedule:     "投資情報",
            statistics:   "データ管理",
            settings:     "設定管理",
        },
        offCanvas: {
            aistock:   "AI企業情報",
            ceodirary: "CEOダイアリー",
            calendar:  "決算カレンダー",
            timeline:  "イベントタイムライン",
            trello:    "リサーチタスク",
            flow:      "財務分析",
            stati:     "市場統計",
            chain:     "セクター·サプライチェーン",
            glos:      "投資用語集",
            document:  "ニュース文書分析",
            system:    "銘柄コード管理",
            orgtree:   "権限管理",
        },
        buttons: {
            search: "検索",
            reset:  "検索をリセット",
            new:    "新規",
            delete: "削除",
            save:   "保存",
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
    API_BASE,
    buildApiUrl,
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
