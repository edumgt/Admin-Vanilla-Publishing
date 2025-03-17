// lockerManager.js
export default class LockerManager {
  constructor(options = {}) {
    // 옵션: 컨테이너 ID, 행 수, 열 수
    this.container = document.getElementById(options.containerId || 'lockerContainer');
    this.rows = options.rows || 5;
    this.cols = options.cols || 10;
    this.lockers = [];
    // 사물함 상태 목록
    this.statuses = ["사용중", "사용가능", "일시중지", "수리중"];
    // 배정 시 사용할 더미 사용자 목록
    this.users = ["홍길동", "김영희", "이철수", "박지영", "최수민", "오민준"];
    this.loadLockers();
  }

  // localStorage에 저장된 데이터를 가상 fetch API로 불러옴
  loadLockers() {
    fakeFetch('/api/lockers')
      .then(response => response.json())
      .then(data => {
        this.lockers = data;
        this.renderLockers();
      })
      .catch(err => console.error(err));
  }

  // 수정된 locker 데이터를 PUT 방식으로 저장(가상 fetch API)
  updateLockerData(locker) {
    return fakeFetch('/api/lockers', {
      method: 'PUT',
      body: JSON.stringify(locker)
    }).then(response => response.json());
  }

  // "사용가능" 상태인 경우 사용자 배정 모달 표시, 그 외에는 상태 순환
  handleLockerClick(locker) {
    if (locker.status === "사용가능") {
      this.showAssignmentModal(locker);
    } else {
      this.toggleLocker(locker.id);
    }
  }

  // 상태 순환: 사용중 → 사용가능 → 일시중지 → 수리중 → 사용중  
  // 단, 사용중에서 다른 상태로 변경 시 배정된 사용자 정보는 삭제
  toggleLocker(lockerId) {
    const locker = this.lockers.find(l => l.id === lockerId);
    if (locker) {
      const currentIndex = this.statuses.indexOf(locker.status);
      const nextIndex = (currentIndex + 1) % this.statuses.length;
      locker.status = this.statuses[nextIndex];
      if (locker.status !== "사용중") {
        delete locker.assignedUser;
      }
      this.updateLockerData(locker)
        .then(updated => {
          Object.assign(locker, updated);
          this.updateLockerElement(locker);
        })
        .catch(err => console.error(err));
    }
  }

  // 각 상태에 따른 Tailwind 뱃지 클래스 반환
  getStatusBadgeClasses(status) {
    switch (status) {
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

  // DOM 내 해당 Locker 요소 업데이트 (상태 뱃지 내용 갱신)
  updateLockerElement(locker) {
    const lockerEl = document.querySelector(`.locker[data-id='${locker.id}']`);
    if (lockerEl) {
      const statusEl = lockerEl.querySelector('.status-text');
      if (statusEl) {
        // "사용중"이면 배정된 사용자명이 있으면 사용자명을 왼쪽에 표기
        if (locker.status === "사용중" && locker.assignedUser) {
          statusEl.textContent = `${locker.assignedUser} ${locker.status}`;
        } else {
          statusEl.textContent = locker.status;
        }
        statusEl.className = `status-text inline-block px-2 py-1 rounded-full text-xs font-semibold ${this.getStatusBadgeClasses(locker.status)}`;
      }
    }
  }

  // 사용이력 모달 표시 (우측 상단 "사용이력" 버튼 클릭 시)
  showUsageHistory(locker) {
    const modal = document.getElementById('usageHistoryModal');
    const gridContainer = document.getElementById('usageGrid');
    gridContainer.innerHTML = '';
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
    modal.classList.remove('hidden');
  }

  // 사용자 배정 모달 표시 (상태가 "사용가능"인 경우)
  showAssignmentModal(locker) {
    const modal = document.getElementById('assignmentModal');
    const searchInput = document.getElementById('userSearchInput');
    const resultsContainer = document.getElementById('userSearchResults');
    searchInput.value = '';
    resultsContainer.innerHTML = '';
    // 배정할 locker id를 모달의 data 속성에 저장
    modal.dataset.lockerId = locker.id;
    // 초기에는 전체 사용자 목록 표시
    this.renderUserSearchResults(this.users);
    modal.classList.remove('hidden');
  }

  // 사용자 검색 결과 렌더링 (전달된 사용자 배열 기준)
  renderUserSearchResults(users) {
    const resultsContainer = document.getElementById('userSearchResults');
    resultsContainer.innerHTML = '';
    if (users.length === 0) {
      resultsContainer.textContent = '검색된 사용자가 없습니다.';
      return;
    }
    const list = document.createElement('ul');
    list.className = 'divide-y divide-gray-200';
    users.forEach(user => {
      const item = document.createElement('li');
      item.className = 'p-2 cursor-pointer hover:bg-gray-100';
      item.textContent = user;
      item.addEventListener('click', () => {
        this.assignUserToLocker(parseInt(document.getElementById('assignmentModal').dataset.lockerId), user);
      });
      list.appendChild(item);
    });
    resultsContainer.appendChild(list);
  }

  // 선택된 사용자를 해당 Locker에 배정: 상태 변경 및 사용이력 추가 후 업데이트
  assignUserToLocker(lockerId, username) {
    const locker = this.lockers.find(l => l.id === lockerId);
    if (locker) {
      locker.status = "사용중";
      locker.assignedUser = username;
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = (now.getMonth() + 1).toString().padStart(2, '0');
      const dd = now.getDate().toString().padStart(2, '0');
      const date = `${yyyy}-${mm}-${dd}`;
      locker.usageHistory.push({ date, username, remarks: '배정됨' });
      this.updateLockerData(locker)
        .then(updated => {
          Object.assign(locker, updated);
          this.updateLockerElement(locker);
        })
        .catch(err => console.error(err));
    }
    document.getElementById('assignmentModal').classList.add('hidden');
  }

  // 전체 Locker를 그리드 형태로 렌더링
  renderLockers() {
    if (!this.container) return;
    this.container.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'grid gap-4';
    grid.style.gridTemplateColumns = `repeat(${this.cols}, minmax(0, 1fr))`;
    this.lockers.forEach(locker => {
      const lockerDiv = document.createElement('div');
      lockerDiv.className = 'locker relative p-6 border border-gray-300 rounded-lg cursor-pointer transition-colors duration-300 bg-white shadow-sm';
      lockerDiv.dataset.id = locker.id;

      // Locker 번호 타이틀 디자인
      const title = document.createElement('h5');
      title.textContent = `Locker ${locker.id}`;
      title.className = 'text-md border-b pb-2 mb-2';

      // 상태 뱃지: "사용중"이면 배정된 사용자명을 왼쪽에 표시
      const statusBadge = document.createElement('span');
      statusBadge.className = `status-text inline-block px-2 py-1 rounded-full text-xs font-semibold ${this.getStatusBadgeClasses(locker.status)}`;
      statusBadge.textContent =
        (locker.status === "사용중" && locker.assignedUser)
          ? `${locker.assignedUser} ${locker.status}`
          : locker.status;

      // 사용이력 버튼 (우측 상단)
      const historyButton = document.createElement('button');
      historyButton.textContent = '사용이력';
      historyButton.className = 'absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded';
      historyButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showUsageHistory(locker);
      });

      // 클릭 시 "사용가능"이면 배정 모달, 아니면 상태 토글
      lockerDiv.addEventListener('click', () => {
        this.handleLockerClick(locker);
      });

      lockerDiv.appendChild(title);
      lockerDiv.appendChild(statusBadge);
      lockerDiv.appendChild(historyButton);

      grid.appendChild(lockerDiv);
    });
    this.container.appendChild(grid);
  }
}

class LockerAPI {
  static getLockers() {
    return new Promise((resolve, reject) => {
      const data = localStorage.getItem('lockersData');
      if (data) {
        resolve(JSON.parse(data));
      } else {
        // 데이터가 없으면 50개 locker 초기화 (각각 임의 상태)
        const lockers = [];
        const statuses = ["사용중", "사용가능", "일시중지", "수리중"];
        for (let i = 0; i < 50; i++) {
          const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
          lockers.push({
            id: i + 1,
            status: randomStatus,
            usageHistory: [],
            assignedUser: randomStatus === "사용중" ? "홍길동" : null
          });
        }
        localStorage.setItem('lockersData', JSON.stringify(lockers));
        resolve(lockers);
      }
    });
  }

  static updateLocker(locker) {
    return new Promise((resolve, reject) => {
      const data = localStorage.getItem('lockersData');
      let lockers = [];
      if (data) {
        lockers = JSON.parse(data);
      }
      const index = lockers.findIndex(l => l.id === locker.id);
      if (index !== -1) {
        lockers[index] = locker;
        localStorage.setItem('lockersData', JSON.stringify(lockers));
        resolve(locker);
      } else {
        reject('Locker not found');
      }
    });
  }

  static createLocker(locker) {
    return new Promise((resolve, reject) => {
      const data = localStorage.getItem('lockersData');
      let lockers = [];
      if (data) {
        lockers = JSON.parse(data);
      }
      lockers.push(locker);
      localStorage.setItem('lockersData', JSON.stringify(lockers));
      resolve(locker);
    });
  }

  static deleteLocker(id) {
    return new Promise((resolve, reject) => {
      const data = localStorage.getItem('lockersData');
      let lockers = [];
      if (data) {
        lockers = JSON.parse(data);
      }
      lockers = lockers.filter(l => l.id !== id);
      localStorage.setItem('lockersData', JSON.stringify(lockers));
      resolve(true);
    });
  }
}

// FakeResponse: fetch API와 유사한 응답 객체 (json() 메서드 포함)
class FakeResponse {
  constructor(body) {
    this._body = body;
  }
  json() {
    return Promise.resolve(JSON.parse(this._body));
  }
}

// fakeFetch: 가상의 fetch 함수로, 지정된 엔드포인트와 메서드에 따라 LockerAPI를 호출
function fakeFetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (url === '/api/lockers') {
        if (!options.method || options.method === 'GET') {

          // LockerAPI.getLockers().then(data => {
          //   resolve(new FakeResponse(JSON.stringify(data)));
          // });

          fetch('/api/lockers')
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then(data => {
              resolve(new FakeResponse(JSON.stringify(data)));
              console.log(JSON.stringify(data));
            })
            .catch(error => {

              showToast('loading-error', 'error', lang);

              console.log(error);
            });

        } else if (options.method === 'PUT') {
          const locker = JSON.parse(options.body);
          LockerAPI.updateLocker(locker).then(data => {
            resolve(new FakeResponse(JSON.stringify(data)));
          });
        } else if (options.method === 'POST') {
          const locker = JSON.parse(options.body);
          LockerAPI.createLocker(locker).then(data => {
            resolve(new FakeResponse(JSON.stringify(data)));
          });
        } else if (options.method === 'DELETE') {
          const id = JSON.parse(options.body).id;
          LockerAPI.deleteLocker(id).then(data => {
            resolve(new FakeResponse(JSON.stringify(data)));
          });
        } else {
          reject('Method not supported');
        }
      } else {
        reject('Unknown endpoint');
      }
    }, 300); // 가상 네트워크 딜레이
  });
}
