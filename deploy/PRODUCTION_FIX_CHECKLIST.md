# Production Fix Checklist

## Issue: Login API returns 500 error

### Step 1: Fix admin password
Run SQL in phpMyAdmin:
```sql
UPDATE staff
SET password_hash = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    status = 'active',
    is_active = 1
WHERE username = 'admin';
```

### Step 2: Verify files uploaded
Check these folders exist on server:
- `public_html/laravel/vendor/spatie/laravel-permission/` - Spatie Permission package
- `public_html/laravel/app/Models/Staff.php` - Staff model with HasRoles trait

### Step 3: Clear Laravel cache
SSH into server or run via DirectAdmin Terminal:
```bash
cd /home/auraorie/public_html/laravel
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

If no SSH access, delete these folders via FileZilla:
- `public_html/laravel/bootstrap/cache/*` (delete all files inside, keep folder)
- `public_html/laravel/storage/framework/cache/data/*`

### Step 4: Check Laravel logs
View error log at:
- `public_html/laravel/storage/logs/laravel.log`

Download this file via FileZilla to see exact error message.

### Step 5: Verify .env on production
Check `public_html/laravel/.env` has correct values:
```
APP_ENV=production
APP_DEBUG=false
DB_CONNECTION=mysql
DB_HOST=localhost
DB_DATABASE=auraorie_aoisora
DB_USERNAME=auraorie_app
DB_PASSWORD=<correct password>
```

### Test Login
After fixes, test:
```
curl -X POST https://auraorientalis.vn/api/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"admin","password":"password"}'
```

Expected response:
```json
{
  "success": true,
  "access_token": "...",
  ...
}
```
