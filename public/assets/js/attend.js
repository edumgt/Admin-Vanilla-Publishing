const workarea = document.getElementById('workarea');
workarea.classList.add('flex', 'items-center', 'mb-2', 'mt-4');

let attendanceData = [];
let sortDirection = 'asc';
export let manager;
window.manager = manager;

export class AttendanceManager {
  constructor(data) {
    this.data = data;
  }

  getMonthlyAttendance(employeeId, year, month) {
    const monthStr = month < 10 ? `${month}` : `${month}`;

    if (employeeId === "ALL") {
      return this.data.map(employee => ({
        ...employee,
        attendance: employee.attendance.filter(record => record.date.startsWith(`${year}-${monthStr}`))
      }));
    } else {
      const employee = this.data.find(emp => emp.employeeId === employeeId);
      if (!employee) {
        //console.log(`Employee with ID ${employeeId} not found.`);
        return [];
      }

      return [{
        ...employee,
        attendance: employee.attendance.filter(record => record.date.startsWith(`${year}-${monthStr}`))
      }];
    }
  }

  getMonthlyAttendanceAllDepartments(year, month) {
    const monthStr = month < 10 ? `${month}` : `${month}`;

    return this.data.map(employee => ({
      ...employee,
      attendance: employee.attendance.filter(record => record.date.startsWith(`${year}-${monthStr}`))
    }));
  }

  getMonthlyAttendanceByDepartment(department, year, month) {
    const monthStr = month < 10 ? `${month}` : `${month}`;

    return this.data
      .filter(employee => employee.department === department)
      .map(employee => ({
        ...employee,
        attendance: employee.attendance.filter(record => record.date.startsWith(`${year}-${monthStr}`))
      }));
  }
}

window.AttendanceManager = AttendanceManager;

fetch('assets/mock/attend.json')
  .then(response => response.json())
  .then(data => {
    attendanceData = data;
    manager = new AttendanceManager(attendanceData);

    populateDepartmentSelect();
    updateEmployeeSelect();
  })
  .catch(error => console.error('Error fetching attendance data:', error));

function populateDepartmentSelect() {
  const departmentSelect = document.getElementById('departmentSelect');
  const departments = [...new Set(attendanceData.map(employee => employee.department))];

  departments.forEach(department => {
    const option = document.createElement('option');
    option.value = department;
    option.text = department;

    departmentSelect.appendChild(option);
  });

  if (departments.length > 0) {
    departmentSelect.value = departments[0]; 
  }
}

export function updateEmployeeSelect() {
  const selectedDepartment = document.getElementById('departmentSelect').value;
  const employeeSelect = document.getElementById('employeeSelect');
  employeeSelect.innerHTML = ''; 

  const optionAll = document.createElement('option');
  optionAll.value = "ALL";
  optionAll.text = "ALL";
  employeeSelect.appendChild(optionAll);

  const employeesInDepartment = attendanceData.filter(employee => employee.department === selectedDepartment);

  employeesInDepartment.forEach(employee => {
    const option = document.createElement('option');
    option.value = employee.employeeId;
    option.text = `${employee.name} (${employee.employeeId})`;
    employeeSelect.appendChild(option);
  });

  if (employeesInDepartment.length > 0) {
    employeeSelect.value = "ALL"; 
  }

  showAttendance();
}

window.updateEmployeeSelect = updateEmployeeSelect;

function getLastDayOfMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

export function showAttendance() {
  const employeeId = document.getElementById('employeeSelect').value;
  const selectedMonth = document.getElementById('monthSelect').value;
  const [year, month] = selectedMonth.split('-');
  const lastDay = getLastDayOfMonth(year, month);
  const today = new Date().toISOString().split('T')[0]; 
  
  let employeesAttendance;
  const selectedDepartment = document.getElementById('departmentSelect').value;

  if (!manager) {
    console.error('Manager is not initialized.');
    return;
  }

  if (employeeId === "ALL") {
    employeesAttendance = manager.getMonthlyAttendanceByDepartment(selectedDepartment, year, month);
  } else {
    employeesAttendance = manager.getMonthlyAttendance(employeeId, year, month);
  }

  const dateRow = document.getElementById('dateRow');
  const attendanceBody = document.getElementById('attendanceBody');
  dateRow.innerHTML = `
  <th class="px-3 py-2 text-left text-xs uppercase tracking-wider sortable" onclick="sortTableByName()">
  직원 명<span id="sortIcon">▲</span></th>
  `; 
  attendanceBody.innerHTML = ''; 

  let todayColumnIndex = -1; 

  for (let day = 1; day <= lastDay; day++) {
    const dateStr = `${year}-${month}-${day.toString().padStart(2, '0')}`;
    const date = new Date(year, month - 1, day);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6; 
    const isSaturday = date.getDay() === 6; 

    const dateCell = document.createElement('th');
    dateCell.className = `px-3 py-2 text-xs uppercase tracking-wider bg-gray-500 ${dateStr === today ? 'bg-blue-500' : isSaturday ? 'text-black' : isWeekend ? 'text-red-300' : ''}`;
    dateCell.textContent = dateStr;

    if (dateStr === today) {
      todayColumnIndex = day; // 오늘 날짜의 인덱스 저장
    }

    dateRow.appendChild(dateCell);
  }
  

  employeesAttendance.forEach(employee => {
    const employeeNameCell = document.createElement('td');
    employeeNameCell.className = 'px-3 py-2 whitespace-nowrap ikea-yellow-border bg-white';

    const checkIns = employee.attendance.length;
    const checkInPercentage = ((checkIns / lastDay) * 100).toFixed(2); 

    employeeNameCell.innerHTML = `
    <a href='#' class='a-link open-modal' data-name='${employee.name}' data-id='${employee.id}'>
    ${employee.name} (${checkIns}/${lastDay}, ${checkInPercentage}%)</a>
    `; 

    const row = document.createElement('tr');
    row.className = 'hover:bg-gray-100';
    row.appendChild(employeeNameCell);

    for (let day = 1; day <= lastDay; day++) {
      const dateStr = `${year}-${month}-${day.toString().padStart(2, '0')}`;
      const record = employee.attendance.find(rec => rec.date === dateStr);

      const attendanceCell = document.createElement('td');
      attendanceCell.className = `px-3 py-2 whitespace-nowrap text-xs ikea-yellow-border bg-white editable ${dateStr === today ? 'text-orange-600 font-bold' : ''}`;
      
      if (record) {
        attendanceCell.innerHTML = `
              <div>Check-In: <span class="${record.checkIn > '09:00' ? 'text-red-500' : ''}">${record.checkIn}</span></div>
              <div>Check-Out: <span class="${record.checkOut > '18:00' ? 'text-orange-500' : ''}">${record.checkOut}</span></div>
            `;
      } else {
        attendanceCell.innerHTML = '--';
        attendanceCell.ondblclick = () => makeEditable(attendanceCell, employee.employeeId, dateStr);
      }
      
      row.appendChild(attendanceCell);
    }

    attendanceBody.appendChild(row);
  });

  if (todayColumnIndex !== -1) {
    setTimeout(() => {
      const todayCell = dateRow.children[todayColumnIndex];
      if (todayCell) {
        todayCell.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      }
    }, 500); // 0.5초 후 실행하여 테이블 렌더링이 완료된 후 스크롤
  }
}

window.showAttendance = showAttendance;

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("open-modal")) {
      e.preventDefault();
      const name = e.target.getAttribute("data-name");
      const id = e.target.getAttribute("data-id");
      openModal(name, id);
  }
});

function openModal(name, id) {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
      <div style='position: relative; display: flex; align-items: flex-start;'>
      <iframe src='account-pop.html?name=${encodeURIComponent(name)}&id=${encodeURIComponent(id)}' width='1440' height='700' class='rounded'></iframe>
      <span class='close' style='margin-left: 10px; font-size: 30px; font-weight: 900; cursor: pointer;'>&times;</span>        
          
      </div>`;
  document.body.appendChild(modal);

  modal.querySelector(".close").addEventListener("click", function () {
      document.body.removeChild(modal);
  });
}


function makeEditable(cell, employeeId, dateStr) {
  cell.innerHTML = `
        <div>
          Check-In:&nbsp;&nbsp;&nbsp;<input type="time" id="checkInInput" class="border rounded px-3 py-1"><br>
          Check-Out:<input type="time" id="checkOutInput" class="border rounded px-3 py-1">
          <button class="text-white px-3 py-1 rounded bg-gray-700 hover:bg-gray-600" onclick="saveAttendance('${employeeId}', '${dateStr}')">저장</button>
        </div>
      `;
}

export function saveAttendance(employeeId, dateStr) {
  const checkInInput = document.getElementById('checkInInput').value;
  const checkOutInput = document.getElementById('checkOutInput').value;

  if (checkInInput && checkOutInput) {
    let employee = attendanceData.find(emp => emp.employeeId === employeeId);
    if (!employee) {
      console.error(`Employee with ID ${employeeId} not found.`);
      return;
    }

    const recordIndex = employee.attendance.findIndex(rec => rec.date === dateStr);
    if (recordIndex === -1) {
      employee.attendance.push({ date: dateStr, checkIn: checkInInput, checkOut: checkOutInput });
    } else {
      employee.attendance[recordIndex] = { date: dateStr, checkIn: checkInInput, checkOut: checkOutInput };
    }

    localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
    showAttendance();
  } else {

    showToast('required-input','warning',lang);
  }
}

window.saveAttendance = saveAttendance;

function sortTableByName() {
  const table = document.getElementById('attendanceTable');
  const tbody = table.tBodies[0];
  const rows = Array.from(tbody.rows);

  sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';

  rows.sort((a, b) => {
    const nameA = a.cells[0].textContent.trim().toLowerCase();
    const nameB = b.cells[0].textContent.trim().toLowerCase();

    if (sortDirection === 'asc') {
      return nameA.localeCompare(nameB);
    } else {
      return nameB.localeCompare(nameA);
    }
  });

  const sortIcon = document.getElementById('sortIcon');
  sortIcon.textContent = sortDirection === 'asc' ? '▲' : '▼';

  rows.forEach(row => tbody.appendChild(row));
}

window.onload = () => {
  const storedData = localStorage.getItem('attendanceData');
  if (storedData) {
    attendanceData = JSON.parse(storedData);
  }
  if (attendanceData.length > 0) {
    updateEmployeeSelect();
  }
};
