/**
 * AoiSora Custom Select Prompt Modal
 *
 * Cách sử dụng:
 * const selectedValue = await showSelectPrompt('Chọn một tùy chọn:', 'Lựa chọn', '<option value="1">Một</option><option value="2">Hai</option>');
 * if (selectedValue) {
 *   // Người dùng đã chọn và nhấn "OK"
 * } else {
 *   // Người dùng đã nhấn "Hủy" hoặc đóng modal
 * }
 */

/**
 * Hiển thị một modal prompt với dropdown và trả về một Promise.
 * @param {string} message - Thông điệp chính cần hiển thị trên label.
 * @param {string} [title='Lựa chọn'] - Tiêu đề của modal.
 * @param {string} optionsHTML - Chuỗi HTML của các thẻ <option> cho dropdown.
 * @param {string} [okText='OK'] - Chữ trên nút OK.
 * @param {string} [cancelText='Hủy'] - Chữ trên nút hủy.
 * @returns {Promise<string|null>} - Resolve với giá trị được chọn nếu người dùng xác nhận, `null` nếu hủy.
 */
function showSelectPrompt(message, title = 'Lựa chọn', optionsHTML = '', okText = 'OK', cancelText = 'Hủy') {
    return new Promise(resolve => {
        // Xóa modal cũ nếu có
        const existingModal = document.getElementById('global-select-prompt-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Tạo cấu trúc HTML cho modal
        const modal = document.createElement('div');
        modal.id = 'global-select-prompt-modal';
        modal.className = 'modal-overlay'; // Sử dụng class đã có
        modal.innerHTML = `
            <div class="modal-content max-w-sm w-full">
                <form id="global-select-prompt-form" novalidate>
                    <div class="modal-header">
                        <h3 class="modal-title">${title}</h3>
                        <button type="button" class="modal-close-btn">&times;</button>
                    </div>
                    <div class="modal-body py-4">
                        <label for="select-prompt-input" class="block text-sm font-medium text-gray-700 mb-2">${message}</label>
                        <select id="select-prompt-input" class="form-select w-full">${optionsHTML}</select>
                    </div>
                    <div class="modal-footer">
                        <button type="button" id="select-prompt-cancel-btn" class="btn btn-secondary">${cancelText}</button>
                        <button type="submit" id="select-prompt-ok-btn" class="btn btn-indigo">${okText}</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        const form = modal.querySelector('#global-select-prompt-form');
        const select = modal.querySelector('#select-prompt-input');
        const cancelBtn = modal.querySelector('#select-prompt-cancel-btn');
        const closeBtn = modal.querySelector('.modal-close-btn');

        const closeModal = (value) => {
            modal.classList.remove('show');
            modal.addEventListener('transitionend', () => { modal.remove(); resolve(value); }, { once: true });
        };

        form.onsubmit = (e) => { e.preventDefault(); closeModal(select.value); };
        cancelBtn.onclick = () => closeModal(null);
        closeBtn.onclick = () => closeModal(null);
        modal.onclick = (e) => { if (e.target === modal) closeModal(null); };

        setTimeout(() => { modal.classList.add('flex', 'show'); select.focus(); }, 10);
    });
}

window.showSelectPrompt = showSelectPrompt;