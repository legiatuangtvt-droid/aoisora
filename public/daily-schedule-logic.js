import { db } from './firebase.js';
import { collection, onSnapshot, query, where, getDocs, doc, getDoc, runTransaction, increment } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { renderScheduleGrid, renderWeekControls, createStoreFilter, showLoadingSpinner, triggerCompletionEffects, setIsInitialLoad, startAttentionAnimationInterval } from './daily-schedule-ui.js';
import { formatDate, getMonday, timeToMinutes } from './utils.js';

export let viewStartDate = new Date(); // Ngày đầu tiên của tuần đang xem (Thứ 2)

// Biến toàn cục để lưu trữ dữ liệu
export let allEmployees = [];
export let allStores = [];
export let allAreas = [];
export let allRegions = [];
export let allTaskGroups = {};
export let dailyTemplate = null; // Biến để lưu mẫu lịch trình ngày
export let allWorkPositions = []; // Biến để lưu vị trí làm việc
export let currentScheduleData = []; // Lịch làm việc cho ngày đang chọn
export let allShiftCodes = []; // Biến để lưu danh sách mã ca

//#region DATA_FETCHING
/**
 * Tải tất cả dữ liệu nền cần thiết một lần.
 */
export async function fetchInitialData() {
    try {
        const shiftCodesDocRef = doc(db, 'system_configurations', 'shift_codes');
        const workPositionsQuery = query(collection(db, 'work_positions'), where('status', '==', 'ACTIVE'));
        const [
            shiftCodesSnap,
            workPositionsSnap, employeesSnap, storesSnap, areasSnap, regionsSnap, taskGroupsSnap, templateSnap
        ] = await Promise.all([
            getDoc(shiftCodesDocRef),
            getDocs(workPositionsQuery),
            getDocs(collection(db, 'employee')),
            getDocs(collection(db, 'stores')),
            getDocs(collection(db, 'areas')),
            getDocs(collection(db, 'regions')),
            getDocs(collection(db, 'task_groups')),
            getDocs(query(collection(db, 'daily_templates'), where('name', '==', 'Test'))), // Tải mẫu "Test"
        ]);

        // Xử lý mã ca
        if (shiftCodesSnap.exists()) {
            allShiftCodes = shiftCodesSnap.data().codes || [];
        }

        // Xử lý vị trí làm việc
        allWorkPositions = workPositionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        let fetchedEmployees = employeesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        allStores = storesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        allAreas = areasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        allRegions = regionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        taskGroupsSnap.docs.forEach(doc => {
            allTaskGroups[doc.id] = { id: doc.id, ...doc.data() };
        });
        // Lưu mẫu đã tải
        if (!templateSnap.empty) {
            dailyTemplate = templateSnap.docs[0].data();
        }

        // Lọc nhân viên dựa trên vai trò của người dùng hiện tại
        const currentUser = window.currentUser;
        if (currentUser) {
            switch (currentUser.roleId) {
                case 'STAFF': // Fall-through to STORE_LEADER logic
                case 'STORE_LEADER':
                    fetchedEmployees = fetchedEmployees.filter(emp => emp.storeId === currentUser.storeId);
                    break;
                case 'AREA_MANAGER':
                    if (currentUser.managedAreaIds && currentUser.managedAreaIds.length > 0) {
                        const managedStoreIds = allStores.filter(s => currentUser.managedAreaIds.includes(s.areaId)).map(s => s.id);
                        fetchedEmployees = fetchedEmployees.filter(emp => managedStoreIds.includes(emp.storeId));
                    }
                    break;
                case 'REGIONAL_MANAGER':
                    if (currentUser.managedRegionId) {
                        const managedAreaIds = allAreas.filter(a => a.regionId === currentUser.managedRegionId).map(a => a.id);
                        const managedStoreIds = allStores.filter(s => managedAreaIds.includes(s.areaId)).map(s => s.id);
                        fetchedEmployees = fetchedEmployees.filter(emp => managedStoreIds.includes(emp.storeId));
                    }
                    break;
            }
        }
        allEmployees = fetchedEmployees;
    } catch (error) {
        console.error("Lỗi nghiêm trọng khi tải dữ liệu nền:", error);
        showToast("Không thể tải dữ liệu nền. Vui lòng thử lại.", "error");
    }
}

/**
 * Lắng nghe thay đổi lịch làm việc cho một ngày cụ thể.
 * @param {string} dateString - Ngày cần lấy dữ liệu (YYYY-MM-DD).
 */
export function listenForScheduleChanges(dateString) {    
    showLoadingSpinner(); // Hiển thị spinner khi bắt đầu tải
    if (window.currentScheduleUnsubscribe) { // Hủy listener cũ trước khi tạo listener mới
        window.currentScheduleUnsubscribe();
        window.currentScheduleUnsubscribe = null;
    }

    const storeFilter = document.getElementById('store-filter');
    const selectedStoreId = storeFilter ? storeFilter.value : 'all';

    if (!selectedStoreId || selectedStoreId === 'all' || !dateString) {
        currentScheduleData = [];
        renderScheduleGrid();
        return;
    }
    // --- LOGIC MỚI: Tải dữ liệu thật từ collection 'schedules' ---
    const scheduleQuery = query(
        collection(db, 'schedules'),
        where('date', '==', dateString),
        where('storeId', '==', selectedStoreId)
    );

    // Sử dụng onSnapshot để lắng nghe thay đổi theo thời gian thực
    window.currentScheduleUnsubscribe = onSnapshot(scheduleQuery, (querySnapshot) => {
        const schedules = [];
        querySnapshot.forEach((doc) => {
            const scheduleData = doc.data();
            const employeeInfo = allEmployees.find(emp => emp.id === scheduleData.employeeId);

            if (employeeInfo) {
                schedules.push({
                    id: doc.id, // Lưu lại ID của document schedule
                    ...scheduleData,
                    name: employeeInfo.name,
                    role: employeeInfo.roleId,
                    experiencePoints: employeeInfo.experiencePoints || 0 // Lấy điểm kinh nghiệm tích lũy
                });
            }
        });
        currentScheduleData = schedules;

        // --- LOGIC SẮP XẾP MỚI ---
        if (dailyTemplate && dailyTemplate.shiftMappings) {
            currentScheduleData.sort((a, b) => {
                // Helper function to get start time string (e.g., "06:00")
                const getStartTime = (shiftCode) => {
                    const shiftInfo = allShiftCodes.find(sc => sc.shiftCode === shiftCode);
                    return shiftInfo ? shiftInfo.timeRange.split('~')[0].trim() : '99:99'; // Default to a late time if not found
                };

                const startTimeA = getStartTime(a.shift);
                const startTimeB = getStartTime(b.shift);

                // 1. Sắp xếp theo giờ bắt đầu ca
                if (startTimeA !== startTimeB) {
                    return startTimeA.localeCompare(startTimeB);
                }

                // 2. Nếu cùng giờ bắt đầu, ưu tiên "LEADER"
                if (a.positionId === 'LEADER') return -1;
                if (b.positionId === 'LEADER') return 1;

                // 3. Nếu không phải LEADER, sắp xếp theo thứ tự trong template
                const orderA = Object.keys(dailyTemplate.shiftMappings).findIndex(key => dailyTemplate.shiftMappings[key].positionId === a.positionId);
                const orderB = Object.keys(dailyTemplate.shiftMappings).findIndex(key => dailyTemplate.shiftMappings[key].positionId === b.positionId);
                return orderA - orderB;
            });
        }
        // Khởi động interval animation sau khi render lần đầu tiên
        if (window.isFirstLoad) {
            startAttentionAnimationInterval(() => currentScheduleData);
            window.isFirstLoad = false; // Đặt lại cờ
        }

        renderScheduleGrid();
    }, (error) => {
        console.error("Lỗi khi lắng nghe thay đổi lịch làm việc: ", error);
        window.showToast("Không thể tải lịch làm việc.", "error");
    });
}
//#endregion

//#region INTERACTIONS
/**
 * Chuyển sang tuần khác.
 * @param {number} direction - 1 cho tuần tới, -1 cho tuần trước.
 */
export function changeWeek(direction) {
    // Tìm vị trí (index) của ngày đang được chọn trong tuần (0=T2, 1=T3,...)
    const dayButtons = Array.from(document.querySelectorAll('.day-selector-btn'));
    const activeDayButton = document.querySelector('.day-selector-btn.active');
    let selectedDayIndex = 0; // Mặc định là Thứ 2 nếu không tìm thấy
    if (activeDayButton) {
        selectedDayIndex = dayButtons.indexOf(activeDayButton);
        if (selectedDayIndex === -1) selectedDayIndex = 0; // Fallback
    }

    viewStartDate.setDate(viewStartDate.getDate() + (direction * 7));
    const selectedDateString = activeDayButton ? activeDayButton.dataset.date : null;
    renderWeekControls(selectedDateString); // Truyền ngày đang active vào
    // Tự động chọn ngày tương ứng ở tuần mới và tải lịch
    const newDayToSelect = document.querySelectorAll('.day-selector-btn')[selectedDayIndex];
    if (newDayToSelect) {
        changeDay(newDayToSelect.dataset.date);
    }
}

/**
 * Chuyển sang ngày khác trong tuần.
 * @param {string} dateString - Ngày được chọn (YYYY-MM-DD).
 */
export function changeDay(dateString) {
    setIsInitialLoad(true); // Reset cờ khi người dùng chủ động chuyển ngày
    const todayString = formatDate(new Date());

    document.querySelectorAll('.day-selector-btn').forEach(btn => {
        const btnDate = btn.dataset.date;
        const isToday = btnDate === todayString;
        const isActive = btnDate === dateString;

        // 1. Reset tất cả các style cũ
        btn.classList.remove('bg-indigo-600', 'text-white', 'hover:bg-indigo-700', 'border-b-2', 'border-indigo-500', 'active');
        btn.classList.add('hover:bg-gray-100');

        // 2. Áp dụng style mới dựa trên trạng thái
        if (isActive) {
            btn.classList.add('active', 'bg-indigo-600', 'text-white', 'hover:bg-indigo-700');
            btn.classList.remove('hover:bg-gray-100');
        } else if (isToday) {
            btn.classList.add('border-b-2', 'border-indigo-500');
        }
    });
    // Tải lịch cho ngày mới
    listenForScheduleChanges(dateString);
}

/**
 * Cập nhật trạng thái của một task và điểm kinh nghiệm của nhân viên trong một transaction.
 * @param {string} scheduleId ID của document schedule.
 * @param {number} taskIndex Index của task trong mảng tasks.
 * @param {string} completingUserId ID của người dùng thực hiện hành động.
 * @param {boolean} newIsComplete Trạng thái hoàn thành mới (true/false).
 * @param {number} pointsChange Số điểm thay đổi.
 */
export async function updateTaskStatus(scheduleId, taskIndex, completingUserId, newIsComplete, pointsChange) {
    const scheduleRef = doc(db, "schedules", scheduleId);

    await runTransaction(db, async (transaction) => {
        const scheduleDoc = await transaction.get(scheduleRef);
        if (!scheduleDoc.exists()) {
            throw "Lịch làm việc không tồn tại!";
        }

        const scheduleData = scheduleDoc.data();
        const tasks = scheduleData.tasks || [];
        const targetTask = tasks[taskIndex];

        if (!targetTask) {
            throw "Công việc không tồn tại!";
        }

        // Chỉ thực hiện cập nhật nếu trạng thái thay đổi
        const currentIsComplete = targetTask.isComplete === 1;
        if (currentIsComplete === newIsComplete) {
            return;
        }

        // Lưu lại số điểm đã thưởng vào task để có thể trừ lại chính xác
        if (newIsComplete) {
            // Khi hoàn thành, lưu lại ID người xác nhận và số điểm
            targetTask.completingUserId = completingUserId;
            targetTask.awardedPoints = pointsChange;
        } else {
            // Khi hủy, xóa các trường đã lưu
            delete targetTask.completingUserId;
            delete targetTask.awardedPoints;
        }

        // Cập nhật trạng thái task
        targetTask.isComplete = newIsComplete ? 1 : 0;

        // 1. Cập nhật lại mảng tasks trong document schedule
        transaction.update(scheduleRef, { tasks: tasks });

        // 2. Cập nhật điểm kinh nghiệm cho người dùng đã thực hiện hành động
        const userToUpdateId = newIsComplete ? completingUserId : (targetTask.completingUserId || completingUserId);
        if (!userToUpdateId) return;

        const employeeRef = doc(db, "employee", userToUpdateId);
        transaction.update(employeeRef, {
            experiencePoints: increment(pointsChange)
        });
    });
}

export function setViewStartDate(date) {
    viewStartDate = date;
}
//#endregion