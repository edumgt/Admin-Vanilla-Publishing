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
    icon.classList.add("icon_big");

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


  { href: 'account.html', icon: 'fas fa-user', text: 'Account' },
  { href: 'account-address.html', icon: 'fas fa-map-marked-alt', text: 'Account-address' },
  { href: 'account-overview.html', icon: 'fas fa-eye', text: 'Account-overview' },
  { href: 'account-password.html', icon: 'fas fa-key', text: 'Account-password' },

  { href: 'dashboard.html', icon: 'fas fa-tachometer-alt', text: 'Dashboard' },
  { href: 'alerts.html', icon: 'fas fa-bell', text: 'Alerts' },
  { href: 'cards.html', icon: 'fas fa-id-card', text: 'Cards' },


];

createMenu(menuItemsLnb);


/* Log Out */
function createDropdownItem(href, iconClass, text, containerId, extraClass = '') {
  // Find the container element
  const container = document.getElementById(containerId);

  // Create the anchor element
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.className = `dropdown-item ${extraClass}`;

  // Create the flex container div
  const flexDiv = document.createElement('div');
  flexDiv.className = 'd-flex align-items-center gap-3';

  // Create the icon element
  const icon = document.createElement('i');
  icon.className = iconClass;

  // Create the span element
  const span = document.createElement('span');
  span.id = 'memberIcon';
  span.textContent = text;

  // Append the icon and span to the flex container
  flexDiv.appendChild(icon);
  flexDiv.appendChild(span);

  // Append the flex container to the anchor
  anchor.appendChild(flexDiv);

  // Append the anchor to the container
  container.appendChild(anchor);
}

// Example usage
createDropdownItem('#', 'bx bx-power-off fs-5', 'Logout', 'dropdown-logout', 'dropdown-logout');


/* log out */
const memberIcon = document.getElementById('memberIcon');
const logoutModal = document.getElementById('logoutModal');
const confirmLogout = document.getElementById('confirmLogout');
const cancelLogout = document.getElementById('cancelLogout');
let isLoggedIn = true;
memberIcon.addEventListener('click', function () {
  if (isLoggedIn) {
    logoutModal.classList.remove('hidden');
  } else {
    logoutModal.classList.remove('hidden');
  }
});
confirmLogout.addEventListener('click', function () {
  isLoggedIn = false;
  memberIcon.innerHTML = '<i class="fas fa-user"></i>';
  logoutModal.classList.add('hidden');
});
cancelLogout.addEventListener('click', function () {
  logoutModal.classList.add('hidden');
});

