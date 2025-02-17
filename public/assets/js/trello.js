import { createSaveButton } from './common.js';

const workarea = document.getElementById("trelloapp");
workarea.classList.add('mt-4');

const taskList = document.getElementById("taskList");
const ganttTableBody = document.getElementById("ganttTableBody");
const splitter = document.getElementById("splitter");
const taskArea = document.getElementById("taskArea");
const ganttArea = document.getElementById("ganttArea");
// const taskForm = document.getElementById("taskForm");

const saveButton = createSaveButton();
saveButton.addEventListener('click', () => {
    console.log("##");

    //e.preventDefault();
    const name = document.getElementById("taskName").value;
    const description = document.getElementById("taskDescription").value;
    const startDate = document.getElementById("taskStartDate").value;
    const endDate = document.getElementById("taskEndDate").value;

    if (!name || !startDate || !endDate) {
        showToast('required-input', 'warning', lang);
        return;
    }

    tasks.push({ name, description, startDate, endDate });
    saveTasks(tasks);

    // renderTaskList();
    // renderGanttChart();
    // taskForm.reset();
});
const btnArea = document.getElementById('btn-area');
btnArea.appendChild(saveButton);

let tasks = [];

async function fetchTasks() {
    try {
        const response = await fetch("assets/mock/task.json");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const fetchedTasks = await response.json();
        tasks = [...loadTasks(), ...fetchedTasks];
        //saveTasks(tasks); 
        renderTaskList();
        renderGanttChart();
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
}

function loadTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// taskForm.addEventListener("submit", (e) => {
//     console.log("###");
//     e.preventDefault();
//     const name = document.getElementById("taskName").value;
//     const description = document.getElementById("taskDescription").value;
//     const startDate = document.getElementById("taskStartDate").value;
//     const endDate = document.getElementById("taskEndDate").value;
//     if (!name || !startDate || !endDate) {
//         showToast('required-input', 'warning', lang);
//         return;
//     }
//     tasks.push({ name, description, startDate, endDate });
//     saveTasks(tasks);
//     renderTaskList();
//     renderGanttChart();
//     taskForm.reset();
// });

function renderTaskList() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.style.position = "relative";
        li.draggable = true;
        li.dataset.index = index;

        li.innerHTML = `
                <strong>${task.name}</strong><br>
                <small>${task.description || "No description"}</small><br>
                <small>Start Date: ${task.startDate}</small><br>
                <small>End Date: ${task.endDate}</small>
                <div class="drag-indicator"><i class="fas fa-arrows-alt"></i> Drag & Drop</div>
            `;

        const removeButton = document.createElement("button");
        removeButton.textContent = "X";
        removeButton.style.position = "absolute";
        removeButton.style.top = "10px";
        removeButton.style.right = "10px";
        removeButton.style.backgroundColor = "transparent";
        removeButton.style.border = "none";
        removeButton.style.color = "red";
        removeButton.style.fontWeight = "bold";
        removeButton.style.cursor = "pointer";
        removeButton.style.fontSize = "16px";

        removeButton.addEventListener("click", () => {
            removeTask(index);
        });

        li.appendChild(removeButton);
        taskList.appendChild(li);
    });

    addDragAndDrop();
}

// Function to render the Gantt chart with tasks' timelines split
function renderGanttChart() {
    ganttTableBody.innerHTML = "";

    if (tasks.length === 0) return;

    // Determine the overall start and end dates
    const overallStartDate = new Date(Math.min(...tasks.map(task => new Date(task.startDate).getTime())));
    const overallEndDate = new Date(Math.max(...tasks.map(task => new Date(task.endDate).getTime())));

    const totalDays = Math.ceil((overallEndDate - overallStartDate) / (24 * 60 * 60 * 1000)) + 1;

    tasks.forEach(task => {
        const taskStartDate = new Date(task.startDate);
        const taskEndDate = new Date(task.endDate);

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${task.name}</td>
            <td>${taskStartDate.toLocaleDateString()}</td>
            <td>${taskEndDate.toLocaleDateString()}</td>
            <td class="timeline-column"><div class="timeline2"></div></td>
        `;

        const timelineCell = row.querySelector(".timeline2");

        for (let i = 0; i < totalDays; i++) {
            const currentDate = new Date(overallStartDate);
            currentDate.setDate(overallStartDate.getDate() + i);

            const block = document.createElement("div");
            block.style.width = "24px";
            block.style.height = "24px";
            block.style.border = "1px solid #ddd";
            block.style.display = "inline-block";

            if (currentDate >= taskStartDate && currentDate <= taskEndDate) {
                block.style.backgroundColor = "#0058a3";
            } else {
                block.style.backgroundColor = "#e8eaee";
            }

            timelineCell.appendChild(block);
        }

        ganttTableBody.appendChild(row);
    });
}

function removeTask(index) {
    tasks.splice(index, 1);
    saveTasks(tasks);
    renderTaskList();
    renderGanttChart();
}

function addDragAndDrop() {
    const listItems = taskList.querySelectorAll("li");

    listItems.forEach((item) => {
        item.addEventListener("dragstart", handleDragStart);
        item.addEventListener("dragover", handleDragOver);
        item.addEventListener("drop", handleDrop);
        item.addEventListener("dragend", handleDragEnd);
    });
}

let dragSourceIndex = null;

function handleDragStart(e) {
    dragSourceIndex = +this.dataset.index;
    this.style.opacity = "0.5";
    e.dataTransfer.effectAllowed = "move";
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
}

function handleDrop(e) {
    e.preventDefault();
    const dragTargetIndex = +this.dataset.index;

    if (dragSourceIndex !== null && dragTargetIndex !== dragSourceIndex) {
        const [draggedItem] = tasks.splice(dragSourceIndex, 1);
        tasks.splice(dragTargetIndex, 0, draggedItem);
        saveTasks(tasks);

        renderTaskList();
        renderGanttChart();
    }
}

function handleDragEnd() {
    this.style.opacity = "1";
}

function createSplitter(splitter, panel1, panel2) {
    let isDragging = false;

    splitter.addEventListener("mousedown", () => {
        isDragging = true;
        document.body.style.cursor = "col-resize";
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;

        const appRect = splitter.parentElement.getBoundingClientRect();
        const splitterWidthWithMargin = splitter.offsetWidth + 20;
        const newPanel1Width = e.clientX - appRect.left - 10;
        const newPanel2Width = appRect.right - e.clientX - splitterWidthWithMargin + 10;

        if (newPanel1Width > 200 && newPanel2Width > 200) {
            panel1.style.flex = `0 0 ${newPanel1Width}px`;
            splitter.style.flex = "0 0 5px";
            panel2.style.flex = `0 0 ${newPanel2Width}px`;
        }
    });

    document.addEventListener("mouseup", () => {
        if (isDragging) {
            isDragging = false;
            document.body.style.cursor = "default";
        }
    });
}

createSplitter(splitter, taskArea, ganttArea);
fetchTasks();

