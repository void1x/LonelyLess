import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

export default function HistoryChart({ chartData }) {
  if (!chartData || !chartData.labels || chartData.labels.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        Not enough data for chart
      </div>
    );
  }

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Total Risk',
        data: chartData.scores,
        fill: true,
        backgroundColor: 'rgba(243, 244, 246, 0.5)', 
        borderColor: '#111827', // gray-900
        pointBackgroundColor: chartData.colors,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        tension: 0.3,
        borderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { min: 0, max: 100, ticks: { stepSize: 20 } },
      x: { grid: { display: false } }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `Score: ${ctx.raw}`
        }
      }
    }
  };

  return <Line data={data} options={options} />;
}
