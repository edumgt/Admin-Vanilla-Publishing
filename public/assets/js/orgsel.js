const Grid = tui.Grid;


function nameFormatter({ row }) {
  const { tree } = row._attributes || {};
  if (!tree) return '';

  const depth = tree.depth;

  if (depth === 0) {
    return `계열: ${row.sitename}`;
  } else if (depth === 1) {
    return `지점: ${row.placename}`;
  } else if (depth === 2) {
    return `강의실: ${row.roomname}`;
  }

  return '';
}


fetch('http://127.0.0.1:8080/api/SitePlaceRoom')
  .then(response => response.json())
  .then(rawData => {
    const treeData = makeThreeLevelTree(rawData);

    const grid = new tui.Grid({
      el: document.getElementById('myGrid'),
      rowHeaders: ['checkbox'],
      scrollX: false,
      scrollY: false,
      treeColumnOptions: {
        name: 'displayName',
        useIcon: true
      },
      columns: [
        { name: 'displayName', header: '계열' },
        { name: 'placename', header: '지점' },
        { name: 'roomname', header: '강의실' },
        { name: 'allseat', header: '전체좌석', align: 'right' },
        { name: 'disableseat', header: '비활성좌석', align: 'right' }
      ],
      data: treeData
    });

    // 하위 노드 흰색 적용
    grid.on('onGridMounted', () => {
      const data = grid.getData();
      data.forEach(row => {
        if (row._attributes?.tree?.depth === 2) {
          grid.addRowClassName(row.rowKey, 'child-row-white');
        }
      });
    });
  });




function makeThreeLevelTree(flatData) {
  const siteMap = new Map();

  flatData.forEach((item, index) => {
    const { sitecode, sitename, placename, placeseq } = item;
    const siteId = sitecode;
    const placeId = `${siteId}-${placeseq}`;
    const roomId = `${placeId}-${index + 1}`;

    if (!siteMap.has(siteId)) {
      siteMap.set(siteId, {
        id: siteId,
        sitename: sitename,
        displayName: `계열: ${sitename}`,
        _children: []
      });
    }


    const siteNode = siteMap.get(siteId);

    // placename에 해당하는 중간 노드가 있는지 확인
    let placeNode = siteNode._children.find(child => child.id === placeId);
    if (!placeNode) {
      placeNode = {
        id: placeId,
        placename: placename,
        _children: []
      };
      siteNode._children.push(placeNode);
    }

    // 최하위 강의실 노드 추가
    const roomNode = {
      id: roomId,
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

    placeNode._children.push(roomNode);
  });

  return Array.from(siteMap.values());
}


