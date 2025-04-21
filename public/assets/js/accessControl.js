// 📁 accessControl.js
import {
	createSearchButton,
	createAddButton,
	createDelButton,
	createSaveButton,
	createCloseButton,
	createResetSearchButton
} from './common.js';

// ✅ 권한 호출 함수 (userId, menuPath를 내부에서 자동 처리)
export function fetchPermissions() {
	const userId = localStorage.getItem("userId");
	const menuPath = location.pathname;

	if (!userId) throw new Error("userId가 localStorage에 없습니다.");
	if (!menuPath) throw new Error("menuPath가 유효하지 않습니다.");

	const cleanPath = encodeURIComponent(menuPath.replace("/", ""));
	return fetch(`${backendDomain}/api/permissions?userId=${userId}&menuPath=${cleanPath}`)
			.then((res) => {
				if (!res.ok) throw new Error("권한 조회 실패");
				return res.json();
			});
}

// ✅ 버튼 + 그리드 권한 렌더링 함수
export function initPageUI(
		containerId,
		{
			onSearch,
			onAdd,
			onDelete,
			onSave,
			onClose,
			gridInstance,
			gridOptions = {},
			buttonOrder = ['search', 'add', 'delete', 'save', 'close', 'resetSearch'],
			onLoad,
			permissions: externalPermissions // 외부에서 전달받은 권한 (optional)
		}
) {
	const applyUI = (permissions) => {
		// 전역 권한 저장
		if (typeof window !== 'undefined') {
			window.canSearch = permissions.canSearch;
			window.canAdd = permissions.canAdd;
			window.canDelete = permissions.canDelete;
			window.canSave = permissions.canSave;
			window.canView = permissions.canView;
			window.canEdit = permissions.canEdit;
			window.canResetSearch = permissions.canResetSearch;
		}

		// onLoad 콜백 실행
		if (typeof onLoad === 'function') {
			onLoad(permissions);
		}

		// 버튼 렌더링
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
				const btn = buttonMap[key]?.();
				if (btn) container.appendChild(btn);
			});
		}

		// 그리드 권한 처리
		if (gridInstance && gridOptions.editableCols) {
			const canEdit = !!permissions.canEdit;

			// ✅ ag-Grid
			if (typeof gridInstance.getRowNode === 'function' &&
					typeof gridInstance.addRowDropZone === 'function') {
				const currentDefs = typeof gridInstance.getColumnDefs === 'function'
						? gridInstance.getColumnDefs()
						: gridOptions.columnDefs;

				const updatedDefs = currentDefs.map((col) => {
					if (gridOptions.editableCols.includes(col.field) || col.rowDrag) {
						return {
							...col,
							editable: canEdit,
							rowDrag: col.rowDrag ? canEdit : false
						};
					}
					return col;
				});
				gridInstance.setColumnDefs?.(updatedDefs);
				gridInstance.setGridOption('rowDragManaged', canEdit);
				gridInstance.setGridOption('suppressRowDrag', false);

				// ✅ 편집 이벤트 차단
				if (!canEdit && !gridInstance.__permissionListenersRegistered) {
					gridInstance.__permissionListenersRegistered = true;

					gridInstance.addEventListener('cellEditingStarted', (event) => {
						event.api.stopEditing();
						showToast('편집 권한이 없습니다.', 'warning', 'ko');
					});

					gridInstance.addEventListener('rowDragMove', (event) => {
						showToast('드래그 권한이 없습니다.', 'warning', 'ko');
					});
				}
			}

			// ✅ TUI Grid
			else if (typeof gridInstance?.setColumns === 'function') {
				const updatedCols = gridInstance.getColumns().map((col) => {
					if (gridOptions.editableCols.includes(col.name)) {
						return {
							...col,
							editable: canEdit
						};
					}
					return col;
				});
				gridInstance.setColumns(updatedCols);

				gridInstance.on('editingStart', (ev) => {
					if (!permissions.canEdit) {
						ev.stop(); // TUI Grid 방식: 수정을 막음
						showToast('수정 권한이 없습니다.', 'warning', 'ko');
					}
				});
			}
		}
	};

	// 외부에서 전달된 권한이 있으면 바로 적용, 아니면 fetch
	if (externalPermissions) {
		applyUI(externalPermissions);
	} else {
		fetchPermissions()
				.then(applyUI)
				.catch((err) => {
					console.error("initPageUI 실패:", err);
					showToast('권한 로딩 실패', 'error', 'ko');
				});
	}
}