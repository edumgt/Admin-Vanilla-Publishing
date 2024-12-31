// Calendar Initialization with Fullscreen View, Time Input, and Task Management
const calendar = (() => {
    const calendarContainer = document.getElementById('calendar');
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    let today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    const tasks = JSON.parse(localStorage.getItem('calendarTasks')) || {}; // Load tasks from local storage

    const saveTasks = () => {
        localStorage.setItem('calendarTasks', JSON.stringify(tasks));
    };

    const renderCalendar = (month, year) => {
        // Clear the existing calendar
        calendarContainer.innerHTML = '';
        calendarContainer.className = 'w-full h-screen mx-auto p-4'; // Set full width and height

        // Header Section
        const header = document.createElement('div');
        header.className = 'calendar-header flex justify-between items-center py-2 bg-gray-100';

        const prevBtn = document.createElement('i');
        prevBtn.className = 'bx bx-chevron-left text-lg cursor-pointer';
        prevBtn.onclick = () => changeMonth(-1);

        const nextBtn = document.createElement('i');
        nextBtn.className = 'bx bx-chevron-right text-lg cursor-pointer';
        nextBtn.onclick = () => changeMonth(1);

        const title = document.createElement('div');
        title.className = 'calendar-title text-lg font-medium';
        title.innerText = `${monthNames[month]} ${year}`;

        header.appendChild(prevBtn);
        header.appendChild(title);
        header.appendChild(nextBtn);

        // Days of Week Section
        const daysOfWeek = document.createElement('div');
        daysOfWeek.className = 'grid grid-cols-7 bg-gray-200 text-center text-xs font-light';
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayNames.forEach(day => {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'py-2';
            dayDiv.innerText = day;
            daysOfWeek.appendChild(dayDiv);
        });

        // Dates Section
        const dates = document.createElement('div');
        dates.className = 'grid grid-cols-7 text-center';

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Add blank days for previous month
        for (let i = 0; i < firstDay; i++) {
            const blank = document.createElement('div');
            blank.className = 'py-4';
            dates.appendChild(blank);
        }

        // Add days of the current month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateDiv = document.createElement('div');
            dateDiv.className = 'py-10 px-4 border cursor-pointer relative';

            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dateDiv.classList.add('bg-blue-500', 'text-white', 'rounded-lg');
            }

            dateDiv.innerHTML = `<div class="text-md font-medium absolute top-2 left-2">${day}</div>`;

            const dateKey = `${year}-${month + 1}-${day}`;
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
                    deleteBtn.innerText = 'x';
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

            dateDiv.onclick = () => openTaskModal(day, month, year);
            dates.appendChild(dateDiv);
        }

        // Append sections to the calendar container
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
        const dateKey = `${year}-${month + 1}-${day}`;
        const existingTasks = tasks[dateKey] || [];

        const modal = document.createElement('div');
        modal.className = 'task-modal fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center';

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
            deleteBtn.className = 'text-red-500 ml-4';
            deleteBtn.innerText = 'x';
            deleteBtn.onclick = () => {
                tasks[dateKey].splice(index, 1);
                if (tasks[dateKey].length === 0) {
                    delete tasks[dateKey];
                }
                saveTasks();
                renderCalendar(currentMonth, currentYear);
                modal.remove();
                openTaskModal(day, month, year);
            };
            taskItem.appendChild(taskText);
            taskItem.appendChild(deleteBtn);
            taskList.appendChild(taskItem);
        });

        const timeInput = document.createElement('input');
        timeInput.type = 'time';
        timeInput.className = 'border w-full p-2 mb-4';

        const taskInput = document.createElement('input');
        taskInput.type = 'text';
        taskInput.className = 'border w-full p-2 mb-4';
        taskInput.placeholder = 'Add a new task';

        const saveBtn = document.createElement('button');
        saveBtn.className = 'bg-blue-500 text-white py-2 px-4 rounded w-full';
        saveBtn.innerText = 'Save Task';
        saveBtn.onclick = () => {
            const newTask = taskInput.value.trim();
            const time = timeInput.value.trim();
            if (newTask && time) {
                if (!tasks[dateKey]) tasks[dateKey] = [];
                tasks[dateKey].push(`${time} - ${newTask}`);
                saveTasks(); // Save to local storage
                modal.remove();
                renderCalendar(currentMonth, currentYear); // Refresh the calendar to show the new task
            }
        };

        modalContent.appendChild(modalHeader);
        modalContent.appendChild(taskList);
        modalContent.appendChild(timeInput);
        modalContent.appendChild(taskInput);
        modalContent.appendChild(saveBtn);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    };

    return {
        init: () => {
            renderCalendar(currentMonth, currentYear);
        }
    };
})();

// Initialize the calendar
window.onload = () => {
    calendar.init();
};
