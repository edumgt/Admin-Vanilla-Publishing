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
    const floatingNav = document.getElementById('floatingNav');
    floatingNav.classList.remove('hidden');
});
