# Session Start Checklist

> Khi bắt đầu phiên làm việc mới, thực hiện các bước sau:

---

## 1. Git Synchronization

- [ ] Kiểm tra nhánh hiện tại: `git branch`
- [ ] Kiểm tra trạng thái: `git status`
- [ ] Pull code mới nhất: `git pull`
- [ ] Xem các commit gần đây: `git log --oneline -5`

---

## 2. Project Review

- [ ] Xem cấu trúc dự án
- [ ] Kiểm tra các file cấu hình (`package.json`, `next.config.js`, etc.)
- [ ] Kiểm tra dependencies có đầy đủ không
- [ ] Xem xét các issue/TODO còn tồn đọng

---

## 3. Environment Check

- [ ] Kiểm tra Node.js version
- [ ] Kiểm tra npm/yarn version
- [ ] Cài đặt dependencies nếu cần: `npm install`
- [ ] Kiểm tra file `.env` (nếu có)

---

## 4. Run Application

- [ ] Chạy development server: `npm run dev`
- [ ] Kiểm tra app chạy thành công tại `http://localhost:3000`
- [ ] Xem console log có lỗi không
- [ ] Test các tính năng cơ bản

---

## 5. Identify Issues

- [ ] Liệt kê các lỗi compile/runtime (nếu có)
- [ ] Liệt kê các warning
- [ ] Đề xuất các cải thiện cần thiết

---

# Working Session Rules

> Trong suốt phiên làm việc, tuân thủ các quy tắc sau:

## On Every Change

1. **Update Spec**: Mỗi khi có thay đổi code, cập nhật file `.md` spec tương ứng trong `docs/specs/`
2. **Commit & Push**: Sau mỗi thay đổi hoàn chỉnh:
   ```bash
   git add .
   git commit -m "Mô tả thay đổi"
   git push
   ```

## Spec Files Location

| Feature | Spec File |
|---------|-----------|
| Task List Screen | `docs/specs/task-list.md` |
| App General | `docs/specs/app-general.md` |
| (Thêm spec mới khi cần) | `docs/specs/<feature-name>.md` |

## Commit Message Format

```
<type>: <short description>

- Detail 1
- Detail 2

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

**Types**: `feat`, `fix`, `refactor`, `docs`, `style`, `chore`

---

# Quick Commands

```bash
# Git
git status
git pull
git add .
git commit -m "message"
git push

# Development
npm install
npm run dev
npm run build
npm run lint
```
