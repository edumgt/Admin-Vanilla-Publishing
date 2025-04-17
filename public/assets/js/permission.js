let leftGridApi = null;
let rightGridApi = null;
let selectedUserId = null;

const permissionFields = ["canSearch", "canAdd", "canDelete", "canResetSearch", "canSave", "canView"];

document.addEventListener("DOMContentLoaded", () => {
    injectDragStyles();
    fetchUsers();
    setupDetailGrid([]); // 초기 우측 그리드 비워두기
    breadcrumb.textContent = "사용자별 권한관리";
});

function injectDragStyles() {
    const style = document.createElement("style");
    style.textContent = `
        .ag-row-drag { cursor: grab; }
        .ag-row-dragging { cursor: grabbing !important; }
    `;
    document.head.appendChild(style);
}

function fetchUsers() {
    fetch(`${backendDomain}/api/users`)
            .then(res => res.json())
            .then(setupUserGrid)
            .catch(err => console.error("사용자 목록 조회 실패:", err));
}

function fetchPermissions(userId) {
    fetch(`${backendDomain}/api/permissions/users/${userId}`)
            .then(res => res.json())
            .then(setupDetailGrid)
            .catch(err => console.error("사용자 권한 조회 실패:", err));
}

function setupUserGrid(data) {
    const columnDefs = [
        { headerName: "ID", field: "id", width: 80, cellStyle: { textAlign: 'left' } },
        { headerName: "사용자명", field: "username", cellStyle: { textAlign: 'left' } },
        { headerName: "이메일", field: "email", cellStyle: { textAlign: 'left' } }
    ];

    const gridOptions = {
        columnDefs,
        rowData: data,
        rowSelection: "single",
        defaultColDef: {
            flex: 1,
            resizable: true,
            sortable: true,
            filter: true
        },
        animateRows: true,
        onGridReady: params => leftGridApi = params.api,
        onRowClicked: event => {
            selectedUserId = event.data.id;
            fetchPermissions(selectedUserId);
        }
    };

    agGrid.createGrid(document.getElementById("grid-left"), gridOptions);
}

function setupDetailGrid(data) {
    const columnDefs = [
        {
            headerName: "",
            field: "hasPermission",
            width: 60,
            cellStyle: { textAlign: 'center' },
            cellRenderer: params => {
                const checked = params.data.hasPermission === 1 ? 'checked' : '';
                return `<input type="checkbox" ${checked} />`;
            },
            onCellClicked: toggleHasPermission
        },
        {
            headerName: "페이지명",
            field: "pageName",
            cellStyle: { textAlign: 'left' }
        },
        ...permissionFields.map(field => ({
            headerName: field.replace("can", "").replace(/([A-Z])/g, " $1").trim(),
            field,
            width: field === "canResetSearch" ? 100 : 80,
            cellStyle: { textAlign: 'center' },
            cellRenderer: params => {
                const disabled = params.data.hasPermission !== 1 ? 'disabled' : '';
                const checked = params.value == 1 ? 'checked' : '';
                return `<input type="checkbox" ${checked} ${disabled} />`;
            },
            onCellClicked: updatePermissionField
        }))
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
        animateRows: true,
        onGridReady: params => rightGridApi = params.api
    };

    const gridDiv = document.getElementById("grid-right");
    gridDiv.innerHTML = ""; // ✅ 이 줄이 중요합니다.
    agGrid.createGrid(gridDiv, gridOptions);
}

function toggleHasPermission(params) {
    const userId = selectedUserId;
    const menuPageId = params.data.menuPageId;
    const newValue = params.data.hasPermission === 1 ? 0 : 1;
    params.data.hasPermission = newValue;

    const url = `${backendDomain}/api/permissions/users/${userId}`;
    const method = newValue === 1 ? "POST" : "DELETE";
    const payload = { menuPageId };

    fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
            .then(res => {
                if (!res.ok) throw new Error("API 실패");

                if (newValue === 0) {
                    permissionFields.forEach(field => params.data[field] = 0);
                }

                params.api.redrawRows({ rowNodes: [params.node] });
                showToast(newValue === 1 ? "권한 부여 완료" : "권한 제거 완료", 'success', lang);
            })
            .catch(err => {
                showToast("API 오류: " + err, 'error', lang);
                console.error("API 오류:", err);
                params.data.hasPermission = newValue === 1 ? 0 : 1;
                params.api.redrawRows({ rowNodes: [params.node] });
            });
}

function updatePermissionField(params) {
    if (params.data.hasPermission !== 1) return;

    const newValue = params.data[params.colDef.field] === 1 ? 0 : 1;
    params.data[params.colDef.field] = newValue;
    params.api.refreshCells({ rowNodes: [params.node] });

    const updatePayload = {
        menuPageId: params.data.menuPageId,
        field: params.colDef.field,
        value: newValue
    };

    fetch(`${backendDomain}/api/permissions/users/${selectedUserId}/field`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload)
    })
            .then(res => {
                if (!res.ok) throw new Error("업데이트 실패");
                showToast(`[${params.colDef.field}] 필드 업데이트 완료`, 'success', lang);
            })
            .catch(err => {
                showToast("API 오류: " + err, 'error', lang);
                params.data[params.colDef.field] = newValue === 1 ? 0 : 1;
                params.api.refreshCells({ rowNodes: [params.node] });
            });
}
