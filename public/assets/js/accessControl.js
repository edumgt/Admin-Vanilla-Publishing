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
	return fetch(`${backendDomain}/api/authorization/permissions?userId=${userId}&menuPath=${cleanPath}`)
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

			// 기본 버튼 생성 함수 정의
			const buttonMap = {
				search: (customOpts = {}) => {
					const btn = createSearchButton(
							customOpts.allowed !== undefined ? customOpts.allowed : window.canSearch,
							customOpts.onClick || onSearch,
							{
								icon: customOpts.icon // 아이콘 클래스명 전달
							}
					);
					applyCustomButtonProps(btn, customOpts);
					return btn;
				},
				add: (customOpts = {}) => {
					const btn = createAddButton(
							customOpts.allowed !== undefined ? customOpts.allowed : window.canAdd,
							customOpts.onClick || onAdd,
							{
								icon: customOpts.icon // 아이콘 클래스명 전달
							}
					);
					applyCustomButtonProps(btn, customOpts);
					return btn;
				},
				delete: (customOpts = {}) => {
					const btn = createDelButton(
							customOpts.allowed !== undefined ? customOpts.allowed : window.canDelete,
							customOpts.onClick || onDelete,
							{
								icon: customOpts.icon // 아이콘 클래스명 전달
							}
					);
					applyCustomButtonProps(btn, customOpts);
					return btn;
				},
				save: (customOpts = {}) => {
					const btn = createSaveButton(
							customOpts.allowed !== undefined ? customOpts.allowed : window.canSave,
							customOpts.onClick || onSave,
							{
								icon: customOpts.icon // 아이콘 클래스명 전달
							}
					);
					applyCustomButtonProps(btn, customOpts);
					return btn;
				},
				close: (customOpts = {}) => {
					const btn = createCloseButton(
							customOpts.allowed !== undefined ? customOpts.allowed : true,
							customOpts.onClick || onClose,
							{
								icon: customOpts.icon // 아이콘 클래스명 전달
							}
					);
					applyCustomButtonProps(btn, customOpts);
					return btn;
				},
				resetSearch: (customOpts = {}) => {
					const btn = createResetSearchButton(
							customOpts.allowed !== undefined ? customOpts.allowed : window.canResetSearch,
							customOpts.onClick,
							{
								icon: customOpts.icon // 아이콘 클래스명 전달
							}
					);
					applyCustomButtonProps(btn, customOpts);
					return btn;
				}
			};

			// 버튼을 순회하면서 생성 및 추가
			buttonOrder.forEach((item) => {
				// 문자열인 경우 (기존 방식)
				if (typeof item === 'string') {
					const btn = buttonMap[item]?.();
					if (btn) container.appendChild(btn);
				}
				// 객체인 경우 (확장된 방식)
				else if (typeof item === 'object' && item !== null) {
					const { type, ...customOpts } = item;
					if (buttonMap[type]) {
						const btn = buttonMap[type](customOpts);
						if (btn) container.appendChild(btn);
					}
				}
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
						showToast('수정 권한이 없습니다.', 'warning', 'ko');
					});

					gridInstance.addEventListener('rowDragMove', (event) => {
						showToast('수정 권한이 없습니다.', 'warning', 'ko');
					});
				}
			}

			// ✅ TUI Grid
			else if (typeof gridInstance?.setColumns === 'function') {
				// 편집 이벤트 차단
				gridInstance.on('editingStart', (ev) => {
					if (!permissions.canEdit) {
						ev.stop();
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

// 커스텀 버튼 속성 적용 함수
function applyCustomButtonProps(button, customOpts) {
	if (!button || !customOpts) return button;

	// ID 설정
	if (customOpts.id) {
		button.id = customOpts.id;
	}

	// 클래스 설정
	if (customOpts.className) {
		button.className = customOpts.className;
	}

	// 라벨 설정
	if (customOpts.label) {
		// 아이콘 유지하면서 텍스트만 변경
		const iconElement = button.querySelector('i');
		if (iconElement) {
			const iconClass = iconElement.className;
			button.innerHTML = `<i class="${customOpts.icon || iconClass}"></i><span>${customOpts.label}</span>`;
		} else {
			button.innerHTML = customOpts.label;
		}
	}
	// 아이콘만 변경
	else if (customOpts.icon) {
		const iconElement = button.querySelector('i');
		if (iconElement) {
			iconElement.className = customOpts.icon;
		}
	}

	return button;
}