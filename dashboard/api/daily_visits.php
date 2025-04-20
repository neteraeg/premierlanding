<?php
require_once '../../visitor_analytics.php';
header('Content-Type: application/json');

$analytics = new VisitorAnalytics(
    'localhost',
    'u305610349_premier',
    'g8mkrJS&S',
    'u305610349_premier'
);

$start = $_GET['start'] ?? date('Y-m-d');
$end = $_GET['end'] ?? date('Y-m-d');
echo json_encode($analytics->getDailyVisits($start, $end));
?>
