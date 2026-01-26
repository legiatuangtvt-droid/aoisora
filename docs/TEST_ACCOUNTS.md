# Test Accounts - Danh sách tài khoản test

> **Last Updated**: 2026-01-26
> **Database**: auraorie68aa_aoisora
> **Default Password**: `password`

---

## Tổng quan

| Loại            | Grades | Số lượng | Ghi chú              |
|-----------------|--------|----------|----------------------|
| **HQ Users**    | G2-G9  | 10       | Văn phòng trung tâm  |
| **Store Users** | S1-S7  | 38       | Nhân viên cửa hàng   |
| **TOTAL**       | -      | **48**   | -                    |

---

## HQ Users (G2 - G9)

> HQ = Headquarters (Văn phòng trung tâm)
> Grade cao hơn = Quyền hạn cao hơn (G9 > G8 > ... > G2)

| #  | Staff ID | Username         | Email                         | Full Name            | Grade | Department | Role           |
|----|----------|------------------|-------------------------------|----------------------|-------|------------|----------------|
| 1  | 1        | admin            | admin@aoisora.vn              | Admin User           | G9    | Admin      | System Admin   |
| 2  | 2        | yoshinaga        | yoshinaga@aoisora.vn          | Yoshinaga            | G8    | Operations | Director       |
| 3  | 3        | nguyen.manager   | nguyen.manager@aoisora.vn     | Nguyen Van Manager   | G7    | Operations | Senior Manager |
| 4  | 4        | tran.supervisor  | tran.supervisor@aoisora.vn    | Tran Thi Supervisor  | G6    | PERI       | Supervisor     |
| 5  | 5        | le.leader        | le.leader@aoisora.vn          | Le Van Leader        | G5    | GRO        | Team Leader    |
| 6  | 6        | pham.senior      | pham.senior@aoisora.vn        | Pham Thi Senior      | G4    | Delica     | Senior Staff   |
| 7  | 7        | hoang.staff      | hoang.staff@aoisora.vn        | Hoang Van Staff      | G3    | D&D        | Staff          |
| 8  | 8        | vu.junior        | vu.junior@aoisora.vn          | Vu Thi Junior        | G2    | CS         | Junior Staff   |
| 9  | 9        | do.analyst       | do.analyst@aoisora.vn         | Do Van Analyst       | G3    | Admin      | Analyst        |
| 10 | 10       | ngo.coordinator  | ngo.coordinator@aoisora.vn    | Ngo Thi Coordinator  | G4    | Operations | Coordinator    |

### HQ Permissions by Grade

| Grade | Can Create Task | Can Approve        | Can Dispatch Library | Can Override Cooldown |
|-------|-----------------|--------------------|--------------------- |---------------------- |
| G9    | Yes             | Yes All            | Yes                  | Yes                   |
| G8    | Yes             | Yes G7 and below   | Yes                  | Yes                   |
| G7    | Yes             | Yes G6 and below   | Yes                  | Yes (Dept Head)       |
| G6    | Yes             | Yes G5 and below   | Yes                  | Yes (Team Head)       |
| G5    | Yes             | Yes G4 and below   | Yes                  | No                    |
| G4    | Yes             | Yes G3 and below   | Yes                  | No                    |
| G3    | Yes             | Yes G2 only        | Yes                  | No                    |
| G2    | Yes             | No                 | Yes                  | No                    |

---

## Store Users (S1 - S7)

> Store = Cửa hàng
> Grade cao hơn = Quyền hạn rộng hơn (S7 quản lý Region > S6 quản lý Zone > ...)

### S7 - Region Managers (3 users)

| # | Staff ID | Username        | Email                        | Full Name               | Region  | Scope                        |
|---|----------|-----------------|------------------------------|-------------------------|---------|------------------------------|
| 1 | 24       | region.north    | region.north@aoisora.vn      | Region Manager North    | North   | All stores in North region   |
| 2 | 25       | region.central  | region.central@aoisora.vn    | Region Manager Central  | Central | All stores in Central region |
| 3 | 26       | region.south    | region.south@aoisora.vn      | Region Manager South    | South   | All stores in South region   |

### S6 - Zone Managers (6 users)

| # | Staff ID | Username       | Email                       | Full Name              | Zone        | Region  |
|---|----------|----------------|-----------------------------| -----------------------|-------------|---------|
| 1 | 27       | zone.hanoi     | zone.hanoi@aoisora.vn       | Zone Manager Hanoi     | Hanoi       | North   |
| 2 | 28       | zone.haiphong  | zone.haiphong@aoisora.vn    | Zone Manager Hai Phong | Hai Phong   | North   |
| 3 | 29       | zone.danang    | zone.danang@aoisora.vn      | Zone Manager Da Nang   | Da Nang     | Central |
| 4 | 30       | zone.hue       | zone.hue@aoisora.vn         | Zone Manager Hue       | Hue         | Central |
| 5 | 31       | zone.hcm       | zone.hcm@aoisora.vn         | Zone Manager HCM       | Ho Chi Minh | South   |
| 6 | 32       | zone.cantho    | zone.cantho@aoisora.vn      | Zone Manager Can Tho   | Can Tho     | South   |

### S5 - Area Managers (3 users)

| # | Staff ID | Username       | Email                       | Full Name               | Area       | Zone        |
|---|----------|----------------|-----------------------------|-------------------------|------------|-------------|
| 1 | 33       | area.hoankiem  | area.hoankiem@aoisora.vn    | Area Manager Hoan Kiem  | Hoan Kiem  | Hanoi       |
| 2 | 34       | area.district1 | area.district1@aoisora.vn   | Area Manager District 1 | District 1 | Ho Chi Minh |
| 3 | 35       | area.haizhou   | area.haizhou@aoisora.vn     | Area Manager Hai Chau   | Hai Chau   | Da Nang     |

### S4 - Store In-charge / SI (3 users)

> SI quản lý từ 2 stores trở lên

| # | Staff ID | Username   | Email                  | Full Name        | Stores Managed               |
|---|----------|------------|------------------------|------------------|------------------------------|
| 1 | 36       | si.hanoi   | si.hanoi@aoisora.vn    | SI Hanoi Group   | AEON Hanoi, AEON Long Bien   |
| 2 | 37       | si.hcm     | si.hcm@aoisora.vn      | SI HCM Group     | AEON Tan Phu, AEON Binh Tan  |
| 3 | 38       | si.central | si.central@aoisora.vn  | SI Central Group | AEON Da Nang, AEON Hue       |

### S3 - Store Leaders (13 users - existing)

| #  | Staff ID | Username     | Email                      | Full Name       | Store    |
|----|----------|--------------|----------------------------|-----------------|----------|
| 1  | 11       | store.lead1  | store.lead1@aoisora.vn     | Store Leader 1  | Store 1  |
| 2  | 12       | store.lead2  | store.lead2@aoisora.vn     | Store Leader 2  | Store 2  |
| 3  | 13       | store.lead3  | store.lead3@aoisora.vn     | Store Leader 3  | Store 3  |
| 4  | 14       | store.lead4  | store.lead4@aoisora.vn     | Store Leader 4  | Store 4  |
| 5  | 15       | store.lead5  | store.lead5@aoisora.vn     | Store Leader 5  | Store 5  |
| 6  | 16       | store.lead6  | store.lead6@aoisora.vn     | Store Leader 6  | Store 6  |
| 7  | 17       | store.lead7  | store.lead7@aoisora.vn     | Store Leader 7  | Store 7  |
| 8  | 18       | store.lead8  | store.lead8@aoisora.vn     | Store Leader 8  | Store 8  |
| 9  | 19       | store.lead9  | store.lead9@aoisora.vn     | Store Leader 9  | Store 9  |
| 10 | 20       | store.lead10 | store.lead10@aoisora.vn    | Store Leader 10 | Store 10 |
| 11 | 21       | store.lead11 | store.lead11@aoisora.vn    | Store Leader 11 | Store 11 |
| 12 | 22       | store.lead12 | store.lead12@aoisora.vn    | Store Leader 12 | Store 12 |
| 13 | 23       | store.lead13 | store.lead13@aoisora.vn    | Store Leader 13 | Store 13 |

### S2 - Deputy Store Leaders (4 users)

| # | Staff ID | Username      | Email                       | Full Name              | Store   |
|---|----------|---------------|-----------------------------|------------------------|---------|
| 1 | 39       | deputy.store1 | deputy.store1@aoisora.vn    | Deputy Store Leader 1  | Store 1 |
| 2 | 40       | deputy.store2 | deputy.store2@aoisora.vn    | Deputy Store Leader 2  | Store 2 |
| 3 | 41       | deputy.store3 | deputy.store3@aoisora.vn    | Deputy Store Leader 3  | Store 3 |
| 4 | 42       | deputy.store4 | deputy.store4@aoisora.vn    | Deputy Store Leader 4  | Store 4 |

### S1 - Store Staff (6 users)

| # | Staff ID | Username       | Email                        | Full Name            | Store   | Department |
|---|----------|----------------|------------------------------|----------------------|---------|------------|
| 1 | 43       | staff.peri1    | staff.peri1@aoisora.vn       | Staff PERI Store 1   | Store 1 | PERI       |
| 2 | 44       | staff.gro1     | staff.gro1@aoisora.vn        | Staff GRO Store 1    | Store 1 | GRO        |
| 3 | 45       | staff.delica1  | staff.delica1@aoisora.vn     | Staff Delica Store 1 | Store 1 | Delica     |
| 4 | 46       | staff.peri2    | staff.peri2@aoisora.vn       | Staff PERI Store 2   | Store 2 | PERI       |
| 5 | 47       | staff.gro2     | staff.gro2@aoisora.vn        | Staff GRO Store 2    | Store 2 | GRO        |
| 6 | 48       | staff.cashier1 | staff.cashier1@aoisora.vn    | Cashier Store 1      | Store 1 | CS         |

### Store Permissions by Grade

| Grade | View All Store Tasks | Assign to Staff | Start/Complete Task | Mark Unable | Upload Evidence |
|-------|----------------------|-----------------|---------------------|-------------|-----------------|
| S7    | Yes (Region scope)   | No              | No                  | No          | No              |
| S6    | Yes (Zone scope)     | No              | No                  | No          | No              |
| S5    | Yes (Area scope)     | No              | No                  | No          | No              |
| S4    | Yes (Multi-store)    | Yes             | Yes                 | Yes         | Yes             |
| S3    | Yes (Own store)      | Yes             | Yes                 | Yes         | Yes             |
| S2    | Yes (Own store)      | Yes             | Yes                 | Yes         | Yes             |
| S1    | No (Assigned only)   | No              | Yes*                | Yes*        | Yes*            |

> *S1 chỉ có quyền với tasks được assign cho họ

---

## Quick Login Reference

### Recommended Test Accounts

| Mục đích test         | Username     | Password | Grade |
|-----------------------|--------------|----------|-------|
| **Full Admin Access** | admin        | password | G9    |
| **HQ Task Creator**   | hoang.staff  | password | G3    |
| **HQ Approver**       | le.leader    | password | G5    |
| **Store Leader**      | store.lead1  | password | S3    |
| **Store Staff**       | staff.peri1  | password | S1    |
| **Region Manager**    | region.north | password | S7    |
| **Zone Manager**      | zone.hanoi   | password | S6    |

### Test Scenarios

| Scenario               | Login as              | Then do                          |
|------------------------|-----------------------|----------------------------------|
| Create & Submit Task   | hoang.staff (G3)      | Add Task -> Submit               |
| Approve Task           | le.leader (G5)        | Approval page -> Approve/Reject  |
| View Store Tasks       | store.lead1 (S3)      | Store Tasks page                 |
| Execute Task as Staff  | staff.peri1 (S1)      | My Tasks -> Start -> Complete    |
| HQ Check               | tran.supervisor (G6)  | HQ Check page -> Check/Reject    |
| Dispatch from Library  | pham.senior (G4)      | Library -> Dispatch              |
| View Region Report     | region.north (S7)     | Reports page                     |

---

## Database Connection Info

```
Host:     localhost
Database: auraorie68aa_aoisora
Username: root
Password: (empty)
```

## Password Hash

All accounts use password: `password`

BCrypt hash:
```
$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
```

---

## Notes

1. **is_hq Field**:
   - HQ users (G2-G9): `is_hq = 1`
   - Store users (S1-S7): `is_hq = 0`

2. **Store Assignment**:
   - S3 users được gán trực tiếp vào 1 store
   - S4 users quản lý nhiều stores
   - S5-S7 users quản lý theo hierarchy (Area/Zone/Region)

3. **Department Assignment**:
   - HQ users thuộc về departments: Admin, Operations, PERI, GRO, Delica, D&D, CS
   - Store users (S1) có thể thuộc divisions trong store: PERI, GRO, Delica, CS

4. **Login Method**:
   - Có thể login bằng username hoặc email
   - Frontend form: Email/Phone field
