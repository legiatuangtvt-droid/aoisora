<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class TestDataSeeder extends Seeder
{
    public function run(): void
    {
        // Regions
        $regionId = DB::table('regions')->insertGetId([
            'region_name' => 'Kanto Region',
            'region_code' => 'KANTO',
            'description' => 'Tokyo and surrounding areas',
            'created_at' => now(),
            'updated_at' => now(),
        ], 'region_id');

        // Departments
        $deptId = DB::table('departments')->insertGetId([
            'department_name' => 'Operations',
            'department_code' => 'OPS',
            'description' => 'Store Operations Department',
            'created_at' => now(),
            'updated_at' => now(),
        ], 'department_id');

        // Stores
        $storeId = DB::table('stores')->insertGetId([
            'store_name' => 'AEON MaxValu Nguyen Cu Trinh',
            'store_code' => 'MVN001',
            'region_id' => $regionId,
            'address' => '171 Nguyen Cu Trinh, District 1, HCMC',
            'phone' => '028-1234-5678',
            'email' => 'mvn001@aeon.com.vn',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ], 'store_id');

        // Staff - Admin
        $adminId = DB::table('staff')->insertGetId([
            'staff_code' => 'ADM001',
            'username' => 'admin',
            'password_hash' => Hash::make('password'),
            'staff_name' => 'Nguyen Van Admin',
            'email' => 'admin@aoisora.vn',
            'phone' => '0901234567',
            'store_id' => $storeId,
            'department_id' => $deptId,
            'role' => 'admin',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ], 'staff_id');

        // Staff - Store Leader
        $leaderStaffId = DB::table('staff')->insertGetId([
            'staff_code' => 'STL001',
            'username' => 'leader',
            'password_hash' => Hash::make('password'),
            'staff_name' => 'Vo Minh Tuan',
            'email' => 'leader@aoisora.vn',
            'phone' => '0901234568',
            'store_id' => $storeId,
            'department_id' => $deptId,
            'role' => 'STORE_LEADER_G3',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ], 'staff_id');

        // More Staff
        $staffMembers = [
            ['STF001', 'staff1', 'Dang Thu Ha', 'STAFF'],
            ['STF002', 'staff2', 'Hoang Xuan Kien', 'STAFF'],
            ['STF003', 'staff3', 'Bui Thi Lan', 'STAFF'],
            ['STF004', 'staff4', 'Le Quoc Phong', 'STAFF'],
            ['STF005', 'staff5', 'Tran Ngoc Hanh', 'STAFF'],
        ];

        $staffIds = [$adminId, $leaderStaffId];
        foreach ($staffMembers as $member) {
            $staffIds[] = DB::table('staff')->insertGetId([
                'staff_code' => $member[0],
                'username' => $member[1],
                'password_hash' => Hash::make('password'),
                'staff_name' => $member[2],
                'email' => $member[1] . '@aoisora.vn',
                'phone' => '090' . rand(1000000, 9999999),
                'store_id' => $storeId,
                'department_id' => $deptId,
                'role' => $member[3],
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ], 'staff_id');
        }

        // Task Groups (no store_id in migration)
        $taskGroupId = DB::table('task_groups')->insertGetId([
            'group_name' => 'Daily Tasks',
            'group_code' => 'DAILY',
            'description' => 'Daily routine tasks',
            'sort_order' => 1,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ], 'task_group_id');

        // Shift Codes (no store_id in migration)
        $shiftCodes = [
            ['V6.8', 'Shift V6.8', '06:00:00', '14:00:00', '#4CAF50'],
            ['V6.16', 'Shift V6.16', '16:00:00', '22:00:00', '#2196F3'],
            ['V8.6', 'Shift V8.6', '06:00:00', '14:00:00', '#FF9800'],
            ['V8.14', 'Shift V8.14', '14:30:00', '22:30:00', '#9C27B0'],
        ];

        $shiftCodeIds = [];
        foreach ($shiftCodes as $shift) {
            $shiftCodeIds[$shift[0]] = DB::table('shift_codes')->insertGetId([
                'shift_code' => $shift[0],
                'shift_name' => $shift[1],
                'start_time' => $shift[2],
                'end_time' => $shift[3],
                'break_hours' => 1.0,
                'color' => $shift[4],
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ], 'shift_code_id');
        }

        // Shift Assignments for today and next few days
        $dates = [
            now()->format('Y-m-d'),
            now()->addDay()->format('Y-m-d'),
            now()->addDays(2)->format('Y-m-d'),
        ];

        $assignments = [
            [$staffIds[1], 'V8.6'],   // Vo Minh Tuan
            [$staffIds[2], 'V8.14'],  // Dang Thu Ha
            [$staffIds[3], 'V6.8'],   // Hoang Xuan Kien
            [$staffIds[4], 'V6.16'],  // Bui Thi Lan
            [$staffIds[5], 'V8.6'],   // Le Quoc Phong
            [$staffIds[6], 'V8.14'],  // Tran Ngoc Hanh
        ];

        foreach ($dates as $date) {
            foreach ($assignments as $assign) {
                DB::table('shift_assignments')->insert([
                    'store_id' => $storeId,
                    'staff_id' => $assign[0],
                    'shift_code_id' => $shiftCodeIds[$assign[1]],
                    'work_date' => $date,
                    'status' => 'scheduled',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Task Library
        $tasks = [
            ['Check inventory levels', 15],
            ['Clean store floor', 30],
            ['Restock shelves', 45],
            ['Customer service desk', 60],
            ['Cash register operation', 120],
        ];

        $taskLibraryIds = [];
        foreach ($tasks as $task) {
            $taskLibraryIds[] = DB::table('task_library')->insertGetId([
                'task_group_id' => $taskGroupId,
                'task_name' => $task[0],
                'task_description' => $task[0] . ' - standard procedure',
                'estimated_minutes' => $task[1],
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ], 'task_library_id');
        }

        // Daily Schedule Tasks
        $today = now()->format('Y-m-d');
        $scheduleStaff = [$staffIds[1], $staffIds[2], $staffIds[3], $staffIds[4]];
        $timeSlots = ['08:00:00', '10:00:00', '13:00:00'];

        foreach ($scheduleStaff as $idx => $staffId) {
            foreach (array_slice($taskLibraryIds, 0, 3) as $taskIdx => $taskId) {
                $taskInfo = DB::table('task_library')->where('task_library_id', $taskId)->first();
                DB::table('daily_schedule_tasks')->insert([
                    'store_id' => $storeId,
                    'work_date' => $today,
                    'task_library_id' => $taskId,
                    'task_name' => $taskInfo->task_name,
                    'task_group_id' => $taskGroupId,
                    'assigned_staff_id' => $staffId,
                    'scheduled_start_time' => $timeSlots[$taskIdx],
                    'scheduled_end_time' => date('H:i:s', strtotime($timeSlots[$taskIdx]) + 3600),
                    'status' => $taskIdx == 0 ? 'completed' : 'pending',
                    'created_by' => $adminId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $this->command->info('Test data seeded successfully!');
        $this->command->info('Admin login: admin / password');
        $this->command->info('Leader login: leader / password');
    }
}
