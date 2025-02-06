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
            orgtree: "Permission Management",
            document: "Document Management",
            wms: "WMS",
            config: "System log",
            network: "Consultant",
            survey: "Survey",
            work: "Reservation Management",
            meeting: "Meeting Room Management",
            hospital: "Hospital Reservation",
            lectures: "Lecture Schedule",
            city: "District Information",

            code: "Code",
            permissions: "Permissions",
            logs: "Logs",
            menu: "Menu",
            settings: "Settings",
            stati: "Member Statistics",
            flow: "Sales Statistics",
            chain: "Chain Operation",

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
            config: "시스템 로그",
            network: "컨설팅 지정",
            survey: "서베이",
            work: "예약관리",
            meeting: "회의실관리",
            hospital: "병원예약",
            lectures: "강의일정",
            city: "행정구역정보",

            code: "입출고관리",
            permissions: "권한관리",
            logs: "로그관리",
            menu: "메뉴관리",
            settings: "설정관리",
            stati: "회원통계",
            flow: "매출통계",
            chain: "체인운영",



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
            wms: "WMS",
            config: "システムログ",
            network: "コンサルティングの指定",
            survey: "サーベイ",
            work: "予約管理",
            meeting: "会議室管理",
            hospital: "病院予約",
            lectures: "講義日程",
            city: "行政区情報",

            code: "コード管理",
            permissions: "権限管理",
            logs: "ログ管理",
            menu: "メニュー管理",
            settings: "設定管理",
            stati: "会員統計",
            flow: "売上統計",
            chain: "チェーン運営",
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


export { createAddButton, createDelButton, createCloseButton, createSaveButton, createTanslations };
