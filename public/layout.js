document.addEventListener('DOMContentLoaded', function() {
    /**
     * Tải các thành phần layout chung (sidebar, header) từ một file duy nhất
     * và chèn chúng vào các placeholder tương ứng trên trang.
     */
    const loadLayoutComponents = () => {
        fetch('layout.html')
            .then(response => response.text())
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
                setActiveSidebarLink();
                setPageTitle();
            }).catch(error => console.error('Error loading layout components:', error));
    }
    const setActiveSidebarLink = () => {
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('#sidebar-placeholder .nav-link');
        
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href').split('/').pop();
            if (linkPage === currentPage) {
                link.classList.add('active');
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

    // Bắt đầu quá trình tải layout
    loadLayoutComponents();
});