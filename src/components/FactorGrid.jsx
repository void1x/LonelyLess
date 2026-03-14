import React from 'react';

const factorMeta = {
  online: { title: "Hours online" },
  social: { title: "Social events" },
  sleep: { title: "Sleep duration" },
  activity: { title: "Physical activity" }
};

export default function FactorGrid({ factors, inputs }) {
  if (!factors || !inputs) return null;

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-3 ml-1">Factor Breakdown</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(factors).map(([key, details]) => {
          const meta = factorMeta[key];
          const val = inputs[key];
          
          let badgeColor = 'bg-green-100 text-green-700'; // Default healthy
          if (details.label === 'Moderate') badgeColor = 'bg-amber-100 text-amber-700';
          if (details.label === 'Elevated' || details.label === 'High risk') badgeColor = 'bg-red-100 text-red-700';

          return (
            <div key={key} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col justify-between h-full">
              <div className="flex justify-between items-start mb-2">
                <span className="uppercase tracking-wider text-[10px] font-bold text-gray-400">
                  {meta.title} (<span className="text-gray-900">{val}</span>)
                </span>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${badgeColor}`}>
                  {details.label}
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-snug font-medium">{details.note}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
