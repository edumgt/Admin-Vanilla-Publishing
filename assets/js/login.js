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
});
