import React from 'react';

export default function HistoryItem({ entry, index }) {
  const bgStr = index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50';
  const timeStr = new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

  return (
    <div className={`p-4 flex items-center justify-between ${bgStr}`}>
      <div>
        <div className="font-medium text-gray-900">{entry.date}</div>
        <div className="text-xs text-gray-500 mt-1">{timeStr}</div>
      </div>
      <div className="flex items-center gap-3">
        <div 
          className="px-3 py-1 text-xs font-bold uppercase rounded-full" 
          style={{ backgroundColor: `${entry.color}15`, color: entry.color }}
        >
          {entry.level}
        </div>
        <div className="w-10 text-right font-bold text-gray-900">{entry.total}</div>
      </div>
    </div>
  );
}
