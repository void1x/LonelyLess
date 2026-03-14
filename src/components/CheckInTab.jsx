import React from 'react';
import Slider from './Slider';
import ResultsPanel from './ResultsPanel';

export default function CheckInTab({ 
  inputs, 
  setInputs, 
  onCalculate, 
  isLoading, 
  result, 
  suggestions, 
  onSave, 
  isSaved 
}) {
  const handleChange = (key, value) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  return (
    <section className="block space-y-8">
      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Slider 
          id="r-online" label="Hours online / day" 
          min={0} max={16} unit="hrs" note="WHO caution: >6 hrs/day"
          value={inputs.online} onChange={(v) => handleChange('online', v)}
        />
        <Slider 
          id="r-social" label="Social interactions / week" 
          min={0} max={21} unit="times" note="Optimal: 7–14 per week"
          value={inputs.social} onChange={(v) => handleChange('social', v)}
        />
        <Slider 
          id="r-sleep" label="Sleep hours / night" 
          min={2} max={12} unit="hrs" note="NIH optimal: 7–9 hrs"
          value={inputs.sleep} onChange={(v) => handleChange('sleep', v)}
        />
        <Slider 
          id="r-activity" label="Physical activity / week" 
          min={0} max={14} unit="sessions" note="WHO target: ≥3 sessions"
          value={inputs.activity} onChange={(v) => handleChange('activity', v)}
        />
      </div>

      {/* Analyze button */}
      <button 
        onClick={onCalculate}
        disabled={isLoading}
        className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl shadow-md transition-colors text-lg flex justify-center items-center gap-2 disabled:bg-gray-700"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </>
        ) : (
          'Calculate my risk →'
        )}
      </button>

      {/* Results */}
      {result && (
        <ResultsPanel 
          result={result} 
          inputs={inputs} 
          suggestions={suggestions} 
          onSave={onSave} 
          isSaved={isSaved} 
        />
      )}
    </section>
  );
}
