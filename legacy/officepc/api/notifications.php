<?php
// /api/notifications.php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT');
header('Access-Control-Allow-Headers: Content-Type');

require_once "db.php";

$method = $_SERVER['REQUEST_METHOD'];

// --- GET: Lấy thông báo ---
if ($method === 'GET') {
    if (!isset($_GET['recipient_id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'recipient_id is required']);
        exit;
    }
    $recipient_id = (int)$_GET['recipient_id'];
    $mode = $_GET['mode'] ?? 'all'; // 'all' or 'unread_count'

    if ($mode === 'unread_count') {
        // Chỉ đếm số lượng thông báo chưa đọc
        $sql = "SELECT COUNT(*) FROM notifications WHERE recipient_id = :recipient_id AND is_read = 0";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['recipient_id' => $recipient_id]);
        $count = $stmt->fetchColumn();
        echo json_encode(['unread_count' => (int)$count]);
    } else {
        // Lấy danh sách thông báo (ví dụ: 20 thông báo gần nhất)
        $sql = "
            SELECT 
                n.notification_id,
                n.task_id,
                n.message,
                n.is_read,
                n.created_at,
                a.staff_name as actor_name
            FROM notifications n
            LEFT JOIN staff_master a ON n.actor_id = a.staff_id
            WHERE n.recipient_id = :recipient_id
            ORDER BY n.created_at DESC
            LIMIT 20
        ";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['recipient_id' => $recipient_id]);
        $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($notifications, JSON_UNESCAPED_UNICODE);
    }
    exit;
}

// --- PUT: Cập nhật trạng thái thông báo (đánh dấu đã đọc) ---
if ($method === 'PUT') {
    $input = json_decode(file_get_contents("php://input"), true);

    if (!isset($input['notification_id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'notification_id is required']);
        exit;
    }

    $notification_id = (int)$input['notification_id'];
    $is_read = isset($input['is_read']) ? (int)$input['is_read'] : 1;

    $sql = "UPDATE notifications SET is_read = :is_read WHERE notification_id = :notification_id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        'is_read' => $is_read,
        'notification_id' => $notification_id
    ]);

    echo json_encode(['success' => $stmt->rowCount() > 0]);
    exit;
}

// --- POST: Tạo thông báo mới ---
if ($method === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);

    // Validate input
    if (!isset($input['recipient_id']) || !isset($input['message']) || !isset($input['task_id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'recipient_id, message, and task_id are required.']);
        exit;
    }

    $sql = "INSERT INTO notifications (recipient_id, actor_id, task_id, message, action_type) VALUES (:recipient_id, :actor_id, :task_id, :message, :action_type)";
    $stmt = $pdo->prepare($sql);

    try {
        $stmt->execute([
            'recipient_id' => (int)$input['recipient_id'],
            'actor_id'     => isset($input['actor_id']) ? (int)$input['actor_id'] : null,
            'task_id'      => (int)$input['task_id'],
            'message'      => $input['message'],
            'action_type'  => $input['action_type'] ?? 'task_assigned' // Default action type
        ]);
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
    }
    exit;
}

http_response_code(405); // Method Not Allowed
echo json_encode(['error' => 'Method not allowed']);