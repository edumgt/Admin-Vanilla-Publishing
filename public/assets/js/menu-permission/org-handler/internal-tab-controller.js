export function initInternalTabs() {
	const internalTabButtons = document.querySelectorAll('.tab-sub');
	const internalTabContents = document.querySelectorAll('#org-handler-tab .tab-content2');
	const defaultInternalTabId = 'dept-info-tab';

	function activateInternalTab(tabId) {
		internalTabButtons.forEach(btn => {
			btn.classList.toggle('active-tab', btn.dataset.tab === tabId);
		});

		internalTabContents.forEach(content => {
			content.classList.toggle('active', content.id === tabId);
		});
	}

	internalTabButtons.forEach(button => {
		button.addEventListener('click', () => {
			const targetTabId = button.dataset.tab;
			activateInternalTab(targetTabId);
		});
	});

	activateInternalTab(defaultInternalTabId);
}
