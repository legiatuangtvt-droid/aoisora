/**
 * layout-loader.js
 * Nhiệm vụ duy nhất: Tải file layout.html và chèn các thành phần chung (sidebar, header) vào trang.
 * Hàm này trả về một Promise để báo hiệu khi nào layout đã sẵn sàng.
 */
export function loadLayoutComponents() {
    return fetch('layout.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Không tìm thấy file layout.html`);
            }
            return response.text();
        })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const sidebarTemplate = doc.getElementById('template-sidebar');
            const headerTemplate = doc.getElementById('template-header');
            
            document.getElementById('sidebar-placeholder').innerHTML = sidebarTemplate.innerHTML;
            document.getElementById('header-placeholder').innerHTML = headerTemplate.innerHTML;
        });
}