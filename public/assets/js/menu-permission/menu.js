import {fetchPermissions, initPageUI} from "../accessControl.js";

let nextId = 1000;
let isDirty = false;

export function initMenuTab() {
	breadcrumb.textContent = "메뉴 관리";
	const root = document.getElementById('menuTree');
	root.innerHTML = '';

	fetchPermissions().then((permissions) => {
		initPageUI("btnContainer", {
			onSave: {},
			buttonOrder: ['add', 'save'],
			permissions
		});
	});

	fetch(`${backendDomain}/api/menus/tree`)
			.then(res => {
				if (!res.ok) throw new Error('메뉴 데이터를 불러오지 못했습니다.');
				return res.json();
			})
			.then(data => {
				const treeData = buildTree(data);
				const container = document.getElementById('menuTree');
				container.innerHTML = '';
				renderTree(treeData, container);
				isDirty = false;
				nextId = Math.max(...getAllIds(treeData)) + 1;
			})
			.catch(err => {
				console.error('메뉴 트리 로딩 실패:', err);
				alert('메뉴 트리를 불러오는 데 실패했습니다.');
			});
}

function buildTree(flatData) {
	const map = new Map();
	const roots = [];

	// 모든 항목을 복제해서 map에 저장
	flatData.forEach(item => {
		map.set(item.menuId, { ...item, children: item.children || [] });
	});

	// 부모 자식 관계 연결
	map.forEach(item => {
		if (item.parentMenuId) {
			const parent = map.get(item.parentMenuId);
			if (parent) {
				parent.children.push(item);
			}
		} else {
			roots.push(item);
		}
	});

	return roots;
}

// 재귀적으로 트리 렌더링
function renderTree(data, parentEl, level = 1) {
	const ul = document.createElement('ul');
	ul.className = 'space-y-2';

	data.forEach(item => {
		const li = document.createElement('li');

		// ✅ wrapper
		const wrapper = document.createElement('div');
		wrapper.className =
				(level === 1
						? 'w-full'
						: level === 2
								? 'w-[600px] ml-6'
								: 'w-[400px] ml-12') +
				' border rounded px-4 py-2 my-2 flex items-center relative';

		// 🔽 폴딩 화살표 (있을 경우)
		const hasChildren = item.children && item.children.length > 0;
		const toggleBtn = document.createElement('i');
		toggleBtn.className = hasChildren
				? 'fas fa-chevron-down text-sm text-gray-600 mr-2 cursor-pointer'
				: 'w-4'; // 공간 유지
		toggleBtn.style.minWidth = '1rem';

		// 📄 메뉴명
		const label = document.createElement('span');
		label.className = 'font-medium cursor-pointer';
		label.textContent = item.label;
		label.addEventListener('dblclick', () => makeEditable(label, item, 'label'));

		// 🔗 href 표시
		const href = document.createElement('span');
		href.className = 'text-xs text-gray-500 hover:underline cursor-pointer';
		href.textContent = item.href || '(링크 없음)';
		href.addEventListener('click', () => makeEditable(href, item, 'href'));

		// label + href 묶기
		const labelBox = document.createElement('div');
		labelBox.className = 'flex items-center gap-3';
		labelBox.append(label, href);

		// ✅ 사용 여부 toggle
		const toggle = document.createElement('i');
		toggle.className = `fas fa-toggle-${item.use_yn === 'Y' ? 'on' : 'off'} text-${item.use_yn === 'Y' ? 'green' : 'gray'}-500 cursor-pointer text-base leading-none`;
		toggle.onclick = () => {
			item.use_yn = item.use_yn === 'Y' ? 'N' : 'Y';
			toggle.className = `fas fa-toggle-${item.use_yn === 'Y' ? 'on' : 'off'} text-${item.use_yn === 'Y' ? 'green' : 'gray'}-500 cursor-pointer text-base leading-none`;
			isDirty = true;
		};

		// 🗑 삭제 버튼
		const delBtn = document.createElement('i');
		delBtn.className = 'fas fa-trash-alt text-red-500 hover:text-red-600 cursor-pointer text-base leading-none';
		delBtn.onclick = () => {
			li.remove();
			isDirty = true;
		};

		// ➕ 오른쪽 컨트롤 버튼
		const controls = document.createElement('div');
		controls.className = 'absolute right-4 inset-y-0 my-auto flex items-center gap-3';
		controls.append(toggle, delBtn);

		// 전체 조합
		wrapper.append(toggleBtn, labelBox, controls);
		li.appendChild(wrapper);

		// ⬇️ 자식이 있으면 재귀적으로 추가
		if (hasChildren) {
			const childContainer = document.createElement('div');
			renderTree(item.children, childContainer, level + 1);
			li.appendChild(childContainer);

			// 🔽 폴딩 기능
			toggleBtn.addEventListener('click', () => {
				childContainer.classList.toggle('hidden');
				toggleBtn.classList.toggle('fa-chevron-down');
				toggleBtn.classList.toggle('fa-chevron-right');
			});
		}

		ul.appendChild(li);

		// ✅ 선택 시 하이라이트
		wrapper.addEventListener('click', () => {
			document.querySelectorAll('.selected-wrapper').forEach(el => {
				el.classList.remove('ring-2', 'ring-primary', 'bg-blue-50');
				el.classList.remove('selected-wrapper');
			});

			wrapper.classList.add('ring-2', 'ring-primary', 'bg-blue-50');
			wrapper.classList.add('selected-wrapper');
		});
	});

	parentEl.appendChild(ul);

	Sortable.create(ul, {
		group: 'nested',
		animation: 150,
		fallbackOnBody: true,
		swapThreshold: 0.65,
		onEnd: () => (isDirty = true)
	});
}

// 새 메뉴 추가
export function addMenu() {
	const label = prompt("새 메뉴 이름:");
	if (!label) return;

	const parentLi = document.querySelector('li.selected');
	const newId = nextId++;

	const newItem = {
		id: newId,
		label: label
	};

	const li = document.createElement('li');
	li.className = "flex items-center justify-between bg-gray-100 rounded hover:bg-gray-200 py-1.5 px-2 cursor-pointer group";
	li.dataset.id = newId;

	const span = document.createElement('span');
	span.className = "truncate flex items-center editable";
	span.innerHTML = `<i class="fas fa-file-alt text-primary mr-2"></i> ${label}`;
	span.addEventListener('dblclick', () => makeEditable(span, label));

	const delBtn = document.createElement('i');
	delBtn.className = "fas fa-trash-alt text-red-500 hover:text-red-600 cursor-pointer hidden group-hover:inline";
	delBtn.onclick = () => { li.remove(); isDirty = true; };

	li.append(span, delBtn);

	if (parentLi) {
		let childUl = parentLi.querySelector('ul');
		if (!childUl) {
			childUl = document.createElement('ul');
			childUl.className = "ml-4 space-y-2 border-l border-gray-300 pl-4 mt-1";
			parentLi.appendChild(childUl);
			Sortable.create(childUl, { group: 'nested', animation: 150 });
		}
		childUl.appendChild(li);
	} else {
		document.querySelector('#menuTree > ul').appendChild(li);
	}

	isDirty = true;
}

// 인라인 수정
function makeEditable(el, item, field) {
	const original = item[field] || '';
	const input = document.createElement('input');
	input.type = 'text';
	input.value = original;
	input.className = 'border px-2 py-1 rounded text-sm';
	el.replaceWith(input);
	input.focus();

	input.addEventListener('blur', () => {
		const newVal = input.value.trim();
		item[field] = newVal;
		const span = document.createElement('span');
		span.className = field === 'href'
				? 'text-xs text-gray-500 hover:underline cursor-pointer'
				: 'font-medium cursor-pointer';
		span.textContent = field === 'href' ? newVal || '(링크 없음)' : newVal;
		span.addEventListener('click', () => makeEditable(span, item, field));
		input.replaceWith(span);
		isDirty = true;
	});

	input.addEventListener('keydown', e => {
		if (e.key === 'Enter') input.blur();
	});
}

// 저장 로직 (JSON 변환 후 fetch)
export function saveTree() {
	if (!isDirty) return alert("변경된 내용이 없습니다.");
	if (!confirm("저장하시겠습니까?")) return;

	const data = serialize(document.querySelector('#menuTree > ul'));
	fetch('/save-menu', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	})
			.then(res => res.json())
			.then(() => {
				alert('저장 완료');
				isDirty = false;
			})
			.catch(err => alert('저장 실패: ' + err));
}

// 트리 구조를 JSON으로 직렬화
function serialize(ul) {
	const result = [];
	ul.querySelectorAll(':scope > li').forEach(li => {
		const labelText = li.querySelector('span')?.textContent.trim() ?? '';
		const item = {
			id: li.dataset.id,
			label: labelText.replace(/^📁|📄/, '').trim(),
			use_yn: li.querySelector('span')?.classList.contains('text-gray-400') ? 'N' : 'Y'
		};
		const childUl = li.querySelector('ul');
		if (childUl) {
			item.children = serialize(childUl);
		}
		result.push(item);
	});
	return result;
}

function getAllIds(data) {
	return data.flatMap(item => [item.id, ...(item.children ? getAllIds(item.children) : [])]);
}
