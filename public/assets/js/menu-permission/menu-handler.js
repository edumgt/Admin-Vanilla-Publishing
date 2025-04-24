// 📁 통합 트리 메뉴 UI 코드
import {fetchPermissions, initPageUI} from "../accessControl.js";

let nextId = 1000;
let isDirty = false;
let treeData = [];

export function initMenuTab() {
	breadcrumb.textContent = "메뉴 관리";
	const root = document.getElementById("menuTree");
	root.innerHTML = "";

	fetchPermissions().then((permissions) => {
		initPageUI("btnContainer", {
			onAdd: addRootMenu,
			onSave: saveTree,
			buttonOrder: ["add", "save"],
			permissions,
		});
	});

	fetch(`${backendDomain}/api/menu/tree`)
			.then((res) => {
				if (!res.ok) throw new Error("메뉴 데이터를 불러오지 못했습니다.");
				return res.json();
			})
			.then((data) => {
				treeData = buildTree(data);
				renderTree(treeData, root);
				isDirty = false;
				nextId = Math.max(...getAllIds(treeData)) + 1;
			})
			.catch((err) => {
				console.error("메뉴 트리 로딩 실패:", err);
				alert("메뉴 트리를 불러오는 데 실패했습니다.");
			});
}

function getAllIds(data) {
	return data.flatMap((item) => [item.menuId, ...(item.children ? getAllIds(item.children) : [])]);
}

function buildTree(flatData) {
	const map = new Map();
	const roots = [];
	flatData.forEach((item) => {
		map.set(item.menuId, {...item, children: item.children || []});
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
	document.querySelectorAll("#menuTree li > div + div:not(.hidden)").forEach((el) => {
		const parentLi = el.closest("li");
		if (parentLi && parentLi.dataset.id) {
			openIds.push(parentLi.dataset.id);
		}
	});
	return openIds;
}

function getMaxSortOrder(items) {
	if (!items || items.length === 0) return 1;
	return Math.max(...items.map(i => i.sortOrder || 0)) + 1;
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
				(level === 1 ? "w-full" : level === 2 ? "w-[600px] ml-6" : "w-[400px] ml-12") +
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
				const targetLi = document.querySelector(`li[data-id="\${item.menuId}"]`);
				if (targetLi) {
					const toggleEl = targetLi.querySelector("i.fas.fa-toggle-on, i.fas.fa-toggle-off");
					if (toggleEl) updateToggleIcon(toggleEl, newState);
				}
				if (item.children?.length > 0) {
					item.children.forEach(child => updateChildren(child, newState));
				}
			}

			updateChildren(item, newState);
			updateParentState(toggle.closest("li"), treeData);
			isDirty = true;
		};

		const delBtn = document.createElement("i");
		delBtn.className = "fas fa-trash-alt text-red-500 hover:text-red-600 cursor-pointer text-base leading-none";
		delBtn.onclick = () => {
			if (item._new) {
				// 새로 추가된 항목이면 완전히 제거
				treeData = removeFromTree(treeData, item.menuId);
			} else {
				// 기존 항목이면 _deleted 플래그
				item._deleted = true;
			}
			li.remove();
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

				const newId = generateNextMenuId(item.menuId, item.children);
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
					_new: true
				};

				if (!item.children) item.children = [];
				item.children.push(newItem);

				const parentLi = e.target.closest("li");
				let childContainer = parentLi.querySelector("ul");
				if (!childContainer) {
					childContainer = document.createElement("ul");
					childContainer.className = "space-y-2 ml-4 border-l border-gray-300 pl-4 mt-1";
					parentLi.appendChild(childContainer);
				}

				renderTree([newItem], childContainer, level + 1, []);
				isDirty = true;
			};

			controls.append(addChildBtn);
		}
		controls.append(delBtn);
		wrapper.append(toggleBtn, labelBox, controls);
		li.appendChild(wrapper);

		if (hasChildren) {
			const childContainer = document.createElement("div");
			if (!openIds.includes(String(item.menuId))) childContainer.classList.add("hidden");
			renderTree(item.children, childContainer, level + 1, openIds);
			li.appendChild(childContainer);
			toggleBtn.addEventListener("click", () => {
				childContainer.classList.toggle("hidden");
				toggleBtn.classList.toggle("fa-chevron-down");
				toggleBtn.classList.toggle("fa-chevron-right");
			});
		}

		ul.appendChild(li);
		wrapper.addEventListener("click", () => {
			document.querySelectorAll(".selected-wrapper").forEach((el) => el.classList.remove("ring-2", "ring-primary", "bg-blue-50", "selected-wrapper"));
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

			function updateLevelRecursive(item, level) {
				if (item.level !== level) {
					item.level = level;
					item._updated = true;
				}
				if (item.children?.length) {
					item.children.forEach(child => updateLevelRecursive(child, level + 1));
				}
			}

			const targetArray = parentId ? findNodeById(treeData, parentId)?.children : treeData;
			if (Array.isArray(targetArray)) {
				const newOrder = Array.from(parentUl.children).map((li) => li.dataset.id);
				const newItems = [];

				newOrder.forEach((id) => {
					const node = targetArray.find((item) => String(item.menuId) === String(id));
					if (node) {
						newItems.push(node);
						// level 및 parentMenuId 갱신
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
		}
	});
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
		span.className = field === "href" ? "text-xs text-gray-500 hover:underline cursor-pointer" : "font-medium cursor-pointer";
		span.textContent = field === "href" ? newVal || "(링크 없음)" : newVal;
		span.addEventListener("click", () => makeEditable(span, item, field));
		input.replaceWith(span);
		isDirty = true;
	});
	input.addEventListener("keydown", (e) => {
		if (e.key === "Enter") input.blur();
	});
}

// ✅ 메뉴 ID 채번 함수
function generateNextMenuId(parentId, siblings) {
	const base = parentId.slice(0, 4); // 상위 4자리만 prefix
	let maxSuffix = 0;

	siblings?.forEach(child => {
		const cid = String(child.menuId);
		if (cid.startsWith(base) && cid.length === 6) {
			const suffix = parseInt(cid.slice(4, 6)); // 마지막 2자리
			if (!isNaN(suffix) && suffix > maxSuffix) {
				maxSuffix = suffix;
			}
		}
	});

	const nextSuffix = String(maxSuffix + 1).padStart(2, "0");
	return base + nextSuffix; // 0302 + 04 → 030204
}

function updateToggleIcon(toggleEl, useYn) {
	toggleEl.className = `fas fa-toggle-${useYn === "Y" ? "on" : "off"} text-${useYn === "Y" ? "green" : "gray"}-500 cursor-pointer text-base leading-none`;
}

function updateParentState(li, rootData) {
	const parentLi = li.closest("ul")?.closest("li");
	if (!parentLi) return;
	const parentId = parentLi.dataset.id;

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

	const parentNode = findNodeById(rootData, parentId);
	if (!parentNode || !parentNode.children) return;
	const allChildrenY = parentNode.children.every((child) => child.useYn === "Y");
	parentNode.useYn = allChildrenY ? "Y" : "N";
	const parentToggle = parentLi.querySelector("i.fas.fa-toggle-on, i.fas.fa-toggle-off");
	if (parentToggle) updateToggleIcon(parentToggle, parentNode.useYn);
	updateParentState(parentLi, rootData);
}

function addRootMenu() {
	const label = prompt("루트 메뉴 이름:");
	if (!label) return;
	const newId = nextId++;
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
	renderTree(treeData, document.getElementById("menuTree"), 1, getOpenMenuIds());
	isDirty = true;
}

function removeFromTree(data, menuIdToRemove) {
	return data.filter(item => {
		if (item.menuId === menuIdToRemove) return false; // 삭제 대상
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
				const flatItem = {
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
											: "updated"
				};
				result.push(flatItem);
			}
			if (item.children?.length > 0) {
				result.push(...flattenTreeDiff(item.children, item.menuId));
			}
		});
		return result;
	}

	const flatData = flattenTreeDiff(treeData);

	if (flatData.length === 0) return alert("변경된 내용이 없습니다.");
	if (!confirm("저장하시겠습니까?")) return;

	fetch(`${backendDomain}/api/menu/save-all`, {
		method: "POST",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify(flatData),
	})
			.then((res) => {
				if (!res.ok) throw new Error("저장 실패");
				showToast("메뉴가 성공적으로 저장되었습니다.", "success", lang);
			})
			.catch((err) => {
				console.error("저장 오류:", err);
				alert("저장 중 오류가 발생했습니다.");
			});
}
