// Hotel Management Module in Vanilla JS

// Create global variables to store room and reservation data
const hotel = {
    floors: 10,
    roomsPerFloor: 20,
    reservations: JSON.parse(localStorage.getItem('hotelReservations')) || {} // Format: { '1-1': { guestName: 'John Doe', checkInDate: '2025-01-04', checkOutDate: '2025-01-05', cost: 100 } }
};

// Function to initialize the UI
document.addEventListener('DOMContentLoaded', () => {
    const controlPanel = document.createElement('div');
    controlPanel.id = 'control-panel';

    const floorSelect = document.createElement('select');
    floorSelect.id = 'floor-select';
    for (let i = 1; i <= hotel.floors; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Floor ${i}`;
        floorSelect.appendChild(option);
    }

    floorSelect.addEventListener('change', () => {
        const selectedFloor = parseInt(floorSelect.value);
        renderFloor(selectedFloor);
    });

    controlPanel.appendChild(floorSelect);
    const hotelContainer = document.getElementById('hotel-container');
if (hotelContainer) {
    const parent = hotelContainer.parentNode;
    parent.replaceChild(controlPanel, parent.firstChild);
}

    renderFloor(1); // Initial render for the first floor
});

function renderFloor(floor) {
    const hotelContainer = document.getElementById('hotel-container');
    hotelContainer.innerHTML = '';
    const today = new Date().toISOString().split('T')[0];

    const floorDiv = document.createElement('div');
    floorDiv.className = 'floor';
    floorDiv.innerHTML = `<h3>Floor ${floor}</h3>`;

    for (let room = 1; room <= hotel.roomsPerFloor; room++) {
        const roomId = `${floor}-${room}`;
        const roomButton = document.createElement('button');
        roomButton.className = 'room';
        roomButton.innerText = roomId;
        roomButton.addEventListener('click', () => manageReservation(floor, room));

        const reservation = hotel.reservations[roomId];
        if (reservation && reservation.checkInDate <= today && reservation.checkOutDate >= today) {
            const badge = document.createElement('div');
            badge.className = 'badge';
            badge.innerText = 'Info';
            badge.title = `Guest: ${reservation.guestName}\nCheck-In: ${reservation.checkInDate}\nCheck-Out: ${reservation.checkOutDate}\nCost: $${reservation.cost}`;
            roomButton.appendChild(badge);
        }

        floorDiv.appendChild(roomButton);
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

        hotel.reservations[roomId] = { guestName, checkInDate, checkOutDate, cost: parseFloat(cost) };
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
    }
    .floor {
        display: grid;
        grid-template-columns: repeat(20, 1fr);
        gap: 10px;
        width: 100%;
        max-width: 1600px;
        border: 1px solid #ccc;
        padding: 10px;
        box-sizing: border-box;
    }
    .room {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        padding: 10px;
        aspect-ratio: 1 / 1;
        cursor: pointer;
        background-color: #f0f0f0;
        border: 1px solid #ddd;
        box-sizing: border-box;
        position: relative;
    }
    .room:hover {
        background-color: #d0e0ff;
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
