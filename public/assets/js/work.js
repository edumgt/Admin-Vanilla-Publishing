import {

    createSaveButton,
    createCloseButton
} from './common.js';

const hotel = {
    floors: 10,
    roomsPerFloor: 20,
    reservations: {}

};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        //const response = await fetch('assets/mock/hotel.json');
        const response = await fetch('/api/bookings');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        hotel.reservations = await response.json();
    } catch (error) {
        console.error('Failed to fetch reservation data:', error);
        hotel.reservations = {};
    }
    const controlPanel = document.createElement('div');
    controlPanel.id = 'control-panel';
    controlPanel.style.marginTop = '10px';

    const tabContainer = document.createElement('div');
    tabContainer.id = 'tab-container';
    tabContainer.style.display = 'flex';
    tabContainer.style.gap = '10px';



    for (let i = 1; i <= hotel.floors; i++) {
        const tabButton = document.createElement('button');
        tabButton.className = 'tab-button2';
        tabButton.innerText = `Floor ${i}`;
        tabButton.addEventListener('click', () => {
            const selectedDate = document.getElementById('date-select').value;
            renderFloor(i, selectedDate);
            document.querySelectorAll('.tab-button2').forEach(btn => btn.classList.remove('active-tab'));
            tabButton.classList.add('active-tab');
        });
        if (i === 1) tabButton.classList.add('active-tab');
        tabContainer.appendChild(tabButton);
    }

    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.id = 'date-select';

    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;

    dateInput.addEventListener('change', () => {
        const activeTab = document.querySelector('.tab-button2.active-tab');
        if (activeTab) {
            const selectedFloor = parseInt(activeTab.innerText.split(' ')[1]);
            renderFloor(selectedFloor, dateInput.value);
        }
    });

    controlPanel.appendChild(tabContainer);
    controlPanel.appendChild(dateInput);
    //controlPanel.appendChild(dateInput);
    
    //const breadcrumb = document.querySelector('.breadcrumb');
    // if (breadcrumb) {
    //     breadcrumb.insertAdjacentElement('afterend', controlPanel);
    // }
    const contentCon = document.getElementById('content');
    contentCon.insertAdjacentElement('afterbegin', controlPanel);

    //breadcrumb.appendChild(controlPanel);
    renderFloor(1);
});

function renderFloor(floor, date = new Date().toISOString().split('T')[0]) {
    const hotelContainer = document.getElementById('hotel-container');
    hotelContainer.innerHTML = '';

    const floorDiv = document.createElement('div');
    floorDiv.className = 'floor';

    for (let room = 1; room <= hotel.roomsPerFloor; room++) {
        const roomId = `${floor}-${room}`;
        const roomDiv = document.createElement('div');
        roomDiv.className = 'room';

        const roomTitle = document.createElement('div');
        roomTitle.className = 'room-title';
        roomTitle.innerText = roomId;

        const newBadge = document.createElement('span');
        newBadge.className = 'badge';
        newBadge.innerText = 'New';
        newBadge.addEventListener('click', (event) => {
            event.stopPropagation();
            manageReservation(floor, room);
        });
        roomTitle.appendChild(newBadge);
        roomDiv.appendChild(roomTitle);

        const roomInfo = document.createElement('div');
        roomInfo.className = 'room-info';

        const reservations = hotel.reservations[roomId] || [];

        const overlappingReservations = reservations.filter(reservation => {
            return (
                reservation.checkInDate <= date &&
                reservation.checkOutDate >= date
            );
        });

        if (overlappingReservations.length > 0) {
            overlappingReservations.forEach((reservation, index) => {
                const reservationDiv = document.createElement('div');
                reservationDiv.innerHTML = `
                    <p>Guest: ${reservation.guestName}</p>
                    <p>Check-In: ${reservation.checkInDate}</p>
                    <p>Check-Out: ${reservation.checkOutDate}</p>
                    <p>Arrival Time: ${reservation.arrivalTime || 'N/A'}</p>
                    <p>Departure Time: ${reservation.departureTime || 'N/A'}</p>
                    <p>Cost: $${reservation.cost}</p>
                `;


                const deleteButton = document.createElement('span');
                deleteButton.innerText = 'X';
                deleteButton.className = 'delete-button bg-yellow-500';

                //console.log(index);
                deleteButton.addEventListener('click', () => {

                    reservations.splice(index, 1);
                    hotel.reservations[roomId] = reservations;

                    showToast(`reserve-cancel`, 'success', lang);
                    renderFloor(floor, date);
                });

                reservationDiv.appendChild(deleteButton);
                reservationDiv.classList.add('reservation-item');
                roomInfo.appendChild(reservationDiv);
            });
        } else {
            roomInfo.innerText = 'No Reservation';
        }

        roomDiv.appendChild(roomInfo);

        floorDiv.appendChild(roomDiv);
    }

    hotelContainer.appendChild(floorDiv);
}


function manageReservation(floor, room) {
    const roomId = `${floor}-${room}`;
    const reservations = hotel.reservations[roomId] || [];

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>예약 추가 Room ${roomId}</h2>
            <label>Guest Name:</label>
            <input type="text" id="guestName" value="" />
            <label>Check-In Date (YYYY-MM-DD):</label>
            <input type="date" id="checkInDate" />
            <label>Check-Out Date (YYYY-MM-DD):</label>
            <input type="date" id="checkOutDate" />
            <label>Arrival Time (HH:MM):</label>
            <input type="time" id="arrivalTime" value="00:00" />
            <label>Departure Time (HH:MM):</label>
            <input type="time" id="departureTime" value="00:00" />
            <label>Cost:</label>
            <input type="number" id="cost" value="" />
            <div id="btnContainer"></div>
            
        </div>
    `;

    document.body.appendChild(modal);

    const saveButton = createSaveButton();
    saveButton.classList.add("mr-2");

    const closeButton = createCloseButton();

    document.getElementById('btnContainer').appendChild(saveButton);
    document.getElementById('btnContainer').appendChild(closeButton);

    saveButton.addEventListener('click', () => {
        const guestName = document.getElementById('guestName').value;
        const checkInDate = document.getElementById('checkInDate').value;
        const checkOutDate = document.getElementById('checkOutDate').value;
        const arrivalTime = document.getElementById('arrivalTime').value;
        const departureTime = document.getElementById('departureTime').value;
        const cost = parseFloat(document.getElementById('cost').value);

        if (!guestName || !checkInDate || !checkOutDate || isNaN(cost)) {
            showToast('required-input', 'warning', lang);
            return;
        }

        if (!isValidDate(checkInDate) || !isValidDate(checkOutDate)) {
            showToast('invalid-date-format', 'warning', lang);
            return;
        }

        const overlappingReservations = reservations.filter(reservation => {
            return (
                reservation.checkInDate <= checkOutDate &&
                reservation.checkOutDate >= checkInDate
            );
        });

        if (overlappingReservations.length > 0) {
            showToast('The selected dates overlap with an existing reservation.');
            return;
        }

        const newReservation = {
            guestName,
            checkInDate,
            checkOutDate,
            arrivalTime,
            departureTime,
            cost,
        };

        reservations.push(newReservation);
        hotel.reservations[roomId] = reservations;

        //let lang = localStorage.getItem('lang') || 'ko';

        showToast('well-done', 'success', lang);
        document.body.removeChild(modal);
        renderFloor(floor);
    });

    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}


// Helper function to validate date
function isValidDate(date) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date) && !isNaN(new Date(date).getTime());
}

const container = document.createElement('div');
container.id = 'hotel-container';
document.body.appendChild(container);
