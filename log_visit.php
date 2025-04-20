<?php

// --- Error Reporting (Keep disabled) ---
error_reporting(0);
ini_set('display_errors', 0);

// --- Database Configuration ---
$dbHost = 'localhost'; // Changed from netera-landing.com
$dbUser = 'u305610349_premier';
$dbPass = 'g8mkrJS&S';
$dbName = 'u305610349_premier';
$dbTable = 'visitor_logs';

// --- Script Logic ---
$response = ['status' => 'error', 'message' => 'Unknown error']; // Default error response

// 1. Get Visitor Info
$ipAddress = filter_var($_SERVER['REMOTE_ADDR'] ?? 'UNKNOWN', FILTER_VALIDATE_IP);
// Use htmlspecialchars instead of deprecated FILTER_SANITIZE_STRING
$userAgent = isset($_SERVER['HTTP_USER_AGENT']) ? htmlspecialchars($_SERVER['HTTP_USER_AGENT'], ENT_QUOTES, 'UTF-8') : 'UNKNOWN';
$phoneNumberInput = isset($_POST['phoneNumber']) ? trim($_POST['phoneNumber']) : '';
$phoneNumber = !empty($phoneNumberInput) ? htmlspecialchars($phoneNumberInput, ENT_QUOTES, 'UTF-8') : null;


if (!$ipAddress) {
    $ipAddress = 'INVALID_IP_FORMAT';
}

// 2. Connect to the database
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
