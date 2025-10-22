// 📁 tab-controller.js
const tabButtons = document.querySelectorAll('.tab-main');
const tabContents = document.querySelectorAll('.tab-content2');

// 기본 탭 ID 설정 (초기 진입 시 표시될 탭)
const defaultTabId = 'menu-handler-tab';

function activateTab(tabId) {
	// 탭 버튼 활성화 처리
	tabButtons.forEach(btn => {
		btn.classList.toggle('active-tab', btn.dataset.tab === tabId);
	});

	// 탭 콘텐츠 활성화 처리
	tabContents.forEach(content => {
		content.classList.toggle('active', content.id === tabId);
	});

	// 탭별 모듈 동적 import
	switch (tabId) {
		case 'menu-handler-tab':
			import('./menu-handler/index.js').then(mod => {
				if (mod?.initMenuTab) mod.initMenuTab();
			});
			break;

		case 'org-handler-tab':
			import('./org-handler/index.js').then(mod => {
				if (mod?.initOrgTab) mod.initOrgTab();
			});
			break;

		case 'menu-permission-tab':
			import('./menu-permission/index.js').then(mod => {
				if (mod?.initPermissionTab) mod.initPermissionTab();
			});
			break;
	}
}

// 탭 클릭 이벤트 바인딩
document.addEventListener('DOMContentLoaded', () => {
	tabButtons.forEach(button => {
		button.addEventListener('click', () => {
			const targetTabId = button.dataset.tab;
			activateTab(targetTabId);
		});
	});

	// 초기 진입 시 기본 탭 활성화
	activateTab(defaultTabId);
});
