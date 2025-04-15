// import 'https://uicdn.toast.com/tui.grid/latest/tui-grid.min.js';

// ✅ 데이터 가져오기 함수
async function fetchJson(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}

// ✅ 트리 구조로 변환 (sitecode 그룹 기준)
function toTreeData(data) {
  const treeData = [];
  const groupMap = new Map();

  data.forEach(item => {
    const groupKey = item.sitecode;
    const parentId = `group-${groupKey}`;

    if (!groupMap.has(groupKey)) {
      groupMap.set(groupKey, true);
      treeData.push({
        id: parentId,
        sitecode: item.sitecode,
        sitename: item.sitename,
        roomname: '[전체 강의실]',
        allseat: 0,
        disableseat: 0,
        isGroup: true
      });
    }

    treeData.push({
      id: `row-${item.seq}`,
      parent: parentId,
      ...item
    });
  });

  return treeData;
}

// ✅ 펼쳐진 상태 저장
const expandedRowSet = new Set();

// ✅ 컬럼 정의
const columns = [
  {
    name: 'sitename',
    header: '사이트명',
    formatter: ({ rowKey, value, row }) => {
      if (row.isGroup) {
        const expanded = expandedRowSet.has(rowKey);
        const icon = expanded ? '▼' : '▶';
        return `<span class="tree-toggle" data-rowkey="${rowKey}">${icon} ${value}</span>`;
      } else {
        return value;
      }
    }
  },
  { name: 'sitecode', header: '사이트코드', sortable: true, filter: 'select' },
  { name: 'roomname', header: '강의실명' },
  { name: 'allseat', header: '전체좌석', align: 'right' },
  { name: 'disableseat', header: '비활성좌석', align: 'right' },
  { name: 'timetype', header: '시간유형' },
  { name: 'placename', header: '지점명' }
];
let originalData = [];

document.addEventListener('DOMContentLoaded', async function () {
  originalData = toTreeData(await fetchJson('http://127.0.0.1:8080/api/SitePlaceRoom'));

  const grid = new tui.Grid({
    el: document.getElementById('myGrid'),
    data: originalData,
    columns,
    rowHeaders: ['checkbox'],
    bodyHeight: 600,
    treeColumnOptions: {
      name: 'sitename',
      useIcon: false
    }
  });

  // 클릭 시 토글 및 리렌더
  grid.on('click', ev => {
    const target = ev.nativeEvent.target;
    if (target.classList.contains('tree-toggle')) {
      const rowKey = target.dataset.rowkey;
      const isExpanded = expandedRowSet.has(rowKey);

      if (isExpanded) {
        grid.collapse(rowKey);
        expandedRowSet.delete(rowKey);
      } else {
        grid.expand(rowKey);
        expandedRowSet.add(rowKey);
      }

      // ✅ 저장해둔 원본 데이터로 리렌더링
      grid.resetData(originalData);
    }
  });
});
  

