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

function renderDropdown(containerId) {
    const container = document.getElementById(containerId);
    const dropdownHTML = `
                <div class="dropdown">
                    <div class="dropdown-toggle">
                        <i class="fas fa-bars"></i>
                    </div>
                    <div id="dropdown-menu-shortcuts" class="dropdown-menu dropdown-menu-end">
                        <div class="dropdown-header border-bottom">
                            <div class="d-flex align-items-center justify-content-between">
                                <h6 class="fs-6">Shortcuts</h6>
                            </div>
                        </div>
                        <div class="dropdown-scroll-container">
                            <div class="row row-bordered g-0">
                                <a class="dropdown-shortcuts-item col">
                                    <div class="dropdown-shortcuts-icon">
                                        <i class="bx bx-bell fs-6"></i>
                                    </div>
                                    <h6 class="fs-6">To Do</h6>
                                    <small>Reminders</small>
                                </a>
                                <a class="dropdown-shortcuts-item col">
                                    <div class="dropdown-shortcuts-icon">
                                        <i class="bx bx-calendar fs-6"></i>
                                    </div>
                                    <h6 class="fs-6">Appointments</h6>
                                    <small>Calendar</small>
                                </a>
                            </div>
                            <div class="row row-bordered g-0">
                                <a class="dropdown-shortcuts-item col">
                                    <div class="dropdown-shortcuts-icon">
                                        <i class="bx bx-cog fs-6"></i>
                                    </div>
                                    <h6 class="fs-6">Account Settings</h6>
                                    <small>Settings</small>
                                </a>
                                <a class="dropdown-shortcuts-item col">
                                    <div class="dropdown-shortcuts-icon">
                                        <i class="bx bx-user fs-6"></i>
                                    </div>
                                    <h6 class="fs-6">Manage Users</h6>
                                    <small>Users</small>
                                </a>
                            </div>
                            <div class="row row-bordered g-0">
                                <a class="dropdown-shortcuts-item col">
                                    <div class="dropdown-shortcuts-icon">
                                        <i class="bx bx-user-check fs-6"></i>
                                    </div>
                                    <h6 class="fs-6">Manage Roles</h6>
                                    <small>User Roles</small>
                                </a>
                                <a class="dropdown-shortcuts-item col">
                                    <div class="dropdown-shortcuts-icon">
                                        <i class="bx bx-hourglass fs-6"></i>
                                    </div>
                                    <h6 class="fs-6">Approval Pending</h6>
                                    <small>Waiting</small>
                                </a>
                            </div>
                            <div class="row row-bordered g-0">
                                <a class="dropdown-shortcuts-item col">
                                    <div class="dropdown-shortcuts-icon">
                                        <i class="bx bxs-report fs-6"></i>
                                    </div>
                                    <h6 class="fs-6">Reports</h6>
                                    <small>Edit Templates</small>
                                </a>
                                <a class="dropdown-shortcuts-item col">
                                    <div class="dropdown-shortcuts-icon">
                                        <i class="bx bx-task fs-6"></i>
                                    </div>
                                    <h6 class="fs-6">Tasks</h6>
                                    <small>Scheduled Tasks</small>
                                </a>
                            </div>
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
