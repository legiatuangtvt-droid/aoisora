import { db } from './firebase.js';
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let domController = null;
const timeSlots = ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];

/**
 * Render các ô chọn khung giờ.
 */
function renderTimeSlots() {
    const grid = document.getElementById('time-slots-grid');
    if (!grid) return;

    grid.innerHTML = timeSlots.map(slot => `
        <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors has-[:checked]:bg-green-50 has-[:checked]:border-green-400">
            <input type="checkbox" value="${slot}" class="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
            <span class="ml-3 font-medium text-gray-700">${slot}</span>
        </label>
    `).join('');
}

/**
 * Tải dữ liệu đăng ký đã có cho ngày được chọn và cập nhật UI.
 * @param {string} dateString - Ngày định dạng YYYY-MM-DD.
 */
async function loadAvailabilityForDate(dateString) {
    const currentUser = window.currentUser;
    if (!currentUser || !currentUser.id) {
        window.showToast("Không thể xác định người dùng.", "error");
        return;
    }

    const docId = `${dateString}_${currentUser.id}`;
    const docRef = doc(db, 'staff_availability', docId);

    try {
        const docSnap = await getDoc(docRef);
        // Bỏ chọn tất cả các ô trước khi tải
        document.querySelectorAll('#time-slots-grid input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });

        if (docSnap.exists()) {
            const data = docSnap.data();
            const availableSlots = data.availableSlots || [];
            availableSlots.forEach(slot => {
                const checkbox = document.querySelector(`#time-slots-grid input[value="${slot}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
            window.showToast(`Đã tải lại đăng ký của bạn cho ngày ${dateString.split('-').reverse().join('/')}.`, 'info');
        } else {
             window.showToast(`Bạn chưa có đăng ký nào cho ngày này.`, 'info');
        }
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu đăng ký:", error);
        window.showToast("Không thể tải dữ liệu đã đăng ký.", "error");
    }
}

/**
 * Xử lý sự kiện khi người dùng thay đổi ngày.
 */
function handleDateChange() {
    const dateInput = document.getElementById('availability-date');
    const loadingState = document.getElementById('loading-state');
    const wrapper = document.getElementById('time-slots-wrapper');

    if (dateInput.value) {
        loadingState.classList.add('hidden');
        wrapper.classList.remove('hidden');
        loadAvailabilityForDate(dateInput.value);
    } else {
        loadingState.classList.remove('hidden');
        wrapper.classList.add('hidden');
    }
}

/**
 * Gửi dữ liệu đăng ký lên Firestore.
 */
async function submitAvailability() {
    const currentUser = window.currentUser;
    const date = document.getElementById('availability-date').value;

    if (!currentUser || !currentUser.id) {
        window.showToast("Không thể xác định người dùng. Vui lòng đăng nhập lại.", "error");
        return;
    }
    if (!date) {
        window.showToast("Vui lòng chọn ngày để đăng ký.", "warning");
        return;
    }

    const selectedSlots = Array.from(document.querySelectorAll('#time-slots-grid input:checked')).map(cb => cb.value);

    const docId = `${date}_${currentUser.id}`;
    const docRef = doc(db, 'staff_availability', docId);

    const dataToSave = {
        employeeId: currentUser.id,
        employeeName: currentUser.name,
        date: date,
        availableSlots: selectedSlots,
        updatedAt: serverTimestamp()
    };

    try {
        await setDoc(docRef, dataToSave, { merge: true });
        window.showToast("Đã lưu đăng ký của bạn thành công!", "success");
    } catch (error) {
        console.error("Lỗi khi lưu đăng ký:", error);
        window.showToast("Đã xảy ra lỗi khi lưu. Vui lòng thử lại.", "error");
    }
}

export function cleanup() {
    if (domController) {
        domController.abort();
        domController = null;
    }
}

export function init() {
    domController = new AbortController();
    const { signal } = domController;

    renderTimeSlots();

    const dateInput = document.getElementById('availability-date');
    dateInput.addEventListener('change', handleDateChange, { signal });

    document.getElementById('submit-availability-btn')?.addEventListener('click', submitAvailability, { signal });

    document.getElementById('select-all-btn')?.addEventListener('click', () => {
        document.querySelectorAll('#time-slots-grid input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = true;
        });
    }, { signal });

    document.getElementById('clear-all-btn')?.addEventListener('click', () => {
        document.querySelectorAll('#time-slots-grid input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
    }, { signal });
}