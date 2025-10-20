// Hiện tại, chúng ta sẽ sử dụng dữ liệu giả lập (mock data)
// Trong tương lai, dữ liệu này sẽ được lấy từ Firestore
const allStaff = [
    {
        id: 'YSHNG_01',
        name: 'YOSHINAGA',
        role: 'POS',
        store: 'Maxivelu Thủ Đức',
        phone: '090 111 2222',
        status: 'Đang làm việc'
    },
    {
        id: 'TUNG_02',
        name: 'TÙNG',
        role: 'MMD',
        store: 'Maxivelu Thủ Đức',
        phone: '090 333 4444',
        status: 'Đang làm việc'
    },
    {
        id: 'THAO_03',
        name: 'THẢO',
        role: 'Aeon Cafe',
        store: 'Maxivelu Quận 1',
        phone: '091 555 6666',
        status: 'Đã nghỉ việc'
    },
    {
        id: 'KNGOC_04',
        name: 'KIM NGỌC',
        role: 'POS',
        store: 'Maxivelu Bình Thạnh',
        phone: '093 777 8888',
        status: 'Đang làm việc'
    }
];

// Dữ liệu giả lập cho chức vụ
let allRoles = [
    { id: 'POS', name: 'Thu ngân' },
    { id: 'MMD', name: 'Trưng bày hàng hóa' },
    { id: 'CAFE', name: 'Pha chế Cafe' },
    { id: 'SUPPORT', name: 'Hỗ trợ chung' },
];

let domController = null;

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
        const roleInfo = allRoles.find(r => r.id === staff.role) || { name: staff.role };

        const statusBadge = staff.status === 'Đang làm việc'
            ? `<span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Đang làm việc</span>`
            : `<span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Đã nghỉ việc</span>`;

        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900">${staff.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">${staff.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500" title="${roleInfo.name}">${staff.role}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">${staff.store}</td>
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
export function init() {
    domController = new AbortController();

    // Render danh sách ban đầu
    renderManagedRoles(allRoles); // Render trước để modal sẵn sàng
    renderStaffList(allStaff);

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
        addRoleForm.addEventListener('submit', (e) => {
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

            allRoles.push({ id, name });
            renderManagedRoles(allRoles);
            showToast(`Đã thêm chức vụ: ${name}`, "success");
            addRoleForm.reset();
            idInput.focus();
        }, { signal: domController.signal });
    }

    // Event delegation cho việc xóa chức vụ
    document.getElementById('managed-roles-list')?.closest('table').addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.delete-role-btn');
        if (deleteBtn) {
            const row = deleteBtn.closest('tr');
            const roleId = row.dataset.id;
            allRoles = allRoles.filter(role => role.id !== roleId);
            renderManagedRoles(allRoles);
            showToast(`Đã xóa chức vụ: ${roleId}`, 'success');
        }
    }, { signal: domController.signal });

    // TODO: Thêm logic cho tìm kiếm, sửa, xóa
}