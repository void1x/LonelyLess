import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip);

export default function ScoreRing({ total, color }) {
  const data = {
    labels: ['Risk', 'Remaining'],
    datasets: [
      {
        data: [total, Math.max(0, 100 - total)],
        backgroundColor: [color, '#f3f4f6'],
        borderWidth: 0,
        cutout: '75%',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: { enabled: false },
    },
  };

  return (
    <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-2xl font-bold text-gray-900">{total}</span>
      </div>
    </div>
  );
}
