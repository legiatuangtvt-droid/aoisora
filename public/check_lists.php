<?php
// /api/check_lists.php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once "db.php"; // Đảm bảo tệp này kết nối đến CSDL của bạn

$method = $_SERVER['REQUEST_METHOD'];

/**
 * Bảng `check_lists` được giả định có các cột:
 * - check_list_id (INT, PK, AI)
 * - check_list_name (VARCHAR)
 * - created_at (TIMESTAMP)
 */

switch ($method) {
    // --- GET: Lấy danh sách check-list ---
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM check_lists ORDER BY check_list_id ASC");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    // --- POST: Thêm một hoặc nhiều check-list ---
    case 'POST':
        $input = json_decode(file_get_contents("php://input"), true);

        // Hỗ trợ cả việc thêm một item hoặc một mảng items
        $items = [];
        if (isset($input['items']) && is_array($input['items'])) {
            $items = $input['items'];
        } elseif (isset($input['check_list_name'])) {
            $items[] = $input;
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Input must contain "check_list_name" or an array of "items".']);
            exit;
        }

        $final_ids = [];
        try {
            $pdo->beginTransaction();

            // Chuẩn bị câu lệnh SELECT và INSERT
            $select_sql = "SELECT check_list_id FROM check_lists WHERE check_list_name = :check_list_name";
            $insert_sql = "INSERT INTO check_lists (check_list_name) VALUES (:check_list_name)";
            
            $select_stmt = $pdo->prepare($select_sql);
            $insert_stmt = $pdo->prepare($insert_sql);

            foreach ($items as $item) {
                $name = trim($item['check_list_name'] ?? '');
                if (empty($name)) continue;

                // 1. Tìm kiếm item đã tồn tại
                $select_stmt->execute(['check_list_name' => $name]);
                $existing_id = $select_stmt->fetchColumn();

                if ($existing_id) {
                    // 2a. Nếu đã tồn tại, sử dụng ID của nó
                    $final_ids[] = (int)$existing_id;
                } else {
                    // 2b. Nếu chưa tồn tại, tạo mới và lấy ID
                    $insert_stmt->execute(['check_list_name' => $name]);
                    $new_id = $pdo->lastInsertId();
                    if ($new_id) {
                        $final_ids[] = (int)$new_id;
                    }
                }
            }

            $pdo->commit();

            // Nếu chỉ có một item được thêm, trả về id đơn. Nếu nhiều, trả về mảng ids.
            // Logic này vẫn giữ nguyên để tương thích với các request chỉ gửi 1 item
            if (count($final_ids) === 1 && isset($input['check_list_name'])) {
                 echo json_encode(['success' => true, 'id' => $final_ids[0]]);
            } else {
                 echo json_encode(['success' => true, 'ids' => $final_ids]);
            }

        } catch (Exception $e) {
            $pdo->rollBack();
            http_response_code(500);
            // Ghi log lỗi chi tiết hơn cho developer
            error_log("Checklist API Error: " . $e->getMessage());
            // Trả về thông báo lỗi chung cho người dùng
            echo json_encode([
                'success' => false,
                'error' => 'An internal server error occurred while processing checklist items.',
                'details' => $e->getMessage() // Chỉ nên hiển thị khi ở môi trường dev
            ]);
        }
        break;

    default:
        http_response_code(405); // Method Not Allowed
        echo json_encode(['error' => 'Unsupported request method.']);
        break;
}
?>