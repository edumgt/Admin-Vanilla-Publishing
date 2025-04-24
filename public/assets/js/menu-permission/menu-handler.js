// 📁 통합 트리 메뉴 UI 코드
import { fetchPermissions, initPageUI } from "../accessControl.js";

let isDirty = false;
let treeData = [];

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
				"save",
				"refresh"
			],
			permissions,
		});
	});

	// 초기 메뉴 트리 로드
	reloadMenuTree();
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
	return roots;
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

		const label = document.createElement("span");
		label.className = "font-medium cursor-pointer";
		label.textContent = item.label;
		label.addEventListener("dblclick", () => makeEditable(label, item, "label"));

		const href = document.createElement("span");
		href.className = "text-xs text-gray-500 hover:underline cursor-pointer";
		href.textContent = item.href || "(링크 없음)";
		href.addEventListener("click", () => makeEditable(href, item, "href"));

		const labelBox = document.createElement("div");
		labelBox.className = "flex items-center gap-3";
		labelBox.append(label, href);

		const toggle = document.createElement("i");
		toggle.className = `fas fa-toggle-${item.useYn === "Y" ? "on" : "off"} text-${item.useYn === "Y" ? "green" : "gray"}-500 cursor-pointer text-base leading-none`;
		toggle.onclick = (e) => {
			e.stopPropagation();
			const newState = item.useYn === "Y" ? "N" : "Y";

			function updateChildren(item, newState) {
				item.useYn = newState;
				item._updated = true;
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
			// 삭제 표시
			item._deleted = true;
			// UI에서 제거
			li.remove();
			// 변경 표시
			isDirty = true;
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

	Sortable.create(ul, {
		group: "nested",
		animation: 150,
		fallbackOnBody: true,
		swapThreshold: 0.65,
		onEnd: (evt) => {
			isDirty = true;

			const parentUl = evt.to;
			const parentLi = parentUl.closest("li");
			const parentId = parentLi ? parentLi.dataset.id : null;
			const newLevel = parentLi ? getElementLevel(parentLi) + 1 : 1;

			const targetArray = parentId
					? findNodeById(treeData, parentId)?.children
					: treeData;

			if (Array.isArray(targetArray)) {
				const newOrder = Array.from(parentUl.children).map((li) => li.dataset.id);
				const newItems = [];

				newOrder.forEach((id) => {
					const node = targetArray.find((item) => String(item.menuId) === String(id));
					if (node) {
						newItems.push(node);
						node.parentMenuId = parentId || null;
						updateLevelRecursive(node, newLevel);
					}
				});

				if (newItems.length === targetArray.length) {
					newItems.forEach((item, index) => {
						if (item.sortOrder !== index + 1) {
							item.sortOrder = index + 1;
							item._moved = true;
							item._updated = true;
						}
					});
					targetArray.splice(0, targetArray.length, ...newItems);
				}
			}
		},
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

function makeEditable(el, item, field) {
	const original = item[field] || "";
	const input = document.createElement("input");
	input.type = "text";
	input.value = original;
	input.className = "border px-2 py-1 rounded text-sm";
	el.replaceWith(input);
	input.focus();
	input.addEventListener("blur", () => {
		const newVal = input.value.trim();
		item[field] = newVal;
		item._updated = true;
		const span = document.createElement("span");
		span.className =
				field === "href"
						? "text-xs text-gray-500 hover:underline cursor-pointer"
						: "font-medium cursor-pointer";
		span.textContent = field === "href" ? newVal || "(링크 없음)" : newVal;
		span.addEventListener("click", () => makeEditable(span, item, field));
		input.replaceWith(span);
		isDirty = true;
	});
	input.addEventListener("keydown", (e) => {
		if (e.key === "Enter") input.blur();
	});
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
	parentNode.useYn = allChildrenY ? "Y" : "N";
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