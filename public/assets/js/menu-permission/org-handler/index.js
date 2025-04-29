import { initInternalTabs } from './internal-tab-controller.js';

let orgData = [];

let selectedDeptId = 1;
let orgTreeGrid = null;
const depthName = document.querySelector(".depth-name");

export function initOrgTab() {
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
			{ header: '조직명', name: 'name', sortable: true }
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

	// ✅ 조직명 등 기본 정보 세팅
	document.getElementById('deptName').innerText = dept.name || '-';
	document.getElementById('deptType').innerText = dept.type || '-';
	document.getElementById('deptAddress').innerText = dept.address || '-';
	document.getElementById('deptPhone').innerText = dept.phone || '-';
	document.getElementById('deptUseYn').innerText = dept.use_yn || '-';
	document.getElementById('deptDescription').innerText = dept.description || '-';

	// ✅ Breadcrumb 세팅
	document.getElementById('deptBreadcrumb').innerText = buildBreadcrumb(selectedDeptId);
}

function buildBreadcrumb(deptId) {
	let path = [];
	let current = orgData.find(d => d.id === deptId);

	while (current) {
		path.unshift(current.name); // 가장 상위 조직부터 순서대로
		current = current.parent ? orgData.find(d => d.id === current.parent) : null;
	}

	return path.join(' > ');
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