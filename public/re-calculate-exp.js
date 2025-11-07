/**
 * re-calculate-exp.js (v2 - Sửa lỗi "Cannot use import statement outside a module")
 * 
 * Script chạy một lần để tính toán lại tổng điểm kinh nghiệm (EXP) cho tất cả nhân viên.
 * Script này sẽ đọc toàn bộ collection `schedules`, đếm số task đã hoàn thành (`isComplete: 1`)
 * cho mỗi nhân viên, và cập nhật lại trường `experiencePoints` trong collection `employee`.
 * 
 * CÁCH SỬ DỤNG:
 * 1. Mở trang bất kỳ của ứng dụng trên trình duyệt.
 * 2. Mở Developer Console (F12).
 * 3. Dán toàn bộ nội dung của file này vào console và nhấn Enter.
 * 4. Theo dõi tiến trình trong console.
 */

(async function run() {
    console.log("Đang tải các thư viện cần thiết...");
    // Sử dụng dynamic import() để tải các module, tương thích với Console
    const { db } = await import('./firebase.js');
    const { collection, getDocs, writeBatch, doc } = await import("https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js");
    console.log("Tải thư viện hoàn tất. Bắt đầu thực thi script.");

    // --- Bọc logic chính vào trong hàm này ---

    console.log("🚀 Bắt đầu quá trình tính toán lại EXP cho toàn bộ nhân viên...");
    const EXP_PER_TASK = 5;

    try {
        // --- Bước 1: Tải tất cả lịch sử công việc và nhân viên ---
        console.log("... (1/4) Đang tải dữ liệu lịch làm việc và nhân viên...");
        const [schedulesSnapshot, employeesSnapshot] = await Promise.all([
            getDocs(collection(db, 'schedules')),
            getDocs(collection(db, 'employee'))
        ]);

        const allSchedules = schedulesSnapshot.docs.map(doc => doc.data());
        const allEmployees = employeesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        console.log(`✅ Tải xong! Tìm thấy ${allSchedules.length} lịch làm việc và ${allEmployees.length} nhân viên.`);

        // --- Bước 2: Tính toán EXP cho mỗi nhân viên ---
        console.log("... (2/4) Đang tính toán EXP từ lịch sử...");
        const employeeExpMap = new Map();

        // Khởi tạo EXP cho tất cả nhân viên là 0
        allEmployees.forEach(emp => {
            employeeExpMap.set(emp.id, 0);
        });

        // Duyệt qua lịch sử và cộng dồn EXP
        allSchedules.forEach(schedule => {
            if (!schedule.employeeId || !schedule.tasks) return;

            const completedTasksCount = schedule.tasks.filter(task => task.isComplete === 1).length;
            if (completedTasksCount > 0) {
                const currentExp = employeeExpMap.get(schedule.employeeId) || 0;
                employeeExpMap.set(schedule.employeeId, currentExp + (completedTasksCount * EXP_PER_TASK));
            }
        });

        console.log("✅ Tính toán hoàn tất!");

        // --- Bước 3: Chuẩn bị ghi dữ liệu hàng loạt (Batch Write) ---
        console.log("... (3/4) Đang chuẩn bị cập nhật cơ sở dữ liệu...");
        const batch = writeBatch(db);
        let updatedCount = 0;

        employeeExpMap.forEach((totalExp, employeeId) => {
            const employeeRef = doc(db, 'employee', employeeId);
            batch.update(employeeRef, { experiencePoints: totalExp });
            updatedCount++;
        });

        // --- Bước 4: Commit thay đổi ---
        console.log(`... (4/4) Đang lưu ${updatedCount} bản ghi nhân viên...`);
        await batch.commit();

        console.log("🎉 HOÀN TẤT! Đã cập nhật thành công điểm kinh nghiệm cho toàn bộ nhân viên.");
        alert("Quá trình tính toán và cập nhật EXP đã hoàn tất! Vui lòng kiểm tra lại dữ liệu.");

    } catch (error) {
        console.error("❌ Đã xảy ra lỗi nghiêm trọng trong quá trình tính toán lại EXP:", error);
        alert("Đã có lỗi xảy ra. Vui lòng kiểm tra Developer Console (F12) để biết thêm chi tiết.");
    }
})();