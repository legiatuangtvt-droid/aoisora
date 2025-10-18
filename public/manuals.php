<?php
// /api/manuals.php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once "db.php";

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents("php://input"), true);

/**
 * Bảng `manuals` được giả định có các cột sau:
 * - manual_id (INT, PK, AI)
 * - manual_name (VARCHAR)
 * - manual_url (TEXT)
 * - created_at (TIMESTAMP)
 */

// --- GET: Lấy danh sách manuals ---
if ($method === 'GET') {
    $where = [];
    $params = [];

    if (isset($_GET['manual_id'])) {
        $where[] = "manual_id = :manual_id";
        $params['manual_id'] = (int)$_GET['manual_id'];
    }

    $sql = "SELECT * FROM manuals";
    if ($where) {
        $sql .= " WHERE " . implode(" AND ", $where);
    }
    $sql .= " ORDER BY manual_id DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

// --- POST: Thêm manual mới ---
if ($method === 'POST') {
    // Kiểm tra các trường bắt buộc
    if (!isset($input['manual_name']) || !isset($input['manual_url'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'manual_name and manual_url are required.']);
        exit;
    }

    $sql = "INSERT INTO manuals (manual_name, manual_url) VALUES (:manual_name, :manual_url)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        'manual_name' => $input['manual_name'],
        'manual_url' => $input['manual_url']
    ]);
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
    exit;
}

// --- PUT: Cập nhật manual ---
if ($method === 'PUT') {
    if (!isset($input['manual_id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'manual_id is required.']);
        exit;
    }
    $manual_id = (int)$input['manual_id'];

    $fields = [];
    $params = [];
    foreach ($input as $key => $value) {
        if ($key !== 'manual_id') {
            $fields[] = "$key = :$key";
            $params[$key] = $value;
        }
    }
    $params['manual_id'] = $manual_id;

    if (empty($fields)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'No fields to update.']);
        exit;
    }

    $sql = "UPDATE manuals SET " . implode(", ", $fields) . " WHERE manual_id = :manual_id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    echo json_encode(['success' => true]);
    exit;
}

// --- DELETE: Xóa manual ---
if ($method === 'DELETE') {
    // Sử dụng GET parameter hoặc body input để lấy ID
    $manual_id = isset($_GET['id']) ? (int)$_GET['id'] : ($input['manual_id'] ?? null);

    if (!$manual_id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'manual_id is required.']);
        exit;
    }
    $stmt = $pdo->prepare("DELETE FROM manuals WHERE manual_id = :manual_id");
    $stmt->execute(['manual_id' => $manual_id]);
    echo json_encode(['success' => true]);
    exit;
}
?>