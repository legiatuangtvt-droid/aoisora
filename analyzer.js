const fs = require('fs-extra');
const path = require('path');
const cheerio = require('cheerio');
const chalk = require('chalk');

const projectDir = __dirname;

console.log(chalk.blue.bold('🚀 Bắt đầu chạy AoiSora Analyzer...'));

/**
 * =================================================================
 * CHỨC NĂNG 1: CẬP NHẬT TÀI LIỆU THUYẾT MINH
 * Phân tích các file HTML để tạo ra file mô tả dự án.
 * =================================================================
 */
async function generateDocumentation() {
    console.log(chalk.cyan('\n[1] Đang cập nhật tài liệu thuyết minh...'));
    const htmlFiles = (await fs.readdir(projectDir)).filter(file => file.endsWith('.html') && file !== 'AOI SORA.html');
    let docContent = `## TÀI LIỆU THUYẾT MINH DỰ ÁN "AOISORA" - HỆ THỐNG QUẢN LÝ LỊCH LÀM VIỆC\n\n`;
    docContent += `**Phiên bản:** 1.1 (Tự động tạo)\n`;
    docContent += `**Ngày cập nhật:** ${new Date().toISOString().split('T')[0]}\n\n`;
    docContent += `### 1. TỔNG QUAN DỰ ÁN\n\n**AoiSora** là một ứng dụng web quản lý và phân công lịch làm việc cho nhân viên.\n\n`;

    docContent += `### 2. PHÂN TÍCH CÁC TRANG\n\n`;

    const pageDetails = [];

    for (const file of htmlFiles) {
        const filePath = path.join(projectDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const $ = cheerio.load(content);

        const title = $('title').text().trim() || 'Không có tiêu đề';
        const scripts = $('script:not([src])').length > 0 ? 'Có' : 'Không';
        const styles = $('style').length > 0 ? 'Có' : 'Không';
        const links = [];
        $('a[href]').each((i, el) => {
            const href = $(el).attr('href');
            if (href && href.endsWith('.html')) {
                links.push(href.replace(/^\//, ''));
            }
        });

        docContent += `#### 2.${htmlFiles.indexOf(file) + 1}. Trang: ${file} (${title})\n`;
        docContent += `- **Mô tả:** Trang dùng để "${title}".\n`;
        docContent += `- **JavaScript nội tuyến:** ${scripts}.\n`;
        docContent += `- **CSS nội tuyến:** ${styles}.\n`;
        docContent += `- **Liên kết đến:** ${[...new Set(links)].join(', ') || 'Không có'}\n\n`;

        pageDetails.push({ name: file, links: [...new Set(links)] });
    }

    docContent += `### 3. QUAN HỆ TƯƠNG TÁC GIỮA CÁC TRANG\n\n`;
    pageDetails.forEach(page => {
        if (page.links.length > 0) {
            page.links.forEach(link => {
                docContent += `- Từ \`${page.name}\` có thể điều hướng tới \`${link}\`.\n`;
            });
        }
    });

    await fs.writeFile(path.join(projectDir, 'descripble_auto.txt'), docContent);
    console.log(chalk.green('✅  Đã tạo thành công file `descripble_auto.txt`!'));
}

/**
 * =================================================================
 * CHỨC NĂNG 2: KIỂM TRA TÍNH NĂNG CỐT LÕI
 * Đảm bảo các thành phần quan trọng vẫn tồn tại và hoạt động.
 * =================================================================
 */
async function checkCoreFeatures() {
    console.log(chalk.cyan('\n[2] Đang kiểm tra các tính năng cốt lõi...'));
    let allChecksPassed = true;
    const results = [];

    // Hàm trợ giúp để kiểm tra
    const check = (description, condition) => {
        if (condition) {
            results.push(chalk.green(`  [PASS] `) + description);
        } else {
            results.push(chalk.red(`  [FAIL] `) + description);
            allChecksPassed = false;
        }
    };

    // --- Kiểm tra file index.html ---
    const indexPath = path.join(projectDir, 'daily-schedule.html');
    if (await fs.pathExists(indexPath)) {
        const indexContent = await fs.readFile(indexPath, 'utf-8');
        const $index = cheerio.load(indexContent);

        check('Trang `daily-schedule.html` phải tồn tại.', true);
        check('`daily-schedule.html` phải có container `#schedule-container` để render lịch.', $index('#schedule-container').length > 0);
        check('`daily-schedule.html` phải có ô nhập ngày `#date`.', $index('#date').length > 0);
        check('`daily-schedule.html` phải có nút "Thêm Lịch" `#main-add-schedule-btn`.', $index('#main-add-schedule-btn').length > 0);
        check('`daily-schedule.html` phải import thư viện `Sortable.min.js`.', indexContent.includes('Sortable.min.js'));

    } else {
        check('Trang `daily-schedule.html` phải tồn tại.', false);
    }

    // --- Kiểm tra file main-tasks.html ---
    const mainTasksPath = path.join(projectDir, 'main-tasks.html');
    if (await fs.pathExists(mainTasksPath)) {
        const tasksContent = await fs.readFile(mainTasksPath, 'utf-8');
        const $tasks = cheerio.load(tasksContent);

        check('Trang `main-tasks.html` phải tồn tại.', true);
        check('`main-tasks.html` phải có bảng `#main-tasks-list` để hiển thị công việc.', $tasks('#main-tasks-list').length > 0);
        check('`main-tasks.html` phải có modal `#task-modal` để thêm công việc.', $tasks('#task-modal').length > 0);
        check('`main-tasks.html` phải chứa dữ liệu giả lập `const mainTasks`.', tasksContent.includes('const mainTasks'));

    } else {
        check('Trang `main-tasks.html` phải tồn tại.', false);
    }

    // --- Kiểm tra file data.json ---
    const dataPath = path.join(projectDir, 'public', 'data.json');
    if (await fs.pathExists(dataPath)) {
        check('File `public/data.json` phải tồn tại.', true);
        try {
            const dataContent = await fs.readFile(dataPath, 'utf-8');
            const data = JSON.parse(dataContent);
            check('`public/data.json` phải là một file JSON hợp lệ.', true);
            check('`data.json` phải chứa mảng `staff`.', Array.isArray(data.staff));
            check('`data.json` phải chứa mảng `main_tasks`.', Array.isArray(data.main_tasks));
            check('`data.json` phải chứa mảng `schedules`.', Array.isArray(data.schedules));
        } catch (e) {
            check('`public/data.json` phải là một file JSON hợp lệ.', false);
        }
    } else {
        check('File `public/data.json` phải tồn tại.', false);
    }

    // --- Kiểm tra file output.css ---
    const stylePath = path.join(projectDir, 'public', 'output.css');
    check('File `public/output.css` (được build từ Tailwind) phải tồn tại.', await fs.pathExists(stylePath));

    // In kết quả
    results.forEach(res => console.log(res));
    if (allChecksPassed) {
        console.log(chalk.green.bold('✅  Tất cả các kiểm tra cốt lõi đều thành công! Hệ thống có vẻ ổn định.'));
    } else {
        console.log(chalk.red.bold('❌  Một vài kiểm tra đã thất bại. Vui lòng xem lại các mục [FAIL].'));
    }

    return allChecksPassed;
}

/**
 * =================================================================
 * CHỨC NĂNG 3: ĐỀ XUẤT CẢI TIẾN
 * Phân tích mã nguồn và đưa ra các gợi ý để hoàn thiện.
 * =================================================================
 */
async function provideSuggestions() {
    console.log(chalk.cyan('\n[3] Đang phân tích và đưa ra đề xuất cải tiến...'));
    const suggestions = [];

    const htmlFiles = (await fs.readdir(projectDir)).filter(file => file.endsWith('.html'));

    for (const file of htmlFiles) {
        const content = await fs.readFile(path.join(projectDir, file), 'utf-8');
        const $ = cheerio.load(content);

        // Đề xuất 1: Tách JS nội tuyến
        if ($('script:not([src])').text().trim().length > 50) { // Có script nội tuyến đáng kể
            suggestions.push({
                file,
                type: 'Cấu trúc',
                priority: 'Cao',
                suggestion: `Tách toàn bộ mã JavaScript trong thẻ <script> ra một file .js riêng (ví dụ: ${file.replace('.html', '.js')}) để dễ bảo trì và cache.`,
            });
        }

        // Đề xuất 2: Tách CSS nội tuyến (đã làm, nhưng vẫn kiểm tra)
        if ($('style').length > 0) {
            suggestions.push({
                file,
                type: 'Cấu trúc',
                priority: 'Trung bình',
                suggestion: `Phát hiện thẻ <style>. Đảm bảo toàn bộ CSS đã được chuyển sang file 'style.css' chung.`,
            });
        }

        // Đề xuất 3: Tối ưu hóa hiệu năng cho index.html
        if (file === 'daily-schedule.html' && content.includes('updateScheduleDataFromDOM')) {
            suggestions.push({
                file,
                type: 'Hiệu năng',
                priority: 'Cao',
                suggestion: `Hàm 'updateScheduleDataFromDOM' và việc gọi lại 'renderSchedule()' mỗi khi kéo/thả có thể gây chậm khi có nhiều dữ liệu. Cân nhắc việc chỉ cập nhật các phần tử DOM bị thay đổi thay vì render lại toàn bộ.`,
            });
        }

        // Đề xuất 4: Quản lý dữ liệu tập trung
        if (content.includes('const MOCK_MAIN_TASKS') || content.includes('const scheduleByDate')) {
            suggestions.push({
                file,
                type: 'Kiến trúc',
                priority: 'Cao',
                suggestion: `Dữ liệu giả lập (mock data) đang được định nghĩa trực tiếp trong file HTML. Nên tạo một file riêng (ví dụ: 'data/mock-data.js') để quản lý tất cả dữ liệu tập trung.`,
            });
        }

        // Đề xuất 5: Cải thiện điều hướng
        $('a[href^="/"]').each((i, el) => {
            const href = $(el).attr('href');
            suggestions.push({
                file,
                type: 'Sửa lỗi',
                priority: 'Trung bình',
                suggestion: `Đường dẫn '${href}' bắt đầu bằng '/'. Đây là đường dẫn tuyệt đối, có thể không hoạt động đúng khi mở file trực tiếp. Nên sử dụng đường dẫn tương đối (ví dụ: '${href.substring(1)}').`,
            });
        });
    }

    // Đề xuất chung
    suggestions.push({
        file: 'Toàn bộ dự án',
        type: 'Mở rộng',
        priority: 'Thấp',
        suggestion: `Hiện tại các trang quản lý (Nhân viên, Cửa hàng) đang là dữ liệu tĩnh. Cần bổ sung logic JavaScript để thực hiện các chức năng Thêm/Sửa/Xóa.`,
    });

    if (suggestions.length > 0) {
        console.log(chalk.yellow.bold(`✅  Tìm thấy ${suggestions.length} đề xuất để cải thiện dự án:`));

        // Nhóm các đề xuất theo file
        const groupedSuggestions = suggestions.reduce((acc, s) => {
            acc[s.file] = acc[s.file] || [];
            acc[s.file].push(s);
            return acc;
        }, {});

        for (const file in groupedSuggestions) {
            console.log(chalk.white.bold.underline(`\n📄 File: ${file}`));
            groupedSuggestions[file].forEach(s => {
                let priorityColor = chalk.green;
                if (s.priority === 'Trung bình') priorityColor = chalk.yellow;
                if (s.priority === 'Cao') priorityColor = chalk.red;

                console.log(`  - ${chalk.gray(`[${s.type}]`)} ${priorityColor(`(Độ ưu tiên: ${s.priority})`)}: ${s.suggestion}`);
            });
        }
    } else {
        console.log(chalk.green('✅  Không tìm thấy đề xuất nào. Mã nguồn có vẻ tốt!'));
    }
}

/**
 * =================================================================
 * HÀM CHẠY CHÍNH
 * =================================================================
 */
async function main() {
    try {
        // Chạy tuần tự các chức năng
        await generateDocumentation();
        const checksPassed = await checkCoreFeatures();
        
        if (checksPassed) {
            await provideSuggestions();
        } else {
            console.log(chalk.yellow.bold('\n⚠️  Bỏ qua phần đề xuất vì hệ thống có lỗi nghiêm trọng. Vui lòng sửa các lỗi [FAIL] trước.'));
        }

        console.log(chalk.blue.bold('\n🎉 AoiSora Analyzer đã hoàn thành!'));

    } catch (error) {
        console.error(chalk.red.bold('\n💥 Đã có lỗi nghiêm trọng xảy ra:'));
        console.error(error);
    }
}

main();