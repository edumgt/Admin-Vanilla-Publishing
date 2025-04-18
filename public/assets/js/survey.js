import { fetchPermissions, initPageUI } from './accessControl.js';
import { createSaveRenderer } from './common.js';

let surveyGrid;
let surveyQuestionGrid;
let questionsGrid;
let staticsGrid;

document.addEventListener('DOMContentLoaded', () => {
    const workarea = document.getElementById('workarea');
    workarea.classList.add('flex', 'mb-4', 'mt-4', 'gap-2');

    document.getElementsByClassName("tablinks")[0].click();

    let rowData = JSON.parse(localStorage.getItem("questions"));
    const questionsContainer = document.getElementById("questionsContainer");
    questionsContainer.classList.add('mt-4');

    // JSON 데이터를 불러오는 함수 (최대 3번 재시도)
    function fetchQuestions(retryCount = 0) {
        // console.log(`Fetching questions... Attempt: ${retryCount + 1}`);

        fetch('assets/mock/questions.json')
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                    return response.json();
                })
                .then(data => {
                    localStorage.setItem('questions', JSON.stringify(data));
                    //console.log("Questions successfully loaded:", data);
                    initializeGrid(data);
                })
                .catch(error => {
                    console.error('Error fetching surveys:', error);
                    if (retryCount < 2) {
                        setTimeout(() => fetchQuestions(retryCount + 1), 2000); // 2초 후 재시도
                    } else {
                        console.error("Failed to fetch questions after multiple attempts.");
                    }
                });
    }

    if (!rowData) {
        fetchQuestions(); // 최초 데이터 로드 시도
    } else {
        initializeGrid(rowData);
    }

    function initializeGrid(data) {


        questionsGrid = new tui.Grid({
            el: questionsContainer,
            data: data,
            columns: [
                {
                    header: "ID", name: "id", width: 60,
                    sortable: true, // 정렬 기능 추가
                    filter: {
                        type: 'number' // 숫자 필터 추가
                    }
                },
                {
                    header: "질문", name: "text", width: 250,
                    resizable: true,
                    editor: "text",
                    sortable: true, // 정렬 기능 추가
                    filter: {
                        type: 'text'

                    }
                },
                {
                    header: "옵션", name: "options",
                    editor: {
                        type: 'text',
                        options: {
                            useViewMode: false
                        }
                    },
                    minWidth: 400,
                    sortable: true, // 정렬 기능 추가
                    filter: {
                        type: 'text'

                    }
                }
            ],
            bodyHeight: 500,
            scrollX: true,
            scrollY: true
        });

        questionsGrid.on('afterChange', ({ changes }) => {
            let storedData = JSON.parse(localStorage.getItem("questions")) || [];

            changes.forEach(change => {
                const { rowKey, columnName, value } = change;
                let updatedRow = questionsGrid.getRow(rowKey);

                let existingIndex = storedData.findIndex(q => q.id === updatedRow.id);
                if (existingIndex !== -1) {
                    if (columnName === "options") {
                        storedData[existingIndex][columnName] = value.split(",").map(opt => opt.trim()); // 문자열을 배열로 변환
                    } else {
                        storedData[existingIndex][columnName] = value;
                    }
                }
            });

            localStorage.setItem("questions", JSON.stringify(storedData));
        });
    }
    fetchData();

    // 설문지 관리
    fillYearCombo();
    initializeSurveyGrid();
    loadSurveys();

    // 설문 통계
    initializeStaticsGrid();

    fetchPermissions().then((permissions) => {
        initPageUI("btnContainer", {
            onAdd: addQuesionSurvey,
            onDelete: delQuesionSurvey,
            gridInstance: surveyGrid,
            gridOptions: {
                editableCols: ['sdate', 'edate']
            },
            buttonOrder: ['add', 'delete'],
            permissions
        });

        initPageUI("btnContainer2", {
            onAdd: addQuesionSurvey2,
            onDelete: delQuesionSurvey2,
            gridInstance: surveyQuestionGrid,
            gridOptions: {
                editableCols: ['question', 'type']
            },
            buttonOrder: ['add', 'delete'],
            permissions
        });

        initPageUI("btnContainer3", {
            onSearch: loadStatics,
            buttonOrder: ['search'],
            permissions
        });
    });
});


function addQuestion() {
    const questionInput = document.getElementById('questionInput');
    const questionText = questionInput.value.trim();
    if (questionText === '') {
        showToast("required-input", "warning", lang);
        return;
    }
    const options = Array.from(document.querySelectorAll('#optionsInput input')).map(input => input.value.trim()).filter(option => option !== '');
    if (options.length < 2) {
        showToast('survey-2', 'warning', lang);
        return;
    }
    const newQuestion = {
        id: Date.now(),
        text: questionText,
        options: options
    };
    const questions = JSON.parse(localStorage.getItem('questions')) || [];
    questions.push(newQuestion);
    localStorage.setItem('questions', JSON.stringify(questions));
    createQuestionBox(newQuestion, document.getElementById('questionsList'));

    if (questionsGrid) {
        questionsGrid.appendRow(newQuestion); // 새로운 행 추가

    }

    // 입력 필드 초기화
    questionInput.value = '';
    document.querySelectorAll('#optionsInput input').forEach(input => input.value = '');

}

// 탭 전환 함수
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

    if (tabName === 'SurveyResponse') {
        populateSurveySelect();
    }
    if (tabName === 'SurveyCreation') {
        setTimeout(() => {
            surveyGrid.refreshLayout();
        }, 100);
    }else if (tabName === 'QuestionCreation') {
        setTimeout(() => {
            questionsGrid.refreshLayout();
        }, 100);
    }else if (tabName === 'ResponseStatics') {
        setTimeout(() => {
            staticsGrid.refreshLayout(); 
        }, 100);
    }
}

// 데이터 fetch
function fetchData() {
    // 초기 실행
    waitForQuestions();

    fetch('assets/mock/surveys.json')
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('surveys', JSON.stringify(data));
                populateSurveySelect();
            })
            .catch(error => console.error('Error fetching surveys:', error));

    fetch('assets/mock/responses.json')
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('responses', JSON.stringify(data));
            })
            .catch(error => console.error('Error fetching responses:', error));

}

function waitForQuestions(retryCount = 0) {
    let rowData = JSON.parse(localStorage.getItem("questions"));

    if (rowData !== null) {
        //console.log("rowData: ", rowData);
        //console.log("rowData.length: " + rowData.length);
        displayQuestions(rowData);
    } else if (retryCount < 5) { // 최대 5번 재시도 (5초 동안 확인)
        //console.log(`Waiting for questions... Attempt: ${retryCount + 1}`);
        setTimeout(() => waitForQuestions(retryCount + 1), 1000);
    } else {
        console.error("Failed to load questions after multiple attempts.");
    }
}



// 문항 표시 함수
function displayQuestions(questions) {
    const questionsList = document.getElementById('questionsList');
    questionsList.style.height = "700px";
    questionsList.innerHTML = '<p class="mb-2">문항 목록</p>';
    questions.forEach(question => createQuestionBox(question, questionsList));
}

// 문항 생성 함수
function createQuestionBox(question, container) {
    const questionBox = document.createElement('div');
    questionBox.className = 'question-box border p-2 my-1 cursor-move bg-gray-100';
    questionBox.draggable = true;
    questionBox.textContent = question.text;
    questionBox.dataset.id = question.id;
    questionBox.addEventListener('dragstart', handleDragStart);
    questionBox.addEventListener('dragend', handleDragEnd);

    container.appendChild(questionBox);
}

// 드래그 시작 이벤트 핸들러
function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.dataset.id);
    event.dataTransfer.effectAllowed = 'move';
}

// 드래그 종료 이벤트 핸들러
function handleDragEnd(event) {
    event.dataTransfer.clearData();
}

// 드롭 존 이벤트 핸들러
function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    event.target.classList.add('bg-gray-200');
}

function handleDragLeave(event) {
    event.target.classList.remove('bg-gray-200');
}
function handleDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('bg-gray-200');

    // 실제 드롭 영역이 'surveyContainer' 인지 확인(바인딩된 요소를 사용하는 방법)
    const dropContainer = event.currentTarget; // = document.getElementById('surveyContainer');

    const questionId = event.dataTransfer.getData('text/plain');
    const questions = JSON.parse(localStorage.getItem('questions')) || [];
    const question = questions.find(q => q.id == questionId);

    if (!question) return;

    // 드롭된 컨테이너에서 중복 검사
    const existingItem = dropContainer.querySelector(`[data-id="${questionId}"]`);
    if (existingItem) {
        showToast("already-add", "warning", lang);
        return;
    }

    // 새로운 문항 박스 추가
    const surveyQuestionBox = createSurveyQuestionBox(question, true);
    dropContainer.appendChild(surveyQuestionBox);
}


// 문항 박스를 생성하는 함수
function createSurveyQuestionBox2(question, draggable = false) {
    const box = document.createElement('div');
    box.className = 'survey-question border p-2 my-1 bg-blue-100';
    box.textContent = question.text;
    box.dataset.id = question.id;
    box.draggable = draggable;
    if (draggable) {
        box.classList.add('cursor-move');
        box.addEventListener('dragstart', handleDragStart);
        box.addEventListener('dragend', handleDragEnd);
    }
    return box;
}


// 설문 문항 생성 함수
function createSurveyQuestionBox(question, isRemovable) {
    const questionBox = document.createElement('div');
    questionBox.className = 'question-box border p-2 my-2 relative';
    questionBox.textContent = question.text;
    questionBox.dataset.id = question.id;

    question.options.forEach(option => {
        const label = document.createElement('label');
        label.className = 'block';
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = `question-${question.id}`;
        radio.value = option;
        label.appendChild(radio);
        label.appendChild(document.createTextNode(option));
        questionBox.appendChild(label);
    });

    if (isRemovable) {
        const removeButton = document.createElement('span');
        removeButton.className = 'absolute top-1 right-1 text-red-500 text-white p-1 cursor-pointer';
        removeButton.textContent = 'X';
        removeButton.onclick = () => questionBox.remove();
        questionBox.appendChild(removeButton);
    }

    return questionBox;
}


function saveSurvey() {
    // 설문지명 가져오기
    const surveyTitleInput = document.getElementById('surveyTitleInput');
    const surveyTitle = surveyTitleInput.value.trim();

    // 설문지명 검증 (미입력 시 알림)
    if (!surveyTitle) {
        showToast("설문지명을 입력해주세요.", "warning", lang);
        return;
    }

    // 실제 설문 문항(questions) 구성 읽어오기
    const surveyContainer = document.getElementById('surveyContainer');
    const surveyQuestions = Array.from(
            surveyContainer.getElementsByClassName('question-box')
    ).map(box => parseInt(box.dataset.id));

    // 새로운 설문 객체
    const newSurvey = {
        id: Date.now(),
        title: surveyTitle,  // 입력받은 설문지명
        description: "문항을 드래그 앤 드롭 하여 설문지를 구성 합니다.",
        questions: surveyQuestions
    };

    // 로컬 스토리지에서 기존 설문 목록 가져오기
    const surveys = JSON.parse(localStorage.getItem('surveys')) || [];
    surveys.push(newSurvey);
    localStorage.setItem('surveys', JSON.stringify(surveys));

    // 저장 후 사용자에게 안내
    showToast('survey-add', 'success', lang);

    // 저장 완료 후, 설문 제목 필드 초기화
    surveyTitleInput.value = '';

    // 설문 목록 Select 갱신
    populateSurveySelect();
}


// 설문지 선택 목록 업데이트 함수
function populateSurveySelect() {
    const surveySelect = document.getElementById('surveySelect');
    const surveys = JSON.parse(localStorage.getItem('surveys')) || [];
    surveySelect.innerHTML = '<option value="">Select a survey</option>';
    surveys.forEach(survey => {
        const option = document.createElement('option');
        option.value = survey.id;
        option.textContent = survey.title;
        surveySelect.appendChild(option);
    });

    surveySelect.addEventListener('change', displaySelectedSurvey);
}

// 선택한 설문지 표시 함수
function displaySelectedSurvey() {
    const surveyId = document.getElementById('surveySelect').value;
    const surveys = JSON.parse(localStorage.getItem('surveys')) || [];
    const selectedSurvey = surveys.find(survey => survey.id == surveyId);

    const surveyForm = document.getElementById('surveyForm');
    surveyForm.innerHTML = '';

    if (selectedSurvey) {
        selectedSurvey.questions.forEach(questionId => {
            const question = JSON.parse(localStorage.getItem('questions')).find(q => q.id == questionId);
            if (question) {
                const questionBox = document.createElement('div');
                questionBox.className = 'question-box border p-2 my-2';
                questionBox.textContent = question.text;

                question.options.forEach(option => {
                    const label = document.createElement('label');
                    label.className = 'block p-2';
                    const radio = document.createElement('input');
                    radio.type = 'radio';
                    radio.name = `question-${question.id}`;
                    radio.value = option;
                    label.appendChild(radio);
                    label.appendChild(document.createTextNode(option));
                    questionBox.appendChild(label);
                });

                surveyForm.appendChild(questionBox);
            }
        });
    }
}

// 설문 응답 제출 함수
document.getElementById('submitSurvey').addEventListener('click', () => {
    const form = document.getElementById('surveyForm');
    const formData = new FormData(form);
    const results = {};
    formData.forEach((value, key) => {
        results[key] = value;
    });
    //console.log('Survey Results:', results);

    const responses = JSON.parse(localStorage.getItem('responses')) || [];
    responses.push(results);
    localStorage.setItem('responses', JSON.stringify(responses));

    showToast('surveyCompleted', 'success', lang);
    generateReport(responses);
});

// 응답 데이터를 분석하여 레포트 생성 함수
function generateReport(responses) {
    const questions = JSON.parse(localStorage.getItem('questions'));
    const report = {};

    questions.forEach(question => {
        report[`question-${question.id}`] = {};
        question.options.forEach(option => {
            report[`question-${question.id}`][option] = 0;
        });
    });

    responses.forEach(response => {
        Object.keys(response).forEach(questionKey => {
            const answer = response[questionKey];
            if (answer && report[questionKey]) {
                report[questionKey][answer]++;
            }
        });
    });

    displayReport(report);
}

// 레포트를 HTML로 표시 함수 (3개씩 한 줄)
function displayReport(report) {
    const reportContainer = document.getElementById('reportContainer');
    reportContainer.innerHTML = '';

    // Grid Layout 적용
    const gridContainer = document.createElement('div');
    gridContainer.className = 'grid grid-cols-3 gap-4'; // 3개씩 배치
    reportContainer.appendChild(gridContainer);

    for (const question in report) {
        const questionReport = report[question];

        const questionDiv = document.createElement('div');
        questionDiv.className = 'border p-4 rounded shadow-md bg-white flex flex-col items-center';

        const questionTitle = document.createElement('h2');
        questionTitle.className = 'text-lg font-bold mb-2 text-center';
        const questionText = JSON.parse(localStorage.getItem('questions')).find(q => q.id == question.split('-')[1]).text;
        questionTitle.textContent = questionText;
        questionDiv.appendChild(questionTitle);

        // 캔버스 생성 및 CSS 적용
        const chartCanvas = document.createElement('canvas');
        chartCanvas.id = `chart-${question}`;
        chartCanvas.className = 'w-full h-[300px]';
        questionDiv.appendChild(chartCanvas);

        gridContainer.appendChild(questionDiv);

        // 차트 데이터 설정
        const data = {
            labels: Object.keys(questionReport),
            datasets: [{
                data: Object.values(questionReport),
                borderColor: [
                    'rgba(75, 192, 192, 0.2)',  // Teal
                    'rgba(54, 162, 235, 0.2)',  // Blue
                    'rgba(255, 206, 86, 0.2)',  // Yellow
                    'rgba(153, 102, 255, 0.2)', // Purple
                    'rgba(255, 159, 64, 0.2)'   // Orange
                ],
                backgroundColor: [
                    'rgba(75, 192, 192, 1)',    // Teal
                    'rgba(54, 162, 235, 1)',    // Blue
                    'rgba(255, 206, 86, 1)',    // Yellow
                    'rgba(153, 102, 255, 1)',   // Purple
                    'rgba(255, 159, 64, 1)'     // Orange
                ],
                borderWidth: 1
            }]
        };

        const options = {
            responsive: true,
            maintainAspectRatio: true, // 🔥 비율 유지 비활성화
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            return tooltipItem.label + ': ' + tooltipItem.raw;
                        }
                    }
                }
            }
        };

        // 차트 그리기
        setTimeout(() => {
            new Chart(chartCanvas, {
                type: 'pie',
                data: data,
                options: options
            });
        }, 100);
    }
}


// 드롭 존 설정
const surveyContainer = document.getElementById('surveyContainer');
surveyContainer.style.height = "700px";
surveyContainer.addEventListener('dragover', handleDragOver);
surveyContainer.addEventListener('dragleave', handleDragLeave);
surveyContainer.addEventListener('drop', handleDrop);

document.addEventListener('DOMContentLoaded', () => {
    document.getElementsByClassName("tablinks")[0].click();
    fetchData();

    // 모바일 보기 버튼 클릭 이벤트 추가
    document.getElementById('mobileViewButton').addEventListener('click', () => {

        startMobileSurvey();
    });


});

// 모바일 설문 시작 함수
function startMobileSurvey() {
    const surveyForm = document.getElementById('surveyForm');
    const questions = Array.from(surveyForm.getElementsByClassName('question-box'));

    let currentQuestionIndex = 0;
    const responses = {};

    function showQuestion(index) {
        const mobileSurveyContentInner = document.getElementById('mobileSurveyContentInner');
        //console.log(mobileSurveyContentInner);
        mobileSurveyContentInner.innerHTML = '';
        if (questions[index]) {
            const questionClone = questions[index].cloneNode(true);
            const nextButton = document.createElement('button');
            nextButton.textContent = '다음';
            nextButton.className = 'bg-blue-500 text-white p-2 rounded mt-2 w-full';
            nextButton.addEventListener('click', () => {
                const selectedOption = questionClone.querySelector('input[type="radio"]:checked');
                if (selectedOption) {
                    responses[`question-${questions[index].dataset.id}`] = selectedOption.value;
                    nextQuestion();
                } else {
                    showToast('choice-q','warning',lang);
                }
            });
            questionClone.appendChild(nextButton);
            mobileSurveyContentInner.appendChild(questionClone);
        }
    }

    function nextQuestion() {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            showQuestion(currentQuestionIndex);
        } else {
            showToast('all-answer','success',lang);
            document.getElementById('mobileSurveyModal').classList.add('hidden');
            saveResponses();
        }
    }

    function saveResponses() {
        const storedResponses = JSON.parse(localStorage.getItem('responses')) || [];
        storedResponses.push(responses);
        localStorage.setItem('responses', JSON.stringify(storedResponses));
        showToast('surveyCompleted', 'success',lang);

        generateReport(storedResponses);
    }

    showQuestion(currentQuestionIndex);
    document.getElementById('mobileSurveyModal').classList.remove('hidden');
}

class RowNumRenderer {
    constructor(props) {
        const el = document.createElement('span');
        this.el = el;

        const { grid, rowKey } = props;
        const row = grid.getRow(rowKey);
        const allRows = grid.getData();
        const rowIndex = allRows.findIndex(r => r.rowKey === rowKey);

        if (row?.isNew === true) {
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



// 설문지 관리 탭_그리드 초기화 
function initializeSurveyGrid(){
 
    // 설문지 목록
    surveyGrid = new tui.Grid({
        el: document.getElementById('surveyGrid'),
        rowHeaders: [{
            type: 'rowNum',
            header: 'No.',
            renderer: { type: RowNumRenderer }
        }, 'checkbox'],
        scrollX: true,
        scrollY: true,
        bodyHeight: 500,
        columns: [
            { header: '년도', name: 'year', width: 80,  align: 'center', sortable: true, resizable: true
                , editor: {
                    type: 'datePicker',
                    options: {
                      format: 'yyyy',
                      type: 'year'
                    }
                }
            },
            { header: '분기', name: 'qt', width: 60, align: 'center', sortable: true, resizable: true
                , editor: {
                    type: 'select',
                    options: {
                    listItems: [
                        { text: '1', value: '1' },
                        { text: '2', value: '2' },
                        { text: '3', value: '3' },
                        { text: '4', value: '4' }
                    ]
                    }
                }},
            { header: '설문시작일', name: 'sdate', align: 'center', sortable: true, resizable: true
                , formatter: ({ value }) => formatDate(value)
                , editor: {
                    type: 'datePicker',
                    options: {
                        format: 'yyyy-MM-dd'  // 서버 전송용 포맷
                    }
                }
            },
            { header: '설문종료일', name: 'edate', align: 'center', sortable: true, resizable: true
                , formatter: ({ value }) => formatDate(value)
                , editor: {
                    type: 'datePicker',
                    options: {
                        format: 'yyyy-MM-dd'  // 서버 전송용 포맷
                    }
                }
            },
            {
                header: '저장', name: 'saveBtn', width: 80, align: 'center',
                renderer: {
                  type: createSaveRenderer
                }
            }
        ]
    });

    // 설문지 목록 편집 시작 이벤트
    surveyGrid.on('editingStart', (ev) => {
        const { rowKey, columnName, instance } = ev;
        const row = instance.getRow(rowKey);

        if (!row) {
            ev.stop();
            return;
        }

        // 기존 행인데 year 또는 qt 필드 편집 시도 → 막기
        if (!row.isNew && ['year', 'qt'].includes(columnName)) {
            ev.stop();
        }
    });

    // 설문지 목록 클릭 이벤트
    surveyGrid.on('click', (ev) => {
        const { rowKey, columnName } = ev;
        const row = surveyGrid.getRow(rowKey);

        if (row && row.isNew !== true) {
            handleSurveyClick();  // 문항 목록 불러오기
        }

        // row 저장
        if (columnName === 'saveBtn') {
            // 🔍 필수 입력값 확인
            const requiredFields = ['year', 'qt', 'sdate', 'edate'];
            const emptyField = requiredFields.find(field => !row[field] || row[field].toString().trim() === '');

            const fieldLabels = {
                year: '년도',
                qt: '분기',
                sdate: '설문 시작일',
                edate: '설문 종료일'
            };

            if (emptyField) {
                const label = fieldLabels[emptyField] || emptyField; // 매핑이 없으면 그대로 출력
                showToast(`"${label}" 항목을 입력해주세요.`, 'warning', lang);
                return;
            }

            // 날짜 필드를 SQL 서버 형식으로 가공
            row.pollSdate = formatDateTimeToSQL(row.sdate);
            row.pollEdate = formatDateTimeToSQL(row.edate);
            //console.log('🔸 저장할 행 데이터:', row);

            if(row.isNew == true) {
                saveSurveyRow(row, `${backendDomain}/api/surveys/survey`, 'POST', () => {
                    loadSurveys(); // 성공 시에만 호출됨
                });
            } else {
                saveSurveyRow(row, `${backendDomain}/api/surveys/survey/${row.seq}`, 'PUT', () => {
                    loadSurveys(); // 성공 시에만 호출됨
                });
            }
        }
    });

    // 문항 목록
    surveyQuestionGrid = new tui.Grid({
        el: document.getElementById('surveyQuestionGrid'),
        rowHeaders: [{
            type: 'rowNum',
            header: 'No.',
            renderer: { type: RowNumRenderer }
        }, 'checkbox'],
        scrollX: true,
        scrollY: true,
        bodyHeight: 500,
        //draggable: true,
        columns: [
            { header: '문항', name: 'question', editor: "text", sortable: true, resizable: true },
            { header: '유형', name: 'type', width: 50, sortable: true, resizable: true
                , editor: {
                    type: 'select',
                    options: {
                        listItems: [
                            { text: '1', value: '1' },
                            { text: '2', value: '2' }
                        ]
                    }
                }
            },
            {
                header: '저장', name: 'saveBtn', width: 80, align: 'center',
                renderer: {
                    type: createSaveRenderer
                }
            }
        ]
    });

    // 설문지 목록 클릭 이벤트
    surveyQuestionGrid.on('click', (ev) => {
        const { rowKey, columnName } = ev;
        const row = surveyQuestionGrid.getRow(rowKey);

        // row 저장
        if (columnName === 'saveBtn') {
            // 🔍 필수 입력값 확인
            const requiredFields = ['question', 'type'];
            const emptyField = requiredFields.find(field => !row[field] || row[field].toString().trim() === '');

            const fieldLabels = {
                question: '문항',
                type: '유형'
            };

            if (emptyField) {
                const label = fieldLabels[emptyField] || emptyField; // 매핑이 없으면 그대로 출력
                showToast(`"${label}" 항목을 입력해주세요.`, 'warning', lang);
                return;
            }

            console.log('🔸 저장할 행 데이터:', row);

            if(row.isNew == true) {
                saveSurveyRow(row, `http://localhost:8080/api/surveys/question`, 'POST', () => {
                    handleSurveyClick(); // 성공 시에만 호출됨
                });
            } else {
                saveSurveyRow(row, `${backendDomain}/api/surveys/question/${row.seq}`, 'PUT', () => {
                    handleSurveyClick(); // 성공 시에만 호출됨
                });
            }
        }
    });

}

// 날짜 필드를 SQL 서버 형식으로 가공
function formatDateTimeToSQL(dateStr) {
    const date = new Date(dateStr);
    if (isNaN(date)) return null;
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = '00';
    const mi = '00';
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:00`;
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
}

// 날짜 문자열 → yyyy-mm-dd 형식으로 포맷팅
function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr; // 유효하지 않은 날짜면 원본 출력
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

// 설문 목록 로딩
function loadSurveys() {
    const year = document.getElementById('searchYear').value;
    const qt = document.getElementById('searchQt').value;

    const query = new URLSearchParams({ year, qt });
    fetch(`${backendDomain}/api/surveys/survey/search?${query}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`서버 응답 오류: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                surveyGrid.resetData(data);

                // 설문지 재조회 시 문항 목록도 초기화
                if (surveyQuestionGrid) {
                    surveyQuestionGrid.resetData([]);
                }
            })
            .catch(err => {
                console.error('❌ Fetch 오류:', err.message);
                alert('설문 데이터를 불러오는 중 오류가 발생했습니다.');
            });
}

// 저장 api 호출
function saveSurveyRow(row, url, method, callback) {

    fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(row)
    })
            .then(res => res.json())
            .then(result => {
                if (result > 0) {
                    showToast('저장 성공', 'success', lang);
                    if (typeof callback === 'function') {
                        callback(); // 👉 콜백 함수 실행
                    }
                } else {
                    showToast('저장 실패', 'error', lang);
                }
            })
            .catch(err => {
                console.error('저장 오류:', err);
                showToast('저장 오류', 'error', lang);
            });
}


// 설문지 신규 행 추가
function addQuesionSurvey() {
    const data = surveyGrid.getData();
    const hasEmptyRow = data.some(row => row.isNew === true);
    if (hasEmptyRow) {
        showToast('input-allowed', 'info', lang);
    } else {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1; // JS는 0부터 시작
        const currentQuarter = Math.floor((currentMonth - 1) / 3) + 1;
        const todayStr = now.toISOString().split('T')[0]; // yyyy-mm-dd

        surveyGrid.prependRow({
            year: currentYear.toString(),
            qt: currentQuarter.toString(),
            sdate: todayStr,
            edate: todayStr,
            isNew: true  // 신규 여부 커스텀 속성
        });
    }
}

// 설문지 행 삭제
function delQuesionSurvey() {
    const selectedKeys = surveyGrid.getCheckedRowKeys();

    if (selectedKeys.length === 0) {
        showToast('삭제할 항목을 선택하세요.', 'warning', lang);
        return;
    }

    selectedKeys.forEach(rowKey => {
        const row = surveyGrid.getRow(rowKey);

        // 아직 저장되지 않은 신규행이면 바로 삭제
        if(row.isNew == true) {
            surveyGrid.removeRow(rowKey);
        } else {
            // 서버 API 호출
            fetch(`${backendDomain}/api/surveys/survey/${row.seq}`, {
                method: 'DELETE'
            })
                    .then(res => {
                        if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
                        return res.json(); // 삭제 결과 (성공 시 정수 반환 기대)
                    })
                    .then(result => {
                        if (result > 0) {
                            showToast('삭제 성공', 'success', lang);
                            surveyGrid.removeRow(rowKey);
                        } else {
                            showToast('삭제 실패', 'error', lang);
                        }
                    })
                    .catch(err => {
                        console.error('삭제 오류:', err);
                        showToast('삭제 중 오류 발생', 'error', lang);
                    });
        }
    });
}

// 설문 선택 시 문항 조회
function handleSurveyClick() {
    const focusedCell = surveyGrid.getFocusedCell();
    if (!focusedCell) return;

    const row = surveyGrid.getRow(focusedCell.rowKey);
    if (!row || row.isNew === true) return;

    const rdSeq = row.seq;
    const query = new URLSearchParams({ rdSeq });

    fetch(`${backendDomain}/api/surveys/question/search?${query}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`서버 응답 오류: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                surveyQuestionGrid.resetData(data);
            })
            .catch(err => {
                console.error('❌ Fetch 오류:', err.message);
                alert('문항 데이터를 불러오는 중 오류가 발생했습니다.');
            });
}

// 문항목록 행 추가
function addQuesionSurvey2() {
    const focus = surveyGrid.getFocusedCell();  // 현재 포커스된 셀 정보
    if (!focus || focus.rowKey == null) {
        showToast('먼저 설문지를 선택하세요.', 'warning', lang);
        return;
    }

    const selectedRow = surveyGrid.getRow(focus.rowKey);  // 포커스된 행의 row data
    if (!selectedRow || !selectedRow.seq) {
        showToast('유효한 설문지를 선택하세요.', 'warning', lang);
        return;
    }

    const data = surveyQuestionGrid.getData();
    const hasEmptyRow = data.some(row => row.isNew === true);

    if (hasEmptyRow) {
        showToast('input-allowed', 'info', lang);
    } else {
        surveyQuestionGrid.prependRow({
            rdSeq: selectedRow.seq, // 설문지 seq 연동
            question: '',
            type: '1',
            isNew: true   // 신규 여부 커스텀 속성
        });
    }
}

// 문항목록 행 삭제
function delQuesionSurvey2() {
    const selectedKeys = surveyQuestionGrid.getCheckedRowKeys();

    if (selectedKeys.length === 0) {
        showToast('삭제할 항목을 선택하세요.', 'warning', lang);
        return;
    }

    selectedKeys.forEach(rowKey => {
        const row = surveyQuestionGrid.getRow(rowKey);

        // 아직 저장되지 않은 신규행이면 바로 삭제
        if(row.isNew == true) {
            surveyQuestionGrid.removeRow(rowKey);
        } else {
            // 서버 API 호출
            fetch(`${backendDomain}/api/surveys/question/${row.seq}`, {
                method: 'DELETE'
            })
                    .then(res => {
                        if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
                        return res.json(); // 삭제 결과 (성공 시 정수 반환 기대)
                    })
                    .then(result => {
                        if (result > 0) {
                            showToast('삭제 성공', 'success', lang);
                            surveyQuestionGrid.removeRow(rowKey);
                        } else {
                            showToast('삭제 실패', 'error', lang);
                        }
                    })
                    .catch(err => {
                        console.error('삭제 오류:', err);
                        showToast('삭제 중 오류 발생', 'error', lang);
                    });
        }
    });
}

//설문통계 텝_그리드 초기화
function initializeStaticsGrid(){
    staticsGrid = new tui.Grid({
        el: document.getElementById('staticsGrid'),
        rowHeaders: [{
            type: 'rowNum',
            header: 'No.'
        }, 'checkbox'],
        scrollX: true,
        scrollY: true,
        bodyHeight: 630,
        rowHeight: 42,
        minRowHeight: 42,
        columns: [
            // { header: '계열', name: 'siteName', editor: 'text', align: 'center', sortable: true, filter: 'text', resizable: true, rowSpan: true },
            { header: '지점명', name: 'placeName', editor: 'text', align: 'center', sortable: true, filter: 'text', resizable: true, rowSpan: true },
            { header: '강사명', name: 'teachername', editor: 'text', align: 'center', sortable: true, filter: 'text', resizable: true, rowSpan: true },
            { header: '수업명', name: 'shortname', editor: 'text', align: 'center', sortable: true, filter: 'text', resizable: true },
            { header: '평일/주말', name: 'weekName', editor: 'text', align: 'center', sortable: true, filter: 'text', resizable: true },
            { header: '강의시간', name: 'begintime', editor: 'text', align: 'center', sortable: true, filter: 'text', resizable: true },
            { header: '설문학생수', name: 'studentCnt', editor: 'text', align: 'center', sortable: true, filter: 'text', resizable: true },
            { header: '설문점수', name: 'avgScore', editor: 'text', align: 'center', sortable: true, filter: 'text', resizable: true
                , formatter: ({ value }) => Number(value).toFixed(2) 
            },            
        ],
        //data: loadStatics(),
        //columnOptions: { frozenCount: 2, frozenBorderWidth: 2 },
    });
}

// 설문 목록 로딩
function loadStatics() {
    const siteCode = '';
    const placeSeq = '';

    const query = new URLSearchParams({ siteCode, placeSeq });
    fetch(`${backendDomain}/api/surveys/statics/search?${query}`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`서버 응답 오류: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            staticsGrid.resetData(data);
            const dataCountElement = document.getElementById('staticsDataCount');
            dataCountElement.textContent = `Total : ${data?.length}`;
        })
        .catch(err => {
            console.error('❌ Fetch 오류:', err.message);
            alert('설문 데이터를 불러오는 중 오류가 발생했습니다.');
        });
}

const exports = {
    openTab,
    loadSurveys,
    addQuestion,
    saveSurvey
};

Object.entries(exports).forEach(([key, fn]) => {
    window[key] = fn;
});