document.addEventListener('DOMContentLoaded', () => {
    const monthYear = document.getElementById('monthYear');
    const dates = document.getElementById('dates');
    const prevMonth = document.getElementById('prevMonth');
    const nextMonth = document.getElementById('nextMonth');
    const modal = document.getElementById('modal');
    const modalSt = document.getElementById('modalSt');
    const lectureForm = document.getElementById('lectureForm');
    const timeInput = document.getElementById('time');
    const courseInput = document.getElementById('course');
    const instructorInput = document.getElementById('instructor');
    const closeModal = document.getElementById('closeModal');
    const closeModal2 = document.getElementById('closeModal2');
    const addStudentBtn = document.getElementById('addStudentBtn');
    const studentsContainer = document.getElementById('studentsContainer');
    const studentList = document.getElementById('studentList');

    let current = new Date();
    let selectedDate = '';
    let selectedLecture = null;

    function renderCalendar(data) {
        dates.innerHTML = '';
        const year = current.getFullYear();
        const month = current.getMonth();

        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        monthYear.textContent = `${year}년 ${month + 1}월`;

        for (let i = 0; i < firstDay; i++) {
            dates.innerHTML += '<div class="date"></div>';
        }

        for (let i = 1; i <= lastDate; i++) {
            const dateDiv = document.createElement('div');
            dateDiv.classList.add('date', 'border', 'border-gray-300', 'p-2', 'flex', 'flex-col', 'items-start');
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            dateDiv.setAttribute('data-date', dateStr);
            dateDiv.ondrop = drop;
            dateDiv.ondragover = allowDrop;

            const dateNumber = document.createElement('span');
            dateNumber.classList.add('date-number');
            dateNumber.textContent = i;
            dateDiv.appendChild(dateNumber);

            const newButton = document.createElement('button');
            newButton.classList.add('new-button');
            newButton.textContent = 'New';
            newButton.onclick = () => openModal(dateStr);
            dateDiv.appendChild(newButton);

            const dailyLectures = data.lectures.find(lecture => lecture.date === dateStr);

            if (dailyLectures) {
                const lectureList = document.createElement('ul');
                lectureList.classList.add('list-none', 'p-0', 'w-full', 'overflow-y-auto', 'max-h-32');
                dailyLectures.schedule.forEach((lecture, index) => {
                    const lectureItem = document.createElement('li');
                    lectureItem.classList.add('bg-gray-100', 'm-1', 'p-1', 'border', 'border-gray-200', 'text-sm', 'relative', 'cursor-pointer');
                    lectureItem.setAttribute('draggable', 'true');
                    lectureItem.ondragstart = drag;
                    lectureItem.ondragend = endDrag;
                    lectureItem.onclick = () => showModal(lecture.students, lecture);
                    lectureItem.setAttribute('data-date', dateStr);
                    lectureItem.setAttribute('data-index', index);
                    lectureItem.textContent = `${lecture.time}: ${lecture.course} by ${lecture.instructor}`;

                    const dragIcon = document.createElement('span');
                    dragIcon.classList.add('custom-drag-icon');
                    dragIcon.innerHTML = '⇔';
                    lectureItem.appendChild(dragIcon);

                    if (lecture.pastDate) {
                        const pastDate = document.createElement('div');
                        pastDate.classList.add('past-date');
                        pastDate.textContent = `Moved from: ${lecture.pastDate}`;
                        lectureItem.appendChild(pastDate);
                    }

                    lectureList.appendChild(lectureItem);
                });
                dateDiv.appendChild(lectureList);
            }

            dates.appendChild(dateDiv);
        }
    }

    function allowDrop(event) {
        event.preventDefault();
    }

    function drag(event) {
        event.dataTransfer.setData('text', event.target.getAttribute('data-date') + ',' + event.target.getAttribute('data-index'));
        event.target.classList.add('dragging');
    }

    function endDrag(event) {
        event.target.classList.remove('dragging');
    }

    function drop(event) {
        event.preventDefault();
        const data = event.dataTransfer.getData('text').split(',');
        const fromDate = data[0];
        const fromIndex = parseInt(data[1], 10);
        const toDate = event.target.closest('.date').getAttribute('data-date');

        if (fromDate === toDate) return; // 같은 날짜로 이동 불가

        let lecturesData = JSON.parse(localStorage.getItem('lecturesData'));
        if (!lecturesData) return;

        const fromDailyLectures = lecturesData.lectures.find(lecture => lecture.date === fromDate);
        const toDailyLectures = lecturesData.lectures.find(lecture => lecture.date === toDate) || { date: toDate, schedule: [] };

        const lecture = fromDailyLectures.schedule.splice(fromIndex, 1)[0];
        lecture.pastDate = fromDate; // 과거 일자 추가
        toDailyLectures.schedule.push(lecture);

        if (!lecturesData.lectures.find(lecture => lecture.date === toDate)) {
            lecturesData.lectures.push(toDailyLectures);
        }

        localStorage.setItem('lecturesData', JSON.stringify(lecturesData));
        renderCalendar(lecturesData);
    }

    function openModal(date) {
        selectedDate = date;
        modal.classList.remove('hidden');
    }

    function closeModalFunc() {
        modal.classList.add('hidden');
    }

    function closeModalFunc2() {
        modalSt.classList.add('hidden');
    }

    function showModal(students, lecture) {
        studentList.innerHTML = ''; 
        if (students && students.length > 0) {
            students.forEach(student => {
                const studentItem = document.createElement('li');
                studentItem.textContent = `${student.name}, ${student.university}, ${student.year} year, Major: ${student.major}`;
                studentList.appendChild(studentItem);
            });
            modalSt.classList.remove('hidden');
        } else {
            selectedLecture = lecture;
            modal.classList.remove('hidden');
        }
    }

    lectureForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const time = timeInput.value;
        const course = courseInput.value;
        const instructor = instructorInput.value;
        const students = [];

        // Collect student data
        const studentEntries = document.querySelectorAll('.student-entry');
        studentEntries.forEach(entry => {
            const name = entry.querySelector('.student-name').value;
            const university = entry.querySelector('.student-university').value;
            const year = entry.querySelector('.student-year').value;
            const major = entry.querySelector('.student-major').value;

            if (name && university && year && major) {
                students.push({ name, university, year: parseInt(year, 10), major });
            }
        });

        if (!time || !course || !instructor) {
            showToast('정보를 모두 입력하세요');
            return;
        }

        let lecturesData = JSON.parse(localStorage.getItem('lecturesData')) || { lectures: [] };
        let dailyLectures = lecturesData.lectures.find(lecture => lecture.date === selectedDate);

        if (!dailyLectures) {
            dailyLectures = { date: selectedDate, schedule: [] };
            lecturesData.lectures.push(dailyLectures);
        }

        dailyLectures.schedule.push({ time, course, instructor, students });

        localStorage.setItem('lecturesData', JSON.stringify(lecturesData));
        renderCalendar(lecturesData);
        closeModalFunc();
    });

    closeModal.addEventListener('click', closeModalFunc);
    closeModal2.addEventListener('click', closeModalFunc2);

    addStudentBtn.addEventListener('click', () => {
        const studentEntry = document.createElement('div');
        studentEntry.classList.add('student-entry', 'mb-2');
        studentEntry.innerHTML = `
            <label class="block mb-1">Student Name:</label>
            <input type="text" class="student-name block w-full mb-2 p-2 border rounded">
            <label class="block mb-1">University:</label>
            <input type="text" class="student-university block w-full mb-2 p-2 border rounded">
            <label class="block mb-1">Year:</label>
            <input type="number" class="student-year block w-full mb-2 p-2 border rounded">
            <label class="block mb-1">Major:</label>
            <input type="text" class="student-major block w-full mb-2 p-2 border rounded">
        `;
        studentsContainer.appendChild(studentEntry);
    });

    function fetchData() {
        let lecturesData = JSON.parse(localStorage.getItem('lecturesData'));
        if (!lecturesData) {
            fetch('assets/mock/lectures.json')
                .then(response => response.json())
                .then(data => {
                    localStorage.setItem('lecturesData', JSON.stringify(data));
                    renderCalendar(data);
                })
                .catch(error => console.error('Error fetching data:', error));
        } else {
            renderCalendar(lecturesData);
        }
    }

    prevMonth.addEventListener('click', () => {
        current.setMonth(current.getMonth() - 1);
        fetchData();
    });

    nextMonth.addEventListener('click', () => {
        current.setMonth(current.getMonth() + 1);
        fetchData();
    });

    fetchData();
});