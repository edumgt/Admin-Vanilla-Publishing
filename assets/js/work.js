const hotel = {
    floors: 10,
    roomsPerFloor: 20,
    reservations: JSON.parse(localStorage.getItem('hotelReservations')) || {} // Format: { '1-1': { guestName: 'John Doe', checkInDate: '2025-01-04', checkOutDate: '2025-01-05', cost: 100 } }
};

// Function to initialize the UI
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('assets/mock/hotel.json'); // Replace with your JSON file URL
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        hotel.reservations = await response.json();
    } catch (error) {
        console.error('Failed to fetch reservation data:', error);
        hotel.reservations = {}; // Fallback to empty reservations
    }
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


    // 기본 날짜를 오늘 날짜로 설정
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;

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

                // "X" 버튼 추가
                const deleteButton = document.createElement('span');
                deleteButton.innerText = 'X';
                deleteButton.className = 'delete-button';
                deleteButton.addEventListener('click', () => {
                    // 예약 삭제
                    reservations.splice(index, 1); // 해당 예약 제거
                    hotel.reservations[roomId] = reservations; // 업데이트
                    showToast(`The reservation for ${reservation.guestName} has been cancelled.`);
                    renderFloor(floor, date); // UI 갱신
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
    const reservations = hotel.reservations[roomId] || []; // 배열이 없을 경우 빈 배열로 설정

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Manage Reservation for Room ${roomId}</h2>
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
            <button id="saveReservation">Save</button>
            <button id="cancelReservation">Cancel</button>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('saveReservation').addEventListener('click', () => {
        const guestName = document.getElementById('guestName').value;
        const checkInDate = document.getElementById('checkInDate').value;
        const checkOutDate = document.getElementById('checkOutDate').value;
        const arrivalTime = document.getElementById('arrivalTime').value;
        const departureTime = document.getElementById('departureTime').value;
        const cost = parseFloat(document.getElementById('cost').value);

        if (!guestName || !checkInDate || !checkOutDate || isNaN(cost)) {
            alert('All fields are required.');
            return;
        }

        if (!isValidDate(checkInDate) || !isValidDate(checkOutDate)) {
            alert('Invalid date format. Please use YYYY-MM-DD.');
            return;
        }

        // 겹치는 예약 필터링
        const overlappingReservations = reservations.filter(reservation => {
            return (
                reservation.checkInDate <= checkOutDate &&
                reservation.checkOutDate >= checkInDate
            );
        });

        if (overlappingReservations.length > 0) {
            alert('The selected dates overlap with an existing reservation.');
            return;
        }

        // 새 예약 추가
        const newReservation = {
            guestName,
            checkInDate,
            checkOutDate,
            arrivalTime,
            departureTime,
            cost,
        };

        reservations.push(newReservation); // 배열에 추가
        hotel.reservations[roomId] = reservations; // 업데이트

        // 업데이트 후 UI 렌더링
        showToast(`Reservation for room ${roomId} saved.`);
        document.body.removeChild(modal);
        renderFloor(floor);
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
    
`;
document.head.appendChild(style);

// Add container to the DOM
const container = document.createElement('div');
container.id = 'hotel-container';
document.body.appendChild(container);