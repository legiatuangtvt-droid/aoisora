import { db } from '../firebase.js';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, writeBatch, setDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

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
                <a href="#" class="text-indigo-600 hover:text-indigo-900 mr-3"><i class="fas fa-eye"></i> Xem chi tiết</a>
                <button data-id="${group.id}" class="delete-btn text-red-600 hover:text-red-900"><i class="fas fa-trash"></i> Xóa</button>
            </td>
        `;
        list.appendChild(row);
    });
}

/**
 * Lấy dữ liệu từ Firestore và render ra bảng.
 */
async function fetchAndRenderTaskGroups() {
    try {
        const snapshot = await getDocs(taskGroupsCollection);
        const groups = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Sắp xếp theo thời gian tạo để nhóm mới nhất lên đầu
        groups.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
        renderTaskGroups(groups);
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu nhóm công việc: ", error);
        alert("Không thể tải danh sách nhóm công việc. Vui lòng kiểm tra kết nối và thử lại.");
    }
}

// --- UI & Modal Logic ---
const modal = document.getElementById('group-modal');
const sidebarAddGroupBtn = document.getElementById('sidebar-add-group-btn');
const mainAddGroupBtn = document.getElementById('main-add-group-btn');
const addGroupForm = document.getElementById('add-group-form');
const taskGroupList = document.getElementById('task-groups-list');

// --- UI & Modal Logic for Bulk Import ---
const bulkImportModal = document.getElementById('bulk-import-modal');
const bulkImportBtn = document.getElementById('bulk-import-btn');
const bulkImportForm = document.getElementById('bulk-import-form');

window.openModal = function() {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

window.closeModal = function() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    addGroupForm.reset();
}

window.openBulkModal = function() {
    bulkImportModal.classList.remove('hidden');
    bulkImportModal.classList.add('flex');
}

window.closeBulkModal = function() {
    bulkImportModal.classList.add('hidden');
    bulkImportModal.classList.remove('flex');
}

document.addEventListener('DOMContentLoaded', () => {
    fetchAndRenderTaskGroups();

    // Gán sự kiện mở modal
    sidebarAddGroupBtn.addEventListener('click', openModal);
    mainAddGroupBtn.addEventListener('click', openModal);

    // Gán sự kiện mở modal nhập hàng loạt
    bulkImportBtn.addEventListener('click', openBulkModal);

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
            alert(`Đã tạo thành công nhóm: ${groupName}`);
            closeModal();
            fetchAndRenderTaskGroups(); // Tải lại danh sách
        } catch (error) {
            console.error("Lỗi khi thêm nhóm công việc: ", error);
            alert("Đã xảy ra lỗi khi tạo nhóm. Vui lòng thử lại.");
        }
    });

    // Xử lý form nhập hàng loạt
    bulkImportForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const bulkData = document.getElementById('bulk-data').value;
        const lines = bulkData.split('\n').filter(line => line.trim() !== '');

        if (lines.length === 0) {
            alert('Không có dữ liệu để nhập.');
            return;
        }

        if (!confirm(`Bạn có chắc chắn muốn nhập ${lines.length} nhóm công việc mới không?`)) {
            return;
        }

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
        alert(`Hoàn tất! Đã nhập thành công ${processedCount} / ${lines.length} nhóm công việc.`);
        closeBulkModal();
        fetchAndRenderTaskGroups();
    });

    // Sử dụng event delegation để xử lý sự kiện xóa
    taskGroupList.addEventListener('click', async (e) => {
        const deleteButton = e.target.closest('.delete-btn');
        if (deleteButton) {
            const groupId = deleteButton.dataset.id;
            if (confirm(`Bạn có chắc chắn muốn xóa nhóm công việc này (ID: ${groupId}) không?`)) {
                try {
                    await deleteDoc(doc(db, 'task_groups', groupId));
                    alert('Đã xóa thành công!');
                    fetchAndRenderTaskGroups(); // Tải lại danh sách
                } catch (error) {
                    console.error("Lỗi khi xóa nhóm công việc: ", error);
                    alert("Đã xảy ra lỗi khi xóa. Vui lòng thử lại.");
                }
            }
        }
    });
});