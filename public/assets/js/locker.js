import LockerManager from './lockerManager.js';
const lockerManager = new LockerManager({
    containerId: 'lockerContainer',
    rows: 5,
    cols: 10
});

// 사용이력 모달 닫기 버튼 이벤트
document.getElementById('closeUsageModal').addEventListener('click', () => {
    document.getElementById('usageHistoryModal').classList.add('hidden');
});
// 사용자 배정 모달 닫기 버튼 이벤트
document.getElementById('closeAssignmentModal').addEventListener('click', () => {
    document.getElementById('assignmentModal').classList.add('hidden');
});
// 사용자 검색 입력 이벤트: 입력값에 따라 사용자 목록 필터링
document.getElementById('userSearchInput').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filteredUsers = lockerManager.users.filter(user => user.toLowerCase().includes(query));
    lockerManager.renderUserSearchResults(filteredUsers);
});