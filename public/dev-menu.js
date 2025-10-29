import { db } from './firebase.js';
import { writeBatch, doc, serverTimestamp, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let allRoles = [];
let allEmployees = [];
let allAreaManagers = [];
let allRegionalManagers = [];
let allPersonnel = []; // Mảng tổng hợp tất cả các cấp nhân viên
let allStores = [];
let allAreas = [];
let allRegions = [];

let simulatedUser = null;
const SIMULATED_USER_STORAGE_KEY = 'simulatedUser';

function initializeDevMenu() {
    // Create and inject HTML
    const menuContainer = document.createElement('div');
    menuContainer.id = 'dev-menu-container';
    menuContainer.innerHTML = `
        <div class="dev-menu-header flex items-center p-2.5 bg-slate-50 border-b border-slate-200 cursor-grab select-none h-[60px] box-border flex-shrink-0 active:cursor-grabbing">
            <span class="dev-menu-icon bg-emerald-500 text-white font-bold text-sm rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">DEV</span>
            <span class="dev-menu-title ml-3 font-semibold text-slate-800 whitespace-nowrap opacity-0 transition-opacity ease-in">Dev Tools</span>
        </div>
        <div class="dev-menu-body p-3 flex flex-col gap-2 opacity-0 invisible transition-opacity delay-100">
            <button id="seed-all-data-btn" class="dev-menu-button flex items-center gap-2.5 px-3 py-2 border border-slate-300 rounded-md bg-white cursor-pointer text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:border-slate-400">
                <i class="fas fa-database"></i>
                <span>Nhập Dữ Liệu Mô Phỏng</span>
            </button>
            <div class="border-t border-slate-200 my-2"></div>
            <div class="dev-menu-title-section">Mô phỏng người dùng</div>
            <div class="dev-menu-section">
                <label for="dev-role-select" class="dev-menu-label"><i class="fas fa-user-tag mr-2 text-slate-500"></i>Chức vụ</label>
                <select id="dev-role-select" class="dev-menu-select"></select>
            </div>
            <div class="dev-menu-section">
                <label for="dev-employee-select" class="dev-menu-label"><i class="fas fa-user mr-2 text-slate-500"></i>Nhân viên</label>
                <select id="dev-employee-select" class="dev-menu-select"></select>
            </div>
            <button id="clear-simulation-btn" class="dev-menu-button flex items-center gap-2.5 px-3 py-2 border border-slate-300 rounded-md bg-white cursor-pointer text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:border-slate-400">
                <i class="fas fa-times-circle"></i>
                <span>Xóa Mô Phỏng</span>
            </button>
        </div>
    `;
    document.body.appendChild(menuContainer);

    // Add functionality
    const header = menuContainer.querySelector('.dev-menu-header');
    const seedAllDataBtn = document.getElementById('seed-all-data-btn');
    const menuBody = menuContainer.querySelector('.dev-menu-body');
    const menuTitle = menuContainer.querySelector('.dev-menu-title');
    const roleSelect = document.getElementById('dev-role-select');
    const clearSimulationBtn = document.getElementById('clear-simulation-btn');
    const employeeSelect = document.getElementById('dev-employee-select');


    // --- Logic lưu/tải trạng thái từ localStorage ---
    const DEV_MENU_STORAGE_KEY = 'devMenuState';

    function saveMenuState() {
        if (!menuContainer) return;
        const state = {
            left: menuContainer.style.left,
            top: menuContainer.style.top,
            expanded: menuContainer.classList.contains('expanded')
        };
        localStorage.setItem(DEV_MENU_STORAGE_KEY, JSON.stringify(state));
    }

    function loadMenuState() {
        const savedState = localStorage.getItem(DEV_MENU_STORAGE_KEY);
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                // Áp dụng vị trí
                if (state.left) menuContainer.style.left = state.left;
                if (state.top) menuContainer.style.top = state.top;

                // Bỏ qua việc tải trạng thái mở/đóng, luôn khởi động ở trạng thái thu gọn.
                
                // Đảm bảo menu không bị ra ngoài màn hình khi tải lại
                const rect = menuContainer.getBoundingClientRect();
                menuContainer.style.left = `${Math.max(0, Math.min(rect.left, window.innerWidth - rect.width))}px`;
                menuContainer.style.top = `${Math.max(0, Math.min(rect.top, window.innerHeight - rect.height))}px`;
            } catch (e) {
                console.error("Lỗi khi đọc trạng thái Dev Menu từ localStorage", e);
            }
        }
    }

    // --- Toggle expand/collapse ---
    header.addEventListener('click', (e) => {
        // Only toggle if not dragging
        if (menuContainer.dataset.isDragging !== 'true') {
            const isCurrentlyExpanded = menuContainer.classList.contains('expanded');

            if (isCurrentlyExpanded) {
                // --- LOGIC THU GỌN ---
                menuBody.classList.add('opacity-0', 'invisible');
                menuTitle.classList.add('opacity-0');
                menuContainer.classList.remove('expanded');

                // Khôi phục vị trí ban đầu nếu nó đã bị di chuyển
                if (menuContainer.dataset.originalLeft) {
                    menuContainer.style.left = menuContainer.dataset.originalLeft;
                    delete menuContainer.dataset.originalLeft;
                }
                if (menuContainer.dataset.originalTop) {
                    menuContainer.style.top = menuContainer.dataset.originalTop;
                    delete menuContainer.dataset.originalTop;
                }
            } else {
                // --- LOGIC MỞ RỘNG ---
                menuBody.classList.remove('opacity-0', 'invisible');
                menuTitle.classList.remove('opacity-0');
                menuContainer.classList.add('expanded');

                // Xử lý chống tràn màn hình khi mở rộng
                const menuRect = menuContainer.getBoundingClientRect();
                const expandedWidth = 250; // Chiều rộng của menu khi mở rộng
                const expandedHeight = 200; // Chiều cao ước tính

                if (menuRect.right > window.innerWidth) {
                    menuContainer.dataset.originalLeft = menuContainer.style.left;
                    menuContainer.style.left = `${window.innerWidth - expandedWidth - 20}px`;
                }
                if (menuRect.bottom > window.innerHeight) {
                    menuContainer.dataset.originalTop = menuContainer.style.top;
                    menuContainer.style.top = `${window.innerHeight - expandedHeight - 20}px`;
                }
            }

            saveMenuState(); // Lưu trạng thái sau khi mở/đóng
        }
    });

    // --- Draggable logic ---
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;
    let ghostElement = null; // Phần tử "ảnh" khi kéo

    header.addEventListener('mousedown', (e) => {
        // Chỉ kéo bằng chuột trái
        if (e.button !== 0) return;

        isDragging = true;
        menuContainer.dataset.isDragging = 'true';
        header.style.cursor = 'grabbing';

        const rect = menuContainer.getBoundingClientRect();
        startX = e.clientX;
        startY = e.clientY;
        initialLeft = rect.left;
        initialTop = rect.top;

        // --- TẠO GHOST ELEMENT (Tối ưu) ---
        // Nếu menu đang thu gọn, chỉ clone header để ghost là hình tròn.
        // Nếu menu đang mở rộng, clone toàn bộ.
        if (menuContainer.classList.contains('expanded')) {
            ghostElement = menuContainer.cloneNode(true);
        } else {
            ghostElement = header.cloneNode(true);
            ghostElement.style.width = `${rect.width}px`;
            ghostElement.style.height = `${rect.height}px`;
            ghostElement.style.borderRadius = '9999px'; // Thêm dòng này để đảm bảo ghost là hình tròn
        }
        ghostElement.id = 'dev-menu-ghost';
        ghostElement.style.left = `${initialLeft}px`;
        ghostElement.style.top = `${initialTop}px`;
        document.body.appendChild(ghostElement);

        menuContainer.classList.add('dragging'); // Làm mờ menu gốc

        // Ngăn chặn việc chọn văn bản khi kéo
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            // Di chuyển ghost element theo chuột
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            let newX = initialLeft + dx;
            let newY = initialTop + dy;

            // Giữ ghost trong màn hình
            const ghostRect = ghostElement.getBoundingClientRect();
            newX = Math.max(0, Math.min(newX, window.innerWidth - ghostRect.width));
            newY = Math.max(0, Math.min(newY, window.innerHeight - ghostRect.height));

            ghostElement.style.left = `${newX}px`;
            ghostElement.style.top = `${newY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            // Di chuyển menu thật đến vị trí của ghost và xóa ghost
            const ghostRect = ghostElement.getBoundingClientRect();
            menuContainer.style.left = `${ghostRect.left}px`;
            menuContainer.style.top = `${ghostRect.top}px`;
            menuContainer.style.bottom = 'auto';
            menuContainer.style.right = 'auto';
            
            saveMenuState(); // Lưu vị trí sau khi kéo thả

            document.body.removeChild(ghostElement);
            ghostElement = null;
            menuContainer.classList.remove('dragging');

            isDragging = false;
            header.style.cursor = 'grab';
            // Use a timeout to differentiate click from drag-end
            setTimeout(() => {
                menuContainer.dataset.isDragging = 'false';
            }, 100);
        }
    });

    // Tải trạng thái đã lưu khi khởi tạo
    loadMenuState();

    // --- Logic mô phỏng người dùng ---
    async function fetchPersonnelData() {
        // Vô hiệu hóa select để tránh người dùng tương tác khi đang tải
        roleSelect.disabled = true;
        employeeSelect.disabled = true;

        try {
            const rolesQuery = query(collection(db, 'roles'), orderBy('name'));
        const [rolesSnap, employeesSnap, areaManagersSnap, regionalManagersSnap, storesSnap, areasSnap, regionsSnap] = await Promise.all([
                getDocs(rolesQuery),
                getDocs(collection(db, 'employee')),
                getDocs(collection(db, 'area_managers')),
            getDocs(collection(db, 'regional_managers')),
            getDocs(collection(db, 'stores')),
            getDocs(collection(db, 'areas')),
            getDocs(collection(db, 'regions')),
            ]);

            allRoles = rolesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            allEmployees = employeesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            allAreaManagers = areaManagersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            allRegionalManagers = regionalManagersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        allStores = storesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        allAreas = areasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        allRegions = regionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            allPersonnel = [...allEmployees, ...allAreaManagers, ...allRegionalManagers];

            populateRoleSelect();
            populateEmployeeSelect();

            // Kiểm tra nếu có người dùng đang được mô phỏng và pre-select dropdowns
            const storedSimulatedUser = localStorage.getItem(SIMULATED_USER_STORAGE_KEY);
            if (storedSimulatedUser) {
                simulatedUser = JSON.parse(storedSimulatedUser);
                if (simulatedUser && simulatedUser.id && simulatedUser.roleId) {
                    roleSelect.value = simulatedUser.roleId;
                    populateEmployeeSelect(simulatedUser.roleId); // Cập nhật danh sách nhân viên đã lọc
                    employeeSelect.value = simulatedUser.id;
                    window.showToast(`Đang mô phỏng: ${simulatedUser.name} (${simulatedUser.roleId})`, 'info');
                }
            } else { // Nếu không có người dùng mô phỏng, mặc định là Admin
                roleSelect.value = 'ADMIN'; // Đặt giá trị mặc định là 'ADMIN'
                employeeSelect.value = '';
                window.showToast('Đang ở chế độ Admin (toàn quyền).', 'info');
            }
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu nhân sự cho Dev Menu:", error);
            roleSelect.innerHTML = `<option>Lỗi tải</option>`;
            employeeSelect.innerHTML = `<option>Lỗi tải</option>`;
        } finally {
            // Kích hoạt lại select sau khi tải xong (dù thành công hay thất bại)
            roleSelect.disabled = false;
            employeeSelect.disabled = false;
        }
    }

    function populateRoleSelect() {
        // Sắp xếp vai trò theo 'level' giảm dần. Vai trò không có level sẽ được coi là 0.
        const sortedRoles = [...allRoles].sort((a, b) => (b.level || 0) - (a.level || 0));
        roleSelect.innerHTML = `<option value="ADMIN">Admin (Toàn quyền)</option>`;
        sortedRoles.forEach(role => {
            roleSelect.innerHTML += `<option value="${role.id}">${role.name}</option>`;
        });
    }

    function populateEmployeeSelect(selectedRoleId = 'all') {
        const filteredPersonnel = (selectedRoleId === 'all')
            ? [...allPersonnel] // Nếu là 'all', lấy tất cả nhân viên
            : allPersonnel.filter(p => p.roleId === selectedRoleId); // Lọc theo roleId

        // Sắp xếp danh sách: ưu tiên nhóm theo cửa hàng, sau đó sắp xếp theo tên
        filteredPersonnel.sort((a, b) => {
            // Xử lý trường hợp nhân viên không có cửa hàng (ví dụ: quản lý cấp cao)
            const storeA = a.storeId || 'ZZZ'; // Đẩy những người không có cửa hàng xuống cuối
            const storeB = b.storeId || 'ZZZ';

            if (storeA < storeB) return -1;
            if (storeA > storeB) return 1;

            // Nếu cùng cửa hàng, sắp xếp theo tên
            return a.name.localeCompare(b.name, 'vi');
        });
    
        // Tạo HTML cho các option và cập nhật một lần để tối ưu hiệu năng
        const optionsHtml = filteredPersonnel.map(person => {
            let contextInfo = '';
            switch (person.roleId) {
                case 'STAFF':
                case 'STORE_LEADER':
                    const store = allStores.find(s => s.id === person.storeId);
                    if (store) contextInfo = ` - ${store.name}`;
                    break;
                case 'AREA_MANAGER':
                    if (person.managedAreaIds && person.managedAreaIds.length > 0) {
                        const area = allAreas.find(a => a.id === person.managedAreaIds[0]);
                        if (area) contextInfo = ` - ${area.name}`;
                    }
                    break;
                case 'REGIONAL_MANAGER':
                    const region = allRegions.find(r => r.id === person.managedRegionId);
                    if (region) contextInfo = ` - ${region.name}`;
                    break;
            }
            return `<option value="${person.id}">${person.name}${contextInfo}</option>`;
        }).join('');
    
        employeeSelect.innerHTML = `<option value="">-- Chọn nhân viên --</option>${optionsHtml}`;
    }

    roleSelect.addEventListener('change', () => {
        const selectedRole = roleSelect.value;
        if (selectedRole === 'ADMIN') {
            // Nếu chọn Admin, xóa mô phỏng và tải lại trang
            if (localStorage.getItem(SIMULATED_USER_STORAGE_KEY)) {
                localStorage.removeItem(SIMULATED_USER_STORAGE_KEY);
                window.location.reload();
            }
        } else {
            populateEmployeeSelect(selectedRole);
        }
    });

    employeeSelect.addEventListener('change', () => {
        const selectedEmployeeId = employeeSelect.value;
        if (selectedEmployeeId) {
            const selectedPerson = allPersonnel.find(p => p.id === selectedEmployeeId);
            if (selectedPerson) { // Lưu toàn bộ thông tin cần thiết của người dùng mô phỏng
                simulatedUser = {
                    id: selectedPerson.id,
                    name: selectedPerson.name,
                    roleId: selectedPerson.roleId,
                    storeId: selectedPerson.storeId || null,
                    managedAreaIds: selectedPerson.managedAreaIds || null,
                    managedRegionId: selectedPerson.managedRegionId || null
                };
                localStorage.setItem(SIMULATED_USER_STORAGE_KEY, JSON.stringify(simulatedUser));
                window.showToast(`Chuyển sang người dùng: ${selectedPerson.name} (${selectedPerson.roleId})`, 'info');

                if (selectedPerson.roleId === 'STAFF') {
                    window.location.href = 'staff-schedule.html'; // Điều hướng đến trang lịch làm việc của nhân viên
                } else {
                    window.location.href = 'daily-schedule.html'; // Điều hướng đến trang mặc định cho các vai trò khác
                }
            }
        }
    });

    // Xử lý nút "Xóa Mô Phỏng"
    clearSimulationBtn.addEventListener('click', () => {
        if (localStorage.getItem(SIMULATED_USER_STORAGE_KEY)) {
            localStorage.removeItem(SIMULATED_USER_STORAGE_KEY);
            simulatedUser = null;
            window.showToast('Đã quay lại chế độ Admin.', 'info');
            window.location.href = 'daily-schedule.html'; // Quay về trang lịch ngày mặc định
        } else {
            window.showToast('Không có người dùng nào đang được mô phỏng.', 'warning');
        }
    });

    fetchPersonnelData();

    // --- Seed data logic ---
    seedAllDataBtn.addEventListener('click', async () => {
        // Loại bỏ hộp thoại xác nhận theo yêu cầu, thay bằng toast.
        window.showToast('Bắt đầu nhập dữ liệu mô phỏng...', 'info');

        try {
            const response = await fetch('data.json');
            if (!response.ok) throw new Error('Không thể tải file data.json');
            
            const data = await response.json();
            const batch = writeBatch(db);

            // --- Bước 1: Xóa dữ liệu cũ ---
            window.showToast('Bước 1/2: Đang xóa dữ liệu cũ...', 'info');
            const collectionsToDelete = [
                'daily_templates',
                'staff', 
                'staff_statuses', 
                'task_groups', 
                'roles', 
                'stores', 
                'store_statuses', 
                'schedules',
                'employee', 
                'area_managers', 
                'regional_managers', 
                'areas', 
                'regions', 
                'employee_statuses',
                'staff_availability', 
                'work_assignments', 
                'work_positions'
            ];
            
            const deleteBatch = writeBatch(db);
            for (const collName of collectionsToDelete) {
                // Bỏ qua nếu collection không tồn tại trong data.json để tránh lỗi không cần thiết
                if (data[collName] === undefined && !['staff', 'staff_statuses'].includes(collName)) continue;

                const collRef = collection(db, collName);
                const snapshot = await getDocs(collRef);
                snapshot.forEach(doc => {
                    deleteBatch.delete(doc.ref);
                });
            }
            await deleteBatch.commit();

            // --- Bước 2: Nhập dữ liệu mới ---
            window.showToast('Bước 2/2: Đang nhập dữ liệu mới...', 'info');
            const addBatch = writeBatch(db);

            // Hàm trợ giúp để seed một collection
            const seedCollection = (collectionName, items) => {
                items?.forEach(item => { // Ưu tiên sử dụng trường 'id' làm document ID.
                    if (!item.id) return;

                    const docRef = doc(db, collectionName, item.id);
                    const dataToSet = { ...item };
                    delete dataToSet.id; // Xóa trường id khỏi dữ liệu lưu trữ vì nó đã được dùng làm key

                    // Xử lý đặc biệt cho daily_templates để sử dụng serverTimestamp
                    if (collectionName === 'daily_templates') {
                        delete dataToSet.createdAt; // Xóa chuỗi timestamp từ JSON
                        delete dataToSet.updatedAt; // Xóa chuỗi timestamp từ JSON
                        addBatch.set(docRef, {
                            ...dataToSet,
                            createdAt: serverTimestamp(),
                            updatedAt: serverTimestamp()
                        });
                    } else {
                        addBatch.set(docRef, { ...dataToSet, createdAt: serverTimestamp() });
                    }
                });
            };

            // Seed Stores
            data.stores?.forEach(store => {
                if (store.id && store.name) {
                    const docRef = doc(db, 'stores', store.id);
                    addBatch.set(docRef, {
                        name: store.name,
                        areaId: store.areaId || '',
                        address: store.address || '',
                        status: store.status || 'ACTIVE'
                    });
                }
            });

            // Seed các collection còn lại
            seedCollection('roles', data.roles);
            seedCollection('employee', data.employee);
            seedCollection('area_managers', data.area_managers);
            seedCollection('regional_managers', data.regional_managers);
            seedCollection('areas', data.areas);
            seedCollection('regions', data.regions);
            seedCollection('employee_statuses', data.employee_statuses);
            seedCollection('store_statuses', data.store_statuses);            
            seedCollection('task_groups', data.task_groups);
            seedCollection('daily_templates', data.daily_templates);
            seedCollection('work_positions', data.work_positions);

            // Seed Schedules
            data.schedules?.forEach(schedule => {
                if (schedule.date && schedule.staffId) {
                    // Tạo ID tự động cho lịch làm việc để tránh trùng lặp
                    const docRef = doc(collection(db, 'schedules'));
                    addBatch.set(docRef, schedule);
                }
            });

            await addBatch.commit();
            window.showToast('Hoàn tất! Đã nhập toàn bộ dữ liệu mẫu.', 'success', 4000);
        } catch (error) {
            console.error("Lỗi khi nhập dữ liệu mẫu: ", error);
            window.showToast("Lỗi khi nhập dữ liệu. Vui lòng kiểm tra console.", "error");
        }
    });
}

export { initializeDevMenu };