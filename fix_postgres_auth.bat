@echo off
echo ============================================
echo Fix PostgreSQL Authentication for PHP 7.2
echo ============================================
echo.

echo This script will:
echo 1. Stop PostgreSQL 17 service
echo 2. Modify pg_hba.conf and postgresql.conf
echo 3. Start PostgreSQL 17 service
echo 4. Reset postgres user password
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause >nul

echo.
echo [1/4] Stopping PostgreSQL 17 service...
net stop postgresql-x64-17

echo.
echo [2/4] Backing up and modifying configuration files...

:: Backup original files
copy "C:\Program Files\PostgreSQL\17\data\pg_hba.conf" "C:\Program Files\PostgreSQL\17\data\pg_hba.conf.backup" >nul
copy "C:\Program Files\PostgreSQL\17\data\postgresql.conf" "C:\Program Files\PostgreSQL\17\data\postgresql.conf.backup" >nul

:: Create new pg_hba.conf with md5 authentication
(
echo # PostgreSQL Client Authentication Configuration File
echo # Modified for PHP 7.2 compatibility - using md5 instead of scram-sha-256
echo.
echo # TYPE  DATABASE        USER            ADDRESS                 METHOD
echo.
echo # "local" is for Unix domain socket connections only
echo local   all             all                                     md5
echo # IPv4 local connections:
echo host    all             all             127.0.0.1/32            md5
echo # IPv6 local connections:
echo host    all             all             ::1/128                 md5
echo # Allow replication connections from localhost
echo local   replication     all                                     md5
echo host    replication     all             127.0.0.1/32            md5
echo host    replication     all             ::1/128                 md5
) > "C:\Program Files\PostgreSQL\17\data\pg_hba.conf"

:: Modify postgresql.conf to use md5 password encryption
powershell -Command "(Get-Content 'C:\Program Files\PostgreSQL\17\data\postgresql.conf') -replace 'password_encryption = scram-sha-256', 'password_encryption = md5' | Set-Content 'C:\Program Files\PostgreSQL\17\data\postgresql.conf'"

echo.
echo [3/4] Starting PostgreSQL 17 service...
net start postgresql-x64-17

echo.
echo [4/4] Resetting postgres user password...
echo Please enter the password when prompted (use: p@ssw0rd)
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -h 127.0.0.1 -p 5433 -c "ALTER USER postgres WITH PASSWORD 'p@ssw0rd';"

echo.
echo ============================================
echo Done! PostgreSQL is now configured for md5 authentication.
echo You can now run: php artisan migrate:status
echo ============================================
pause
