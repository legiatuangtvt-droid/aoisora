import { db } from './firebase.js';
import { collection, onSnapshot, query, orderBy, doc, setDoc, deleteDoc, getDocs, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Dữ liệu chức vụ sẽ được lấy từ Firestore
let allStaff = [];
let allRoles = [];
let allStores = [];
let allStaffStatuses = [];
let domController = null;
let activeModal = null;


/**
 * Tải tất cả dữ liệu cần thiết một lần (stores, statuses)
 */
async function fetchInitialData() {
    const storesSnapshot = await getDocs(collection(db, 'stores'));
    allStores = storesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const statusesSnapshot = await getDocs(collection(db, 'staff_statuses'));
    allStaffStatuses = statusesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Lắng nghe các thay đổi từ collection `roles` và render lại.
 */
function listenForRoleChanges() {
    const rolesCollection = collection(db, 'roles');
    const q = query(rolesCollection, orderBy("name"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        allRoles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderManagedRoles(allRoles);
        // Render lại danh sách nhân viên để cập nhật tên chức vụ nếu có thay đổi
        renderStaffList(allStaff);
    }, (error) => {
        console.error("Lỗi khi lắng nghe thay đổi chức vụ:", error);
        showToast("Mất kết nối tới dữ liệu chức vụ.", "error");
    });

    if (domController && !domController.signal.aborted) {
        domController.signal.addEventListener('abort', unsubscribe);
    }
}

/**
 * Lắng nghe các thay đổi từ collection `staff` và render lại.
 */
function listenForStaffChanges() {
    const staffCollection = collection(db, 'staff');
    const q = query(staffCollection, orderBy("name"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        allStaff = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderStaffList(allStaff);
    }, (error) => {
        console.error("Lỗi khi lắng nghe thay đổi nhân viên:", error);
        showToast("Mất kết nối tới dữ liệu nhân viên.", "error");
    });

    if (domController && !domController.signal.aborted) {
        domController.signal.addEventListener('abort', unsubscribe);
    }
}
/**
 * Render danh sách nhân viên ra bảng.
 * @param {Array} staffList - Danh sách nhân viên cần hiển thị.
 */
function renderStaffList(staffList) {
    const listElement = document.getElementById('staff-list');
    if (!listElement) return;

    listElement.innerHTML = ''; // Xóa nội dung cũ

    if (staffList.length === 0) {
        listElement.innerHTML = `<tr><td colspan="7" class="text-center py-10 text-gray-500">Không có nhân viên nào.</td></tr>`;
        return;
    }

    staffList.forEach(staff => {
        const roleInfo = allRoles.find(r => r.id === staff.roleId) || { name: staff.roleId || 'N/A' };
        const storeInfo = allStores.find(s => s.id === staff.storeId) || { name: staff.storeId || 'N/A' };
        const statusInfo = allStaffStatuses.find(s => s.id === staff.status) || { name: staff.status, color: 'gray' };

        const statusColor = statusInfo.color || 'gray';
        const statusBadge = `<span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-${statusColor}-100 text-${statusColor}-800">${statusInfo.name}</span>`;

        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        row.dataset.id = staff.id;
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900">${staff.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">${staff.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500" title="${roleInfo.name}">${staff.roleId}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">${storeInfo.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">${staff.phone}</td>
            <td class="px-6 py-4 whitespace-nowrap  text-center">${statusBadge}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center font-medium space-x-4">
                <button data-id="${staff.id}" class="edit-staff-btn text-indigo-600 hover:text-indigo-900" title="Chỉnh sửa"><i class="fas fa-pencil-alt"></i></button>
                <button data-id="${staff.id}" class="delete-staff-btn text-red-600 hover:text-red-900" title="Xóa"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
        listElement.appendChild(row);
    });
}

/**
 * Mở modal và chuẩn bị form để thêm hoặc sửa nhân viên.
 * @param {string|null} staffId - ID của nhân viên cần sửa, hoặc null để thêm mới.
 */
function openStaffModal(staffId = null) {
    const form = document.getElementById('staff-form');
    const modalTitle = document.getElementById('staff-modal-title');
    const idInput = document.getElementById('staff-id');
    const submitBtn = document.getElementById('staff-form-submit-btn');
    form.reset();

    // Điền dữ liệu cho các dropdown
    const roleSelect = document.getElementById('staff-role');
    const storeSelect = document.getElementById('staff-store');
    const statusSelect = document.getElementById('staff-status');

    roleSelect.innerHTML = allRoles.map(r => `<option value="${r.id}">${r.name}</option>`).join('');
    storeSelect.innerHTML = allStores.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    statusSelect.innerHTML = allStaffStatuses.map(s => `<option value="${s.id}">${s.name}</option>`).join('');

    // Thêm một lựa chọn trống cho cửa hàng và chức vụ
    roleSelect.insertAdjacentHTML('afterbegin', '<option value="">-- Chọn chức vụ --</option>');
    storeSelect.insertAdjacentHTML('afterbegin', '<option value="">-- Chọn cửa hàng --</option>');

    if (staffId) { // Chế độ Sửa
        modalTitle.innerHTML = '<i class="fas fa-user-edit mr-2 text-indigo-500"></i> Chỉnh Sửa Nhân Viên';
        submitBtn.innerHTML = '<i class="fas fa-save mr-1"></i> Cập Nhật';
        idInput.value = staffId;
        idInput.readOnly = true;

        const staff = allStaff.find(s => s.id === staffId);
        if (staff) {
            document.getElementById('staff-name').value = staff.name;
            document.getElementById('staff-phone').value = staff.phone || '';
            roleSelect.value = staff.roleId || '';
            storeSelect.value = staff.storeId || '';
            statusSelect.value = staff.status || 'ACTIVE';
        }
    } else { // Chế độ Thêm
        modalTitle.innerHTML = '<i class="fas fa-user-plus mr-2 text-indigo-500"></i> Thêm Nhân Viên Mới';
        submitBtn.innerHTML = '<i class="fas fa-save mr-1"></i> Lưu';
        idInput.readOnly = false;
        roleSelect.value = "";
        storeSelect.value = "";
        statusSelect.value = "ACTIVE";
    }

    showModal('staff-modal');
}

/**
 * Render danh sách chức vụ trong modal quản lý.
 * @param {Array} roles - Mảng các đối tượng chức vụ.
 */
function renderManagedRoles(roles) {
    const list = document.getElementById('managed-roles-list');
    if (!list) return;
    list.innerHTML = '';

    if (roles.length === 0) {
        list.innerHTML = `<tr><td colspan="3" class="text-center py-4 text-gray-500">Chưa có chức vụ nào.</td></tr>`;
        return;
    }

    // Thêm header cho bảng
    const header = `
        <thead class="bg-gray-50 sticky top-0">
            <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Chức Vụ</th>
                <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành Động</th>
            </tr>
        </thead>`;

    const rowsHtml = roles.map(role => `
        <tr class="hover:bg-gray-50" data-id="${role.id}">
            <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-500">${role.id}</td>
            <td class="px-4 py-2 whitespace-nowrap text-sm font-semibold text-gray-900">${role.name}</td>
            <td class="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                <button class="delete-role-btn text-red-600 hover:text-red-900"><i class="fas fa-trash"></i> Xóa</button>
            </td>
        </tr>`).join('');
    list.closest('table').innerHTML = header + `<tbody>${rowsHtml}</tbody>`;
}

//#region MODAL_MANAGEMENT
/**
 * Hiển thị một modal dựa trên ID của nó.
 * @param {string} modalId - ID của phần tử modal.
 */
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    activeModal = modal;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => modal.classList.add('show'), 10);
}

/**
 * Ẩn modal đang hoạt động.
 */
function hideModal() {
    if (!activeModal) return;
    const modal = activeModal;
    modal.classList.remove('show');

    const onTransitionEnd = () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        const form = modal.querySelector('form');
        if (form) form.reset();
        modal.removeEventListener('transitionend', onTransitionEnd);
    };
    modal.addEventListener('transitionend', onTransitionEnd);
    activeModal = null;
}

/**
 * Hiển thị popup xác nhận.
 * @param {string} message - Thông điệp cần hiển thị.
 * @returns {Promise<boolean>}
 */
function showConfirmation(message) {
    // Sử dụng modal tùy chỉnh toàn cục
    return window.showConfirmation(message, 'Xác nhận', 'Xóa', 'Hủy');
}
//#endregion

/**
 * Dọn dẹp các sự kiện khi chuyển trang.
 */
export function cleanup() {
    if (domController) {
        domController.abort();
        domController = null;
    }
}

/**
 * Hàm khởi tạo chính của module.
 */
export async function init() {
    domController = new AbortController();
    const { signal } = domController;

    // Gắn listener cho các hành động chung của modal
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('.modal-close-btn') || e.target.classList.contains('modal-overlay')) {
            hideModal();
        }
    }, { signal });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && activeModal) {
            hideModal();
        }
    }, { signal });

    // Tải dữ liệu nền
    await fetchInitialData();

    // Lắng nghe các thay đổi từ Firestore và render
    listenForRoleChanges();
    listenForStaffChanges();

    const addStaffBtn = document.getElementById('add-staff-btn');
    const manageRolesBtn = document.getElementById('manage-roles-btn');
    const addRoleForm = document.getElementById('add-role-form-inline');
    const staffForm = document.getElementById('staff-form');

    if (addStaffBtn) {
        addStaffBtn.addEventListener('click', () => openStaffModal(), { signal });
    }

    if (manageRolesBtn) {
        manageRolesBtn.addEventListener('click', () => {
            showModal('manage-roles-modal');
        }, { signal });
    }

    // Sự kiện submit form thêm/sửa nhân viên
    if (staffForm) {
        staffForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const idInput = document.getElementById('staff-id');
            const staffId = idInput.value.trim().toUpperCase();
            const isEditMode = idInput.readOnly;

            if (!staffId) {
                showToast("Mã nhân viên là bắt buộc.", "warning");
                return;
            }

            const staffData = {
                name: document.getElementById('staff-name').value.trim(),
                phone: document.getElementById('staff-phone').value.trim(),
                roleId: document.getElementById('staff-role').value,
                storeId: document.getElementById('staff-store').value,
                status: document.getElementById('staff-status').value,
            };

            try {
                const docRef = doc(db, 'staff', staffId);
                if (isEditMode) {
                    await updateDoc(docRef, staffData);
                    showToast(`Đã cập nhật nhân viên: ${staffData.name}`, 'success');
                } else {
                    staffData.createdAt = serverTimestamp();
                    await setDoc(docRef, staffData);
                    showToast(`Đã thêm nhân viên: ${staffData.name}`, 'success');
                }
                hideModal();
            } catch (error) {
                console.error("Lỗi khi lưu nhân viên:", error);
                showToast("Đã xảy ra lỗi khi lưu. Mã nhân viên có thể đã tồn tại.", "error");
            }
        }, { signal });
    }

    if (addRoleForm) {
        addRoleForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const idInput = document.getElementById('inline-role-id');
            const nameInput = document.getElementById('inline-role-name');
            const id = idInput.value.trim().toUpperCase();
            const name = nameInput.value.trim();

            if (!id || !name) {
                showToast("Mã và Tên chức vụ là bắt buộc.", "warning");
                return;
            }

            if (allRoles.some(role => role.id === id)) {
                showToast(`Mã chức vụ "${id}" đã tồn tại.`, "error");
                return;
            }

            try {
                const docRef = doc(db, 'roles', id);
                await setDoc(docRef, { name });
                showToast(`Đã thêm chức vụ: ${name}`, "success");
                addRoleForm.reset();
                idInput.focus();
            } catch (error) {
                console.error("Lỗi khi thêm chức vụ:", error);
                showToast("Lỗi khi thêm chức vụ. Mã có thể đã tồn tại.", "error");
            }
        }, { signal });
    }

    // Event delegation cho việc xóa chức vụ
    document.getElementById('managed-roles-list')?.closest('table').addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.delete-role-btn');
        if (!deleteBtn) return;

        const row = deleteBtn.closest('tr');
        const roleId = row.dataset.id;
        const roleName = row.querySelector('td:nth-child(2)').textContent;

        showConfirmation(`Bạn có chắc chắn muốn xóa chức vụ "${roleName}"?`).then(async (confirmed) => {
            if (confirmed) {
                try {
                    await deleteDoc(doc(db, 'roles', roleId));
                    showToast(`Đã xóa chức vụ: ${roleName}`, 'success');
                } catch (error) {
                    console.error("Lỗi khi xóa chức vụ:", error);
                    showToast("Đã xảy ra lỗi khi xóa chức vụ.", "error");
                }
            }
        });
    }, { signal });

    // Event delegation cho việc xóa nhân viên
    document.getElementById('staff-list')?.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.edit-staff-btn');
        if (editBtn) {
            const staffId = editBtn.dataset.id;
            openStaffModal(staffId);
            return;
        }

        const deleteBtn = e.target.closest('.delete-staff-btn');
        if (!deleteBtn) return;

        const row = deleteBtn.closest('tr');
        const staffId = row.dataset.id;
        const staffName = row.querySelector('td:nth-child(2)').textContent;

        showConfirmation(`Bạn có chắc chắn muốn xóa nhân viên "${staffName}"?`).then(async (confirmed) => {
            if (confirmed) {
                try {
                    await deleteDoc(doc(db, 'staff', staffId));
                    showToast(`Đã xóa nhân viên: ${staffName}`, 'success');
                } catch (error) {
                    console.error("Lỗi khi xóa nhân viên:", error);
                    showToast("Đã xảy ra lỗi khi xóa nhân viên.", "error");
                }
            }
        });
    }, { signal });

    // TODO: Thêm logic cho tìm kiếm, sửa, xóa
}