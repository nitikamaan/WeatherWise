let temperatureChart = null; // Store chart instance for updates

function formatTimeLabel(dateString, days) {
  const date = new Date(dateString);
  
  if (days <= 7) {
    // For 7 days or less, show day and date (Mon 12/23)
    return date.toLocaleDateString([], {weekday: 'short', month: '2-digit', day: '2-digit'});
  } else if (days <= 30) {
    // For 15-30 days, show date (12/23)
    return date.toLocaleDateString([], {month: '2-digit', day: '2-digit'});
  } else {
    // For 90 days, show month and day (12/23)
    return date.toLocaleDateString([], {month: '2-digit', day: '2-digit'});
  }
}

async function renderChart(dateRange = "option1") {
    const tempData = await fetchTemperatureData(dateRange);
    
    // Map dropdown values to number of days for label formatting
    const dayMapping = {
      "option1": 7,   // Last 7 days
      "option2": 15,  // Last 15 days
      "option3": 30,  // Last 30 days
      "option4": 90   // Last 90 days
    };
    
    const days = dayMapping[dateRange] || 7;
    const labels = tempData.map(item => formatTimeLabel(item.time, days));
    const values = tempData.map(item => item.value);
  
    const ctx = document.getElementById('temperatureChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (temperatureChart) {
      temperatureChart.destroy();
    }
    
    temperatureChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Temperature (°C)',
          data: values,
          borderColor: '#2563eb', // Dark blue accent
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#2563eb',
          pointBorderColor: '#2563eb',
          pointRadius: days > 30 ? 2 : 3, // Smaller points for longer periods
          pointHoverRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#e5e7eb' // Light text color
            }
          }
        },
        scales: {
          x: {
            title: { 
              display: true, 
              text: 'Date',
              color: '#e5e7eb'
            },
            ticks: {
              color: '#a1a6b3',
              maxTicksLimit: days > 30 ? 10 : 15 // Limit ticks for longer periods
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.06)'
            }
          },
          y: {
            title: { 
              display: true, 
              text: 'Temperature (°C)',
              color: '#e5e7eb'
            },
            ticks: {
              color: '#a1a6b3'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.06)'
            }
          }
        }
      }
    });
  }

// Function to handle dropdown change
function handleDateRangeChange() {
  const dropdown = document.getElementById('choices');
  const selectedValue = dropdown.value;
  
  if (selectedValue) {
    renderChart(selectedValue);
  }
}

// Wait for DOM to load before setting up chart and event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Initial chart render
  renderChart();
  
  // Add event listener to dropdown
  const dropdown = document.getElementById('choices');
  dropdown.addEventListener('change', handleDateRangeChange);
});