import { db } from './firebase.js';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, writeBatch, setDoc, onSnapshot, query, orderBy, getDoc, where, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Biến toàn cục để lưu trữ toàn bộ danh sách nhóm, giúp cho việc tìm kiếm không cần gọi lại Firestore
let allTaskGroups = [];
let allTaskAreas = {}; // Lưu trữ khu vực dưới dạng {id: name} để tra cứu nhanh

const taskGroupsCollection = collection(db, 'task_groups');
const taskAreasCollection = collection(db, 'task_areas');

/**
 * Tải danh sách các khu vực áp dụng từ Firestore và điền vào các dropdown.
 */
function listenForAreaChanges() {
    const q = query(taskAreasCollection, orderBy("name"));
    onSnapshot(q, (snapshot) => {
        const areas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // 1. Cập nhật object tra cứu `allTaskAreas`
        allTaskAreas = areas.reduce((acc, area) => {
            acc[area.id] = area.name;
            return acc;
        }, {});

        // 2. Populate các dropdown chọn khu vực
        populateAreaDropdowns(areas);

        // 3. Render danh sách khu vực trong modal quản lý
        renderManagedAreas(areas);

        // 4. Render lại danh sách nhóm công việc để cập nhật tên khu vực nếu có thay đổi
        if (allTaskGroups.length > 0) {
            filterAndRenderGroups();
        }

    }, (error) => {
        console.error("Lỗi khi lắng nghe thay đổi khu vực: ", error);
        showToast("Mất kết nối tới dữ liệu khu vực.", "error");
    });
}

/**
 * Điền dữ liệu khu vực vào các thẻ <select>
 * @param {Array} areas - Mảng các đối tượng khu vực
 */
function populateAreaDropdowns(areas) {
    const addSelect = document.getElementById('group-area');
    const editSelect = document.getElementById('edit-group-area');
    
    const currentAddValue = addSelect.value;
    const currentEditValue = editSelect.value;

    addSelect.innerHTML = '<option value="">-- Chọn khu vực --</option>';
    editSelect.innerHTML = '<option value="">-- Chọn khu vực --</option>';

    areas.forEach(area => {
        const option = `<option value="${area.id}">${area.name} (${area.id})</option>`;
        addSelect.innerHTML += option;
        editSelect.innerHTML += option;
    });

    // Khôi phục giá trị đã chọn nếu còn tồn tại
    if (Array.from(addSelect.options).some(opt => opt.value === currentAddValue)) {
        addSelect.value = currentAddValue;
    }
    if (Array.from(editSelect.options).some(opt => opt.value === currentEditValue)) {
        editSelect.value = currentEditValue;
    }
}

/**
 * Render danh sách các nhóm công việc ra bảng.
 * @param {Array} groups - Mảng các đối tượng nhóm công việc.
 */
function renderTaskGroups(groups) {
    const list = document.getElementById('task-groups-list');
    list.innerHTML = '';

    if (groups.length === 0) {
        list.innerHTML = `<tr><td colspan="6" class="text-center py-10 text-gray-500">Chưa có nhóm công việc nào. Hãy thêm một nhóm mới!</td></tr>`;
        return;
    }

    groups.forEach(group => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        
        const areaName = allTaskAreas[group.area] || group.area || '(Chưa có)';

        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">${group.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">${group.name}</td>
            <td class="px-6 py-4 text-sm text-gray-600">${group.description}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${areaName}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${group.taskCount || 0}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button data-id="${group.id}" class="view-details-btn text-indigo-600 hover:text-indigo-900 mr-3"><i class="fas fa-eye"></i> Xem chi tiết</button>
                <button data-id="${group.id}" class="edit-btn text-blue-600 hover:text-blue-900 mr-3"><i class="fas fa-edit"></i> Sửa</button>
                <button data-id="${group.id}" class="delete-btn text-red-600 hover:text-red-900"><i class="fas fa-trash"></i> Xóa</button>
            </td>
        `;
        list.appendChild(row);
    });
}

/**
 * Lắng nghe các thay đổi từ Firestore và render lại bảng trong thời gian thực.
 */
function listenForTaskGroupChanges() {
    try {
        // Tạo một query để sắp xếp theo thời gian tạo, nhóm mới nhất sẽ lên đầu
        const q = query(taskGroupsCollection, orderBy("createdAt", "desc"));

        onSnapshot(q, (snapshot) => {
            allTaskGroups = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Sau khi cập nhật dữ liệu, áp dụng lại bộ lọc tìm kiếm hiện tại
            filterAndRenderGroups();
        }, (error) => {
            // Callback này sẽ được gọi nếu có lỗi khi đang lắng nghe
            console.error("Lỗi khi lắng nghe thay đổi nhóm công việc: ", error);
            showToast("Mất kết nối tới dữ liệu. Vui lòng kiểm tra và thử lại.", "error");
        });
    } catch (error) {
        console.error("Lỗi khi thiết lập listener: ", error);
        showToast("Không thể tải danh sách nhóm công việc. Vui lòng kiểm tra kết nối và thử lại.", "error");
    }
}

/**
 * Lọc và render lại danh sách nhóm dựa trên nội dung ô tìm kiếm.
 */
function filterAndRenderGroups() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (!searchTerm) {
        renderTaskGroups(allTaskGroups);
        return;
    }

    const filteredGroups = allTaskGroups.filter(group => {
        const nameMatch = group.name.toLowerCase().includes(searchTerm);
        const idMatch = group.id.toLowerCase().includes(searchTerm);
        const descMatch = (group.description || '').toLowerCase().includes(searchTerm);
        return nameMatch || idMatch || descMatch;
    });

    renderTaskGroups(filteredGroups);
}

const sidebarAddGroupBtn = document.getElementById('sidebar-add-group-btn');
const mainAddGroupBtn = document.getElementById('main-add-group-btn');
const addGroupForm = document.getElementById('add-group-form');
const taskGroupList = document.getElementById('task-groups-list');
const editGroupForm = document.getElementById('edit-group-form');
const manageAreasBtn = document.getElementById('manage-areas-btn');

const bulkImportBtn = document.getElementById('bulk-import-btn');
const bulkImportForm = document.getElementById('bulk-import-form');

/**
 * Mở modal chi tiết và tải dữ liệu cho một nhóm công việc cụ thể.
 * @param {string} groupId - ID của nhóm công việc trong Firestore.
 */
async function openDetailsModal(groupId) {
    // Xóa dữ liệu cũ trước khi mở modal mới
    document.getElementById('details-task-list').innerHTML = `<tr><td colspan="3" class="text-center p-4 text-gray-500">Đang tải...</td></tr>`;
    showModal('details-modal');

    try {
        // 1. Lấy thông tin chi tiết của nhóm
        const groupDocRef = doc(db, 'task_groups', groupId);
        const groupDocSnap = await getDoc(groupDocRef);

        if (!groupDocSnap.exists()) {
            showToast("Không tìm thấy nhóm công việc!", "error");
            hideModal();
            return;
        }
        const groupData = groupDocSnap.data();
        document.getElementById('details-modal-title').textContent = `Chi tiết: ${groupData.name}`;
        document.getElementById('details-group-name').textContent = groupData.name;
        document.getElementById('details-group-id').textContent = groupId;
        document.getElementById('details-group-desc').textContent = groupData.description || '(Không có mô tả)';

        // 2. Lấy danh sách các công việc thuộc nhóm này
        const tasksCollection = collection(db, 'main_tasks');
        const q = query(tasksCollection, where("groupId", "==", groupId));
        const querySnapshot = await getDocs(q);

        const taskListEl = document.getElementById('details-task-list');
        // Thêm thead cho bảng chi tiết để rõ ràng hơn
        const tableHeader = `
            <thead class="table-header sticky top-0">
                <tr>
                    <th class="th-cell">Mã Công Việc</th>
                    <th class="th-cell">Tên Công Việc</th>
                    <th class="th-cell">Thời gian (phút)</th>
                </tr>
            </thead>`;

        if (querySnapshot.empty) {
            taskListEl.innerHTML = tableHeader + `<tbody><tr><td colspan="3" class="text-center p-4 text-gray-500">Chưa có công việc nào trong nhóm này.</td></tr></tbody>`;
        } else {
            const taskRows = querySnapshot.docs.map(doc => {
                const task = doc.data();
                return `<tr class="hover:bg-gray-50">
                            <td class="px-4 py-3 text-sm text-gray-700 font-mono">${doc.id}</td>
                            <td class="px-4 py-3 text-sm font-medium text-gray-900">${task.name}</td>
                            <td class="px-4 py-3 text-sm text-gray-700">${task.estimatedTime || 'N/A'}</td>
                        </tr>`;
            }).join('');
            taskListEl.innerHTML = tableHeader + `<tbody>${taskRows}</tbody>`;
        }
    } catch (error) {
        console.error("Lỗi khi tải chi tiết nhóm công việc: ", error);
        showToast("Đã xảy ra lỗi khi tải chi tiết. Vui lòng thử lại.", "error");
        hideModal();
    }
}

/**
 * Mở modal chỉnh sửa và điền dữ liệu cho một nhóm công việc.
 * @param {string} groupId - ID của nhóm công việc.
 */
async function openEditModal(groupId) {
    try {
        const docRef = doc(db, 'task_groups', groupId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const group = docSnap.data();
            document.getElementById('edit-group-id').value = groupId;
            document.getElementById('edit-group-name').value = group.name;
            document.getElementById('edit-group-desc').value = group.description || '';
            document.getElementById('edit-group-area').value = group.area || '';
            showModal('edit-group-modal');
        } else {
            showToast("Không tìm thấy nhóm công việc để sửa.", "error");
        }
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu để sửa: ", error);
        showToast("Đã xảy ra lỗi khi lấy dữ liệu. Vui lòng thử lại.", "error");
    }
}

/**
 * Render danh sách khu vực trong modal quản lý.
 * @param {Array} areas - Mảng các đối tượng khu vực.
 */
function renderManagedAreas(areas) {
    const list = document.getElementById('managed-areas-list');
    list.innerHTML = '';

    if (areas.length === 0) {
        list.innerHTML = `<tr><td colspan="3" class="text-center py-4 text-gray-500">Chưa có khu vực nào.</td></tr>`;
        return;
    }

    areas.forEach(area => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        row.dataset.id = area.id;
        
        row.innerHTML = `
            <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-500">${area.id}</td>
            <td class="px-4 py-2 whitespace-nowrap text-sm font-semibold text-gray-900">${area.name}</td>
            <td class="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                <button class="edit-area-btn text-blue-600 hover:text-blue-900 mr-3"><i class="fas fa-edit"></i> Sửa</button>
                <button class="delete-area-btn text-red-600 hover:text-red-900"><i class="fas fa-trash"></i> Xóa</button>
            </td>
        `;
        list.appendChild(row);
    });
}

/**
 * Chuyển một dòng trong bảng khu vực sang chế độ chỉnh sửa inline.
 * @param {HTMLElement} row - Phần tử <tr> cần chỉnh sửa.
 */
function turnOnAreaEditMode(row) {
    const areaId = row.dataset.id;
    const areaName = row.cells[1].textContent;

    row.cells[1].innerHTML = `<input type="text" class="form-input text-sm py-1" value="${areaName}">`;
    row.cells[2].innerHTML = `
        <button class="save-area-btn text-green-600 hover:text-green-900 mr-3"><i class="fas fa-check"></i> Lưu</button>
        <button class="cancel-edit-area-btn text-gray-500 hover:text-gray-700"><i class="fas fa-times"></i> Hủy</button>
    `;
    row.querySelector('input').focus();
}

/**
 * Lưu thay đổi khi sửa khu vực (inline).
 * @param {HTMLElement} row - Phần tử <tr> đang được sửa.
 */
async function saveAreaEdit(row) {
    const areaId = row.dataset.id;
    const newName = row.querySelector('input').value.trim();

    if (!newName) {
        showToast("Tên khu vực không được để trống.", "warning");
        return;
    }

    try {
        const docRef = doc(db, 'task_areas', areaId);
        await updateDoc(docRef, { name: newName });
        showToast(`Đã cập nhật khu vực: ${areaId}`, "success");
        // onSnapshot sẽ tự động render lại, không cần làm gì thêm.
    } catch (error) {
        console.error("Lỗi khi cập nhật khu vực: ", error);
        showToast("Lỗi khi cập nhật khu vực.", "error");
        // Nếu lỗi, render lại để hủy chế độ edit
        listenForAreaChanges();
    }
}


document.addEventListener('DOMContentLoaded', () => {
    listenForTaskGroupChanges();
    listenForAreaChanges();

    // Gán sự kiện mở modal
    sidebarAddGroupBtn.addEventListener('click', () => showModal('group-modal'));
    mainAddGroupBtn.addEventListener('click', () => showModal('group-modal'));
    manageAreasBtn.addEventListener('click', () => showModal('manage-areas-modal'));

    // Gán sự kiện mở modal nhập hàng loạt
    bulkImportBtn.addEventListener('click', () => showModal('bulk-import-modal'));

    // Gán sự kiện cho ô tìm kiếm
    document.getElementById('search-input').addEventListener('input', filterAndRenderGroups);

    // Xử lý gửi form để thêm nhóm mới vào Firestore
    addGroupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const groupName = document.getElementById('group-name').value;
        const groupArea = document.getElementById('group-area').value;
        const groupDesc = document.getElementById('group-desc').value;

        const newGroup = {
            name: groupName,
            area: groupArea,
            description: groupDesc,
            taskCount: 0, // Mặc định là 0
            createdAt: serverTimestamp() // Thêm dấu thời gian
        };

        try {
            const docRef = await addDoc(taskGroupsCollection, newGroup);
            showToast(`Đã tạo thành công nhóm: ${groupName}`, "success");
            hideModal();
            // Không cần gọi fetch nữa, onSnapshot sẽ tự động cập nhật
        } catch (error) {
            console.error("Lỗi khi thêm nhóm công việc: ", error);
            showToast("Đã xảy ra lỗi khi tạo nhóm. Vui lòng thử lại.", "error");
        }
    });

    // Xử lý form sửa nhóm
    editGroupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const groupId = document.getElementById('edit-group-id').value;
        const groupName = document.getElementById('edit-group-name').value;
        const groupArea = document.getElementById('edit-group-area').value;
        const groupDesc = document.getElementById('edit-group-desc').value;

        const updatedData = {
            name: groupName,
            area: groupArea,
            description: groupDesc,
        };

        try {
            const docRef = doc(db, 'task_groups', groupId);
            await updateDoc(docRef, updatedData);
            showToast(`Đã cập nhật thành công nhóm: ${groupName}`, "success");
            hideModal();
            // onSnapshot sẽ tự động cập nhật UI
        } catch (error) {
            console.error("Lỗi khi cập nhật nhóm: ", error);
            showToast("Đã xảy ra lỗi khi cập nhật. Vui lòng thử lại.", "error");
        }
    });

    // Xử lý form thêm khu vực (inline trong modal)
    document.getElementById('add-area-form-inline').addEventListener('submit', async function(e) {
        e.preventDefault();
        const id = document.getElementById('inline-area-id').value.trim().toUpperCase();
        const name = document.getElementById('inline-area-name').value.trim();

        if (!id || !name) {
            showToast("Mã và Tên khu vực là bắt buộc.", "warning");
            return;
        }

        try {
            // Dùng setDoc để tạo document với ID tự định nghĩa
            const docRef = doc(db, 'task_areas', id);
            await setDoc(docRef, { name });
            showToast(`Đã tạo thành công khu vực: ${name}`, "success");
            e.target.reset();
            document.getElementById('inline-area-id').focus();
        } catch (error) {
            console.error("Lỗi khi thêm khu vực: ", error);
            showToast("Đã xảy ra lỗi hoặc mã khu vực đã tồn tại.", "error");
        }
    });

    // Xử lý form nhập hàng loạt
    bulkImportForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const bulkData = document.getElementById('bulk-data').value;
        const lines = bulkData.split('\n').filter(line => line.trim() !== '');

        if (lines.length === 0) {
            showToast('Không có dữ liệu để nhập.', 'warning');
            return;
        }

        const confirmed = await showConfirmation(`Bạn có chắc chắn muốn nhập ${lines.length} nhóm công việc? Các nhóm có ID trùng lặp sẽ bị ghi đè.`, 'Xác nhận Nhập hàng loạt');
        if (!confirmed) {
            return;
        }

        showToast('Đang xử lý nhập dữ liệu...', 'info');
        const batch = writeBatch(db);
        let processedCount = 0;

        lines.forEach(line => {
            const parts = line.split('\t'); // Tách bằng phím Tab
            if (parts.length >= 2) { // Yêu cầu tối thiểu ID và Tên
                const groupId = parts[0].trim();
                const groupName = parts[1].trim();
                const groupDesc = (parts[2] || '').trim();

                if (groupId && groupName) {
                    const docRef = doc(db, 'task_groups', groupId);
                    batch.set(docRef, {
                        name: groupName,
                        description: groupDesc,
                        taskCount: 0,
                        createdAt: serverTimestamp()
                    });
                    processedCount++;
                }
            }
        });

        await batch.commit();
        showToast(`Hoàn tất! Đã nhập ${processedCount}/${lines.length} nhóm công việc.`, "success");
        hideModal();
        // Không cần gọi fetch nữa, onSnapshot sẽ tự động cập nhật
    });

    // Sử dụng event delegation để xử lý sự kiện xóa
    taskGroupList.addEventListener('click', async (e) => {
        const deleteButton = e.target.closest('.delete-btn');
        if (deleteButton) {
            const groupId = deleteButton.dataset.id;
            const confirmed = await showConfirmation(
                `Bạn có chắc chắn muốn xóa nhóm công việc này (ID: ${groupId}) không? Hành động này không thể hoàn tác.`,
                'Xác nhận Xóa Nhóm'
            );
            if (confirmed) {
                try {
                    await deleteDoc(doc(db, 'task_groups', groupId));
                    showToast('Đã xóa thành công!', 'success');
                    // Không cần gọi fetch nữa, onSnapshot sẽ tự động cập nhật
                } catch (error) {
                    console.error("Lỗi khi xóa nhóm công việc: ", error);
                    showToast("Đã xảy ra lỗi khi xóa. Vui lòng thử lại.", "error");
                }
            }
        }

        const viewDetailsButton = e.target.closest('.view-details-btn');
        if (viewDetailsButton) {
            const groupId = viewDetailsButton.dataset.id;
            openDetailsModal(groupId);
        }

        const editButton = e.target.closest('.edit-btn');
        if (editButton) {
            const groupId = editButton.dataset.id;
            openEditModal(groupId);
        }
    });

    // Event delegation cho modal quản lý khu vực
    document.getElementById('managed-areas-list').addEventListener('click', async (e) => {
        const row = e.target.closest('tr');
        if (!row) return;

        // Nút Sửa
        if (e.target.closest('.edit-area-btn')) {
            turnOnAreaEditMode(row);
        }
        // Nút Lưu (khi đang sửa)
        else if (e.target.closest('.save-area-btn')) {
            await saveAreaEdit(row);
        }
        // Nút Hủy (khi đang sửa)
        else if (e.target.closest('.cancel-edit-area-btn')) {
            // Chỉ cần re-render lại từ snapshot là được
            listenForAreaChanges();
        }
        // Nút Xóa
        else if (e.target.closest('.delete-area-btn')) {
            const areaId = row.dataset.id;
            const confirmed = await showConfirmation(`Bạn có chắc muốn xóa khu vực "${areaId}" không?`, 'Xác nhận xóa');
            
            if (confirmed) {
                try {
                    // **KIỂM TRA TRƯỚC KHI XÓA**
                    // Kiểm tra xem có nhóm công việc nào đang sử dụng khu vực này không
                    const usageQuery = query(taskGroupsCollection, where("area", "==", areaId));
                    const querySnapshot = await getDocs(usageQuery);

                    if (!querySnapshot.empty) {
                        // Nếu có, không cho xóa và thông báo
                        const groupNames = querySnapshot.docs.map(doc => `"${doc.data().name}"`).join(', ');
                        showToast(`Không thể xóa. Khu vực đang được sử dụng bởi nhóm: ${groupNames}.`, 'warning', 5000);
                        return; // Dừng hành động xóa
                    }

                    // Nếu không có nhóm nào sử dụng, tiến hành xóa
                    await deleteDoc(doc(db, 'task_areas', areaId));
                    showToast(`Đã xóa khu vực: ${areaId}`, 'success');
                } catch (error) {
                    console.error("Lỗi khi xóa khu vực: ", error);
                    showToast("Lỗi khi xóa khu vực.", "error");
                }
            }
        }
    });
});