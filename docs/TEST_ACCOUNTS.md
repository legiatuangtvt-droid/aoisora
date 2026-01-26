# Test Accounts - Danh sách tài khoản test

> **Last Updated**: 2026-01-26
> **Database**: auraorie68aa_aoisora
> **Default Password**: `password`

---

## Tổng quan

| Loại            | Grades | Số lượng | Ghi chú                           |
|-----------------|--------|----------|-----------------------------------|
| **HQ Users**    | G2-G9  | 39       | Văn phòng trung tâm (10 cũ + 29 mới) |
| **Store Users** | S1-S7  | 38       | Nhân viên cửa hàng                |
| **TOTAL**       | -      | **77**   | -                                 |

---

## HQ Users (G2 - G9)

> HQ = Headquarters (Văn phòng trung tâm)
> Grade cao hơn = Quyền hạn cao hơn (G9 > G8 > ... > G2)

### Organizational Structure (Cơ cấu tổ chức)

```
                            ┌─────────────────────┐
                            │   CEO (G9) - #49    │
                            │   ceo@aoisora.vn    │
                            └──────────┬──────────┘
                                       │
              ┌────────────────────────┼────────────────────────┐
              │                        │                        │
    ┌─────────┴─────────┐    ┌────────┴────────┐    ┌─────────┴─────────┐
    │  OP Division (G8) │    │ Admin Div (G7)  │    │  Legacy Users     │
    │  op.head - #50    │    │ admin.head - #51│    │  (staff_id 1-10)  │
    └─────────┬─────────┘    └────────┬────────┘    └───────────────────┘
              │                       │
    ┌─────────┼─────────┬─────────┬───┴───┐
    │         │         │         │       │
┌───┴───┐ ┌───┴───┐ ┌───┴───┐ ┌───┴───┐ ┌─┴─┐
│ PERI  │ │  GRO  │ │ DELI* │ │  D&D  │ │CS │ ← Under OP Division
│(dept7)│ │(dept8)│ │(dept9)│ │(dept10│ │11 │
│G6→G2  │ │G6→G2  │ │G5→G2  │ │G5→G2  │ │G5→│
└───────┘ └───────┘ └───────┘ └───────┘ └───┘

*DELI không có G6 để test trường hợp "skip-grade" approval
```

### NEW HQ Users - Organizational Hierarchy (29 users, ID 49-77)

#### Level 1: CEO (G9)

| #  | ID | Username   | Email              | Full Name    | Grade | Dept | Line Manager |
|----|----|-----------|--------------------|--------------|-------|------|--------------|
| 1  | 49 | ceo       | ceo@aoisora.vn     | CEO Nguyen   | G9    | -    | -            |

#### Level 2: Division Heads (G8-G7)

| #  | ID | Username    | Email                   | Full Name           | Grade | Dept  | Line Manager |
|----|----|-----------  |-------------------------|---------------------|-------|-------|--------------|
| 2  | 50 | op.head     | op.head@aoisora.vn      | OP Division Head    | G8    | OP    | ceo          |
| 3  | 51 | admin.head  | admin.head@aoisora.vn   | Admin Division Head | G7    | Admin | ceo          |

#### Level 3-6: PERISABLE Department (Full hierarchy G6→G2)

| #  | ID | Username      | Email                      | Full Name       | Grade | Dept | Line Manager |
|----|----|--------------  |---------------------------|-----------------|-------|------|--------------|
| 4  | 52 | peri.head     | peri.head@aoisora.vn      | PERI Dept Head  | G6    | PERI | op.head      |
| 5  | 53 | peri.lead     | peri.lead@aoisora.vn      | PERI Team Lead  | G5    | PERI | peri.head    |
| 6  | 54 | peri.senior1  | peri.senior1@aoisora.vn   | PERI Senior 1   | G4    | PERI | peri.lead    |
| 7  | 55 | peri.staff1   | peri.staff1@aoisora.vn    | PERI Staff 1    | G3    | PERI | peri.senior1 |
| 8  | 56 | peri.junior1  | peri.junior1@aoisora.vn   | PERI Junior 1   | G2    | PERI | peri.staff1  |

#### Level 3-6: GROCERY Department (Full hierarchy G6→G2)

| #  | ID | Username     | Email                     | Full Name      | Grade | Dept | Line Manager |
|----|----|------------- |---------------------------|----------------|-------|------|--------------|
| 9  | 57 | gro.head     | gro.head@aoisora.vn       | GRO Dept Head  | G6    | GRO  | op.head      |
| 10 | 58 | gro.lead     | gro.lead@aoisora.vn       | GRO Team Lead  | G5    | GRO  | gro.head     |
| 11 | 59 | gro.senior1  | gro.senior1@aoisora.vn    | GRO Senior 1   | G4    | GRO  | gro.lead     |
| 12 | 60 | gro.staff1   | gro.staff1@aoisora.vn     | GRO Staff 1    | G3    | GRO  | gro.senior1  |
| 13 | 61 | gro.junior1  | gro.junior1@aoisora.vn    | GRO Junior 1   | G2    | GRO  | gro.staff1   |

#### Level 3-6: DELICA Department (NO G6 - Skip Grade Test)

| #  | ID | Username      | Email                     | Full Name       | Grade | Dept   | Line Manager |
|----|----|--------------  |--------------------------|-----------------|-------|--------|--------------|
| 14 | 62 | deli.lead     | deli.lead@aoisora.vn     | DELI Team Lead  | G5    | Delica | **op.head**  |
| 15 | 63 | deli.senior1  | deli.senior1@aoisora.vn  | DELI Senior 1   | G4    | Delica | deli.lead    |
| 16 | 64 | deli.staff1   | deli.staff1@aoisora.vn   | DELI Staff 1    | G3    | Delica | deli.senior1 |
| 17 | 65 | deli.junior1  | deli.junior1@aoisora.vn  | DELI Junior 1   | G2    | Delica | deli.staff1  |

> **Note**: Delica không có G6 Dept Head. Team Lead (G5) báo cáo trực tiếp cho OP Division Head (G8).
> Dùng để test trường hợp approval skip grades.

#### Level 3-6: D&D Department (G5→G2)

| #  | ID | Username     | Email                    | Full Name      | Grade | Dept | Line Manager |
|----|----|------------- |--------------------------|----------------|-------|------|--------------|
| 18 | 66 | dnd.lead     | dnd.lead@aoisora.vn      | DND Team Lead  | G5    | D&D  | op.head      |
| 19 | 67 | dnd.senior1  | dnd.senior1@aoisora.vn   | DND Senior 1   | G4    | D&D  | dnd.lead     |
| 20 | 68 | dnd.staff1   | dnd.staff1@aoisora.vn    | DND Staff 1    | G3    | D&D  | dnd.senior1  |
| 21 | 69 | dnd.junior1  | dnd.junior1@aoisora.vn   | DND Junior 1   | G2    | D&D  | dnd.staff1   |

#### Level 3-6: CS Department (G5→G2)

| #  | ID | Username    | Email                   | Full Name     | Grade | Dept | Line Manager |
|----|----|-----------  |-------------------------|---------------|-------|------|--------------|
| 22 | 70 | cs.lead     | cs.lead@aoisora.vn      | CS Team Lead  | G5    | CS   | op.head      |
| 23 | 71 | cs.senior1  | cs.senior1@aoisora.vn   | CS Senior 1   | G4    | CS   | cs.lead      |
| 24 | 72 | cs.staff1   | cs.staff1@aoisora.vn    | CS Staff 1    | G3    | CS   | cs.senior1   |
| 25 | 73 | cs.junior1  | cs.junior1@aoisora.vn   | CS Junior 1   | G2    | CS   | cs.staff1    |

#### Level 3-6: ADMIN Department (Under Admin Division, G5→G2)

| #  | ID | Username     | Email                    | Full Name      | Grade | Dept  | Line Manager |
|----|----|------------- |--------------------------|----------------|-------|-------|--------------|
| 26 | 74 | adm.lead     | adm.lead@aoisora.vn      | ADM Team Lead  | G5    | Admin | admin.head   |
| 27 | 75 | adm.senior1  | adm.senior1@aoisora.vn   | ADM Senior 1   | G4    | Admin | adm.lead     |
| 28 | 76 | adm.staff1   | adm.staff1@aoisora.vn    | ADM Staff 1    | G3    | Admin | adm.senior1  |
| 29 | 77 | adm.junior1  | adm.junior1@aoisora.vn   | ADM Junior 1   | G2    | Admin | adm.staff1   |

### Legacy HQ Users (10 users, ID 1-10)

> Các users cũ giữ nguyên để tương thích với dữ liệu test hiện có.

| #  | ID | Username        | Email                        | Full Name           | Grade | Dept       | Role           |
|----|----|-----------------|------------------------------|---------------------|-------|------------|----------------|
| 30 | 1  | admin           | admin@aoisora.vn             | Admin User          | G9    | Perisable  | System Admin   |
| 31 | 2  | yoshinaga       | yoshinaga@aoisora.vn         | Yoshinaga           | G8    | Perisable  | Director       |
| 32 | 3  | nguyen.manager  | nguyen.manager@aoisora.vn    | Nguyen Van Manager  | G7    | Perisable  | Senior Manager |
| 33 | 4  | tran.supervisor | tran.supervisor@aoisora.vn   | Tran Thi Supervisor | G6    | Grocery    | Supervisor     |
| 34 | 5  | le.leader       | le.leader@aoisora.vn         | Le Van Leader       | G5    | Grocery    | Team Leader    |
| 35 | 6  | pham.senior     | pham.senior@aoisora.vn       | Pham Thi Senior     | G4    | Delica     | Senior Staff   |
| 36 | 7  | hoang.staff     | hoang.staff@aoisora.vn       | Hoang Van Staff     | G3    | D&D        | Staff          |
| 37 | 8  | vu.junior       | vu.junior@aoisora.vn         | Vu Thi Junior       | G2    | CS         | Junior Staff   |
| 38 | 9  | do.analyst      | do.analyst@aoisora.vn        | Do Van Analyst      | G3    | Admin      | Analyst        |
| 39 | 10 | ngo.coordinator | ngo.coordinator@aoisora.vn   | Ngo Thi Coordinator | G4    | Perisable  | Coordinator    |

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

### Recommended Test Accounts - Approval Flow

| Mục đích test                    | Username       | Password | Grade | Department |
|----------------------------------|----------------|----------|-------|------------|
| **CEO - Approve All**            | ceo            | password | G9    | -          |
| **Division Head - OP**           | op.head        | password | G8    | OP         |
| **Division Head - Admin**        | admin.head     | password | G7    | Admin      |
| **Dept Head - PERI**             | peri.head      | password | G6    | Perisable  |
| **Team Lead - PERI**             | peri.lead      | password | G5    | Perisable  |
| **Senior - PERI**                | peri.senior1   | password | G4    | Perisable  |
| **Staff - PERI**                 | peri.staff1    | password | G3    | Perisable  |
| **Junior - PERI**                | peri.junior1   | password | G2    | Perisable  |
| **Team Lead - DELI (Skip G6)**   | deli.lead      | password | G5    | Delica     |

### Test Scenarios - Approval Chain

| Scenario                        | Creator        | Expected Approver | Notes                           |
|---------------------------------|----------------|-------------------|--------------------------------|
| G2 → G3 (Normal)                | peri.junior1   | peri.staff1       | Junior → Staff                  |
| G3 → G4 (Normal)                | peri.staff1    | peri.senior1      | Staff → Senior                  |
| G4 → G5 (Normal)                | peri.senior1   | peri.lead         | Senior → Team Lead              |
| G5 → G6 (Normal)                | peri.lead      | peri.head         | Team Lead → Dept Head           |
| G6 → G8 (Normal)                | peri.head      | op.head           | Dept Head → Division Head       |
| G5 → G8 (Skip G6)               | deli.lead      | op.head           | Team Lead → Division Head       |
| G8 → G9 (Normal)                | op.head        | ceo               | Division Head → CEO             |
| Cross-Division (Admin)          | adm.staff1     | adm.senior1       | Uses Admin hierarchy            |

### Legacy Test Accounts (Compatibility)

| Mục đích test         | Username     | Password | Grade |
|-----------------------|--------------|----------|-------|
| **System Admin**      | admin        | password | G9    |
| **HQ Task Creator**   | hoang.staff  | password | G3    |
| **HQ Approver**       | le.leader    | password | G5    |
| **Store Leader**      | store.lead1  | password | S3    |
| **Store Staff**       | staff.peri1  | password | S1    |
| **Region Manager**    | region.north | password | S7    |
| **Zone Manager**      | zone.hanoi   | password | S6    |

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

1. **HQ vs Store Users**:
   - HQ users: job_grade starts with "G" (G2-G9)
   - Store users: job_grade starts with "S" (S1-S7)
   - No `is_hq` column in database, determined by job_grade prefix

2. **Line Manager (Approval Chain)**:
   - `line_manager_id` column defines approval hierarchy
   - Approver = direct line manager with higher grade
   - If no line manager in same dept → escalate to division head

3. **Skip-Grade Scenario (Delica)**:
   - Delica department has no G6 (Dept Head)
   - G5 Team Lead reports directly to G8 Division Head
   - Used to test approval when intermediate grades missing

4. **Store Assignment**:
   - S3 users được gán trực tiếp vào 1 store
   - S4 users quản lý nhiều stores
   - S5-S7 users quản lý theo hierarchy (Area/Zone/Region)

5. **Department Assignment**:
   - HQ users thuộc về departments: OP, Admin, Perisable, Grocery, Delica, D&D, CS
   - Store users (S1) có thể thuộc divisions trong store: PERI, GRO, Delica, CS

6. **Login Method**:
   - Có thể login bằng username hoặc email
   - Frontend form: Email/Phone field
