import { db } from './firebase.js';
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { calculateREForGroup, calculateREForTask } from './re-calculator.js';

/**
 * Render nội dung chính của RE Logic view.
 * @param {object} allTaskGroups - Dữ liệu các nhóm task được truyền từ module daily-templates.
 * @param {object} reParameters - Các tham số RE của cửa hàng (customerCount, posCount, etc.).
 */
function renderREView(allTaskGroups, reParameters) {
    const accordionContainer = document.getElementById('re-task-accordion');
    const template = document.getElementById('re-accordion-item-template');
    if (!accordionContainer || !template) return;

    accordionContainer.innerHTML = ''; // Xóa nội dung cũ để render lại
    const sortedTaskGroups = Object.values(allTaskGroups).sort((a, b) => (a.order || 99) - (b.order || 99));

    if (sortedTaskGroups.length === 0) {
        accordionContainer.innerHTML = '<p class="text-slate-500">Không tìm thấy nhóm công việc nào.</p>';
        return;
    }

    sortedTaskGroups.forEach(group => {
        const clone = template.content.cloneNode(true);
        const groupCodeSpan = clone.querySelector('[data-role="group-code"]');
        const taskRowsContainer = clone.querySelector('[data-role="task-rows-container"]');
        const tasksInCategory = group.tasks || [];

        if (groupCodeSpan) groupCodeSpan.textContent = group.code;

        // Tính tổng RE cho cả nhóm bằng hàm dùng chung
        const totalRE = calculateREForGroup(group, reParameters);

        const taskRows = tasksInCategory
            .filter(task => {
                // --- LOGIC MỚI: Luôn ẩn POS 2 và POS 3 khỏi bảng RE ---
                // Việc phân bổ các task này đã được xử lý trong logic auto-generate.
                if (task.name === 'POS 2' || task.name === 'POS 3') return false;
                return true;
            })
            .map((task, index) => {
                let calculatedDailyHours = 0;
                // --- LOGIC MỚI: Đổi tên hiển thị cho POS 1 ---
                let displayName = task.name === 'POS 1' ? 'POS (POS 1, POS 2, POS 3)' : task.name;

                if (reParameters) {
                    const rawHours = calculateREForTask(task, group, reParameters);
                    calculatedDailyHours = Math.ceil(rawHours * 4) / 4; // Làm tròn lên 15 phút gần nhất
                }

                return `<tr><td class="p-2 border text-center">${index + 1}</td>
                <td class="p-2 border text-left">${displayName}</td>
                <td class="p-2 border text-center">${task.frequency || '-'}</td>
                <td class="p-2 border text-center">${task.frequencyNumber || '-'}</td>
                <td class="p-2 border text-center">${task.reUnit || '-'}</td>
                <td class="p-2 border text-center">${calculatedDailyHours.toFixed(2)}</td>
            </tr>
        `}).join('');

        const totalRow = `
            <tr class="font-bold bg-slate-100">
                <td colspan="5" class="p-2 border text-center">Tổng giờ ${group.code}</td>
                <td class="p-2 border text-center">${totalRE.toFixed(2)}</td>
            </tr>
        `;

        if (taskRowsContainer) {
            if (taskRows) {
                taskRowsContainer.innerHTML = taskRows + totalRow;
            } else {
                taskRowsContainer.innerHTML = `<tr><td colspan="5" class="text-center p-4 text-slate-500">Không có task nào trong nhóm này.</td></tr>`;
            }
        }
        accordionContainer.appendChild(clone);
    });

    // Gắn sự kiện cho các accordion vừa tạo
    document.querySelectorAll('.re-accordion-toggle').forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            content.classList.toggle('hidden');
        });
    });
}

/**
 * Mở popup để chỉnh sửa thông tin cửa hàng.
 * @param {object} reParameters - Các tham số RE hiện tại của template.
 */
function openStoreInfoModal(reParameters = {}) {
    const modal = document.getElementById('re-store-info-modal');
    if (!modal) return;

    // Điền các giá trị chung
    document.getElementById('modal-pos-count').value = reParameters.posCount || 0;
    document.getElementById('modal-area-size').value = reParameters.areaSize || 0;
    document.getElementById('modal-employee-count').value = reParameters.employeeCount || 0;
    document.getElementById('modal-dry-goods-volume').value = reParameters.dryGoodsVolume || 0;
    document.getElementById('modal-vegetable-weight').value = reParameters.vegetableWeight || 0;

    // Điền bảng số lượng khách hàng theo giờ
    const customerTableBody = document.getElementById('modal-customer-table-body');
    customerTableBody.innerHTML = ''; // Xóa dữ liệu cũ
    const customerCountByHour = reParameters.customerCountByHour || {};

    for (let hour = 6; hour <= 22; hour++) {
        const hourStr = String(hour).padStart(2, '0');
        const customerCount = customerCountByHour[hourStr] || 0;
        const posHours = (customerCount / 60).toFixed(2);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="p-2 border text-center font-semibold">${hourStr}:00</td>
            <td class="p-2 border text-center">
                <input type="number" value="${customerCount}" data-hour="${hourStr}" class="customer-hour-input form-input w-24 text-center p-1">
            </td>
            <td class="p-2 border text-center pos-hour-output">${posHours}</td>
        `;
        customerTableBody.appendChild(row);
    }

    // Gắn sự kiện input cho các ô số lượng khách hàng để tự động cập nhật giờ POS
    customerTableBody.querySelectorAll('.customer-hour-input').forEach(input => {
        input.addEventListener('input', () => {
            const count = parseFloat(input.value) || 0;
            const posHourCell = input.closest('tr').querySelector('.pos-hour-output');
            posHourCell.textContent = (count / 60).toFixed(2);
        });
    });

    // Hiển thị modal
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => modal.classList.add('show'), 10);
}

/**
 * Đóng popup chỉnh sửa thông tin cửa hàng.
 */
function closeStoreInfoModal() {
    const modal = document.getElementById('re-store-info-modal');
    if (modal) {
        modal.classList.remove('show');
        // Chờ cho transition kết thúc rồi mới ẩn hoàn toàn
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }, 300); // 300ms khớp với duration của transition
    }
}

/**
 * Xử lý khi submit form thông tin cửa hàng từ popup.
 * @param {Event} e - Sự kiện submit.
 * @param {string} currentTemplateId - ID của template hiện tại.
 * @param {Array} allTemplates - Danh sách tất cả templates.
 * @param {object} allTaskGroups - Dữ liệu các nhóm task.
 */
export async function handleStoreInfoFormSubmit(e, currentTemplateId, allTemplates, allTaskGroups) {
    e.preventDefault();
    const btn = document.getElementById('re-store-info-form-submit-btn');

    if (!currentTemplateId) {
        window.showToast('Vui lòng chọn một mẫu trước khi lưu.', 'warning');
        return;
    }

    // Thu thập dữ liệu từ popup
    const newCustomerCountByHour = {};
    document.querySelectorAll('#modal-customer-table-body .customer-hour-input').forEach(input => {
        const hour = input.dataset.hour;
        newCustomerCountByHour[hour] = parseInt(input.value, 10) || 0;
    });

    const newReParameters = {
        posCount: parseInt(document.getElementById('modal-pos-count').value, 10) || 0,
        areaSize: parseInt(document.getElementById('modal-area-size').value, 10) || 0,
        employeeCount: parseInt(document.getElementById('modal-employee-count').value, 10) || 0,
        dryGoodsVolume: parseInt(document.getElementById('modal-dry-goods-volume').value, 10) || 0,
        vegetableWeight: parseInt(document.getElementById('modal-vegetable-weight').value, 10) || 0,
        customerCountByHour: newCustomerCountByHour,
        // Tính lại tổng customerCount để các logic cũ không bị lỗi
        customerCount: Object.values(newCustomerCountByHour).reduce((sum, count) => sum + count, 0)
    };

    try {
        if (btn) btn.disabled = true;
        // Lưu dữ liệu
        const success = await saveREParameters(currentTemplateId, newReParameters);

        if (success) {
            // Đóng popup
            closeStoreInfoModal();

            // Cập nhật lại reParameters trong template object để render lại cho đúng
            const currentTemplate = allTemplates.find(t => t.id === currentTemplateId);
            if (currentTemplate) {
                currentTemplate.reParameters = newReParameters;
            }

            // Render lại toàn bộ view với dữ liệu mới
            await initRELogicView(currentTemplateId, allTemplates, allTaskGroups);
        }
    } finally {
        if (btn) btn.disabled = false;
    }
}

/**
 * Gắn các event listener cho các thành phần tương tác trong RE Logic view.
 * @param {string} currentTemplateId - ID của template hiện tại.
 * @param {Array} allTemplates - Danh sách tất cả templates.
 * @param {object} allTaskGroups - Dữ liệu các nhóm task.
 */
function addEventListeners(currentTemplateId, allTemplates, allTaskGroups) {
    // Gắn sự kiện cho phần "Thông tin cửa hàng" có thể thu gọn/mở rộng
    const storeInfoToggle = document.getElementById('re-store-info-toggle');
    if (storeInfoToggle) {
        storeInfoToggle.addEventListener('click', (e) => {
            // Không đóng/mở khi click vào các nút bên trong
            if (e.target.closest('button')) return;
            const content = document.getElementById('re-store-info-content');
            if (content) {
                content.classList.toggle('hidden');
            }
        });
    }

    // Gắn sự kiện để hiển thị nút "Lưu" khi người dùng chỉnh sửa thông tin cửa hàng
    const storeInfoBody = document.getElementById('re-store-info-body');
    if (storeInfoBody) {
        storeInfoBody.addEventListener('input', (e) => {
            if (e.target.classList.contains('editable-cell')) {
                const saveBtn = document.getElementById('re-save-store-info-btn');
                if (saveBtn) {
                    saveBtn.classList.remove('hidden');
                }
            }
        });
    }

    // Gắn sự kiện cho nút "Chỉnh sửa" thông tin cửa hàng (mở popup)
    const editStoreInfoBtn = document.getElementById('re-edit-store-info-btn');
    if (editStoreInfoBtn) {
        editStoreInfoBtn.addEventListener('click', () => {
            const currentTemplate = allTemplates.find(t => t.id === currentTemplateId);
            const currentReParameters = currentTemplate?.reParameters || {};
            openStoreInfoModal(currentReParameters);
        });
    }

    // Gắn sự kiện cho form trong popup
    const storeInfoForm = document.getElementById('re-store-info-form');
    if (storeInfoForm) {
        storeInfoForm.addEventListener('submit', (e) => handleStoreInfoFormSubmit(e, currentTemplateId, allTemplates, allTaskGroups));
    }
}

/**
 * Lưu các tham số RE vào template hiện tại trên Firestore.
 * @param {string} currentTemplateId - ID của template đang được chỉnh sửa.
 * @param {object} reParameters - Đối tượng chứa các tham số RE.
 * @returns {Promise<boolean>} - Trả về true nếu lưu thành công, ngược lại false.
 */
async function saveREParameters(currentTemplateId, reParameters) {
    if (!currentTemplateId) return false;

    const btn = document.getElementById('re-store-info-form-submit-btn'); // Nút trong popup
    try {
        if (btn) btn.innerHTML = `<i class="fas fa-spinner fa-spin mr-1"></i>Đang lưu...`;
        const templateRef = doc(db, 'daily_templates', currentTemplateId);
        await updateDoc(templateRef, { reParameters });
        window.showToast('Đã lưu các tham số RE thành công!', 'success');
        return true;
    } catch (error) {
        console.error('Lỗi khi lưu tham số RE:', error);
        window.showToast('Không thể lưu tham số RE.', 'error');
        return false;
    } finally {
        if (btn) btn.innerHTML = `<i class="fas fa-save mr-1"></i>Lưu thay đổi`;
    }
}

/**
 * Hàm khởi tạo chính cho RE Logic view.
 * @param {string} currentTemplateId - ID của template hiện tại.
 * @param {Array} allTemplates - Danh sách tất cả templates.
 * @param {object} allTaskGroups - Dữ liệu các nhóm task.
 */
export async function initRELogicView(currentTemplateId, allTemplates, allTaskGroups) {

    let reParameters = {}; // Khởi tạo với giá trị mặc định
    let currentTemplate = null;

    const cells = document.querySelectorAll('#re-store-info-body td');

    // Tải và hiển thị dữ liệu RE Parameters từ template hiện tại
    if (currentTemplateId) {
        currentTemplate = allTemplates.find(t => t.id === currentTemplateId);
        if (currentTemplate && currentTemplate.reParameters) {            
            reParameters = currentTemplate.reParameters;
        }
    }

    // Luôn cập nhật giao diện "Thông tin cửa hàng" dù có dữ liệu hay không
    // Nếu không có reParameters, các giá trị sẽ là 0
    // --- LOGIC MỚI: Hiển thị tổng số khách hàng thay vì giá trị đơn lẻ ---
    if (cells.length === 6) {
        const totalCustomers = reParameters.customerCountByHour 
            ? Object.values(reParameters.customerCountByHour).reduce((sum, count) => sum + count, 0)
            : (reParameters.customerCount || 0);
        cells[0].textContent = totalCustomers;
        cells[1].textContent = reParameters.posCount || 0;
        cells[2].textContent = reParameters.areaSize || 0;
        cells[3].textContent = reParameters.employeeCount || 0;
        cells[4].textContent = reParameters.dryGoodsVolume || 0;
        cells[5].textContent = reParameters.vegetableWeight || 0;
    }

    // Gọi renderREView sau khi đã có reParameters (có thể là object rỗng)
    renderREView(allTaskGroups, reParameters);

    // Gắn sự kiện cho các thành phần tương tác (nút chỉnh sửa, form popup)
    addEventListeners(currentTemplateId, allTemplates, allTaskGroups);
}
