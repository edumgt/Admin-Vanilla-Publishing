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


