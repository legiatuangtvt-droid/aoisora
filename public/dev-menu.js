import { db } from './firebase.js';
import { writeBatch, doc, serverTimestamp, collection, getDocs, query, orderBy, where } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

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
            <span class="dev-menu-title ml-3 font-semibold text-slate-800 whitespace-nowrap opacity-0 transition-opacity ease-in">Công cụ Dev</span>
        </div>
        <div class="dev-menu-body p-3 flex flex-col gap-2 opacity-0 invisible transition-opacity delay-100">
            <button id="seed-all-data-btn" class="dev-menu-button flex items-center gap-2.5 px-3 py-2 border border-slate-300 rounded-md bg-white cursor-pointer text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:border-slate-400">
                <i class="fas fa-database"></i>
                <span>Nhập Dữ Liệu Mô Phỏng</span>
            </button>
            <button id="apply-template-all-stores-btn" class="dev-menu-button flex items-center gap-2.5 px-3 py-2 border border-slate-300 rounded-md bg-white cursor-pointer text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:border-slate-400">
                <i class="fas fa-store"></i>
                <span>Áp dụng Template</span>
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
    const applyTemplateBtn = document.getElementById('apply-template-all-stores-btn');
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
                case 'STORE_LEADER_G2':
                case 'STORE_LEADER_G3':
                    const store = allStores.find(s => s.id === person.storeId);
                    if (store) contextInfo = ` - ${store.name}`;
                    break;
                case 'STORE_INCHARGE':
                    if (Array.isArray(person.managedStoreIds) && person.managedStoreIds.length > 0) {
                        const managedStoreNames = person.managedStoreIds.map(id => allStores.find(s => s.id === id)?.name).filter(Boolean);
                        if (managedStoreNames.length > 0) contextInfo = ` - (Quản lý: ${managedStoreNames.join(', ')})`;
                    }
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
                    storeId: selectedPerson.storeId || null, // Thêm dòng này
                    managedAreaIds: selectedPerson.managedAreaIds || null,
                    managedRegionId: selectedPerson.managedRegionId || null
                };
                localStorage.setItem(SIMULATED_USER_STORAGE_KEY, JSON.stringify(simulatedUser));
                window.showToast(`Chuyển sang người dùng: ${selectedPerson.name} (${selectedPerson.roleId})`, 'info');

                window.location.href = 'daily-schedule.html'; // Luôn điều hướng đến trang lịch hàng ngày
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

    if (applyTemplateBtn) {
        applyTemplateBtn.addEventListener('click', applyTemplateToAllStores);
    }

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

            await addBatch.commit();
            window.showToast('Hoàn tất! Đã nhập toàn bộ dữ liệu mẫu.', 'success', 4000);
        } catch (error) {
            console.error("Lỗi khi nhập dữ liệu mẫu: ", error);
            window.showToast("Lỗi khi nhập dữ liệu. Vui lòng kiểm tra console.", "error");
        }
    });
}

/**
 * Áp dụng một template được chọn cho tất cả các cửa hàng vào một ngày cụ thể.
 * Chức năng này được kích hoạt từ Dev Menu.
 */
async function applyTemplateToAllStores() {
    const btn = document.getElementById('apply-template-all-stores-btn');
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Đang xử lý...';

    try {
        // 1. Lấy danh sách templates
        const templatesSnap = await getDocs(query(collection(db, 'daily_templates'), orderBy('name')));
        const allTemplates = templatesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const templateNames = allTemplates.map(t => t.name).join(', ');

        // Lấy tên mẫu đầu tiên làm giá trị mặc định
        const defaultTemplateName = allTemplates.length > 0 ? allTemplates[0].name : '';

        // 2. Yêu cầu người dùng nhập tên template
        const templateName = await window.showPrompt(
            `Nhập tên mẫu. Các mẫu có sẵn: ${templateNames}`,
            'Chọn mẫu lịch trình',
            defaultTemplateName // Mặc định là mẫu đầu tiên trong danh sách
        );

        if (!templateName) {
            window.showToast('Hủy thao tác.', 'info');
            return;
        }

        const template = allTemplates.find(t => t.name.toLowerCase() === templateName.toLowerCase().trim());
        if (!template || !template.schedule || !template.shiftMappings) {
            throw new Error(`Template "${templateName}" không hợp lệ hoặc không có dữ liệu ca làm việc.`);
        }

        // 3. Yêu cầu người dùng nhập ngày
        const dateString = await window.showPrompt(
            'Nhập ngày bạn muốn tạo lịch (YYYY-MM-DD):',
            'Áp dụng Lịch trình cho tất cả cửa hàng',
            new Date().toISOString().split('T')[0] // Gợi ý ngày hôm nay
        );

        if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            window.showToast('Ngày không hợp lệ. Vui lòng nhập theo định dạng YYYY-MM-DD.', 'error');
            return;
        }

        // Hỏi xác nhận trước khi xóa và tạo mới
        const confirmed = await window.showConfirmation(
            `Bạn có chắc chắn muốn XÓA TẤT CẢ lịch làm việc của ngày ${dateString} và tạo lại từ mẫu "${template.name}" không?`,
            'Xác nhận tạo lịch hàng loạt',
            'Xóa và Tạo mới',
            'Hủy'
        );

        if (!confirmed) {
            window.showToast('Đã hủy thao tác.', 'info');
            return;
        }

        window.showToast(`Bắt đầu tạo lịch cho ngày ${dateString} từ mẫu "${template.name}"...`, 'info');

        // 4. Lấy dữ liệu cần thiết
        const { schedule: templateSchedule, shiftMappings } = template;
        const batch = writeBatch(db);

        // --- BƯỚC MỚI: Xóa tất cả lịch trình cũ trong ngày đã chọn ---
        const oldSchedulesQuery = query(collection(db, 'schedules'), where('date', '==', dateString));
        const oldSchedulesSnap = await getDocs(oldSchedulesQuery);
        oldSchedulesSnap.forEach(doc => batch.delete(doc.ref));
        if (!oldSchedulesSnap.empty) {
            window.showToast(`Đã xóa ${oldSchedulesSnap.size} lịch làm việc cũ của ngày ${dateString}.`, 'info');
        }

        const storesSnap = await getDocs(collection(db, 'stores'));
        const allStores = storesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const employeesSnap = await getDocs(collection(db, 'employee'));
        const allEmployees = employeesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        // Tải dữ liệu đăng ký ca của nhân viên cho ngày đã chọn (Quy tắc 5)
        const availabilityQuery = query(collection(db, 'staff_availability'), where('date', '==', dateString));
        const availabilitySnap = await getDocs(availabilityQuery);
        const allAvailabilities = availabilitySnap.docs.map(doc => doc.data());


        let schedulesCreatedCount = 0;

        // 5. Lặp qua tất cả cửa hàng và tạo lịch
        // QUY TẮC TẠO LỊCH (áp dụng theo thứ tự ưu tiên từ 1->5):
        // 1. Mỗi lịch làm việc phải phân công chính xác số lượng vị trí (ca làm việc) theo mẫu.
        // 2. Chỉ nhân viên có vai trò leader (level 1x) mới được phân công vào vị trí "LEADER".
        // 3. Trường hợp cửa hàng chỉ có 1 leader nhưng mẫu yêu cầu 2 ca LEADER, leader đó sẽ được phân công cả 2 ca.
        // 4. Vị trí làm việc phải đảm bảo theo giá trị balance tại work_postitions theo mỗi nhân viên để đảm bảo sự công bằng tương đối,
        // tránh một nhân viên bị phân công 1 vị trí quá nhiều (trừ vị trí leader).
        // 5. Nếu có dữ liệu đăng ký ưu tiên ca của nhân viên tại collection 'staff_availability' thì ưu tiên phân công ca đó cho nhân viên đó.

        for (const store of allStores) {
            const storeEmployees = allEmployees.filter(emp => emp.storeId === store.id && emp.status === 'ACTIVE');
            const employeeAvailabilities = allAvailabilities.filter(a => storeEmployees.some(e => e.id === a.employeeId));

            let assignedShifts = new Set(); // Theo dõi các ca đã được phân công: "shiftId"
            let assignedEmployees = new Map(); // Theo dõi nhân viên đã được phân công và vị trí của họ: { employeeId: [positionId1, positionId2] }
            let neededShifts = { ...shiftMappings }; // Clone các ca cần lấp đầy

            // --- BƯỚC 1: ƯU TIÊN PHÂN CÔNG THEO ĐĂNG KÝ CỦA NHÂN VIÊN (QUY TẮC 5) ---
            employeeAvailabilities.sort((a, b) => (a.registrations[0]?.priority || 3) - (b.registrations[0]?.priority || 3)); // Ưu tiên priority 1

            for (const availability of employeeAvailabilities) {
                for (const registration of availability.registrations) {
                    if (!registration.shiftCode) continue;

                    // Tìm ca trong template khớp với đăng ký của nhân viên
                    const matchingShiftId = Object.keys(neededShifts).find(shiftId =>
                        neededShifts[shiftId].shiftCode === registration.shiftCode && !assignedShifts.has(shiftId)
                    );

                    if (matchingShiftId && !assignedEmployees.has(availability.employeeId)) {
                        const { positionId } = neededShifts[matchingShiftId];
                        // Phân công và đánh dấu
                        assignedShifts.add(matchingShiftId);
                        assignedEmployees.set(availability.employeeId, [positionId]);
                        delete neededShifts[matchingShiftId];
                        break; // Mỗi nhân viên chỉ được xếp 1 ca ở bước này
                    }
                }
            }

            // --- BƯỚC 2: PHÂN CÔNG CÁC VỊ TRÍ LEADER CÒN LẠI (QUY TẮC 2 & 3) ---
            const leaderShifts = Object.keys(neededShifts).filter(id => neededShifts[id].positionId === 'LEADER');
            if (leaderShifts.length > 0) {
                const leadersInStore = storeEmployees.filter(emp => emp.roleId.includes('LEADER'));
                for (const shiftId of leaderShifts) {
                    let leaderToAssign = leadersInStore.find(l => !assignedEmployees.has(l.id));
                    // Nếu không còn leader trống và cửa hàng chỉ có 1 leader, cho phép leader đó làm nhiều ca
                    if (!leaderToAssign && leadersInStore.length === 1) {
                        leaderToAssign = leadersInStore[0];
                    }
                    if (leaderToAssign) {
                        assignedShifts.add(shiftId);
                        const currentAssignments = assignedEmployees.get(leaderToAssign.id) || [];
                        assignedEmployees.set(leaderToAssign.id, [...currentAssignments, 'LEADER']);
                        delete neededShifts[shiftId];
                    }
                }
            }

            // --- BƯỚC 3: PHÂN CÔNG CÁC VỊ TRÍ CÒN LẠI THEO BALANCE (QUY TẮC 4) ---
            const remainingShiftIds = Object.keys(neededShifts);
            const availableEmployees = storeEmployees.filter(emp => !assignedEmployees.has(emp.id));

            for (const shiftId of remainingShiftIds) {
                const { positionId } = neededShifts[shiftId];
                if (positionId === 'LEADER') continue; // Bỏ qua leader vì đã xử lý

                // Sắp xếp nhân viên còn lại dựa trên "sự thiếu hụt" vị trí này
                availableEmployees.sort((a, b) => {
                    const assignmentsA = assignedEmployees.get(a.id) || [];
                    const assignmentsB = assignedEmployees.get(b.id) || [];
                    const shortageA = (assignmentsA.filter(p => p === positionId).length / (assignmentsA.length || 1));
                    const shortageB = (assignmentsB.filter(p => p === positionId).length / (assignmentsB.length || 1));
                    return shortageA - shortageB; // Ưu tiên người có tỷ lệ làm vị trí này thấp hơn
                });

                const employeeToAssign = availableEmployees.shift(); // Lấy người phù hợp nhất
                if (employeeToAssign) {
                    assignedShifts.add(shiftId);
                    assignedEmployees.set(employeeToAssign.id, [positionId]); // Gán ca đầu tiên cho họ
                    delete neededShifts[shiftId];
                }
            }

            // --- BƯỚC 4: TẠO CÁC BẢN GHI LỊCH TRÌNH ---
            for (const shiftId of assignedShifts) {
                const mapping = shiftMappings[shiftId];
                // Tìm nhân viên được gán cho ca này
                const employeeId = [...assignedEmployees.entries()].find(([empId, positions]) => {
                    // Logic này cần được xem lại nếu 1 nhân viên có thể làm nhiều ca khác nhau
                    // Hiện tại, ta giả định 1 nhân viên được gán vào 1 ca (trừ leader)
                    const assignedShiftForEmp = Object.keys(shiftMappings).find(sId => assignedShifts.has(sId) && empId === [...assignedEmployees.keys()][[...assignedShifts].indexOf(sId)]);
                    return shiftId === assignedShiftForEmp;
                })?.[0];

                // Tìm nhân viên được phân công cho ca này
                const assignedEmployeeEntry = [...assignedEmployees.entries()].find(([empId, posIds]) => {
                    // Tìm xem nhân viên này có được gán vào ca hiện tại không
                    // Đây là một logic đơn giản, có thể cần cải tiến nếu 1 nhân viên làm nhiều ca
                    return posIds.includes(mapping.positionId);
                });

                if (assignedEmployeeEntry) {
                    const [employeeId, posIds] = assignedEmployeeEntry;
                    // Xóa vị trí đã dùng để nhân viên có thể được gán cho ca khác (nếu logic cho phép)
                    posIds.splice(posIds.indexOf(mapping.positionId), 1);

                    const tasks = (templateSchedule[shiftId] || []).map(task => ({
                        groupId: task.groupId, startTime: task.startTime, taskCode: task.taskCode, name: task.taskName
                    }));
                    const newScheduleDoc = { date: dateString, employeeId, storeId: store.id, shift: mapping.shiftCode, positionId: mapping.positionId, tasks };
                    const scheduleRef = doc(collection(db, 'schedules'));
                    batch.set(scheduleRef, newScheduleDoc);
                    schedulesCreatedCount++;
                }
            }
        }

        // 6. Ghi dữ liệu vào Firestore
        await batch.commit();
        window.showToast(`Hoàn tất! Đã tạo ${schedulesCreatedCount} lịch làm việc cho ${allStores.length} cửa hàng.`, 'success', 5000);

    } catch (error) {
        console.error("Lỗi khi áp dụng template cho tất cả cửa hàng:", error);
        window.showToast(`Đã xảy ra lỗi: ${error.message}`, 'error');
    } finally {
        btn.disabled = false;
        btn.querySelector('span').textContent = 'Áp dụng Template';
    }
}

export { initializeDevMenu };