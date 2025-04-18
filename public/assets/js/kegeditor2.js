import { initPageUI } from './accessControl.js';

const mockGroupList = [
  { groupcode: "A01", groupname: "공통코드", enabletype: "Y", regsitecode: "MAIN" },
  { groupcode: "B02", groupname: "상태코드", enabletype: "N", regsitecode: "SUB" },
  { groupcode: "A02", groupname: "모모모코드", enabletype: "Y", regsitecode: "MAIN" },
  { groupcode: "B03", groupname: "상태고고고", enabletype: "N", regsitecode: "SUB" }
];

let leftGridApi = null;
let rightGridApi = null;
const draggingRowKeys = new Set();

document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style");
  style.textContent = `
    .ag-row-drag { cursor: grab; }
    .ag-row-dragging { cursor: grabbing !important; }
  `;
  document.head.appendChild(style);

  // 권한 기반으로 초기화
  initPageUI("btnContainer", localStorage.getItem("userId"), location.pathname, {
    buttonOrder: [],
    gridInstance: null,
    gridOptions: {
      editableCols: ['groupcode', 'groupname', 'enabletype', 'regsitecode']
    },
    onLoad: (permissions) => {
      const canEdit = !!permissions.canEdit;
      setupMasterGrid(mockGroupList, canEdit);
      setupDetailGrid([], canEdit);
    }
  });
});

function canDrag() {
  return typeof window !== "undefined" && window.canEdit === true;
}

function getColumnDefs() {
  return [
    {
      field: "",
      rowDrag: true,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 60
    },
    { headerName: "그룹코드", field: "groupcode" },
    { headerName: "그룹명", field: "groupname" },
    { headerName: "사용여부", field: "enabletype" },
    { headerName: "등록사이트", field: "regsitecode" }
  ];
}

function setupMasterGrid(data, canEdit) {
  const gridDiv = document.getElementById("grid-left");
  gridDiv.innerHTML = "";

  const gridOptions = {
    columnDefs: getColumnDefs(canEdit),
    rowData: data,
    rowSelection: "multiple",
    defaultColDef: {
      flex: 1,
      resizable: true,
      sortable: true,
      filter: true
    },
    rowDragManaged: canEdit,
    suppressRowDrag: false,
    animateRows: true,
    onGridReady: params => {
      leftGridApi = params.api;

      // ✅ 권한 적용
      initPageUI("btnContainer", localStorage.getItem("userId"), location.pathname, {
        buttonOrder: [],
        gridInstance: {
          api: leftGridApi,
          columnApi: leftGridApi.columnController,
          columnDefs: leftGridApi.getColumnDefs()
        },
        gridOptions: {
          editableCols: ['groupcode', 'groupname', 'enabletype', 'regsitecode']
        }
      });

      registerDropZones();
    },
    getRowClass: params => {
      return draggingRowKeys.has(params.data.groupcode) ? 'dragging-row-highlight' : '';
    }
  };

  agGrid.createGrid(gridDiv, gridOptions);
}

function setupDetailGrid(data, canEdit) {
  const gridDiv = document.getElementById("grid-right");
  gridDiv.innerHTML = "";

  const gridOptions = {
    columnDefs: getColumnDefs(canEdit),
    rowData: data,
    rowSelection: "multiple",
    defaultColDef: {
      flex: 1,
      resizable: true,
      sortable: true,
      filter: true
    },
    rowDragManaged: canEdit,
    suppressRowDrag: false,
    animateRows: true,
    onGridReady: params => {
      rightGridApi = params.api;
      registerDropZones();
    }
  };

  agGrid.createGrid(gridDiv, gridOptions);
}

function registerDropZones() {
  if (leftGridApi && rightGridApi) {
    const toRight = rightGridApi.getRowDropZoneParams({
      onDragStop: event => {
        if (!canDrag()) {
          showToast("드래그 권한이 없습니다.", "warning", "ko");
          return;
        }

        const dragged = event.node.data;
        const selected = leftGridApi.getSelectedRows();
        const isMulti = selected.length > 1 && selected.some(r => r.groupcode === dragged.groupcode);
        const rows = isMulti ? selected : [dragged];

        moveRows(rows, "left");
      }
    });
    leftGridApi.addRowDropZone(toRight);

    const toLeft = leftGridApi.getRowDropZoneParams({
      onDragStop: event => {
        if (!canDrag()) {
          showToast("드래그 권한이 없습니다.", "warning", "ko");
          return;
        }

        const dragged = event.node.data;
        const selected = rightGridApi.getSelectedRows();
        const isMulti = selected.length > 1 && selected.some(r => r.groupcode === dragged.groupcode);
        const rows = isMulti ? selected : [dragged];
        moveRows(rows, "right");
      }
    });
    rightGridApi.addRowDropZone(toLeft);
  }
}

function moveRows(draggedRows, from) {
  const canEdit = window.canEdit === true; // ✅ 현재 전역 권한 사용
  const sourceApi = from === "left" ? leftGridApi : rightGridApi;
  const targetApi = from === "left" ? rightGridApi : leftGridApi;

  const sourceData = getCurrentRowData(sourceApi);
  const targetData = getCurrentRowData(targetApi);

  const filteredSource = sourceData.filter(row => !draggedRows.some(r => r.groupcode === row.groupcode));
  const mergedTarget = mergeUniqueRows(targetData, draggedRows);

  // ✅ 권한 상태 유지하며 재렌더
  setupMasterGrid(from === "left" ? filteredSource : mergedTarget, canEdit);
  setupDetailGrid(from === "left" ? mergedTarget : filteredSource, canEdit);

  showToast(`${draggedRows.length}건 이동 완료`, 'info', 'ko');
}

function getCurrentRowData(api) {
  const rowData = [];
  api.forEachNode(node => rowData.push(node.data));
  return rowData;
}

function mergeUniqueRows(target, added) {
  const map = new Map();
  [...added, ...target].forEach(row => {
    if (row?.groupcode) map.set(row.groupcode, row);
  });
  return Array.from(map.values());
}

// 타이틀
breadcrumb.textContent = "KEG-Editor";
