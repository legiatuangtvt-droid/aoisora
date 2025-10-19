/**
 * AoiSora Toast Notification System
 *
 * Cách sử dụng:
 * showToast('Nội dung thông báo'); // Mặc định là success
 * showToast('Tải dữ liệu thất bại!', 'error');
 * showToast('Vui lòng điền đủ thông tin.', 'warning');
 * showToast('Đang xử lý...', 'info');
 */
function showToast(message, type = 'success', duration = 3000) {
    // Tạo một container cho toast nếu chưa tồn tại
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;

    // Icon tương ứng với loại thông báo
    const icons = {
        success: '<i class="fas fa-check-circle"></i>',
        error: '<i class="fas fa-times-circle"></i>',
        warning: '<i class="fas fa-exclamation-triangle"></i>',
        info: '<i class="fas fa-info-circle"></i>',
    };

    toast.innerHTML = `
        <div class="toast-icon">${icons[type] || ''}</div>
        <div class="toast-message">${message}</div>
    `;

    toastContainer.appendChild(toast);

    // Thêm class để kích hoạt animation hiển thị
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // Tự động xóa toast sau một khoảng thời gian
    setTimeout(() => {
        toast.classList.remove('show');
        // Xóa element khỏi DOM sau khi animation ẩn kết thúc
        toast.addEventListener('transitionend', () => toast.remove());
    }, duration);
}

// Gán hàm vào window để các module khác có thể truy cập
window.showToast = showToast;