import { db } from './firebase.js';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, writeBatch, setDoc, onSnapshot, query, orderBy, getDoc, where } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const taskGroupsCollection = collection(db, 'task_groups');

/**
 * Render danh sách các nhóm công việc ra bảng.
 * @param {Array} groups - Mảng các đối tượng nhóm công việc.
 */
function renderTaskGroups(groups) {
    const list = document.getElementById('task-groups-list');
    list.innerHTML = '';

    if (groups.length === 0) {
        list.innerHTML = `<tr><td colspan="5" class="text-center py-10 text-gray-500">Chưa có nhóm công việc nào. Hãy thêm một nhóm mới!</td></tr>`;
        return;
    }

    groups.forEach(group => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">${group.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">${group.name}</td>
            <td class="px-6 py-4 text-sm text-gray-600">${group.description}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${group.taskCount || 0}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button data-id="${group.id}" class="view-details-btn text-indigo-600 hover:text-indigo-900 mr-3"><i class="fas fa-eye"></i> Xem chi tiết</button>
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
            const groups = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            renderTaskGroups(groups);
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

const sidebarAddGroupBtn = document.getElementById('sidebar-add-group-btn');
const mainAddGroupBtn = document.getElementById('main-add-group-btn');
const addGroupForm = document.getElementById('add-group-form');
const taskGroupList = document.getElementById('task-groups-list');

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

document.addEventListener('DOMContentLoaded', () => {
    listenForTaskGroupChanges(); // Thay đổi ở đây

    // Gán sự kiện mở modal
    sidebarAddGroupBtn.addEventListener('click', () => showModal('group-modal'));
    mainAddGroupBtn.addEventListener('click', () => showModal('group-modal'));

    // Gán sự kiện mở modal nhập hàng loạt
    bulkImportBtn.addEventListener('click', () => showModal('bulk-import-modal'));

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
    });
});