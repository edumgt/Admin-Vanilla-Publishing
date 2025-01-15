class OffCanvas {
    constructor({ id, menuItems, onExpand, onCollapse }) {
        this.id = id;
        this.menuItems = menuItems;
        this.onExpand = onExpand || (() => {});
        this.onCollapse = onCollapse || (() => {});
        this.isExpanded = false;
        this.init();
    }

    init() {
        // Create the offCanvas HTML structure dynamically
        const offCanvas = document.createElement('div');
        offCanvas.id = this.id;
        offCanvas.className =
            'fixed top-14 h-full bg-white text-gray-800 hidden transform -translate-x-full transition-transform duration-300 z-50 shadow-lg';

        // Menu Items
        const menuList = document.createElement('ul');
        menuList.className = 'flex-grow p-4 space-y-4';

        this.menuItems.forEach((item) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <a href="${item.link}" class="menu-item block text-gray-800 hover:text-blue-500 text-center ">
                    <i class="${item.icon} menu-icon text-blue-400"></i>
                    <span class="menu-text">${item.text}</span>
                </a>
            `;
            menuList.appendChild(li);
        });

        // Buttons for Expand/Collapse
        const controls = document.createElement('div');
        controls.className = 'flex flex-col space-y-4 pb-4';
        controls.innerHTML = `
            <button id="${this.id}-expand" class="text-gray-800 hover:text-blue-500 text-xl">
                <i class="fas fa-chevron-right"></i>
            </button>
            <button id="${this.id}-collapse" class="text-gray-800 hover:text-blue-500 text-xl hidden">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;

        // Append elements to offCanvas
        offCanvas.appendChild(menuList);
        offCanvas.appendChild(controls);
        document.body.appendChild(offCanvas);

        // Event Listeners
        document.getElementById(`${this.id}-expand`).addEventListener('click', () => this.expand());
        document.getElementById(`${this.id}-collapse`).addEventListener('click', () => this.collapse());
    }

    expand() {
        const offCanvas = document.getElementById(this.id);
        offCanvas.classList.remove('hidden', '-translate-x-full');
        offCanvas.classList.add('translate-x-0');
        document.getElementById(`${this.id}-expand`).classList.add('hidden');
        document.getElementById(`${this.id}-collapse`).classList.remove('hidden');
        this.isExpanded = true;
        this.onExpand();
    }

    collapse() {
        const offCanvas = document.getElementById(this.id);
        offCanvas.classList.remove('translate-x-0');
        offCanvas.classList.add('-translate-x-full');
        document.getElementById(`${this.id}-expand`).classList.remove('hidden');
        document.getElementById(`${this.id}-collapse`).classList.add('hidden');
        this.isExpanded = false;
        this.onCollapse();
    }
}

// Example Usage
const offCanvas = new OffCanvas({
    id: 'offCanvas',
    menuItems: [
        { link: '#', icon: 'fas fa-home', text: '입출고관리' },
        { link: '#', icon: 'fas fa-info-circle', text: '권한관리' },
        { link: '#', icon: 'fas fa-cogs', text: '로그관리' },
        { link: '#', icon: 'fas fa-envelope', text: '메뉴관리' },
    ],
    onExpand: () => console.log('OffCanvas Expanded'),
    onCollapse: () => console.log('OffCanvas Collapsed'),
});
