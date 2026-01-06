# Test Accounts

> Danh sách tài khoản test cho development và QA.

## Login Credentials

| Username | Password | Role | Store | Notes |
|----------|----------|------|-------|-------|
| `admin` | `Password123!` | MANAGER | Store Ha Dong | Main test account |
| `manager01` | `Password123!` | MANAGER | - | Test manager |
| `staff01` | `Password123!` | STAFF | - | Test staff |
| `staff02` | `Password123!` | STAFF | - | Test staff |
| `staff03` | `Password123!` | STAFF | - | Test staff |
| `staff04` | `Password123!` | STAFF | - | Test staff |
| `staff05` | `Password123!` | STAFF | - | Test staff |

## Alternative Login Identifiers

Có thể login bằng nhiều loại identifier:

| Type | Example | Account |
|------|---------|---------|
| Username | `admin` | Admin account |
| Email | `admin@aoisora.com` | Admin account |
| Phone | `0901234567` | Admin account |
| SAP Code | `NV001` | Admin account |

## Quick Test Commands

### cURL Login Test

```bash
# Windows CMD/PowerShell
curl -X POST http://localhost:8000/api/v1/auth/login -H "Content-Type: application/json" -H "Accept: application/json" --data-raw "{\"identifier\":\"admin\",\"password\":\"Password123!\"}"

# Linux/Mac
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"identifier":"admin","password":"Password123!"}'
```

### Browser Test

1. Go to: `http://localhost:3000/auth/signin`
2. Enter: `admin` / `Password123!`
3. Click "Sign in"

## Password Requirements

- Min 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (@$!%*?&)

## Reset Test Password

Nếu cần reset password về mặc định:

```bash
# Chạy trong thư mục backend
php artisan tinker --execute="
  \$hash = password_hash('Password123!', PASSWORD_BCRYPT);
  \App\Models\Staff::whereIn('staff_id', [1,2,3,4,5,6,7,8,9,10])->update(['password_hash' => \$hash]);
  echo 'Done';
"
```

## Related Files

- Seed data: `database/seed_data.sql`
- Auth spec: `docs/specs/_shared/authentication.md`
