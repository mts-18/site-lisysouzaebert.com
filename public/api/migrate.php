<?php
require_once 'config.php';

header('Content-Type: application/json');

$conn = getDbConnection();

$messages = [];

// Coluna video_url
$result = $conn->query("SHOW COLUMNS FROM blog_posts LIKE 'video_url'");
if ($result->num_rows == 0) {
    if ($conn->query("ALTER TABLE blog_posts ADD COLUMN video_url VARCHAR(255) AFTER image_url")) {
        $messages[] = "Coluna video_url adicionada.";
    }
}

// Coluna video_vertical
$result = $conn->query("SHOW COLUMNS FROM blog_posts LIKE 'video_vertical'");
if ($result->num_rows == 0) {
    if ($conn->query("ALTER TABLE blog_posts ADD COLUMN video_vertical BOOLEAN DEFAULT FALSE AFTER video_url")) {
        $messages[] = "Coluna video_vertical adicionada.";
    }
}

if (empty($messages)) {
    echo json_encode(['success' => true, 'message' => 'O banco de dados já está atualizado.']);
} else {
    echo json_encode(['success' => true, 'message' => implode(" ", $messages)]);
}

$conn->close();
?>