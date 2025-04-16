const mockGroupList = [
  { groupcode: "A01", groupname: "공통코드", enabletype: "Y", regsitecode: "MAIN" },
  { groupcode: "B02", groupname: "상태코드", enabletype: "N", regsitecode: "SUB" },
  { groupcode: "A02", groupname: "모모모코드", enabletype: "Y", regsitecode: "MAIN" },
  { groupcode: "B03", groupname: "상태고고고", enabletype: "N", regsitecode: "SUB" }
];

let leftGridApi = null;
let rightGridApi = null;

document.addEventListener("DOMContentLoaded", () => {
  setupMasterGrid(mockGroupList);
  setupDetailGrid([]);
});

function setupMasterGrid(data) {
  const columnDefs = [
    { checkboxSelection: true, headerCheckboxSelection: true, width: 40 },
    { headerName: "그룹코드", field: "groupcode" },
    { headerName: "그룹명", field: "groupname" },
    { headerName: "사용여부", field: "enabletype" },
    { headerName: "등록사이트", field: "regsitecode" }
  ];

  const gridOptions = {
    columnDefs,
    rowData: data,
    rowSelection: "multiple",
    defaultColDef: {
      flex: 1,
      resizable: true,
      sortable: true,
      filter: true
    },
    onGridReady: params => {
      leftGridApi = params.api;
    }
  };

  const gridDiv = document.getElementById("grid-left");
  gridDiv.innerHTML = "";
  agGrid.createGrid(gridDiv, gridOptions);
}

function setupDetailGrid(data) {
  const columnDefs = [
    { checkboxSelection: true, headerCheckboxSelection: true, width: 40 },
    { headerName: "그룹코드", field: "groupcode" },
    { headerName: "그룹명", field: "groupname" },
    { headerName: "사용여부", field: "enabletype" },
    { headerName: "등록사이트", field: "regsitecode" }
  ];

  const gridOptions = {
    columnDefs,
    rowData: data,
    rowSelection: "multiple",
    defaultColDef: {
      flex: 1,
      resizable: true,
      sortable: true,
      filter: true
    },
    onGridReady: params => {
      rightGridApi = params.api;
    }
  };

  const gridDiv = document.getElementById("grid-right");
  gridDiv.innerHTML = "";
  agGrid.createGrid(gridDiv, gridOptions);
}

function getCurrentRowData(api) {
  const rowData = [];
  api.forEachNode(node => rowData.push(node.data));
  return rowData;
}

function removeSelectedFromSource(sourceData, selected) {
  const selectedKeys = new Set(selected.map(row => row.groupcode));
  return sourceData.filter(row => !selectedKeys.has(row.groupcode));
}

function mergeUniqueRows(target, added) {
  const map = new Map();
  [...target, ...added].forEach(row => {
    map.set(row.groupcode, row); // groupcode 기준으로 중복 제거
  });
  return Array.from(map.values());
}

// 👉 왼쪽 → 오른쪽
document.getElementById("btn-move-right").addEventListener("click", () => {
  const selected = leftGridApi.getSelectedRows();
  if (selected.length === 0) return;

  const leftData = getCurrentRowData(leftGridApi);
  const rightData = getCurrentRowData(rightGridApi);

  const newLeft = removeSelectedFromSource(leftData, selected);
  const newRight = mergeUniqueRows(rightData, selected);

  setupMasterGrid(newLeft);
  setupDetailGrid(newRight);
});

// 👉 오른쪽 → 왼쪽
document.getElementById("btn-move-left").addEventListener("click", () => {
  const selected = rightGridApi.getSelectedRows();
  if (selected.length === 0) return;

  const leftData = getCurrentRowData(leftGridApi);
  const rightData = getCurrentRowData(rightGridApi);

  const newRight = removeSelectedFromSource(rightData, selected);
  const newLeft = mergeUniqueRows(leftData, selected);

  setupMasterGrid(newLeft);
  setupDetailGrid(newRight);
});



breadcrumb.textContent = "KEG-Editor"