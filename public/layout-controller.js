/**
 * layout-controller.js
 * Chứa tất cả logic tương tác cho các thành phần layout chung sau khi chúng đã được tải.
 */

function setActiveSidebarLink(pathname) {
    const currentPage = pathname.split('/').pop() || 'daily-schedule.html';
    const navLinks = document.querySelectorAll('#sidebar-placeholder .nav-link');
    
    const activeClasses = ['bg-green-600', 'text-white'];
    const inactiveClasses = ['text-slate-300', 'hover:bg-slate-700'];

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
            link.classList.remove(...inactiveClasses);
            link.classList.add(...activeClasses);
        } else {
            link.classList.remove(...activeClasses);
            link.classList.add(...inactiveClasses);
        }
    });
}

function setPageTitle() {
    const headerTitle = document.querySelector('#page-title');
    const documentTitle = document.title;
    if (headerTitle) {
        const cleanTitle = documentTitle.replace(' - AoiSora', '').trim();
        headerTitle.textContent = cleanTitle;
    }
}

function initializeSidebarHover() {
    const sidebar = document.getElementById('sidebar-placeholder');
    const mainContent = document.querySelector('.flex-1.flex.flex-col.overflow-hidden');
    const pinBtn = document.getElementById('sidebar-pin-btn');
    let collapseTimeout;

    if (sidebar && pinBtn) {
        const SIDEBAR_PINNED_KEY = 'sidebarPinned';

        const collapseSidebar = () => {
            if (localStorage.getItem(SIDEBAR_PINNED_KEY) !== 'true') {
                document.body.classList.remove('sidebar-expanded');
            }
        };

        const expandSidebar = () => {
            document.body.classList.add('sidebar-expanded');
        };

        pinBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isPinned = localStorage.getItem(SIDEBAR_PINNED_KEY) === 'true';
            if (isPinned) {
                localStorage.setItem(SIDEBAR_PINNED_KEY, 'false');
                pinBtn.classList.remove('pinned');
                pinBtn.setAttribute('title', 'Ghim sidebar');
                collapseSidebar();
            } else {
                localStorage.setItem(SIDEBAR_PINNED_KEY, 'true');
                pinBtn.classList.add('pinned');
                pinBtn.setAttribute('title', 'Bỏ ghim sidebar');
                expandSidebar();
            }
        });

        if (localStorage.getItem(SIDEBAR_PINNED_KEY) === 'true') {
            expandSidebar();
            pinBtn.classList.add('pinned');
            pinBtn.setAttribute('title', 'Bỏ ghim sidebar');
        } else {
            expandSidebar();
            collapseTimeout = setTimeout(collapseSidebar, 5000);
        }

        sidebar.addEventListener('mouseenter', () => {
            clearTimeout(collapseTimeout);
            expandSidebar();
        });

        sidebar.addEventListener('mouseleave', collapseSidebar);

        if (mainContent) {
            mainContent.addEventListener('click', collapseSidebar);
        }
    }
}

async function loadPageContent(path) {
    try {
        const relativePath = path.startsWith('/') ? path.substring(1) : path.split('/').pop();
        const response = await fetch(relativePath);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const newContent = doc.querySelector('main');
        const newTitle = doc.querySelector('title').textContent;

        document.querySelector('main').replaceWith(newContent);
        document.title = newTitle;
        setPageTitle();

        const event = new CustomEvent('page-content-loaded', { detail: { pageName: relativePath } });
        document.dispatchEvent(event);

    } catch (error) {
        console.error('Không thể tải trang:', error);
        document.querySelector('main').innerHTML = `<div class="p-8 text-center text-red-500"><h1>Lỗi tải trang</h1><p>Không thể tải nội dung từ ${path}.</p></div>`;
    }
}

async function navigate(href) {
    history.pushState({}, '', href);
    await loadPageContent(href);
    setActiveSidebarLink(href);
}

export function initializeLayoutController() {
    setActiveSidebarLink(window.location.pathname);
    setPageTitle();
    initializeSidebarHover();

    document.body.addEventListener('click', e => {
        const link = e.target.closest('a');
        if (link && link.href && link.origin === window.location.origin && !link.getAttribute('target')) {
            e.preventDefault();
            navigate(link.href);
        }
    });

    window.addEventListener('popstate', () => {
        loadPageContent(window.location.pathname);
        setActiveSidebarLink(window.location.pathname);
    });
}