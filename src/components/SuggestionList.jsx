import React from 'react';

export default function SuggestionList({ suggestions }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-3 ml-1">Recommendations</h3>
      <div className="space-y-3">
        {suggestions.map((s, idx) => (
          <div key={idx} className="flex items-start gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
            <div className="text-2xl shrink-0 mt-0.5">{s.icon}</div>
            <div>
              <h4 className="font-bold text-gray-900 leading-tight mb-1">{s.action}</h4>
              <p className="text-sm text-gray-500 leading-snug">{s.reason}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
