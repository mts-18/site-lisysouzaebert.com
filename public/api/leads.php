<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$conn = getDbConnection();

// CREATE (POST)
if ($method === 'POST') {
    // Ler dados do corpo da requisição (JSON)
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Dados inválidos']);
        exit;
    }

    // Validação básica
    if (empty($data['name']) || empty($data['email']) || empty($data['whatsapp']) || empty($data['service'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Campos obrigatórios faltando']);
        exit;
    }

    $name = $conn->real_escape_string(trim($data['name']));
    $email = $conn->real_escape_string(trim(strtolower($data['email'])));
    $whatsapp = $conn->real_escape_string(trim($data['whatsapp']));
    $service = $conn->real_escape_string(trim($data['service']));
    $message = isset($data['message']) ? $conn->real_escape_string(trim($data['message'])) : null;

    $sql = "INSERT INTO leads (name, email, whatsapp, service, message) VALUES ('$name', '$email', '$whatsapp', '$service', '$message')";

    if ($conn->query($sql) === TRUE) {
        $last_id = $conn->insert_id;
        // Retornar o objeto criado
        $newLead = [
            'id' => (string)$last_id, // Frontend espera string
            'name' => $name,
            'email' => $email,
            'whatsapp' => $whatsapp,
            'service' => $service,
            'message' => $message,
            'created_at' => date('c') // Data atual em ISO 8601
        ];
        
        echo json_encode([
            'success' => true,
            'message' => 'Lead criado com sucesso!',
            'data' => $newLead
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Erro ao salvar lead: ' . $conn->error]);
    }
}

// READ (GET)
elseif ($method === 'GET') {
    // Proteção: Apenas admin pode listar
    checkAuth();

    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
    $search = isset($_GET['search']) ? $conn->real_escape_string($_GET['search']) : '';
    $offset = ($page - 1) * $limit;

    $whereClause = "";
    if ($search) {
        $whereClause = "WHERE name LIKE '%$search%' OR email LIKE '%$search%' OR service LIKE '%$search%'";
    }

    // Contar total
    $countSql = "SELECT COUNT(*) as total FROM leads $whereClause";
    $countResult = $conn->query($countSql);
    $totalParams = $countResult->fetch_assoc();
    $total = (int)$totalParams['total'];

    // Buscar dados com paginação
    $sql = "SELECT * FROM leads $whereClause ORDER BY created_at DESC LIMIT $limit OFFSET $offset";
    $result = $conn->query($sql);

    $leads = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            // Garantir que ID seja string conforme esperado pelo frontend TS
            $row['id'] = (string)$row['id']; 
            $leads[] = $row;
        }
    }

    echo json_encode([
        'success' => true,
        'data' => $leads,
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'totalPages' => ceil($total / $limit)
        ]
    ]);
}

// DELETE (DELETE)
elseif ($method === 'DELETE') {
    // Proteção: Apenas admin pode deletar
    checkAuth();

    $id = isset($_GET['id']) ? $conn->real_escape_string($_GET['id']) : '';

    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID não fornecido']);
        exit;
    }

    $sql = "DELETE FROM leads WHERE id = '$id'";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'Lead deletado com sucesso']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Erro ao deletar lead: ' . $conn->error]);
    }
}

else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido']);
}

$conn->close();
?>
