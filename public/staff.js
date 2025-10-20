import { db } from './firebase.js';
import { collection, onSnapshot, query, orderBy, doc, setDoc, deleteDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Dữ liệu chức vụ sẽ được lấy từ Firestore
let allStaff = [];
let allRoles = [];
let allStores = [];
let allStaffStatuses = [];
let domController = null;

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

    // Tải dữ liệu nền
    await fetchInitialData();

    // Lắng nghe các thay đổi từ Firestore và render
    listenForRoleChanges();
    listenForStaffChanges();

    const addStaffBtn = document.getElementById('add-staff-btn');
    const manageRolesBtn = document.getElementById('manage-roles-btn');
    const addRoleForm = document.getElementById('add-role-form-inline');

    if (addStaffBtn) {
        addStaffBtn.addEventListener('click', () => {
            // Logic mở modal thêm nhân viên sẽ ở đây
            window.showToast('Chức năng "Thêm Nhân Viên" sẽ được phát triển sau.', 'info');
        }, { signal: domController.signal });
    }

    if (manageRolesBtn) {
        manageRolesBtn.addEventListener('click', () => {
            showModal('manage-roles-modal');
        }, { signal: domController.signal });
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
        }, { signal: domController.signal });
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
    }, { signal: domController.signal });

    // Event delegation cho việc xóa nhân viên
    document.getElementById('staff-list')?.addEventListener('click', (e) => {
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
    }, { signal: domController.signal });

    // TODO: Thêm logic cho tìm kiếm, sửa, xóa
}