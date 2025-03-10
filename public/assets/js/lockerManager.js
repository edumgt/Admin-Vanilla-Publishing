// lockerManager.js
export default class LockerManager {
    constructor(options = {}) {
      // 옵션: 컨테이너 ID, 행 수, 열 수
      this.container = document.getElementById(options.containerId || 'lockerContainer');
      this.rows = options.rows || 5;
      this.cols = options.cols || 10;
      this.lockers = [];
      // 상태 목록
      this.statuses = ["사용중", "사용가능", "일시중지", "수리중"];
      this.initLockers();
      this.renderLockers();
    }
  
    // 각 사물함에 대해 임의의 상태와 사용 이력을 지정하여 초기화
    initLockers() {
      const totalLockers = this.rows * this.cols;
      for (let i = 0; i < totalLockers; i++) {
        const randomStatus = this.statuses[Math.floor(Math.random() * this.statuses.length)];
        this.lockers.push({
          id: i + 1,
          status: randomStatus,
          usageHistory: this.generateDummyHistory() // dummy 사용 이력 데이터
        });
      }
    }
  
    // 임의의 사용 이력을 생성하는 함수 (0~2건)
    generateDummyHistory() {
      const names = ['홍길동', '김영희', '이철수', '박지영'];
      const remarksList = ['정기 사용', '단기 대여', '비고 없음', '특별 사용'];
      const count = Math.floor(Math.random() * 3); // 0~2 건
      const history = [];
      for (let i = 0; i < count; i++) {
        // 2025년 3월의 임의 날짜
        const day = Math.floor(Math.random() * 31) + 1;
        const date = `2025-03-${day < 10 ? '0' + day : day}`;
        const username = names[Math.floor(Math.random() * names.length)];
        const remarks = remarksList[Math.floor(Math.random() * remarksList.length)];
        history.push({ date, username, remarks });
      }
      return history;
    }
  
    // 사물함 클릭 시 상태 순환 처리 (상태: 사용중 → 사용가능 → 일시중지 → 수리중 → 다시 사용중)
    toggleLocker(lockerId) {
      const locker = this.lockers.find(l => l.id === lockerId);
      if (locker) {
        const currentIndex = this.statuses.indexOf(locker.status);
        const nextIndex = (currentIndex + 1) % this.statuses.length;
        locker.status = this.statuses[nextIndex];
        this.updateLockerElement(locker);
      }
    }
  
    // 각 상태에 따른 뱃지 클래스 반환 (Tailwind CSS 활용)
    getStatusBadgeClasses(status) {
      switch(status) {
        case "사용중":
          return "bg-red-200 text-red-800";
        case "사용가능":
          return "bg-green-200 text-green-800";
        case "일시중지":
          return "bg-yellow-200 text-yellow-800";
        case "수리중":
          return "bg-gray-200 text-gray-800";
        default:
          return "";
      }
    }
  
    // Locker DOM 요소 업데이트 (상태 뱃지 갱신)
    updateLockerElement(locker) {
      const lockerEl = document.querySelector(`.locker[data-id='${locker.id}']`);
      if (lockerEl) {
        const statusEl = lockerEl.querySelector('.status-text');
        if (statusEl) {
          statusEl.textContent = locker.status;
          statusEl.className = `status-text inline-block px-2 py-1 rounded-full text-xs font-semibold ${this.getStatusBadgeClasses(locker.status)}`;
        }
      }
    }
  
    // 사용이력 버튼 클릭 시 모달 팝업을 띄우고 TUI Grid로 사용 이력을 보여줌
    showUsageHistory(locker) {
      const modal = document.getElementById('usageHistoryModal');
      const gridContainer = document.getElementById('usageGrid');
      // 기존 그리드 내용 초기화
      gridContainer.innerHTML = '';
  
      // TUI Grid 설정: 사용 날짜, 사용자명, 비고
      const columns = [
        { header: '사용 날짜', name: 'date' },
        { header: '사용자명', name: 'username' },
        { header: '비고', name: 'remarks' }
      ];
      const data = locker.usageHistory;
      
      // TUI Grid 인스턴스 생성 (tui.Grid가 전역에 로드되어 있다고 가정)
      new tui.Grid({
        el: gridContainer,
        data: data,
        columns: columns,
        bodyHeight: 300
      });
      
      // 모달 팝업 보이기
      modal.classList.remove('hidden');
    }
  
    // 사물함 목록을 그리드 형태로 렌더링
    renderLockers() {
      if (!this.container) return;
      this.container.innerHTML = '';
  
      // Tailwind grid 클래스 적용
      const grid = document.createElement('div');
      grid.className = 'grid gap-4';
      grid.style.gridTemplateColumns = `repeat(${this.cols}, minmax(0, 1fr))`;
  
      // 각 사물함 요소 생성
      this.lockers.forEach(locker => {
        const lockerDiv = document.createElement('div');
        // relative 포지션을 주어 우측 상단 버튼 배치 가능
        lockerDiv.className = 'locker relative p-6 border border-gray-300 rounded-lg cursor-pointer transition-colors duration-300 bg-white shadow-sm';
        lockerDiv.dataset.id = locker.id;
        
        // Locker 번호를 타이틀로 표시
        const title = document.createElement('h3');
        title.textContent = `Locker ${locker.id}`;
        title.className = 'text-xl font-bold border-b pb-2 mb-2';
        
        // 상태 뱃지
        const statusBadge = document.createElement('span');
        statusBadge.className = `status-text inline-block px-2 py-1 rounded-full text-xs font-semibold ${this.getStatusBadgeClasses(locker.status)}`;
        statusBadge.textContent = locker.status;
        
        // 사용이력 버튼 (우측 상단)
        const historyButton = document.createElement('button');
        historyButton.textContent = '사용이력';
        historyButton.className = 'absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded';
        // 클릭 시 Locker의 사용 이력을 모달 팝업으로 표시 (이벤트 버블링 방지)
        historyButton.addEventListener('click', (e) => {
          e.stopPropagation();
          this.showUsageHistory(locker);
        });
        
        // Locker 클릭 시 상태 토글 (순환)
        lockerDiv.addEventListener('click', () => {
          this.toggleLocker(locker.id);
        });
        
        lockerDiv.appendChild(title);
        lockerDiv.appendChild(statusBadge);
        lockerDiv.appendChild(historyButton);
        
        grid.appendChild(lockerDiv);
      });
  
      this.container.appendChild(grid);
    }
  }
  