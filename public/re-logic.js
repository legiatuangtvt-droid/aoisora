import { db } from './firebase.js';
import { collection, getDocs, query, orderBy, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Biến cục bộ cho module này
let allRETasks = [];

/**
 * Làm tròn số giờ lên bội số gần nhất của 0.25 (15 phút).
 * Ví dụ: 1.1h -> 1.25h, 1.0h -> 1.0h, 1.26h -> 1.5h
 * @param {number} hours - Số giờ cần làm tròn.
 * @returns {number} Số giờ đã làm tròn.
 */
function roundUpToNearest15Minutes(hours) {
    if (typeof hours !== 'number' || isNaN(hours)) return 0;
    return Math.ceil(hours * 4) / 4;
}

/**
 * Tải dữ liệu RE tasks từ Firestore.
 * @param {object} allTaskGroups - Dữ liệu các nhóm task được truyền từ module daily-templates.
 * @returns {Promise<void>}
 */
async function processRETasks(allTaskGroups) {
    try {
        const tasks = [];
        for (const groupId in allTaskGroups) {
            const group = allTaskGroups[groupId];
            if (group.tasks && Array.isArray(group.tasks)) {
                group.tasks.forEach(task => {
                    // Thêm groupCode vào mỗi task và đẩy vào mảng chung
                    tasks.push({ ...task, category: group.code });
                });
            }
        }
        // Sắp xếp lại toàn bộ task theo category (group code) rồi đến tên task
        allRETasks = tasks.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
    } catch (error) {
        window.showToast("Failed to process RE logic data.", "error");
        console.error("Error processing RE tasks:", error);
    }
}

/**
 * Render nội dung chính của RE Logic view.
 * @param {object} allTaskGroups - Dữ liệu các nhóm task được truyền từ module daily-templates.
 * @param {object} reParameters - Các tham số RE của cửa hàng (customerCount, posCount, etc.).
 */
function renderREView(allTaskGroups, reParameters) {
    const accordionContainer = document.getElementById('re-task-accordion');
    const template = document.getElementById('re-accordion-item-template');
    if (!accordionContainer || !template) return;

    const sortedTaskGroups = Object.values(allTaskGroups).sort((a, b) => (a.order || 99) - (b.order || 99));

    accordionContainer.innerHTML = ''; // Xóa nội dung cũ

    if (sortedTaskGroups.length === 0) {
        accordionContainer.innerHTML = '<p class="text-slate-500">Không tìm thấy nhóm công việc nào.</p>';
        return;
    }

    sortedTaskGroups.forEach(group => {
        const clone = template.content.cloneNode(true);
        const groupCodeSpan = clone.querySelector('[data-role="group-code"]');
        const taskRowsContainer = clone.querySelector('[data-role="task-rows-container"]');

        const tasksInCategory = allRETasks.filter(task => task.category === group.code);
        let totalRE = 0;

        if (groupCodeSpan) groupCodeSpan.textContent = group.code;

        const taskRows = tasksInCategory.map((task, index) => {
            const posCount = reParameters?.posCount || 0;

            // Bỏ qua việc render và tính toán các task POS không đủ điều kiện
            // Ví dụ: Nếu Số POS là 2, sẽ không hiển thị và tính toán cho POS 3.
            if (task.name === 'POS 2' && posCount < 2) return '';
            if (task.name === 'POS 3' && posCount < 3) return '';
            // Có thể mở rộng cho POS 4, 5... trong tương lai
            // if (task.name.startsWith('POS ') && parseInt(task.name.split(' ')[1]) > posCount) return '';

            let calculatedDailyHours = task.dailyHours || 0; // Giá trị mặc định nếu không có quy tắc

            // Logic tính toán RE (Giờ) dựa trên tên task và reParameters
            if (reParameters) {
                const reUnit = task.reUnit || 0;
                const customerCount = reParameters.customerCount || 0;
                const posCount = reParameters.posCount || 0;

                // Áp dụng công thức tính RE (Giờ) dựa trên tên task
                switch (task.name) {
                    case 'Chuẩn bị POS':
                    case 'Đổi tiền lẻ':
                    case 'EOD POS':
                    case 'Giao ca':
                    case 'Hỗ trợ POS':
                    case 'Kết ca':
                    case 'Mở POS':
                    case 'Thế cơm Leader':
                    case 'Thế cơm POS Staff':
                        // Công thức: RE (Giờ) = Unit RE x Số POS
                        // reUnit được tính bằng phút, nên chia cho 60 để ra giờ.
                        calculatedDailyHours = roundUpToNearest15Minutes((reUnit * posCount) / 60);
                        break;
                    case 'POS 1':
                    case 'POS 2':
                    case 'POS 3':
                        // Công thức: RE (Giờ) = Unit RE x Số khách hàng (tính theo giờ)
                        // reUnit được tính bằng phút, nên chia cho 60 để ra giờ.
                        calculatedDailyHours = roundUpToNearest15Minutes((reUnit * customerCount) / 60);
                        break;
                }
            }
            totalRE += calculatedDailyHours; // Cộng dồn vào tổng RE của nhóm
            return `<tr><td class="p-2 border text-center">${index + 1}</td>
                <td class="p-2 border text-left">${task.name}</td>
                <td class="p-2 border text-center">${task.frequency || '-'}</td>
                <td class="p-2 border text-center">${task.reUnit || '-'}</td>
                <td class="p-2 border text-center">${calculatedDailyHours.toFixed(2)}</td>
            </tr>
        `}).join('');

        const totalRow = `
            <tr class="font-bold bg-slate-100">
                <td colspan="4" class="p-2 border text-center">Tổng giờ ${group.code}</td>
                <td class="p-2 border text-center">${totalRE.toFixed(2)}</td>
            </tr>
        `;

        if (taskRowsContainer) {
            if (taskRows.length > 0) {
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

    // Gắn sự kiện cho phần "Thông tin cửa hàng" có thể thu gọn/mở rộng
    const storeInfoToggle = document.getElementById('re-store-info-toggle');
    if (storeInfoToggle) {
        storeInfoToggle.addEventListener('click', (e) => {
            if (e.target.closest('#re-save-store-info-btn')) return; // Không đóng/mở khi click nút Lưu
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
}

/**
 * Lưu các tham số RE vào template hiện tại trên Firestore.
 * @param {string} currentTemplateId - ID của template đang được chỉnh sửa.
 * @param {object} reParameters - Đối tượng chứa các tham số RE.
 */
async function saveREParameters(currentTemplateId, reParameters) {
    if (!currentTemplateId) return;

    const btn = document.getElementById('re-save-store-info-btn');
    try {
        if (btn) btn.innerHTML = `<i class="fas fa-spinner fa-spin mr-1"></i>Đang lưu...`;
        const templateRef = doc(db, 'daily_templates', currentTemplateId);
        await updateDoc(templateRef, { reParameters });
        window.showToast('Đã lưu thông tin cửa hàng thành công!', 'success');
    } catch (error) {
        console.error('Lỗi khi lưu thông tin cửa hàng:', error);
        window.showToast('Không thể lưu thông tin cửa hàng.', 'error');
    } finally {
        if (btn) btn.innerHTML = `<i class="fas fa-save mr-1"></i>Lưu`;
        btn.classList.add('hidden');
    }
}

/**
 * Hàm khởi tạo chính cho RE Logic view.
 * @param {string} currentTemplateId - ID của template hiện tại.
 * @param {Array} allTemplates - Danh sách tất cả templates.
 * @param {object} allTaskGroups - Dữ liệu các nhóm task.
 */
export async function initRELogicView(currentTemplateId, allTemplates, allTaskGroups) {
    await processRETasks(allTaskGroups); // Tải và xử lý các task RE

    let reParameters = {}; // Khởi tạo với giá trị mặc định
    let currentTemplate = null;

    // Tải và hiển thị dữ liệu RE Parameters từ template hiện tại
    if (currentTemplateId) {
        currentTemplate = allTemplates.find(t => t.id === currentTemplateId);
        if (currentTemplate && currentTemplate.reParameters) {
            reParameters = currentTemplate.reParameters;
            const cells = document.querySelectorAll('#re-store-info-body td');
            if (cells.length === 6) {
                cells[0].textContent = reParameters.customerCount || 0; // Số khách hàng
                cells[1].textContent = reParameters.posCount || 0; // Số POS
                cells[2].textContent = reParameters.areaSize || 0; // Diện tích
                cells[3].textContent = reParameters.employeeCount || 0; // Số nhân viên
                cells[4].textContent = reParameters.dryGoodsVolume || 0; // Lượng hàng khô
                cells[5].textContent = reParameters.vegetableWeight || 0; // Lượng rau
            }
        }
    }
    
    // Gọi renderREView sau khi đã có reParameters
    renderREView(allTaskGroups, reParameters);

    // Gắn sự kiện cho nút lưu thông tin cửa hàng
    const saveStoreInfoBtn = document.getElementById('re-save-store-info-btn');
    if (saveStoreInfoBtn) {
        // Xóa listener cũ để tránh gắn nhiều lần
        const newBtn = saveStoreInfoBtn.cloneNode(true);
        saveStoreInfoBtn.parentNode.replaceChild(newBtn, saveStoreInfoBtn);

        newBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (!currentTemplateId) {
                window.showToast('Vui lòng chọn một mẫu trước khi lưu.', 'warning');
                return;
            }
            const cells = document.querySelectorAll('#re-store-info-body td');
            const reParameters = {
                customerCount: parseInt(cells[0].textContent, 10) || 0,
                posCount: parseInt(cells[1].textContent, 10) || 0, // Thêm posCount
                areaSize: parseInt(cells[2].textContent, 10) || 0,
                employeeCount: parseInt(cells[3].textContent, 10) || 0,
                dryGoodsVolume: parseInt(cells[4].textContent, 10) || 0,
                vegetableWeight: parseInt(cells[5].textContent, 10) || 0,
            };
            await saveREParameters(currentTemplateId, reParameters);

            // Sau khi lưu thành công, render lại view với các tham số mới để cập nhật bảng tính
            renderREView(allTaskGroups, reParameters);
        });
    }
}