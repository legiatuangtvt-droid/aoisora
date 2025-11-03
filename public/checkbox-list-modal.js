/**
 * AoiSora Custom Checkbox List Prompt Modal
 *
 * Cách sử dụng:
 * const options = [
 *   { value: '1', text: 'Lựa chọn 1' },
 *   { value: '2', text: 'Lựa chọn 2', checked: true },
 * ];
 * const selectedValues = await showCheckboxListPrompt('Chọn các miền:', 'Áp dụng cho Miền', options);
 * if (selectedValues) {
 *   // Người dùng đã chọn và nhấn "OK", selectedValues là một mảng các giá trị.
 * } else {
 *   // Người dùng đã nhấn "Hủy" hoặc đóng modal.
 * }
 */

/**
 * Hiển thị một modal với danh sách checkbox và trả về một Promise.
 * @param {string} message - Thông điệp chính cần hiển thị.
 * @param {string} [title='Lựa chọn'] - Tiêu đề của modal.
 * @param {Array<object>} options - Mảng các đối tượng tùy chọn { value: string, text: string, checked?: boolean }.
 * @param {string} [okText='OK'] - Chữ trên nút OK.
 * @param {string} [cancelText='Hủy'] - Chữ trên nút hủy.
 * @returns {Promise<string[]|null>} - Resolve với một mảng các giá trị được chọn nếu người dùng xác nhận, `null` nếu hủy.
 */
function showCheckboxListPrompt(message, title = 'Lựa chọn', options = [], okText = 'OK', cancelText = 'Hủy') {
    return new Promise(resolve => {
        const existingModal = document.getElementById('global-checkbox-prompt-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // --- NEW: Logic để render bảng hoặc danh sách ---
        let contentHTML = '';
        // Sửa lỗi: Kiểm tra xem options có phải là object chứa 'rows' không
        const isTable = !Array.isArray(options) && options.rows && Array.isArray(options.rows);

        if (isTable) {
            const headers = options.headers || [];
            const headerHTML = `
                <thead class="bg-gray-50">
                    <tr>
                        <th class="p-2 w-10 text-center"><input type="checkbox" id="checkbox-select-all" class="form-checkbox h-4 w-4 text-indigo-600"></th>
                        ${headers.map(h => `<th class="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${h}</th>`).join('')}
                    </tr>
                </thead>`;
            // Sửa lỗi: Lặp qua `options.rows` thay vì `options`
            const rowsHTML = options.rows.map((opt, index) => `
                <tr class="hover:bg-gray-50">
                    <td class="p-2 text-center"><input type="checkbox" id="checkbox-opt-${index}" value="${opt.value}" class="form-checkbox h-4 w-4 text-indigo-600" ${opt.checked ? 'checked' : ''}></td>
                    ${opt.cells.map(cell => `<td class="p-2 text-sm text-gray-700">${cell}</td>`).join('')}
                </tr>
            `).join('');

            contentHTML = `<table class="w-full border-collapse">${headerHTML}<tbody>${rowsHTML}</tbody></table>`;
        } else {
            // Logic cũ để render danh sách
            const optionsHTML = options.map((opt, index) => `
                <label for="checkbox-opt-${index}" class="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                    <input type="checkbox" id="checkbox-opt-${index}" value="${opt.value}" class="form-checkbox h-4 w-4 text-indigo-600" ${opt.checked ? 'checked' : ''}>
                    <span class="ml-3 text-sm text-gray-700">${opt.text}</span>
                </label>
            `).join('');
            contentHTML = `<label for="checkbox-select-all" class="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer font-semibold border-b">
                                <input type="checkbox" id="checkbox-select-all" class="form-checkbox h-4 w-4 text-indigo-600">
                                <span class="ml-3 text-sm text-gray-800">Chọn tất cả</span>
                           </label>${optionsHTML}`;
        }

        const modal = document.createElement('div');
        modal.id = 'global-checkbox-prompt-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content max-w-2xl w-full">
                <form id="global-checkbox-prompt-form" novalidate>
                    <div class="modal-header">
                        <h3 class="modal-title">${title}</h3>
                        <button type="button" class="modal-close-btn">&times;</button>
                    </div>
                    <div class="modal-body py-4">
                        <p class="text-sm font-medium text-gray-700 mb-2">${message}</p>
                        <div class="mt-2 border rounded-md max-h-96 overflow-y-auto">
                            ${contentHTML}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" id="checkbox-prompt-cancel-btn" class="btn btn-secondary">${cancelText}</button>
                        <button type="submit" id="checkbox-prompt-ok-btn" class="btn btn-indigo">${okText}</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        const form = modal.querySelector('#global-checkbox-prompt-form');
        const selectAllCheckbox = modal.querySelector('#checkbox-select-all');
        const optionCheckboxes = modal.querySelectorAll('input[type="checkbox"]:not(#checkbox-select-all)');
        const cancelBtn = modal.querySelector('#checkbox-prompt-cancel-btn');
        const closeBtn = modal.querySelector('.modal-close-btn');

        selectAllCheckbox.onchange = (e) => {
            optionCheckboxes.forEach(cb => cb.checked = e.target.checked);
        };

        const closeModal = (value) => {
            modal.classList.remove('show');
            modal.addEventListener('transitionend', () => { modal.remove(); resolve(value); }, { once: true });
        };

        form.onsubmit = (e) => { e.preventDefault(); closeModal(Array.from(optionCheckboxes).filter(cb => cb.checked).map(cb => cb.value)); };
        cancelBtn.onclick = () => closeModal(null);
        closeBtn.onclick = () => closeModal(null);
        modal.onclick = (e) => { if (e.target === modal) closeModal(null); };

        setTimeout(() => { modal.classList.add('flex', 'show'); }, 10);
    });
}

window.showCheckboxListPrompt = showCheckboxListPrompt;