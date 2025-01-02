document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('orgChartCanvas');
    const ctx = canvas.getContext('2d');

    // Get the canvas width
    const canvasWidth = canvas.width;

    // 로컬 스토리지에서 조직도 데이터 로드
    const savedOrgData = JSON.parse(localStorage.getItem('orgData')) || {
        name: 'Company',
        manager: 'CEO',
        x: canvasWidth / 2 - 100, y: 50, // Center the CEO card
        children: [
            {
                name: 'Engineering',
                manager: 'CTO',
                x: 200, y: 200,
                children: [
                    { name: 'Development', manager: 'Dev Manager', x: 150, y: 350, children: [] },
                    { name: 'QA', manager: 'QA Manager', x: 250, y: 350, children: [] }
                ]
            },
            {
                name: 'Finance',
                manager: 'CFO',
                x: 600, y: 200,
                children: [
                    { name: 'Accounting', manager: 'Account Manager', x: 600, y: 350, children: [] }
                ]
            },
        ]
    };

    let draggedNode = null;
    let offsetX, offsetY;

    // 카드 그리기 함수
    function drawCard(ctx, node) {
        const width = 200, height = 120;
        const borderRadius = 10;

        // 그림자 설정
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;

        // 카드 배경 그리기 (둥근 모서리)
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

        // 각 구역별 배경색 설정
        ctx.fillStyle = '#0058a3'; // 책임자명 구역 (IKEA Blue)
        ctx.fillRect(node.x, node.y, width, height / 3);
        ctx.fillStyle = '#f7d117'; // 조직명 구역 (IKEA Yellow)
        ctx.fillRect(node.x, node.y + height / 3, width, height / 3);
        ctx.fillStyle = '#fff'; // 삭제 버튼 및 New 버튼 구역 (White)
        ctx.fillRect(node.x, node.y + (2 * height / 3), width, height / 3);

        // 카드 테두리 그리기
        ctx.strokeStyle = '#000';
        ctx.stroke();

        // 그림자 해제
        ctx.shadowColor = 'transparent';

        // 텍스트 설정
        ctx.fillStyle = '#fff'; // 책임자명 텍스트 색상 (White)
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';

        // 조직책임자명
        ctx.fillText(node.manager, node.x + width / 2, node.y + 22);

        // 조직명 텍스트 색상 (Black)
        ctx.fillStyle = '#000';
        ctx.fillText(node.name, node.x + width / 2, node.y + 60);

        // CEO 카드에는 삭제 버튼을 표시하지 않음
        if (node.manager !== 'CEO') {
            // 삭제 버튼
            ctx.fillText('x', node.x + width - 20, node.y + height - 10);
        }

        // New 버튼
        ctx.fillStyle = '#000';
        ctx.strokeStyle = '#000';
        ctx.strokeRect(node.x + 10, node.y + height - 30, 40, 20);
        ctx.fillText('New', node.x + 30, node.y + height - 12);
    }

    // 조직도 그리기 함수
    function drawOrgChart(ctx, node) {
        drawCard(ctx, node);
        
        if (node.children && node.children.length > 0) {
            node.children.forEach(child => {
                ctx.beginPath();
                ctx.moveTo(node.x + 100, node.y + 120);
                ctx.lineTo(child.x + 100, child.y);
                ctx.stroke();
                drawOrgChart(ctx, child);
            });
        }
    }

    // 클릭된 노드 찾기 함수
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

    // 클릭된 노드의 부모 노드 찾기 함수
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

    // 캔버스 초기화 및 다시 그리기 함수
    function redraw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawOrgChart(ctx, savedOrgData);
    }

    // 로컬 스토리지에 데이터 저장 함수
    function saveData() {
        localStorage.setItem('orgData', JSON.stringify(savedOrgData));
    }

    // 노드 삭제 함수
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

    // 더블 클릭으로 조직명 및 책임자명 수정
    canvas.addEventListener('dblclick', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const clickedNode = findNode(savedOrgData, x, y);
        if (clickedNode) {
            if (y >= clickedNode.y && y <= clickedNode.y + 40) {
                // 조직책임자명 수정
                const input = document.createElement('input');
                input.type = 'text';
                input.value = clickedNode.manager;
                input.className = 'input-style bg-white border border-gray-300 rounded';
                input.style.position = 'absolute';
                input.style.left = `${Math.min(rect.left + clickedNode.x + 10, canvasWidth - 210)}px`;
                input.style.top = `${rect.top + clickedNode.y + 10}px`;
                input.style.width = '180px';

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
                // 조직명 수정
                const input = document.createElement('input');
                input.type = 'text';
                input.value = clickedNode.name;
                input.className = 'input-style bg-white border border-gray-300 rounded';
                input.style.position = 'absolute';
                input.style.left = `${Math.min(rect.left + clickedNode.x + 10, canvasWidth - 210)}px`;
                input.style.top = `${rect.top + clickedNode.y + 50}px`;
                input.style.width = '180px';

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

        // CEO 카드는 드래그할 수 없도록 함
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

    // 버튼 클릭 처리
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const clickedNode = findNode(savedOrgData, x, y);
        if (clickedNode) {
            const width = 200, height = 120;
            const deleteX = clickedNode.x + width - 20;
            const deleteY = clickedNode.y + height - 10;
            const newX = clickedNode.x + 30;
            const newY = clickedNode.y + height - 10;

            // 삭제 버튼 클릭 시
            if (clickedNode.manager !== 'CEO' && x >= deleteX - 10 && x <= deleteX + 10 && y >= deleteY - 10 && y <= deleteY + 10) {
                const parentNode = findParentNode(savedOrgData, clickedNode);
                if (parentNode) {
                    deleteNode(parentNode, clickedNode);
                    redraw();
                    saveData();
                }
            }

            // New 버튼 클릭 시
            if (x >= newX - 20 && x <= newX + 20 && y >= newY - 10 && y <= newY + 10) {
                const newChild = {
                    name: 'New Department',
                    manager: 'New Manager',
                    x: clickedNode.x + 50,
                    y: clickedNode.y + 120,
                    children: []
                };
                clickedNode.children.push(newChild);
                redraw();
                saveData();
            }
        }
    });

    // 초기 조직도 그리기
    redraw();
});