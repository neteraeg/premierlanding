<?php

// --- Error Reporting (Temporary debug enabled) ---
error_reporting(E_ALL);
ini_set('display_errors', 1);

// --- Debug Logging ---
$debugLogPath = __DIR__ . '/debug.log';
function log_debug($message, $data = []) {
    global $debugLogPath;
    $logEntry = date('[Y-m-d H:i:s]') . ' ' . $message;
    if (!empty($data)) {
        $logEntry .= "\n" . json_encode($data, JSON_PRETTY_PRINT);
    }
    $logEntry .= "\n";
    
    // Write to file
    if (is_writable($debugLogPath)) {
        file_put_contents($debugLogPath, $logEntry, FILE_APPEND);
    }
    
    // Output to browser console
    echo "<!-- DEBUG: " . htmlspecialchars($logEntry) . " -->\n";
}

// --- Database Configuration ---
$dbHost = 'localhost';
$dbUser = 'u305610349_premier';
$dbPass = 'g8mkrJS&S';
$dbName = 'u305610349_premier';
// Verify these credentials match your actual database setup
// Ensure the database user has proper privileges
$dbTable = 'visitor_logs';

// --- Script Logic ---
log_debug('Script initialized', [
    'client_ip' => $_SERVER['REMOTE_ADDR'] ?? 'none',
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'none'
]);
$response = ['status' => 'error', 'message' => 'Unknown error']; // Default error response

// 1. Get Visitor Info
$ipAddress = filter_var($_SERVER['REMOTE_ADDR'] ?? 'UNKNOWN', FILTER_VALIDATE_IP);
// Use htmlspecialchars instead of deprecated FILTER_SANITIZE_STRING
$userAgent = isset($_SERVER['HTTP_USER_AGENT']) ? htmlspecialchars($_SERVER['HTTP_USER_AGENT'], ENT_QUOTES, 'UTF-8') : 'UNKNOWN';
$phoneNumberInput = isset($_POST['phoneNumber']) ? trim($_POST['phoneNumber']) : '';
$phoneNumber = !empty($phoneNumberInput) ? htmlspecialchars($phoneNumberInput, ENT_QUOTES, 'UTF-8') : null;
log_debug('Visitor info collected', [
    'ip' => $ipAddress,
    'user_agent' => $userAgent,
    'phone_number' => $phoneNumber ? 'provided' : 'not_provided'
]);


if (!$ipAddress) {
    $ipAddress = 'INVALID_IP_FORMAT';
}

// 2. Connect to the database
log_debug('Attempting database connection', [
    'host' => $dbHost,
    'user' => $dbUser,
    'database' => $dbName
]);
$conn = @new mysqli($dbHost, $dbUser, $dbPass, $dbName);

if ($conn->connect_error) {
    $response['message'] = "Database Connection Error: " . $conn->connect_error;
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

// 3. Prepare SQL statement
$sql = "INSERT INTO " . $dbTable . " (ip_address, user_agent, phone_number) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    $response['message'] = "Database Prepare Error: " . $conn->error;
    http_response_code(500);
    $conn->close();
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

// 4. Bind parameters (ip, userAgent, phoneNumber)
$bindSuccess = @$stmt->bind_param("sss", $ipAddress, $userAgent, $phoneNumber);
if ($bindSuccess === false) {
    $response['message'] = "Database Bind Param Error: " . $stmt->error;
    http_response_code(500);
    $stmt->close();
    $conn->close();
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

// 5. Execute the statement and check result
if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        $response['status'] = 'success';
        $response['message'] = 'Visit logged successfully.';
        http_response_code(200);
    } else {
        $response['message'] = 'Database Execute Warning: Statement executed but no rows were affected.';
        http_response_code(200);
    }
} else {
    $response['message'] = "Database Execute Error: " . $stmt->error;
    http_response_code(500);
}

$stmt->close();
$conn->close();

// 7. Respond with JSON
header('Content-Type: application/json');
echo json_encode($response);
exit;

?>
