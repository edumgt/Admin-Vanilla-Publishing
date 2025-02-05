const calendar = (() => {
    const calendarContainer = document.getElementById('calendar');

    let today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    let tasks = {}; // tasks 변수를 객체로 초기화
    let newTasks = {}; // 새로 추가된 이벤트를 추적

    const saveTasks = async () => {
        try {
            for (const [date, events] of Object.entries(newTasks)) {
                
                const dateId = await saveDate(date);
                
                
                
                for (const event of events) {
                    
                    const [time, description, eventId] = event.split(' - ');
                    await saveEvent(dateId, time, description, eventId);
                }
            }

            // 이벤트가 저장된 후 newTasks를 초기화하여 다음 새 이벤트를 추적
            newTasks = {};

            showToast('well-done', 'success', lang);
        } catch (error) {
            console.error('Error saving tasks:', error);
        }
    };

    const saveDate = async (date) => {
        try {
            const response = await fetch('/api/addDate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ date })
            });

            if (!response.ok) {
                throw new Error(`Failed to add date: ${response.statusText}`);
            }

            const data = await response.json();
            return data.dateId; // 반환된 dateId
        } catch (error) {
            console.error('Error adding date:', error);
            throw error;
        }
    };

    const saveEvent = async (dateId, time, description, eventId) => {
        try {
            const response = await fetch('/api/addEvent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ date_id: dateId, time, description , event_id: eventId})
            });

            if (!response.ok) {
                throw new Error(`Failed to add event: ${response.statusText}`);
            }

            const data = await response.json();
            return data.eventId; // 반환된 eventId
        } catch (error) {
            console.error('Error adding event:', error);
            throw error;
        }
    };

    const deleteEvent = async (eventId) => {
        try {
            console.log(`Deleting event with ID: ${eventId}`); // 확인용 로그
            const response = await fetch(`/api/deleteEvent/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to delete event: ${response.statusText}`);
            }

            const data = await response.json();
            return data.success;
        } catch (error) {
            console.error('Error deleting event:', error);
            throw error;
        }
    };

    const renderCalendar = (month, year) => {
        calendarContainer.innerHTML = '';
        calendarContainer.className = 'w-full h-full mt-4';

        const header = document.createElement('div');
        header.className = 'calendar-header flex justify-between items-center py-2 p-2 bg-gray-100';

        const prevBtn = document.createElement('button');
        prevBtn.className = 'bg-blue-500  text-white';
        prevBtn.innerHTML = "&lt;";
        prevBtn.onclick = () => changeMonth(-1);

        const nextBtn = document.createElement('button');
        nextBtn.className = 'bg-blue-500  text-white';
        nextBtn.innerHTML = "&gt;";
        nextBtn.onclick = () => changeMonth(1);

        const title = document.createElement('div');
        title.className = 'text-base text-gray-600';
        title.innerText = `${year}년 ${month + 1}월`;

        header.appendChild(prevBtn);
        header.appendChild(title);
        header.appendChild(nextBtn);

        const daysOfWeek = document.createElement('div');
        daysOfWeek.className = 'grid grid-cols-7 text-center';
        const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
        dayNames.forEach(day => {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day-header';
            dayDiv.innerText = day;
            daysOfWeek.appendChild(dayDiv);
        });

        const dates = document.createElement('div');
        dates.className = 'grid grid-cols-7 text-center relative';

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const dateElements = {};

        for (let i = 0; i < firstDay; i++) {
            const blank = document.createElement('div');
            blank.className = 'py-4';
            dates.appendChild(blank);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateDiv = document.createElement('div');
            dateDiv.className = 'py-6 px-4 border cursor-pointer relative';
            dateDiv.innerHTML = `<div class="text-md absolute top-2 left-2">${day}</div>`;

            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            dateElements[dateKey] = dateDiv;

            if (tasks[dateKey]) {
                const taskList = document.createElement('ul');
                taskList.className = 'mt-4 text-left text-md text-gray-800';

                tasks[dateKey].forEach((task, index) => {
                    const taskItem = document.createElement('li');
                    taskItem.className = 'border-b py-2 flex justify-between items-center';
                    const taskText = document.createElement('span');
                    
                    taskText.innerText = `- ${task}`; 

                    taskItem.appendChild(taskText);
                    taskList.appendChild(taskItem);
                });
                dateDiv.appendChild(taskList);
            }

            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dateDiv.classList.add('bg-gray-100');
            }

            dateDiv.onclick = () => openTaskModal(day, month, year);
            dates.appendChild(dateDiv);
        }
        calendarContainer.appendChild(header);
        calendarContainer.appendChild(daysOfWeek);
        calendarContainer.appendChild(dates);
    };

    const changeMonth = (delta) => {
        currentMonth += delta;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        } else if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    };

    const openTaskModal = (day, month, year) => {
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const existingTasks = tasks[dateKey] || [];

        const modal = document.createElement('div');
        modal.className = 'task-modal fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50';

        const modalContent = document.createElement('div');
        modalContent.className = 'bg-white rounded-lg p-6 w-96';

        const modalHeader = document.createElement('div');
        modalHeader.className = 'flex justify-between items-center mb-4';

        const modalTitle = document.createElement('h3');
        modalTitle.className = 'text-md font-bold';
        modalTitle.innerText = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')} 업무`;

        const closeModal = document.createElement('i');
        closeModal.className = 'fas fa-times cursor-pointer';
        closeModal.onclick = () => modal.remove();

        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeModal);

        const taskList = document.createElement('ul');
        taskList.className = 'task-list mb-4 text-left text-md text-gray-800';

        existingTasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.className = 'border-b py-2 flex justify-between items-center';
            const taskText = document.createElement('span');
            taskText.innerText = task;

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'text-red-500 ml-4 text-2xl font-bold';
            deleteBtn.innerText = 'x';

            deleteBtn.dataset.eventId = taskText.innerText.split(" - ")[2];

            deleteBtn.onclick = async () => {
                await deleteEvent(deleteBtn.dataset.eventId);
                tasks[dateKey].splice(index, 1);
                if (tasks[dateKey].length === 0) {
                    delete tasks[dateKey];
                }

                await saveTasks();
                showToast('select-delete', 'success', lang);
                modal.remove();
                renderCalendar(currentMonth, currentYear);
                
            };

            taskItem.appendChild(taskText);
            taskItem.appendChild(deleteBtn);
            taskList.appendChild(taskItem);
        });

        const fromDateInput = document.createElement('input');
        fromDateInput.type = 'date';
        fromDateInput.className = 'border w-full p-2 mb-4';
        fromDateInput.value = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        const toDateInput = document.createElement('input');
        toDateInput.type = 'date';
        toDateInput.className = 'border w-full p-2 mb-4';
        toDateInput.value = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        const taskTextarea = document.createElement('textarea');
        taskTextarea.className = 'border w-full p-2 mb-4';
        taskTextarea.style.marginTop = '10px';
        taskTextarea.placeholder = ' 업무 일정 추가';
        taskTextarea.rows = 5;

        const saveBtn = document.createElement('button');
        saveBtn.className = 'bg-blue-500 text-white';
        saveBtn.innerText = '저장';
        saveBtn.onclick = () => {
            const newTask = taskTextarea.value.trim();
            const time = timeSelect.value;
            const fromDate = new Date(fromDateInput.value);
            const toDate = new Date(toDateInput.value);

            const now = new Date();
            
            const eventId = generateNanoId();
            


            if (newTask && time && fromDate <= toDate) {
                let currentDate = fromDate;
                while (currentDate <= toDate) {
                    const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
                    if (!tasks[dateKey]) {
                        tasks[dateKey] = [];
                    }
                    tasks[dateKey].push(`${time} - ${newTask} - ${eventId}`);

                    if (!newTasks[dateKey]) {
                        newTasks[dateKey] = [];
                    }
                    
                    
                    newTasks[dateKey].push(`${time} - ${newTask} - ${eventId}`);

                    currentDate.setDate(currentDate.getDate() + 1);
                }
                saveTasks();
                modal.remove();
                renderCalendar(currentMonth, currentYear);
            }
        };

        const createTimeSelect = () => {
            const timeSelect = document.createElement('select');
            timeSelect.className = 'w-full';

            const times = [];
            for (let hour = 8; hour < 24; hour++) { // Start from 08:00
                for (let minute = 0; minute < 60; minute += 30) {
                    const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                    times.push(time);
                }
            }

            times.forEach(time => {
                const option = document.createElement('option');
                option.value = time;
                option.innerText = time;
                timeSelect.appendChild(option);
            });
            return timeSelect;
        };

        modalContent.appendChild(modalHeader);
        modalContent.appendChild(taskList);
        modalContent.appendChild(fromDateInput);
        modalContent.appendChild(toDateInput);

        const timeSelect = createTimeSelect();
        modalContent.appendChild(timeSelect);

        modalContent.appendChild(taskTextarea);
        modalContent.appendChild(saveBtn);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    };

    const fetchTasks = async () => {
        try {
            const response = await fetch('/api/calendar');
            const data = await response.json();
            console.log(data); // 서버에서 받아온 데이터 구조 확인
            tasks = data || {};
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };


    return {
        init: async () => {
            await fetchTasks();
            renderCalendar(currentMonth, currentYear);
        }
    };
})();

window.onload = () => {
    calendar.init();
};

