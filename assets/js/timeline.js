// script.js

const today = new Date('2025-01-16'); // Set today as the current date
let events = [];
let startDate = new Date(today);
startDate.setDate(today.getDate() - 5);
let currentEventId = null;

// Fetch data from a given URL and store it in local storage
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

// Load events from local storage or fetch from URL
function loadEvents(url) {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
        events = JSON.parse(storedEvents);
        renderTimeline();
    } else {
        fetchData(url);
    }
}

// Generate a random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Render timeline and events
function renderTimeline() {
    const timelineHeader = document.getElementById('timeline-header');
    const timelineContent = document.getElementById('timeline-content');
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 10);
    const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    // Clear previous events and days
    while (timelineHeader.firstChild) {
        timelineHeader.removeChild(timelineHeader.firstChild);
    }
    while (timelineContent.firstChild) {
        timelineContent.removeChild(timelineContent.firstChild);
    }

    // Display days in header
    for (let i = 0; i < totalDays; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';

        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        dayElement.textContent = date.getDate();

        // Highlight today's date
        if (date.toDateString() === today.toDateString()) {
            dayElement.classList.add('today');
        }

        timelineHeader.appendChild(dayElement);
    }

    // Display events
    events.forEach(event => {
        renderEvent(event);
    });

    // Initialize drag and drop on events
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

                // Ensure newRow is within bounds
                if (newRow < 0) newRow = 0;
                if (newRow > 7) newRow = 7;

                const eventId = target.getAttribute('data-id');
                const eventIndex = events.findIndex(e => e.id == eventId);
                const eventStartDate = new Date(events[eventIndex].start);
                const eventEndDate = new Date(events[eventIndex].end);
                const eventDuration = Math.floor((eventEndDate - eventStartDate) / (1000 * 60 * 60 * 24));

                // Calculate new start and end dates based on the number of days moved
                const newStartDate = new Date(startDate);
                newStartDate.setDate(startDate.getDate() + Math.floor((eventStartDate - startDate) / (1000 * 60 * 60 * 24)) + daysMoved);
                const newEndDate = new Date(newStartDate);
                newEndDate.setDate(newStartDate.getDate() + eventDuration);

                // Update event dates and row
                events[eventIndex].start = newStartDate.toISOString();
                events[eventIndex].end = newEndDate.toISOString();
                events[eventIndex].row = newRow;

                // Reset position
                target.style.transform = 'translate(0, 0)';
                target.setAttribute('data-x', 0);
                target.setAttribute('data-y', 0);

                // Update local storage
                localStorage.setItem('events', JSON.stringify(events));

                // Re-render all events to ensure correct positions
                renderTimeline();
            }
        }
    });
}

// Render a single event
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

        // Add double click event listener to show popup
        eventElement.addEventListener('dblclick', () => {
            currentEventId = event.id;
            document.getElementById('event-title').value = event.title;
            document.getElementById('event-start').value = new Date(event.start).toISOString().substring(0, 16);
            document.getElementById('event-end').value = new Date(event.end).toISOString().substring(0, 16);
            document.getElementById('date-error').style.display = 'none';
            document.getElementById('popup').classList.add('active');
        });
    }

    eventElement.style.left = `${(eventStartDay / totalDays) * 100}%`;
    eventElement.style.width = `${(eventDuration / totalDays) * 100}%`;
    eventElement.style.top = `${event.row * 70}px`; // Adjust top position based on row
    eventElement.textContent = event.title;
    eventElement.style.backgroundColor = event.color;
}

// Event listeners for carousel buttons
document.getElementById('prev-btn').addEventListener('click', () => {
    startDate.setDate(startDate.getDate() - 5);
    renderTimeline();
});

document.getElementById('next-btn').addEventListener('click', () => {
    startDate.setDate(startDate.getDate() + 5);
    renderTimeline();
});

// Event listener for save button in popup
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
        // Update existing event
        const eventIndex = events.findIndex(e => e.id == currentEventId);
        events[eventIndex].title = title;
        events[eventIndex].start = new Date(start).toISOString();
        events[eventIndex].end = new Date(end).toISOString();

        // Update local storage
        localStorage.setItem('events', JSON.stringify(events));

        // Re-render all events to ensure correct positions
        renderTimeline();

        // Reset currentEventId
        currentEventId = null;
    }

    // Hide popup
    document.getElementById('popup').classList.remove('active');
});

// Event listener for close button in popup
document.getElementById('close-popup').addEventListener('click', () => {
    document.getElementById('popup').classList.remove('active');
});

// On page load, fetch data and display it
document.addEventListener('DOMContentLoaded', () => {
    const url = 'assets/mock/timeline.json'; // Replace with your JSON data URL
    loadEvents(url);
});