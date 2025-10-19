function initializeLayout() {
    /**
     * Tải và chèn các thành phần layout chung (sidebar, header).
     * Hàm này chỉ được gọi một lần khi trang được tải lần đầu.
     */
    const loadLayoutComponents = () => {
        return fetch('layout.html')
            .then(response => response.ok ? response.text() : Promise.reject(`File layout.html không tìm thấy`))
            .then(html => {
                // Tạo một div tạm để chứa nội dung HTML và parse nó
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // Lấy nội dung từ các template và chèn vào placeholder
                const sidebarTemplate = doc.getElementById('template-sidebar');
                const headerTemplate = doc.getElementById('template-header');
                
                document.getElementById('sidebar-placeholder').innerHTML = sidebarTemplate.innerHTML;
                document.getElementById('header-placeholder').innerHTML = headerTemplate.innerHTML;

                // Sau khi chèn xong, thực hiện các callback để cập nhật UI
                setActiveSidebarLink(window.location.pathname);
                setPageTitle();
            });
    };
    const setActiveSidebarLink = (pathname) => {
        const currentPage = pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('#sidebar-placeholder .nav-link');
        
        // Các lớp CSS của Tailwind cho trạng thái active
        const activeClasses = ['bg-green-600', 'text-white'];
        // Các lớp CSS của Tailwind cho trạng thái không active (để đảm bảo reset đúng)
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
    };

    const setPageTitle = () => {
        const headerTitle = document.querySelector('#page-title');
        const documentTitle = document.title;
        if (headerTitle) {
            // Lấy title của trang và loại bỏ phần " - AoiSora"
            const cleanTitle = documentTitle.replace(' - AoiSora', '').trim();
            headerTitle.textContent = cleanTitle;
        }
    };

    /**
     * Tải và hiển thị nội dung của một trang mà không cần tải lại toàn bộ.
     * @param {string} href - URL của trang cần tải.
     */
    async function loadPageContent(path) {
        try {
            // Luôn sử dụng đường dẫn tương đối để fetch, tránh lỗi file://
            const relativePath = path.startsWith('/') ? path.substring(1) : path.split('/').pop();

            const response = await fetch(relativePath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Lấy nội dung chính và tiêu đề từ trang mới
            const newContent = doc.querySelector('main');
            const newTitle = doc.querySelector('title').textContent;

            // Thay thế nội dung và cập nhật tiêu đề
            document.querySelector('main').replaceWith(newContent);
            document.title = newTitle;
            setPageTitle(); // Cập nhật header

            // Phát ra một sự kiện tùy chỉnh để thông báo rằng nội dung đã được tải
            // main.js sẽ lắng nghe sự kiện này để tải module JS tương ứng
            const event = new CustomEvent('page-content-loaded', { detail: { pageName: relativePath } });
            document.dispatchEvent(event);

        } catch (error) {
            console.error('Không thể tải trang:', error);
            document.querySelector('main').innerHTML = `<div class="p-8 text-center text-red-500"><h1>Lỗi tải trang</h1><p>Không thể tải nội dung từ ${path}. Vui lòng kiểm tra lại đường dẫn và kết nối mạng.</p></div>`;
        }
    }

    /**
     * Xử lý việc điều hướng SPA.
     * @param {string} href - URL đích.
     */
    async function navigate(href) {
        // Cập nhật thanh URL mà không tải lại trang
        history.pushState({}, '', href); // Vẫn dùng href đầy đủ để cập nhật URL trình duyệt
        // Tải nội dung trang mới
        await loadPageContent(href); // Đợi cho HTML và JS được tải xong
        // Cập nhật trạng thái active cho sidebar
        setActiveSidebarLink(href);
    }

    // --- KHỞI TẠO ---
    return loadLayoutComponents().then(() => {
        // 2. Sau khi layout đã tải xong, bắt sự kiện click trên toàn bộ document
        document.body.addEventListener('click', e => {
            // Tìm thẻ <a> gần nhất mà người dùng đã click
            const link = e.target.closest('a');

            // Kiểm tra xem đó có phải là link điều hướng nội bộ không
            if (link && link.href && link.origin === window.location.origin && !link.getAttribute('target')) {
                e.preventDefault(); // Chặn trình duyệt chuyển trang
                navigate(link.href); // Gọi hàm navigate bất đồng bộ của SPA
            }
        });

        // 3. Xử lý khi người dùng nhấn nút back/forward của trình duyệt
        window.addEventListener('popstate', () => {
            // Tải lại nội dung cho URL hiện tại trên thanh địa chỉ
            loadPageContent(window.location.pathname);
            setActiveSidebarLink(window.location.pathname);
        });
    });
}

// Expose hàm khởi tạo ra global scope để main.js có thể gọi
window.initializeLayout = initializeLayout;