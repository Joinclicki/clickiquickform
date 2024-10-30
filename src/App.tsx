import React from 'react';
import ReferralWidget from './components/ReferralWidget';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Your Website Content</h1>
        <p className="text-gray-600">Your main website content goes here...</p>
      </div>
      <ReferralWidget />
    </div>
  );
}

export default App;