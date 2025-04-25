// 📁 common.js

// 버튼 하나를 만드는 핵심 함수 - 커스터마이징 기능 추가
export function createButton({
                                 icon,
                                 label,
                                 className = "",
                                 onClick = null,
                                 allowed = true,
                                 id = null,
                                 customText = null
                             }) {
    const button = document.createElement("button");

    // ID 설정 (필요한 경우)
    if (id) {
        button.id = id;
    }

    // 공통 기본 클래스
    button.className = className || "items-center px-3 py-1 text-white rounded space-x-2 mr-2";

    // HTML 내용 설정 (customText가 있으면 그대로 사용, 없으면 아이콘+라벨 조합)
    if (customText) {
        button.innerHTML = customText;
    } else {
        button.innerHTML = `<i class="${icon}"></i><span>${label}</span>`;
    }

    // 권한에 따라 스타일 및 동작 제어
    if (!allowed) {
        button.classList.add('bg-gray-300', 'cursor-not-allowed');
        button.classList.remove('bg-gray-700', 'hover:bg-gray-600');
        button.disabled = true;
    } else {
        button.classList.add('bg-gray-700', 'hover:bg-gray-600');
        button.disabled = false;
        if (onClick) {
            button.addEventListener('click', onClick);
        }
    }

    return button;
}

// 버튼별로 쉽게 만드는 래퍼 함수 - 옵션 추가
function createSearchButton(allowed = true, onClick = null, options = {}) {
    // 옵션에서 icon을 제외한 나머지 속성을 추출
    const { icon, ...restOptions } = options;

    // 모든 속성을 createButton에 전달
    return createButton({
        icon: typeof icon !== 'undefined' ? icon : "fas fa-search",
        label: "검색",
        allowed,
        onClick,
        ...restOptions
    });
}

function createAddButton(allowed = true, onClick = null, options = {}) {
    const { icon, ...restOptions } = options;

    return createButton({
        icon: typeof icon !== 'undefined' ? icon : "fas fa-plus",
        label: "신규",
        allowed,
        onClick,
        ...restOptions
    });
}

function createDelButton(allowed = true, onClick = null, options = {}) {
    const { icon, ...restOptions } = options;

    return createButton({
        icon: typeof icon !== 'undefined' ? icon : "fas fa-trash",
        label: "삭제",
        allowed,
        onClick,
        ...restOptions
    });
}

function createCloseButton(allowed = true, onClick = null, options = {}) {
    const { icon, ...restOptions } = options;

    return createButton({
        icon: typeof icon !== 'undefined' ? icon : "fas fa-times",
        label: "닫기",
        allowed,
        onClick,
        ...restOptions
    });
}

function createSaveButton(allowed = true, onClick = null, options = {}) {
    const { icon, ...restOptions } = options;

    return createButton({
        icon: typeof icon !== 'undefined' ? icon : "fas fa-save",
        label: "저장",
        allowed,
        onClick,
        ...restOptions
    });
}

function createResetSearchButton(allowed = true, onClick = null, options = {}) {
    const { icon, ...restOptions } = options;

    return createButton({
        icon: typeof icon !== 'undefined' ? icon : "fas fa-undo",
        label: "검색 초기화",
        allowed,
        onClick,
        ...restOptions
    });
}

// 추가: 새로고침 버튼 생성 함수
function createRefreshButton(allowed = true, onClick = null, options = {}) {
    const { icon, ...restOptions } = options;

    return createButton({
        icon: typeof icon !== 'undefined' ? icon : "fas fa-sync-alt",
        label: "새로고침",
        allowed,
        onClick,
        ...restOptions
    });
}

// 추가: 커스텀 버튼 생성 함수
function createCustomButton(iconClass, label, allowed = true, onClick = null, options = {}) {
    const { icon, ...restOptions } = options;

    // 우선순위: options.icon > iconClass 파라미터
    const finalIcon = typeof icon !== 'undefined' ? icon : (iconClass || "");

    return createButton({
        icon: finalIcon,
        label,
        allowed,
        onClick,
        ...restOptions
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
        el.innerHTML = '<i class="fas fa-pencil-alt btn-view grid-renderer-button"></i>';
        el.style.display = 'inline-block';
        el.style.textAlign = 'center';

        el.addEventListener('click', (ev) => {
            if (!window.canView) {
                ev.stopPropagation();
                showToast('보기 권한이 없습니다.', 'warning', 'ko');
                return;
            }
        });

        this.el = el;
        this.props = props;
    }
    getElement() {
        return this.el;
    }
}

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
        });

        this.el = el;
        this.props = props;
    }

    getElement() {
        return this.el;
    }
}

export function createDropZoneWithPermission({
                                                 fromGridApi,
                                                 toGridApi,
                                                 direction,
                                                 moveRows,
                                                 canDrag = () => window.canEdit // 기본값으로 공통 권한 사용
                                             }) {
    return toGridApi.getRowDropZoneParams({
        onDragStop: event => {
            if (!canDrag()) {
                showToast('드래그 권한이 없습니다.', 'warning', 'ko');
                return;
            }

            const dragged = event.node.data;
            const selected = fromGridApi.getSelectedRows();
            const isMulti = selected.length > 1 && selected.some(r => r.groupcode === dragged.groupcode);
            const rows = isMulti ? selected : [dragged];

            moveRows(rows, direction);
        }
    });
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
    createRefreshButton,
    createCustomButton,
    createTanslations,
    createBadgeRenderer,
    createSaveRenderer,
    RowNumRenderer
};
