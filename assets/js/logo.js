function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  const tabsData = [
    { href: "system.html", icon: "fas fa-cogs", label: "시스템관리" },
    { href: "orgni.html", icon: "fas fa-users", label: "조직관리" },
    { href: "work.html", icon: "fas fa-briefcase", label: "업무관리" },
    { href: "calendar.html", icon: "fas fa-calendar-alt", label: "일정관리" },
    { href: "stati.html", icon: "fas fa-chart-bar", label: "통계" },
    { href: "config.html", icon: "fas fa-tools", label: "설정관리" },
];

function renderTabs(containerId) {
    const container = document.getElementById(containerId);

    if (!container) {
        console.error(`Container with ID \"${containerId}\" not found.`);
        return;
    }

    const tabsDiv = document.createElement("div");
    tabsDiv.className = "tabs flex";

    tabsData.forEach(tab => {
        const li = document.createElement("li");

        const anchor = document.createElement("a");
        anchor.href = tab.href;
        anchor.className = "gnb-item tab-link block flex items-center space-x-2";

        const icon = document.createElement("i");
        icon.className = tab.icon;

        const span = document.createElement("span");
        span.textContent = tab.label;

        anchor.appendChild(icon);
        anchor.appendChild(span);
        li.appendChild(anchor);
        tabsDiv.appendChild(li);
    });

    container.appendChild(tabsDiv);
}

// 예시: ID가 'tabs-container'인 요소에 탭 렌더링
renderTabs("tabs-container");

class AppBrand {
    constructor(containerId, brandName, logoHref = "#") {
        this.container = document.getElementById(containerId);
        this.brandName = brandName;
        this.logoHref = logoHref;
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="app-brand">
                <a href="${this.logoHref}" class="app-logo">
                    <span class="logo-text">${this.brandName}</span>
                </a>
            </div>
        `;
    }
}

// Initialize the AppBrand component
document.addEventListener('DOMContentLoaded', () => {
    const appBrand = new AppBrand('logo', 'EDUMGT');
});

/* gearIcon */
const button = document.createElement('button');
button.id = 'gearIcon';
button.className = 'fixed bottom-4 right-4 bg-gray-800 text-white rounded-full p-3 shadow-lg z-50';
const icon = document.createElement('i');
icon.className = 'fas fa-globe';
button.appendChild(icon);
document.getElementById('buttonContainer').appendChild(button);
document.getElementById('gearIcon').addEventListener('click', () => {
    console.log("$$$");
    const floatingNav = document.getElementById('floatingNav');
    floatingNav.classList.remove('hidden');
});


/* floaingNav */
document.getElementById('closeFloatingNav').addEventListener('click', () => {
    const floatingNav = document.getElementById('floatingNav');
    floatingNav.classList.add('hidden'); // Hide the floating menu
});

/* LNB Left Menu */
const offCanvas = document.getElementById('offCanvas');
offCanvas.classList.remove('hidden', '-translate-x-full');
offCanvas.classList.add('collapsed');
offCanvas.classList.remove('expanded');

const expandOffCanvas = document.getElementById('expandOffCanvas');
const collapseOffCanvas = document.getElementById('collapseOffCanvas');
expandOffCanvas.addEventListener('click', function () {
    offCanvas.classList.remove('collapsed');
    offCanvas.classList.add('expanded');
    expandOffCanvas.classList.add('hidden');
});
collapseOffCanvas.addEventListener('click', function () {
    offCanvas.classList.add('collapsed');
    offCanvas.classList.remove('expanded');
    collapseOffCanvas.classList.add('hidden');
});


function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} show`;
    toast.innerText = message;

    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
