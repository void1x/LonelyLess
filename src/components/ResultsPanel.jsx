import React from 'react';
import ScoreRing from './charts/ScoreRing';
import RadarChart from './charts/RadarChart';
import FactorGrid from './FactorGrid';
import SuggestionList from './SuggestionList';

export default function ResultsPanel({ result, inputs, suggestions, onSave, isSaved }) {
  if (!result) return null;

  return (
    <div className="fade-in space-y-8 bg-gray-50 mt-8 pt-4 border-t border-gray-200">
      
      {/* Headline result block */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
        {/* Top color indicator bar */}
        <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: result.color }}></div>
        
        <div className="flex flex-col sm:flex-row items-center gap-6 mt-2">
          <ScoreRing total={result.total} color={result.color} />
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-sm uppercase tracking-wider font-semibold text-gray-400 mb-1">Your Total Risk Level</h2>
            <div className="flex items-baseline justify-center sm:justify-start gap-3">
              <span className="text-3xl font-extrabold text-gray-900" style={{ color: result.color }}>
                {result.level}
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-2">
              Based on your inputs, your lifestyle presents a <span className="font-medium text-gray-700">{result.level.toLowerCase()}</span> risk to your overall wellbeing.
            </p>
          </div>
        </div>
      </div>

      {/* 2x2 Factor Breakdown */}
      <FactorGrid factors={result.factors} inputs={inputs} />

      {/* Radar Chart */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 relative h-[320px]">
        <RadarChart factors={result.factors} />
      </div>

      {/* Recommendations */}
      <SuggestionList suggestions={suggestions} />

      {/* Save Action */}
      <div className="pt-4 flex justify-end">
        <button 
          onClick={onSave}
          disabled={isSaved}
          className={`px-6 py-3 border font-medium rounded-xl shadow-sm transition-colors flex items-center gap-2 ${
            isSaved 
              ? 'bg-green-50 text-green-700 border-green-200 cursor-not-allowed'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {!isSaved && (
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
            </svg>
          )}
          {isSaved ? 'Saved ✓' : 'Save this check-in'}
        </button>
      </div>

    </div>
  );
}
