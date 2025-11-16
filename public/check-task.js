import { db } from './firebase.js';
import { collection, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

async function initializeCheckTaskView() {
    const dailyControls = document.getElementById('daily-schedule-controls');
    const gridContainer = document.getElementById('schedule-grid-container');
    const checkTaskBtn = document.getElementById('check-task-btn');
    const mainContainer = gridContainer.parentElement; // Lấy container cha của lưới

    // 1. Ẩn bộ chọn tuần/ngày và nội dung chính
    if (dailyControls) dailyControls.style.display = 'none';
    if (gridContainer) gridContainer.style.display = 'none';

    // 2. Giữ lại bộ chọn cửa hàng (đã hiển thị sẵn)

    // 3. Tạo và hiển thị bảng thống kê
    // Kiểm tra xem bảng đã tồn tại chưa để tránh tạo lại
    let tableContainer = document.getElementById('check-task-table-container');
    if (!tableContainer) {
        tableContainer = document.createElement('div');
        tableContainer.id = 'check-task-table-container';
        tableContainer.className = 'bg-white rounded-lg shadow-md overflow-hidden p-4 mt-4'; // Thêm style và margin-top
        mainContainer.appendChild(tableContainer);
    }
    tableContainer.style.display = 'block';

    // Tải dữ liệu và render bảng
    await renderTaskSummaryTable(tableContainer);

    // 4. Thay đổi text và trạng thái của nút "Check Task"
    if (checkTaskBtn) {
        checkTaskBtn.textContent = 'DWS';
        checkTaskBtn.classList.add('dws-active');
    }
}

function revertToMainSchedule() {
    const dailyControls = document.getElementById('daily-schedule-controls');
    const gridContainer = document.getElementById('schedule-grid-container');
    const checkTaskBtn = document.getElementById('check-task-btn');
    const mainContainer = gridContainer.parentElement; // Lấy container cha của lưới
    const tableContainer = document.getElementById('check-task-table-container');

    // 1. Hiển thị lại bộ chọn tuần/ngày và nội dung chính
    if (dailyControls) dailyControls.style.display = 'flex';
    if (gridContainer) gridContainer.style.display = 'block';

    // 2. Ẩn bảng thống kê
    if (tableContainer) tableContainer.style.display = 'none';

    // 3. Thay đổi text và trạng thái của nút "Check Task"
    if (checkTaskBtn) {
        checkTaskBtn.textContent = 'Check Task';
        checkTaskBtn.classList.remove('dws-active');
    }
}

async function renderTaskSummaryTable(container) {
    container.innerHTML = '<p>Đang tải thống kê...</p>';

    try {
        // Tải dữ liệu cần thiết (templates, task groups, schedules)
        // Phần này cần được điều chỉnh để phù hợp với cấu trúc dữ liệu của bạn
        const templates = await fetchTemplates();
        const taskGroups = await fetchTaskGroups();
        const schedules = await fetchSchedules();

        // Tạo bảng
        const table = document.createElement('table');
        table.className = 'min-w-full leading-normal';
        table.innerHTML = `
            <thead class="border-2 border-black">
                <tr>
                    <th class="px-5 py-3 border border-black bg-gray-100 text-center text-xs font-bold text-gray-600 uppercase tracking-wider"></th>
                    <th class="px-5 py-3 border border-black bg-gray-100 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Mon</th>
                    <th class="px-5 py-3 border border-black bg-gray-100 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Tue</th>
                    <th class="px-5 py-3 border border-black bg-gray-100 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Wed</th>
                    <th class="px-5 py-3 border border-black bg-gray-100 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Thu</th>
                    <th class="px-5 py-3 border border-black bg-gray-100 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Fri</th>
                    <th class="px-5 py-3 border border-black bg-gray-100 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Sat</th>
                    <th class="px-5 py-3 border border-black bg-gray-100 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Sun</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;

        const tbody = table.querySelector('tbody');

        // Dữ liệu mẫu (thay thế bằng logic xử lý dữ liệu thật của bạn)
        const days = ['2025-11-10', '2025-11-11', '2025-11-12', '2025-11-13', '2025-11-14', '2025-11-15', '2025-11-16']; // Ví dụ ngày
        const modelData = {}; // Dữ liệu đã xử lý từ templates
        const dwsData = {}; // Dữ liệu đã xử lý từ schedules
        const actualData = {}; // Dữ liệu chấm công thực tế

        // --- DỮ LIỆU MOCK MỚI ---
        // Sắp xếp (Model) và Đề xuất (DWS) theo giờ
        const mockHours = {
            'POS':    { model: 20.00, dws: 21.25 },
            'PERI':   { model: 14.50, dws: 13.75 },
            'DRY':    { model: 10.75, dws: 12.25 },
            'MMD':    { model: 6.50,  dws: 6.00  },
            'LEADER': { model: 8.00,  dws: 8.00  },
            'QC-FSH': { model: 9.50,  dws: 8.75  },
            'DELICA': { model: 3.00,  dws: 3.75  },
            'D&D':    { model: 2.00,  dws: 2.75  },
            'OTHER':  { model: 5.75, dws: 4.50  }
        };

        // Khởi tạo dữ liệu
        taskGroups.forEach(group => {
            modelData[group.code] = new Array(7).fill(0);
            dwsData[group.code] = new Array(7).fill(0);
            actualData[group.code] = new Array(7).fill(0);
        });

        // Tạo dữ liệu cho mỗi ngày, đảm bảo chỉ có 0-2 group có GAP
        days.forEach((_, dayIndex) => {
            // Chọn ngẫu nhiên tối đa 2 group để có bất kỳ sự biến động nào trong ngày
            const shuffledGroups = [...taskGroups].sort(() => 0.5 - Math.random());
            const numGroupsWithGap = Math.floor(Math.random() * 2) + 1; // Luôn có 1 hoặc 2 nhóm
            const groupsWithAnyGap = shuffledGroups.slice(0, numGroupsWithGap);
            const groupsWithGap1 = groupsWithAnyGap.filter(() => Math.random() > 0.3);
            const groupsWithGap2 = groupsWithAnyGap.filter(() => Math.random() > 0.3);

            taskGroups.forEach(group => {
                const groupCode = group.code;
                const baseHours = mockHours[groupCode] || { model: 0, dws: 0 };

                // Hầu hết các ngày, model sẽ bằng giá trị gốc
                modelData[groupCode][dayIndex] = baseHours.model;

                // Tạo GAP 1 (DWS vs Model)
                if (groupsWithGap1.some(g => g.code === groupCode)) {
                    const variation = (Math.floor(Math.random() * 3) - 1) * 0.25; // -0.25, 0, 0.25
                    dwsData[groupCode][dayIndex] = Math.max(0, modelData[groupCode][dayIndex] + variation);
                } else {
                    dwsData[groupCode][dayIndex] = modelData[groupCode][dayIndex]; // Gán bằng model để không có GAP
                }

                // Tạo GAP 2 (Actual vs Model)
                if (groupsWithGap2.some(g => g.code === groupCode)) {
                    const variation = (Math.floor(Math.random() * 3) - 1) * 0.25; // -0.25, 0, 0.25
                    actualData[groupCode][dayIndex] = Math.max(0, modelData[groupCode][dayIndex] + variation);
                } else {
                    actualData[groupCode][dayIndex] = modelData[groupCode][dayIndex]; // Gán bằng model để không có GAP
                }
            });
        });

        // Thêm dòng DWS
        const dwsRow = document.createElement('tr');
        dwsRow.innerHTML = `<td class="px-5 py-3 border border-black bg-white text-sm font-bold text-center">DWS</td>` +
            days.map((date, index) => {
                const modelTotal = Object.values(modelData).reduce((sum, groupData) => sum + groupData[index], 0);
                const dwsTotal = Object.values(dwsData).reduce((sum, groupData) => sum + groupData[index], 0);
                const diff = dwsTotal - modelTotal;
                let indicator = '';
                let colorClass = 'text-gray-700';

                if (diff > 0) {
                    indicator = '↑';
                    colorClass = 'text-green-500';
                } else if (diff < 0) {
                    indicator = '↓';
                    colorClass = 'text-red-500';
                }
                return `<td class="px-5 py-3 border border-black bg-white text-sm text-center font-bold ${colorClass}">${dwsTotal.toFixed(2)} ${indicator}</td>`;
            }).join('');
        tbody.appendChild(dwsRow);

        // Thêm dòng Model
        const modelRow = document.createElement('tr');
        modelRow.innerHTML = `<td class="px-5 py-3 border border-black bg-white text-sm font-bold text-center">Model</td>`+
            days.map((date, index) => {
                const modelTotal = Object.values(modelData).reduce((sum, groupData) => sum + groupData[index], 0);
                return `<td class="px-5 py-3 border border-black bg-white text-sm text-center font-bold">${modelTotal.toFixed(2)}</td>`;
            }).join('');
        tbody.appendChild(modelRow);

        // Thêm các dòng Group Task
        taskGroups.forEach(group => {
            const groupRow = document.createElement('tr');
            groupRow.innerHTML = `<td class="px-5 py-3 border border-black bg-white text-sm text-center">${group.code}</td>` +
                days.map((date, index) => {
                    const modelHours = modelData[group.code]?.[index] || 0;
                    const dwsHours = dwsData[group.code]?.[index] || 0;
                    const actualHours = actualData[group.code]?.[index] || 0;

                    // Tính toán GAP 1 (DWS - Model)
                    const gap1 = dwsHours - modelHours;
                    let indicator1 = '';
                    let colorClass1 = 'text-gray-500';
                    if (gap1 > 0) {
                        indicator1 = '↑';
                        colorClass1 = 'text-green-500';
                    } else if (gap1 < 0) {
                        indicator1 = '↓';
                        colorClass1 = 'text-red-500';
                    }

                    // Tính toán GAP 2 (Actual - Model)
                    const gap2 = actualHours - modelHours;
                    let indicator2 = '';
                    let colorClass2 = 'text-gray-500';
                    if (gap2 > 0) {
                        indicator2 = '↑';
                        colorClass2 = 'text-green-500';
                    } else if (gap2 < 0) {
                        indicator2 = '↓';
                        colorClass2 = 'text-red-500';
                    }

                    const gap1HTML = gap1 !== 0 ? `<div class="absolute top-2 right-[1px] text-[10px] font-semibold ${colorClass1}" title="DWS - Model">
                                        GAP 1: ${gap1.toFixed(2)} ${indicator1}
                                    </div>` : '';
                    const gap2HTML = gap2 !== 0 ? `<div class="absolute bottom-2 right-[1px] text-[10px] font-semibold ${colorClass2}" title="Actual - Model">
                                        GAP 2: ${gap2.toFixed(2)} ${indicator2}
                                    </div>` : '';

                    return `<td class="p-1 border border-black bg-white text-sm text-center">
                                <div class="relative h-full w-full flex items-center justify-center">
                                    <span class="font-bold text-base">${modelHours.toFixed(2)}</span>
                                    ${gap1HTML}
                                    ${gap2HTML}
                                </div>
                            </td>`;
                }).join('');
            tbody.appendChild(groupRow);
        });

        // --- Bổ sung dòng GAP 1 (DWS - Model) ---
        const gap1Row = document.createElement('tr');
        gap1Row.innerHTML = `<td class="px-5 py-3 border border-black bg-white text-sm font-bold text-center">GAP 1</td>` +
            days.map((date, index) => {
                const modelTotal = Object.values(modelData).reduce((sum, groupData) => sum + groupData[index], 0);
                const dwsTotal = Object.values(dwsData).reduce((sum, groupData) => sum + groupData[index], 0);
                const gap = dwsTotal - modelTotal;
                let indicator = '';
                let colorClass = 'text-gray-700';

                if (gap > 0) {
                    indicator = '↑';
                    colorClass = 'text-green-500';
                } else if (gap < 0) {
                    indicator = '↓';
                    colorClass = 'text-red-500';
                }
                return `<td class="px-5 py-3 border border-black bg-white text-sm text-center font-bold ${colorClass}">${gap.toFixed(2)} ${indicator}</td>`;
            }).join('');
        tbody.appendChild(gap1Row);

        // --- Bổ sung dòng GAP 2 (Actual - Model) ---
        const gap2Row = document.createElement('tr');
        gap2Row.innerHTML = `<td class="px-5 py-3 border border-black bg-white text-sm font-bold text-center">GAP 2</td>` +
            days.map((date, index) => {
                const modelTotal = Object.values(modelData).reduce((sum, groupData) => sum + groupData[index], 0);
                const actualTotal = Object.values(actualData).reduce((sum, groupData) => sum + groupData[index], 0);
                const gap = actualTotal - modelTotal;
                let indicator = '';
                let colorClass = 'text-gray-700';

                if (gap > 0) {
                    indicator = '↑';
                    colorClass = 'text-green-500';
                } else if (gap < 0) {
                    indicator = '↓';
                    colorClass = 'text-red-500';
                }
                return `<td class="px-5 py-3 border border-black bg-white text-sm text-center font-bold ${colorClass}">${gap.toFixed(2)} ${indicator}</td>`;
            }).join('');
        tbody.appendChild(gap2Row);

        container.innerHTML = '';
        container.appendChild(table);
    } catch (error) {
        console.error("Lỗi khi render bảng thống kê:", error);
        container.innerHTML = `<p class="text-red-500">Lỗi tải dữ liệu.</p>`;
    }
}

// Các hàm tải dữ liệu giả (thay thế bằng các truy vấn Firestore thật của bạn)
async function fetchTemplates() {
    // Thay thế bằng truy vấn Firestore thật để tải templates
    return [{ id: 'template1', name: 'Test Template' }];
}

async function fetchTaskGroups() {
    // Thay thế bằng truy vấn Firestore thật để tải task groups
    const taskGroupsSnapshot = await getDocs(query(collection(db, 'task_groups'), orderBy('order')));
    return taskGroupsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function fetchSchedules() {
    // Thay thế bằng truy vấn Firestore thật để tải schedules
    return [];
}

// Export hàm khởi tạo
export { initializeCheckTaskView, revertToMainSchedule };