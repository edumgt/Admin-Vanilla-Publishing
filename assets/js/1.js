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
        savedOrgData.x = canvasWidth / 2 - 100;
        savedOrgData.y = 50;
        redraw();
    })
    .catch(error => console.error('Error fetching the organizational data:', error));

function drawCard(ctx, node) {
    const width = 200, height = 120;
    const borderRadius = 10;

    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;

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

    ctx.fillStyle = '#0058a3';
    ctx.fillRect(node.x, node.y, width, height / 3);
    ctx.fillStyle = '#f7d117';
    ctx.fillRect(node.x, node.y + height / 3, width, height / 3);
    ctx.fillStyle = '#fff';
    ctx.fillRect(node.x, node.y + (2 * height / 3), width, height / 3);

    ctx.shadowColor = 'transparent';

    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';

    ctx.fillText(node.manager, node.x + width / 2, node.y + 22);

    ctx.fillStyle = '#000';
    ctx.fillText(node.name, node.x + width / 2, node.y + 60);

    if (node.manager !== 'CEO') {
        ctx.fillText('x', node.x + width - 20, node.y + height - 10);
    }

    ctx.fillStyle = '#222';
    ctx.strokeStyle = '#333';
    ctx.strokeRect(node.x + 10, node.y + height - 30, 40, 20);
    ctx.fillText('New', node.x + 30, node.y + height - 12);
}

function drawOrgChart(ctx, node) {
    drawCard(ctx, node);

    if (node.children && node.children.length > 0) {
        node.children.forEach(child => {
            ctx.beginPath();
            ctx.moveTo(node.x + 100, node.y + 120);
            ctx.bezierCurveTo(node.x + 100, node.y + 170, child.x + 100, child.y - 50, child.x + 100, child.y);
            ctx.strokeStyle = '#ADD8E6';
            ctx.stroke();
            drawOrgChart(ctx, child);
        });
    }
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
        if (y >= clickedNode.y && y <= clickedNode.y + 40) {
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
        const newX = clickedNode.x + 30;
        const newY = clickedNode.y + height - 10;

        if (clickedNode.manager !== 'CEO' && x >= deleteX - 10 && x <= deleteX + 10 && y >= deleteY - 10 && y <= deleteY + 10) {
            const parentNode = findParentNode(savedOrgData, clickedNode);
            if (parentNode) {
                deleteNode(parentNode, clickedNode);
                redraw();
                saveData();
            }
        }

        if (x >= newX - 20 && x <= newX + 20 && y >= newY - 10 && y <= newY + 10) {
            const newChild = {
                name: '부서: 더블클릭 수정',
                manager: '매니저: 더블클릭 수정',
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

redraw();
