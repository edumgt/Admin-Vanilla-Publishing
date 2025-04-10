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
  const data = await fetchJson("http://127.0.0.1:8080/api/codegroup");

  if (data) {
    console.log("✅ 데이터 수신 완료:", data);
    localStorage.setItem("codegroupData", JSON.stringify(data));
    setupMasterGrid(data);
    setupDetailGrid([]); // 초기 빈 상세 그리드
  } else {
    console.warn("⚠️ 데이터를 가져올 수 없어 그리드가 렌더링되지 않습니다.");
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
      resizable: true,
      sortable: true,
      filter: true
    },
    onRowClicked: event => {
      const selectedGroup = event.data;
      console.log("🔍 선택된 그룹:", selectedGroup.groupcode);
      showDetailGrid(selectedGroup);
    }
  };

  agGrid.createGrid(document.getElementById("grid-left"), gridOptions);
}

function setupDetailGrid(rowData) {
  const columnDefs = [
    { headerName: "등록자", field: "regemp" },
    { headerName: "등록일자", field: "regdate", valueFormatter: dateFormatter },
    { headerName: "수정자", field: "modemp" },
    { headerName: "수정일자", field: "moddate", valueFormatter: dateFormatter },
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

  agGrid.createGrid(document.getElementById("grid-right"), gridOptions);
}

function showDetailGrid(group) {
  // 상세 데이터 생성 (여기서는 단일 그룹 데이터 구조 기준)
  const detailData = [group];

  // 기존 그리드 파괴 후 다시 생성 (또는 update 가능)
  const container = document.getElementById("grid-right");
  container.innerHTML = ""; // 초기화
  setupDetailGrid(detailData);
}

function dateFormatter(params) {
  const value = params.value;
  if (!value) return "-";
  const date = new Date(value);
  return date.toLocaleString("ko-KR");
}
