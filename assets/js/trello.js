document.addEventListener("DOMContentLoaded", () => {
    const taskList = document.getElementById("taskList");
    const ganttTableBody = document.getElementById("ganttTableBody");

    let tasks = {};

    // Fetch tasks from task.json
    async function fetchTasks() {
        try {
            const response = await fetch("assets/mock/task.json");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            tasks = await response.json();
            renderTaskList();
            renderGanttChart();
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    }

    // Render tasks in the task list
    function renderTaskList() {
        taskList.innerHTML = "";
        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.style.position = "relative";
            li.draggable = true; // Make the task draggable
            li.dataset.index = index; // Store the task index in a data attribute

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

    // Render tasks in the Gantt chart
    function renderGanttChart() {
        ganttTableBody.innerHTML = "";

        tasks.forEach((task) => {
            const startDate = new Date(task.startDate);
            const endDate = new Date(task.endDate);
            const totalDays = Math.ceil((endDate - startDate) / (24 * 60 * 60 * 1000)) + 1;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${task.name}</td>
                <td>${startDate.toLocaleDateString()}</td>
                <td>${endDate.toLocaleDateString()}</td>
                <td class="timeline-column"><div class="timeline"></div></td>
            `;

            const timelineCell = row.querySelector(".timeline");
            for (let i = 0; i < totalDays; i++) {
                const block = document.createElement("div");
                block.style.backgroundColor = i === totalDays - 1 ? "#4299e1" : "#ddd";
                block.style.width = "24px";
                block.style.height = "24px";
                block.style.border = "1px solid #ddd";
                block.style.display = "inline-block";
                timelineCell.appendChild(block);
            }

            ganttTableBody.appendChild(row);
        });
    }

    // Remove a task
    function removeTask(index) {
        tasks.splice(index, 1);
        renderTaskList();
        renderGanttChart();
    }

    // Drag-and-drop functionality
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

            renderTaskList();
            renderGanttChart();
        }
    }

    function handleDragEnd() {
        this.style.opacity = "1";
    }

    // Fetch and render tasks on page load
    fetchTasks();
});
document.addEventListener("DOMContentLoaded", () => {
    const splitter = document.getElementById("splitter");
    const taskArea = document.getElementById("taskArea");
    const ganttArea = document.getElementById("ganttArea");

    function createSplitter(splitter, panel1, panel2) {
        let isDragging = false;

        splitter.addEventListener("mousedown", () => {
            isDragging = true;
            document.body.style.cursor = "col-resize";
        });

        document.addEventListener("mousemove", (e) => {
            if (!isDragging) return;

            const appRect = splitter.parentElement.getBoundingClientRect();
            const splitterWidthWithMargin = splitter.offsetWidth + 20; // Account for splitter margin
            const newPanel1Width = e.clientX - appRect.left - 10; // Adjust for left margin
            const newPanel2Width = appRect.right - e.clientX - splitterWidthWithMargin + 10; // Adjust for right margin

            // Ensure minimum widths
            if (newPanel1Width > 200 && newPanel2Width > 200) {
                panel1.style.flex = `0 0 ${newPanel1Width}px`;
                splitter.style.flex = "0 0 5px"; // Maintain the splitter's width
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
});


