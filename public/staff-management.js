import { db } from './firebase.js';
import { collection, onSnapshot, query, orderBy, doc, setDoc, deleteDoc, getDocs, updateDoc, serverTimestamp, where, limit, startAfter, endBefore, getCountFromServer } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Dữ liệu chức vụ sẽ được lấy từ Firestore
let allRoles = [];
let allStores = [];
let allAreas = [];
let allRegions = [];
let allEmployeeStatuses = [];
let domController = null;
let currentPage = 1;
const itemsPerPage = 10; // Số nhân viên trên mỗi trang
let pageSnapshots = [null]; // Lưu snapshot đầu tiên của mỗi trang, pageSnapshots[0] luôn là null cho trang 1
let totalEmployees = 0; // Tổng số nhân viên sau khi lọc

// State for sorting and filtering
let sortCriteria = []; // Sẽ được đặt lại trong init()
let filters = {};
let activeModal = null;


/**
 * Tải tất cả dữ liệu cần thiết một lần (stores, statuses)
 */
async function fetchInitialData() {
    const storesSnapshot = await getDocs(collection(db, 'stores'));
    allStores = storesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const areasSnapshot = await getDocs(collection(db, 'areas'));
    allAreas = areasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const regionsSnapshot = await getDocs(collection(db, 'regions'));
    allRegions = regionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const statusesSnapshot = await getDocs(collection(db, 'employee_statuses'));
    allEmployeeStatuses = statusesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
        // Tải lại dữ liệu trang hiện tại để cập nhật tên chức vụ nếu có thay đổi
        fetchAndRenderEmployees('current');
    }, (error) => {
        console.error("Lỗi khi lắng nghe thay đổi chức vụ:", error);
        showToast("Mất kết nối tới dữ liệu chức vụ.", "error");
    });

    if (domController && !domController.signal.aborted) {
        domController.signal.addEventListener('abort', unsubscribe);
    }
}

/**
 * Render danh sách nhân viên ra bảng.
 * @param {Array} employeeList - Danh sách nhân viên cần hiển thị.
 */
function renderEmployeeList(employeeList) {
    const processedEmployees = getProcessedEmployees();
    const listElement = document.getElementById('employee-list');
    if (!listElement) return;
    listElement.innerHTML = ''; // Xóa nội dung cũ

    if (employeeList.length === 0) {
        listElement.innerHTML = `<tr><td colspan="8" class="text-center py-10 text-gray-500">Không có nhân viên nào.</td></tr>`;
        renderPagination(0); // Xóa các nút phân trang
        return;
    }

    employeeList.forEach((employee, index) => {
        const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
        const roleInfo = allRoles.find(r => r.id === employee.roleId) || { name: employee.roleId || 'N/A' };
        
        let storeInfoText = '';
        let storeInfoTitle = '';

        switch (employee.roleId) {
            case 'AREA_MANAGER':
                const managedArea = allAreas.find(a => employee.managedAreaIds?.includes(a.id));
                storeInfoText = managedArea ? managedArea.name : 'Khu vực không xác định';
                const managedStoresInArea = allStores.filter(s => s.areaId === managedArea?.id);
                storeInfoTitle = managedStoresInArea.length > 0 ? `Quản lý các cửa hàng:\n${managedStoresInArea.map(s => `• ${s.name}`).join('\n')}` : 'Chưa có cửa hàng trong khu vực';
                break;
            case 'STORE_INCHARGE':
                const managedStore = allStores.find(s => s.id === employee.storeId);
                storeInfoText = managedStore ? managedStore.name : (employee.storeId || 'N/A');
                storeInfoTitle = `Quản lý: ${allStores.filter(s => employee.managedStoreIds?.includes(s.id)).map(s => s.name).join(', ')}`;
                break;
            case 'REGIONAL_MANAGER':
                const managedRegion = allRegions.find(r => r.id === employee.managedRegionId);
                storeInfoText = managedRegion ? managedRegion.name : 'Miền không xác định';
                const managedAreasInRegion = allAreas.filter(a => a.regionId === managedRegion?.id);
                storeInfoTitle = managedAreasInRegion.length > 0 ? `Quản lý các khu vực:\n${managedAreasInRegion.map(a => `• ${a.name}`).join('\n')}` : 'Chưa có khu vực trong miền';
                break;
            case 'HQ_STAFF':
                storeInfoText = 'Head Quarter';
                storeInfoTitle = 'Nhân viên văn phòng';
                break;
            default: // STAFF, STORE_LEADER, etc.
                const storeInfo = allStores.find(s => s.id === employee.storeId);
                storeInfoText = storeInfo ? storeInfo.name : (employee.storeId || 'N/A');
                storeInfoTitle = storeInfoText;
                break;
        }

        const statusInfo = allEmployeeStatuses.find(s => s.id === employee.status) || { name: employee.status, color: 'gray' };

        const statusColor = statusInfo.color || 'gray';
        const statusBadge = `<span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-${statusColor}-100 text-${statusColor}-800">${statusInfo.name}</span>`;

        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        row.dataset.id = employee.id;
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">${serialNumber}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900">${employee.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">${employee.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500" title="${roleInfo.name}">${employee.roleId}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500" title="${storeInfoTitle}">${storeInfoText}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">${employee.phone}</td>
            <td class="px-6 py-4 whitespace-nowrap  text-center">${statusBadge}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center font-medium space-x-4">
                <button data-id="${employee.id}" class="edit-employee-btn text-indigo-600 hover:text-indigo-900" title="Chỉnh sửa"><i class="fas fa-pencil-alt"></i></button>
                <button data-id="${employee.id}" class="delete-employee-btn text-red-600 hover:text-red-900" title="Xóa"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
        listElement.appendChild(row);
    });

    renderPagination(totalEmployees);
}

/**
 * Render các nút điều khiển phân trang.
 * @param {number} totalItems - Tổng số nhân viên.
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
                    Hiển thị từ <span class="font-medium">${startIndex}</span> đến <span class="font-medium">${endIndex}</span> trong tổng số <span class="font-medium">${totalItems}</span> nhân viên
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
 * Mở modal và chuẩn bị form để thêm hoặc sửa nhân viên.
 * @param {string|null} employeeId - ID của nhân viên cần sửa, hoặc null để thêm mới.
 */
function openEmployeeModal(employeeId = null) {
    const form = document.getElementById('employee-form');
    const modalTitle = document.getElementById('employee-modal-title');
    const idInput = document.getElementById('employee-id');
    const submitBtn = document.getElementById('employee-form-submit-btn');
    form.reset();

    // Điền dữ liệu cho các dropdown
    const roleSelect = document.getElementById('employee-role');
    const storeSelect = document.getElementById('employee-store');
    const statusSelect = document.getElementById('employee-status');

    roleSelect.innerHTML = allRoles.map(r => `<option value="${r.id}">${r.name}</option>`).join('');
    storeSelect.innerHTML = allStores.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    statusSelect.innerHTML = allEmployeeStatuses.map(s => `<option value="${s.id}">${s.name}</option>`).join('');

    // Thêm một lựa chọn trống cho cửa hàng và chức vụ
    roleSelect.insertAdjacentHTML('afterbegin', '<option value="">-- Chọn chức vụ --</option>');
    storeSelect.insertAdjacentHTML('afterbegin', '<option value="">-- Chọn cửa hàng --</option>');

    if (employeeId) { // Chế độ Sửa
        modalTitle.innerHTML = '<i class="fas fa-user-edit mr-2 text-indigo-500"></i> Chỉnh Sửa Nhân Viên';
        submitBtn.innerHTML = '<i class="fas fa-save mr-1"></i> Cập Nhật';
        idInput.value = employeeId;
        idInput.readOnly = true;

        // Tạm thời lấy thông tin từ DOM vì allEmployees không còn tồn tại
        const row = document.querySelector(`tr[data-id="${employeeId}"]`);
        if (row) {
            const employeeName = row.cells[1].textContent;
            const roleId = row.cells[2].textContent;
            const phone = row.cells[4].textContent;
            const statusText = row.querySelector('span').textContent;
            const status = allEmployeeStatuses.find(s => s.name === statusText)?.id || 'ACTIVE';

            document.getElementById('employee-name').value = employeeName;
            document.getElementById('employee-phone').value = phone || '';
            roleSelect.value = roleId || '';
            storeSelect.value = employee.storeId || '';
            statusSelect.value = employee.status || 'ACTIVE';
        }
    } else { // Chế độ Thêm
        modalTitle.innerHTML = '<i class="fas fa-user-plus mr-2 text-indigo-500"></i> Thêm Nhân Viên Mới';
        submitBtn.innerHTML = '<i class="fas fa-save mr-1"></i> Lưu';
        idInput.readOnly = false;
        roleSelect.value = "";
        storeSelect.value = "";
        statusSelect.value = "ACTIVE";
    }

    showModal('employee-modal');
}

/**
 * Lấy danh sách nhân viên đã được lọc và sắp xếp.
 * @returns {Array}
 */
function getProcessedEmployees() {
    // This function is now deprecated as filtering and sorting are done server-side.
    // It's kept for compatibility with parts of the code that might still call it,
    // but it no longer performs any processing.
    return [];
}

/**
 * Xây dựng và thực thi truy vấn Firestore để lấy dữ liệu nhân viên.
 * @param {string} direction - 'next', 'prev', hoặc 'first' để điều hướng trang.
 */
async function fetchAndRenderEmployees(direction = 'first') {
    const listElement = document.getElementById('employee-list');
    if (!listElement) return;
    listElement.innerHTML = `<tr><td colspan="8" class="text-center py-10 text-gray-500"><i class="fas fa-spinner fa-spin mr-2"></i> Đang tải...</td></tr>`;

    // Thay vì truy vấn một collection, chúng ta sẽ thực hiện 3 truy vấn song song
    const employeeQuery = getDocs(collection(db, 'employee'));
    const areaManagerQuery = getDocs(collection(db, 'area_managers'));
    const regionalManagerQuery = getDocs(collection(db, 'regional_managers'));

    const [employeeSnap, areaManagerSnap, regionalManagerSnap] = await Promise.all([
        employeeQuery,
        areaManagerQuery,
        regionalManagerQuery
    ]);

    let allPersonnel = [
        ...employeeSnap.docs.map(doc => ({ id: doc.id, ...doc.data()})),
        ...areaManagerSnap.docs.map(doc => ({ id: doc.id, ...doc.data()})),
        ...regionalManagerSnap.docs.map(doc => ({ id: doc.id, ...doc.data()})),
    ].map(person => {
        // Gắn level vào mỗi nhân viên để sắp xếp
        // Xử lý đặc biệt cho STORE_INCHARGE để hiển thị đúng trong bảng
        if (person.roleId === 'STORE_INCHARGE') {
            // Để hiển thị trong cột cửa hàng, ta có thể gán tạm storeId là cửa hàng đầu tiên họ quản lý
            // Hoặc để trống và chỉ hiển thị ở tooltip. Ở đây, ta gán storeId để có thể lọc.
            if (Array.isArray(person.managedStoreIds) && person.managedStoreIds.length > 0) {
                person.storeId = person.managedStoreIds[0];
            }
        }
        const role = allRoles.find(r => r.id === person.roleId);
        return { ...person, level: role ? (role.level || 0) : 0 };
    });

    // Lọc danh sách nhân sự cho các vai trò quản lý (SI, AM, RM)
    const currentUser = window.currentUser;
    if (currentUser && ['STORE_INCHARGE', 'AREA_MANAGER', 'REGIONAL_MANAGER'].includes(currentUser.roleId)) {
        let managedStoreIds = [];
        if (currentUser.roleId === 'STORE_INCHARGE') {
            managedStoreIds = currentUser.managedStoreIds || [];
        } else if (currentUser.roleId === 'AREA_MANAGER') {
            const areas = allAreas.filter(a => currentUser.managedAreaIds?.includes(a.id));
            const areaIds = areas.map(a => a.id);
            managedStoreIds = allStores.filter(s => areaIds.includes(s.areaId)).map(s => s.id);
        } else if (currentUser.roleId === 'REGIONAL_MANAGER') {
            const areas = allAreas.filter(a => a.regionId === currentUser.managedRegionId);
            const areaIds = areas.map(a => a.id);
            managedStoreIds = allStores.filter(s => areaIds.includes(s.areaId)).map(s => s.id);
        }

        console.log(`[Staff Management] ${currentUser.roleId} detected. Filtering for ${managedStoreIds.length} managed stores.`);
        allPersonnel = allPersonnel.filter(person => {
            // Giữ lại chính người quản lý đó
            if (person.id === currentUser.id) return true;
            // Giữ lại các nhân viên thuộc các cửa hàng được quản lý
            return managedStoreIds.includes(person.storeId);
        });
    }


    // 1. Áp dụng Filters (where)
    if (Object.keys(filters).length > 0) {
        allPersonnel = allPersonnel.filter(person => {            
            return Object.entries(filters).every(([column, value]) => {
                // Xử lý logic lọc đặc biệt cho STORE_INCHARGE trên cột storeId
                if (column === 'storeId' && person.roleId === 'STORE_INCHARGE') {
                    // Nếu là SI, kiểm tra xem cửa hàng được lọc có nằm trong danh sách quản lý của họ không
                    return person.managedStoreIds?.includes(value);
                }
                // Logic lọc mặc định cho các trường hợp khác
                return person[column] === value;
            });
        });
    }

    // 2. Áp dụng Sorting (orderBy)
    allPersonnel.sort((a, b) => {
        for (const criterion of sortCriteria) {
            const { column, direction } = criterion;
            const valA = a[column] || '';
            const valB = b[column] || '';
            const comparison = String(valA).localeCompare(String(valB), 'vi', { sensitivity: 'base' });
            if (comparison !== 0) {
                return direction === 'asc' ? comparison : -comparison;
            }
        }
        return 0;
    });

    totalEmployees = allPersonnel.length;

    // 3. Áp dụng Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const employeesForPage = allPersonnel.slice(startIndex, endIndex);

    try {
        renderEmployeeList(employeesForPage);
        updateSortFilterIndicators();
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu nhân viên:", error);
        window.showToast("Lỗi khi tải dữ liệu. Firestore index có thể bị thiếu.", "error");
        if (listElement) {
            listElement.innerHTML = `<tr><td colspan="8" class="text-center py-10">
                <div class="text-red-500"><i class="fas fa-exclamation-triangle fa-lg mr-2"></i>Không thể tải danh sách nhân viên. Vui lòng kiểm tra kết nối mạng và thử tải lại trang.</div>
            </td></tr>`;
        }
    }
}

/**
 * Hiển thị popup để sắp xếp và lọc.
 * @param {Event} e - Sự kiện click.
 */
function showSortFilterPopup(e) {
    const th = e.currentTarget;
    const column = th.dataset.column;
    const isFilterable = th.dataset.filterable === 'true';

    const popup = document.getElementById('sort-filter-popup');
    const filterOptions = document.getElementById('filter-options');
    const filterList = document.getElementById('filter-list');
    const filterSearch = document.getElementById('filter-search');

    // Hiển thị/ẩn phần lọc
    filterOptions.style.display = isFilterable ? 'block' : 'none';
    filterList.innerHTML = '';
    filterSearch.value = '';

    if (isFilterable) {
        let options = [];
        if (column === 'roleId') {
            options = allRoles.map(r => ({ value: r.id, text: r.name }));
        } else if (column === 'storeId') {
            options = allStores.map(s => ({ value: s.id, text: s.name }));
        } else if (column === 'status') {
            options = allEmployeeStatuses.map(s => ({ value: s.id, text: s.name }));
        }

        const renderFilterItems = (searchTerm = '') => {
            filterList.innerHTML = '';
            const filteredOptions = options.filter(opt => opt.text.toLowerCase().includes(searchTerm.toLowerCase()));
            filteredOptions.forEach(opt => {
                const item = document.createElement('a');
                item.href = '#';
                item.className = 'filter-item block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100';
                item.dataset.value = opt.value;
                item.textContent = opt.text;
                item.onclick = (event) => {
                    event.preventDefault();
                    filters[column] = opt.value;
                    currentPage = 1; // Reset về trang đầu khi lọc
                    fetchAndRenderEmployees('first');
                    updateSortFilterIndicators();
                    popup.classList.add('hidden');
                };
                filterList.appendChild(item);
            });
        };

        renderFilterItems();
        filterSearch.oninput = () => renderFilterItems(filterSearch.value);
    }

    // Gán sự kiện cho các nút
    popup.querySelectorAll('.sort-btn').forEach(btn => {
        btn.onclick = (event) => {
            event.preventDefault();
            sortCriteria = [{ column, direction: btn.dataset.direction }];
            currentPage = 1; // Reset về trang đầu khi sắp xếp
            fetchAndRenderEmployees('first');
            updateSortFilterIndicators();
            popup.classList.add('hidden');
        };
    });

    document.getElementById('clear-filter-btn').onclick = () => {
        delete filters[column];
        currentPage = 1; // Reset về trang đầu khi xóa lọc
        fetchAndRenderEmployees('first');
        updateSortFilterIndicators();
        popup.classList.add('hidden');
    };

    // Định vị và hiển thị popup
    const rect = th.getBoundingClientRect();
    popup.style.left = `${rect.left}px`;
    popup.style.top = `${rect.bottom}px`;
    popup.classList.remove('hidden');

    // Đóng popup khi click ra ngoài
    setTimeout(() => {
        document.addEventListener('click', function hide(event) {
            if (!popup.contains(event.target) && event.target !== th) {
                popup.classList.add('hidden');
                document.removeEventListener('click', hide);
            }
        }, { once: true });
    }, 0);
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
 * Cập nhật các chỉ báo sắp xếp/lọc trên tiêu đề bảng.
 */
function updateSortFilterIndicators() {
    const headers = document.querySelectorAll('#staff-table-header .th-sortable');
    headers.forEach(th => {
        const column = th.dataset.column;
        const indicator = th.querySelector('.sort-indicator');
        indicator.innerHTML = ''; // Clear old indicators

        // Sort indicator
        const sortCriterion = sortCriteria.find(c => c.column === column);
        if (sortCriterion) {
            const icon = document.createElement('i');
            icon.className = `fas ${sortCriterion.direction === 'asc' ? 'fa-arrow-up' : 'fa-arrow-down'} ml-2 text-indigo-500`;
            indicator.appendChild(icon);
        }

        // Filter indicator
        if (filters[column]) {
            const icon = document.createElement('i');
            icon.className = 'fas fa-filter ml-2 text-amber-500';
            indicator.appendChild(icon);
        }
    });
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

    // Đặt lại tiêu chí sắp xếp mặc định
    sortCriteria = [
        { column: 'level', direction: 'desc' }, // Sắp xếp theo level giảm dần
        { column: 'name', direction: 'asc' }   // Nếu level bằng nhau, sắp xếp theo tên
    ];

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
    fetchAndRenderEmployees('first'); // Tải trang đầu tiên khi khởi tạo

    const addEmployeeBtn = document.getElementById('add-employee-btn');
    const manageRolesBtn = document.getElementById('manage-roles-btn');
    const addRoleForm = document.getElementById('add-role-form-inline');
    const employeeForm = document.getElementById('employee-form');

    if (addEmployeeBtn) {
        addEmployeeBtn.addEventListener('click', () => openEmployeeModal(), { signal });
    }

    if (manageRolesBtn) {
        manageRolesBtn.addEventListener('click', () => {
            showModal('manage-roles-modal');
        }, { signal });
    }

    // Sự kiện submit form thêm/sửa nhân viên
    if (employeeForm) {
        employeeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const idInput = document.getElementById('employee-id');
            const employeeId = idInput.value.trim().toUpperCase();
            const isEditMode = idInput.readOnly;

            if (!employeeId) {
                showToast("Mã nhân viên là bắt buộc.", "warning");
                return;
            }

            const employeeData = {
                name: document.getElementById('employee-name').value.trim(),
                phone: document.getElementById('employee-phone').value.trim(),
                roleId: document.getElementById('employee-role').value,
                storeId: document.getElementById('employee-store').value,
                status: document.getElementById('employee-status').value,
            };

            try {
                const docRef = doc(db, 'employee', employeeId);
                if (isEditMode) {
                    await updateDoc(docRef, employeeData);
                    showToast(`Đã cập nhật nhân viên: ${employeeData.name}`, 'success');
                } else {
                    employeeData.createdAt = serverTimestamp();
                    await setDoc(docRef, employeeData);
                    showToast(`Đã thêm nhân viên: ${employeeData.name}`, 'success');
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
    document.getElementById('employee-list')?.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.edit-employee-btn');
        if (editBtn) {
            const employeeId = editBtn.dataset.id;
            openEmployeeModal(employeeId);
            return;
        }

        const deleteBtn = e.target.closest('.delete-employee-btn');
        if (!deleteBtn) return;

        const row = deleteBtn.closest('tr');
        const employeeId = row.dataset.id;
        const employeeName = row.querySelector('td:nth-child(2)').textContent;

        showConfirmation(`Bạn có chắc chắn muốn xóa nhân viên "${employeeName}"?`).then(async (confirmed) => {
            if (confirmed) {
                try {
                    await deleteDoc(doc(db, 'employee', employeeId));
                    showToast(`Đã xóa nhân viên: ${employeeName}`, 'success');
                } catch (error) {
                    console.error("Lỗi khi xóa nhân viên:", error);
                    showToast("Đã xảy ra lỗi khi xóa nhân viên.", "error");
                }
            }
        });
    }, { signal });

    // Event delegation cho các nút phân trang
    document.getElementById('pagination-controls')?.addEventListener('click', (e) => {
        const prevBtn = e.target.closest('.prev-page-btn');
        const nextBtn = e.target.closest('.next-page-btn');
        const firstPageBtn = e.target.closest('.first-page-btn');
        const lastPageBtn = e.target.closest('.last-page-btn');
        const prev5PageBtn = e.target.closest('.prev-5-page-btn');
        const next5PageBtn = e.target.closest('.next-5-page-btn');

        const totalPages = Math.ceil(totalEmployees / itemsPerPage);
        let pageChanged = false;
        let direction = 'first';

        if (prevBtn && currentPage > 1) {
            currentPage--;
            pageChanged = true;
            direction = 'prev';
        } else if (nextBtn && currentPage < totalPages) {
            currentPage++;
            pageChanged = true;
            direction = 'next';
        } else if (firstPageBtn && currentPage > 1) {
            currentPage = 1;
            pageChanged = true;
            direction = 'first';
        } else if (lastPageBtn && currentPage < totalPages) {
            currentPage = totalPages;
            pageChanged = true;
            direction = 'last'; // Cần xử lý đặc biệt
        } else if (prev5PageBtn && currentPage > 1) {
            currentPage = Math.max(1, currentPage - 5);
            pageChanged = true;
        } else if (next5PageBtn && currentPage < totalPages) {
            currentPage = Math.min(totalPages, currentPage + 5);
            pageChanged = true;
        }

        if (pageChanged) {
            fetchAndRenderEmployees(direction);
        }
    }, { signal });

    // Event listener cho các tiêu đề cột có thể sắp xếp/lọc
    document.querySelectorAll('#staff-table-header .th-sortable').forEach(th => {
        th.addEventListener('click', showSortFilterPopup, { signal });
    });

    // TODO: Thêm logic cho tìm kiếm, sửa, xóa
}