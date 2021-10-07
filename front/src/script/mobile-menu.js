const applyNodeStyles = (node, styles) => {
    for (const name in styles) {
        node.style[name] = styles[name];
    }
};

const MOBILE_MENU_OPEN_CLASS_NAME = 'open';

document.addEventListener('DOMContentLoaded', () => {
    const menuIcon = document.getElementById('menu-icon');
    const mobileMenu = document.getElementById('mobile-menu');

    menuIcon.addEventListener('click', (event) => {
        event.preventDefault();

        const isOpen = mobileMenu.classList.contains(MOBILE_MENU_OPEN_CLASS_NAME);

        if (isOpen) {
            mobileMenu.classList.remove(MOBILE_MENU_OPEN_CLASS_NAME);
            applyNodeStyles(mobileMenu, { left: '100vw' });
        }
        else {
            mobileMenu.classList.add(MOBILE_MENU_OPEN_CLASS_NAME);
            applyNodeStyles(mobileMenu, { left: 0 });
        }
    });
});