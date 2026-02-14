<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$conn = getDbConnection();

// CREATE (POST)
if ($method === 'POST') {
    checkAuth(); // Protegido

    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Dados inválidos']);
        exit;
    }

    $title = isset($data['title']) ? $conn->real_escape_string(trim($data['title'])) : '';
    $content = isset($data['content']) ? $conn->real_escape_string($data['content']) : '';
    $image_url = isset($data['image_url']) ? $conn->real_escape_string(trim($data['image_url'])) : null;
    $video_url = isset($data['video_url']) ? $conn->real_escape_string(trim($data['video_url'])) : null;
    $video_vertical = isset($data['video_vertical']) ? (int) $data['video_vertical'] : 0;
    $published = isset($data['published']) ? (int) $data['published'] : 1;

    $sql = "INSERT INTO blog_posts (title, content, image_url, video_url, video_vertical, published) VALUES ('$title', '$content', '$image_url', '$video_url', $video_vertical, $published)";

    if ($conn->query($sql) === TRUE) {
        $last_id = $conn->insert_id;
        echo json_encode([
            'success' => true,
            'message' => 'Post criado com sucesso!',
            'data' => [
                'id' => (string) $last_id,
                'title' => $title,
                'content' => $content,
                'image_url' => $image_url,
                'published' => (bool) $published,
                'created_at' => date('c'),
                'updated_at' => date('c')
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Erro ao criar post: ' . $conn->error]);
    }
}

// UPDATE (PUT)
elseif ($method === 'PUT') {
    checkAuth();

    $data = json_decode(file_get_contents('php://input'), true);

    // Suporte a ID na URL ou no corpo
    $id = isset($_GET['id']) ? $_GET['id'] : (isset($data['id']) ? $data['id'] : null);

    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID não fornecido']);
        exit;
    }

    $fields = [];
    if (isset($data['title']))
        $fields[] = "title = '" . $conn->real_escape_string(trim($data['title'])) . "'";
    if (isset($data['content']))
        $fields[] = "content = '" . $conn->real_escape_string($data['content']) . "'";
    // Permitir limpar imagem enviando string vazia ou null
    if (array_key_exists('image_url', $data)) {
        $img = $data['image_url'] ? "'" . $conn->real_escape_string(trim($data['image_url'])) . "'" : "NULL";
        $fields[] = "image_url = $img";
    }
    if (array_key_exists('video_url', $data)) {
        $vid = $data['video_url'] ? "'" . $conn->real_escape_string(trim($data['video_url'])) . "'" : "NULL";
        $fields[] = "video_url = $vid";
    }
    if (isset($data['video_vertical'])) {
        $fields[] = "video_vertical = " . (int) $data['video_vertical'];
    }
    if (isset($data['published']))
        $fields[] = "published = " . (int) $data['published'];

    if (empty($fields)) {
        echo json_encode(['success' => true, 'message' => 'Nada para atualizar']);
        exit;
    }

    $sql = "UPDATE blog_posts SET " . implode(', ', $fields) . " WHERE id = '" . $conn->real_escape_string($id) . "'";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'Post atualizado com sucesso']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Erro ao atualizar post: ' . $conn->error]);
    }
}

// READ (GET)
elseif ($method === 'GET') {
    if (isset($_GET['id'])) {
        // Buscar post único
        $id = $conn->real_escape_string($_GET['id']);
        $sql = "SELECT * FROM blog_posts WHERE id = '$id'";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $post = $result->fetch_assoc();
            $post['id'] = (string) $post['id'];
            $post['published'] = (bool) $post['published'];
            echo json_encode(['success' => true, 'data' => $post]); // Formato esperado pelo frontend pode variar, ajustarei se necessário
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Post não encontrado']);
        }
    } else {
        // Listar posts
        $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 10;
        $offset = isset($_GET['offset']) ? (int) $_GET['offset'] : (($page - 1) * $limit); // Suporte a offset direto ou calcificado

        // Filtro de publicados (admin pode ver tudo se quiser, mas por padrão vamos mostrar publicados ou filtrar)
        // Frontend atual filtra published=true. Vamos suportar parametro.
        $where = "WHERE 1=1";
        if (isset($_GET['published'])) {
            $pub = $_GET['published'] === 'true' ? 1 : 0;
            $where .= " AND published = $pub";
        }

        $sql = "SELECT * FROM blog_posts $where ORDER BY created_at DESC LIMIT $limit OFFSET $offset";
        $result = $conn->query($sql);

        $posts = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $row['id'] = (string) $row['id'];
                $row['published'] = (bool) $row['published'];
                $posts[] = $row;
            }
        }

        // Se o frontend espera apenas array no data, ok. Se espera wrapper, ok.
        // O código React usa: const { data, error } = await supabase...
        // Supabase retorna { data: [], error: null }.
        // O meu wrapper retorna { success: true, data: [] }.
        // Terei que adaptar o wrapper no frontend ou retornar formato Supabase-like se possível, mas JSON API padrão é melhor.

        echo json_encode(['success' => true, 'data' => $posts]);
    }
}

// DELETE (DELETE)
elseif ($method === 'DELETE') {
    checkAuth();

    $id = isset($_GET['id']) ? $conn->real_escape_string($_GET['id']) : '';

    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID não fornecido']);
        exit;
    }

    $sql = "DELETE FROM blog_posts WHERE id = '$id'";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'Post deletado com sucesso']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Erro ao deletar post: ' . $conn->error]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido']);
}

$conn->close();
?>