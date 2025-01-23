const calendar = (() => {
    const calendarContainer = document.getElementById('calendar');
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    let today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    //const tasks = JSON.parse(localStorage.getItem('calendarTasks')) || {};
    let tasks = {}; 

    const saveTasks = () => {
        localStorage.setItem('calendarTasks', JSON.stringify(tasks));
    };

    

    const renderCalendar = (month, year) => {
        calendarContainer.innerHTML = '';
        calendarContainer.className = 'w-full h-screen';

        const header = document.createElement('div');
        header.className = 'calendar-header flex justify-between items-center py-2 bg-gray-100';

        const prevBtn = document.createElement('i');
        prevBtn.className = 'bx bx-chevron-left text-lg cursor-pointer';
        prevBtn.onclick = () => changeMonth(-1);

        const nextBtn = document.createElement('i');
        nextBtn.className = 'bx bx-chevron-right text-lg cursor-pointer';
        nextBtn.onclick = () => changeMonth(1);

        const title = document.createElement('div');
        title.className = 'calendar-title text-lg ';
        title.innerText = `${monthNames[month]} ${year}`;

        header.appendChild(prevBtn);
        header.appendChild(title);
        header.appendChild(nextBtn);

        const daysOfWeek = document.createElement('div');
        daysOfWeek.className = 'grid grid-cols-7 bg-blue-200 text-center  font-light';
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayNames.forEach(day => {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'py-2';
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
            dateDiv.className = 'py-10 px-4 border cursor-pointer relative';
            dateDiv.innerHTML = `<div class="text-md  absolute top-2 left-2">${day}</div>`;

            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            dateElements[dateKey] = dateDiv;

            if (tasks[dateKey]) {
                const taskList = document.createElement('ul');
                taskList.className = 'mt-4 text-left text-lg text-gray-800';
                tasks[dateKey].forEach((task, index) => {
                    const taskItem = document.createElement('li');
                    taskItem.className = 'border-b py-2 flex justify-between items-center';
                    const taskText = document.createElement('span');
                    taskText.innerText = `- ${task}`;
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'text-red-500 ml-4';
                    deleteBtn.innerText = 'X';
                    deleteBtn.onclick = () => {
                        tasks[dateKey].splice(index, 1);
                        if (tasks[dateKey].length === 0) {
                            delete tasks[dateKey];
                        }
                        saveTasks();
                        renderCalendar(currentMonth, currentYear);
                    };
                    taskItem.appendChild(taskText);
                    taskItem.appendChild(deleteBtn);
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
        //console.log('Changing to month:', monthNames[currentMonth], 'Year:', currentYear);
        renderCalendar(currentMonth, currentYear);
    };

    const openTaskModal = (day, month, year) => {

        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        const existingTasks = tasks[dateKey] || [];

        const modal = document.createElement('div');
        modal.className = 'z-50 task-modal fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center';

        const modalContent = document.createElement('div');
        modalContent.className = 'bg-white rounded-lg p-6 w-96';

        const modalHeader = document.createElement('div');
        modalHeader.className = 'flex justify-between items-center mb-4';

        const modalTitle = document.createElement('h3');
        modalTitle.className = 'text-lg font-bold';
        modalTitle.innerText = `Tasks for ${monthNames[month]} ${day}, ${year}`;

        const closeModal = document.createElement('i');
        closeModal.className = 'fas fa-times cursor-pointer';
        closeModal.onclick = () => modal.remove();

        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeModal);

        const taskList = document.createElement('ul');
        taskList.className = 'task-list mb-4 text-left text-lg text-gray-800';
        existingTasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.className = 'border-b py-2 flex justify-between items-center';
            const taskText = document.createElement('span');
            taskText.innerText = task;

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'text-red-500 ml-4 text-2xl font-bold';
            deleteBtn.innerText = 'x';
            deleteBtn.onclick = () => {
                tasks[dateKey].splice(index, 1);
                if (tasks[dateKey].length === 0) {
                    delete tasks[dateKey];
                }
                saveTasks();
                showToast('해당 업무를 삭제하였습니다.');
                modal.remove();
                renderCalendar(currentMonth, currentYear);
                openTaskModal(day, month, year);
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
        taskTextarea.placeholder = 'Add a detailed task';
        taskTextarea.rows = 5;

        const saveBtn = document.createElement('button');
        saveBtn.className = 'bg-blue-500 text-white px-3 py-1 rounded w-full';
        saveBtn.innerText = 'Save Task';
        saveBtn.onclick = () => {
            const newTask = taskTextarea.value.trim();
            const time = timeSelect.value;
            const fromDate = new Date(fromDateInput.value);
            const toDate = new Date(toDateInput.value);

            if (newTask && time && fromDate <= toDate) {
                let currentDate = fromDate;
                while (currentDate <= toDate) {
                    const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
                    if (!tasks[dateKey]) tasks[dateKey] = [];
                    tasks[dateKey].push(`${time} - ${newTask}`);
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
            const response = await fetch('assets/mock/calendar.json'); // Fetch from calendar.json
            //console.log(response);
            if (!response.ok) {
                throw new Error(`Failed to fetch tasks: ${response.statusText}`);
            }
            tasks = await response.json(); // Parse the JSON data
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    
    
    return {
        init: async () => {
            await fetchTasks(); // Ensure tasks are fetched before rendering
            renderCalendar(currentMonth, currentYear); // Render calendar only after data is fetched
        }
    };
})();

window.onload = () => {
    calendar.init();
};
