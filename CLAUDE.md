# Claude Code Project Instructions

> File này được Claude Code tự động đọc khi bắt đầu phiên làm việc.

## Quy tắc bắt buộc

### 1. Workflow sau mỗi thay đổi code

Sau khi hoàn thành bất kỳ thay đổi code nào, **BẮT BUỘC** thực hiện theo thứ tự:

1. **Update Spec**: Cập nhật file `.md` spec tương ứng trong `docs/specs/`
2. **Commit & Push**:
   ```bash
   git add .
   git commit -m "<type>(<scope>): <description>"
   git push
   ```

### 2. Commit Message Format

```
<type>(<scope>): <short description>

- Detail 1
- Detail 2

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

**Types**: `feat`, `fix`, `refactor`, `docs`, `style`, `chore`

**Scopes**: `frontend`, `backend`, `db`, `api`, `docs`

### 3. Architecture Separation

| Layer | Location | Responsibility |
|-------|----------|----------------|
| **Frontend** | `/frontend` | UI, User interactions, State management |
| **Backend** | `/backend` | API endpoints, Business logic, Validation |
| **Database** | `/database` | Data storage, Schema, Indexes |

### 4. Spec Files Location

| Feature | Spec File |
|---------|-----------|
| Login Screen | `docs/specs/login.md` |
| Task List Screen | `docs/specs/task-list.md` |
| Task Detail Screen | `docs/specs/task-detail.md` |
| Task Library Screen | `docs/specs/task-library.md` |
| Add Task Screen | `docs/specs/add-task.md` |
| Todo Task Screen | `docs/specs/todo-task.md` |
| Manual Screen | `docs/specs/manual.md` |
| User Information | `docs/specs/user-information.md` |
| Store Information | `docs/specs/store-information.md` |
| Message Screen | `docs/specs/message.md` |
| App General | `docs/specs/app-general.md` |

### 5. Laragon Paths (Windows)

```bash
# PHP
PHP="D:\devtool\laragon\bin\php\php-8.3.28-Win32-vs16-x64\php.exe"

# PostgreSQL
PSQL="D:\devtool\laragon\bin\postgresql\pgsql-18\bin\psql.exe"
PG_CTL="D:\devtool\laragon\bin\postgresql\pgsql-18\bin\pg_ctl.exe"
PG_DATA="D:\devtool\laragon\data\postgresql"
```

### 6. Database

- Database name: `aoisora`
- Schema file: `database/schema.sql`
- Seed file: `database/seed_data.sql`

---

## Tham khảo chi tiết

Xem thêm tại: `docs/SESSION_START_CHECKLIST.md`
