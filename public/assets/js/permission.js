let leftGrid = null;
let rightGrid = null;
let selectedUserId = null;

const permissionFields = ["canSearch", "canAdd", "canDelete", "canResetSearch", "canSave", "canView", "canEdit"];

document.addEventListener("DOMContentLoaded", () => {
    fetchUsers();
    setupDetailGrid([]);
});

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
    if (leftGrid) leftGrid.destroy();

    leftGrid = new tui.Grid({
        el: document.getElementById("grid-left"),
        data: data,
        rowHeaders: ['rowNum'],
        columns: [
            { header: "ID", name: "id", width: 60 },
            { header: "사용자명", name: "username" },
            { header: "이메일", name: "email" }
        ],
        bodyHeight: "fitToParent",
        onGridMounted() {
            leftGrid.on('click', ev => {
                const row = ev.rowKey;
                if (row !== undefined) {
                    selectedUserId = leftGrid.getValue(row, 'id');
                    fetchPermissions(selectedUserId);
                }
            });
        }
    });
}

function setupDetailGrid(data) {
    if (rightGrid) rightGrid.destroy();

    const columns = [
        {
            header: "", name: "hasPermission", width: 120, align: 'center',
            formatter: ({ value }) => `<input type="checkbox" ${value === 1 ? "checked" : ""} />`
        },
        {
            header: "페이지명", name: "pageName", align: 'left'
        },
        ...permissionFields.map(field => ({
            header: field.replace("can", "").replace(/([A-Z])/g, " $1").trim(),
            name: field,
            width: field === "canResetSearch" ? 100 : 80,
            align: 'center',
            formatter: ({ row, column }) => {
                const checked = row[column.name] === 1 ? "checked" : "";
                const disabled = row.hasPermission !== 1 ? "disabled" : "";
                return `<input type="checkbox" ${checked} ${disabled} />`;
            }
        }))
    ];

    rightGrid = new tui.Grid({
        el: document.getElementById("grid-right"),
        data: data,
        rowHeaders: ['rowNum'],
        columns: columns,
        bodyHeight: "fitToParent"
    });

    rightGrid.on('click', ev => {
        const { rowKey, columnName } = ev;
        if (columnName === "hasPermission") {
            toggleHasPermission(rowKey);
        } else if (permissionFields.includes(columnName)) {
            updatePermissionField(rowKey, columnName);
        }
    });
}

function toggleHasPermission(rowKey) {
    const row = rightGrid.getRow(rowKey);
    const newValue = row.hasPermission === 1 ? 0 : 1;

    const payload = { menuPageId: row.menuPageId };

    fetch(`${backendDomain}/api/permissions/users/${selectedUserId}`, {
        method: newValue === 1 ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
            .then(res => {
                if (!res.ok) throw new Error("API 실패");

                // hasPermission 필드만 업데이트
                rightGrid.setValue(rowKey, "hasPermission", newValue);

                // hasPermission이 0이면 나머지 필드도 모두 0으로 설정
                if (newValue === 0) {
                    permissionFields.forEach(field => {
                        rightGrid.setValue(rowKey, field, 0);
                    });
                }

                showToast(newValue === 1 ? "권한 부여 완료" : "권한 제거 완료", 'success', lang);
            })
            .catch(err => {
                showToast("API 오류: " + err, 'error', lang);
                console.error(err);
            });
}

function updatePermissionField(rowKey, field) {
    const row = rightGrid.getRow(rowKey);
    if (!row || row.hasPermission !== 1) return;

    const newValue = row[field] === 1 ? 0 : 1;
    const payload = {
        menuPageId: row.menuPageId,
        field,
        value: newValue
    };

    fetch(`${backendDomain}/api/permissions/users/${selectedUserId}/field`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
            .then(res => {
                if (!res.ok) throw new Error("업데이트 실패");

                // ✅ setValue로 바로 반영
                rightGrid.setValue(rowKey, field, newValue);

                showToast(`[${field}] 필드 업데이트 완료`, 'success', lang);
            })
            .catch(err => {
                showToast("API 오류: " + err, 'error', lang);
                console.error(err);
            });
}

breadcrumb.textContent = "사용자별 권한관리"