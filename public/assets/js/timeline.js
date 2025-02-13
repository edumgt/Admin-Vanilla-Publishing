const workarea = document.getElementById('workarea');
workarea.classList.add('header', 'mt-4');

createModal3(
    'modalTime',
    '일정변경',
    `<div class="popup" id="popup">
        <input type="text" id="event-title" placeholder="Event Title">
        <input type="datetime-local" id="event-start">
        <input type="datetime-local" id="event-end">
        <div class="error" id="date-error">시작일이 종료일 보다 이후 날짜 입니다.</div>
        <button class="bg-blue-500 text-white" id="save-event">저장</button>
        <button class="bg-gray-500 text-white" id="close-popup">닫기</button>
    </div>`,
    []
);

const closepopup = document.getElementById('close-popup');

const today = new Date();
let events = [];
let startDate = new Date(today);
startDate.setDate(today.getDate() - 5);
let currentEventId = null;

async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        localStorage.setItem('events', JSON.stringify(data));
        events = data.map(event => ({ ...event, color: getRandomColor() }));
        renderTimeline();
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

function loadEvents(url) {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
        events = JSON.parse(storedEvents);
        renderTimeline();
    } else {
        fetchData(url);
    }
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function renderTimeline() {
    const timelineHeader = document.getElementById('timeline-header');
    const timelineContent = document.getElementById('timeline-content');
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 10);
    const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    while (timelineHeader.firstChild) {
        timelineHeader.removeChild(timelineHeader.firstChild);
    }
    while (timelineContent.firstChild) {
        timelineContent.removeChild(timelineContent.firstChild);
    }

    for (let i = 0; i < totalDays; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';

        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        dayElement.textContent = date.getDate();


        if (date.toDateString() === today.toDateString()) {
            dayElement.classList.add('today');
        }

        timelineHeader.appendChild(dayElement);
    }


    events.forEach(event => {
        renderEvent(event);
    });


    interact('.event').draggable({
        inertia: true,
        modifiers: [
            interact.modifiers.restrictRect({
                restriction: '.timeline',
                endOnly: true
            })
        ],
        autoScroll: true,
        listeners: {
            move(event) {
                const target = event.target;
                const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                target.style.transform = `translate(${x}px, ${y}px)`;
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            },
            end(event) {
                const target = event.target;
                const x = parseFloat(target.getAttribute('data-x')) || 0;
                const y = parseFloat(target.getAttribute('data-y')) || 0;
                const dayWidth = target.parentElement.offsetWidth / totalDays;
                const daysMoved = Math.round(x / dayWidth);
                const rowHeight = 70;
                let newRow = Math.floor((target.offsetTop + y + target.clientHeight / 2) / rowHeight);

                if (newRow < 0) newRow = 0;
                if (newRow > 7) newRow = 7;

                const eventId = target.getAttribute('data-id');
                const eventIndex = events.findIndex(e => e.id == eventId);
                const eventStartDate = new Date(events[eventIndex].start);
                const eventEndDate = new Date(events[eventIndex].end);
                const eventDuration = Math.floor((eventEndDate - eventStartDate) / (1000 * 60 * 60 * 24));


                const newStartDate = new Date(startDate);
                newStartDate.setDate(startDate.getDate() + Math.floor((eventStartDate - startDate) / (1000 * 60 * 60 * 24)) + daysMoved);
                const newEndDate = new Date(newStartDate);
                newEndDate.setDate(newStartDate.getDate() + eventDuration);

                events[eventIndex].start = newStartDate.toISOString();
                events[eventIndex].end = newEndDate.toISOString();
                events[eventIndex].row = newRow;
                target.style.transform = 'translate(0, 0)';
                target.setAttribute('data-x', 0);
                target.setAttribute('data-y', 0);
                localStorage.setItem('events', JSON.stringify(events));
                renderTimeline();
            }
        }
    });
}


function renderEvent(event, targetElement = null) {
    const timelineContent = document.getElementById('timeline-content');
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 10);
    const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    const eventStartDate = new Date(event.start);
    const eventEndDate = new Date(event.end);
    const eventStartDay = Math.floor((eventStartDate - startDate) / (1000 * 60 * 60 * 24));
    const eventEndDay = Math.floor((eventEndDate - startDate) / (1000 * 60 * 60 * 24));
    const eventDuration = eventEndDay - eventStartDay + 1;

    let eventElement = targetElement;
    if (!eventElement) {
        eventElement = document.createElement('div');
        eventElement.className = 'event';
        eventElement.setAttribute('data-id', event.id);
        timelineContent.appendChild(eventElement);

        eventElement.addEventListener('dblclick', () => {
            currentEventId = event.id;
            document.getElementById('event-title').value = event.title;
            document.getElementById('event-start').value = new Date(event.start).toISOString().substring(0, 16);
            document.getElementById('event-end').value = new Date(event.end).toISOString().substring(0, 16);
            document.getElementById('date-error').style.display = 'none';

            document.getElementById('modalTime').style.display = 'block';
            document.getElementById('popup').classList.add('active');
        });
    }

    const dateInfo = document.createElement('span');
    dateInfo.className = 'event-date';
    dateInfo.textContent = `${eventStartDate.toISOString().split('T')[0]} ~ ${eventEndDate.toISOString().split('T')[0]}`;

    eventElement.innerHTML = '';
    eventElement.appendChild(dateInfo);
    eventElement.appendChild(document.createTextNode(event.title));

    eventElement.style.left = `${(eventStartDay / totalDays) * 100}%`;
    eventElement.style.width = `${(eventDuration / totalDays) * 100}%`;
    eventElement.style.top = `${event.row * 70}px`;
    eventElement.style.backgroundColor = event.color;
}


document.getElementById('prev-btn').addEventListener('click', () => {
    startDate.setDate(startDate.getDate() - 5);
    renderTimeline();
});

document.getElementById('next-btn').addEventListener('click', () => {
    startDate.setDate(startDate.getDate() + 5);
    renderTimeline();
});


document.getElementById('save-event').addEventListener('click', () => {
    const title = document.getElementById('event-title').value;
    const start = document.getElementById('event-start').value;
    const end = document.getElementById('event-end').value;

    if (new Date(start) > new Date(end)) {
        document.getElementById('date-error').style.display = 'block';
        return;
    } else {
        document.getElementById('date-error').style.display = 'none';
    }

    if (currentEventId !== null) {

        const eventIndex = events.findIndex(e => e.id == currentEventId);
        events[eventIndex].title = title;
        events[eventIndex].start = new Date(start).toISOString();
        events[eventIndex].end = new Date(end).toISOString();
        localStorage.setItem('events', JSON.stringify(events));
        renderTimeline();
        currentEventId = null;
    }
    document.getElementById('modalTime').style.display = 'none';
    document.getElementById('popup').classList.remove('active');
});

document.getElementById('close-popup').addEventListener('click', () => {
    document.getElementById('modalTime').style.display = 'none';
    document.getElementById('popup').classList.remove('active');
});

document.addEventListener('DOMContentLoaded', () => {
    const url = 'assets/mock/timeline.json';
    loadEvents(url);
});