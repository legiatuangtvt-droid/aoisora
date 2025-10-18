/**
 * AoiSora - Global Modal Manager
 * Quản lý việc hiển thị, ẩn và tương tác với tất cả các modal trong dự án.
 */

const modalState = {
    activeModal: null,
    confirmationResolver: null,
};

/**
 * Hiển thị một modal dựa trên ID của nó.
 * @param {string} modalId - ID của phần tử modal (ví dụ: 'group-modal').
 */
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.error(`Modal with id "${modalId}" not found.`);
        return;
    }

    modalState.activeModal = modal;
    modal.classList.add('flex');
    // Sử dụng setTimeout để đảm bảo transition CSS được áp dụng sau khi display được thay đổi
    setTimeout(() => {
        modal.classList.add('show');
    }, 10); // Một khoảng trễ nhỏ là đủ
}

/**
 * Ẩn modal đang hoạt động.
 */
function hideModal() {
    if (!modalState.activeModal) return;

    const modal = modalState.activeModal;
    modal.classList.remove('show');

    // Đợi animation kết thúc rồi mới ẩn hẳn (display: none)
    modal.addEventListener('transitionend', () => {
        modal.classList.remove('flex');
        // Reset form nếu có
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
    }, { once: true });

    modalState.activeModal = null;
}

/**
 * Hiển thị một popup xác nhận tùy chỉnh.
 * @param {string} message - Thông điệp cần hiển thị.
 * @param {string} [title='Xác nhận'] - Tiêu đề của popup.
 * @returns {Promise<boolean>} - Trả về Promise, resolve `true` nếu xác nhận, `false` nếu hủy.
 */
function showConfirmation(message, title = 'Xác nhận') {
    const confirmModal = document.getElementById('confirmation-modal');
    if (!confirmModal) return Promise.resolve(false);

    document.getElementById('confirmation-title').textContent = title;
    document.getElementById('confirmation-message').textContent = message;

    showModal('confirmation-modal');

    return new Promise((resolve) => {
        modalState.confirmationResolver = resolve;
    });
}

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    // Đóng modal khi click vào nút close, overlay, hoặc nút cancel
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('.modal-close-btn') || e.target.classList.contains('modal-overlay')) {
            hideModal();
        }
        if (e.target.id === 'confirmation-cancel-btn') {
            if (modalState.confirmationResolver) modalState.confirmationResolver(false);
            hideModal();
        }
        if (e.target.id === 'confirmation-confirm-btn') {
            if (modalState.confirmationResolver) modalState.confirmationResolver(true);
            hideModal();
        }
    });

    // Đóng modal khi nhấn phím Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalState.activeModal) {
            hideModal();
        }
    });
});

// Expose functions to global scope to be called from other scripts
window.showModal = showModal;
window.hideModal = hideModal;
window.showConfirmation = showConfirmation;