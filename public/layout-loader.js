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
            const currentUser = window.currentUser;

            let sidebarTemplate;
            // Kiểm tra vai trò của người dùng để chọn sidebar tương ứng
            if (currentUser && currentUser.roleId === 'STAFF') {
                sidebarTemplate = doc.getElementById('template-sidebar-staff');
            } else if (
                currentUser && (
                    currentUser.roleId === 'STORE_LEADER' ||
                    currentUser.roleId === 'STORE_LEADER_G2' ||
                    currentUser.roleId === 'STORE_LEADER_G3' ||
                    currentUser.roleId === 'STORE_INCHARGE'
                )
            ) {
                sidebarTemplate = doc.getElementById('template-sidebar-store-leader');
            }

            // Nếu không tìm thấy sidebar cho staff hoặc vai trò khác, dùng sidebar mặc định
            if (!sidebarTemplate) {
                sidebarTemplate = doc.getElementById('template-sidebar');
            }

            const headerTemplate = doc.getElementById('template-header');
            
            document.getElementById('sidebar-placeholder').innerHTML = sidebarTemplate.innerHTML;
            document.getElementById('header-placeholder').innerHTML = headerTemplate.innerHTML;

            // Sau khi chèn sidebar, kiểm tra và hiển thị menu "Tổ chức" cho STORE_INCHARGE
            if (currentUser && currentUser.roleId === 'STORE_INCHARGE') {
                const organizationNavGroup = document.querySelector('.nav-group-organization');
                if (organizationNavGroup) {
                    organizationNavGroup.classList.remove('hidden');
                }
            }
        });
}