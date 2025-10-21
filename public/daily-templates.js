import { db } from './firebase.js';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, doc, deleteDoc, updateDoc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let allTemplates = [];
let activeListeners = [];
let domController = null;

const templatesCollection = collection(db, 'daily_templates');

/**
 * Render danh sách các mẫu ra giao diện.
 */
function renderTemplates() {
    const container = document.getElementById('templates-container');
    if (!container) return;

    if (allTemplates.length === 0) {
        container.innerHTML = `<p class="text-gray-500 md:col-span-2 lg:col-span-3 text-center py-10">Chưa có mẫu nào. Hãy tạo một mẫu mới!</p>`;
        return;
    }

    container.innerHTML = allTemplates.map(template => `
        <div class="template-card border border-gray-200 bg-white rounded-lg p-4 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex flex-col">
            <div class="flex-1">
                <div class="flex justify-between items-start">
                    <h3 class="text-base font-semibold text-indigo-800">${template.name}</h3>
                    <span class="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">${template.id}</span>
                </div>
                <p class="text-sm text-gray-600 mt-2 min-h-[40px]">${template.description || 'Không có mô tả.'}</p>
            </div>
            <div class="mt-4 pt-4 border-t flex justify-end gap-2">
                <button data-id="${template.id}" class="apply-template-btn text-sm text-green-700 font-medium hover:underline" title="Áp dụng mẫu này cho một ngày">Áp dụng</button>
                <button data-id="${template.id}" class="edit-template-btn text-sm text-indigo-700 font-medium hover:underline">Sửa</button>
                <button data-id="${template.id}" class="delete-template-btn text-sm text-red-700 font-medium hover:underline">Xóa</button>
            </div>
        </div>
    `).join('');
}

/**
 * Lắng nghe các thay đổi từ collection 'daily_templates'.
 */
function listenForTemplates() {
    const q = query(templatesCollection, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        allTemplates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderTemplates();
    }, (error) => {
        console.error("Lỗi khi lắng nghe thay đổi mẫu: ", error);
        window.showToast("Mất kết nối tới dữ liệu mẫu.", "error");
    });
    activeListeners.push(unsubscribe);
}

/**
 * Dọn dẹp các listener khi chuyển trang.
 */
export function cleanup() {
    activeListeners.forEach(unsubscribe => unsubscribe());
    activeListeners = [];
    if (domController) {
        domController.abort();
    }
}

/**
 * Hàm khởi tạo của module.
 */
export function init() {
    domController = new AbortController();
    const { signal } = domController;

    listenForTemplates();

    const addBtn = document.getElementById('add-template-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            document.getElementById('template-modal-title').textContent = 'Tạo Mẫu Mới';
            document.getElementById('template-form').reset();
            document.getElementById('template-id').value = '';
            
            const modal = document.getElementById('template-modal');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            setTimeout(() => modal.classList.add('show'), 10);
        }, { signal });
    }

    // Đóng modal
    document.body.addEventListener('click', (e) => {
        const modal = document.getElementById('template-modal');
        if (e.target.closest('.modal-close-btn') || e.target === modal) {
            modal.classList.remove('show');
            modal.addEventListener('transitionend', () => modal.classList.add('hidden'), { once: true });
        }
    }, { signal });
}
