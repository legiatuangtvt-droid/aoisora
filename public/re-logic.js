import { db } from './firebase.js';
import { collection, getDocs, query, orderBy, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { calculateREForGroup, calculateREForTask } from './re-calculator.js';

/**
 * Tải dữ liệu RE tasks từ Firestore.
 * @param {object} allTaskGroups - Dữ liệu các nhóm task được truyền từ module daily-templates.
 * @returns {Promise<void>}
 */
async function processRETasks(allTaskGroups) {
    // Hàm này không còn cần thiết vì logic tính toán đã được chuyển đi
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
                // Lọc ra các task không đủ điều kiện để không render
                const posCount = reParameters?.posCount || 0;
                if (task.name === 'POS 2' && posCount < 2) return false;
                if (task.name === 'POS 3' && posCount < 3) return false;
                return true;
            })
            .map((task, index) => {
                let calculatedDailyHours = 0;
                if (reParameters) {
                    const rawHours = calculateREForTask(task, group, reParameters);
                    calculatedDailyHours = Math.ceil(rawHours * 4) / 4; // Làm tròn lên 15 phút gần nhất
                }

                return `<tr><td class="p-2 border text-center">${index + 1}</td>
                <td class="p-2 border text-left">${task.name}</td>
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
    if (cells.length === 6) {
        cells[0].textContent = reParameters.customerCount || 0;
        cells[1].textContent = reParameters.posCount || 0;
        cells[2].textContent = reParameters.areaSize || 0;
        cells[3].textContent = reParameters.employeeCount || 0;
        cells[4].textContent = reParameters.dryGoodsVolume || 0;
        cells[5].textContent = reParameters.vegetableWeight || 0;
        // Ẩn nút lưu vì đây là dữ liệu được tải, không phải do người dùng chỉnh sửa
        document.getElementById('re-save-store-info-btn')?.classList.add('hidden');
    }

    // Gọi renderREView sau khi đã có reParameters (có thể là object rỗng)
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
            const updatedCells = document.querySelectorAll('#re-store-info-body td');
            const newReParameters = {
                customerCount: parseInt(updatedCells[0].textContent, 10) || 0,
                posCount: parseInt(updatedCells[1].textContent, 10) || 0,
                areaSize: parseInt(updatedCells[2].textContent, 10) || 0,
                employeeCount: parseInt(updatedCells[3].textContent, 10) || 0,
                dryGoodsVolume: parseInt(updatedCells[4].textContent, 10) || 0,
                vegetableWeight: parseInt(updatedCells[5].textContent, 10) || 0,
            };
            await saveREParameters(currentTemplateId, newReParameters);

            // Sau khi lưu thành công, render lại view với các tham số mới để cập nhật bảng tính
            renderREView(allTaskGroups, newReParameters);
            window.showToast('Đã lưu thông tin cửa hàng và cập nhật RE thành công!', 'success');
        });
    }
}
