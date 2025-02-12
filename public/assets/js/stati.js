import { 
    createAddButton, 
    createDelButton, 
    createSaveButton, 
    createSearchButton,
    createResetSearchButton,
    createTanslations, 
    createBadgeRenderer } from './common.js';

const translations = createTanslations;

const workarea = document.getElementById("workarea");
workarea.classList.add('grid', 'grid-cols-1', 'lg:grid-cols-4', 'gap-4', 'py-1', 'mt-4');

let rowsPerPage = 15;
let gridBodyHeight = 430;

const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
//const currentDate = new Date().toLocaleDateString('ko-KR', options).replace(/[\.]/g, '-').replace(/[\s]/g, '').substring(0, 10);

fetch('/api/members')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        loadData(data);
        localStorage.setItem('membersData', JSON.stringify(data));
    })
    .catch(error => {

        showToast('loading-error', 'error', lang);

        const storedData = localStorage.getItem('membersData');
        if (storedData) {
            loadData(JSON.parse(storedData));
        } else {
            //console.log('No data available in local storage');
        }
    });


// Function to load paginated data
function loadPageData(page, perPage) {
    const allData = loadData();
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return allData.slice(start, end);
}

// Function to update the total count display
function updateDataCount() {
    const allData = loadData();
    const dataCountElement = document.getElementById('dataCount');
    dataCountElement.textContent = `Total : ${allData.length}`;
}

// Function to load data from localStorage
function loadData() {
    const data = localStorage.getItem('membersData');
    return data ? JSON.parse(data) : [];
}

// Function to save data to localStorage
function saveData(data) {
    const filteredData = data.filter(row => row.team && row.name);
    localStorage.setItem('membersData', JSON.stringify(filteredData));
}

const BadgeRenderer = createBadgeRenderer;


const grid = new tui.Grid({
    el: document.getElementById('grid'),
    rowHeaders: ['rowNum', 'checkbox'],
    editingEvent: 'click',
    scrollX: true,
    scrollY: true,
    bodyHeight: gridBodyHeight,
    pageOptions: {
        useClient: true,
        perPage: rowsPerPage
    },
    rowHeight: 42,
    minRowHeight: 42,

    columns: [
        { header: 'Key', name: 'id', align: 'left', sortable: true, resizable: true, width: 250, minWidth: 80 },
        { header: 'Team', name: 'team', editor: 'text', validation: { required: true }, sortable: true, filter: 'text', resizable: true, width: 150 },
        { header: 'Name', name: 'name', editor: 'text', sortable: true, filter: 'text', resizable: true, width: 200 },
        { header: 'Email', name: 'email', editor: 'text', sortable: true, filter: 'text', resizable: true },
        { header: 'Address', name: 'address', editor: 'text', sortable: true, filter: 'text', resizable: true },

        { header: '입사년도', name: 'joinYear', width: 150, align: 'center', sortable: true },
        {
            header: 'View',
            name: 'view',
            align: 'center',
            text: 'V',
            renderer: {
                type: BadgeRenderer
            },
            width: 60,
            resizable: false
        }
    ],
    data: loadPageData(1, rowsPerPage),
    columnOptions: {
        frozenCount: 2,
        frozenBorderWidth: 2
    },
    draggable: true
});


updateDataCount();

const deleteButton = createDelButton();
deleteButton.addEventListener('click', function () {
    const chkArray = grid.getCheckedRowKeys();
    if (chkArray.length > 0) {
        grid.removeCheckedRows();
        saveData(grid.getData());
        showToast('select-delete', 'success', lang);
        updateDataCount();
    } else {
        showToast('delete-not', 'warning', lang);
    }
});

const saveButton = createSaveButton();
saveButton.addEventListener('click', function () {

    const data = grid.getData();
    // Filter out rows without a Key value
    const validData = data.filter(row => row.Key && row.Key.trim() !== '');

    // Save only rows with valid Key values
    saveData(validData);
    updateDataCount();

    //console.log(" validData : " + JSON.stringify(validData));

    // Send the data to the backend API
    fetch('https://your-backend-api.com/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(validData)
    })
        .then(response => response.json())
        .then(data => {
            //console.log('Success:', data);
            showToast('well-done', 'success', lang);
        })
        .catch((error) => {
            //console.error('Error:', error);
            showToast('save-error', 'warning', lang);

        });
});

const addButton = createAddButton();
addButton.addEventListener('click', function () {
    const data = grid.getData();
    const hasEmptyRow = data.some(row => row.team === '' || row.name === '');
    if (hasEmptyRow) {
        showToast('input-allowed', 'info', lang);
        return;
    }

    const newRow = { id: generateNanoId(), team: '', name: '', email: '', address: '', joinYear: '' };
    grid.prependRow(newRow, { focus: true });

    saveData([...data, newRow]);
    updateDataCount();
});

const searchButton = createSearchButton();
btnContainer.appendChild(searchButton);

btnContainer.appendChild(addButton);
btnContainer.appendChild(deleteButton);
btnContainer.appendChild(saveButton);

const resetSearchButton = createResetSearchButton();
resetSearchButton.classList.add("ml-2")
btnContainer.appendChild(resetSearchButton);


grid.on('click', (ev) => {
    const { columnName, rowKey } = ev;

    //console.log("rowKey : " + rowKey);

    if (columnName === 'view') {
        const row = grid.getRow(rowKey); // Get the row data
        toggleModal(true, row, rowKey); // Pass the row data and row key to the modal
    }

    if (ev.columnName === 'id') {
        showToast('auto-key', 'info', lang);
    }
});

grid.on('editingStart', (ev) => {
    showToast('data-possible', 'info', lang);
});

grid.on('editingFinish', (ev) => {
    saveData(grid.getData());
    showToast('well-done', 'info', lang);
});


// Initialize a new row
function initNew() {
    const rowData = { id: generateNanoId(), team: '', name: '', email: '', address: '', joinYear: '' };
    grid.prependRow(rowData, { focus: true });

    updateDataCount();
}

initNew();

new Pikaday({
    field: document.getElementById('datePicker'),
    format: 'YYYY-MM-DD',
    toString(date, format) {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
    }
});

document.getElementById('saveModal').addEventListener('click', () => {
    const modalForm = document.getElementById('modalForm');
    const formData = new FormData(modalForm);
    const updatedData = {};

    // Collect updated values from the form
    for (const [key, value] of formData.entries()) {
        updatedData[key] = value;
    }

    if (currentRowKey !== null) {
        grid.setValue(currentRowKey, 'team', updatedData.team);
        grid.setValue(currentRowKey, 'name', updatedData.name);
        grid.setValue(currentRowKey, 'email', updatedData.email);
        grid.setValue(currentRowKey, 'address', updatedData.address);
        grid.setValue(currentRowKey, 'joinYear', updatedData.joinYear);
    }

    // Hide the modal and show a success toast
    toggleModal(false);
    saveData(grid.getData());
    showToast('well-done', 'success', lang);
});

let currentRowKey = null; // To track the current row being edited

function toggleModal(show, rowData = {}, rowKey = null) {
    const modal = document.getElementById('modal');
    const modalForm = document.getElementById('modalForm');
    currentRowKey = rowKey; // Store the row key

    if (show) {
        // Clear the form
        modalForm.innerHTML = '';

        // Populate the form with row data
        for (const [key, value] of Object.entries(rowData)) {
            const formGroup = document.createElement('div');
            formGroup.className = 'flex flex-col';

            const label = document.createElement('label');
            label.className = 'text-sm  text-gray-700';
            label.textContent = key;

            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'border rounded px-3 py-2 mt-1 text-gray-900';
            input.name = key;
            input.value = value;

            formGroup.appendChild(label);
            formGroup.appendChild(input);
            modalForm.appendChild(formGroup);
        }

        modal.classList.remove('hidden'); // Show modal
    } else {
        modal.classList.add('hidden'); // Hide modal
    }
}


searchButton.addEventListener('click', function () {

    const gridData = loadData();

    const selectedDate = document.getElementById('datePicker').value;
    const team = document.getElementById('team').value.toLowerCase();
    const name = document.getElementById('name').value.toLowerCase();
    const email = document.getElementById('email').value.toLowerCase();

    const filteredData = gridData.filter(row => {
        //const matchesDate = selectedDate ? row.createdAt === selectedDate : true;
        const matchesTeam = team ? row.team.toLowerCase().includes(team) : true;
        const matchesName = name ? row.name.toLowerCase().includes(name) : true;
        const matchesEmail = email ? row.email.toLowerCase().includes(email) : true;
        return matchesTeam && matchesName && matchesEmail;
    });

    grid.resetData(filteredData);

    saveButton.disabled = true;
    saveButton.classList.add('bg-gray-400', 'cursor-not-allowed');
    saveButton.classList.remove('bg-gray-700', 'hover:bg-gray-600');

    addButton.disabled = true;
    addButton.classList.add('bg-gray-400', 'cursor-not-allowed');
    addButton.classList.remove('bg-gray-700', 'hover:bg-gray-600');

    showToast('search-click', 'info', lang);

});

resetSearchButton.addEventListener('click', function () {

    const gridData = loadData();

    // Reset search fields
    document.getElementById('team').value = '';
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('datePicker').value = '';

    // Reset grid data
    grid.resetData(gridData);

    saveButton.disabled = false;
    saveButton.classList.remove('bg-gray-400', 'cursor-not-allowed');
    saveButton.classList.add('bg-gray-700', 'hover:bg-gray-600');

    addButton.disabled = false;
    addButton.classList.remove('bg-gray-400', 'cursor-not-allowed');
    addButton.classList.add('bg-gray-700', 'hover:bg-gray-600');

    showToast('new-save', 'info', lang);
});

const rows = document.querySelectorAll('.tui-grid-rside-area .tui-grid-body-tbody tr');
if (rows.length > 0) {
    const lastRow = rows[rows.length - 1];
    lastRow.style.backgroundColor = '#fff'; // 마지막 행의 배경색
    lastRow.style.borderBottom = '1px solid #8f8f8f'; // 마지막 행의 테두리 색
}

