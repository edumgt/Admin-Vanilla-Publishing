const Grid = tui.Grid;

const treeData = [
  {
    id: '01',
    sitename: '강남',
    _children: [
      { id: '01-1', roomname: '101호', allseat: 12, disableseat: 1 },
      { id: '01-2', roomname: '102호', allseat: 14, disableseat: 2 }
    ]
  },
  {
    id: '02',
    sitename: '신촌',
    _children: [
      { id: '02-1', roomname: '201호', allseat: 10, disableseat: 0 },
      { id: '02-2', roomname: '202호', allseat: 11, disableseat: 1 }
    ]
  }
];

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

// ✅ 하위 노드 배경 흰색 지정
grid.on('onGridMounted', () => {
  const data = grid.getData();
  data.forEach((row) => {
    if (row._attributes?.tree?.parentRowKey != null) {
      grid.addRowClassName(row.rowKey, 'child-row-white');
    }
  });
});
