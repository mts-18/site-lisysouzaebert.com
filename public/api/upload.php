<?php
require_once 'config.php';

// Apenas POST permitido
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Método não permitido']);
    exit;
}

checkAuth();

// Verificar se arquivo foi enviado
if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['message' => 'Nenhum arquivo enviado ou erro no upload.']);
    exit;
}

$file = $_FILES['file'];
$uploadDir = '../uploads/';

// Criar diretório se não existir
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Validar extensão
$allowedExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'ogg'];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

if (!in_array($ext, $allowedExts)) {
    http_response_code(400);
    echo json_encode(['message' => 'Tipo de arquivo não permitido. Apenas imagens e vídeos (mp4, webm, ogg).']);
    exit;
}

// Gerar nome único
$filename = uniqid() . '.' . $ext;
$destination = $uploadDir . $filename;

if (move_uploaded_file($file['tmp_name'], $destination)) {
    // Retornar URL pública
    // Assumindo que o script está em /api/upload.php, e o arquivo em /uploads/filename
    // A URL relativa seria /uploads/filename
    $publicUrl = '/uploads/' . $filename;

    echo json_encode([
        'success' => true,
        'url' => $publicUrl,
        'message' => 'Upload realizado com sucesso'
    ]);
} else {
    http_response_code(500);
    echo json_encode(['message' => 'Falha ao mover arquivo enviado.']);
}
?>