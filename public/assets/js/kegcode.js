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

document.addEventListener("DOMContentLoaded", async () => {
  const groupList = await fetchJson("http://127.0.0.1:8080/api/codegroup");

  if (groupList) {
    localStorage.setItem("codegroupData", JSON.stringify(groupList));
    setupMasterGrid(groupList);
    setupDetailGrid([]); // 초기 빈 오른쪽 그리드
  }
});

function setupMasterGrid(data) {
  const columnDefs = [
    { headerName: "그룹코드", field: "groupcode" },
    { headerName: "그룹명", field: "groupname" },
    { headerName: "사용여부", field: "enabletype" },
    { headerName: "등록사이트", field: "regsitecode" }
  ];

  const gridOptions = {
    columnDefs,
    rowData: data,
    defaultColDef: {
      flex: 1,
      editable: true,
      resizable: true,
      sortable: true,
      filter: true,
      minWidth: 120
    },
    rowSelection: "single",
    enableRangeSelection: true,
    suppressRowClickSelection: false,
    animateRows: true,
    pagination: true,
    paginationPageSize: 10,
    onRowClicked: async event => {
      const groupcode = event.data.groupcode;
      const detailList = await fetchJson(`http://127.0.0.1:8080/api/code?groupcode=${groupcode}`);
      if (detailList) updateDetailGrid(detailList);
    },
    onCellEditingStopped: params => {
      console.log("🔧 편집 완료:", params.data);
      // TODO: 변경된 데이터 서버 전송 처리
    },
    onGridReady: params => {
      params.api.sizeColumnsToFit();
    }
  };

  agGrid.createGrid(document.getElementById("grid-left"), gridOptions);
}


// ✅ 최초 1회만 new agGrid.Grid 사용해서 API를 받아옴
let detailGridApi = null;

function setupDetailGrid(rowData) {
  const columnDefs = [
    { headerName: "코드값", field: "codevalue" },
    { headerName: "코드명", field: "codename" },
    { headerName: "등록자", field: "regemp" },
    { headerName: "등록일자", field: "regdate", valueFormatter: dateFormatter },
    { headerName: "비고", field: "remark" }
  ];

  const gridOptions = {
    columnDefs,
    rowData,
    defaultColDef: {
      flex: 1,
      resizable: true,
      sortable: true,
      filter: true
    }
  };

  const gridDiv = document.getElementById("grid-right");
  const gridInstance = new agGrid.createGrid(gridDiv, gridOptions);
  detailGridApi = gridOptions.api;
}


function updateDetailGrid(rowData) {
  const gridDiv = document.getElementById("grid-right");
  gridDiv.innerHTML = ""; // 기존 grid 제거
  setupDetailGrid(rowData); // 새로운 데이터로 재생성
}

function dateFormatter(params) {
  const value = params.value;
  if (!value) return "-";
  const date = new Date(value);
  return date.toLocaleString("ko-KR");
}



breadcrumb.textContent = "KEG-Code"