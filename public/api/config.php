<?php
// Determinar se estamos em ambiente local ou produção
$host = $_SERVER['HTTP_HOST'] ?? '';
$isLocal = ($host === 'localhost' || $host === '127.0.0.1' || $host === '127.0.0.1:8001' ||
    !isset($_SERVER['REQUEST_METHOD']));

if ($isLocal) {
    // Configurações para ambiente LOCAL (XAMPP / WAMP / Laragon)
    define('DB_HOST', '127.0.0.1');
    define('DB_USER', 'root');
    define('DB_PASS', '');
    define('DB_NAME', 'site_lisy');
} else {
    // Configurações para PRODUÇÃO (HOSTINGER)
    define('DB_HOST', 'localhost');
    define('DB_USER', 'u586355349_lisy');
    define('DB_PASS', 'LisySite2025!');
    define('DB_NAME', 'u586355349_Lisy');
}

// Configurar relatório de erros para LOG (não exibir na saída para não quebrar JSON)
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

// SEGURANÇA (AUTENTICAÇÃO)
define('API_SECRET', 'terapias-espirituais-admin-2024');


// Headers CORS e JSON
if (isset($_SERVER['REQUEST_METHOD'])) {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Content-Type: application/json; charset=utf-8');

    // Tratamento de pre-flight OPTIONS
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

function getDbConnection()
{
    // Tenta conectar
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    // Verifica erro de conexão
    if ($conn->connect_error) {
        // Log do erro real no servidor
        error_log("Erro de conexão MySQL: " . $conn->connect_error);

        // Retorna JSON de erro e encerra
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Erro interno de servidor (Database Connection)']);
        exit;
    }

    $conn->set_charset("utf8mb4");
    return $conn;
}

function checkAuth()
{
    // Polyfill para apache_request_headers em servidores que não suportam (ex: nginx/php-fpm as vezes)
    if (!function_exists('apache_request_headers')) {
        function apache_request_headers()
        {
            $headers = array();
            foreach ($_SERVER as $key => $value) {
                if (substr($key, 0, 5) == 'HTTP_') {
                    $headers[str_replace(' ', '-', ucwords(str_replace('_', ' ', strtolower(substr($key, 5)))))] = $value;
                }
            }
            return $headers;
        }
    }

    $headers = apache_request_headers();
    $authHeader = '';

    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
    } elseif (isset($headers['authorization'])) {
        $authHeader = $headers['authorization'];
    }

    // O formato esperado é "Bearer <SECRET>" ou apenas o secret
    $token = str_replace('Bearer ', '', $authHeader);

    if ($token !== API_SECRET) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Não autorizado']);
        exit;
    }
}
?>