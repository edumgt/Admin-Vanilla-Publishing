import {
    createSaveButton,
} from './common.js';

const saveButton = createSaveButton();
document.getElementById('btnContainer').appendChild(saveButton);


const workarea = document.getElementById('workarea');
workarea.classList.add('flex', 'w-full', 'mt-4');

const statusBoxes = [
    { status: "inProgress", label: "In Progress", className: "inProgress", bgColor: "#3b82f6" },
    { status: "pending", label: "Pending", className: "pending", bgColor: "#fbbf24" },
    { status: "risk", label: "Risk", className: "risk", bgColor: "#ef4444" },
    { status: "success", label: "Success", className: "success", bgColor: "#10b981" },
    { status: "fail", label: "Fail", className: "fail", bgColor: "#6b7280" }
];


function fetchConsultations() {
    return JSON.parse(localStorage.getItem('consultations')) || [];
}


async function fetchConsultants() {
    try {
        const response = await fetch('/api/members');

        if (!response.ok) {
            throw new Error('Failed to fetch employees');
        }
        const data = await response.json();

        // "Consulting" 팀에 속한 직원만 필터링
        const consultants = data.filter(employee => employee.team === "Consulting");

        // 로컬 스토리지에 저장
        localStorage.setItem('consultants', JSON.stringify(consultants));

        return consultants;
    } catch (error) {
        console.error('Error fetching consultants:', error);
        return [];
    }
}


// 상담 데이터 저장 함수
function saveConsultations(consultations) {
    localStorage.setItem('consultations', JSON.stringify(consultations));
}

// 새로운 상담 일지 추가 함수
function addConsultation(customerName, log, solution) {
    const consultations = fetchConsultations();
    const newConsultation = {
        id: consultations.length ? consultations[consultations.length - 1].id + 1 : 1,
        customerName: customerName,
        date: new Date().toISOString().split('T')[0],
        log: log,
        solution: solution,
        status: "pending", // 초기 상태 설정
        consultant: null,
        reasons: {} // 각 상태별 Reason을 저장할 객체
    };
    consultations.push(newConsultation);
    saveConsultations(consultations);
    renderProcessFlow();
}

// 모달 팝업 관리 변수
let selectedStatusBox = null;
let selectedConsultationId = null;
let selectedStatus = null;

// 모달 팝업 열기 함수
export function openModal(statusBox, consultationId, status) {
    selectedStatusBox = statusBox;
    selectedConsultationId = consultationId;
    selectedStatus = status;
    document.getElementById('modalReason').style.display = 'flex';
}
window.openModal = openModal;

export function closeModal() {
    selectedStatusBox = null;
    selectedConsultationId = null;
    selectedStatus = null;
    document.getElementById('modalReason').style.display = 'none';
    document.getElementById('reasonInput').value = '';
}
window.closeModal = closeModal;

function saveReason() {
    const reason = document.getElementById('reasonInput').value.trim();
    if (reason && selectedStatusBox && selectedConsultationId && selectedStatus) {
        const consultations = fetchConsultations();
        const consultation = consultations.find(c => c.id == selectedConsultationId);

        if (!consultation.reasons) {
            consultation.reasons = {};
        }

        const now = new Date().toISOString();
        consultation.reasons[selectedStatus] = {
            text: reason,
            date: now
        };

        selectedStatusBox.style.backgroundColor = statusBoxes.find(box => box.status === selectedStatus).bgColor;
        selectedStatusBox.style.color = 'white';
        selectedStatusBox.querySelector('div').innerHTML = `
            ${reason.length > 10 ? reason.substring(0, 10) + '...' : reason}
            <small>${new Date(now).toLocaleString()}</small>
        `;
        selectedStatusBox.setAttribute('data-tooltip', reason); // 툴팁 설정

        saveConsultations(consultations);
        closeModal();
    }
}
window.saveReason = saveReason;

function sortConsultations(consultations, sortBy) {
    return consultations.sort((a, b) => {
        if (sortBy === "customerName") {
            return a.customerName.localeCompare(b.customerName);
        } else if (sortBy === "date") {
            return new Date(a.date) - new Date(b.date);
        } else if (sortBy === "consultant") {
            if (a.consultant && b.consultant) {
                return a.consultant.name.localeCompare(b.consultant.name);
            } else if (a.consultant) {
                return -1;
            } else if (b.consultant) {
                return 1;
            } else {
                return 0;
            }
        }
    });
}

function renderProcessFlow() {
    const sortBy = document.getElementById('sortOptions').value;
    let consultations = fetchConsultations();
    consultations = sortConsultations(consultations, sortBy);

    const processFlow = document.getElementById('processFlow');
    processFlow.classList.add("mt-2", "flex", "flex-wrap");
    processFlow.innerHTML = '';

    consultations.forEach(consultation => {
        if (!consultation.reasons) {
            consultation.reasons = {};
        }

        const statusBoxesHtml = statusBoxes.map(box => {
            const reason = consultation.reasons[box.status];
            return `
                <div class="status-box ${box.className}" 
                     onclick="openModal(this, ${consultation.id}, '${box.status}')" 
                     style="background-color: ${reason && reason.text ? box.bgColor : 'transparent'}; 
                            color: ${reason && reason.text ? 'white' : 'black'};">
                    <div>
                        ${reason && reason.text
                    ? (reason.text.length > 10
                        ? reason.text.substring(0, 10) + '...'
                        : reason.text)
                    : box.label}
                        ${reason && reason.text
                    ? `<small>${new Date(reason.date).toLocaleString()}</small>`
                    : ''}
                    </div>
                    ${reason && reason.text
                    ? `<span class="tooltip">${reason.text}</span>`
                    : ''}
                </div>
            `;
        }).join('');

        const processItem = document.createElement('div');
        processItem.className = 'border-t border-gray-100 process-item bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full flex';
        processItem.innerHTML = `
            <div class="w-2/3 flex items-center droppable" data-id="${consultation.id}">
                <div class="bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center mr-4">
                    ${consultation.id}
                </div>
                <div>
                    <p class="text-gray-700 text-base"><strong>고객명: </strong> ${consultation.customerName}</p>
                    <p class="text-gray-700 text-base"><strong>상담일: </strong> ${consultation.date}</p>
                    <p class="text-gray-700 text-base"><strong>상담내용: </strong> ${consultation.log}</p>
                    <p class="text-gray-700 text-base"><strong>제안사항: </strong> ${consultation.solution}</p>
                    ${consultation.consultant ? `<p class="text-gray-700 text-base"><strong>Consultant:</strong> ${consultation.consultant.name}</p>` : ''}
                </div>
            </div>
            <div class="w-1/3 flex flex-wrap">
                ${statusBoxesHtml}
            </div>
        `;
        processFlow.appendChild(processItem);
    });

    // 드래그 앤 드롭 이벤트 설정
    const droppables = document.querySelectorAll('.droppable');
    droppables.forEach(droppable => {
        droppable.addEventListener('dragover', event => event.preventDefault());
        droppable.addEventListener('drop', handleDrop);
    });
}

// 컨설턴트 목록 렌더링 함수
async function renderConsultants() {
    let consultants = JSON.parse(localStorage.getItem('consultants'));

    if (!consultants) {
        consultants = await fetchConsultants();
    }

    const consultantList = document.getElementById('consultantList');
    consultantList.classList.add("bg-gray-200", "p-4", "overflow-x-auto", "flex", "flex-wrap");
    consultantList.innerHTML = ''; // 기존 목록 초기화

    consultants.forEach(consultant => {
        const consultantItem = document.createElement('div');
        consultantItem.className = 'consultant-item bg-white shadow-md rounded-full p-2 m-2 draggable text-center';
        consultantItem.draggable = true;
        consultantItem.dataset.id = consultant.id;
        consultantItem.innerHTML = `
            <p class="text-gray-700 text-sm font-bold">${consultant.name}</p>
            <p class="text-gray-500 text-xs">${consultant.address}</p>
            <p class="text-gray-500 text-xs">${consultant.id}</p>
        `;
        consultantItem.addEventListener('dragstart', handleDragStart);
        consultantList.appendChild(consultantItem);
    });
}

// 드래그 시작 이벤트 핸들러
function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.dataset.id);
}

// 드롭 이벤트 핸들러
function handleDrop(event) {
    const consultantId = event.dataTransfer.getData('text/plain');
    const consultationId = event.currentTarget.dataset.id;

    let consultants = JSON.parse(localStorage.getItem('consultants'));

    // if (!consultants) {
    //     consultants = await fetchConsultants();  
    // }

    const consultations = fetchConsultations();
    const consultant = consultants.find(c => c.id == consultantId);
    const consultation = consultations.find(c => c.id == consultationId);

    if (consultant && consultation) {
        consultation.consultant = consultant;
        consultation.status = 'inProgress';
        saveConsultations(consultations);
    }

    renderProcessFlow();
}

// 폼 제출 이벤트 핸들러
document.getElementById('consultationForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const customerName = document.getElementById('customerName').value;
    const log = document.getElementById('log').value;
    const solution = document.getElementById('solution').value;
    addConsultation(customerName, log, solution);
    this.reset(); // 폼 초기화
});

createModal2(
    'modalReason',
    '상태별 메모',
    `<textarea id="reasonInput" class="appearance-none border rounded w-full h-full py-2 px-3 text-gray-700"
    placeholder="상태에 대한 내역을 입력하세요"></textarea>`,
    [
        { label: '저장', class: 'bg-blue-500 text-white ', onClick: 'saveReason()' },
        { label: '닫기', class: 'bg-gray-500 text-white ', onClick: 'closeModal()' }
    ]
);

// 정렬 옵션 변경 이벤트 핸들러
document.getElementById('sortOptions').addEventListener('change', renderProcessFlow);

// 페이지 로드 시 저장된 상담 일지 및 컨설턴트 렌더링
document.addEventListener('DOMContentLoaded', () => {
    renderConsultants();
    renderProcessFlow();
});

document.getElementById('searchButton').addEventListener('click', (event) => {
    event.preventDefault(); // 기본 동작(폼 제출) 방지
    event.stopPropagation(); // 이벤트 버블링 방지

    const modal = document.getElementById('searchModal');

    modal.style.top = `20px`; // 같은 높이에 위치
    modal.style.left = `200px`; // 입력 필드 오른쪽에 배치
    modal.style.width = `250px`; // 모달 너비 설정
    modal.classList.remove('hidden');
    document.getElementById('searchInput').focus();
});


const searchModal = document.getElementById('searchModal');
searchModal.classList.add('absolute', 'bg-white', 'border', 'rounded', 'shadow-lg', 'hidden', 'z-50', 'p-4');
searchModal.innerHTML = `
        <h2 class="text-lg font-semibold mb-2">예약자 찾기</h2>
            <input type="text" id="searchInput" class="w-full p-2 border rounded mb-2" placeholder="이름 검색"
                autocomplete="off">
                <div id="searchResults" class="border rounded p-2 bg-white max-h-48 overflow-y-auto mb-4"></div>
                <button id="closeModal" class="bg-gray-500 text-white">닫기</button>`;

document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('searchModal').classList.add('hidden');
});

document.getElementById('searchInput').addEventListener('input', async () => {
    const searchResults = document.getElementById('searchResults');
    const query = document.getElementById('searchInput').value.trim().toLowerCase();

    searchResults.innerHTML = '';

    if (!query) return; // 빈 입력일 경우 처리하지 않음

    try {
        //const response = await fetch('assets/mock/reservations.json'); // JSON 경로 확인 필요
        const response = await fetch('/api/reservations'); // JSON 경로 확인 필요

        const data = await response.json();

        console.log(data);

        if (!data) {
            console.error("JSON 데이터 구조가 올바르지 않습니다.");
            return;
        }

        // 필터링 (대소문자 구분 없이 검색)
        const filtered = data.filter(reservation =>
            reservation.name.toLowerCase().includes(query)
        );

        if (filtered.length > 0) {
            filtered.forEach(reservation => {
                const div = document.createElement('div');
                div.classList.add('p-2', 'cursor-pointer', 'hover:bg-gray-200');
                div.textContent = reservation.name;
                div.setAttribute('data-name', reservation.name); // 값 저장
                searchResults.appendChild(div);
            });
        } else {
            searchResults.innerHTML = `<div class="p-2 text-gray-500">검색 결과 없음</div>`;
        }
    } catch (error) {
        console.error("검색 중 오류 발생:", error);
    }
});

// 동적 검색 결과 클릭 시 이벤트 처리 (Event Delegation)
document.getElementById('searchResults').addEventListener('click', (event) => {
    const selectedName = event.target.getAttribute('data-name');
    if (selectedName) {
        document.getElementById('customerName').value = selectedName;
        document.getElementById('searchModal').classList.add('hidden');
    }
});

// 모달 외부 클릭 시 닫기
document.addEventListener('click', (event) => {
    const modal = document.getElementById('searchModal');
    const searchButton = document.getElementById('searchButton');
    const customerName = document.getElementById('customerName');

    if (!modal.contains(event.target) && event.target !== searchButton && event.target !== customerName) {
        modal.classList.add('hidden');
    }
});