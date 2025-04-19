import React, { useState } from 'react';
import './MyJourney.css';

const MyJourney = () => {
  const [journeyPoints, setJourneyPoints] = useState([
    { id: 1, title: 'Point 1', description: 'Description for point 1' },
    { id: 2, title: 'Point 2', description: 'Description for point 2' },
    { id: 3, title: 'Point 3', description: 'Description for point 3' },
  ]);

  const handlePointClick = (id) => {
    console.log(`Point ${id} clicked`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Journey</h1>
      </header>
      
      <div className="timeline-container space-y-6">
        {journeyPoints.map((point) => (
          <div
            key={point.id}
            className="journey-point-container bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
            onClick={() => handlePointClick(point.id)}
          >
            <h2 className="text-xl font-semibold mb-2">{point.title}</h2>
            <p className="text-gray-600">{point.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyJourney;