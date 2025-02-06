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

document.addEventListener('DOMContentLoaded', () => {
    fetch('assets/mock/messages.json')
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('messages', JSON.stringify(data));
        })
        .catch(error => console.error('Error loading data:', error));
    let lang = localStorage.getItem('lang') || 'ko'; 
    localStorage.setItem('lang', lang); 

    let firstFavorite = JSON.parse(localStorage.getItem('favorite-1st')) || null;
    let firstPage = "";
    console.log(firstFavorite);
    
    if (firstFavorite) {
        firstPage = firstFavorite.url;
        
    } else {
        firstPage = "system.html";
    }

    document.getElementById('loginButton').addEventListener('click', async () => {
        const form = document.getElementById('loginForm');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                // 토큰을 로컬 스토리지에 저장
                localStorage.setItem('token', result.token);
                // index.html로 리다이렉트
                window.location.href = firstPage;
            } else {
                const result = await response.json();
                //alert(result.message);
            }
        } catch (error) {
            //console.error('Error:', error);
        }
    });
});



        
