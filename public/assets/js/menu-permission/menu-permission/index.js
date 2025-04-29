import { fetchPermissions, initPageUI } from "../../accessControl.js";

let leftGrid = null;
let rightGrid = null;
let selectedUserId = null;

const permissionFields = [
    "canSearch", "canAdd", "canDelete", "canResetSearch",
    "canSave", "canView", "canEdit"
];

export function initPermissionTab() {
    // if (window.__permissionTabInitialized) return;
    // window.__permissionTabInitialized = true;

    breadcrumb.textContent = "사용자별 메뉴 권한관리";

    fetchPermissions().then((permissions) => {
        initPageUI("btnContainer2", {
            onSave: saveAllPermissions,
            gridInstance: rightGrid,
            buttonOrder: ['save'],
            permissions
        });
    });

    fetchUsers();
    setupMenuTreeGrid([]); // 초기 빈 데이터
}

function fetchUsers() {
    fetch(`${backendDomain}/api/users`)
            .then(res => res.json())
            .then(setupUserGrid)
            .catch(err => console.error("사용자 목록 조회 실패:", err));
}

function fetchMenuPermissions(userId) {
    fetch(`${backendDomain}/api/menu/permission/users/${userId}/menu`)
            .then(res => res.json())
            .then(setupMenuTreeGrid)
            .catch(err => console.error("사용자 메뉴 권한 조회 실패:", err));
}

function setupUserGrid(data) {
    if (leftGrid) leftGrid.destroy();

    leftGrid = new tui.Grid({
        el: document.getElementById("grid-left"),
        data,
        rowHeaders: ['rowNum'],
        columns: [
            { header: "사용자명", name: "username" },
            { header: "이메일", name: "email" }
        ],
        bodyHeight: "fitToParent",
        onGridMounted() {
            leftGrid.on('click', ev => {
                const row = ev.rowKey;
                if (row !== undefined) {
                    selectedUserId = leftGrid.getValue(row, 'id');
                    fetchMenuPermissions(selectedUserId);
                }
            });
        }
    });
}

function setupMenuTreeGrid(data) {
    if (rightGrid) rightGrid.destroy();
    if (!Array.isArray(data)) data = [];

    const processedData = data.map(item => ({
        ...item,
        menu_id: item.menuId,
        parent_menu_id: item.parentMenuId,
        level: Number(item.level),
        ...Object.fromEntries(permissionFields.map(f => [f, item[f] || 0])),
        hasPermission: item.hasPermission,
        _children: []
    }));

    const idMap = Object.fromEntries(processedData.map(item => [item.menu_id, item]));
    processedData.forEach(item => {
        if (item.parent_menu_id && idMap[item.parent_menu_id]) {
            idMap[item.parent_menu_id]._children.push(item);
        }
    });

    Object.values(idMap).forEach(item => {
        const isLeaf = !item._children || item._children.length === 0;
        item.hasChildren = !isLeaf;
        if (isLeaf) item._children = null;
    });

    const rootItems = processedData.filter(item => item.level === 1);

    const columns = [
        {
            header: "메뉴 권한", name: "hasPermission", width: 80, align: 'center',
            formatter: ({ value }) => `<input type="checkbox" ${value === 1 ? "checked" : ""} />`
        },
        { header: "메뉴명", name: "label", align: 'left' },
        { header: "메뉴 ID", name: "menu_id", width: 100, align: 'center' },
        ...permissionFields.map(field => ({
            header: field.replace("can", "").replace(/([A-Z])/g, " $1").trim(),
            name: field,
            width: field === "canResetSearch" ? 100 : 80,
            align: 'center',
            formatter: ({ row, value }) => {
                const disabled = (row.hasChildren || row.hasPermission !== 1) ? "disabled" : "";
                return `<input type="checkbox" ${value === 1 ? "checked" : ""} ${disabled} />`;
            }
        }))
    ];

    rightGrid = new tui.Grid({
        el: document.getElementById("grid-right"),
        data: rootItems,
        rowHeaders: ['rowNum'],
        columns,
        bodyHeight: "fitToParent",
        treeColumnOptions: {
            name: 'label',
            useIcon: true,
            useCascadingCheckbox: false
        }
    });

    rightGrid.on('click', ev => {
        const { rowKey, columnName } = ev;
        if (rowKey == null) return;
        const row = rightGrid.getRow(rowKey);
        if (!row) return;

        if (columnName === "hasPermission") {
            const newValue = row.hasPermission === 1 ? 0 : 1;
            rightGrid.setValue(rowKey, "hasPermission", newValue);
            if (newValue === 0) {
                permissionFields.forEach(field => rightGrid.setValue(rowKey, field, 0));
            }
            applyPermissionToChildren(row.menu_id, newValue);
        }

        if (permissionFields.includes(columnName)) {
            updateMenuPermissionField(rowKey, columnName);
        }
    });
}

function applyPermissionToChildren(parentMenuId, permissionValue) {
    const allRows = rightGrid.getData();
    allRows.forEach(row => {
        if (row.parent_menu_id === parentMenuId) {
            const rowKey = rightGrid.getIndexOfRow(row.rowKey);
            if (rowKey !== -1) {
                rightGrid.setValue(rowKey, "hasPermission", permissionValue);
                if (permissionValue === 0) {
                    permissionFields.forEach(field => rightGrid.setValue(rowKey, field, 0));
                }
                applyPermissionToChildren(row.menu_id, permissionValue);
            }
        }
    });
}

function updateMenuPermissionField(rowKey, field) {
    const row = rightGrid.getRow(rowKey);
    if (!row || row.hasChildren || row.hasPermission !== 1) return;
    const newValue = row[field] === 1 ? 0 : 1;
    rightGrid.setValue(rowKey, field, newValue);
}

function saveAllPermissions() {
    const payload = rightGrid.getData()
            .filter(row => row.hasPermission === 1)
            .map(row => ({
                userId: selectedUserId,
                menuId: row.menu_id,
                ...Object.fromEntries(permissionFields.map(f => [f, row[f]]))
            }));

    console.log(payload);

    fetch(`${backendDomain}/api/menu/permission/users/${selectedUserId}/menu/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
            .then(res => {
                if (!res.ok) throw new Error("저장 실패");
                showToast("권한이 성공적으로 저장되었습니다.", "success", lang);
            })
            .catch(err => {
                showToast("저장 중 오류가 발생했습니다: " + err.message, "error", lang);
            });
}
