import { db } from './firebase.js';
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let domController = null;
let activeListeners = [];
let allTaskGroups = [];
let allRETasks = [];

/**
 * Fetches all necessary data for the RE Logic view.
 */
async function fetchREData() {
    try {
        const [taskGroupsSnap, reTasksSnap] = await Promise.all([
            getDocs(query(collection(db, 'task_groups'), orderBy('order'))),
            getDocs(query(collection(db, 're_tasks'), orderBy('category'), orderBy('name')))
        ]);

        allTaskGroups = taskGroupsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        allRETasks = reTasksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    } catch (error) {
        window.showToast("Failed to load RE logic data.", "error");
    }
}

/**
 * Renders the main content of the RE Logic view.
 */
function renderREView() {
    const accordionContainer = document.getElementById('re-task-accordion');
    if (!accordionContainer) {
        return;
    }

    if (allTaskGroups.length === 0) {
        accordionContainer.innerHTML = '<p class="text-slate-500">Không tìm thấy nhóm công việc nào.</p>';
        return;
    }

    accordionContainer.innerHTML = allTaskGroups.map(group => {
        const tasksInCategory = allRETasks.filter(task => task.category === group.code);
        const totalRE = tasksInCategory.reduce((sum, task) => sum + (task.dailyHours || 0), 0);

        const taskRows = tasksInCategory.map((task, index) => `
            <tr>
                <td class="p-2 border text-center">${index + 1}</td>
                <td class="p-2 border text-left">${task.name}</td>
                <td class="p-2 border text-center">${task.frequency}</td>
                <td class="p-2 border text-center">${task.reUnit || '-'}</td>
                <td class="p-2 border text-right">${(task.dailyHours || 0).toFixed(2)}</td>
            </tr>
        `).join('');

        return `
            <div class="re-accordion-item border rounded-lg overflow-hidden">
                <button class="re-accordion-toggle w-full text-left p-3 font-semibold flex justify-between items-center bg-slate-50 hover:bg-slate-100">
                    <span>${group.name} (${group.code})</span>
                    <i class="fas fa-chevron-down transition-transform"></i>
                </button>
                <div class="re-accordion-content hidden p-2">
                    <table class="w-full text-sm border-collapse">
                        <thead class="bg-slate-100">
                            <tr>
                                <th class="p-2 border text-center w-12">STT</th>
                                <th class="p-2 border text-left">Task</th>
                                <th class="p-2 border text-center">Tần suất</th>
                                <th class="p-2 border text-center">Unit RE</th>
                                <th class="p-2 border text-right w-24">RE (Giờ)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${taskRows}
                            <tr class="font-bold bg-slate-100">
                                <td colspan="4" class="p-2 border text-right">Tổng giờ ${group.code}</td>
                                <td class="p-2 border text-right">${totalRE.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }).join('');

    attachAccordionListeners();
}

/**
 * Attaches event listeners for the accordion items.
 */
function attachAccordionListeners() {
    document.querySelectorAll('.re-accordion-toggle').forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            const icon = button.querySelector('i');
            content.classList.toggle('hidden');
            icon.classList.toggle('rotate-180');
        });
    });
}

/**
 * Initializes the RE Logic view.
 */
export async function initRELogicView() {
    const reLogicContainer = document.getElementById('re-logic-container');
    
    // Sửa lỗi: Kiểm tra xem một phần tử con cụ thể đã tồn tại chưa, thay vì kiểm tra innerHTML.
    // Điều này đảm bảo template luôn được tải vào lần đầu tiên.
    const isViewLoaded = reLogicContainer.querySelector('#re-logic-main-content');
    if (!isViewLoaded) {
        try {
            const response = await fetch('re-logic.html');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            reLogicContainer.innerHTML = doc.body.innerHTML; // Chèn toàn bộ nội dung từ template
        } catch (error) {
            reLogicContainer.innerHTML = `<p class="text-red-500 p-4">Error loading view.</p>`;
            return;
        }
    }

    await fetchREData();
    renderREView();
}

/**
 * Cleans up listeners for this module.
 */
export function cleanupRELogic() {
    if (domController) {
        domController.abort();
        domController = null;
    }
    activeListeners.forEach(unsubscribe => unsubscribe && unsubscribe());
    activeListeners = [];
}