import React from 'react';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip } from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

export default function RadarChart({ factors }) {
  if (!factors) return null;

  const data = {
    labels: ['Online', 'Social', 'Sleep', 'Activity'],
    datasets: [
      {
        label: 'Risk Score (0-100)',
        data: [
          factors.online.score,
          factors.social.score,
          factors.sleep.score,
          factors.activity.score
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.2)', // blue-500 20%
        borderColor: 'rgba(59, 130, 246, 1)',
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: { display: false, stepSize: 25 },
        pointLabels: {
          font: { size: 12, weight: 'bold' }
        }
      }
    },
    plugins: {
      legend: { display: false },
    }
  };

  return (
    <div className="h-full w-full">
      <Radar data={data} options={options} />
    </div>
  );
}
