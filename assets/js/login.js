const tabs = document.querySelectorAll('button[id$="-tab"]');
const forms = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('tab-active'));
        tabs.forEach(t => t.classList.add('tab-inactive'));
        tab.classList.remove('tab-inactive');
        tab.classList.add('tab-active');

        forms.forEach(form => form.classList.add('hidden'));
        document.getElementById(tab.id.replace('-tab', '-form')).classList.remove('hidden');
    });
});


// Modal functionality
const demoLinks = document.querySelectorAll('a[href="#"]');
const demoModal = document.getElementById('demoModal');
const closeDemoModal = document.getElementById('closeDemoModal');

// 링크 클릭 이벤트
demoLinks.forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault(); // 기본 동작 막기
        demoModal.classList.remove('hidden');
    });
});

// 모달 닫기 버튼 클릭 이벤트
closeDemoModal.addEventListener('click', function () {
    demoModal.classList.add('hidden');
});


document.addEventListener('DOMContentLoaded', () => {
    fetch('assets/mock/messages.json')
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('messages', JSON.stringify(data));
        })
        .catch(error => console.error('Error loading data:', error));
    let lang = localStorage.getItem('lang') || 'ko'; // 기본값 'ko' 설정
    localStorage.setItem('lang', lang); // 기본값을 설정 (필요한 경우)
    console.log("login lang: " + lang);
});
