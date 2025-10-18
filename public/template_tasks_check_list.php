<?php
// /api/template_tasks_check_list.php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once "db.php"; // $pdo

$method = $_SERVER['REQUEST_METHOD'];

/**
 * Bảng `template_tasks_check_list` được giả định có các cột:
 * - template_task_check_list_id (INT, PK, AI)
 * - template_task_id (INT, FK)
 * - check_list_id (INT, FK)
 * Bảng này chỉ lưu liên kết, không có trạng thái.
 */

switch ($method) {
    // --- GET: Lấy danh sách check-list theo template_task_id ---
    case 'GET':
        if (!isset($_GET['template_task_id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'template_task_id is required.']);
            exit;
        }
        $template_task_id = (int)$_GET['template_task_id'];

        $stmt = $pdo->prepare("
            SELECT 
                ttcl.template_task_check_list_id,
                ttcl.template_task_id,
                ttcl.check_list_id,
                cl.check_list_name
            FROM template_tasks_check_list ttcl
            INNER JOIN check_lists cl ON ttcl.check_list_id = cl.check_list_id
            WHERE ttcl.template_task_id = :template_task_id
            ORDER BY cl.check_list_id ASC
        ");
        $stmt->execute(['template_task_id' => $template_task_id]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    // --- POST: Thêm một hoặc nhiều check-list vào một template task ---
    case 'POST':
        $input = json_decode(file_get_contents("php://input"), true);
        if (!isset($input['template_task_id']) || !isset($input['check_list_ids']) || !is_array($input['check_list_ids'])) {
            http_response_code(400);
            echo json_encode(['error' => 'template_task_id and a check_list_ids array are required.']);
            exit;
        }

        $template_task_id = (int)$input['template_task_id'];
        $check_list_ids = $input['check_list_ids'];

        try {
            $pdo->beginTransaction();

            $sql = "INSERT INTO template_tasks_check_list (template_task_id, check_list_id) VALUES (:template_task_id, :check_list_id)";
            $stmt = $pdo->prepare($sql);

            foreach ($check_list_ids as $check_list_id) {
                $stmt->execute([
                    'template_task_id' => $template_task_id,
                    'check_list_id' => (int)$check_list_id
                ]);
            }

            $pdo->commit();
            echo json_encode(['success' => true, 'message' => count($check_list_ids) . ' checklist items associated.']);

        } catch (Exception $e) {
            $pdo->rollBack();
            http_response_code(500);
            echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
        }
        break;

    // --- DELETE: Xóa một check-list khỏi một template task ---
    case 'DELETE':
        $input = json_decode(file_get_contents("php://input"), true);
        // ID có thể được gửi qua query string hoặc body
        $template_task_id = $_GET['template_task_id'] ?? $input['template_task_id'] ?? null;
        $check_list_id = $_GET['check_list_id'] ?? $input['check_list_id'] ?? null;

        if (!$template_task_id || !$check_list_id) {
            http_response_code(400);
            echo json_encode(['error' => 'template_task_id and check_list_id are required.']);
            exit;
        }

        $stmt = $pdo->prepare("
            DELETE FROM template_tasks_check_list
            WHERE template_task_id = :template_task_id AND check_list_id = :check_list_id
        ");
        $stmt->execute([
            'template_task_id' => (int)$template_task_id,
            'check_list_id' => (int)$check_list_id
        ]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Association deleted.']);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Association not found.']);
        }
        break;

    default:
        http_response_code(405); // Method Not Allowed
        echo json_encode(['error' => 'Unsupported request method.']);
        break;
}
?>