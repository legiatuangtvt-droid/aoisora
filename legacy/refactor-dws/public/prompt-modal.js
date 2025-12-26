/**
 * AoiSora Custom Prompt Modal
 *
 * Cách sử dụng:
 * const name = await showPrompt('Nhập tên:', 'Tạo mới');
 * if (name) {
 *   // Người dùng đã nhập tên và nhấn "OK"
 * } else {
 *   // Người dùng đã nhấn "Hủy" hoặc đóng modal
 * }
 */

/**
 * Hiển thị một modal prompt và trả về một Promise.
 * @param {string} message - Thông điệp chính cần hiển thị trên label.
 * @param {string} [title='Nhập thông tin'] - Tiêu đề của modal.
 * @param {string} [defaultValue=''] - Giá trị mặc định của ô input.
 * @param {string} [okText='OK'] - Chữ trên nút OK.
 * @param {string} [cancelText='Hủy'] - Chữ trên nút hủy.
 * @returns {Promise<string|null>} - Resolve với giá trị input nếu người dùng xác nhận, `null` nếu hủy.
 */
function showPrompt(message, title = 'Nhập thông tin', defaultValue = '', okText = 'OK', cancelText = 'Hủy') {
    return new Promise(resolve => {
        // Xóa modal cũ nếu có
        const existingModal = document.getElementById('global-prompt-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Tạo cấu trúc HTML cho modal
        const modal = document.createElement('div');
        modal.id = 'global-prompt-modal';
        modal.className = 'modal-overlay'; // Sử dụng class đã có
        modal.innerHTML = `
            <div class="modal-content max-w-sm w-full">
                <form id="global-prompt-form" novalidate>
                    <div class="modal-header">
                        <h3 class="modal-title">${title}</h3>
                        <button type="button" class="modal-close-btn">&times;</button>
                    </div>
                    <div class="modal-body py-4">
                        <label for="prompt-input" class="block text-sm font-medium text-gray-700 mb-2">${message}</label>
                        <input type="text" id="prompt-input" class="form-input w-full" value="${defaultValue}">
                    </div>
                    <div class="modal-footer">
                        <button type="button" id="prompt-cancel-btn" class="btn btn-secondary">${cancelText}</button>
                        <button type="submit" id="prompt-ok-btn" class="btn btn-indigo">${okText}</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        const form = modal.querySelector('#global-prompt-form');
        const input = modal.querySelector('#prompt-input');
        const cancelBtn = modal.querySelector('#prompt-cancel-btn');
        const closeBtn = modal.querySelector('.modal-close-btn');

        const closeModal = (value) => {
            modal.classList.remove('show');
            modal.addEventListener('transitionend', () => {
                modal.remove();
                resolve(value);
            }, { once: true });
        };

        form.onsubmit = (e) => { e.preventDefault(); closeModal(input.value); };
        cancelBtn.onclick = () => closeModal(null);
        closeBtn.onclick = () => closeModal(null);
        modal.onclick = (e) => { if (e.target === modal) closeModal(null); };

        setTimeout(() => { modal.classList.add('flex', 'show'); input.focus(); }, 10);
    });
}

window.showPrompt = showPrompt;