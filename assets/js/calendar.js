// Calendar Initialization with Fullscreen View, Time Input, Date Range, Task Management, and Linked Tasks
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
        calendarContainer.className = 'w-full h-screen mx-auto p-4 relative'; // Set full width and height

        // Create an SVG container for lines
        const svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgContainer.setAttribute("class", "absolute top-0 left-0 w-full h-full pointer-events-none");
        svgContainer.setAttribute("xmlns", "http://www.w3.org/2000/svg");

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
        dates.className = 'grid grid-cols-7 text-center relative';

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const dateElements = {}; // Track elements by date key for linking

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
            dateElements[dateKey] = dateDiv; // Store reference for linking

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

        // Link tasks between dates
        Object.keys(tasks).forEach(dateKey => {
            const [year, month, day] = dateKey.split('-').map(Number);
            const taskList = tasks[dateKey];

            taskList.forEach(task => {
                const linkedDates = Object.keys(tasks).filter(key =>
                    key !== dateKey && tasks[key].includes(task));

                linkedDates.forEach(linkedKey => {
                    const linkedElement = dateElements[linkedKey];
                    const currentElement = dateElements[dateKey];
                    if (linkedElement && currentElement) {
                        const rect1 = currentElement.getBoundingClientRect();
                        const rect2 = linkedElement.getBoundingClientRect();
                        const x1 = rect1.left + rect1.width / 2;
                        const y1 = rect1.top + rect1.height / 2;
                        const x2 = rect2.left + rect2.width / 2;
                        const y2 = rect2.top + rect2.height / 2;

                        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                        line.setAttribute("x1", x1);
                        line.setAttribute("y1", y1);
                        line.setAttribute("x2", x2);
                        line.setAttribute("y2", y2);
                        line.setAttribute("stroke", "blue");
                        line.setAttribute("stroke-width", "2");
                        svgContainer.appendChild(line);
                    } else {
                        console.warn(`Missing date element for key: ${linkedKey} or ${dateKey}`);
                    }
                });
            });
        });


        // Append sections to the calendar container
        calendarContainer.appendChild(header);
        calendarContainer.appendChild(daysOfWeek);
        calendarContainer.appendChild(dates);
        calendarContainer.appendChild(svgContainer); // Add lines
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

        const timeInput = document.createElement('input');
        timeInput.type = 'time';
        timeInput.className = 'border w-full p-2 mb-4';

        const taskTextarea = document.createElement('textarea');
        taskTextarea.className = 'border w-full p-2 mb-4';
        taskTextarea.placeholder = 'Add a detailed task (300+ characters supported)';
        taskTextarea.rows = 5;

        const saveBtn = document.createElement('button');
        saveBtn.className = 'bg-blue-500 text-white py-2 px-4 rounded w-full';
        saveBtn.innerText = 'Save Task';
        saveBtn.onclick = () => {
            const newTask = taskTextarea.value.trim();
            const time = timeInput.value.trim();
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
                saveTasks(); // Save to local storage
                modal.remove();
                renderCalendar(currentMonth, currentYear); // Refresh the calendar to show the new task
            }
        };

        modalContent.appendChild(modalHeader);
        modalContent.appendChild(taskList);
        modalContent.appendChild(fromDateInput);
        modalContent.appendChild(toDateInput);
        modalContent.appendChild(timeInput);
        modalContent.appendChild(taskTextarea);
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
