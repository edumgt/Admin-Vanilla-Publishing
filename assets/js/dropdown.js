const memberIcon = document.getElementById('memberIcon');
const memberMenu = document.getElementById('memberMenu');
memberMenu.classList.add("hidden");

const logoutModal = document.getElementById('logoutModal');

memberIcon.classList.add("text-gray-200", "hover:text-white", "p-2");
memberIcon.innerHTML = `<i class="fas fa-user"></i>`;

memberMenu.innerHTML = `<div class="bg-white shadow-lg p-3 rounded-md border">
                     <a class="dropdown-item" href="#">
                        <div class="d-flex">
                           <div class="me-3">
                              <div class="avatar avatar-online">
                                 <img class="rounded-circle bg-primary-subtle" src="sample/sample.svg"
                                    alt="Avatar" width="40px">
                              </div>
                           </div>
                           <div class="">
                              <h6 class="fs-4 mb-0">송주희</h6>
                              <small class="text-muted">관리자</small>
                           </div>
                        </div>
                     </a>
                     <div class="dropdown-divider"></div>
                     <a href="#" class="dropdown-item">
                        <div class="d-flex align-items-center gap-3">
                           <i class="fas fa-user fs-5"></i>
                           <span>Profile</span>
                        </div>
                     </a>
                     <a href="#" class="dropdown-item">
                        <div class="d-flex align-items-center gap-3">
                           <i class="fas fa-cog fs-5"></i>
                           <span>Settings</span>
                        </div>
                     </a>
                     <div class="dropdown-divider"></div>
                     <a href="#" class="dropdown-item" id="logoutButton">
                        <div class="d-flex align-items-center gap-3">
                           <i class="fas fa-sign-out-alt fs-5"></i>
                           <span>로그아웃</span>
                        </div>
                     </a>
                     <div class="dropdown-divider"></div>
                </div>`;

memberIcon.addEventListener('click', function (event) {
    event.stopPropagation(); // 다른 클릭 이벤트 방지

    memberMenu.style.position = `absolute`;
    memberMenu.style.top = `45px`;
    memberMenu.style.right = `20px`;

    memberMenu.classList.remove('hidden');
    memberMenu.classList.add('show');


});

document.addEventListener('click', function (event) {
    if (!memberIcon.contains(event.target) && !memberMenu.contains(event.target)) {
        memberMenu.classList.remove('show');
        memberMenu.classList.add('hidden');
    }
});

// 로그아웃 버튼 클릭 시 모달 표시
const logoutButton = document.getElementById('logoutButton');
logoutButton.addEventListener('click', function () {
    logoutModal.classList.remove('hidden');
    logoutModal.classList.add('show');
});


function getFavorites() {
    let firstFavorite = JSON.parse(localStorage.getItem('favorite-1st')) || null;
    let quickFavorites = JSON.parse(localStorage.getItem('favorite-Quick')) || [];

    let favoriteHTML = '';

    if (firstFavorite) {
        favoriteHTML += `
            <a href="${firstFavorite.url}" class="dropdown-item dropdown-shortcuts-item col">
                <h5>${firstFavorite.title}</h5>
                <small>처음화면</small>
            </a>
        `;
    }

    quickFavorites.forEach(fav => {
        favoriteHTML += `
            <a href="${fav.url}" class="dropdown-item dropdown-shortcuts-item col">
                <h6>${fav.title}</h6>
                <small>바로가기</small>
            </a>
        `;
    });

    return favoriteHTML;
}

function renderDropdown(containerId) {
    const container = document.getElementById(containerId);
    const dropdownHTML = `
        <div class="dropdown">
            <div class="dropdown-toggle">
                <i class="fas fa-bars"></i>
            </div>
            <div id="dropdown-menu-shortcuts" class="dropdown-menu dropdown-menu-end">
                    <div>
                        ${getFavorites()}
                    </div>
            </div>
        </div>
    `;

    container.innerHTML = dropdownHTML;

    const dropdownToggle = container.querySelector('.dropdown-toggle');
    const dropdownMenu = container.querySelector('.dropdown-menu');

    dropdownToggle.addEventListener('click', () => {
        dropdownMenu.classList.toggle('show');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderDropdown('dropdown-container');
});

const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

dropdownToggles.forEach((dropdownToggle) =>
    dropdownToggle.addEventListener('click', (event) => {
        const dropdown = dropdownToggle.closest('.dropdown');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        hideAllDropdowns(event);
        dropdownMenu.classList.toggle('show');
        event.stopPropagation();
    })
);


function hideAllDropdowns(event) {
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');

    dropdownMenus.forEach((dropdownMenu) => {
        if (dropdownMenu.classList.contains('show')) {
            const dropdown = dropdownMenu.closest('.dropdown');
            const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
            if (event.currentTarget !== dropdownToggle) {
                dropdownMenu.classList.remove('show');
            }
        }
    });
}

function saveFavorite(key) {
    const title = document.querySelector('.breadcrumb')?.innerText || 'No Title';
    const fullPath = window.location.pathname;
    const fileName = fullPath.substring(fullPath.lastIndexOf('/') + 1) || 'index.html';

    let favoriteData = { title, url: fileName };

    if (key === '1st') {
        localStorage.setItem('favorite-1st', JSON.stringify(favoriteData));
        showToast('favo-login', 'success', lang);
    } else if (key === 'Quick') {
        let quickFavorites = JSON.parse(localStorage.getItem('favorite-Quick')) || [];

        const isDuplicate = quickFavorites.some(item => item.url === fileName);
        if (isDuplicate) {
            showToast('favo-already', 'warning', lang);
            return;
        }

        if (quickFavorites.length >= 8) {
            quickFavorites.shift();
        }
        quickFavorites.push(favoriteData);
        localStorage.setItem('favorite-Quick', JSON.stringify(quickFavorites));

        showToast('favo-save', 'success', lang);
    }
    renderDropdown('dropdown-container');
}

function addBreadcrumbBadges() {
    const breadcrumbContainer = document.querySelector('.breadcrumb');
    const favoriteContainer = document.createElement('div');
    favoriteContainer.id = 'favorite';
    favoriteContainer.style.display = 'flex';
    favoriteContainer.style.alignItems = 'center';
    favoriteContainer.style.position = 'absolute';
    favoriteContainer.style.top = '70px';
    favoriteContainer.style.right = '30px';

    favoriteContainer.innerHTML += `
        <span id="fav1" class="favo-1" onclick="saveFavorite('1st', window.location.href)">1</span>
        <span id="fav2" class="favo-2" onclick="saveFavorite('Quick', window.location.href)">Q</span>
    `;

    breadcrumbContainer.parentNode.insertBefore(favoriteContainer, breadcrumbContainer.nextSibling);
}
addBreadcrumbBadges();

const fav1 = document.getElementById("fav1");
createTooltip(fav1, "현재 페이지를 로그인 후 바로가기로 저장합니다.");
const fav2 = document.getElementById("fav2");
createTooltip(fav2, "현재 페이지를 바로가기 목록에 저장합니다.");
