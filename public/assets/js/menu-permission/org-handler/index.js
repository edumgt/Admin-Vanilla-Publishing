import {fetchPermissions, initPageUI} from "../../accessControl.js";
import { initInternalTabs } from './internal-tab-controller.js';

const typeLabelMap = {
	HQ: '본사',
	BRANCH: '지사',
	CAMPUS: '캠퍼스'
};
let orgData = [];

let selectedDeptId = 1;
let orgTreeGrid = null;
const depthName = document.querySelector(".depth-name");
let tempIdCounter = -1;
let isAddChildListenerAttached = false;

export function initOrgTab() {
	fetchPermissions().then((permissions) => {
		initPageUI("org-handler-btn-container", {
			buttonOrder: [
				{ type: 'add', label: '신규 부서 생성', onClick: null }
			],
			permissions,
		});

		initPageUI("dept-info-btn-container", {
			buttonOrder: [
				{ type: 'save', label: '저장', onClick: null }
			],
			permissions,
		});
	});

	fetch(`${backendDomain}/api/org/tree`)
			.then(response => {
				if (!response.ok) throw new Error('조직도 조회 실패');
				return response.json();
			})
			.then(data => {
				orgData = data;    // ✅ 서버에서 가져온 데이터로 orgData 세팅
				renderOrgTree();
				bindInternalTabs();
				renderDeptInfo();
				initInternalTabs(); // 내부탭 세팅
			})
			.catch(error => {
				console.error(error);
				alert('조직 정보를 불러오는 데 실패했습니다.');
			});

	const editableMap = {
		'deptAddress': 'input',
		'deptPhone': 'input',
		'deptDescription': 'textarea'
	};

	Object.entries(editableMap).forEach(([id, type]) => {
		const el = document.getElementById(id);
		if (el) {
			el.addEventListener('click', () => makeEditable(el, type));
		}
	});

	setupAddChildEvent();
}

function renderOrgTree() {
	if (orgTreeGrid) {
		orgTreeGrid.destroy();
	}

	const treeArea = document.getElementById('orgTree');
	treeArea.innerHTML = '';

	// ✅ 서버 데이터(orgData)를 직접 트리형 데이터로 가공
	const processedData = orgData.map(item => ({
		...item,
		_children: []
	}));

	const idMap = Object.fromEntries(processedData.map(item => [item.id, item]));

	processedData.forEach(item => {
		if (item.parent && idMap[item.parent]) {
			idMap[item.parent]._children.push(item);
		}
	});

	// ✅ 여기 추가: 자식이 없는 노드는 _children = null
	Object.values(idMap).forEach(item => {
		if (item._children.length === 0) {
			item._children = null;
		}
	});

	// 루트 아이템만 뽑기 (_parent가 null인 것들)
	const rootItems = processedData.filter(item => !item.parent);

	orgTreeGrid = new tui.Grid({
		el: treeArea,
		rowHeaders: [],
		bodyHeight: 'fitToParent',
		rowKey: 'id',
		treeColumnOptions: {
			name: 'name',
			useIcon: true
		},
		columns: [
			{
				header: '조직명',
				name: 'name',
				sortable: true,
				formatter: ({ row }) => {
					const orgName = row.name;
					const orgId = row.id;
					const isLeaf = row.level < 3;

					return `
        <div class="flex justify-between items-center w-full pr-2">
          <span class="truncate">${orgName}</span>
          ${
							isLeaf
									? `<i class="fas fa-plus text-blue-500 hover:text-blue-600 cursor-pointer text-base leading-none ml-2"
                   title="하위 조직 추가"
                   data-add-child="${orgId}"
                   style="margin-right: 10px"></i>`
									: ''
					}
        </div>
      `;
				}
			}
		],
		data: rootItems // ✅ 완성된 트리 데이터
	});

	orgTreeGrid.on('click', ev => {
		const row = orgTreeGrid.getRow(ev.rowKey);
		if (!row) return;

		selectedDeptId = row.id;
		renderDeptInfo();
		// renderUserList();
	});
}

function setupAddChildEvent() {
	if (isAddChildListenerAttached) return; // 이미 등록됐으면 무시
	isAddChildListenerAttached = true;

	document.addEventListener('click', function (e) {
		const target = e.target.closest('[data-add-child]');
		if (target) {
			const parentId = Number(target.dataset.addChild);
			if (!isNaN(parentId)) {
				handleAddChild(e, parentId);
			}
		}
	});
}

function handleAddChild(e, parentId) {
	e.stopPropagation();

	const parentRow = orgTreeGrid.getRow(parentId);
	if (!parentRow) return;

	const parentLevel = parentRow.level || 1;
	const newLevel = parentLevel + 1;

	if (newLevel > 3) {
		alert('3단계 이상은 추가할 수 없습니다.');
		return;
	}

	const newRow = {
		id: tempIdCounter--,
		name: '신규 조직',
		address: '',
		phone: '',
		description: '',
		type: newLevel === 2 ? 'BRANCH' : 'CAMPUS',
		useYn: 'Y',
		parent: parentId,
		level: newLevel,
		_children: null,
		__new: true
	};

	// 자식이 없으면 _children 생성
	if (!parentRow._children || !Array.isArray(parentRow._children)) {
		parentRow._children = [];
	}

	// 앞에 추가
	parentRow._children.unshift(newRow);

	// 데이터 갱신
	orgTreeGrid.resetData([...orgTreeGrid.getData()]);

	// 펼쳐진 상태 아니면 열기
	if (!orgTreeGrid.isExpanded(parentId)) {
		orgTreeGrid.expand(parentId);
	}

	// 포커스 주기 (조금 delay)
	setTimeout(() => {
		const newKey = orgTreeGrid.getIndexOfRow(newRow.id);
		if (newKey >= 0) {
			orgTreeGrid.focusAt(newKey, 0);
		}
	}, 100);
}

function bindInternalTabs() {
	const internalTabs = document.querySelectorAll('#internalTabs .tab-hos');
	const tabContents = document.querySelectorAll('#user-handler-tab .tab-content2');

	internalTabs.forEach(button => {
		button.addEventListener('click', () => {
			const tabId = button.dataset.tab;

			internalTabs.forEach(btn => {
				btn.classList.toggle('active-tab', btn.dataset.tab === tabId);
			});

			tabContents.forEach(content => {
				content.classList.toggle('active', content.id === tabId);
			});
		});
	});
}

function renderDeptInfo() {
	if (!selectedDeptId) return;

	const dept = orgData.find(d => d.id === selectedDeptId);
	if (!dept) return;

	// ✅ 타이틀에 조직명 표시
	depthName.textContent = dept.name || '-';

	// ✅ 소속 (부모조직명) 표시
	const parentDept = dept.parent ? orgData.find(d => d.id === dept.parent) : null;
	document.getElementById('deptParent').innerText = parentDept?.name || '-';

	// ✅ 기본 정보 표시
	document.getElementById('deptType').innerText = typeLabelMap[dept.type] || dept.type || '-';
	document.getElementById('deptAddress').innerText = dept.address || '-';
	document.getElementById('deptPhone').innerText = dept.phone || '-';
	document.getElementById('deptUseYn').innerText = dept.useYn || '-';
	document.getElementById('deptDescription').innerText = dept.description || '-';

	toggleRow('dept-parent', dept.type !== 'HQ');
	toggleRow('dept-type', dept.type !== 'HQ');
	toggleRow('dept-use-yn', dept.type !== 'HQ');
}

function toggleRow(fieldName, visible) {
	const row = document.querySelector(`[data-field="${fieldName}"]`);
	if (!row) return;

	const container = row.parentElement;

	if (visible) {
		// ✅ 보이기
		row.classList.remove('hidden');
	} else {
		// ✅ 숨기기
		row.classList.add('hidden');
	}

	// ✅ 숨기거나 보인 후에 "살아있는 row" 다시 가져오기
	const visibleRows = Array.from(container.children).filter(child => {
		return !child.classList.contains('hidden');
	});

	// ✅ 살아있는 것 중 첫 번째만 border-top 없애고
	visibleRows.forEach((child, index) => {
		if (index === 0) {
			child.style.borderTop = 'none';
		} else {
			child.style.borderTop = ''; // 원래대로
		}
	});
}

function makeEditable(element, type = 'input') {
	if (element.querySelector('input, textarea')) return;

	const currentText = element.innerText.trim();
	element.innerHTML = '';

	let inputEl;
	if (type === 'textarea') {
		inputEl = document.createElement('textarea');
		inputEl.rows = 3;
		inputEl.className = 'border rounded p-2';
		inputEl.style.width = '100%';
		inputEl.style.resize = 'none'; // ✅ resize 비활성화
	} else {
		inputEl = document.createElement('input');
		inputEl.type = 'text';
		inputEl.className = 'border rounded p-1';
		inputEl.style.width = '100%'; // ✅ 고정 너비
	}

	inputEl.value = currentText === '-' ? '' : currentText;
	element.appendChild(inputEl);
	inputEl.focus();

	function save() {
		const newValue = inputEl.value.trim() || '-';
		element.innerHTML = newValue;
	}

	function cancel() {
		element.innerHTML = currentText;
	}

	inputEl.addEventListener('blur', save);
	inputEl.addEventListener('keydown', (e) => {
		if (e.key === 'Enter' && type !== 'textarea') {
			e.preventDefault();
			save();
		}
		if (e.key === 'Escape') {
			cancel();
		}
	});
}

function renderUserList() {
	const userList = document.getElementById('userList');
	if (!userList) return;

	const filteredUsers = users.filter(u => u.deptId === selectedDeptId);

	if (filteredUsers.length === 0) {
		userList.innerHTML = `<div class="text-gray-400 text-center py-10">부서원이 없습니다.</div>`;
		return;
	}

	userList.innerHTML = filteredUsers.map(u => `
    <div class="flex items-center space-x-3 py-3 border-b hover:bg-gray-100 rounded cursor-pointer" data-id="${u.id}">
      <div class="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-700 rounded-full font-bold">${u.name[0]}</div>
      <div class="text-gray-800 font-medium">${u.name}</div>
    </div>
  `).join('');

	document.querySelectorAll('#userList > div').forEach(div => {
		div.addEventListener('click', () => {
			const id = Number(div.dataset.id);
			const user = users.find(u => u.id === id);
			renderUserDetail(user);
		});
	});
}

function renderUserDetail(user) {
	const userDetail = document.getElementById('userDetail');
	userDetail.innerHTML = `
    <div class="text-center">
      <div class="mx-auto w-20 h-20 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-bold mb-4">${user.name[0]}</div>
      <h3 class="text-xl font-bold mb-2">${user.name}</h3>
      <p class="text-gray-600">부서 ID: ${user.deptId}</p>
    </div>
  `;
}