// 📁 통합 트리 메뉴 UI 코드
import { fetchPermissions, initPageUI } from "../accessControl.js";

let isDirty = false;
let treeData = [];
// 변경 이력을 저장할 배열 추가
let changeHistory = [];
// 원래 위치를 저장할 맵 (이동 실행 취소용)
let originalPositions = new Map();

export function initMenuTab() {
	breadcrumb.textContent = "메뉴 관리";
	const root = document.getElementById("menuTree");
	root.innerHTML = "";

	fetchPermissions().then((permissions) => {
		initPageUI("btnContainer", {
			onSave: saveTree,
			onRefresh: reloadMenuTree,
			buttonOrder: [
				{ type: 'add', label: '1레벨 메뉴 추가', onClick: addRootMenu },
				{ type: 'save', label: '모든 변경사항 저장', onClick: saveTree },
				{ type: 'save', icon: 'fas fa-undo', label: '모든 변경사항 취소', onClick: cancelAllChanges }
			],
			permissions,
		});
	});

	// 변경 이력 패널 초기화
	initHistoryPanel();

	// 초기 메뉴 트리 로드
	reloadMenuTree();
}

// 변경 이력 패널 초기화 함수
function initHistoryPanel() {
	// 초기 상태 설정
	updateChangeCounts();

	// 변경 이력 목록 초기화
	const historyList = document.getElementById("historyList");
	const emptyHistory = document.getElementById("emptyHistory");

	if (historyList) {
		historyList.innerHTML = "";
		emptyHistory.style.display = changeHistory.length === 0 ? "block" : "none";
	}
}

// 변경 사항 카운터 업데이트 함수
function updateChangeCounts() {
	// 변경 유형별 카운트
	const newCount = changeHistory.filter(item => item.state === "new").length;
	const updatedCount = changeHistory.filter(item => item.state === "updated").length;
	const movedCount = changeHistory.filter(item => item.state === "moved").length;
	const deletedCount = changeHistory.filter(item => item.state === "deleted").length;

	// 총 변경 사항 카운트
	const totalCount = changeHistory.length;

	// UI 업데이트
	document.getElementById("change-summary").innerHTML = `총 <span class="font-bold">${totalCount}</span>건`;
	document.getElementById("newCount").textContent = newCount;
	document.getElementById("updatedCount").textContent = updatedCount;
	document.getElementById("movedCount").textContent = movedCount;
	document.getElementById("deletedCount").textContent = deletedCount;

	// 변경 내역이 없을 때 메시지 표시
	const emptyHistory = document.getElementById("emptyHistory");
	if (emptyHistory) {
		emptyHistory.style.display = totalCount === 0 ? "block" : "none";
	}
}

// 변경 이력에 항목 추가 함수
function addToHistory(item, action, details = {}) {
	// 이동 작업인 경우 같은 항목의 모든 이동 이력을 제거
	if (action === "moved") {
		// 같은 항목에 대한 이전 모든 '이동' 기록 제거
		changeHistory = changeHistory.filter(h =>
				!(h.menuId === item.menuId && h.state === "moved")
		);

		// 이동 히스토리 항목 ID 생성 (중복 방지용)
		const moveHistoryId = `history-${item.menuId}-moved`;

		// 이력 패널에서 기존 이동 항목 제거
		document.getElementById(moveHistoryId)?.remove();
	} else {
		// 이동이 아닌 경우 같은 유형의 중복 항목 검사
		const existingIndex = changeHistory.findIndex(
				h => h.menuId === item.menuId && h.state === action
		);

		// 이미 존재하면 업데이트
		if (existingIndex !== -1) {
			changeHistory[existingIndex].details = details;
			changeHistory[existingIndex].timestamp = new Date().getTime();

			// 이력 패널 업데이트
			const existingItem = document.getElementById(`history-${item.menuId}-${action}`);
			if (existingItem) {
				const textSpan = existingItem.querySelector("span");
				if (textSpan) {
					textSpan.textContent = `${item.label}: ${getActionText(action, details)}`;
				}
				return; // 이미 업데이트했으므로 중복 추가 방지
			}
		}
	}

	// 변경 이력 항목 생성
	const historyItem = {
		menuId: item.menuId,
		label: item.label,
		state: action,
		timestamp: new Date().getTime(),
		details: details
	};

	// 이력에 추가
	changeHistory.push(historyItem);

	// UI 업데이트
	renderHistoryItem(historyItem);
	updateChangeCounts();

	// 상태 표시기 업데이트
	updateItemStatusIndicator(item);
}

// 이력 항목의 액션 텍스트 생성 함수
function getActionText(action, details = {}) {
	switch (action) {
		case "new":
			return "신규 생성됨";
		case "updated":
			if (details.field === "label") {
				return `이름 변경됨 (기존: ${details.oldValue})`;
			} else if (details.field === "href") {
				return `링크 변경됨 (기존: ${details.oldValue || "(없음)"})`;
			} else if (details.field === "useYn") {
				return `상태 변경됨 (${details.oldValue === "Y" ? "활성" : "비활성"} → ${details.newValue === "Y" ? "활성" : "비활성"})`;
			} else {
				return "수정됨";
			}
		case "moved":
			let actionText = "위치 이동됨";
			if (details.originalParent) {
				const originalParent = details.originalParent === "root"
						? "최상위 메뉴"
						: findNodeById(treeData, details.originalParent)?.label || "이전 메뉴";
				const newParent = details.newParent === "root"
						? "최상위 메뉴"
						: findNodeById(treeData, details.newParent)?.label || "새 메뉴";
				actionText = `위치 이동됨 (${originalParent} → ${newParent})`;
			}
			return actionText;
		case "deleted":
			return "삭제됨";
		default:
			return "변경됨";
	}
}

// 항목 상태 표시기 업데이트 함수
function updateItemStatusIndicator(item) {
	// 메뉴 항목에 상태 표시기 추가/업데이트
	const menuLi = document.querySelector(`li[data-id="${item.menuId}"]`);
	if (!menuLi) return;

	const wrapper = menuLi.querySelector('div:first-child');
	if (!wrapper) return;

	const labelBox = wrapper.querySelector('.flex.items-center.gap-3');
	if (!labelBox) return;

	// 기존 상태 표시기 제거
	const existingIndicator = labelBox.querySelector('.status-indicator');
	if (existingIndicator) {
		existingIndicator.remove();
	}

	// 상태에 따른 새 표시기 추가
	let stateIndicator = null;
	if (item._new) {
		stateIndicator = document.createElement("span");
		stateIndicator.className = "ml-2 text-xs text-green-800 font-medium status-indicator";
		stateIndicator.textContent = "[신규]";
	} else if (item._moved) {
		stateIndicator = document.createElement("span");
		stateIndicator.className = "ml-2 text-xs text-yellow-800 font-medium status-indicator";
		stateIndicator.textContent = "[이동됨]";
	} else if (item._updated) {
		stateIndicator = document.createElement("span");
		stateIndicator.className = "ml-2 text-xs text-blue-800 font-medium status-indicator";
		stateIndicator.textContent = "[수정됨]";
	}

	if (stateIndicator) {
		labelBox.appendChild(stateIndicator);
	}
}

// 단일 변경 이력 항목 렌더링 함수
function renderHistoryItem(historyItem) {
	const historyList = document.getElementById("historyList");
	const emptyHistory = document.getElementById("emptyHistory");

	// 변경 내역이 없다는 메시지 숨기기
	if (emptyHistory) {
		emptyHistory.style.display = "none";
	}

	// 이미 같은 ID를 가진 항목이 있는지 확인
	const existingItem = document.getElementById(`history-${historyItem.menuId}-${historyItem.state}`);

	// 변경 내역 텍스트 생성
	const actionText = getActionText(historyItem.state, historyItem.details);

	// 항목이 이미 있으면 내용만 업데이트
	if (existingItem) {
		const textSpan = existingItem.querySelector("span");
		textSpan.textContent = `${historyItem.label}: ${actionText}`;
		return;
	}

	// 새 항목 생성
	const li = document.createElement("li");
	li.className = "py-2 flex justify-between";
	li.id = `history-${historyItem.menuId}-${historyItem.state}`;

	const textSpan = document.createElement("span");
	textSpan.className = "text-sm";
	textSpan.textContent = `${historyItem.label}: ${actionText}`;

	const undoButton = document.createElement("button");
	undoButton.className = "text-blue-600 hover:underline text-xs";
	undoButton.textContent = "실행 취소";
	undoButton.onclick = () => undoChange(historyItem);

	li.appendChild(textSpan);
	li.appendChild(undoButton);

	// 변경 이력 목록에 추가
	if (historyList) {
		historyList.appendChild(li);
	}
}

// 변경 사항 취소 함수
function undoChange(historyItem) {
	const menuItem = findNodeById(treeData, historyItem.menuId);

	if (!menuItem && historyItem.state !== "deleted") {
		console.error("취소할 메뉴 항목을 찾을 수 없습니다:", historyItem.menuId);
		return;
	}

	// 변경 유형에 따른 취소 처리
	switch (historyItem.state) {
		case "new":
			// 새로 생성된 항목 삭제
			if (menuItem.parentMenuId) {
				const parent = findNodeById(treeData, menuItem.parentMenuId);
				if (parent && parent.children) {
					parent.children = parent.children.filter(child => child.menuId !== menuItem.menuId);
				}
			} else {
				treeData = treeData.filter(item => item.menuId !== menuItem.menuId);
			}
			break;

		case "updated":
			// 수정된 항목 원상복구
			if (historyItem.details.field) {
				menuItem[historyItem.details.field] = historyItem.details.oldValue;

				// 다른 변경 사항이 없으면 _updated 플래그 제거
				const hasOtherUpdates = changeHistory.some(
						h => h.menuId === menuItem.menuId &&
								h.state === "updated" &&
								h !== historyItem
				);

				if (!hasOtherUpdates) {
					delete menuItem._updated;
				}
			}
			break;

		case "moved":
			// 이동 취소 시 같은 항목의 다른 이동 이력도 모두 제거
			changeHistory = changeHistory.filter(h =>
					!(h.menuId === historyItem.menuId && h.state === "moved")
			);

			// 이동 취소 - 원래 위치로 복원
			if (historyItem.details.originalParent && historyItem.details.originalIndex != null) {
				// 현재 위치에서 항목 제거
				let currentParent = null;
				if (menuItem.parentMenuId) {
					currentParent = findNodeById(treeData, menuItem.parentMenuId);
					if (currentParent && currentParent.children) {
						currentParent.children = currentParent.children.filter(
								child => child.menuId !== menuItem.menuId
						);
					}
				} else {
					treeData = treeData.filter(item => item.menuId !== menuItem.menuId);
				}

				// 원래 위치로 복원
				if (historyItem.details.originalParent === "root") {
					// 루트 레벨로 복원
					menuItem.parentMenuId = null;
					menuItem.level = 1;

					// 원래 인덱스에 삽입
					const originalIndex = Math.min(historyItem.details.originalIndex, treeData.length);
					treeData.splice(originalIndex, 0, menuItem);
				} else {
					// 원래 부모 아래로 복원
					const originalParent = findNodeById(treeData, historyItem.details.originalParent);
					if (originalParent) {
						menuItem.parentMenuId = originalParent.menuId;
						menuItem.level = originalParent.level + 1;

						if (!originalParent.children) originalParent.children = [];
						const originalIndex = Math.min(historyItem.details.originalIndex, originalParent.children.length);
						originalParent.children.splice(originalIndex, 0, menuItem);
					} else {
						// 원래 부모를 찾을 수 없는 경우 루트에 추가
						menuItem.parentMenuId = null;
						menuItem.level = 1;
						treeData.push(menuItem);
					}
				}
			}

			// _moved 플래그 완전히 제거
			delete menuItem._moved;
			delete menuItem._updated;

			break;

		case "deleted":
			// 삭제 취소 (삭제된 항목 복원)
			// historyItem.details에서 원래 정보 가져오기
			if (historyItem.details.originalData) {
				const originalData = historyItem.details.originalData;
				const originalParentId = originalData.parentMenuId;

				// 삭제 표시 제거
				delete originalData._deleted;

				// 부모 항목 찾기
				if (originalParentId) {
					const parent = findNodeById(treeData, originalParentId);
					if (parent) {
						if (!parent.children) parent.children = [];
						parent.children.push(originalData);
					} else {
						// 부모를 찾을 수 없으면 루트에 추가
						treeData.push(originalData);
					}
				} else {
					// 최상위 메뉴였으면 다시 최상위에 추가
					treeData.push(originalData);
				}
			}
			break;
	}

	// 변경 이력에서 항목 제거
	changeHistory = changeHistory.filter(item =>
			!(item.menuId === historyItem.menuId && item.state === historyItem.state)
	);

	// 변경 이력 패널 업데이트
	document.getElementById(`history-${historyItem.menuId}-${historyItem.state}`)?.remove();
	updateChangeCounts();

	// UI 새로고침
	const openIds = getOpenMenuIds();
	const root = document.getElementById("menuTree");
	root.innerHTML = "";
	renderTree(treeData, root, 1, openIds);

	// 변경 이력이 없으면 isDirty 플래그 초기화
	if (changeHistory.length === 0) {
		isDirty = false;
	}
}

// 모든 변경 사항 취소 함수
function cancelAllChanges() {
	if (changeHistory.length === 0) {
		showToast("취소할 변경 사항이 없습니다.", "warning", lang);
		return;
	}

	if (confirm("모든 변경 사항을 취소하시겠습니까?")) {
		// 변경 이력 초기화
		changeHistory = [];

		// 트리 다시 로드
		reloadMenuTree();

		showToast("모든 변경 사항이 취소되었습니다.", "success", lang);
	}
}

// 트리 다시 로드하는 함수
function reloadMenuTree() {
	const root = document.getElementById("menuTree");
	// 현재 열려있는 메뉴 ID 저장
	const openIds = getOpenMenuIds();

	// 로딩 표시 (선택 사항)
	root.innerHTML = "<div class='text-center py-4'><i class='fas fa-spinner fa-spin'></i> 메뉴 불러오는 중...</div>";

	fetch(`${backendDomain}/api/menu/tree`)
			.then((res) => {
				if (!res.ok) throw new Error("메뉴 데이터를 불러오지 못했습니다.");
				return res.json();
			})
			.then((data) => {
				treeData = buildTree(data);
				root.innerHTML = "";
				renderTree(treeData, root, 1, openIds);
				isDirty = false;

				// 변경 이력 초기화
				changeHistory = [];
				originalPositions = new Map();
				initHistoryPanel();
			})
			.catch((err) => {
				console.error("메뉴 트리 로딩 실패:", err);
				showToast("메뉴 트리를 불러오는 데 실패했습니다.", "error", lang);
			});
}

function getAllIds(data) {
	return data.flatMap((item) => [
		item.menuId,
		...(item.children ? getAllIds(item.children) : []),
	]);
}

function buildTree(flatData) {
	const map = new Map();
	const roots = [];
	flatData.forEach((item) => {
		map.set(item.menuId, { ...item, children: item.children || [] });
	});
	map.forEach((item) => {
		if (item.parentMenuId) {
			const parent = map.get(item.parentMenuId);
			if (parent) parent.children.push(item);
		} else {
			roots.push(item);
		}
	});

	// 트리 로드 시 원래 위치 저장 (이동 취소용)
	saveOriginalPositions(roots);

	return roots;
}

// 원래 위치 저장 함수
function saveOriginalPositions(items, parentId = "root") {
	items.forEach((item, index) => {
		// 각 항목의 원래 위치 정보 저장
		originalPositions.set(item.menuId, {
			parentId: parentId,
			index: index,
			level: item.level
		});

		// 자식 항목도 처리
		if (item.children && item.children.length > 0) {
			saveOriginalPositions(item.children, item.menuId);
		}
	});
}

function getOpenMenuIds() {
	const openIds = [];
	document
			.querySelectorAll("#menuTree li > div + div:not(.hidden)")
			.forEach((el) => {
				const parentLi = el.closest("li");
				if (parentLi && parentLi.dataset.id) {
					openIds.push(parentLi.dataset.id);
				}
			});
	return openIds;
}

function getMaxSortOrder(items) {
	if (!items || items.length === 0) return 1;
	return Math.max(...items.map((i) => i.sortOrder || 0)) + 1;
}

// renderTree 함수 수정 - 상태 변경 시 변경 이력 추가
function renderTree(data, parentEl, level = 1, openIds = []) {
	const ul = document.createElement("ul");
	ul.className = "space-y-2";

	data.forEach((item) => {
		if (item._deleted) return;

		const li = document.createElement("li");
		li.dataset.id = item.menuId;

		const wrapper = document.createElement("div");
		wrapper.className =
				(level === 1
						? "w-full"
						: level === 2
								? "w-[600px] ml-6"
								: "w-[400px] ml-12") +
				" border rounded px-4 py-2 my-2 flex items-center relative";

		const hasChildren = item.children && item.children.length > 0;
		const toggleBtn = document.createElement("i");
		toggleBtn.className = hasChildren
				? "fas fa-chevron-right text-sm text-gray-600 mr-2 cursor-pointer"
				: "w-4";
		toggleBtn.style.minWidth = "1rem";

		// 상태 표시기 부분
		const labelBox = document.createElement("div");
		labelBox.className = "flex items-center gap-3";

		const label = document.createElement("span");
		label.className = "font-medium cursor-pointer";
		label.textContent = item.label;
		label.addEventListener("dblclick", () => {
			const oldValue = item.label;
			makeEditableWithHistory(label, item, "label", oldValue);
		});

		const href = document.createElement("span");
		href.className = "text-xs text-gray-500 hover:underline cursor-pointer";
		href.textContent = item.href || "(링크 없음)";
		href.addEventListener("click", () => {
			const oldValue = item.href;
			makeEditableWithHistory(href, item, "href", oldValue);
		});

		labelBox.append(label, href);

		// 상태 표시기 추가
		if (item._new) {
			const stateIndicator = document.createElement("span");
			stateIndicator.className = "ml-2 text-xs text-green-800 font-medium status-indicator";
			stateIndicator.textContent = "[신규]";
			labelBox.appendChild(stateIndicator);
		} else if (item._moved) {
			const stateIndicator = document.createElement("span");
			stateIndicator.className = "ml-2 text-xs text-yellow-800 font-medium status-indicator";
			stateIndicator.textContent = "[이동됨]";
			labelBox.appendChild(stateIndicator);
		} else if (item._updated) {
			const stateIndicator = document.createElement("span");
			stateIndicator.className = "ml-2 text-xs text-blue-800 font-medium status-indicator";
			stateIndicator.textContent = "[수정됨]";
			labelBox.appendChild(stateIndicator);
		}

		const toggle = document.createElement("i");
		toggle.className = `fas fa-toggle-${item.useYn === "Y" ? "on" : "off"} text-${item.useYn === "Y" ? "green" : "gray"}-500 cursor-pointer text-base leading-none`;
		toggle.onclick = (e) => {
			e.stopPropagation();
			const oldValue = item.useYn;
			const newState = item.useYn === "Y" ? "N" : "Y";

			function updateChildren(item, newState) {
				const oldUseYn = item.useYn;
				item.useYn = newState;
				item._updated = true;

				// 값이 변경된 경우 이력에 추가
				if (oldUseYn !== newState) {
					addToHistory(item, "updated", {
						field: "useYn",
						oldValue: oldUseYn,
						newValue: newState
					});
				}

				const targetLi = document.querySelector(`li[data-id="${item.menuId}"]`);
				if (targetLi) {
					const toggleEl = targetLi.querySelector("i.fas.fa-toggle-on, i.fas.fa-toggle-off");
					if (toggleEl) updateToggleIcon(toggleEl, newState);
				}
				if (item.children?.length > 0) {
					item.children.forEach((child) => updateChildren(child, newState));
				}
			}

			updateChildren(item, newState);
			updateParentState(toggle.closest("li"), treeData);
			isDirty = true;
		};

		const delBtn = document.createElement("i");
		delBtn.className = "fas fa-trash-alt text-red-500 hover:text-red-600 cursor-pointer text-base leading-none";
		delBtn.onclick = () => {
			// 삭제 전 원본 데이터 저장 (복원용)
			const originalData = JSON.parse(JSON.stringify(item));

			// 삭제 표시
			item._deleted = true;
			// UI에서 제거
			li.remove();
			// 변경 표시
			isDirty = true;
			// 변경 이력에 추가
			addToHistory(item, "deleted", { originalData });
		};

		const controls = document.createElement("div");
		controls.className = "absolute right-4 inset-y-0 my-auto flex items-center gap-3";

		controls.append(toggle);

		if (level < 3) {
			const addChildBtn = document.createElement("i");
			addChildBtn.className = "fas fa-plus text-blue-500 hover:text-blue-600 cursor-pointer text-base leading-none";
			addChildBtn.onclick = (e) => {
				e.stopPropagation();
				const label = prompt("하위 메뉴 이름:");
				if (!label) return;

				// 수정된 ID 생성 함수 호출 - 레벨에 맞는 ID 생성
				const newId = generateNextMenuId(item.menuId, item.children, level + 1);
				const sortOrder = getMaxSortOrder(item.children);

				const newItem = {
					menuId: newId,
					parentMenuId: item.menuId,
					level: level + 1,
					sortOrder,
					label,
					href: "",
					useYn: "Y",
					children: [],
					_new: true,
				};

				if (!item.children) item.children = [];
				item.children.push(newItem);

				const parentLi = e.target.closest("li");

				// ✅ .children-container 없으면 생성
				let childrenDiv = parentLi.querySelector("div.children-container");
				if (!childrenDiv) {
					childrenDiv = document.createElement("div");
					childrenDiv.className = "children-container";
					parentLi.appendChild(childrenDiv);
				}

				// ✅ hidden 클래스 제거 (새 하위 메뉴가 추가되면 표시해야 함)
				childrenDiv.classList.remove("hidden");

				// ✅ childrenDiv 안에 ul 없으면 생성
				let childUl = childrenDiv.querySelector("ul");
				if (!childUl) {
					childUl = document.createElement("ul");
					childUl.className = "space-y-2";
					childrenDiv.appendChild(childUl);
				}

				// ✅ 화살표 토글 없으면 설정
				const toggleIcon = parentLi.querySelector("i.fas.fa-chevron-right, i.fas.fa-chevron-down, i.w-4");
				if (toggleIcon) {
					// 토글 아이콘의 클래스 변경 (최초 자식 추가 시)
					toggleIcon.className = "fas fa-chevron-down text-sm text-gray-600 mr-2 cursor-pointer";
					toggleIcon.style.minWidth = "1rem";
				}

				renderTree([newItem], childUl, level + 1, []);
				isDirty = true;

				// 변경 이력에 추가
				addToHistory(newItem, "new");

				// 원래 위치 정보 저장
				originalPositions.set(newItem.menuId, {
					parentId: item.menuId,
					index: item.children.length - 1,
					level: level + 1
				});
			};

			controls.append(addChildBtn);
		}

		controls.append(delBtn);
		wrapper.append(toggleBtn, labelBox, controls);
		li.appendChild(wrapper);

		// ✅ 항상 children-container 생성
		const childContainer = document.createElement("div");
		childContainer.className = "children-container";
		// 자식이 없거나 열린 상태가 아니면 숨김
		if (!hasChildren || !openIds.includes(String(item.menuId))) {
			childContainer.classList.add("hidden");
		}

		// 항상 빈 ul 요소 생성
		const childUl = document.createElement("ul");
		childUl.className = "space-y-2";
		childContainer.appendChild(childUl);

		// 자식이 있으면 자식들 렌더링
		if (hasChildren) {
			renderTree(item.children, childUl, level + 1, openIds);
		}

		li.appendChild(childContainer);

		// ✅ 토글 버튼에 항상 이벤트 리스너 추가 (자식 유무 상관없이)
		toggleBtn.addEventListener("click", () => {
			childContainer.classList.toggle("hidden");
			toggleBtn.classList.toggle("fa-chevron-down");
			toggleBtn.classList.toggle("fa-chevron-right");
		});

		ul.appendChild(li);
		wrapper.addEventListener("click", () => {
			document
					.querySelectorAll(".selected-wrapper")
					.forEach((el) =>
							el.classList.remove("ring-2", "ring-primary", "bg-blue-50", "selected-wrapper")
					);
			wrapper.classList.add("ring-2", "ring-primary", "bg-blue-50", "selected-wrapper");
		});
	});

	parentEl.appendChild(ul);

	// Sortable 구현 시 변경 이력 추가
	Sortable.create(ul, {
		group: "nested",
		animation: 150,
		fallbackOnBody: true,
		swapThreshold: 0.65,
		onStart: (evt) => {
			// 드래그 시작할 때 원래 위치 기억
			const menuId = evt.item.dataset.id;
			const movedItem = findNodeById(treeData, menuId);

			if (movedItem) {
				// 원래 위치가 아직 저장되지 않았으면 저장
				if (!originalPositions.has(menuId)) {
					const parentLi = evt.from.closest("li");
					const parentId = parentLi ? parentLi.dataset.id : "root";
					const index = Array.from(evt.from.children).indexOf(evt.item);

					originalPositions.set(menuId, {
						parentId: parentId,
						index: index,
						level: movedItem.level
					});
				}
			}
		},
		// Sortable onEnd 이벤트 핸들러 수정
		// Sortable onEnd 이벤트 핸들러 전체 수정
		onEnd: (evt) => {
			isDirty = true;

			const movedItemId = evt.item.dataset.id;
			const movedItem = findNodeById(treeData, movedItemId);

			if (!movedItem) return;

			const fromEl = evt.from;
			const toEl = evt.to;
			const parentLi = toEl.closest("li");
			const newParentId = parentLi ? parentLi.dataset.id : "root";
			const newIndex = Array.from(toEl.children).indexOf(evt.item);
			const newLevel = parentLi ? getElementLevel(parentLi) + 1 : 1;

			// 항상 이동으로 처리하기 위해 실제 이동 여부를 더 엄격하게 확인
			const fromIndex = evt.oldIndex;
			const toIndex = evt.newIndex;
			const fromParentId = evt.from.closest("li")?.dataset.id || "root";

			// 출발지와 도착지가 다르거나, 같은 부모 내에서 위치가 변경된 경우
			const isReallyMoved = fromParentId !== newParentId || fromIndex !== toIndex || evt.from !== evt.to;

			if (!isReallyMoved) return;

			console.log("항목 이동 감지:", movedItem.label,
					"출발:", fromParentId, fromIndex,
					"도착:", newParentId, toIndex);

			// 이동 처리
			const targetArray = parentLi
					? findNodeById(treeData, parentLi.dataset.id)?.children
					: treeData;

			if (Array.isArray(targetArray)) {
				const newOrder = Array.from(toEl.children).map((li) => li.dataset.id);
				const newItems = [];

				newOrder.forEach((id, index) => {
					const node = targetArray.find((item) => String(item.menuId) === String(id));
					if (node) {
						newItems.push(node);

						const oldParentId = node.parentMenuId ? node.parentMenuId : "root";
						node.parentMenuId = parentLi ? parentLi.dataset.id : null;

						if (node.level !== newLevel) {
							updateLevelRecursive(node, newLevel);
						}

						node.sortOrder = index + 1;

						// 현재 드래그 중인 항목인 경우
						if (String(node.menuId) === movedItemId) {
							// 항상 새로운 이동으로 처리
							node._moved = true;
							node._updated = true;

							// 이동 이력에 추가
							addToHistory(node, "moved", {
								originalParent: fromParentId,
								originalIndex: fromIndex,
								newParent: newParentId,
								newIndex: index
							});
						}
					}
				});

				if (newItems.length === targetArray.length) {
					targetArray.splice(0, targetArray.length, ...newItems);
				}

				// UI 업데이트
				updateItemStatusIndicator(movedItem);
			}
		}
	});
}

// 인라인 편집 이력 추적을 위한 함수
function makeEditableWithHistory(el, item, field, originalValue) {
	const input = document.createElement("input");
	input.type = "text";
	input.value = originalValue || "";
	input.className = "border px-2 py-1 rounded text-sm";
	el.replaceWith(input);
	input.focus();

	input.addEventListener("blur", () => {
		const newVal = input.value.trim();

		// 값이 변경된 경우에만 이력에 추가
		if (newVal !== originalValue) {
			item[field] = newVal;
			item._updated = true;

			// 변경 이력에 추가
			addToHistory(item, "updated", {
				field: field,
				oldValue: originalValue,
				newValue: newVal
			});

			isDirty = true;
		}

		const span = document.createElement("span");
		span.className = field === "href"
				? "text-xs text-gray-500 hover:underline cursor-pointer"
				: "font-medium cursor-pointer";
		span.textContent = field === "href" ? newVal || "(링크 없음)" : newVal;
		span.addEventListener("click", () => makeEditableWithHistory(span, item, field, newVal));
		input.replaceWith(span);
	});

	input.addEventListener("keydown", (e) => {
		if (e.key === "Enter") input.blur();
	});
}

function updateLevelRecursive(item, level) {
	if (item.level !== level) {
		item.level = level;
		item._updated = true;
	}
	if (item.children?.length) {
		item.children.forEach((child) => updateLevelRecursive(child, level + 1));
	}
}

function getElementLevel(liElement) {
	let level = 1;
	let parent = liElement.closest("ul");
	while (parent && parent.closest("li")) {
		level++;
		parent = parent.closest("li").closest("ul");
	}
	return level;
}

// 기존 함수는 이력 추적 함수로 대체
function makeEditable(el, item, field) {
	makeEditableWithHistory(el, item, field, item[field] || "");
}

// 새로운 1레벨 메뉴 ID 생성 함수
function generateRootMenuId(treeData) {
	// 기존 1레벨 메뉴 중 가장 큰 번호 찾기
	let maxFirstLevel = 0;
	treeData.forEach(item => {
		if (!item._deleted) {
			const menuId = String(item.menuId);
			// 앞 2자리 추출
			const firstLevel = parseInt(menuId.substring(0, 2), 10);
			if (!isNaN(firstLevel) && firstLevel > maxFirstLevel) {
				maxFirstLevel = firstLevel;
			}
		}
	});

	// 다음 1레벨 번호 생성 (앞 2자리 + "0000")
	const nextFirstLevel = String(maxFirstLevel + 1).padStart(2, '0');
	return nextFirstLevel + "0000";
}

// 하위 메뉴 ID 생성 함수 (새로운 채번 규칙 적용)
function generateNextMenuId(parentId, siblings, level) {
	parentId = String(parentId);

	// 상위 메뉴의 ID 분석
	if (level === 2) {
		// 2레벨 메뉴 ID 생성 (부모의 앞 2자리 + 새로운 2자리 + "00")
		const parentPrefix = parentId.substring(0, 2);

		// 형제 메뉴 중 가장 큰 2레벨 번호 찾기
		let maxSecondLevel = 0;
		siblings?.forEach(child => {
			if (!child._deleted) {
				const childId = String(child.menuId);
				const secondLevel = parseInt(childId.substring(2, 4), 10);
				if (!isNaN(secondLevel) && secondLevel > maxSecondLevel) {
					maxSecondLevel = secondLevel;
				}
			}
		});

		// 다음 2레벨 번호 생성
		const nextSecondLevel = String(maxSecondLevel + 1).padStart(2, '0');
		return parentPrefix + nextSecondLevel + "00";

	} else if (level === 3) {
		// 3레벨 메뉴 ID 생성 (부모의 앞 4자리 + 새로운 2자리)
		const parentPrefix = parentId.substring(0, 4);

		// 형제 메뉴 중 가장 큰 3레벨 번호 찾기
		let maxThirdLevel = 0;
		siblings?.forEach(child => {
			if (!child._deleted) {
				const childId = String(child.menuId);
				const thirdLevel = parseInt(childId.substring(4, 6), 10);
				if (!isNaN(thirdLevel) && thirdLevel > maxThirdLevel) {
					maxThirdLevel = thirdLevel;
				}
			}
		});

		// 다음 3레벨 번호 생성
		const nextThirdLevel = String(maxThirdLevel + 1).padStart(2, '0');
		return parentPrefix + nextThirdLevel;
	}

	// 기본값 (오류 방지)
	return "000000";
}

function updateToggleIcon(toggleEl, useYn) {
	toggleEl.className = `fas fa-toggle-${useYn === "Y" ? "on" : "off"} text-${
			useYn === "Y" ? "green" : "gray"
	}-500 cursor-pointer text-base leading-none`;
}

function updateParentState(li, rootData) {
	const parentLi = li.closest("ul")?.closest("li");
	if (!parentLi) return;
	const parentId = parentLi.dataset.id;

	const parentNode = findNodeById(rootData, parentId);
	if (!parentNode || !parentNode.children) return;
	const allChildrenY = parentNode.children.every((child) => child.useYn === "Y");

	// 상태가 변경된 경우 변경 이력에 추가
	if (parentNode.useYn !== (allChildrenY ? "Y" : "N")) {
		const oldValue = parentNode.useYn;
		parentNode.useYn = allChildrenY ? "Y" : "N";
		parentNode._updated = true;

		addToHistory(parentNode, "updated", {
			field: "useYn",
			oldValue: oldValue,
			newValue: parentNode.useYn
		});
	} else {
		parentNode.useYn = allChildrenY ? "Y" : "N";
	}

	const parentToggle = parentLi.querySelector(
			"i.fas.fa-toggle-on, i.fas.fa-toggle-off"
	);
	if (parentToggle) updateToggleIcon(parentToggle, parentNode.useYn);
	updateParentState(parentLi, rootData);
}

function findNodeById(data, id) {
	for (const node of data) {
		if (String(node.menuId) === String(id)) return node;
		if (node.children) {
			const found = findNodeById(node.children, id);
			if (found) return found;
		}
	}
	return null;
}

// 루트 메뉴 추가 함수 수정 (새로운 ID 생성 방식 적용)
function addRootMenu() {
	const label = prompt("루트 메뉴 이름:");
	if (!label) return;

	// 새로운 방식으로 1레벨 메뉴 ID 생성
	const newId = generateRootMenuId(treeData);
	const sortOrder = getMaxSortOrder(treeData);

	const newItem = {
		menuId: newId,
		parentMenuId: null,
		level: 1,
		sortOrder,
		label,
		href: "",
		useYn: "Y",
		children: [],
		_new: true,
		_updated: true
	};

	treeData.push(newItem);

	// UI 전체 다시 그리기 전에 open 상태 저장
	const openIds = getOpenMenuIds();
	const root = document.getElementById("menuTree");
	root.innerHTML = "";
	renderTree(treeData, root, 1, openIds);

	isDirty = true;

	// 변경 이력에 추가
	addToHistory(newItem, "new");

	// 원래 위치 정보 저장
	originalPositions.set(newItem.menuId, {
		parentId: "root",
		index: treeData.length - 1,
		level: 1
	});
}

function removeFromTree(data, menuIdToRemove) {
	return data.filter((item) => {
		if (item.menuId === menuIdToRemove) return false;
		if (item.children) {
			item.children = removeFromTree(item.children, menuIdToRemove);
		}
		return true;
	});
}

function saveTree() {
	function flattenTreeDiff(data, parentId = null) {
		const result = [];
		data.forEach((item) => {
			if (item._new || item._deleted || item._updated || item._moved) {
				result.push({
					menuId: item.menuId,
					parentMenuId: parentId,
					label: item.label,
					href: item.href,
					sortOrder: item.sortOrder,
					useYn: item.useYn,
					level: item.level,
					_state: item._new
							? "new"
							: item._deleted
									? "deleted"
									: item._moved
											? "moved"
											: "updated",
				});
			}

			// 현재 항목이 삭제된 경우, 모든 하위 항목도 삭제로 처리
			if (item._deleted && item.children?.length > 0) {
				function addDeletedChildren(children, parentId) {
					children.forEach(child => {
						result.push({
							menuId: child.menuId,
							parentMenuId: parentId,
							label: child.label,
							href: child.href,
							sortOrder: child.sortOrder,
							useYn: child.useYn,
							level: child.level,
							_state: "deleted"
						});

						if (child.children?.length > 0) {
							addDeletedChildren(child.children, child.menuId);
						}
					});
				}

				addDeletedChildren(item.children, item.menuId);
			}
			// 현재 항목이 삭제되지 않은 경우, 정상적으로 자식 처리
			else if (item.children?.length > 0) {
				result.push(...flattenTreeDiff(item.children, item.menuId));
			}
		});

		// 삭제 작업을 레벨 역순으로 처리하기 위해 정렬
		return result.sort((a, b) => {
			if (a._state === "deleted" && b._state === "deleted") {
				return b.level - a.level;
			}
			return 0;
		});
	}

	const flatData = flattenTreeDiff(treeData);

	if (flatData.length === 0) return showToast("변경된 내용이 없습니다.", "warning", lang);
	if (!confirm("저장하시겠습니까?")) return;

	fetch(`${backendDomain}/api/menu/save-all`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(flatData),
	})
			.then((res) => {
				if (!res.ok) throw new Error("저장 실패");
				showToast("메뉴가 성공적으로 저장되었습니다.", "success", lang);

				// 중요: 저장 성공 후 트리 데이터를 서버에서 다시 로드
				reloadMenuTree();
			})
			.catch((err) => {
				console.error("저장 오류:", err);
				showToast("저장 중 오류가 발생했습니다.", "error", lang);
			});
}