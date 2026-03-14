import React from 'react';
import HistoryChart from './charts/HistoryChart';
import HistoryItem from './HistoryItem';

export default function HistoryTab({ history, chartData, onClear }) {
  return (
    <section className="space-y-6 fade-in">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4 px-2 tracking-tight">Your last 10 check-ins</h3>
        <div className="h-[240px] relative w-full px-2 pb-2">
          <HistoryChart chartData={chartData} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto no-scrollbar">
          {history.length > 0 ? (
            history.map((entry, idx) => (
              <HistoryItem key={entry.id} entry={entry} index={idx} />
            ))
          ) : (
            <div className="p-8 text-center text-sm text-gray-500">
              No history entries found. Run a check-in to save your first result!
            </div>
          )}
        </div>
      </div>

      {history.length > 0 && (
        <div className="text-center pt-4">
          <button 
            onClick={() => {
              if (window.confirm("Are you sure you want to delete all saved check-ins?")) {
                onClear();
              }
            }}
            className="text-sm text-gray-400 hover:text-red-500 transition-colors underline decoration-dotted underline-offset-4"
          >
            Clear history
          </button>
        </div>
      )}
    </section>
  );
}
