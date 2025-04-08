const box = document.getElementById('box');
const widthSlider = document.getElementById('width');
const heightSlider = document.getElementById('height');
const depthSlider = document.getElementById('depth');
const CM_TO_PX = 2; // 1cm = 10px (가정)


let rotateX = -20;
let rotateY = 30;

let isDragging = false;
let startX, startY;

const scene = document.querySelector('.scene');

scene.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
});

scene.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    rotateY += dx * 0.5;
    rotateX -= dy * 0.5;

    box.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    startX = e.clientX;
    startY = e.clientY;
});

scene.addEventListener('mouseup', () => isDragging = false);
scene.addEventListener('mouseleave', () => isDragging = false);

const colorPicker = document.getElementById('colorPicker');

// 색상 변경 처리
colorPicker.addEventListener('input', () => {
    const color = colorPicker.value;
    const faces = box.querySelectorAll('.face');
    faces.forEach(face => {
        face.style.background = color;
    });
});

const texturePicker = document.getElementById('texturePicker');

texturePicker.addEventListener('change', () => {
    const file = texturePicker.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const imageUrl = e.target.result;

        const faces = box.querySelectorAll('.face');
        faces.forEach(face => {
            face.style.backgroundImage = `url('${imageUrl}')`;
            face.style.backgroundSize = 'cover';
            face.style.backgroundPosition = 'center';
        });
    };
    reader.readAsDataURL(file);
});





function updateBox() {
    const w = +widthSlider.value * CM_TO_PX;
    const h = +heightSlider.value * CM_TO_PX;
    const d = +depthSlider.value * CM_TO_PX;

    document.getElementById('wVal').textContent = widthSlider.value;
    document.getElementById('hVal').textContent = heightSlider.value;
    document.getElementById('dVal').textContent = depthSlider.value;

    box.style.width = w + 'px';
    box.style.height = h + 'px';

    const faces = box.querySelectorAll('.face');
    faces.forEach(face => face.style.width = w + 'px');
    faces.forEach(face => face.style.height = h + 'px');

    box.querySelector('.front').style.transform = `translateZ(${d / 2}px)`;
    box.querySelector('.back').style.transform = `rotateY(180deg) translateZ(${d / 2}px)`;
    box.querySelector('.right').style.transform = `rotateY(90deg) translateZ(${w / 2}px) scaleX(${d / w})`;
    box.querySelector('.left').style.transform = `rotateY(-90deg) translateZ(${w / 2}px) scaleX(${d / w})`;
    box.querySelector('.top').style.transform = `rotateX(90deg) translateZ(${h / 2}px) scaleY(${d / h})`;
    box.querySelector('.bottom').style.transform = `rotateX(-90deg) translateZ(${h / 2}px) scaleY(${d / h})`;

    const net = document.getElementById('flatNet');

net.querySelector('.face1.front').style.width = w + 'px';
net.querySelector('.face1.front').style.height = h + 'px';

net.querySelector('.face1.back').style.width = w + 'px';
net.querySelector('.face1.back').style.height = h + 'px';

net.querySelector('.face1.left').style.width = d + 'px';
net.querySelector('.face1.left').style.height = h + 'px';

net.querySelector('.face1.right').style.width = d + 'px';
net.querySelector('.face1.right').style.height = h + 'px';

net.querySelector('.face1.top').style.width = w + 'px';
net.querySelector('.face1.top').style.height = d + 'px';

net.querySelector('.face1.bottom').style.width = w + 'px';
net.querySelector('.face1.bottom').style.height = d + 'px';


}

[widthSlider, heightSlider, depthSlider].forEach(input => {
    input.addEventListener('input', updateBox);
});

updateBox();


