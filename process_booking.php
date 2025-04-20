<?php

// --- Database Configuration ---
$dbHost = 'localhost'; // Changed from netera-landing.com
$dbUser = 'u305610349_premier';
$dbPass = 'g8mkrJS&S'; // Be cautious with hardcoding passwords in production environments
$dbName = 'u305610349_premier';
$dbTable = 'leads'; // The table name we defined in schema.sql

// --- Error Reporting (Disable in production for security) ---
// error_reporting(E_ALL);
// ini_set('display_errors', 1);
error_reporting(0); // Turn off error reporting for production

// --- Script Logic ---

// 1. Get Visitor Info (IP and User Agent) - Do this early
$ipAddress = filter_var($_SERVER['REMOTE_ADDR'] ?? 'UNKNOWN', FILTER_VALIDATE_IP);
// Use htmlspecialchars instead of deprecated FILTER_SANITIZE_STRING
$userAgent = isset($_SERVER['HTTP_USER_AGENT']) ? htmlspecialchars($_SERVER['HTTP_USER_AGENT'], ENT_QUOTES, 'UTF-8') : 'UNKNOWN';

// 2. Check if the form was submitted using POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // 3. Get and sanitize form data
    // Use filter_input for basic sanitization/validation
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    $phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING); // Basic sanitization, consider more specific validation
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);

    // Optional: Retrieve quiz answers if needed (already sanitized as strings)
    // $gender = filter_input(INPUT_POST, 'gender', FILTER_SANITIZE_STRING);
    // $need = filter_input(INPUT_POST, 'need', FILTER_SANITIZE_STRING);
    // $age = filter_input(INPUT_POST, 'age', FILTER_SANITIZE_NUMBER_INT);


    // 3. Validate required fields
    if (empty($name) || empty($phone) || empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Basic validation failed
        // Redirect back with an error flag (optional)
        header("Location: index.html?error=validation");
        exit;
    }

    // 4. Connect to the database
    $conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);

    // Check connection
    if ($conn->connect_error) {
        // Log error internally if possible, don't expose details to user
        // error_log("Database Connection Error: " . $conn->connect_error);
        // Redirect back with a generic error flag
        header("Location: index.html?error=db_connection");
        exit;
    }

    // 5. Prepare SQL statement (using prepared statements to prevent SQL injection)
    // Assumes table 'leads' with columns 'name', 'phone', 'email'
    $sql = "INSERT INTO " . $dbTable . " (name, phone, email) VALUES (?, ?, ?)";

    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        // Log error internally
        // error_log("Database Prepare Error: " . $conn->error);
        $conn->close();
        header("Location: index.html?error=db_prepare");
        exit;
    }

    // 6. Bind parameters
    // 'sss' denotes three string parameters
    $stmt->bind_param("sss", $name, $phone, $email);

    // 7. Execute the statement to insert into 'leads'
    if ($stmt->execute()) {
        // Success! Get the ID of the inserted lead
        $lastLeadId = $conn->insert_id;
        $stmt->close(); // Close the first statement

        // 8. Prepare and execute statement to insert into 'visitor_logs'
        $logSql = "INSERT INTO visitor_logs (ip_address, user_agent, lead_id) VALUES (?, ?, ?)";
        $logStmt = $conn->prepare($logSql);

        if ($logStmt) {
            $logStmt->bind_param("ssi", $ipAddress, $userAgent, $lastLeadId);
            if (!$logStmt->execute()) {
                // Log error internally if visitor log insertion fails, but don't stop the redirect
                // error_log("Visitor Log Insert Error: " . $logStmt->error);
            }
            $logStmt->close();
        } else {
             // Log error internally if prepare fails
             // error_log("Visitor Log Prepare Error: " . $conn->error);
        }

        // 9. Close connection and redirect
        $conn->close();
        header("Location: index.html?success=1");
        exit;

    } else {
        // Lead insertion failed
        // Log error internally
        // error_log("Database Execute Error: " . $stmt->error);
        $stmt->close();
        $conn->close();
        header("Location: index.html?error=db_execute");
        exit;
    }

} else {
    // If not a POST request, redirect back to the form (or show an error)
    header("Location: index.html");
    exit;
}

?>
