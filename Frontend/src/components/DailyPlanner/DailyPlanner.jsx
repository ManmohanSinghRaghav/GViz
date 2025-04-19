import React from 'react';

const DailyPlanner = () => {
  const tasks = [
    { task: 'Study Arrays & Strings', time: '09:00 AM', completed: true },
    { task: 'System Design Practice', time: '11:00 AM', completed: false },
    { task: 'Coding Challenge', time: '02:00 PM', completed: false },
  ];

  return (
    <div className="space-y-3">
      {tasks.map((item, index) => (
        <div key={index} className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={item.completed}
            className="w-4 h-4"
            readOnly
          />
          <div className="flex-1">
            <p className={item.completed ? 'line-through text-gray-500' : ''}>
              {item.task}
            </p>
            <p className="text-sm text-gray-500">{item.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DailyPlanner;
