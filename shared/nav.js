// Shared navigation script to highlight active page based on current URL
document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname.toLowerCase();
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        // Clean link href to match folder or file
        const cleanHref = href.toLowerCase();
        
        if (
            (cleanHref.includes('home') && (currentPath.includes('home') || currentPath.endsWith('/') || currentPath.endsWith('index.html'))) ||
            (cleanHref.includes('transaction') && currentPath.includes('transaction')) ||
            (cleanHref.includes('budget') && currentPath.includes('budget')) ||
            (cleanHref.includes('saving') && (currentPath.includes('saving') || currentPath.includes('investment')))
        ) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});
