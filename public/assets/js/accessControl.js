// 📁 accessControl.js
import {
	createSearchButton,
	createAddButton,
	createDelButton,
	createSaveButton,
	createCloseButton,
	createResetSearchButton
} from './common.js';

// 권한 호출
function fetchPermissions(userId, menuPath) {
	const cleanPath = encodeURIComponent(menuPath.replace("/", ""));
	return fetch(`${backendDomain}/api/permissions?userId=${userId}&menuPath=${cleanPath}`)
			.then((res) => {
				if (!res.ok) throw new Error("권한 조회 실패");
				return res.json();
			});
}

// 버튼 + 그리드 권한 렌더링
export function initPageUI(
		containerId,
		userId,
		menuPath,
		{
			onSearch,
			onAdd,
			onDelete,
			onSave,
			onClose,
			gridInstance,
			gridOptions = {},
			buttonOrder = ['search', 'add', 'delete', 'save', 'close', 'resetSearch'],
			onLoad // ✅ 리팩토링: 권한 로딩 후 콜백
		}
) {
	fetchPermissions(userId, menuPath).then((permissions) => {
		// 전역 권한 세팅
		if (typeof window !== 'undefined') {
			window.canSearch = permissions.canSearch;
			window.canAdd = permissions.canAdd;
			window.canDelete = permissions.canDelete;
			window.canSave = permissions.canSave;
			window.canView = permissions.canView;
			window.canEdit = permissions.canEdit;
			window.canResetSearch = permissions.canResetSearch;
		}

		// ✅ onLoad 콜백 존재 시 실행
		if (typeof onLoad === 'function') {
			onLoad(permissions);
		}

		// ✅ 버튼 렌더링은 container가 존재할 때만
		const container = containerId ? document.getElementById(containerId) : null;
		if (container) {
			container.innerHTML = '';

			const buttonMap = {
				search: () => createSearchButton(window.canSearch, onSearch),
				add: () => createAddButton(window.canAdd, onAdd),
				delete: () => createDelButton(window.canDelete, onDelete),
				save: () => createSaveButton(window.canSave, onSave),
				close: () => createCloseButton(true, onClose),
				resetSearch: () => createResetSearchButton(window.canResetSearch)
			};

			buttonOrder.forEach((key) => {
				const buttonFactory = buttonMap[key];
				if (buttonFactory) {
					const btn = buttonFactory();
					if (btn) container.appendChild(btn);
				}
			});
		}

		// ✅ 그리드 권한 처리
		if (gridInstance && gridOptions.editableCols) {
			const canEdit = !!permissions.canEdit;

			// ✅ ag-Grid
			if (gridInstance?.api && gridInstance?.columnApi && Array.isArray(gridInstance.columnDefs)) {
				const updatedDefs = gridInstance.columnDefs.map((col) => {
					// 필드 이름이 editableCols에 포함되거나 rowDrag가 true면 유지
					if (gridOptions.editableCols.includes(col.field) || col.rowDrag) {
						return {
							...col,
							editable: canEdit,
							rowDrag: col.rowDrag ? canEdit : false
						};
					}
					return col;
				});
				gridInstance.api.setColumnDefs(updatedDefs);
				gridInstance.api.setGridOption('suppressRowDrag', !canEdit);
				gridInstance.api.setGridOption('rowDragManaged', canEdit);
			}

			// ✅ TUI Grid
			else if (typeof gridInstance?.setColumns === 'function') {
				const updatedCols = gridInstance.getColumns().map((col) => {
					if (gridOptions.editableCols.includes(col.name)) {
						return {
							...col,
							editor: 'text',
							editable: !!window.canEdit
						};
					}
					return col;
				});
				gridInstance.setColumns(updatedCols);
			}
		}
	}).catch((err) => {
		console.error("initPageUI 실패:", err);
		showToast('권한 로딩 실패', 'error', 'ko');
	});
}