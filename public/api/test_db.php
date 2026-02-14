<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'config.php';

header('Content-Type: application/json');

try {
    $conn = getDbConnection();
    echo json_encode(['success' => true, 'message' => 'Conexão com o banco de dados bem sucedida!']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro ao conectar: ' . $e->getMessage()]);
}
?>