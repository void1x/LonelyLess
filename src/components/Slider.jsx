import React from 'react';

export default function Slider({ id, label, value, min, max, unit, note, onChange }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-2">
        <label htmlFor={id} className="uppercase text-xs font-semibold tracking-wider text-gray-400">
          {label}
        </label>
        <div className="text-2xl font-bold text-gray-900">
          <span>{value}</span>
          <span className="text-sm font-medium text-gray-500 ml-1">{unit}</span>
        </div>
      </div>
      <input 
        type="range" 
        id={id} 
        min={min} 
        max={max} 
        step="1" 
        value={value} 
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mb-2"
      />
      <p className="text-xs text-gray-400">{note}</p>
    </div>
  );
}
