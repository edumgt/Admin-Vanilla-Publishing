const hotel = {
    floors: 10,
    roomsPerFloor: 20,
    reservations: JSON.parse(localStorage.getItem('hotelReservations')) || {} // Format: { '1-1': { guestName: 'John Doe', checkInDate: '2025-01-04', checkOutDate: '2025-01-05', cost: 100 } }
};

// Function to initialize the UI
document.addEventListener('DOMContentLoaded', () => {
    const controlPanel = document.createElement('div');
    controlPanel.id = 'control-panel';

    const tabContainer = document.createElement('div');
    tabContainer.id = 'tab-container';
    tabContainer.style.display = 'flex';
    tabContainer.style.gap = '5px';

    for (let i = 1; i <= hotel.floors; i++) {
        const tabButton = document.createElement('button');
        tabButton.className = 'tab-button';
        tabButton.innerText = `Floor ${i}`;
        tabButton.addEventListener('click', () => {
            const selectedDate = document.getElementById('date-select').value;
            renderFloor(i, selectedDate);
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active-tab'));
            tabButton.classList.add('active-tab');
        });
        if (i === 1) tabButton.classList.add('active-tab'); // Default active tab for Floor 1
        tabContainer.appendChild(tabButton);
    }

    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.id = 'date-select';
    dateInput.addEventListener('change', () => {
        const activeTab = document.querySelector('.tab-button.active-tab');
        if (activeTab) {
            const selectedFloor = parseInt(activeTab.innerText.split(' ')[1]);
            renderFloor(selectedFloor, dateInput.value);
        }
    });

    controlPanel.appendChild(tabContainer);
    controlPanel.appendChild(dateInput);
    controlPanel.appendChild(dateInput);
    const breadcrumb = document.querySelector('.breadcrumb');
if (breadcrumb) {
    breadcrumb.insertAdjacentElement('afterend', controlPanel);
}

    renderFloor(1); // Initial render for the first floor
});

function renderFloor(floor, date = new Date().toISOString().split('T')[0]) {
    const hotelContainer = document.getElementById('hotel-container');
    hotelContainer.innerHTML = '';

    const floorDiv = document.createElement('div');
    floorDiv.className = 'floor';
    floorDiv.innerHTML = ``;

    for (let room = 1; room <= hotel.roomsPerFloor; room++) {
        const roomId = `${floor}-${room}`;
        const roomDiv = document.createElement('div');
        roomDiv.className = 'room';

        const roomTitle = document.createElement('div');
        roomTitle.className = 'room-title';
        roomTitle.innerText = roomId;
        roomDiv.appendChild(roomTitle);

        const roomInfo = document.createElement('div');
        roomInfo.className = 'room-info';
        const reservation = hotel.reservations[roomId];
        if (reservation && reservation.checkInDate <= date && reservation.checkOutDate >= date) {
            roomInfo.innerHTML = `
                <p>Guest: ${reservation.guestName}</p>
                <p>Check-In: ${reservation.checkInDate}</p>
                <p>Check-Out: ${reservation.checkOutDate}</p>
                <p>Arrival Time: ${reservation.arrivalTime || 'N/A'}</p>
                <p>Departure Time: ${reservation.departureTime || 'N/A'}</p>
                <p>Cost: $${reservation.cost}</p>
            `;
        } else {
            roomInfo.innerText = 'No Reservation';
        }
        roomDiv.appendChild(roomInfo);

        roomDiv.addEventListener('click', () => manageReservation(floor, room));
        floorDiv.appendChild(roomDiv);
    }

    hotelContainer.appendChild(floorDiv);
}

// Function to manage reservations
function manageReservation(floor, room) {
    const roomId = `${floor}-${room}`;
    const reservation = hotel.reservations[roomId];

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Manage Reservation for Room ${roomId}</h2>
            <label>Guest Name:</label>
            <input type="text" id="guestName" value="${reservation ? reservation.guestName : ''}" />
            <label>Check-In Date (YYYY-MM-DD):</label>
            <input type="date" id="checkInDate" value="${reservation ? reservation.checkInDate : ''}" />
            <label>Check-Out Date (YYYY-MM-DD):</label>
            <input type="date" id="checkOutDate" value="${reservation ? reservation.checkOutDate : ''}" />
            <label>Arrival Time (HH:MM):</label>
            <input type="time" id="arrivalTime" value="${reservation ? reservation.arrivalTime || '00:00' : '00:00'}" />
            <label>Departure Time (HH:MM):</label>
            <input type="time" id="departureTime" value="${reservation ? reservation.departureTime || '00:00' : '00:00'}" />
            <label>Cost:</label>
            <input type="number" id="cost" value="${reservation ? reservation.cost : ''}" />
            <button id="saveReservation">Save</button>
            <button id="cancelReservation">Cancel</button>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('saveReservation').addEventListener('click', () => {
        const guestName = document.getElementById('guestName').value;
        const checkInDate = document.getElementById('checkInDate').value;
        const checkOutDate = document.getElementById('checkOutDate').value;
        const cost = document.getElementById('cost').value;

        if (!guestName || !checkInDate || !checkOutDate || !cost) {
            alert('All fields are required.');
            return;
        }

        if (!isValidDate(checkInDate) || !isValidDate(checkOutDate)) {
            alert('Invalid date format. Please use YYYY-MM-DD.');
            return;
        }

        hotel.reservations[roomId] = { guestName, checkInDate, checkOutDate, arrivalTime: document.getElementById('arrivalTime').value, departureTime: document.getElementById('departureTime').value, cost: parseFloat(cost) };
        localStorage.setItem('hotelReservations', JSON.stringify(hotel.reservations));
        alert(`Reservation for room ${roomId} saved.`);
        document.body.removeChild(modal);
        renderFloor(floor); // Refresh to update UI
    });

    document.getElementById('cancelReservation').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}

// Helper function to validate date
function isValidDate(date) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date) && !isNaN(new Date(date).getTime());
}

// Basic styles
const style = document.createElement('style');
style.innerText = `
    #control-panel {
        margin: 10px;
        display: flex;
        gap: 10px;
        align-items: center;
        background-color: #f9f9f9;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
    }
    #hotel-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
        height: 100vh;
        overflow: hidden;
    }
    .floor {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 10px;
        width: calc(100vw - 200px); /* Ensure no horizontal scroll */
        height: calc(100vh - 200px); /* Adjust for control panel and other margins */
        border: 1px solid #ccc;
        padding: 10px;
        box-sizing: border-box;
    }
    .room {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        cursor: pointer;
        background-color: #0058a3; /* IKEA Blue */
        color: #ffcc00; /* IKEA Yellow */
        border: 1px solid #ddd;
        box-sizing: border-box;
        position: relative;
        border-radius: 5px;
    }
    .room-title {
        flex: 0 0 15%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        font-size: 1.2em;
        background-color: #004080;
        color: #ffcc00;
        border-bottom: 1px solid #ddd;
    }
    .room-info {
        flex: 1;
        background-color: #ffffff;
        color: #000000;
        padding: 10px;
        overflow: auto;
    }
    .badge {
        position: absolute;
        top: 5px;
        right: 5px;
        background-color: #ffcc00;
        color: #000;
        padding: 2px 5px;
        border-radius: 3px;
        font-size: 12px;
        cursor: pointer;
    }
    .badge:hover {
        background-color: #ffa500;
    }
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .modal-content {
        background: #fff;
        padding: 20px;
        border-radius: 5px;
        width: 400px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .modal-content label {
        display: block;
        margin: 10px 0 5px;
    }
    .modal-content input {
        width: 100%;
        padding: 8px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        border-radius: 3px;
    }
    .modal-content button {
        margin-top: 10px;
        padding: 10px 20px;
        border: none;
        background-color: #007bff;
        color: #fff;
        cursor: pointer;
        border-radius: 3px;
    }
    .modal-content button:hover {
        background-color: #0056b3;
    }
`;
document.head.appendChild(style);

// Add container to the DOM
const container = document.createElement('div');
container.id = 'hotel-container';
document.body.appendChild(container);