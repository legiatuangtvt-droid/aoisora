import { db } from './firebase.js';
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let allStaff = [];
let sortableInstances = [];

/**
 * Tải danh sách nhân viên từ Firestore.
 */
async function fetchStaff() {
    try {
        const staffQuery = query(collection(db, 'staff'), orderBy('name'));
        const staffSnapshot = await getDocs(staffQuery);
        allStaff = staffSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Lỗi khi tải danh sách nhân viên:", error);
        const container = document.getElementById('template-builder-grid-container');
        if(container) container.innerHTML = `<div class="p-10 text-center text-red-500">Không thể tải danh sách nhân viên. Vui lòng thử lại.</div>`;
    }
}

/**
 * Render toàn bộ lưới xây dựng lịch trình.
 */
function renderGrid() {
    const container = document.getElementById('template-builder-grid-container');
    if (!container) return;

    const timeSlots = Array.from({ length: 16 }, (_, i) => `${i + 6}:00`); // 6:00 -> 21:00

    // Tạo bảng
    const table = document.createElement('table');
    table.className = 'min-w-full border-collapse border border-slate-200';

    // --- Tạo Header (Tên nhân viên) ---
    const thead = document.createElement('thead');
    thead.className = 'bg-slate-100 sticky top-0 z-20'; // Tăng z-index để header nổi trên các ô sticky
    let headerRowHtml = `<th class="p-2 border border-slate-200 w-48 sticky left-0 bg-slate-100 z-30">Nhân viên</th>`; // Cột Nhân viên, sticky
    timeSlots.forEach(time => {
        headerRowHtml += `
            <th class="p-2 border border-slate-200 min-w-[280px] text-center font-semibold text-slate-700">${time}</th>
        `;
    });
    thead.innerHTML = `<tr>${headerRowHtml}</tr>`;
    table.appendChild(thead);

    // --- Tạo Body (Các hàng thời gian và ô kéo thả) ---
    const tbody = document.createElement('tbody');
    allStaff.forEach(staff => {
        let bodyRowHtml = `
            <td class="p-2 border border-slate-200 align-top sticky left-0 bg-white z-10">
                <div class="font-semibold text-slate-700">${staff.name}</div>
                <div class="text-xs text-slate-500 font-normal">${staff.roleId || ''}</div>
            </td>
        `; // Ô thông tin nhân viên, sticky

        timeSlots.forEach(time => {
            // Mỗi ô lớn chứa 4 ô 15 phút
            bodyRowHtml += `
                <td class="p-0 border border-slate-200 align-top">
                    <div class="grid grid-cols-4 h-[100px]">
                        <div class="quarter-hour-slot border-r border-dashed border-slate-200" data-staff-id="${staff.id}" data-time="${time}" data-quarter="00"></div>
                        <div class="quarter-hour-slot border-r border-dashed border-slate-200" data-staff-id="${staff.id}" data-time="${time}" data-quarter="15"></div>
                        <div class="quarter-hour-slot border-r border-dashed border-slate-200" data-staff-id="${staff.id}" data-time="${time}" data-quarter="30"></div>
                        <div class="quarter-hour-slot" data-staff-id="${staff.id}" data-time="${time}" data-quarter="45"></div>
                    </div>
                </td>
            `;
        });
        tbody.innerHTML += `<tr>${bodyRowHtml}</tr>`;
    });
    table.appendChild(tbody);

    container.innerHTML = ''; // Xóa nội dung "đang tải"
    container.appendChild(table);

    initializeDragAndDrop();
}

/**
 * Khởi tạo chức năng kéo thả cho các ô 15 phút.
 */
function initializeDragAndDrop() {
    // Hủy các instance cũ để tránh rò rỉ bộ nhớ
    sortableInstances.forEach(s => s.destroy());
    sortableInstances = [];

    document.querySelectorAll('.quarter-hour-slot').forEach(slot => {
        const sortable = Sortable.create(slot, {
            group: {
                name: 'template-tasks',
                pull: true,
                put: true // Cho phép nhận task từ thư viện
            },
            animation: 150,
            onAdd: function (evt) {
                // Khi một task được kéo vào, tùy chỉnh lại giao diện của nó
                const item = evt.item;
                item.className = 'bg-indigo-100 text-indigo-800 text-xs p-1 m-0.5 rounded-sm shadow-sm cursor-pointer truncate';
                item.innerHTML += `<button class="delete-task-btn float-right font-bold text-indigo-400 hover:text-indigo-700">×</button>`;
            }
        });
        sortableInstances.push(sortable);
    });

    // Thêm listener để xóa task
    const gridContainer = document.getElementById('template-builder-grid-container');
    if (gridContainer) {
        gridContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('delete-task-btn')) {
                e.target.parentElement.remove();
            }
        });
    }
}

export async function init() {
    await fetchStaff();
    renderGrid();
}

export function cleanup() {
    sortableInstances.forEach(s => s.destroy());
    sortableInstances = [];
}