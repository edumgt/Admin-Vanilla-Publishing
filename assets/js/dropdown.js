const memberIcon = document.getElementById('memberIcon');
memberIcon.classList.add("text-gray-200", "hover:text-white", "p-2");
memberIcon.innerHTML = `<i class="fas fa-user"></i>`;

const logoutModal = document.getElementById('logoutModal');

let isLoggedIn = true;
memberIcon.addEventListener('click', function () {
    if (isLoggedIn) {
        logoutModal.classList.remove('hidden');
    } else {
        logoutModal.classList.remove('hidden');
    }
});

// function saveFavorite(key) {
//     const title = document.querySelector('.breadcrumb')?.innerText || 'No Title';
//     const fullPath = window.location.pathname;
//     const fileName = fullPath.substring(fullPath.lastIndexOf('/') + 1) || 'index.html'; 

//     let favoriteData = { title, url: fileName };

//     if (key === '1st') {
//         localStorage.setItem('favorite-1st', JSON.stringify(favoriteData));
//         alert(`1st가 즐겨찾기에 저장되었습니다.`);
//     } else if (key === 'Quick') {
//         let quickFavorites = JSON.parse(localStorage.getItem('favorite-Quick')) || [];

        
//         const isDuplicate = quickFavorites.some(item => item.url === fileName);
//         if (isDuplicate) {
//             alert(`이미 Quick 즐겨찾기에 저장된 페이지입니다.`);
//             return;
//         }

//         if (quickFavorites.length >= 8) {
//             quickFavorites.shift(); 
//         }
//         quickFavorites.push(favoriteData);
//         localStorage.setItem('favorite-Quick', JSON.stringify(quickFavorites));

//         alert(`Quick이 즐겨찾기에 저장되었습니다.`);
//     }

//     renderDropdown('dropdown-container'); 
// }


function getFavorites() {
    let firstFavorite = JSON.parse(localStorage.getItem('favorite-1st')) || null;
    let quickFavorites = JSON.parse(localStorage.getItem('favorite-Quick')) || [];

    let favoriteHTML = '';

    if (firstFavorite) {
        favoriteHTML += `
            <a href="${firstFavorite.url}" class="dropdown-shortcuts-item col">
                <h5>${firstFavorite.title}</h5>
                <small>처음화면</small>
            </a>
        `;
    }

    quickFavorites.forEach(fav => {
        favoriteHTML += `
            <a href="${fav.url}" class="dropdown-shortcuts-item col">
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
        showToast(`1st가 즐겨찾기에 저장되었습니다.`);
    } else if (key === 'Quick') {
        let quickFavorites = JSON.parse(localStorage.getItem('favorite-Quick')) || [];

        
        const isDuplicate = quickFavorites.some(item => item.url === fileName);
        if (isDuplicate) {
            showToast(`이미 Quick 즐겨찾기에 저장된 페이지입니다.`);
            return; 
        }

        if (quickFavorites.length >= 8) {
            quickFavorites.shift(); 
        }
        quickFavorites.push(favoriteData);
        localStorage.setItem('favorite-Quick', JSON.stringify(quickFavorites));

        showToast(`Quick이 즐겨찾기에 저장되었습니다.`);
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
        <span style="cursor: pointer; margin-right: 10px; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; background-color: #6b7280; color: #fff; border-radius: 52%; font-size: 15px; font-weight: bold;" onclick="saveFavorite('1st', window.location.href)">1</span>
        <span style="cursor: pointer; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; background-color: #6b7280; color: #fff; border-radius: 52%; font-size: 15px; font-weight: bold;" onclick="saveFavorite('Quick', window.location.href)">Q</span>
    `;

    breadcrumbContainer.parentNode.insertBefore(favoriteContainer, breadcrumbContainer.nextSibling);
}
addBreadcrumbBadges();
