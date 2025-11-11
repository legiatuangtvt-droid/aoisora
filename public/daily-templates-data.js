import { db } from './firebase.js';
import { collection, getDocs, query, orderBy, doc, getDoc, where } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

export let allTemplates = [];
export let currentTemplateId = null;
export let currentMonthlyPlan = null;
export let originalTemplateData = null;

export let allPersonnel = [];
export let allWorkPositions = [];
export let allShiftCodes = [];
export let allTaskGroups = {};

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
            shiftCodesSnap, taskGroupsSnapshot, workPositionsSnap, employeesSnap, areaManagersSnap, regionalManagersSnap
        ] = await Promise.all([
            getDoc(shiftCodesDocRef),
            getDocs(taskGroupsQuery),
            getDocs(workPositionsQuery),
            getDocs(collection(db, 'employee')),
            getDocs(collection(db, 'area_managers')),
            getDocs(collection(db, 'regional_managers')),
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

        if (currentUser && (currentUser.roleId === 'HQ_STAFF' || currentUser.roleId === 'ADMIN')) {
            optionsHtml = `<option value="new">-- Tạo Mẫu Mới --</option>`;
        } else {
            if (allTemplates.length > 0) {
                optionsHtml = ``;
            } else {
                optionsHtml = `<option value="">-- Chưa có mẫu --</option>`;
            }
        }
        optionsHtml += allTemplates.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
        templateSelector.innerHTML = optionsHtml;

    } catch (error) {
        console.error("Lỗi khi tải danh sách mẫu:", error);
        templateSelector.innerHTML = `<option value="">-- Lỗi tải mẫu --</option>`;
    }
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

export function setCurrentTemplateId(id) {
    currentTemplateId = id;
}

export function setCurrentMonthlyPlan(plan) {
    currentMonthlyPlan = plan;
}

export function setOriginalTemplateData(data) {
    originalTemplateData = data;
}