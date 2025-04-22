let leftGrid = null;
let rightGrid = null;
let selectedUserId = null;

const permissionFields = ["canSearch", "canAdd", "canDelete", "canResetSearch", "canSave", "canView", "canEdit"];

document.addEventListener("DOMContentLoaded", () => {
    fetchUsers();
    setupMenuTreeGrid([]); // 초기 빈 데이터로 트리 그리드 설정
});

function fetchUsers() {
    fetch(`${backendDomain}/api/users`)
            .then(res => res.json())
            .then(setupUserGrid)
            .catch(err => console.error("사용자 목록 조회 실패:", err));
}

function fetchMenuPermissions(userId) {
    fetch(`${backendDomain}/api/permissions/users/${userId}/menu`)
            .then(res => res.json())
            .then(setupMenuTreeGrid)
            .catch(err => console.error("사용자 메뉴 권한 조회 실패:", err));
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
                    fetchMenuPermissions(selectedUserId);
                }
            });
        }
    });
}

function setupMenuTreeGrid(data) {
    if (rightGrid) rightGrid.destroy();

    if (!data || !Array.isArray(data) || data.length === 0) {
        data = [];
    }

    // Step 1. 필드 변환 및 권한 설정
    const processedData = data.map(item => {
        return {
            ...item,
            menu_id: item.menuId,
            parent_menu_id: item.parentMenuId,
            level: Number(item.level),
            canSearch: item.canSearch || 0,
            canAdd: item.canAdd || 0,
            canDelete: item.canDelete || 0,
            canResetSearch: item.canResetSearch || 0,
            canSave: item.canSave || 0,
            canView: item.canView || 0,
            canEdit: item.canEdit || 0,
            hasPermission: item.hasPermission,  // ✅ 여기만 변경됨
            _children: [] // 자식 노드를 위한 배열
            // ⚠️ hasChildren은 일단 설정하지 않고 나중에 계산
        };
    });

    // Step 2. ID 매핑
    const idMap = {};
    processedData.forEach(item => {
        idMap[item.menu_id] = item;
    });

    // Step 3. 부모-자식 연결
    processedData.forEach(item => {
        if (item.parent_menu_id && idMap[item.parent_menu_id]) {
            idMap[item.parent_menu_id]._children.push(item);
        }
    });

    // 자식 연결 이후 정확하게 hasChildren 재계산
    Object.values(idMap).forEach(item => {
        const isLeaf = !item._children || item._children.length === 0;
        item.hasChildren = !isLeaf;

        // TUI Grid에서 leaf로 판단되게 하려면 _children을 null로 설정
        if (isLeaf) {
            item._children = null; // ✅ 핵심!
        }
    });

    // Step 5. 루트 노드 필터링 (level === 1)
    const rootItems = processedData.filter(item => item.level === 1);

    // Step 6. 컬럼 정의
    const columns = [
        {
            header: "메뉴 권한", name: "hasPermission", width: 80, align: 'center',
            formatter: ({ value, row }) => {
                const disabled = row.hasChildren ? "disabled" : "";
                return `<input type="checkbox" ${value === 1 ? "checked" : ""} ${disabled} />`;
            }
        },
        {
            header: "메뉴명", name: "label", align: 'left'
        },
        {
            header: "메뉴 ID", name: "menu_id", width: 100, align: 'center'
        },
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

    // Step 7. 트리뷰 구성
    rightGrid = new tui.Grid({
        el: document.getElementById("grid-right"),
        data: rootItems,
        rowHeaders: ['rowNum'],
        columns: columns,
        bodyHeight: "fitToParent",
        treeColumnOptions: {
            name: 'label',
            useIcon: true, // 부모만 폴더 아이콘 표시됨
            useCascadingCheckbox: false
        }
    });

    // Step 8. 클릭 이벤트 처리
    rightGrid.on('click', ev => {
        const { rowKey, columnName } = ev;
        if (rowKey == null) return;

        const row = rightGrid.getRow(rowKey);
        if (!row) return;

        if (row.hasChildren && columnName !== 'label') return;

        if (columnName === "hasPermission") {
            toggleMenuPermission(rowKey);
        } else if (permissionFields.includes(columnName)) {
            updateMenuPermissionField(rowKey, columnName);
        }
    });
}

function toggleMenuPermission(rowKey) {
    // row가 null인 경우 처리
    if (rowKey === null || rowKey === undefined) {
        return;
    }

    const row = rightGrid.getRow(rowKey);

    // row가 null이거나 undefined인 경우 처리
    if (!row) {
        return;
    }

    // 부모 메뉴는 토글 불가
    if (row.hasChildren || (typeof row._children === 'string' && row._children.toLowerCase() === 'true')) {
        return;
    }

    const newValue = row.hasPermission === 1 ? 0 : 1;

    const payload = {
        menuId: row.menu_id
    };

    fetch(`${backendDomain}/api/permissions/users/${selectedUserId}/menu`, {
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

                showToast(newValue === 1 ? "메뉴 권한 부여 완료" : "메뉴 권한 제거 완료", 'success', lang);
            })
            .catch(err => {
                showToast("API 오류: " + err, 'error', lang);
                console.error(err);
            });
}

function updateMenuPermissionField(rowKey, field) {
    // row가 null인 경우 처리
    if (rowKey === null || rowKey === undefined) {
        return;
    }

    const row = rightGrid.getRow(rowKey);

    // row가 null이거나 undefined인 경우, 또는 부모 메뉴이거나 기본 권한이 없는 경우
    if (!row || row.hasChildren ||
            (typeof row._children === 'string' && row._children.toLowerCase() === 'true') ||
            row.hasPermission !== 1) {
        return;
    }

    const newValue = row[field] === 1 ? 0 : 1;

    // 서버로 전송할 필드명 변환 (camelCase -> snake_case)
    const serverField = field
            .replace(/([A-Z])/g, "_$1")
            .toLowerCase()
            .replace(/^_/, "");

    const payload = {
        menuId: row.menu_id,
        field: serverField,
        value: newValue
    };

    fetch(`${backendDomain}/api/permissions/users/${selectedUserId}/menu/field`, {
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

// 모든 자식 메뉴의 권한을 재귀적으로 업데이트하는 함수 (현재는 사용되지 않음)
// DB에서 _children 필드가 'true'/'false' 문자열로 오는 경우에 대비한 처리
function updateChildrenPermissions(parentId, permissionValue) {
    if (!parentId) return;

    // 자식 메뉴 찾기
    const children = rightGrid.getData().filter(item =>
            item.parent_menu_id === parentId
    );

    if (!children || children.length === 0) return;

    children.forEach(child => {
        const rowKey = rightGrid.getIndexOfRow(child.rowKey);
        if (rowKey !== -1) {
            rightGrid.setValue(rowKey, "hasPermission", permissionValue);
            rightGrid.setValue(rowKey, "canView", permissionValue);

            if (permissionValue === 0) {
                permissionFields.forEach(field => {
                    rightGrid.setValue(rowKey, field, 0);
                });
            }

            // 이 자식이 부모인 경우 재귀적으로 처리
            const isParent = child.hasChildren ||
                    (typeof child._children === 'string' && child._children.toLowerCase() === 'true');

            if (isParent) {
                updateChildrenPermissions(child.menu_id, permissionValue);
            }
        }
    });
}

breadcrumb.textContent = "사용자별 메뉴 권한관리"