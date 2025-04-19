import React from 'react';
import ProgressBar from '../ProgressBar/ProgressBar';
import DailyPlanner from '../DailyPlanner/DailyPlanner';
import ProjectCard from '../ProjectCard/ProjectCard';

const Dashboard = () => {
  const metrics = [
    { label: 'Skills Completed', value: '12/20' },
    { label: 'Projects Done', value: '4' },
    { label: 'Study Hours', value: '45h' },
    { label: 'Interview Score', value: '85%' }
  ];

  const upcomingInterviews = [
    { company: 'Tech Corp', date: '2024-03-15', type: 'Technical' },
    { company: 'Dev Inc', date: '2024-03-18', type: 'System Design' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600">{metric.label}</p>
            <p className="text-2xl font-bold">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Progress */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Learning Progress</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>Data Structures</span>
                <span>75%</span>
              </div>
              <ProgressBar progress={75} />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>System Design</span>
                <span>60%</span>
              </div>
              <ProgressBar progress={60} />
            </div>
          </div>
        </div>

        {/* Daily Tasks */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Today's Plan</h2>
          <DailyPlanner />
        </div>

        {/* Upcoming Interviews */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Upcoming Interviews</h2>
          <div className="space-y-3">
            {upcomingInterviews.map((interview, index) => (
              <div key={index} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{interview.company}</p>
                  <p className="text-sm text-gray-600">{interview.type}</p>
                </div>
                <p className="text-gray-600">{interview.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
          <div className="space-y-4">
            <ProjectCard 
              title="Portfolio Website"
              description="Personal portfolio built with React"
              progress={90}
            />
            <ProjectCard 
              title="E-commerce API"
              description="RESTful API with Node.js"
              progress={65}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
