// Hide Sidebar by default on small screens
if (window.innerWidth <= 768) {
  document.body.classList.add('sidebar-hidden');
}

//////////////////// Dropdown ////////////////////

// Dropdown Notifications Menu
const notificationReads = document.querySelectorAll(
  '.dropdown-notifications-read'
);

notificationReads.forEach((notificationRead) => {
  notificationRead.addEventListener('click', (event) => {
    const notificationsItem = event.currentTarget.closest(
      '.dropdown-notifications-item'
    );
    notificationsItem.classList.toggle('mark-as-read');
    event.stopPropagation();
  });
});

const notificationArchives = document.querySelectorAll(
  '.dropdown-notifications-archive'
);

notificationArchives.forEach((notificationArchive) => {
  notificationArchive.addEventListener('click', (event) => {
    const notificationsItem = event.currentTarget.closest(
      '.dropdown-notifications-item'
    );
    notificationsItem.style.display = 'none';
    event.stopPropagation();
  });
});

//////////////////// Navbar ////////////////////

// Navbar Search Input
searchInputWrapper = document.querySelector('.navbar .search-input-wrapper');
searchInput = document.querySelector(
  '.navbar .search-input-wrapper .search-input'
);

searchButton = document.querySelector('.search-button');
searchButton.addEventListener('click', (event) => {
  showNavbarSearchInput(event);
  event.stopPropagation();
});

searchCloser = document.querySelector('.search-closer');
searchCloser.addEventListener('click', () => {
  searchInputWrapper.classList.remove('show');
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' || (event.ctrlKey && event.key === '/')) {
    searchInputWrapper.classList.remove('show');
  }

  if (event.ctrlKey && event.key === '/') {
    showNavbarSearchInput();
  }
});

// Show Navbar Search Box
function showNavbarSearchInput(event) {
  hideAllDropdowns(event);
  searchInputWrapper.classList.add('show');
  searchInput.focus();
  searchInput.value = '';
}

// Click on empty area to close Navbar search-input
document.documentElement.addEventListener('click', (event) => {
  if (searchInputWrapper.classList.contains('show')) {
    if (event.target !== searchInput) {
      searchInputWrapper.classList.remove('show');
    }
  }
});

//////////////////// Panel of Examiners ////////////////////

// Delete Panel Item
const poeListDeptDelToggles = document.querySelectorAll(
  '[type="tgl-poe-list-dept-del"]'
);

poeListDeptDelToggles.forEach((delToggle) =>
  delToggle.addEventListener('click', (event) => {
    modalConfirm('Are you sure to delete the record?').then((ret) => {
      if (ret === false) {
        return;
      }
      const tableRow = delToggle.closest('tr');
      tableRow.parentNode.removeChild(tableRow);
    });
  })
);

//////////////////// Theme Toggle ////////////////////

const themeToggle = document.querySelector('.theme-toggle .nav-link i');

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');

  if (body.classList.contains('dark-mode')) {
    themeToggle.classList.remove('bx-moon');
    themeToggle.classList.add('bx-sun');
  } else {
    themeToggle.classList.remove('bx-sun');
    themeToggle.classList.add('bx-moon');
  }
});


/* LNB Click 에 대한 Active */
//const sidebar = document.getElementById('sidebar');
const menuLinks = sidebar.querySelectorAll('.menu-link');
const currentFile = window.location.pathname.split('/').pop();

menuLinks.forEach(link => {
  const linkHref = link.getAttribute('href');
  if (linkHref === currentFile) {
    link.parentElement.classList.add('active');
  } else {
    link.parentElement.classList.remove('active');
  }
});


/* Manager - LNB */
function createMenu(menuItemsLnb) {
  const container = document.getElementById('menu-container');
  const menuDiv = document.createElement('div');
  menuDiv.className = 'menu';

  menuItemsLnb.forEach(item => {
      const menuItemDiv = document.createElement('div');
      menuItemDiv.className = 'menu-item';
      
      const menuLink = document.createElement('a');
      menuLink.href = item.href;
      menuLink.className = 'menu-link';

      const icon = document.createElement('i');
      icon.className = item.icon;

      const span = document.createElement('span');
      span.textContent = item.text;

      menuLink.appendChild(icon);
      menuLink.appendChild(span);
      menuItemDiv.appendChild(menuLink);
      menuDiv.appendChild(menuItemDiv);
  });

  container.appendChild(menuDiv);
}

const menuItemsLnb = [
  { href: 'dashboard.html', icon: 'bx bx-home fs-6', text: 'Dashboard' },
  { href: 'buttons.html', icon: 'bx bx-table fs-6', text: 'Buttons' },
  { href: 'accordions.html', icon: 'bx bx-table fs-6', text: 'Accordions' },
  { href: 'account.html', icon: 'bx bx-table fs-6', text: 'Account' }
];

createMenu(menuItemsLnb);