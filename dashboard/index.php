<!DOCTYPE html>
<html>
<head>
    <title>Visitor Analytics</title>
    <link rel="stylesheet" href="assets/dashboard.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/date-fns@2.29.3"></script>
</head>
<body>
    <div class="header">
        <h1>Visitor Analytics</h1>
        <div class="date-range">
            <input type="date" id="start-date">
            <input type="date" id="end-date">
            <button onclick="loadData()">Apply</button>
        </div>
    </div>
    
    <div class="chart-container">
    <canvas id="analytics-chart" width="800" height="400"></canvas>
        <div class="chart-card">
            <h3>Daily Visits</h3>
            <canvas id="daily-visits"></canvas>
        </div>
        <div class="chart-card">
            <h3>Locations</h3>
            <canvas id="locations-chart"></canvas>
        </div>
        <div class="chart-card">
            <h3>Devices</h3>
            <canvas id="devices-chart"></canvas>
        </div>
    </div>

    <script src="assets/dashboard.js"></script>
</body>
</html>
