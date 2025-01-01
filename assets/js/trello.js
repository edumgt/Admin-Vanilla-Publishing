// Function to create the WBS Module
function createWBSModule() {
    const app = document.getElementById("app");

    // Create container
    const wbsContainer = document.createElement("div");
    wbsContainer.className = "wbs-container p-6 bg-gray-100 shadow rounded-lg space-y-4";

    // Header
    const header = document.createElement("h2");
    header.textContent = "WBS (Work Breakdown Structure)";
    header.className = "text-xl font-bold text-gray-800";
    wbsContainer.appendChild(header);

    // Task Input Form
    const taskForm = document.createElement("form");
    taskForm.id = "taskForm";
    taskForm.className = "space-y-2";

    // Task Name Input
    const taskNameInput = document.createElement("input");
    taskNameInput.type = "text";
    taskNameInput.id = "taskName";
    taskNameInput.placeholder = "Task Name";
    taskNameInput.className = "border border-gray-300 rounded p-2 w-full";
    taskForm.appendChild(taskNameInput);

    // Task Description Input
    const taskDescInput = document.createElement("textarea");
    taskDescInput.id = "taskDescription";
    taskDescInput.placeholder = "Task Description";
    taskDescInput.className = "border border-gray-300 rounded p-2 w-full";
    taskForm.appendChild(taskDescInput);

    // Task Deadline Input
    const taskDeadlineInput = document.createElement("input");
    taskDeadlineInput.type = "date";
    taskDeadlineInput.id = "taskDeadline";
    taskDeadlineInput.className = "border border-gray-300 rounded p-2 w-full";
    taskForm.appendChild(taskDeadlineInput);

    // Add Task Button
    const addTaskButton = document.createElement("button");
    addTaskButton.type = "button";
    addTaskButton.textContent = "Add Task";
    addTaskButton.className = "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600";
    taskForm.appendChild(addTaskButton);

    wbsContainer.appendChild(taskForm);

    // Task List
    const taskList = document.createElement("ul");
    taskList.id = "taskList";
    taskList.className = "space-y-2";
    wbsContainer.appendChild(taskList);

    app.appendChild(wbsContainer);

    // Event Listener for Adding Tasks
    addTaskButton.addEventListener("click", () => {
        const taskName = taskNameInput.value.trim();
        const taskDescription = taskDescInput.value.trim();
        const taskDeadline = taskDeadlineInput.value;

        if (taskName && taskDeadline) {
            // Create Task Item
            const taskItem = document.createElement("li");
            taskItem.className = "bg-white p-4 rounded shadow space-y-2";

            // Task Details
            const taskTitle = document.createElement("h3");
            taskTitle.textContent = taskName;
            taskTitle.className = "font-medium text-gray-800";
            taskItem.appendChild(taskTitle);

            const taskDesc = document.createElement("p");
            taskDesc.textContent = taskDescription || "No description provided.";
            taskDesc.className = "text-gray-600 text-sm";
            taskItem.appendChild(taskDesc);

            const taskDueDate = document.createElement("p");
            taskDueDate.textContent = `Deadline: ${taskDeadline}`;
            taskDueDate.className = "text-gray-500 text-sm";
            taskItem.appendChild(taskDueDate);

            // Remove Button
            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.className = "text-red-500 text-sm hover:underline";
            removeButton.addEventListener("click", () => taskItem.remove());
            taskItem.appendChild(removeButton);

            // Append to Task List
            taskList.appendChild(taskItem);

            // Clear Inputs
            taskNameInput.value = "";
            taskDescInput.value = "";
            taskDeadlineInput.value = "";
        } else {
            alert("Task Name and Deadline are required!");
        }
    });
}

// Initialize the WBS Module
document.addEventListener("DOMContentLoaded", createWBSModule);

function createGanttChart() {
    const app = document.getElementById("app");

    // Gantt Chart Container
    const ganttContainer = document.createElement("div");
    ganttContainer.className = "gantt-container p-6 bg-gray-100 shadow rounded-lg space-y-4 mt-6";

    // Header
    const header = document.createElement("h2");
    header.textContent = "Gantt Chart (Weekly)";
    header.className = "text-xl font-bold text-gray-800";
    ganttContainer.appendChild(header);

    // Chart Wrapper
    const chartWrapper = document.createElement("div");
    chartWrapper.className = "overflow-auto";
    ganttContainer.appendChild(chartWrapper);

    // Chart Table
    const chartTable = document.createElement("table");
    chartTable.className = "w-full border-collapse border border-gray-300 text-sm";
    chartWrapper.appendChild(chartTable);

    // Table Header
    const chartHeader = document.createElement("thead");
    const headerRow = document.createElement("tr");
    ["Task Name", "Start Date", "End Date", "Timeline"].forEach((text) => {
        const th = document.createElement("th");
        th.textContent = text;
        th.className = "border border-gray-300 p-2 bg-gray-200 text-left";
        headerRow.appendChild(th);
    });
    chartHeader.appendChild(headerRow);
    chartTable.appendChild(chartHeader);

    // Table Body
    const chartBody = document.createElement("tbody");
    chartTable.appendChild(chartBody);

    // Render Gantt Chart for Tasks
    function renderGanttChart() {
        chartBody.innerHTML = ""; // Clear previous data
        const tasks = document.querySelectorAll("#taskList li");

        tasks.forEach((task) => {
            const taskName = task.querySelector("h3").textContent;
            const deadlineText = task.querySelector("p:nth-child(3)").textContent;
            const startDate = new Date();
            const endDate = new Date(deadlineText.split(": ")[1]);

            // Calculate weeks
            const totalWeeks = Math.ceil((endDate - startDate) / (7 * 24 * 60 * 60 * 1000));
            const timeline = document.createElement("div");
            timeline.className = "flex items-center";

            for (let i = 0; i < totalWeeks; i++) {
                const weekBlock = document.createElement("div");
                weekBlock.className = "w-6 h-6 border bg-gray-100";
                if (i === totalWeeks - 1) weekBlock.classList.add("bg-blue-500");
                timeline.appendChild(weekBlock);
            }

            // Add to Table Row
            const row = document.createElement("tr");
            [taskName, startDate.toLocaleDateString(), endDate.toLocaleDateString()].forEach((text) => {
                const td = document.createElement("td");
                td.textContent = text;
                td.className = "border border-gray-300 p-2";
                row.appendChild(td);
            });

            const timelineTd = document.createElement("td");
            timelineTd.className = "border border-gray-300 p-2";
            timelineTd.appendChild(timeline);
            row.appendChild(timelineTd);

            chartBody.appendChild(row);
        });
    }

    app.appendChild(ganttContainer);

    // Update Gantt Chart on Task Addition
    const addTaskButton = document.querySelector("#taskForm button");
    addTaskButton.addEventListener("click", renderGanttChart);
}

document.addEventListener("DOMContentLoaded", createGanttChart);


