// Dashboard JavaScript for interactivity

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initializeDashboard();
    
    // Set up event listeners
    setupEventListeners();
    
    // Start real-time updates simulation
    startRealTimeUpdates();
});

let overviewChart = null;
let appState = { lat: undefined, lon: undefined, date: undefined, lastResult: null };

function initializeDashboard() {
    console.log('Space Temperature Analytics Dashboard initialized');
    // Render initial overview chart (24H)
    renderOverviewChart('24H');
}

function setupEventListeners() {
    // Time filter buttons
    const timeFilters = document.querySelectorAll('.time-filter');
    timeFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Remove active class from all filters
            timeFilters.forEach(f => f.classList.remove('active'));
            // Add active class to clicked filter
            this.classList.add('active');
            // Update overview chart
            renderOverviewChart(this.textContent.trim());
        });
    });
    
    // Sector items click handlers
    const sectorItems = document.querySelectorAll('.sector-item');
    sectorItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectorName = this.querySelector('.sector-name').textContent;
            showSectorDetails(sectorName);
        });
    });
    
    // Navigation items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
        });
    });
    
    // Notification button
    const notificationBtn = document.querySelector('.nav-button');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            showNotifications();
        });
    }

    // Accordion: Project Brief
    const accordions = document.querySelectorAll('.accordion .accordion-header');
    accordions.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.accordion-item');
            if (!item) return;
            // toggle current
            item.classList.toggle('open');
        });
    });

    // Map pin-drop (if Leaflet map is present)
    if (window.map) {
        window.map.on('click', (e) => {
            const { lat, lng } = e.latlng;
            appState.lat = lat;
            appState.lon = lng;
            // place or move marker
            if (window.marker) {
                window.marker.setLatLng([lat, lng]);
            } else {
                window.marker = L.marker([lat, lng]).addTo(window.map);
            }
        });
    }

    // Get Odds button
    const getOddsBtn = document.querySelector('.button-group .big-button');
    if (getOddsBtn) {
        getOddsBtn.addEventListener('click', async () => {
            const dateInput = document.getElementById('dateInput');
            if (dateInput && dateInput.value) {
                appState.date = new Date(dateInput.value);
            }
            if (typeof appState.lat !== 'number' || typeof appState.lon !== 'number') {
                alert('Please drop a pin on the map (click) or use the search to set a location.');
                return;
            }
            if (!appState.date) {
                alert('Please select a date.');
                return;
            }
            setLoading(true);
            try {
                const result = await fetchProbabilities(appState.lat, appState.lon, appState.date);
                appState.lastResult = result;
                renderProbabilityCards(result);
                renderProbabilityTrend(result);
                renderOverviewCategories(result);
            } catch (e) {
                console.error(e);
                alert('Failed to fetch probabilities.');
            } finally {
                setLoading(false);
            }
        });
    }

    // Export buttons
    const exportJsonBtn = document.getElementById('exportJsonBtn');
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    if (exportJsonBtn) exportJsonBtn.addEventListener('click', () => exportJSON(appState.lastResult));
    if (exportCsvBtn) exportCsvBtn.addEventListener('click', () => exportCSV(appState.lastResult));
}

// Returns synthetic overview data for ranges
function getOverviewData(range) {
    const labels = ['HOT', 'COLD', 'WET', 'WINDY', 'UNCOMF.'];
    // Base values roughly matching screenshot proportions
    const base = [40, 28, 80, 45, 60];
    let multiplier = 1;
    if (range === '7D') multiplier = 0.9;
    else if (range === '30D') multiplier = 1.1;

    // Add small random jitter for realism
    const data = base.map(v => Math.max(10, Math.round(v * multiplier + (Math.random() - 0.5) * 6)));
    return { labels, data };
}

function renderOverviewChart(range = '24H') {
    const canvas = document.getElementById('overviewChart');
    if (!canvas) return; // Not on page
    const ctx = canvas.getContext('2d');

    const { labels, data } = getOverviewData(range);

    if (overviewChart) {
        overviewChart.data.labels = labels;
        overviewChart.data.datasets[0].data = data;
        overviewChart.update();
        return;
    }

    overviewChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Prevalence Index',
                data,
                backgroundColor: 'rgba(37, 99, 235, 0.35)',
                borderColor: '#2563eb',
                borderWidth: 1.5,
                borderRadius: 8,
                maxBarThickness: 48
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => `${ctx.parsed.y}`
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#a1a6b3' },
                    grid: { display: false }
                },
                y: {
                    ticks: { color: '#a1a6b3' },
                    grid: { color: 'rgba(255, 255, 255, 0.06)' },
                    beginAtZero: true
                }
            }
        }
    });
}

function showSectorDetails(sectorName) {
    console.log(`Showing details for ${sectorName}`);
    
    // Create a simple modal or notification
    const notification = document.createElement('div');
    notification.className = 'sector-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <h4>${sectorName} Details</h4>
            <p>Detailed sensor data and analytics would be displayed here.</p>
            <button onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--panel);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 20px;
        z-index: 1000;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function showNotifications() {
    console.log('Showing notifications');
    
    // Toggle notification panel (simplified)
    alert('Notifications:\n• 3 Critical temperature alerts\n• 2 Sensor calibration reminders\n• 1 System update available');
}

function startRealTimeUpdates() {
    // Simulate real-time temperature updates
    setInterval(() => {
        updateTemperatureValues();
        updateSensorStatus();
    }, 30000); // Update every 30 seconds
}

function updateTemperatureValues() {
    const currentTemp = document.querySelector('.metric-value');
    if (currentTemp && currentTemp.textContent.includes('°C')) {
        // Generate random temperature variation
        const baseTemp = -273;
        const variation = (Math.random() - 0.5) * 2; // ±1°C variation
        const newTemp = (baseTemp + variation).toFixed(1);
        currentTemp.textContent = `${newTemp}°C`;
    }
    
    // Update sector temperatures
    const sectorTemps = document.querySelectorAll('.sector-temp');
    sectorTemps.forEach(temp => {
        const currentValue = parseFloat(temp.textContent.replace('°C', ''));
        const variation = (Math.random() - 0.5) * 1; // ±0.5°C variation
        const newValue = (currentValue + variation).toFixed(1);
        temp.textContent = `${newValue}°C`;
    });
}

function updateSensorStatus() {
    // Randomly update sensor count
    const sensorCount = document.querySelectorAll('.metric-value')[2];
    if (sensorCount && !sensorCount.textContent.includes('°C')) {
        const currentCount = parseInt(sensorCount.textContent);
        const variation = Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        const newCount = Math.max(20, Math.min(28, currentCount + variation));
        sensorCount.textContent = newCount.toString();
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    @keyframes slideIn {
        from { 
            transform: translateX(100%); 
            opacity: 0; 
        }
        to { 
            transform: translateX(0); 
            opacity: 1; 
        }
    }
    
    .sector-notification .notification-content {
        color: var(--text);
    }
    
    .sector-notification .notification-content h4 {
        margin-bottom: 10px;
        color: var(--accent);
    }
    
    .sector-notification .notification-content button {
        margin-top: 15px;
        padding: 8px 16px;
        background: var(--accent);
        color: var(--bg);
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
    }
    
    .sector-notification .notification-content button:hover {
        background: #7c3aed;
    }
`;
document.head.appendChild(style);
