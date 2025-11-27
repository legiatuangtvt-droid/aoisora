import { db } from './firebase.js';
import { collection, getDocs, query, orderBy, doc, getDoc, where, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

export let allTemplates = [];
export let currentTemplateId = null;
export let currentMonthlyPlan = null;
export let originalTemplateData = null;

export let allPersonnel = [];
export let allWorkPositions = [];
export let allShiftCodes = [];
export let allTaskGroups = {};
export let allRegions = []; // Export biến allRegions

/**
 * Lấy dữ liệu công việc từ Firestore và nhóm chúng lại.
 */
export async function fetchAndGroupTasks() {
    const taskGroupsQuery = query(collection(db, 'task_groups'), orderBy('order'));
    const taskGroupsSnapshot = await getDocs(taskGroupsQuery);

    const groupedTasks = [];
    taskGroupsSnapshot.forEach(doc => {
        const group = { id: doc.id, ...doc.data() };
        groupedTasks.push({
            ...group,
            tasks: group.tasks || []
        });
    });
    return groupedTasks;
}

/**
 * Tải tất cả dữ liệu nền cần thiết một lần.
 */
export async function fetchInitialData() {
    try {
        const shiftCodesDocRef = doc(db, 'system_configurations', 'shift_codes');
        const taskGroupsQuery = query(collection(db, 'task_groups'), orderBy('order'));
        const workPositionsQuery = query(collection(db, 'work_positions'));
        const [
            shiftCodesSnap, taskGroupsSnapshot, workPositionsSnap, employeesSnap, areaManagersSnap, regionalManagersSnap, regionsSnap
        ] = await Promise.all([
            getDoc(shiftCodesDocRef),
            getDocs(taskGroupsQuery),
            getDocs(workPositionsQuery),
            getDocs(collection(db, 'employee')),
            getDocs(collection(db, 'area_managers')),
            getDocs(collection(db, 'regional_managers')),
            getDocs(collection(db, 'regions')), // Tải thêm dữ liệu regions
        ]);

        if (shiftCodesSnap.exists()) {
            allShiftCodes = shiftCodesSnap.data().codes || [];
        }

        taskGroupsSnapshot.forEach(doc => {
            allTaskGroups[doc.id] = { id: doc.id, ...doc.data() };
        });

        allWorkPositions = workPositionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const employees = employeesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const areaManagers = areaManagersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const regionalManagers = regionalManagersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        allPersonnel = [...employees, ...areaManagers, ...regionalManagers];

        // Lưu dữ liệu regions vào biến đã export
        allRegions = regionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu vị trí công việc:", error);
        const container = document.getElementById('template-builder-grid-container');
        if(container) container.innerHTML = `<div class="p-10 text-center text-red-500">Không thể tải dữ liệu vị trí công việc. Vui lòng thử lại.</div>`;
    }
}

/**
 * Tải danh sách các mẫu và render vào dropdown.
 */
export async function fetchAndRenderTemplates() {
    const templateSelector = document.getElementById('template-selector');
    templateSelector.innerHTML = `<option value="">-- Đang tải... --</option>`;

    try {
        const q = query(collection(db, 'daily_templates'), orderBy('name'));
        const snapshot = await getDocs(q);
        allTemplates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const currentUser = window.currentUser;
        let optionsHtml = '';

        // Sửa lỗi: Luôn hiển thị các mẫu có sẵn cho tất cả các vai trò.
        // Chỉ thêm tùy chọn "Tạo Mẫu Mới" cho HQ/Admin.
        if (currentUser && (currentUser.roleId === 'HQ_STAFF' || currentUser.roleId === 'ADMIN')) {
            optionsHtml = `<option value="new">-- Tạo Mẫu Mới --</option>`;
        } 
        optionsHtml += allTemplates.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
        templateSelector.innerHTML = optionsHtml;

    } catch (error) {
        console.error("Lỗi khi tải danh sách mẫu:", error);
        templateSelector.innerHTML = `<option value="">-- Lỗi tải mẫu --</option>`;
    }
}

/**
 * (Dành cho RM/AM) Render danh sách các kế hoạch tháng vào dropdown.
 * @param {Array<object>} plans - Danh sách các kế hoạch tháng của miền.
 */
export async function renderMonthlyPlansForManager(plans) {
    const templateSelector = document.getElementById('template-selector');
    if (!templateSelector) return;

    if (!plans || plans.length === 0) {
        templateSelector.innerHTML = `<option value="">-- Chưa có kế hoạch --</option>`;
        return;
    }

    // Tạo HTML cho các <option>
    const optionsHtml = plans.map(plan => {
        const cycleDate = plan.cycleStartDate.toDate ? plan.cycleStartDate.toDate() : new Date(plan.cycleStartDate);
        const formattedDate = cycleDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
        // Giá trị của option là ID của monthly_plan, text hiển thị là tên mẫu và ngày bắt đầu chu kỳ
        return `<option value="${plan.id}">${plan.templateName} (Cycle: ${formattedDate})</option>`;
    }).join('');

    templateSelector.innerHTML = optionsHtml;
}

/**
 * Tải dữ liệu của một mẫu cụ thể.
 * @param {string} templateId - ID của mẫu cần tải.
 * @returns {Promise<object|null>} Dữ liệu của mẫu hoặc null nếu không tìm thấy.
 */
export async function loadTemplateData(templateId) {
    if (!templateId || templateId === 'new') {
        return null;
    }
    try {
        const templateRef = doc(db, 'daily_templates', templateId);
        const docSnap = await getDoc(templateRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            // Lưu một bản sao sâu để so sánh thay đổi
            originalTemplateData = JSON.parse(JSON.stringify(data));
            return data;
        }
        return null;
    } catch (error) {
        console.error("Lỗi khi tải chi tiết mẫu:", error);
        window.showToast('Không thể tải dữ liệu cho mẫu này.', 'error');
        return null;
    }
}

/**
 * Tạo một mẫu mới trong Firestore và trả về ID của nó.
 * @param {string} name - Tên của mẫu mới.
 * @returns {Promise<string>} ID của mẫu vừa được tạo.
 */
export async function createNewTemplate(name) {
    try {
        const newTemplateData = {
            name: name,
            schedule: {},
            shiftMappings: {},
            totalManhour: 0,
            hourlyManhours: {},
            // Thêm các thông số RE mặc định để chức năng Auto Generate có thể hoạt động
            reParameters: {
                posCount: 1,
                areaSize: 100,
                employeeCount: 5,
                dryGoodsVolume: 10,
                vegetableWeight: 20,
                customerCountByHour: { "06": 10, "07": 20, "08": 30, "09": 40, "10": 50, "11": 60, "12": 50, "13": 40, "14": 30, "15": 30, "16": 40, "17": 50, "18": 70, "19": 80, "20": 60, "21": 40, "22": 20 },
                customerCount: 780
            },
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        const docRef = await addDoc(collection(db, 'daily_templates'), newTemplateData);
        
        // Tải lại danh sách mẫu và tự động chọn mẫu vừa tạo
        await fetchAndRenderTemplates();
        const templateSelector = document.getElementById('template-selector');
        if (templateSelector) {
            templateSelector.value = docRef.id;
        }
        return docRef.id;
    } catch (error) {
        console.error("Lỗi khi tạo mẫu mới:", error);
        throw new Error("Không thể tạo mẫu mới trên cơ sở dữ liệu.");
    }
}

export function setCurrentTemplateId(id) {
    currentTemplateId = id;
}

export function setCurrentMonthlyPlan(plan) {
    currentMonthlyPlan = plan;
}

export function setOriginalTemplateData(data) {
    originalTemplateData = data;
}