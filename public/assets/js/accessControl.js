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
			buttonOrder = ['search', 'add', 'delete', 'save', 'close', 'resetSearch']
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

		const container = document.getElementById(containerId);
		if (!container) {
			console.warn(`${containerId} 엘리먼트를 찾을 수 없습니다.`);
			return;
		}

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

		// 그리드 권한 적용
		if (gridInstance && gridOptions.editableCols) {
			// ✅ ag-Grid
			if (gridInstance?.api && gridInstance?.columnApi && Array.isArray(gridInstance.columnDefs)) {
				const updatedDefs = gridInstance.columnDefs.map((col) => {
					if (gridOptions.editableCols?.includes(col.field)) {
						return {
							...col,
							editable: !!window.canEdit  // ✅ 수정 가능 여부만 토글
						};
					}
					return col;
				});
				gridInstance.api.setColumnDefs(updatedDefs);
			}

			// ✅ TUI Grid
			else if (typeof gridInstance?.setColumns === 'function') {
				const updatedCols = gridInstance.getColumns().map((col) => {
					if (gridOptions.editableCols.includes(col.name)) {
						return {
							...col,
							editor: 'text',                      // 항상 editor는 유지
							editable: !!window.canEdit           // editable로만 제어
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
