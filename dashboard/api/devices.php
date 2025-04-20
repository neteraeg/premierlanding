<?php
require_once '../../visitor_analytics.php';
header('Content-Type: application/json');

$analytics = new VisitorAnalytics(
    'localhost',
    'u305610349_premier',
    'g8mkrJS&S',
    'u305610349_premier'
);

echo json_encode($analytics->getDeviceData());
?>
