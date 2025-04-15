import { createAddButton, createDelButton } from './common.js';
const apiurl = "";
function showLoading(section) {
  section.innerHTML = `<div class="text-center text-lg font-semibold mt-4">데이터를 불러오는 중...</div>`;
}

function hideLoading(section) {
  section.innerHTML = "";
}
async function fetchJson(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url} - Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);

    if (error instanceof TypeError) {
      showToast('cors-error', 'error', lang); 
    } else {
      showToast('process-error', 'error', lang); 
    }

    return null;
  }
}


async function updateData(url, updatedRows) {
  if (updatedRows.length === 0) return;
  const updatesWithId = updatedRows.map(row => ({ id: row.id, changes: row }));
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatesWithId)
    });
    const result = await response.json();
    if (response.ok) {
      showToast('well-done', 'success', lang);
    } else {
      showToast('server-warning', 'warning', lang);
    }
    console.log(result);
  } catch (error) {
    //console.error('Update error:', error);
    showToast('process-error', 'error', lang);
  }
}

async function addData(url, newRow) {
  console.log("Sending new row to server:", newRow);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRow)
    });
    const result = await response.json();
    if (response.ok) {
      showToast('input-allowed', 'success', lang);
    } else {
      showToast('server-warning', 'warning', lang);
    }
    console.log("Server response:", result);
  } catch (error) {
    //console.error("Fetch error:", error);
    showToast('process-error', 'error', lang);
  }
}

async function deleteData(url, deletedRows) {
  if (deletedRows.length === 0) return;
  const ids = deletedRows.map(row => row.id);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids })
    });
    if (response.ok) {
      showToast('well-done', 'success', lang);
    } else {
      showToast('server-warning', 'warning', lang);
    }
  } catch (error) {
    //console.error('Delete error:', error);
    showToast('process-error', 'error', lang);
  }
}

function setupTabs(tabs, root, sections, populateTabContent) {
  const tabContainer = document.createElement('div');
  tabContainer.className = 'flex border-b';
  root.appendChild(tabContainer);

  tabs.forEach(tab => {
    const tabButton = document.createElement('button');
    tabButton.id = tab.id;
    tabButton.className = 'flex-1 text-center text-gray-600 hover:bg-gray-100';
    tabButton.innerText = tab.name;
    tabContainer.appendChild(tabButton);

    const section = document.createElement('div');
    section.id = `${tab.id}-section`;
    section.className = 'py-2 hidden';
    root.appendChild(section);
    sections[tab.id] = section;
  });

  sections['tab-inbound'].classList.remove('hidden');
  document.getElementById('tab-inbound').classList.add('active-tab');

  document.querySelectorAll("button").forEach(button => {
    button.addEventListener('click', async () => {
      tabs.forEach(t => {
        sections[t.id].classList.add('hidden');
        document.getElementById(t.id).classList.remove('active-tab');
      });

      const section = sections[button.id];
      document.getElementById(button.id).classList.add('active-tab');
      showLoading(section);

      setTimeout(async () => {
        await populateTabContent(button.id, section);
        section.classList.remove('hidden');
      }, 300);
    });
  });
}

function generateDefaultRow() {
  return {
    id: generateNanoId(),
    date: new Date().toISOString().split('T')[0],
    title: '',
    quantity: 0,
    isbn: ''
  };
}

function validateQuantity(value) {
  const newValue = String(value).replace(/\D/g, '');
  return newValue === '' ? 0 : parseInt(newValue);
}

function createGrid(sectionId, data, updateUrl) {
  const section = document.getElementById(sectionId);
  section.innerHTML = `<div id="${sectionId}-grid"></div>`;

  const grid = new tui.Grid({
    el: document.getElementById(`${sectionId}-grid`),
    data: data,
    bodyHeight: 560,
    pageOptions: { useClient: true, perPage: 15 },
    columns: [
      { header: 'ID', name: 'id', width: 180, align: 'center' },
      { header: 'ISBN', name: 'isbn', width: 200, align: 'center', editor: 'text', sortable: true },
      {
        header: '날짜', name: 'date', width: 150, align: 'center', editor: 'text', sortable: true, filter: 'text',
        formatter: ({ value }) => new Date(value).toISOString().split('T')[0]
      },
      { header: '도서명', name: 'title', align: 'center', editor: 'text', sortable: true, filter: 'select' },
      {
        header: '수량', name: 'quantity', width: 80, align: 'center',
        editor: { type: 'text', options: { inputAttributes: { type: 'number', min: 0 } } },
        sortable: true, filter: 'number',
        validation: { required: true, dataType: 'number', min: 0 },
        formatter: ({ value }) => String(value || 0)
      }
    ],
    rowHeaders: ["checkbox"],
    copyOptions: { useFormattedValue: true },
    editable: true
  });

  tui.Grid.applyTheme('default');

  grid.on('editingFinish', (ev) => {
    if (ev.columnName === 'quantity') {
      const valid = validateQuantity(ev.value);
      grid.setValue(ev.rowKey, ev.columnName, valid);
    }
  });

  grid.on('afterChange', (ev) => {
    const updatedRows = ev.changes.map(change => ({
      id: grid.getRow(change.rowKey).id,
      [change.columnName]: change.value
    }));
    const url = sectionId.includes('inbound') ? '/db/inbound/update' : '/db/outbound/update';
    updateData(apiurl + url, updatedRows);
  });

  const addButton = createAddButton();
  addButton.addEventListener('click', () => {
    const newRow = generateDefaultRow();
    grid.prependRow(newRow);
    const url = sectionId.includes('inbound') ? '/db/inbound/add' : '/db/outbound/add';
    addData(apiurl + url, newRow);
  });

  const deleteButton = createDelButton();
  deleteButton.addEventListener('click', () => {
    const checkedRows = grid.getCheckedRows();
    if (checkedRows.length === 0) return showToast('delete-not', 'warning', lang);
    grid.removeCheckedRows();
    const url = sectionId.includes('inbound') ? '/db/inbound/delete' : '/db/outbound/delete';
    deleteData(apiurl + url, checkedRows);
  });

  section.appendChild(addButton);
  section.appendChild(deleteButton);
}

function populateInbound(section, data) {
  if (!data) return section.innerHTML = `<div class="text-center text-lg font-semibold">데이터를 불러오는데 실패했습니다.</div>`;
  createGrid(section.id, data, 'http://127.0.0.1:8080/api/inbound');
}

function populateOutbound(section, data) {
  if (!data) return section.innerHTML = `<div class="text-center text-lg font-semibold">데이터를 불러오는데 실패했습니다.</div>`;
  createGrid(section.id, data, '/db/outbound');
}

function populateDashboard(section, inboundData, outboundData) {
  section.innerHTML = `<div id="stock-chart" class="w-full border border-gray-300 rounded-lg p-2 "></div>
    <div id="monthly-outbound-chart" class="w-full border border-gray-300 rounded-lg p-2 mt-4"></div>`;

  const inboundDict = Object.fromEntries(inboundData.map(book => [book.isbn, book.quantity]));
  const outboundDict = Object.fromEntries(outboundData.map(book => [book.isbn, book.quantity]));

  const stockData = [];
  inboundData.forEach(book => {
    const inboundQty = book.quantity;
    const outboundQty = outboundDict[book.isbn] || 0;
    const stockRemaining = inboundQty - outboundQty;
    if (stockRemaining !== 0) {
      stockData.push({ title: book.title, quantity: stockRemaining });
    }
  });

  const titles = stockData.map(item => item.title);
  const stockValues = stockData.map(item => item.quantity);

  if (stockData.length > 0) {
    const pieOptions = {
      chart: { type: 'pie', height: 350 },
      series: stockValues,
      labels: titles,
      title: { text: '재고 차이가 있는 도서 목록', align: 'center' }
    };
    const pieChart = new ApexCharts(document.querySelector("#stock-chart"), pieOptions);
    pieChart.render();
  } else {
    document.querySelector("#stock-chart").innerHTML = `<div class="text-center text-lg font-semibold">모든 재고가 일치합니다</div>`;
  }

  const monthlyOutbound = Array.from({ length: 12 }, (_, i) => ({
    month: `${i + 1}월`,
    quantity: Math.floor(Math.random() * 500) + 50
  }));

  const lineOptions = {
    chart: { type: 'line', height: 300 },
    series: [{ name: '월별 출고량', data: monthlyOutbound.map(item => item.quantity) }],
    xaxis: { categories: monthlyOutbound.map(item => item.month) },
    title: { text: '2024년 월별 출고 추이', align: 'center' }
  };
  const lineChart = new ApexCharts(document.querySelector("#monthly-outbound-chart"), lineOptions);
  lineChart.render();
}

const tabs = [
  { id: 'tab-inbound', name: '입고 관리' },
  { id: 'tab-outbound', name: '출고 관리' },
  { id: 'tab-dashboard', name: '대시보드' }
];

const root = document.getElementById('root');
root.className = 'mt-4';
const sections = {};

setupTabs(tabs, root, sections, async (tabId, section) => {
  if (tabId === 'tab-inbound') {
    const data = await fetchJson(apiurl + 'http://127.0.0.1:8080/api/inbound');
    hideLoading(section);
    populateInbound(section, data);
  } else if (tabId === 'tab-outbound') {
    const data = await fetchJson(apiurl + '/db/outbound');
    hideLoading(section);
    populateOutbound(section, data);
  } else if (tabId === 'tab-dashboard') {
    const inboundData = await fetchJson(apiurl + 'http://127.0.0.1:8080/api/inbound');
    const outboundData = await fetchJson(apiurl + '/db/outbound');
    hideLoading(section);
    populateDashboard(section, inboundData, outboundData);
  }
});

(async () => {
  const inboundData = await fetchJson(apiurl + 'http://127.0.0.1:8080/api/inbound');
  const outboundData = await fetchJson(apiurl + '/db/outbound');
  populateInbound(sections['tab-inbound'], inboundData);
  populateOutbound(sections['tab-outbound'], outboundData);
  populateDashboard(sections['tab-dashboard'], inboundData, outboundData);
})();