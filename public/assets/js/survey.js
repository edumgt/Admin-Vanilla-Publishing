document.addEventListener('DOMContentLoaded', () => {
    const workarea = document.getElementById('workarea');
    workarea.classList.add('flex', 'mb-4', 'mt-4', 'gap-2');

    document.getElementsByClassName("tablinks")[0].click();

    let rowData = JSON.parse(localStorage.getItem("questions"));
    const questionsContainer = document.getElementById("questionsContainer");
    questionsContainer.classList.add('mt-4');

    // JSON 데이터를 불러오는 함수 (최대 3번 재시도)
    function fetchQuestions(retryCount = 0) {
        //console.log(`Fetching questions... Attempt: ${retryCount + 1}`);

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

        

        window.grid = new tui.Grid({
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

        
        
        

        grid.on('afterChange', ({ changes }) => {
            let storedData = JSON.parse(localStorage.getItem("questions")) || [];

            changes.forEach(change => {
                const { rowKey, columnName, value } = change;
                let updatedRow = grid.getRow(rowKey);

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

    if (window.grid) {
        window.grid.appendRow(newQuestion); // 새로운 행 추가

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
function createSurveyQuestionBox(question, draggable = false) {
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


// 설문 저장 함수
function saveSurvey() {
    const surveyContainer = document.getElementById('surveyContainer');
    const surveyQuestions = Array.from(surveyContainer.getElementsByClassName('question-box')).map(box => parseInt(box.dataset.id));
    const newSurvey = {
        id: Date.now(),
        title: "Custom Survey",
        description: "문항을 드래그 앤 드롭 하여 설문지를 구성 합니다.",
        questions: surveyQuestions
    };

    const surveys = JSON.parse(localStorage.getItem('surveys')) || [];
    surveys.push(newSurvey);
    localStorage.setItem('surveys', JSON.stringify(surveys));

    showToast('survey-add','success',lang);
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
