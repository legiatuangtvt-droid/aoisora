import { db } from './firebase.js';
import { collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let domController = null;
let allEmployees = [];
let allStores = {};
let allRoles = {};
let allTaskGroups = {};
let skillRadarChartInstance = null; // Instance biểu đồ radar
let xpCompositionChartInstance = null; // Instance biểu đồ cột chồng
let storeContributionChartInstance = null; // Instance biểu đồ tròn của cửa hàng

// DOM Elements
let leaderboardListEmployee, leaderboardListStore, initialPrompt, employeeDetailView, storeDetailView;

// Dữ liệu mô phỏng cố định cho chi tiết nhân viên
const mockEmployeeDetailsData = {
    // Dữ liệu mặc định nếu không tìm thấy ID nhân viên
    default: {
        dailyProgress: 85,
        skills: [75, 80, 70, 85, 60, 90],
        performance: { dailyCompletion: 95, monthlyCompletion: 92, lateTasks: 3, earlyTasks: 10, trend: 'stable' },
        strengths: "Hoàn thành tốt các công việc được giao.",
        weaknesses: "Cần chủ động hơn trong việc học hỏi kỹ năng mới.",
        recommendations: "Tham gia các buổi training nội bộ."
    },
    // Dữ liệu cho các nhân viên cụ thể (ID sẽ được thay bằng ID thật từ Firestore)
    // Ví dụ: '2qWAw22a25aQ1b2b3c4d': { ... }
};

/**
 * Lấy dữ liệu chi tiết mô phỏng cho một nhân viên.
 * @param {string} employeeId - ID của nhân viên.
 * @returns {object} - Dữ liệu chi tiết mô phỏng.
 */
function getMockDetails(employeeId) {
    // Tạo dữ liệu giả ổn định dựa trên ID nhân viên để không bị ngẫu nhiên
    if (!mockEmployeeDetailsData[employeeId]) {
        const idHash = employeeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        mockEmployeeDetailsData[employeeId] = {
            dailyProgress: 70 + (idHash % 31), // 70-100
            skills: Array.from({length: 6}, (_, i) => 40 + ((idHash + i*5) % 61)), // 40-100
            performance: {
                dailyCompletion: 90 + (idHash % 11), // 90-100
                monthlyCompletion: 88 + (idHash % 13), // 88-100
                lateTasks: idHash % 5, // 0-4
                earlyTasks: 5 + (idHash % 15), // 5-19
            },
            xpComposition: {
                task: Array.from({length: 7}, (_, i) => 10 + ((idHash + i*2) % 21)), // 10-30
                ontime: Array.from({length: 7}, (_, i) => 5 + ((idHash + i*3) % 6)),  // 5-10
                support: Array.from({length: 7}, (_, i) => 0 + ((idHash + i*5) % 16)), // 0-15
                bonus: Array.from({length: 7}, (_, i) => (idHash + i) % 7 === 0 ? 20 : 0), // 0 or 20
            }
        };
    }
    return mockEmployeeDetailsData[employeeId] || mockEmployeeDetailsData.default;
}

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
        const [employeesSnap, rolesSnap, taskGroupsSnap, storesSnap] = await Promise.all([
            getDocs(collection(db, 'employee')),
            getDocs(collection(db, 'roles')),
            getDocs(collection(db, 'task_groups')),
            getDocs(collection(db, 'stores'))
        ]);

        storesSnap.forEach(doc => allStores[doc.id] = doc.data());
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
 * Điền các tùy chọn vào bộ lọc cửa hàng.
 */
function populateStoreFilter() {
    const storeFilter = document.getElementById('store-filter');
    if (!storeFilter) return;

    const sortedStores = Object.values(allStores).sort((a, b) => a.name.localeCompare(b.name));

    sortedStores.forEach(store => {
        const option = document.createElement('option');
        option.value = store.id;
        option.textContent = store.name;
        storeFilter.appendChild(option);
    });
}

/**
 * Tính toán tổng điểm XP cho mỗi cửa hàng.
 * @returns {Array} - Mảng các đối tượng cửa hàng với tổng XP.
 */
function aggregateStoreXP() {
    const storeXP = {};

    // Khởi tạo điểm cho tất cả cửa hàng là 0
    for (const storeId in allStores) {
        storeXP[storeId] = {
            ...allStores[storeId],
            id: storeId, // Thêm dòng này để đảm bảo ID được gán vào đối tượng
            totalXP: 0,
            employeeCount: 0
        };
    }

    // Cộng dồn XP từ mỗi nhân viên
    allEmployees.forEach(employee => {
        if (employee.storeId && storeXP[employee.storeId]) {
            storeXP[employee.storeId].totalXP += (employee.experiencePoints || 0);
            storeXP[employee.storeId].employeeCount++;
        }
    });

    const result = Object.values(storeXP).sort((a, b) => b.totalXP - a.totalXP);
    // Chuyển object thành mảng và sắp xếp theo totalXP giảm dần
    return result;
}

/**
 * Hiển thị danh sách cửa hàng lên bảng xếp hạng.
 * @param {Array} stores - Danh sách cửa hàng đã được tính tổng XP.
 */
function renderStoreLeaderboard(stores) {
    leaderboardListStore.innerHTML = '';
    stores.forEach((store, index) => {
        const storeCard = document.createElement('div');
        // Thêm cursor-pointer và các lớp hover để cho biết nó có thể được nhấp
        storeCard.className = 'p-3 rounded-lg border flex items-center justify-between cursor-pointer hover:bg-indigo-50 transition-colors';
        storeCard.dataset.storeId = store.id;
        storeCard.innerHTML = `
            <div class="font-semibold text-sm">${index + 1}. ${store.name}</div>
            <div class="font-bold text-indigo-600">${store.totalXP.toLocaleString()} XP</div>`;
        
        // Gắn listener để xử lý khi nhấp vào một cửa hàng
        storeCard.addEventListener('click', () => {
            displayStoreDetails(store.id);
        });

        leaderboardListStore.appendChild(storeCard);
    });
}

/**
 * Áp dụng các bộ lọc hiện tại và render lại bảng xếp hạng.
 */
function applyFiltersAndRender() {
    const storeFilterValue = document.getElementById('store-filter').value;
    const searchInputValue = document.getElementById('employee-search-input').value.toLowerCase();

    let filteredEmployees = allEmployees;

    // Lọc theo cửa hàng
    if (storeFilterValue !== 'all') {
        filteredEmployees = filteredEmployees.filter(emp => emp.storeId === storeFilterValue);
    }

    // Lọc theo tên nhân viên
    if (searchInputValue) {
        filteredEmployees = filteredEmployees.filter(emp => emp.name.toLowerCase().includes(searchInputValue));
    }

    renderLeaderboard(filteredEmployees);

    // Sau khi render, nếu có nhân viên trong danh sách đã lọc, hiển thị chi tiết người đầu tiên.
    // Nếu không, hiển thị lại thông báo ban đầu.
    if (filteredEmployees.length > 0) {
        displayEmployeeDetails(filteredEmployees[0].id);
    } else {
        initialPrompt.classList.remove('hidden');
        employeeDetailView.classList.add('hidden');
    }
}

/**
 * Hiển thị danh sách nhân viên lên bảng xếp hạng.
 * @param {Array} employees - Danh sách nhân viên.
 */
function renderLeaderboard(employees) {
    leaderboardListEmployee.innerHTML = ''; // Xóa placeholder
    if (employees.length === 0) {
        leaderboardListEmployee.innerHTML = `<p class="p-4 text-gray-500">Không có dữ liệu nhân viên.</p>`;
        return;
    }

    employees.forEach((employee, index) => {
        const levelInfo = calculateLevel(employee.experiencePoints || 0);
        const mockData = getMockDetails(employee.id);

        let rankContent = `<span class="rank-number">${index + 1}</span>`;
        let rankClasses = '';

        // Thêm icon vương miện và class đặc biệt cho top 3
        if (index === 0) {
            rankContent = '<i class="fas fa-crown text-yellow-500"></i>';
            rankClasses = 'bg-yellow-50 border-yellow-400';
        } else if (index === 1) {
            rankContent = '<i class="fas fa-crown text-gray-400"></i>';
            rankClasses = 'bg-gray-50 border-gray-300';
        } else if (index === 2) {
            rankContent = '<i class="fas fa-crown text-orange-400"></i>';
            rankClasses = 'bg-orange-50 border-orange-300';
        }

        const employeeCard = document.createElement('div');
        employeeCard.className = `p-3 rounded-lg hover:bg-indigo-50 cursor-pointer border hover:border-indigo-300 transition-all flex items-center gap-3 ${rankClasses}`;
        employeeCard.dataset.employeeId = employee.id;

        employeeCard.innerHTML = `
            <div class="rank-indicator">${rankContent}</div>
            <div class="flex-1">
                <div class="flex items-center gap-3">
                <div class="relative">
                    <img src="https://placehold.co/48x48/E2E8F0/4A5568?text=${employee.name.charAt(0)}" class="w-12 h-12 rounded-full">
                    <span class="level-badge absolute -bottom-1 -right-1">Lv.${levelInfo.level}</span>
                </div>
                <div class="flex-1">
                    <p class="font-bold text-sm">${employee.name}</p>
                    <div class="mt-2 h-1.5 w-full bg-gray-200 rounded-full" title="Tiến độ công việc hôm nay">
                        <div class="bg-green-500 h-1.5 rounded-full" style="width: ${mockData.dailyProgress}%"></div>
                    </div>
                </div>
                <span class="font-bold text-indigo-600">${(employee.experiencePoints || 0).toLocaleString()} XP</span>
            </div>
        `;

        employeeCard.addEventListener('click', () => {
            displayEmployeeDetails(employee.id);
            // Highlight a selection
            document.querySelectorAll('#leaderboard-list-employee > div').forEach(child => child.classList.remove('bg-indigo-100'));
            employeeCard.classList.add('bg-indigo-100');
        });

        leaderboardListEmployee.appendChild(employeeCard);
    });
}

/**
 * Mô phỏng việc lấy dữ liệu kỹ năng cho một nhân viên.
 * @param {string} employeeId - ID của nhân viên.
 * @returns {Promise<object>} - Dữ liệu cho biểu đồ radar.
 */
async function getSkillDataForEmployee(employeeId) {
    // Giả lập: Các nhóm kỹ năng chính
    const skillLabels = ['POS', 'Leader', 'Ngành hàng', 'MMD', 'Aeon Cafe', 'QC-FSH'];

    // Lấy dữ liệu kỹ năng cố định từ mock data
    const mockData = getMockDetails(employeeId);

    return {
        labels: skillLabels,
        datasets: [{
            label: 'Điểm Kỹ năng',
            data: mockData.skills,
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
    const mockData = getMockDetails(employeeId);

    // A. Hồ sơ năng lực
    document.getElementById('employee-name').textContent = employee.name;
    document.getElementById('employee-role').textContent = allRoles[employee.roleId]?.name || 'Chưa có chức vụ';
    document.querySelector('#employee-detail-view .level-badge').textContent = `Lv.${levelInfo.level}`;
    document.querySelector('#employee-detail-view .xp-bar').style.width = `${xpProgress}%`;
    document.querySelector('#employee-detail-view .text-xs.text-right').textContent = `${currentXP.toLocaleString()} / ${levelInfo.xpForNextLevel.toLocaleString()} XP để lên cấp`;

    // B. Phân tích Điểm kinh nghiệm (Placeholder for charts)
    drawSkillRadarChart(employeeId);
    drawXpCompositionChart(employeeId);

    // C. Hiệu suất làm việc (Dữ liệu giả lập)
    const performanceStatsContainer = document.querySelector('#employee-detail-view .p-4.border.rounded-lg .grid');
    const trendIcon = mockData.performance.trend === 'improve' ? 'fa-arrow-up text-green-500' : 'fa-arrow-down text-red-500';
    const trendText = mockData.performance.trend === 'improve' ? 'Cải thiện' : 'Giảm sút';
    performanceStatsContainer.innerHTML = `
        <div><span class="font-medium">Hoàn thành (Ngày):</span> <span class="font-bold text-green-600">${mockData.performance.dailyCompletion}%</span></div>
        <div><span class="font-medium">Hoàn thành (Tháng):</span> <span class="font-bold text-green-600">${mockData.performance.monthlyCompletion}%</span></div>
        <div><span class="font-medium">Task trễ hạn:</span> <span class="font-bold text-red-600">${mockData.performance.lateTasks}</span></div>
        <div><span class="font-medium">Task hoàn thành sớm:</span> <span class="font-bold text-blue-600">${mockData.performance.earlyTasks}</span></div>
        <div class="col-span-2"><span class="font-medium">Xu hướng (vs Tuần trước):</span> <i class="fas ${trendIcon}"></i> <span class="font-bold text-green-600">${trendText}</span></div>
    `;

    // D. Trung tâm Đào tạo & Đề xuất (Dữ liệu giả lập)
    const recommendationContainer = document.querySelector('#employee-detail-view .bg-indigo-50 .text-sm.space-y-3');
    recommendationContainer.innerHTML = `
        <div>
            <p><strong><i class="fas fa-thumbs-up text-green-600"></i> Ưu điểm:</strong> ${mockData.strengths || 'Nhanh nhẹn, hoạt bát.'}</p>
            <p><strong><i class="fas fa-thumbs-down text-red-600"></i> Khuyết điểm:</strong> ${mockData.weaknesses || 'Cần cải thiện kỹ năng báo cáo.'}</p>
        </div>
        <div class="border-t border-indigo-200 pt-3">
            <p class="font-semibold">Đề xuất Đào tạo:</p>
            <p>${mockData.recommendations || 'Tham gia khóa "Kỹ năng báo cáo cơ bản".'}</p>
        </div>
    `;
}

/**
 * Vẽ biểu đồ cột chồng thể hiện cấu trúc điểm thưởng.
 * @param {string} employeeId - ID của nhân viên.
 */
async function drawXpCompositionChart(employeeId) {
    const mockData = getMockDetails(employeeId);
    const ctx = document.getElementById('xp-composition-chart-canvas')?.getContext('2d');
    if (!ctx) return;

    if (xpCompositionChartInstance) {
        xpCompositionChartInstance.destroy();
    }

    const labels = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return `${d.getDate()}/${d.getMonth() + 1}`;
    });

    xpCompositionChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Hoàn thành Task',
                    data: mockData.xpComposition.task,
                    backgroundColor: '#4f46e5', // Indigo-600
                },
                {
                    label: 'Đúng giờ',
                    data: mockData.xpComposition.ontime,
                    backgroundColor: '#34d399', // Emerald-400
                },
                {
                    label: 'Hỗ trợ',
                    data: mockData.xpComposition.support,
                    backgroundColor: '#fbbf24', // Amber-400
                },
                {
                    label: 'Bonus',
                    data: mockData.xpComposition.bonus,
                    backgroundColor: '#f87171', // Red-400
                }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } },
                tooltip: { mode: 'index', intersect: false }
            },
            scales: {
                x: { stacked: true, grid: { display: false } },
                y: { stacked: true, beginAtZero: true }
            }
        }
    });
}

/**
 * Hiển thị chi tiết thông tin của một cửa hàng được chọn.
 * @param {string} storeId - ID của cửa hàng.
 */
function displayStoreDetails(storeId) {
    const store = allStores[storeId];
    if (!store) {
        return;
    }

    // Ẩn các view khác và hiển thị view chi tiết cửa hàng
    initialPrompt.classList.add('hidden');
    employeeDetailView.classList.add('hidden');
    storeDetailView.classList.remove('hidden');

    // Highlight mục được chọn trong danh sách
    document.querySelectorAll('#leaderboard-list-store > div').forEach(child => {
        child.classList.remove('bg-indigo-100', 'border-indigo-400');
        if (child.dataset.storeId === storeId) {
            child.classList.add('bg-indigo-100', 'border-indigo-400');
        }
    });

    // Cập nhật thông tin cơ bản của cửa hàng
    const totalXP = allEmployees
        .filter(e => e.storeId === storeId)
        .reduce((sum, e) => sum + (e.experiencePoints || 0), 0);

    document.getElementById('store-detail-name').textContent = store.name;
    document.getElementById('store-detail-xp').querySelector('span').textContent = `${totalXP.toLocaleString()} XP`;

    // Lấy và hiển thị danh sách nhân viên của cửa hàng
    const storeEmployees = allEmployees
        .filter(e => e.storeId === storeId)
        .sort((a, b) => (b.experiencePoints || 0) - (a.experiencePoints || 0));

    const employeeListContainer = document.getElementById('store-employee-list-container');
    employeeListContainer.innerHTML = '<h4 class="font-semibold mb-2">Xếp hạng nhân viên trong cửa hàng</h4>';
    if (storeEmployees.length > 0) {
        storeEmployees.forEach((emp, index) => {
            const empDiv = document.createElement('div');
            empDiv.className = 'flex justify-between items-center text-sm p-2 rounded-md ' + (index % 2 === 0 ? 'bg-gray-50' : '');
            empDiv.innerHTML = `
                <span class="font-medium">${index + 1}. ${emp.name}</span>
                <span class="font-semibold text-indigo-600">${(emp.experiencePoints || 0).toLocaleString()} XP</span>
            `;
            employeeListContainer.appendChild(empDiv);
        });
    } else {
        employeeListContainer.innerHTML += '<p class="text-gray-500 text-sm">Chưa có dữ liệu nhân viên.</p>';
    }

    // Vẽ biểu đồ đóng góp
    drawStoreContributionChart(storeEmployees, totalXP);
}

/**
 * Vẽ biểu đồ tròn thể hiện sự đóng góp XP của nhân viên trong cửa hàng.
 * @param {Array} storeEmployees - Danh sách nhân viên của cửa hàng.
 * @param {number} totalXP - Tổng XP của cửa hàng.
 */
function drawStoreContributionChart(storeEmployees, totalXP) {
    const container = document.getElementById('store-contribution-chart-container');
    container.innerHTML = '<h4 class="font-semibold mb-2">Tỷ lệ đóng góp XP</h4><canvas id="store-contribution-canvas"></canvas>';
    const ctx = document.getElementById('store-contribution-canvas')?.getContext('2d');
    if (!ctx) return;

    if (storeContributionChartInstance) {
        storeContributionChartInstance.destroy();
    }

    const topN = 5;
    const topEmployees = storeEmployees.slice(0, topN);
    const topXP = topEmployees.reduce((sum, e) => sum + (e.experiencePoints || 0), 0);
    const otherXP = totalXP - topXP;

    const labels = topEmployees.map(e => e.name);
    const data = topEmployees.map(e => e.experiencePoints || 0);

    if (otherXP > 0) {
        labels.push('Nhân viên khác');
        data.push(otherXP);
    }

    storeContributionChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: { labels, datasets: [{ data, backgroundColor: ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'] }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { padding: 15, boxWidth: 12 } } } }
    });
}

/**
 * Dọn dẹp các event listener khi rời khỏi trang.
 */
export function cleanup() {
    if (domController) {
        domController.abort();
        domController = null;
    }
    if (skillRadarChartInstance) skillRadarChartInstance.destroy();
    if (xpCompositionChartInstance) xpCompositionChartInstance.destroy();
    if (storeContributionChartInstance) storeContributionChartInstance.destroy();
}

/**
 * Khởi tạo trang báo cáo.
 */
export async function init() {
    domController = new AbortController();

    // Lấy các element chính
    leaderboardListEmployee = document.getElementById('leaderboard-list-employee');
    leaderboardListStore = document.getElementById('leaderboard-list-store');
    initialPrompt = document.getElementById('initial-prompt');
    employeeDetailView = document.getElementById('employee-detail-view');
    storeDetailView = document.getElementById('store-detail-view');

    // Bắt đầu chuỗi xử lý
    const employees = await fetchPerformanceData();

    // Tính toán và render bảng xếp hạng cửa hàng
    const storesWithXP = aggregateStoreXP();
    renderStoreLeaderboard(storesWithXP);

    // Xử lý chuyển tab
    const employeeTab = document.querySelector('.leaderboard-tab[data-tab="employees"]');
    const storeTab = document.querySelector('.leaderboard-tab[data-tab="stores"]');

    employeeTab.addEventListener('click', () => {
        employeeTab.classList.add('active');
        storeTab.classList.remove('active');
        leaderboardListEmployee.classList.remove('hidden');
        leaderboardListStore.classList.add('hidden');
        storeDetailView.classList.add('hidden'); // Ẩn chi tiết cửa hàng

        // Khi chuyển về tab nhân viên, hiển thị lại chi tiết
        if (allEmployees.length > 0) {
            displayEmployeeDetails(allEmployees[0].id);
        }
    }, { signal: domController.signal });

    storeTab.addEventListener('click', () => {
        storeTab.classList.add('active');
        employeeTab.classList.remove('active');
        leaderboardListStore.classList.remove('hidden');
        leaderboardListEmployee.classList.add('hidden');
        
        // Khi xem BXH cửa hàng, ẩn chi tiết nhân viên và hiện prompt ban đầu
        employeeDetailView.classList.add('hidden');
        initialPrompt.classList.remove('hidden');

        // Bỏ highlight tất cả các mục cửa hàng
        document.querySelectorAll('#leaderboard-list-store > div').forEach(child => {
            child.classList.remove('bg-indigo-100', 'border-indigo-400');
        });
    }, { signal: domController.signal });

    // Render bảng xếp hạng nhân viên
    renderLeaderboard(employees);

    // Tự động chọn nhân viên đầu tiên để hiển thị chi tiết
    if (employees.length > 0) {
        displayEmployeeDetails(employees[0].id);
        const firstEmployeeCard = leaderboardListEmployee.querySelector(`[data-employee-id="${employees[0].id}"]`);
        if(firstEmployeeCard) {
            firstEmployeeCard.classList.add('bg-indigo-100');
        }
    }
}