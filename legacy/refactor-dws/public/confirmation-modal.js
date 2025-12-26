/**
 * AoiSora Custom Confirmation Modal
 *
 * Cách sử dụng:
 * if (await showConfirmation('Bạn có chắc không?')) {
 *   // Người dùng đã nhấn "Xác nhận"
 * } else {
 *   // Người dùng đã nhấn "Hủy" hoặc đóng modal
 * }
 */

/**
 * Hiển thị một modal xác nhận và trả về một Promise.
 * @param {string} message - Thông điệp chính cần hiển thị trong modal.
 * @param {string} [title='Xác nhận'] - Tiêu đề của modal.
 * @param {string} [confirmText='Xác nhận'] - Chữ trên nút xác nhận.
 * @param {string} [cancelText='Hủy'] - Chữ trên nút hủy.
 * @returns {Promise<boolean>} - Resolve `true` nếu người dùng xác nhận, `false` nếu hủy.
 */
function showConfirmation(message, title = 'Xác nhận', confirmText = 'Xác nhận', cancelText = 'Hủy') {
    return new Promise(resolve => {
        // Xóa modal cũ nếu có
        const existingModal = document.getElementById('global-confirmation-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Tạo cấu trúc HTML cho modal
        const modal = document.createElement('div');
        modal.id = 'global-confirmation-modal';
        modal.className = 'modal-overlay'; // Sử dụng class đã có
        modal.innerHTML = `
            <div class="modal-content max-w-sm w-full">
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                    <button type="button" class="modal-close-btn">&times;</button>
                </div>
                <div class="modal-body py-4">
                    <p id="confirmation-message" class="text-gray-600">${message}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" id="confirmation-cancel-btn" class="btn btn-secondary">${cancelText}</button>
                    <button type="button" id="confirmation-confirm-btn" class="btn btn-danger">${confirmText}</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const confirmBtn = modal.querySelector('#confirmation-confirm-btn');
        const cancelBtn = modal.querySelector('#confirmation-cancel-btn');
        const closeBtns = modal.querySelectorAll('.modal-close-btn');

        const closeModal = (result) => {
            modal.classList.remove('show');
            modal.addEventListener('transitionend', () => {
                modal.remove();
                resolve(result);
            }, { once: true });
        };

        confirmBtn.onclick = () => closeModal(true);
        cancelBtn.onclick = () => closeModal(false);
        closeBtns.forEach(btn => btn.onclick = () => closeModal(false));
        modal.onclick = (e) => {
            if (e.target === modal) {
                closeModal(false);
            }
        };

        // Hiển thị modal
        setTimeout(() => {
            modal.classList.add('flex', 'show');
        }, 10);
    });
}

window.showConfirmation = showConfirmation;