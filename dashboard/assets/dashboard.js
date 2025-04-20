// Chart instances
let dailyChart, locationChart, deviceChart;

async function loadData() {
    const start = document.getElementById('start-date').value;
    const end = document.getElementById('end-date').value;
    
    const [dailyData, locations, devices] = await Promise.all([
        fetchData('/dashboard/api/daily_visits.php?start=' + start + '&end=' + end),
        fetchData('/dashboard/api/locations.php'),
        fetchData('/dashboard/api/devices.php')
    ]);

    updateChart(dailyChart, '#daily-visits', 'bar', {
        labels: dailyData.map(d => d.day),
        datasets: [{
            label: 'Visits per Day',
            data: dailyData.map(d => d.count),
            backgroundColor: '#2196F3'
        }]
    });

    updateChart(locationChart, '#locations-chart', 'doughnut', {
        labels: locations.map(l => l.country_code || 'Unknown'),
        datasets: [{
            data: locations.map(l => l.count),
            backgroundColor: ['#4CAF50', '#FF9800', '#E91E63', '#9C27B0']
        }]
    });

    updateChart(deviceChart, '#devices-chart', 'pie', {
        labels: devices.map(d => d.device_type),
        datasets: [{
            data: devices.map(d => d.count),
            backgroundColor: ['#00BCD4', '#FF5722', '#8BC34A']
        }]
    });
}

function updateChart(chart, selector, type, data) {
    const ctx = document.querySelector(selector).getContext('2d');
    if (chart) chart.destroy();
    return new Chart(ctx, { type, data });
}

async function fetchData(url) {
    const response = await fetch(url);
    return response.json();
}

// Initial load with default dates
window.onload = () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('start-date').value = today;
    document.getElementById('end-date').value = today;
    loadData();
};
