import { db } from './firebase.js';
import { collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let domController = null;
let allEmployees = [];
let allRoles = {};
let allTaskGroups = {};
let skillRadarChartInstance = null; // Biến để lưu trữ instance của biểu đồ radar

// DOM Elements
let leaderboardList, initialPrompt, employeeDetailView;

/**
 * Tính toán cấp độ (level) dựa trên điểm kinh nghiệm (XP).
 * Đây là một công thức ví dụ, có thể điều chỉnh để phù hợp với logic game hóa.
 * @param {number} xp - Điểm kinh nghiệm.
 * @returns {object} - Chứa level, XP của level hiện tại, và XP cần cho level tiếp theo.
 */
function calculateLevel(xp) {
    const baseXP = 1000; // XP cần cho level 1
    const factor = 1.5; // Hệ số nhân cho mỗi level
    let level = 0;
    let xpForNextLevel = baseXP;
    let currentLevelXP = 0;

    while (xp >= xpForNextLevel) {
        level++;
        currentLevelXP = xpForNextLevel;
        xpForNextLevel += Math.floor(baseXP * Math.pow(factor, level));
    }
    return {
        level: level + 1,
        currentLevelXP: currentLevelXP,
        xpForNextLevel: xpForNextLevel,
    };
}

/**
 * Tải tất cả dữ liệu cần thiết cho trang báo cáo.
 * @returns {Array} - Danh sách nhân viên đã được sắp xếp.
 */
async function fetchPerformanceData() {
    try {
        // Tải song song để tăng tốc độ
        const [employeesSnap, rolesSnap, taskGroupsSnap] = await Promise.all([
            getDocs(collection(db, 'employee')),
            getDocs(collection(db, 'roles')),
            getDocs(collection(db, 'task_groups'))
        ]);

        allEmployees = employeesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        rolesSnap.forEach(doc => allRoles[doc.id] = doc.data());
        taskGroupsSnap.forEach(doc => allTaskGroups[doc.id] = doc.data());

        // Sắp xếp nhân viên theo điểm kinh nghiệm giảm dần
        allEmployees.sort((a, b) => (b.experiencePoints || 0) - (a.experiencePoints || 0));

        return allEmployees;
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu hiệu suất:", error);
        leaderboardList.innerHTML = `<p class="p-4 text-red-500">Không thể tải dữ liệu nhân viên.</p>`;
        return [];
    }
}

/**
 * Hiển thị danh sách nhân viên lên bảng xếp hạng.
 * @param {Array} employees - Danh sách nhân viên.
 */
function renderLeaderboard(employees) {
    leaderboardList.innerHTML = ''; // Xóa placeholder
    if (employees.length === 0) {
        leaderboardList.innerHTML = `<p class="p-4 text-gray-500">Không có dữ liệu nhân viên.</p>`;
        return;
    }

    employees.forEach((employee, index) => {
        const levelInfo = calculateLevel(employee.experiencePoints || 0);
        const dailyProgress = Math.floor(Math.random() * (100 - 70 + 1)) + 70; // Giả lập tiến độ ngày

        const employeeCard = document.createElement('div');
        employeeCard.className = 'p-3 rounded-lg hover:bg-indigo-50 cursor-pointer border border-transparent hover:border-indigo-300 transition-all';
        employeeCard.dataset.employeeId = employee.id;

        // Thêm viền vàng/bạc/đồng cho top 3
        if (index === 0) employeeCard.classList.add('border-yellow-400', 'bg-yellow-50');
        else if (index === 1) employeeCard.classList.add('border-gray-300', 'bg-gray-50');
        else if (index === 2) employeeCard.classList.add('border-orange-300', 'bg-orange-50');


        employeeCard.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="relative">
                    <img src="https://placehold.co/48x48/E2E8F0/4A5568?text=${employee.name.charAt(0)}" class="w-12 h-12 rounded-full">
                    <span class="level-badge absolute -bottom-1 -right-1">Lv.${levelInfo.level}</span>
                </div>
                <div class="flex-1">
                    <p class="font-bold text-sm">${employee.name}</p>
                    <div class="flex items-center gap-2 mt-1 text-gray-400">
                        ${index < 5 ? '<i class="fas fa-hands-helping text-purple-500" title="Ong Chăm Chỉ"></i>' : ''}
                        ${index % 2 === 0 ? '<i class="fas fa-bolt text-yellow-500" title="Thần Tốc"></i>' : ''}
                    </div>
                </div>
                <span class="font-bold text-indigo-600">${(employee.experiencePoints || 0).toLocaleString()} XP</span>
            </div>
            <div class="mt-2 h-1.5 w-full bg-gray-200 rounded-full" title="Tiến độ công việc hôm nay">
                <div class="bg-green-500 h-1.5 rounded-full" style="width: ${dailyProgress}%"></div>
            </div>
        `;

        employeeCard.addEventListener('click', () => {
            displayEmployeeDetails(employee.id);
            // Highlight a selection
            document.querySelectorAll('#leaderboard-list > div').forEach(child => child.classList.remove('bg-indigo-100'));
            employeeCard.classList.add('bg-indigo-100');
        });

        leaderboardList.appendChild(employeeCard);
    });
}

/**
 * Mô phỏng việc lấy dữ liệu kỹ năng cho một nhân viên.
 * Trong tương lai, hàm này sẽ truy vấn Firestore để lấy dữ liệu thật.
 * @param {string} employeeId - ID của nhân viên.
 * @returns {Promise<object>} - Dữ liệu cho biểu đồ radar.
 */
async function getSkillDataForEmployee(employeeId) {
    // Giả lập: Các nhóm kỹ năng chính
    const skillLabels = ['POS', 'Leader', 'Ngành hàng', 'MMD', 'Aeon Cafe', 'QC-FSH'];
    
    // Giả lập điểm số ngẫu nhiên cho mỗi kỹ năng
    const skillData = skillLabels.map(() => Math.floor(Math.random() * (100 - 40 + 1)) + 40);

    return {
        labels: skillLabels,
        datasets: [{
            label: 'Điểm Kỹ năng',
            data: skillData,
            backgroundColor: 'rgba(79, 70, 229, 0.2)',
            borderColor: 'rgba(79, 70, 229, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(79, 70, 229, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(79, 70, 229, 1)'
        }]
    };
}

/**
 * Vẽ biểu đồ Radar kỹ năng cho nhân viên được chọn.
 * @param {string} employeeId - ID của nhân viên.
 */
async function drawSkillRadarChart(employeeId) {
    const data = await getSkillDataForEmployee(employeeId);
    const ctx = document.getElementById('skill-radar-chart-canvas')?.getContext('2d');
    if (!ctx) return;

    // Hủy biểu đồ cũ nếu nó tồn tại để tránh vẽ chồng chéo
    if (skillRadarChartInstance) {
        skillRadarChartInstance.destroy();
    }

    skillRadarChartInstance = new Chart(ctx, {
        type: 'radar',
        data: data,
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: { r: { angleLines: { display: false }, suggestedMin: 0, suggestedMax: 100, pointLabels: { font: { size: 12 } } } },
            plugins: { legend: { display: false } }
        }
    });
}

/**
 * Hiển thị chi tiết thông tin của một nhân viên được chọn.
 * @param {string} employeeId - ID của nhân viên.
 */
function displayEmployeeDetails(employeeId) {
    const employee = allEmployees.find(e => e.id === employeeId);
    if (!employee) return;

    initialPrompt.classList.add('hidden');
    employeeDetailView.classList.remove('hidden');

    const currentXP = employee.experiencePoints || 0;
    const levelInfo = calculateLevel(currentXP);
    const xpProgress = ((currentXP - levelInfo.currentLevelXP) / (levelInfo.xpForNextLevel - levelInfo.currentLevelXP)) * 100;

    // A. Hồ sơ năng lực
    document.getElementById('employee-name').textContent = employee.name;
    document.getElementById('employee-role').textContent = allRoles[employee.roleId]?.name || 'Chưa có chức vụ';
    document.querySelector('#employee-detail-view .level-badge').textContent = `Lv.${levelInfo.level}`;
    document.querySelector('#employee-detail-view .xp-bar').style.width = `${xpProgress}%`;
    document.querySelector('#employee-detail-view .text-xs.text-right').textContent = `${currentXP.toLocaleString()} / ${levelInfo.xpForNextLevel.toLocaleString()} XP để lên cấp`;

    // B. Phân tích Điểm kinh nghiệm (Placeholder for charts)
    // Gọi hàm để vẽ biểu đồ radar
    drawSkillRadarChart(employeeId);
    document.getElementById('xp-composition-chart-container').innerHTML = `<p class="text-center text-gray-400 text-xs pt-4">Biểu đồ cột chồng cho ${employee.name} sẽ được hiển thị ở đây.</p>`;

    // C. Hiệu suất làm việc (Dữ liệu giả lập)
    const performanceStatsContainer = document.querySelector('#employee-detail-view .p-4.border.rounded-lg .grid');
    performanceStatsContainer.innerHTML = `
        <div><span class="font-medium">Hoàn thành (Ngày):</span> <span class="font-bold text-green-600">${Math.floor(Math.random() * 11) + 90}%</span></div>
        <div><span class="font-medium">Hoàn thành (Tháng):</span> <span class="font-bold text-green-600">${Math.floor(Math.random() * 11) + 88}%</span></div>
        <div><span class="font-medium">Task trễ hạn:</span> <span class="font-bold text-red-600">${Math.floor(Math.random() * 5)}</span></div>
        <div><span class="font-medium">Task hoàn thành sớm:</span> <span class="font-bold text-blue-600">${Math.floor(Math.random() * 20)}</span></div>
        <div class="col-span-2"><span class="font-medium">Xu hướng (vs Tuần trước):</span> <i class="fas fa-arrow-up text-green-500"></i> <span class="font-bold text-green-600">Cải thiện</span></div>
    `;

    // D. Trung tâm Đào tạo & Đề xuất (Dữ liệu giả lập)
    const recommendationContainer = document.querySelector('#employee-detail-view .bg-indigo-50 .text-sm.space-y-3');
    recommendationContainer.innerHTML = `
        <div>
            <p><strong><i class="fas fa-thumbs-up text-green-600"></i> Ưu điểm:</strong> Khả năng xử lý POS xuất sắc, tích cực hỗ trợ đồng đội.</p>
            <p><strong><i class="fas fa-thumbs-down text-red-600"></i> Khuyết điểm:</strong> Cần cải thiện tốc độ xử lý công việc kho.</p>
        </div>
        <div class="border-t border-indigo-200 pt-3">
            <p class="font-semibold">Đề xuất Đào tạo:</p>
            <p>Tham gia khóa: "Tối ưu hóa quy trình quản lý kho" và "Kỹ năng bán hàng nâng cao".</p>
        </div>
    `;
}

/**
 * Dọn dẹp các event listener khi rời khỏi trang.
 */
export function cleanup() {
    if (domController) {
        domController.abort();
        domController = null;
    }
}

/**
 * Khởi tạo trang báo cáo.
 */
export async function init() {
    domController = new AbortController();

    // Lấy các element chính
    leaderboardList = document.getElementById('leaderboard-list');
    initialPrompt = document.getElementById('initial-prompt');
    employeeDetailView = document.getElementById('employee-detail-view');

    // Bắt đầu chuỗi xử lý
    const employees = await fetchPerformanceData();
    renderLeaderboard(employees);

    // Tự động chọn nhân viên đầu tiên để hiển thị chi tiết
    if (employees.length > 0) {
        displayEmployeeDetails(employees[0].id);
        const firstEmployeeCard = leaderboardList.querySelector(`[data-employee-id="${employees[0].id}"]`);
        if(firstEmployeeCard) {
            firstEmployeeCard.classList.add('bg-indigo-100');
        }
    }
}