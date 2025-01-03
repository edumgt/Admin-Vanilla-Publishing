// 모든 메뉴 링크 가져오기
const menuLinks = document.querySelectorAll(".gnb-item");

// 활성화 상태 설정
menuLinks.forEach((link) => {
    
    if (link.getAttribute("href") === currentPage) {
        console.log(currentPage);
        link.classList.add("active");
    } else {
        link.classList.remove("active");
    }
});

// 글로벌 변수
const canvas = document.getElementById('orgChartCanvas');
const ctx = canvas.getContext('2d');
const canvasWidth = canvas.width;

let savedOrgData = null;
let draggedNode = null;
let offsetX, offsetY;

fetch('assets/mock/organi.json')
    .then(response => response.json())
    .then(data => {
        savedOrgData = data;
        savedOrgData.x = canvasWidth / 2; // 기존 값 유지
        savedOrgData.y = 0; // CEO 카드를 더 위쪽으로 조정
        redraw();
    })
    .catch(error => console.error('Error fetching the organizational data:', error));

function drawOrgChart(ctx, node) {
    drawCard(ctx, node);

    if (node.children && node.children.length > 0) {
        node.children.forEach(child => {
            ctx.beginPath();
            ctx.moveTo(node.x + 100, node.y + 120);
            ctx.bezierCurveTo(node.x + 100, node.y + 170, child.x + 100, child.y - 50, child.x + 100, child.y);
            ctx.strokeStyle = '#FFA500';
            ctx.lineWidth = 2;
            ctx.stroke();
            drawOrgChart(ctx, child);
        });
    }
}

function drawCard(ctx, node) {
    const width = 200, height = 120;
    const borderRadius = 10;

    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;

    // 카드 배경
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(node.x + borderRadius, node.y);
    ctx.lineTo(node.x + width - borderRadius, node.y);
    ctx.quadraticCurveTo(node.x + width, node.y, node.x + width, node.y + borderRadius);
    ctx.lineTo(node.x + width, node.y + height - borderRadius);
    ctx.quadraticCurveTo(node.x + width, node.y + height, node.x + width - borderRadius, node.y + height);
    ctx.lineTo(node.x + borderRadius, node.y + height);
    ctx.quadraticCurveTo(node.x, node.y + height, node.x, node.y + height - borderRadius);
    ctx.lineTo(node.x, node.y + borderRadius);
    ctx.quadraticCurveTo(node.x, node.y, node.x + borderRadius, node.y);
    ctx.closePath();
    ctx.fill();

    // 카드 상단, 중단, 하단 색상
    ctx.fillStyle = '#0058a3';
    ctx.fillRect(node.x, node.y, width, height / 3);
    ctx.fillStyle = '#f7d117';
    ctx.fillRect(node.x, node.y + height / 3, width, height / 3);
    ctx.fillStyle = '#fff';
    ctx.fillRect(node.x, node.y + (2 * height / 3), width, height / 3);

    ctx.shadowColor = 'transparent';

    // 텍스트 설정
    ctx.fillStyle = '#fff';
    ctx.font = '15px Pretendard';
    ctx.textAlign = 'center';

    // 관리자 이름
    ctx.fillText(node.manager, node.x + width / 2, node.y + 22);

    // 부서 이름
    ctx.fillStyle = '#000';
    ctx.fillText(node.name, node.x + width / 2, node.y + 60);

    // 삭제 버튼 (x 표시)
    if (node.manager !== 'CEO') {
        ctx.fillStyle = '#000';
        ctx.fillText('x', node.x + width - 20, node.y + height - 10);
    }

    // 하위부서생성 버튼
    ctx.fillStyle = '#333'; // 짙은 회색 배경
    ctx.fillRect(node.x + 10, node.y + height - 30, 100, 20);

    ctx.fillStyle = '#fff'; // 흰색 텍스트
    ctx.fillText('하위부서생성', node.x + 60, node.y + height - 12);

    // 돋보기 아이콘 (하위부서생성 버튼 오른쪽, 여백 10px)
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(node.x + 130, node.y + height - 20, 10, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '10px Arial';
    ctx.fillText('🔍', node.x + 130, node.y + height - 15);
}

function findNode(node, x, y) {
    const width = 200, height = 120;
    if (x >= node.x && x <= node.x + width && y >= node.y && y <= node.y + height) {
        return node;
    }

    if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
            const found = findNode(node.children[i], x, y);
            if (found) return found;
        }
    }

    return null;
}

function findParentNode(node, targetNode, parent = null) {
    if (node === targetNode) {
        return parent;
    }

    if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
            const foundParent = findParentNode(node.children[i], targetNode, node);
            if (foundParent) return foundParent;
        }
    }

    return null;
}

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawOrgChart(ctx, savedOrgData);
}
function saveData() {
    localStorage.setItem('orgData', JSON.stringify(savedOrgData));
}

function deleteNode(node, targetNode) {
    if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
            if (node.children[i] === targetNode) {
                node.children.splice(i, 1);
                return true;
            } else {
                const deleted = deleteNode(node.children[i], targetNode);
                if (deleted) return true;
            }
        }
    }
    return false;
}

canvas.addEventListener('dblclick', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedNode = findNode(savedOrgData, x, y);
    if (clickedNode) {
        const width = 200;
        if (y >= clickedNode.y && y <= clickedNode.y + 40) {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = clickedNode.manager;
            input.className = 'input-style bg-white border border-gray-300 rounded';
            input.style.position = 'absolute';
            input.style.left = `${rect.left + clickedNode.x + (width / 2) - 50}px`;
            input.style.top = `${rect.top + clickedNode.y + 5}px`;
            input.style.width = '100px';

            document.body.appendChild(input);

            input.focus();

            input.addEventListener('blur', () => {
                clickedNode.manager = input.value;
                document.body.removeChild(input);
                redraw();
                saveData();
            });

            input.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    input.blur();
                }
            });
        } else if (y > clickedNode.y + 40 && y <= clickedNode.y + 80) {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = clickedNode.name;
            input.className = 'input-style bg-white border border-gray-300 rounded';
            input.style.position = 'absolute';
            input.style.left = `${rect.left + clickedNode.x + (width / 2) - 50}px`;
            input.style.top = `${rect.top + clickedNode.y + 45}px`;
            input.style.width = '100px';

            document.body.appendChild(input);

            input.focus();

            input.addEventListener('blur', () => {
                clickedNode.name = input.value;
                document.body.removeChild(input);
                redraw();
                saveData();
            });

            input.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    input.blur();
                }
            });
        }
    }
});

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    draggedNode = findNode(savedOrgData, x, y);

    if (draggedNode && draggedNode.manager === 'CEO') {
        draggedNode = null;
    }

    if (draggedNode) {
        offsetX = x - draggedNode.x;
        offsetY = y - draggedNode.y;
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (draggedNode) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        draggedNode.x = x - offsetX;
        draggedNode.y = y - offsetY;

        redraw();
    }
});

canvas.addEventListener('mouseup', () => {
    if (draggedNode) {
        saveData();
    }
    draggedNode = null;
});

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedNode = findNode(savedOrgData, x, y);
    if (clickedNode) {
        const width = 200, height = 120;
        const deleteX = clickedNode.x + width - 20;
        const deleteY = clickedNode.y + height - 10;

        const buttonXStart = clickedNode.x + 10; // 하위부서생성 버튼 시작 x 좌표
        const buttonXEnd = buttonXStart + 100; // 버튼 끝 x 좌표
        const buttonYStart = clickedNode.y + height - 30; // 버튼 시작 y 좌표
        const buttonYEnd = buttonYStart + 20; // 버튼 끝 y 좌표

        // 삭제 버튼 클릭 처리
        if (
            clickedNode.manager !== 'CEO' &&
            x >= deleteX - 10 &&
            x <= deleteX + 10 &&
            y >= deleteY - 10 &&
            y <= deleteY + 10
        ) {
            const parentNode = findParentNode(savedOrgData, clickedNode);
            if (parentNode) {
                deleteNode(parentNode, clickedNode);
                redraw();
                saveData();
            }
        }

        // 하위부서생성 버튼 클릭 처리
        if (x >= buttonXStart && x <= buttonXEnd && y >= buttonYStart && y <= buttonYEnd) {
            const newChild = {
                name: '부서: 더블클릭 수정',
                manager: '매니저: 더블클릭 수정',
                x: clickedNode.x + 50, // 새 노드의 초기 x 위치
                y: clickedNode.y + 150, // 새 노드의 초기 y 위치
                children: []
            };
            if (!clickedNode.children) {
                clickedNode.children = [];
            }
            clickedNode.children.push(newChild);
            redraw();
            saveData();
        }

        // 돋보기 클릭 처리
        if (x >= clickedNode.x + 130 && x <= clickedNode.x + 150 && y >= clickedNode.y + height - 30 && y <= clickedNode.y + height - 10) {
            showModal(clickedNode, rect.left + clickedNode.x + 130, rect.top + clickedNode.y + height - 30);
        }
    }
});

function showModal(node, left, top) {
    const modal = document.createElement('div');
    modal.style.position = 'absolute';
    modal.style.left = `${left}px`;
    modal.style.top = `${top}px`;
    modal.style.backgroundColor = '#fff';
    modal.style.padding = '20px';
    modal.style.border = '1px solid #ccc';
    modal.style.zIndex = 1000;
    modal.innerHTML = `
        <h2>${node.name}</h2>
        <p><strong>부서장:</strong> ${node.manager}</p>
        <p><strong>부서인원:</strong> ${node.members || 'N/A'}</p>
        <p><strong>부서설명:</strong> ${node.description || 'N/A'}</p>
        <div id="map" style="width: 300px; height: 200px; background-color: #eaeaea;">지도 표시</div>
        <button id="closeModal">닫기</button>
    `;
    document.body.appendChild(modal);

    document.getElementById('closeModal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    // 지도 렌더링 로직 추가 (예: Google Maps API 또는 OpenLayers 사용)
}
