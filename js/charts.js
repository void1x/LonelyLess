/**
 * Custom Chart.js plugin to draw the score text inside the doughnut chart.
 */
const centerTextPlugin = {
  id: 'centerText',
  beforeDraw(chart) {
    if (chart.config.options.elements.center) {
      const ctx = chart.ctx;
      const centerConfig = chart.config.options.elements.center;
      
      const text = centerConfig.text;
      const color = centerConfig.color || '#000';
      
      ctx.save();
      ctx.font = 'bold 28px sans-serif';
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
      const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
      
      ctx.fillText(text, centerX, centerY);
      ctx.restore();
    }
  }
};

/**
 * Creates the main Score Ring (Doughnut Chart)
 */
function createScoreRing(canvasId, score, color) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;

  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Score', 'Remaining'],
      datasets: [{
        data: [score, 100 - score],
        backgroundColor: [color, '#E5E5E5'],
        borderWidth: 0,
        hoverOffset: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '78%',
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      },
      animation: {
        animateRotate: true,
        duration: 700,
        easing: 'easeOutQuart'
      },
      elements: {
        center: {
          text: score.toString(),
          color: color
        }
      }
    },
    plugins: [centerTextPlugin]
  });
}

/**
 * Creates the 4-factor Radar Chart
 */
function createRadarChart(canvasId, factors) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;

  // Find the dominant color (color of the factor with the highest score)
  let maxScore = -1;
  let dominantColor = '#1D9E75'; // default fallback
  
  const categories = ['online', 'social', 'sleep', 'activity'];
  
  // To find a sensible 'dominant color', we should map the highest risk logic
  // However, factors doesn't return color directly per-factor in the current scoring.js implementation.
  // The global level has a color, but each factor has {score, label, note, weight}.
  // We'll calculate a color based on the max score.
  
  categories.forEach(key => {
    if (factors[key] && factors[key].score > maxScore) {
      maxScore = factors[key].score;
    }
  });
  
  if (maxScore >= 70) {
    dominantColor = '#E24B4A'; // High
  } else if (maxScore >= 40) {
    dominantColor = '#EF9F27'; // Moderate
  }

  // Convert hex to rgb for rgba background
  let rgb = '29, 158, 117'; // default '#1D9E75'
  if (dominantColor === '#E24B4A') rgb = '226, 75, 74';
  if (dominantColor === '#EF9F27') rgb = '239, 159, 39';

  return new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Screen time', 'Social life', 'Sleep', 'Exercise'],
      datasets: [{
        data: [
          factors.online ? factors.online.score : 0,
          factors.social ? factors.social.score : 0,
          factors.sleep ? factors.sleep.score : 0,
          factors.activity ? factors.activity.score : 0
        ],
        backgroundColor: `rgba(${rgb}, 0.15)`,
        borderColor: dominantColor,
        pointBackgroundColor: dominantColor,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: dominantColor,
        borderWidth: 2,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        r: {
          min: 0,
          max: 100,
          beginAtZero: true,
          ticks: {
            display: false,
            stepSize: 25
          }
        }
      }
    }
  });
}

/**
 * Creates the History Line Chart
 */
function createHistoryChart(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;

  const chartData = window.HistoryEngine ? window.HistoryEngine.getHistoryChartData() : null;
  
  if (!chartData || !chartData.labels || chartData.labels.length === 0) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText("No history yet", canvas.width / 2, canvas.height / 2);
    return null;
  }

  const ctx = canvas.getContext('2d');

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.labels,
      datasets: [{
        data: chartData.scores,
        borderColor: '#378ADD',
        borderWidth: 2,
        pointBackgroundColor: chartData.colors,
        pointBorderColor: '#fff',
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: false,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

/**
 * Updates an existing Score Ring
 */
function updateScoreRing(chart, score, color) {
  if (!chart) return;
  
  chart.data.datasets[0].data = [score, 100 - score];
  chart.data.datasets[0].backgroundColor = [color, '#E5E5E5'];
  chart.config.options.elements.center.text = score.toString();
  chart.config.options.elements.center.color = color;
  
  chart.update();
}

/**
 * Updates an existing Radar Chart
 */
function updateRadarChart(chart, factors) {
  if (!chart) return;
  
  let maxScore = -1;
  let dominantColor = '#1D9E75'; 
  const categories = ['online', 'social', 'sleep', 'activity'];
  
  categories.forEach(key => {
    if (factors[key] && factors[key].score > maxScore) {
      maxScore = factors[key].score;
    }
  });
  
  if (maxScore >= 70) {
    dominantColor = '#E24B4A';
  } else if (maxScore >= 40) {
    dominantColor = '#EF9F27';
  }

  let rgb = '29, 158, 117';
  if (dominantColor === '#E24B4A') rgb = '226, 75, 74';
  if (dominantColor === '#EF9F27') rgb = '239, 159, 39';

  chart.data.datasets[0].data = [
    factors.online ? factors.online.score : 0,
    factors.social ? factors.social.score : 0,
    factors.sleep ? factors.sleep.score : 0,
    factors.activity ? factors.activity.score : 0
  ];
  
  chart.data.datasets[0].backgroundColor = `rgba(${rgb}, 0.15)`;
  chart.data.datasets[0].borderColor = dominantColor;
  chart.data.datasets[0].pointBackgroundColor = dominantColor;
  chart.data.datasets[0].pointHoverBorderColor = dominantColor;
  
  chart.update();
}

/**
 * Completely refreshes the history chart by destroying it and recreating it.
 */
function refreshHistoryChart(chart, canvasId) {
  if (chart) {
    chart.destroy();
  }
  return createHistoryChart(canvasId);
}

// Attach to window
window.ChartEngine = { 
  createScoreRing, 
  createRadarChart, 
  createHistoryChart,
  updateScoreRing,
  updateRadarChart,
  refreshHistoryChart
};
