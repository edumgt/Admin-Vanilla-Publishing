import {
    createSearchButton
} from './common.js';

const searchButton = createSearchButton();
document.getElementById('btnContainer').appendChild(searchButton);

const roomsData = {
    rooms: [
        { name: "Meeting Room #1", seats: 5, bookings: [] },
        { name: "Meeting Room #2", seats: 8, bookings: [] },
        { name: "Meeting Room #3", seats: 20, bookings: [] },
        { name: "Meeting Room #4", seats: 20, bookings: [] },
        { name: "Meeting Room #5", seats: 20, bookings: [] }
    ]
};

if (!localStorage.getItem('roomBookings')) {
    localStorage.setItem('roomBookings', JSON.stringify(roomsData));
}

function fetchBookings() {
    const bookings = localStorage.getItem('roomBookings');
    return bookings ? JSON.parse(bookings) : { rooms: [] };
}

function saveBookings(data) {
    localStorage.setItem('roomBookings', JSON.stringify(data));
}

function displayRooms(dateFilter = null) {
    const container = document.getElementById('rooms-container');
    container.innerHTML = '';

    const data = fetchBookings();
    const currentTime = new Date().toISOString().slice(0, 16);

    data.rooms.forEach(room => {
        const card = document.createElement('div');
        card.className = 'bg-white p-4 rounded-md shadow-md text-sm';
        card.innerHTML = `
                <h2 class="text-md font-bold mb-2">${room.name}</h2>
                <p class="text-sm mb-2">Seats: ${room.seats}</p>
                <div id="timeslots-${room.name}">
                    ${generateTimeslots(room, dateFilter, currentTime)}
                </div>
            `;
        container.appendChild(card);
    });
}

export function openModal(roomName, action, timeSlotOrIndex) {
    document.getElementById('modal-title').textContent = `${action} Booking for ${roomName}`;
    document.getElementById('room-name').value = roomName;
    document.getElementById('booking-form').dataset.action = action;
    if (action === 'Update') {
        const data = fetchBookings();
        const booking = data.rooms.find(room => room.name === roomName).bookings[timeSlotOrIndex];
        document.getElementById('date').value = booking.date;
        document.getElementById('startTime').value = booking.startTime;
        document.getElementById('endTime').value = booking.endTime;
        document.getElementById('meeting-title').value = booking.title || '';
        document.getElementById('meeting-description').value = booking.description || '';
        document.getElementById('booking-form').dataset.bookingIndex = timeSlotOrIndex;
    } else {
        document.getElementById('booking-form').reset();
        const date = document.getElementById('search-date').value;
        document.getElementById('date').value = date;
        document.getElementById('startTime').value = timeSlotOrIndex;
        document.getElementById('endTime').value = `${parseInt(timeSlotOrIndex.split(':')[0]) + 1}:00`;
        document.getElementById('booking-form').dataset.bookingIndex = '';
        populateTimeOptions();
    }
    document.getElementById('booking-modal').classList.remove('hidden');
}



function generateTimeslots(room, dateFilter = null, currentTime) {
    let timeslots = '';
    let hour = 8;
    while (hour < 20) {
        const startTime = `${hour.toString().padStart(2, '0')}:00`;
        let endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
        let booking = room.bookings.find(b => b.date === dateFilter && b.startTime === startTime);


        if (booking) {
            endTime = booking.endTime;
            hour = parseInt(booking.endTime.split(':')[0]);

            const isPastMeeting = new Date(`${dateFilter}T${endTime}`).getTime() < new Date(currentTime).getTime();
            const buttonLabel = isPastMeeting ? '회의록' : 'Update';
            const buttonClass = isPastMeeting ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600';

            timeslots += `
                    <div class="flex justify-between py-1 border-b border-gray-200">
                        <span>${startTime} - ${endTime} (${booking.title})</span>
                        <button onclick="${isPastMeeting ? `openNotesModal(${room.bookings.indexOf(booking)})` : `openModal('${room.name}', 'Update', ${room.bookings.indexOf(booking)})`}" class="${buttonClass} text-white">${buttonLabel}</button>
                    </div>
                `;
        } else {
            timeslots += `
                    <div class="flex justify-between py-1 border-b border-gray-200">
                        <span>${startTime} - ${endTime}</span>
                        <button onclick="openModal('${room.name}', 'New', '${startTime}')" class="bg-blue-500 text-white">Add</button>
                    </div>
                `;
            hour++;
        }
    }
    return timeslots;
}

searchButton.addEventListener('click', function () {
    const selectedDate = document.getElementById('search-date').value;
    displayRooms(selectedDate);
})



function populateTimeOptions() {
    const startTimeSelect = document.getElementById('startTime');
    const endTimeSelect = document.getElementById('endTime');
    startTimeSelect.innerHTML = '';
    endTimeSelect.innerHTML = '';

    for (let hour = 8; hour < 20; hour++) {
        const timeOption = document.createElement('option');
        timeOption.value = `${hour.toString().padStart(2, '0')}:00`;
        timeOption.textContent = `${hour.toString().padStart(2, '0')}:00`;
        startTimeSelect.appendChild(timeOption);

        const endTimeOption = document.createElement('option');
        endTimeOption.value = `${(hour + 1).toString().padStart(2, '0')}:00`;
        endTimeOption.textContent = `${(hour + 1).toString().padStart(2, '0')}:00`;
        endTimeSelect.appendChild(endTimeOption);
    }
}

export function closeModal() {
    document.getElementById('booking-modal').classList.add('hidden');
}

export function closeWarningModal() {
    document.getElementById('warning-modal').classList.add('hidden');
}

export function openNotesModal(bookingIndex) {
    const data = fetchBookings();
    const booking = data.rooms.flatMap(room => room.bookings)[bookingIndex];
    document.getElementById('notes-modal-title').textContent = `Meeting Notes for ${booking.title}`;
    document.getElementById('meeting-notes').value = booking.notes || '';
    document.getElementById('meeting-notes-modal').dataset.bookingIndex = bookingIndex;
    document.getElementById('meeting-notes-modal').classList.remove('hidden');

    const stackedit = new Stackedit();
    stackedit.openFile({
        content: {
            text: document.getElementById('meeting-notes').value,
        },
    });

    stackedit.on('fileChange', (file) => {
        document.getElementById('meeting-notes').value = file.content.text;
        document.getElementById('meeting-notes-preview').innerHTML = file.content.html;
    });

    stackedit.on('close', () => {
        saveMeetingNotes();
    });
}

export function closeNotesModal() {
    document.getElementById('meeting-notes-modal').classList.add('hidden');
}

window.openModal = openModal;
window.closeModal = closeModal;
window.openNotesModal = openNotesModal;
window.closeWarningModal = closeWarningModal;

function saveMeetingNotes() {
    const bookingIndex = document.getElementById('meeting-notes-modal').dataset.bookingIndex;
    const notes = document.getElementById('meeting-notes').value;

    const data = fetchBookings();
    const booking = data.rooms.flatMap(room => room.bookings)[bookingIndex];
    booking.notes = notes;

    saveBookings(data);
    closeNotesModal();
}

document.getElementById('booking-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const roomName = document.getElementById('room-name').value;
    const date = document.getElementById('date').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const title = document.getElementById('meeting-title').value;
    const description = document.getElementById('meeting-description').value;
    const action = event.target.dataset.action;
    const bookingIndex = event.target.dataset.bookingIndex;

    const data = fetchBookings();

    const conflictingBooking = data.rooms.some(room =>
        room.bookings.some(booking =>
            booking.title === title && booking.date === date &&
            ((startTime >= booking.startTime && startTime < booking.endTime) ||
                (endTime > booking.startTime && endTime <= booking.endTime) ||
                (startTime <= booking.startTime && endTime >= booking.endTime))
        )
    );

    if (conflictingBooking) {
        closeModal();
        document.getElementById('warning-modal').classList.remove('hidden');

        return;
    }

    const room = data.rooms.find(room => room.name === roomName);
    if (action === 'New') {
        room.bookings.push({ date, startTime, endTime, title, description });
    } else if (action === 'Update') {
        room.bookings[bookingIndex] = { date, startTime, endTime, title, description };
    }

    saveBookings(data);
    closeModal();
    displayRooms(date);
});



document.addEventListener('DOMContentLoaded', function () {
    const today = new Date().toISOString().slice(0, 10);
    document.getElementById('search-date').value = today;
    displayRooms(today);
});

