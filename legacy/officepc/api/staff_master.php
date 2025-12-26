<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once "db.php";

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents("php://input"), true);

switch ($method) {
    // --- GET: Lấy danh sách nhân viên ---
    case 'GET':
        $sql = "SELECT s.*, sm.store_name, r.role_name FROM staff_master s LEFT JOIN store_master sm ON s.store_id = sm.store_id LEFT JOIN roles r ON s.role_id = r.role_id";
        $params = [];

        if (isset($_GET['staff_id'])) {
            $sql .= " WHERE s.staff_id = :staff_id";
            $params['staff_id'] = (int)$_GET['staff_id'];
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        } 
        // Thêm logic để lọc nhân viên theo store_id
        elseif (isset($_GET['store_id'])) {
            $sql .= " WHERE s.store_id = :store_id ORDER BY s.staff_name ASC";
            $params['store_id'] = (int)$_GET['store_id'];
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        } 
        else {
            $sql .= " ORDER BY s.staff_name ASC";
            $stmt = $pdo->query($sql);
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        }
        break;

    // --- POST: Thêm nhân viên mới ---
    case 'POST':
        $sql = "INSERT INTO staff_master (staff_name, store_id, role_id, email, password_hash) VALUES (:staff_name, :store_id, :role_id, :email, :password_hash)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'staff_name' => $input['staff_name'] ?? null,
            'store_id' => $input['store_id'] ?? null,
            'role_id' => $input['role_id'] ?? null,
            'email' => $input['email'] ?? null,
            'password_hash' => isset($input['password']) ? password_hash($input['password'], PASSWORD_DEFAULT) : null
        ]);
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        break;

    // --- PUT: Cập nhật thông tin nhân viên hoặc EXP ---
    case 'PUT':
        if (!isset($input['staff_id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'staff_id is required']);
            exit;
        }
        $staff_id = (int)$input['staff_id'];

        // Trường hợp đặc biệt: Chỉ cập nhật EXP
        if (isset($input['exp_increment'])) {
            $exp_increment = (int)$input['exp_increment'];
            $sql = "UPDATE staff_master SET exp = exp + :exp_increment WHERE staff_id = :staff_id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(['exp_increment' => $exp_increment, 'staff_id' => $staff_id]);

            // Đồng thời cộng EXP cho cửa hàng của nhân viên đó
            $stmtStore = $pdo->prepare("SELECT store_id FROM staff_master WHERE staff_id = ?");
            $stmtStore->execute([$staff_id]);
            $staffInfo = $stmtStore->fetch(PDO::FETCH_ASSOC);
            if ($staffInfo && $staffInfo['store_id']) {
                $store_id = $staffInfo['store_id'];
                $pdo->prepare("UPDATE store_master SET exp = exp + :exp_increment WHERE store_id = :store_id")->execute(['exp_increment' => $exp_increment, 'store_id' => $store_id]);
            }

            echo json_encode(['success' => true, 'message' => 'EXP updated.']);
            exit;
        }

        // Trường hợp cập nhật thông tin chung
        $fields = [];
        $params = [];
        foreach ($input as $key => $value) {
            if ($key !== 'staff_id' && $key !== 'password') {
                $fields[] = "$key = :$key";
                $params[$key] = $value;
            }
        }
        // Xử lý cập nhật mật khẩu riêng
        if (isset($input['password'])) {
            $fields[] = "password_hash = :password_hash";
            $params['password_hash'] = password_hash($input['password'], PASSWORD_DEFAULT);
        }

        if (empty($fields)) {
            http_response_code(400);
            echo json_encode(['error' => 'No fields to update.']);
            exit;
        }

        $params['staff_id'] = $staff_id;
        $sql = "UPDATE staff_master SET " . implode(", ", $fields) . " WHERE staff_id = :staff_id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        echo json_encode(['success' => true]);
        break;

    // --- DELETE: Xóa nhân viên ---
    case 'DELETE':
        if (!isset($input['staff_id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'staff_id is required']);
            exit;
        }
        $staff_id = (int)$input['staff_id'];
        $stmt = $pdo->prepare("DELETE FROM staff_master WHERE staff_id = :staff_id");
        $stmt->execute(['staff_id' => $staff_id]);
        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(405); // Method Not Allowed
        echo json_encode(['error' => 'Method not supported.']);
        break;
}
?>