import { db } from './firebase.js';
import { collection, onSnapshot, query, orderBy, doc, setDoc, getDoc, updateDoc, deleteDoc, serverTimestamp, getDocs } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let allStores = [];
let allStoreStatuses = [];
let domController = null;

// Tham chiếu đến collection 'stores' trên Firestore
const storesCollection = collection(db, 'stores');

/**
 * Tải danh sách các trạng thái cửa hàng một lần khi trang được tải.
 */
async function fetchStoreStatuses() {
    const statusesSnapshot = await getDocs(collection(db, 'store_statuses'));
    allStoreStatuses = statusesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Điền các lựa chọn vào dropdown trong modal
    const statusSelect = document.getElementById('store-status');
    if (statusSelect) {
        statusSelect.innerHTML = allStoreStatuses.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    }
}

/**
 * Lắng nghe các thay đổi từ collection `stores` và render lại bảng.
 */
function listenForStoreChanges() {
    const q = query(storesCollection, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        allStores = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderStoreList(allStores);
    }, (error) => {
        console.error("Lỗi khi lắng nghe thay đổi cửa hàng:", error);
        showToast("Mất kết nối tới dữ liệu cửa hàng.", "error");
    });
    // Lưu lại hàm hủy listener để dọn dẹp khi chuyển trang
    if (!domController.signal.aborted) {
        domController.signal.addEventListener('abort', unsubscribe);
    }
}

/**
 * Render danh sách cửa hàng ra bảng.
 * @param {Array} storeList - Danh sách cửa hàng cần hiển thị.
 */
function renderStoreList(storeList) {
    const listElement = document.getElementById('store-list');
    if (!listElement) return;

    listElement.innerHTML = ''; // Xóa nội dung cũ

    if (storeList.length === 0) {
        listElement.innerHTML = `<tr><td colspan="6" class="text-center py-10 text-gray-500">Chưa có cửa hàng nào. Hãy thêm một cửa hàng mới!</td></tr>`;
        return;
    }

    storeList.forEach(store => {
        const statusInfo = allStoreStatuses.find(s => s.id === store.status) || { name: store.status, color: 'gray' };
        const statusColor = statusInfo.color || 'gray';
        const statusBadge = `<span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-${statusColor}-100 text-${statusColor}-800">${statusInfo.name}</span>`;

        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">${store.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">${store.name}</td>
            <td class="px-6 py-4 text-sm text-right text-gray-500">${store.address}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">${store.phone}</td>
            <td class="px-6 py-4 whitespace-nowrap text-center">${statusBadge}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                <button data-id="${store.id}" class="edit-store-btn text-indigo-600 hover:text-indigo-900" title="Chỉnh sửa"><i class="fas fa-pencil-alt"></i></button>
                <button data-id="${store.id}" class="delete-store-btn text-red-600 hover:text-red-900" title="Xóa"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
        listElement.appendChild(row);
    });
}

/**
 * Mở modal và chuẩn bị form để thêm hoặc sửa cửa hàng.
 * @param {string|null} storeId - ID của cửa hàng cần sửa, hoặc null để thêm mới.
 */
async function openStoreModal(storeId = null) {
    const form = document.getElementById('store-form');
    const modalTitle = document.getElementById('store-modal-title');
    const idInput = document.getElementById('store-id');
    const submitBtn = document.getElementById('store-form-submit-btn');
    form.reset();

    if (storeId) { // Chế độ Sửa
        modalTitle.innerHTML = '<i class="fas fa-store-alt mr-2 text-indigo-500"></i> Chỉnh Sửa Cửa Hàng';
        submitBtn.innerHTML = '<i class="fas fa-save mr-1"></i> Cập Nhật';
        idInput.value = storeId;
        idInput.readOnly = true;
        const store = allStores.find(s => s.id === storeId);
        if (store) {
            document.getElementById('store-name').value = store.name;
            document.getElementById('store-address').value = store.address || '';
            document.getElementById('store-phone').value = store.phone || '';
            document.getElementById('store-status').value = store.status;
        }
    } else { // Chế độ Thêm
        modalTitle.innerHTML = '<i class="fas fa-store-alt mr-2 text-indigo-500"></i> Thêm Cửa Hàng Mới';
        submitBtn.innerHTML = '<i class="fas fa-save mr-1"></i> Lưu';
        idInput.readOnly = false;
    }
    showModal('store-modal');
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
    await fetchStoreStatuses();
    listenForStoreChanges();

    const addStoreBtn = document.getElementById('add-store-btn');
    const storeForm = document.getElementById('store-form');
    const storeListTable = document.getElementById('store-list');

    // Sự kiện mở modal thêm mới
    if (addStoreBtn) {
        addStoreBtn.addEventListener('click', () => openStoreModal(), { signal: domController.signal });
    }

    // Sự kiện submit form (cho cả thêm và sửa)
    if (storeForm) {
        storeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const storeId = document.getElementById('store-id').value.trim().toUpperCase();
            const isEditMode = document.getElementById('store-id').readOnly;

            if (!storeId) {
                showToast("Mã cửa hàng là bắt buộc.", "warning");
                return;
            }

            const storeData = {
                name: document.getElementById('store-name').value.trim(),
                address: document.getElementById('store-address').value.trim(),
                phone: document.getElementById('store-phone').value.trim(),
                status: document.getElementById('store-status').value,
            };

            try {
                const docRef = doc(db, 'stores', storeId);
                if (isEditMode) {
                    await updateDoc(docRef, storeData);
                    showToast(`Đã cập nhật cửa hàng: ${storeData.name}`, 'success');
                } else {
                    storeData.createdAt = serverTimestamp();
                    await setDoc(docRef, storeData);
                    showToast(`Đã thêm cửa hàng: ${storeData.name}`, 'success');
                }
                hideModal();
            } catch (error) {
                console.error("Lỗi khi lưu cửa hàng:", error);
                showToast("Đã xảy ra lỗi khi lưu. Mã cửa hàng có thể đã tồn tại.", "error");
            }
        }, { signal: domController.signal });
    }

    // Event delegation cho các nút Sửa và Xóa
    if (storeListTable) {
        storeListTable.addEventListener('click', async (e) => {
            const editBtn = e.target.closest('.edit-store-btn');
            if (editBtn) {
                openStoreModal(editBtn.dataset.id);
                return;
            }

            const deleteBtn = e.target.closest('.delete-store-btn');
            if (deleteBtn) {
                const storeId = deleteBtn.dataset.id;
                const confirmed = await showConfirmation(`Bạn có chắc chắn muốn xóa cửa hàng "${storeId}" không?`);
                if (confirmed) {
                    try {
                        await deleteDoc(doc(db, 'stores', storeId));
                        showToast(`Đã xóa cửa hàng ${storeId}.`, 'success');
                    } catch (error) {
                        console.error("Lỗi khi xóa cửa hàng:", error);
                        showToast("Lỗi khi xóa cửa hàng.", "error");
                    }
                }
            }
        }, { signal: domController.signal });
    }
}