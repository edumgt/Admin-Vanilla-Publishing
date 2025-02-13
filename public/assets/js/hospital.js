document.addEventListener('DOMContentLoaded', () => {
    const currentDateTime = new Date();

    // JSON 파일에서 데이터를 fetch하는 함수
    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Failed to fetch data from ${url}:`, error);
            return null;
        }
    }

    // localStorage에서 데이터를 가져오는 함수
    function loadFromStorage(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    // localStorage에 데이터를 저장하는 함수
    function saveToStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // 박스 형태로 데이터를 표시하는 함수
    function createBox(item, isCurrentReservation, departments, isWaitingList = false) {
        const box = document.createElement('div');
        box.classList.add('bg-white', 'p-4', 'rounded', 'shadow', 'relative');
        if (isCurrentReservation) {
            box.classList.add('bg-orange-300');
        }

        for (let key in item) {
            if (key === 'departmentId') {
                const department = departments.find(dept => dept.id === item[key]);
                const p = document.createElement('p');
                p.textContent = `진료과목: ${department ? department.name : '알 수 없음'}`;
                box.appendChild(p);
            } else {
                const p = document.createElement('p');
                p.textContent = `${key}: ${item[key]}`;
                box.appendChild(p);
            }
        }

        // Drag and Drop 가능 표시 추가
        if (isWaitingList) {
            const dragHandle = document.createElement('div');
            dragHandle.classList.add('drag-handle');
            dragHandle.textContent = '☰';
            box.appendChild(dragHandle);
            box.setAttribute('draggable', true);
        }

        return box;
    }

    // 임의의 일정 생성 함수
    function generateRandomSchedule(departments) {
        const schedules = [];

        departments.forEach(department => {
            department.doctors.forEach(doctor => {
                for (let day = 1; day <= 31; day++) {
                    if (Math.random() < 0.7) { // 70% 확률로 근무
                        schedules.push({
                            doctor: doctor.name,
                            date: day,
                            type: 'working'
                        });
                    } else { // 30% 확률로 휴가
                        schedules.push({
                            doctor: doctor.name,
                            date: day,
                            type: 'vacation'
                        });
                    }
                }
            });
        });

        return schedules;
    }

    // 캘린더 생성 함수
    function createCalendar(schedules) {
        const calendarContainer = document.getElementById('calendar-container');
        calendarContainer.innerHTML = '';

        for (let day = 1; day <= 31; day++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('day');

            const dateElement = document.createElement('div');
            dateElement.classList.add('date');
            dateElement.textContent = `1월 ${day}일`;
            dayElement.appendChild(dateElement);

            const daySchedules = schedules.filter(schedule => schedule.date === day);

            daySchedules.forEach(schedule => {
                const scheduleElement = document.createElement('div');
                scheduleElement.classList.add('schedule', schedule.type);
                scheduleElement.textContent = `${schedule.doctor} (${schedule.type === 'working' ? '근무' : '휴가'})`;
                dayElement.appendChild(scheduleElement);
            });

            calendarContainer.appendChild(dayElement);
        }
    }

    // 데이터를 불러와 화면에 표시하는 함수
    async function loadData() {
        let departments = loadFromStorage('departments');
        let waitingList = loadFromStorage('waitingList');
        let reservations = loadFromStorage('reservations');

        if (!departments) {
            departments = await fetchData('assets/mock/departments.json');
            if (departments) {
                saveToStorage('departments', departments);
            } else {
                console.error('Failed to load departments data.');
                return;
            }
        }

        if (!waitingList) {
            waitingList = await fetchData('assets/mock/wating.json');
            if (waitingList) {
                saveToStorage('waiting', waitingList);
            } else {
                console.error('Failed to load waiting list data.');
                return;
            }
        }

        if (!reservations) {
            //reservations = await fetchData('assets/mock/reservations.json');
            reservations = await fetchData('/api/reservations');
            if (reservations) {

                saveToStorage('reservations', reservations);
            } else {
                console.error('Failed to load reservations data.');
                return;
            }
        }

        // 진료과 목록 및 의사 화면에 표시
        const departmentsContainer = document.querySelector('#departments-container');
        if (departments && departments.departments) {
            //console.log('Departments:', departments); // 데이터 구조 확인
            departments.departments.forEach(department => {
                const box = createBox(department, false, departments.departments);
                departmentsContainer.appendChild(box);
                //console.log(box);

                // 의사 목록이 있는지 확인 후 표시
                if (department.doctors && department.doctors.length > 0) {
                    const doctorsContainer = document.createElement('div');
                    doctorsContainer.className = 'doctors-list';

                    department.doctors.forEach(doctor => {
                        const doctorElement = document.createElement('p');
                        doctorElement.textContent = `${doctor.id} (${doctor.name})`;
                        doctorsContainer.appendChild(doctorElement);
                    });

                    box.appendChild(doctorsContainer);
                }
            });

            
        } else {
            console.error('Invalid departments data structure.', departments);
        }

        // 진료 대기자 목록 화면에 표시
        const waitingListContainer = document.querySelector('#waiting-list-container');
        if (waitingList && waitingList.waitingList) {
            //console.log('Waiting List:', waitingList); // 데이터 구조 확인
            waitingList.waitingList.forEach(waiting => {
                const box = createBox(waiting, false, departments.departments, true);
                box.dataset.id = waiting.id;
                waitingListContainer.appendChild(box);
            });
        } else {
            console.error('Invalid waiting list data structure.', waitingList);
        }

        // 예약 명단 목록 화면에 표시
        const reservationsContainer = document.querySelector('#reservations-container');
        if (reservations ) {
            //console.log('Reservations:', reservations); // 데이터 구조 확인
            reservations.forEach(reservation => {
                const reservationDateTime = new Date(`${reservation.date}T${reservation.time}`);
                const isCurrentReservation = currentDateTime.toDateString() === reservationDateTime.toDateString() &&
                                             currentDateTime.getHours() === reservationDateTime.getHours() &&
                                             currentDateTime.getMinutes() === reservationDateTime.getMinutes();
                const box = createBox(reservation, isCurrentReservation, departments.departments);
                reservationsContainer.appendChild(box);
            });
        } else {
            console.error('Invalid reservations data structure.', reservations);
        }

        // 캘린더 생성
        const schedules = generateRandomSchedule(departments.departments);
        createCalendar(schedules);

        addDragAndDrop();
    }

    document.querySelectorAll('.tab-hos').forEach(button => {
        button.addEventListener('click', () => {
            // 모든 버튼에서 'active-tab' 클래스 제거 (기존 스타일 제거)
            document.querySelectorAll('.tab-hos').forEach(btn => btn.classList.remove('active-tab'));
    
            // 클릭한 버튼에 'active-tab' 클래스 추가 (활성화된 스타일 적용)
            button.classList.add('active-tab');
    
            // 모든 탭 콘텐츠 숨기기
            document.querySelectorAll('.tab-content2').forEach(tab => tab.classList.remove('active'));
    
            // 클릭한 버튼의 data-tab 속성 값에 해당하는 탭 콘텐츠 보이기
            const targetTab = document.getElementById(button.dataset.tab);
            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });
    

    // Drag and Drop 기능 추가
    function addDragAndDrop() {
        let draggedItem = null;

        document.addEventListener('dragstart', e => {
            if (e.target.closest('#waiting-list-container')) {
                draggedItem = e.target;
                setTimeout(() => {
                    e.target.classList.add('draggable');
                }, 0);
            }
        });

        document.addEventListener('dragend', e => {
            if (e.target.closest('#waiting-list-container')) {
                e.target.classList.remove('draggable');
                draggedItem = null;
            }
        });

        document.addEventListener('dragover', e => {
            e.preventDefault();
            const container = e.target.closest('#waiting-list-container');
            if (container && draggedItem) {
                const afterElement = getDragAfterElement(container, e.clientY);
                if (afterElement == null) {
                    container.appendChild(draggedItem);
                } else {
                    container.insertBefore(draggedItem, afterElement);
                }
            }
        });

        function getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll('[draggable]:not(.draggable)')];

            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        }
    }

    // 채팅 봇 초기화
    const chatBot = document.getElementById('chat-bot');
    const chatBotMessages = document.getElementById('chat-bot-messages');
    const chatBotInput = document.getElementById('chat-bot-input');
    const chatBotSend = document.getElementById('chat-bot-send');
    chatBot.classList.remove('hidden');

    // GitHub Copilot 연동 로직
    async function callCopilotAPI(question) {
        const response = await fetch('https://api.github.com/copilot-api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_GITHUB_COPILOT_TOKEN' // GitHub Copilot API 토큰을 여기에 입력하세요
            },
            body: JSON.stringify({ question })
        });
        const data = await response.json();
        return data.answer;
    }

    // 채팅 봇 메시지 추가 함수
    function addChatBotMessage(message, isUser) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('p-2', 'mb-2', 'rounded');
        messageElement.classList.add(isUser ? 'bg-blue-100' : 'bg-gray-100');
        messageElement.textContent = message;
        chatBotMessages.appendChild(messageElement);
        chatBotMessages.scrollTop = chatBotMessages.scrollHeight;
    }

    // 채팅 봇 전송 버튼 이벤트
    chatBotSend.addEventListener('click', async () => {
        const userInput = chatBotInput.value.trim();
        if (userInput) {
            addChatBotMessage(userInput, true);
            const answer = await callCopilotAPI(userInput);
            addChatBotMessage(`추천 진료과: ${answer}`, false);
            chatBotInput.value = '';
        }
    });

    // 엔터키로 전송
    chatBotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            chatBotSend.click();
        }
    });

    // 데이터 로드
    loadData();
});