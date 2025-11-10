import { db } from './firebase.js';
import { collection, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

async function initializeCheckTaskView() {
    // 1. Ẩn bộ chọn tuần/ngày và nội dung chính
    const dailyControls = document.getElementById('daily-schedule-controls');
    const gridContainer = document.getElementById('schedule-grid-container');
    const mainContainer = gridContainer.parentElement; // Lấy container cha của lưới

    if (dailyControls) dailyControls.style.display = 'none';
    if (gridContainer) gridContainer.style.display = 'none';

    // 2. Giữ lại bộ chọn cửa hàng (đã hiển thị sẵn)

    // 3. Tạo và hiển thị bảng thống kê
    // Kiểm tra xem bảng đã tồn tại chưa để tránh tạo lại
    let tableContainer = document.getElementById('check-task-table-container');
    if (!tableContainer) {
        tableContainer = document.createElement('div');
        tableContainer.id = 'check-task-table-container';
        tableContainer.className = 'bg-white rounded-lg shadow-md overflow-hidden p-4'; // Thêm style
        mainContainer.appendChild(tableContainer);
    }
    tableContainer.style.display = 'block';

    // Tải dữ liệu và render bảng
    await renderTaskSummaryTable(tableContainer);
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
            <thead>
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

        // --- DỮ LIỆU MOCK MỚI ---
        // Sắp xếp (Model) và Đề xuất (DWS) theo giờ
        const mockHours = {
            'POS':    { model: 21.00, dws: 20.25 },
            'PERI':   { model: 13.50, dws: 13.25 },
            'DRY':    { model: 8.75,  dws: 12.25 },
            'MMD':    { model: 5.50,  dws: 6.00  },
            'LEADER': { model: 5.75,  dws: 6.25  },
            'QC-FSH': { model: 8.50,  dws: 8.75  },
            'DELICA': { model: 2.00,  dws: 3.75  },
            'D&D':    { model: 0.00,  dws: 2.75  },
            'OTHER':  { model: 14.75, dws: 8.50  }
        };

        // Chuyển đổi giờ thành số lượng task (1 task = 0.25 giờ) và phân bổ cho 7 ngày
        taskGroups.forEach(group => {
            const groupHours = mockHours[group.code] || { model: 0, dws: 0 };
            const totalModelTasks = Math.round(groupHours.model / 0.25);
            const totalDwsTasks = Math.round(groupHours.dws / 0.25);

            // Phân bổ số task cho 7 ngày một cách tương đối
            const dailyModelTasks = Math.floor(totalModelTasks / 7);
            const dailyDwsTasks = Math.floor(totalDwsTasks / 7);
            modelData[group.code] = days.map((_, i) => dailyModelTasks + (i < totalModelTasks % 7 ? 1 : 0));
            dwsData[group.code] = days.map((_, i) => dailyDwsTasks + (i < totalDwsTasks % 7 ? 1 : 0));
        });

        // Thêm dòng Model
        const modelRow = document.createElement('tr');
        modelRow.innerHTML = `<td class="px-5 py-3 border border-black bg-white text-sm font-bold text-center">Model</td>`+
            days.map((date, index) => {
                const modelTotal = Object.values(modelData).reduce((sum, groupData) => sum + groupData[index], 0);
                return `<td class="px-5 py-3 border border-black bg-white text-sm text-center font-bold">${modelTotal}</td>`;
            }).join('');
        tbody.appendChild(modelRow);

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
                return `<td class="px-5 py-3 border border-black bg-white text-sm text-center font-bold ${colorClass}">${dwsTotal} ${indicator}</td>`;
            }).join('');
        tbody.appendChild(dwsRow);

        // Thêm các dòng Group Task
        taskGroups.forEach(group => {
            const groupRow = document.createElement('tr');
            groupRow.innerHTML = `<td class="px-5 py-3 border border-black bg-white text-sm text-center">${group.code}</td>` +
                days.map((date, index) => {
                    const dwsCount = dwsData[group.code][index];
                    return `<td class="px-5 py-3 border border-black bg-white text-sm text-center">${dwsCount}</td>`;
                }).join('');
            tbody.appendChild(groupRow);
        });

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
export { initializeCheckTaskView };