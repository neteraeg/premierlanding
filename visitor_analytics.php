<?php
require_once 'vendor/autoload.php';
use GeoIp2\Database\Reader;

class VisitorAnalytics {
    private $db;
    private $geoip;

    public function __construct($dbHost, $dbUser, $dbPass, $dbName) {
        $this->db = new mysqli($dbHost, $dbUser, $dbPass, $dbName);
        $this->geoip = new Reader('/path/to/GeoLite2-City.mmdb');
    }

    public function getDailyVisits($startDate, $endDate) {
        $stmt = $this->db->prepare("
            SELECT DATE(visit_timestamp) AS day, COUNT(*) AS count 
            FROM visitor_logs 
            WHERE visit_timestamp BETWEEN ? AND ?
            GROUP BY day
        ");
        $stmt->bind_param("ss", $startDate, $endDate);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public function getLocationData() {
        $result = $this->db->query("
            SELECT country_code, COUNT(*) AS count 
            FROM visitor_logs 
            GROUP BY country_code
        ");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getDeviceData() {
        $result = $this->db->query("
            SELECT device_type, COUNT(*) AS count 
            FROM visitor_logs 
            GROUP BY device_type
        ");
        return $result->fetch_all(MYSQLI_ASSOC);
    }
}
?>
