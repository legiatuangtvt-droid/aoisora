import { db } from './firebase.js';
import { collection, onSnapshot, query, orderBy, doc, setDoc, getDoc, updateDoc, deleteDoc, serverTimestamp, getDocs, documentId } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let allStores = [];
let allStoreStatuses = [];
let domController = null;
let currentPage = 1;
const itemsPerPage = 10; // Số cửa hàng trên mỗi trang
let totalStores = 0;

let activeModal = null;

// Tham chiếu đến collection 'stores' trên Firestore
const storesCollection = collection(db, 'stores');

/**
 * Tải danh sách các trạng thái cửa hàng một lần khi trang được tải.
 */
async function fetchStoreStatuses() {
    const statusesSnapshot = await getDocs(collection(db, 'store_statuses'));
    allStoreStatuses = statusesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    const statusSelect = document.getElementById('store-status');
    if (statusSelect) {
        statusSelect.innerHTML = allStoreStatuses.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    }
}

/**
 * Lắng nghe các thay đổi từ collection `stores` và render lại bảng.
 */
function listenForStoreChanges() {
    // Sửa lại query: Sắp xếp theo khu vực, sau đó theo mã cửa hàng.
    // Sắp xếp theo 'areaId' trước, sau đó theo mã tài liệu (document ID).
    // Sử dụng documentId() để sắp xếp theo mã cửa hàng (là ID của document).
    const q = query(storesCollection, orderBy("areaId"), orderBy(documentId()));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        let fetchedStores = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Lọc danh sách cửa hàng cho vai trò STORE_INCHARGE
        const currentUser = window.currentUser;
        if (currentUser && currentUser.roleId === 'STORE_INCHARGE' && Array.isArray(currentUser.managedStoreIds)) {
            // Chỉ giữ lại các cửa hàng mà SI này quản lý
            console.log('[Store Management] SI detected. Filtering for managed stores:', currentUser.managedStoreIds);
            fetchedStores = fetchedStores.filter(store => currentUser.managedStoreIds.includes(store.id));
        }

        allStores = fetchedStores; // Lưu lại toàn bộ danh sách (đã được lọc nếu cần)
        renderStoreList(allStores);
    }, (error) => {
        console.error("[Store] Lỗi khi lắng nghe thay đổi cửa hàng (onSnapshot):", error);
        showToast("Mất kết nối tới dữ liệu cửa hàng.", "error");
        const listElement = document.getElementById('store-list');
        if (listElement) {
            listElement.innerHTML = `<tr><td colspan="6" class="text-center py-10">
                <div class="text-red-500"><i class="fas fa-exclamation-triangle fa-lg mr-2"></i>Không thể tải danh sách cửa hàng. Vui lòng kiểm tra kết nối mạng và thử tải lại trang.</div>
            </td></tr>`;
        }
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
    totalStores = storeList.length;

    // 1. Áp dụng Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const storesForPage = storeList.slice(startIndex, endIndex);

    const listElement = document.getElementById('store-list');
    if (!listElement) return;

    listElement.innerHTML = ''; // Xóa nội dung cũ

    if (storesForPage.length === 0) {
        listElement.innerHTML = `<tr><td colspan="6" class="text-center py-10 text-gray-500">Chưa có cửa hàng nào. Hãy thêm một cửa hàng mới!</td></tr>`;
        renderPagination(0); // Xóa các nút phân trang
        return;
    }

    storesForPage.forEach((store, index) => {
        const statusInfo = allStoreStatuses.find(s => s.id === store.status) || { name: store.status, color: 'gray' };
        const statusColor = statusInfo.color || 'gray';
        const statusBadge = `<span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-${statusColor}-100 text-${statusColor}-800">${statusInfo.name}</span>`;
        const serialNumber = startIndex + index + 1;

        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">${serialNumber}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">${store.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">${store.name}</td>
            <td class="px-6 py-4 text-sm text-left text-gray-500">${store.address || ''}</td>
            <td class="px-6 py-4 whitespace-nowrap text-center">${statusBadge}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                <button data-id="${store.id}" class="edit-store-btn text-indigo-600 hover:text-indigo-900" title="Chỉnh sửa"><i class="fas fa-pencil-alt"></i></button>
                <button data-id="${store.id}" class="delete-store-btn text-red-600 hover:text-red-900" title="Xóa"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
        listElement.appendChild(row);
    });

    renderPagination(totalStores);
}

/**
 * Render các nút điều khiển phân trang.
 * @param {number} totalItems - Tổng số cửa hàng.
 */
function renderPagination(totalItems) {
    const paginationContainer = document.getElementById('pagination-controls');
    if (!paginationContainer) return;

    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems);

    paginationContainer.innerHTML = `
        <div class="flex-1 flex justify-between sm:hidden">
            <button class="prev-page-btn relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50" ${currentPage === 1 ? 'disabled' : ''}>
                Trước
            </button>
            <button class="next-page-btn relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50" ${currentPage === totalPages ? 'disabled' : ''}>
                Sau
            </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
                <p class="text-sm text-gray-700">
                    Hiển thị từ <span class="font-medium">${startIndex}</span> đến <span class="font-medium">${endIndex}</span> trong tổng số <span class="font-medium">${totalItems}</span> cửa hàng
                </p>
            </div>
            <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button class="first-page-btn relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50" ${currentPage === 1 ? 'disabled' : ''} title="Trang đầu">
                        <span class="sr-only">First</span>
                        <i class="fas fa-backward-step h-5 w-5 flex items-center justify-center"></i>
                    </button>
                    <button class="prev-5-page-btn relative inline-flex items-center px-2 py-2 border-y border-l border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50" ${currentPage <= 5 ? 'disabled' : ''} title="Lùi 5 trang">
                        <span class="sr-only">Previous 5 pages</span>
                        <i class="fas fa-angles-left h-5 w-5 flex items-center justify-center"></i>
                    </button>
                    <button class="prev-page-btn relative inline-flex items-center px-2 py-2 border-y border-l border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50" ${currentPage === 1 ? 'disabled' : ''} title="Trang trước">
                        <span class="sr-only">Previous</span>
                        <i class="fas fa-chevron-left h-5 w-5 flex items-center justify-center"></i>
                    </button>
                    <button class="next-page-btn relative inline-flex items-center px-2 py-2 border-y border-l border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50" ${currentPage === totalPages ? 'disabled' : ''} title="Trang sau">
                        <span class="sr-only">Next</span>
                        <i class="fas fa-chevron-right h-5 w-5 flex items-center justify-center"></i>
                    </button>
                    <button class="next-5-page-btn relative inline-flex items-center px-2 py-2 border-y border-l border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50" ${currentPage > totalPages - 5 ? 'disabled' : ''} title="Tới 5 trang">
                        <span class="sr-only">Next 5 pages</span>
                        <i class="fas fa-angles-right h-5 w-5 flex items-center justify-center"></i>
                    </button>
                    <button class="last-page-btn relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50" ${currentPage === totalPages ? 'disabled' : ''} title="Trang cuối">
                        <span class="sr-only">Last</span>
                        <i class="fas fa-forward-step h-5 w-5 flex items-center justify-center"></i>
                    </button>
                </nav>
            </div>
        </div>
    `;
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
            document.getElementById('store-status').value = store.status;
        }
    } else { // Chế độ Thêm
        modalTitle.innerHTML = '<i class="fas fa-store-alt mr-2 text-indigo-500"></i> Thêm Cửa Hàng Mới';
        submitBtn.innerHTML = '<i class="fas fa-save mr-1"></i> Lưu';
        idInput.readOnly = false;
    }
    showModal('store-modal');
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

    await fetchStoreStatuses();
    listenForStoreChanges();

    const addStoreBtn = document.getElementById('add-store-btn');
    const storeForm = document.getElementById('store-form');
    const storeListTable = document.getElementById('store-list');

    // Event delegation cho các nút phân trang
    document.getElementById('pagination-controls')?.addEventListener('click', (e) => {
        const prevBtn = e.target.closest('.prev-page-btn');
        const nextBtn = e.target.closest('.next-page-btn');
        const firstPageBtn = e.target.closest('.first-page-btn');
        const lastPageBtn = e.target.closest('.last-page-btn');
        const prev5PageBtn = e.target.closest('.prev-5-page-btn');
        const next5PageBtn = e.target.closest('.next-5-page-btn');

        const totalPages = Math.ceil(totalStores / itemsPerPage);
        let pageChanged = false;

        if (prevBtn && currentPage > 1) {
            currentPage--;
            pageChanged = true;
        } else if (nextBtn && currentPage < totalPages) {
            currentPage++;
            pageChanged = true;
        } else if (firstPageBtn && currentPage > 1) {
            currentPage = 1;
            pageChanged = true;
        } else if (lastPageBtn && currentPage < totalPages) {
            currentPage = totalPages;
            pageChanged = true;
        } else if (prev5PageBtn && currentPage > 1) {
            currentPage = Math.max(1, currentPage - 5);
            pageChanged = true;
        } else if (next5PageBtn && currentPage < totalPages) {
            currentPage = Math.min(totalPages, currentPage + 5);
            pageChanged = true;
        }

        if (pageChanged) {
            renderStoreList(allStores); // Render lại danh sách cho trang mới
        }
    }, { signal });

    // Sự kiện mở modal thêm mới
    if (addStoreBtn) {
        addStoreBtn.addEventListener('click', () => openStoreModal(), { signal });
    }

    // Sự kiện submit form (cho cả thêm và sửa)
    if (storeForm) {
        storeForm.addEventListener('submit', async(e) => {
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
        }, { signal });
    }

    // Event delegation cho các nút Sửa và Xóa
    if (storeListTable) {
        storeListTable.addEventListener('click', async(e) => {
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
        }, { signal });
    }
}