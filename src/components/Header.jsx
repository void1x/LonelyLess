import React from 'react';

export default function Header({ activeTab, setActiveTab }) {
  return (
    <header className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-end sm:justify-between border-b border-gray-200 pb-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">LonelyLess</h1>
        <p className="text-gray-500 mt-1 text-sm">Quantify your digital, social, and physical lifestyle hooks.</p>
      </div>
      
      {/* Tabs */}
      <nav className="flex mt-6 sm:mt-0 gap-6 justify-center sm:justify-end text-sm">
        <button 
          onClick={() => setActiveTab('checkin')}
          className={`pb-2 border-b-2 font-medium transition-colors cursor-pointer block ${
            activeTab === 'checkin'
              ? 'border-gray-900 text-gray-900 hover:text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Check in
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`pb-2 border-b-2 font-medium transition-colors cursor-pointer block ${
            activeTab === 'history'
              ? 'border-gray-900 text-gray-900 hover:text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          My history
        </button>
      </nav>
    </header>
  );
}
