const mockGroupList = [
  { groupcode: "A01", groupname: "공통코드", enabletype: "Y", regsitecode: "MAIN" },
  { groupcode: "B02", groupname: "상태코드", enabletype: "N", regsitecode: "SUB" },
  { groupcode: "A02", groupname: "모모모코드", enabletype: "Y", regsitecode: "MAIN" },
  { groupcode: "B03", groupname: "상태고고고", enabletype: "N", regsitecode: "SUB" }
];

let leftGridApi = null;
let rightGridApi = null;

document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style");
  style.textContent = `
    .ag-row-drag { cursor: grab; }
    .ag-row-dragging { cursor: grabbing !important; }
  `;
  document.head.appendChild(style);

  setupMasterGrid(mockGroupList);
  setupDetailGrid([]);
});

const draggingRowKeys = new Set();


function setupMasterGrid(data) {
  const columnDefs = [
    { rowDrag: true, checkboxSelection: true, headerCheckboxSelection: true, width: 60 },
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
    rowDragManaged: true,
    animateRows: true,
    onGridReady: params => {
      leftGridApi = params.api;
      registerDropZones(); // ← 추가
    },
    // ✅ Drop to Right Grid
    onRowDragEnd: event => {
      const draggedData = event.node.data;
      const from = "left";
      moveRows(draggedData, from);
    },
    getRowClass: params => {
      const isDragging = draggingRowKeys.has(params.data.groupcode);
      return isDragging ? 'dragging-row-highlight' : '';
    }
  };

  const gridDiv = document.getElementById("grid-left");
  gridDiv.innerHTML = "";
  agGrid.createGrid(gridDiv, gridOptions);
}

function setupDetailGrid(data) {
  const columnDefs = [
    { rowDrag: true, checkboxSelection: true, headerCheckboxSelection: true, width: 60 },
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
    rowDragManaged: true,
    animateRows: true,
    onGridReady: params => {
      rightGridApi = params.api;
      registerDropZones();
    },
    // ✅ Drop to Left Grid
    onRowDragEnd: event => {
      const draggedData = event.node.data;
      const from = "right";
      moveRows(draggedData, from);
    }
  };

  const gridDiv = document.getElementById("grid-right");
  gridDiv.innerHTML = "";
  agGrid.createGrid(gridDiv, gridOptions);
}
function registerDropZones() {
  if (leftGridApi && rightGridApi) {
    // 왼쪽 → 오른쪽
    const toRightZone = rightGridApi.getRowDropZoneParams({
      onDragStop: event => {
        const dragged = event.node.data;
        let selected = [];

        try {
          selected = leftGridApi.getSelectedRows();
        } catch (e) {
          selected = [];
        }

        const isMultiDrag = Array.isArray(selected) && selected.length > 1 && selected.some(r => r.groupcode === dragged.groupcode);
        const rowsToMove = isMultiDrag ? selected : [dragged];

        moveRows(rowsToMove, "left");
      }
    });
    leftGridApi.addRowDropZone(toRightZone);

    // 오른쪽 → 왼쪽
    const toLeftZone = leftGridApi.getRowDropZoneParams({
      onDragStop: event => {
        const dragged = event.node.data;
        let selected = [];

        try {
          selected = rightGridApi.getSelectedRows();
        } catch (e) {
          selected = [];
        }

        const isMultiDrag = Array.isArray(selected) && selected.length > 1 && selected.some(r => r.groupcode === dragged.groupcode);
        const rowsToMove = isMultiDrag ? selected : [dragged];

        moveRows(rowsToMove, "right");
      }
    });
    rightGridApi.addRowDropZone(toLeftZone);
  }
}


function moveRows(draggedRows, from) {
  const sourceApi = from === "left" ? leftGridApi : rightGridApi;
  const targetApi = from === "left" ? rightGridApi : leftGridApi;

  const sourceData = getCurrentRowData(sourceApi);
  const targetData = getCurrentRowData(targetApi);

  const filteredSource = removeSelectedFromSource(sourceData, draggedRows);



  const mergedTarget = mergeUniqueRows(targetData, draggedRows);


  if (from === "left") {
    setupMasterGrid(filteredSource);
    setupDetailGrid(mergedTarget);
  } else {
    setupMasterGrid(mergedTarget);
    setupDetailGrid(filteredSource);
  }

  showToast(`${draggedRows.length}건 이동 완료`);
}

function getCurrentRowData(api) {
  const rowData = [];
  api.forEachNode(node => rowData.push(node.data));
  return rowData;
}

function removeSelectedFromSource(sourceData, selected) {
  if (!Array.isArray(selected)) return sourceData;

  const selectedKeys = new Set(selected.map(row => row.groupcode));
  return sourceData.filter(row => !selectedKeys.has(row.groupcode));
}


function mergeUniqueRows(target, added) {
  console.log("target.type: ", target.type);
  console.log("added.type: ", added.type);

  const map = new Map();
  [...added,...target].forEach(row => {
    if (row && typeof row === 'object' && 'groupcode' in row) {
      map.set(row.groupcode, row);
    }
  });
  return Array.from(map.values());
}



breadcrumb.textContent = "KEG-Editor"