const Grid = tui.Grid;


const rawData = [
  {
    seq: 1,
    sitecode: '01',
    sitename: '컴퓨터',
    roomname: 'A',
    allseat: 15,
    disableseat: 0,
    timetype: '2',
    placeseq: 1,
    placename: '컴퓨터강남',
    employeeseat: 15,
    enabletype: 1,
    ordering: null,
    roomment: null,
    sortorder: 38,
    roomcolor: null
  },
  {
    seq: 2,
    sitecode: '01',
    sitename: '컴퓨터',
    roomname: 'B',
    allseat: 12,
    disableseat: 1,
    timetype: '2',
    placeseq: 2,
    placename: '컴퓨터강남',
    employeeseat: 12,
    enabletype: 1,
    ordering: null,
    roomment: null,
    sortorder: 39,
    roomcolor: null
  },
  {
    seq: 3,
    sitecode: '02',
    sitename: '디자인',
    roomname: '201호',
    allseat: 10,
    disableseat: 0,
    timetype: '1',
    placeseq: 3,
    placename: '디자인신촌',
    employeeseat: 10,
    enabletype: 1,
    ordering: null,
    roomment: null,
    sortorder: 20,
    roomcolor: null
  }
];

const treeData = makeTreeData(rawData);
console.log(treeData);

// const treeData = [
//   {
//     id: '01',
//     sitename: '강남',
//     _children: [
//       { id: '01-1', roomname: '101호', allseat: 12, disableseat: 1 },
//       { id: '01-2', roomname: '102호', allseat: 14, disableseat: 2 }
//     ]
//   },
//   {
//     id: '02',
//     sitename: '신촌',
//     _children: [
//       { id: '02-1', roomname: '201호', allseat: 10, disableseat: 0 },
//       { id: '02-2', roomname: '202호', allseat: 11, disableseat: 1 }
//     ]
//   }
// ];

function sitenameFormatter({ row }) {
  const isParent = row._attributes?.tree?.childRowKeys?.length > 0;
  const isChild = row._attributes?.tree?.parentRowKey != null;

  if (isParent) {
    return `사이트명: ${row.sitename}`;
  } else if (isChild) {
    return `강의실명: ${row.roomname}`;
  } else {
    return row.sitename || row.roomname || '';
  }
}
const grid = new Grid({
  el: document.getElementById('myGrid'),

  scrollX: false,
  scrollY: false,
  treeColumnOptions: {
    name: 'sitename',
    useIcon: true
  },
  columns: [
    { name: 'sitename', header: '이름', formatter: sitenameFormatter },
    { name: 'roomname', header: '강의실명' },
    { name: 'allseat', header: '전체좌석', align: 'right' },
    { name: 'disableseat', header: '비활성좌석', align: 'right' }
  ],
  data: treeData
});


// ✅ API 호출 → 데이터 바인딩
fetch('http://127.0.0.1:8080/api/SitePlaceRoom')
.then(response => response.json())
.then(rawData => {
  const treeData = makeTreeData(rawData);

  const grid = new tui.Grid({
    el: document.getElementById('myGrid'),
    rowHeaders: ['checkbox'],
    scrollX: false,
    scrollY: false,
    treeColumnOptions: {
      name: 'sitename',
      useIcon: true
    },
    columns: [
      { name: 'sitename', header: '이름', formatter: sitenameFormatter },
      { name: 'roomname', header: '강의실명' },
      { name: 'allseat', header: '전체좌석', align: 'right' },
      { name: 'disableseat', header: '비활성좌석', align: 'right' }
    ],
    data: treeData
  });

  // ✅ 하위 노드에 흰색 배경 적용
  grid.on('onGridMounted', () => {
    const data = grid.getData();
    data.forEach(row => {
      if (row._attributes?.tree?.parentRowKey != null) {
        grid.addRowClassName(row.rowKey, 'child-row-white');
      }
    });
  });
})
.catch(err => {
  console.error('API 호출 오류:', err);
});

// ✅ 하위 노드 배경 흰색 지정
grid.on('onGridMounted', () => {
  const data = grid.getData();
  data.forEach((row) => {
    if (row._attributes?.tree?.parentRowKey != null) {
      grid.addRowClassName(row.rowKey, 'child-row-white');
    }
  });
});


function makeTreeData(flatData) {
  const siteMap = new Map();

  flatData.forEach((item, index) => {
    const { sitecode, sitename } = item;
    const parentId = sitecode;
    const childId = `${sitecode}-${index + 1}`;

    // 상위 노드가 없으면 생성
    if (!siteMap.has(sitecode)) {
      siteMap.set(sitecode, {
        id: parentId,
        sitename: sitename,
        _children: []
      });
    }

    // 하위 노드 구성
    const child = {
      id: childId,
      roomname: item.roomname,
      allseat: item.allseat,
      disableseat: item.disableseat,
      employeeseat: item.employeeseat,
      timetype: item.timetype,
      placeseq: item.placeseq,
      placename: item.placename,
      enabletype: item.enabletype,
      ordering: item.ordering,
      roomment: item.roomment,
      sortorder: item.sortorder,
      roomcolor: item.roomcolor
    };

    siteMap.get(sitecode)._children.push(child);
  });

  return Array.from(siteMap.values());
}


