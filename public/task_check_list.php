<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once "db.php"; // Kết nối CSDL

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents("php://input"), true);

if ($method === 'POST') {
    // Logic để gán các checklist items vào một task mới tạo
    if (!isset($input['task_id']) || !isset($input['check_list_ids']) || !is_array($input['check_list_ids'])) {
        http_response_code(400);
        echo json_encode(['error' => 'task_id and check_list_ids array are required.']);
        exit;
    }

    $taskId = (int)$input['task_id'];
    $checkListIds = $input['check_list_ids'];

    $sql = "INSERT INTO task_check_list (task_id, check_list_id, check_status) VALUES (:task_id, :check_list_id, 'Not Yet')";
    $stmt = $pdo->prepare($sql);

    $pdo->beginTransaction();
    try {
        foreach ($checkListIds as $checkId) {
            $stmt->execute(['task_id' => $taskId, 'check_list_id' => (int)$checkId]);
        }
        $pdo->commit();
        echo json_encode(['success' => true, 'message' => 'Checklist items associated successfully.']);
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
    }
    exit;
}

if ($method === 'PUT') {
    // Logic để cập nhật trạng thái của các checklist items và task chính
    if (!isset($input['task_id']) || !isset($input['checks']) || !is_array($input['checks'])) {
        http_response_code(400);
        echo json_encode(['error' => 'task_id and checks array are required.']);
        exit;
    }

    $taskId = (int)$input['task_id'];
    $checks = $input['checks'];

    $pdo->beginTransaction();
    try {
        // 1. Cập nhật từng mục trong checklist
        $sqlUpdateCheck = "UPDATE task_check_list SET check_status = :check_status, completed_at = :completed_at WHERE task_id = :task_id AND check_list_id = :check_list_id";
        $stmtUpdateCheck = $pdo->prepare($sqlUpdateCheck);

        foreach ($checks as $check) {
            $completed_at = ($check['check_status'] === 'Done') ? date('Y-m-d H:i:s') : null;
            $stmtUpdateCheck->execute([
                'check_status' => $check['check_status'],
                'completed_at' => $completed_at,
                'task_id' => $taskId,
                'check_list_id' => (int)$check['check_list_id']
            ]);
        }

        // 2. Đếm tổng số và số mục đã hoàn thành để quyết định trạng thái của task chính
        $sqlCount = "SELECT COUNT(*) as total, SUM(CASE WHEN check_status = 'Done' THEN 1 ELSE 0 END) as done_count FROM task_check_list WHERE task_id = :task_id";
        $stmtCount = $pdo->prepare($sqlCount);
        $stmtCount->execute(['task_id' => $taskId]);
        $counts = $stmtCount->fetch(PDO::FETCH_ASSOC);

        $total = (int)$counts['total'];
        $doneCount = (int)$counts['done_count'];
        $newStatusId = null;

        // 3. Xác định status_id mới cho task
        // Giả định: 7 = Not Yet, 8 = On Progress, 9 = Done
        if ($doneCount === $total && $total > 0) {
            $newStatusId = 9; // Done
        } elseif ($doneCount > 0) {
            $newStatusId = 8; // On Progress
        } else {
            $newStatusId = 7; // Not Yet
        }

        // 4. Cập nhật trạng thái của task chính trong bảng 'tasks'
        if ($newStatusId !== null) {
            $sqlUpdateTask = "UPDATE tasks SET status_id = :status_id WHERE task_id = :task_id";
            $stmtUpdateTask = $pdo->prepare($sqlUpdateTask);
            $stmtUpdateTask->execute([
                'status_id' => $newStatusId,
                'task_id' => $taskId
            ]);

            // --- LOGIC TẠO THÔNG BÁO KHI TRẠNG THÁI THAY ĐỔI ---
            // Nếu trạng thái mới là "On Progress" (8) hoặc "Done" (9), tạo thông báo
            if ($newStatusId === 8 || $newStatusId === 9) {
                try {
                    // 1. Lấy thông tin người tạo và người thực hiện task
                    $stmtInfo = $pdo->prepare("
                        SELECT 
                            t.created_staff_id, 
                            t.do_staff_id,
                            t.task_name,
                            s.staff_name AS actor_name, 
                            st.store_name AS actor_store
                        FROM tasks t
                        JOIN staff_master s ON t.do_staff_id = s.staff_id
                        JOIN store_master st ON s.store_id = st.store_id
                        WHERE t.task_id = :task_id
                    ");
                    $stmtInfo->execute(['task_id' => $taskId]);
                    $taskInfo = $stmtInfo->fetch(PDO::FETCH_ASSOC);

                    if ($taskInfo && $taskInfo['created_staff_id'] && $taskInfo['do_staff_id']) {
                        $recipient_id = $taskInfo['created_staff_id'];
                        $actor_id = $taskInfo['do_staff_id'];
                        $statusName = ($newStatusId === 9) ? 'hoàn thành' : 'cập nhật tiến độ';
                        $localCompletedTime = date('H:i d/m');
                        $message = "{$taskInfo['actor_name']} ({$taskInfo['actor_store']}) đã {$statusName} Task Checklist #{$taskId} lúc {$localCompletedTime}.";

                        $sqlNotify = "INSERT INTO notifications (recipient_id, actor_id, task_id, action_type, message) VALUES (:recipient_id, :actor_id, :task_id, :action_type, :message)";
                        $stmtNotify = $pdo->prepare($sqlNotify);
                        $stmtNotify->execute(['recipient_id' => $recipient_id, 'actor_id' => $actor_id, 'task_id' => $taskId, 'action_type' => 'task_status_changed', 'message' => $message]);
                    }
                } catch (Exception $e) {
                    error_log("Notification creation failed for checklist task $taskId: " . $e->getMessage());
                }
            }
        }

        $pdo->commit();
        echo json_encode(['success' => true, 'message' => 'Checklist and task status updated successfully.']);

    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Database transaction failed: ' . $e->getMessage()]);
    }
    exit;
}

http_response_code(405); // Method Not Allowed
echo json_encode(['error' => 'Method not supported.']);

?>