import React, { useState } from 'react';
import { FaRocket, FaStar, FaTrophy, FaChartLine, FaBookmark } from 'react-icons/fa';

const MyJourney = () => {
  const [selectedPath, setSelectedPath] = useState('frontend');

  const learningPaths = {
    frontend: {
      title: 'Frontend Development',
      progress: 65,
      modules: [
        { id: 1, name: 'HTML & CSS Fundamentals', completed: true },
        { id: 2, name: 'JavaScript Basics', completed: true },
        { id: 3, name: 'React Fundamentals', completed: true },
        { id: 4, name: 'Advanced React Patterns', inProgress: true },
        { id: 5, name: 'State Management', locked: true },
      ]
    },
    backend: {
      title: 'Backend Development',
      progress: 30,
      modules: [
        { id: 1, name: 'Node.js Basics', completed: true },
        { id: 2, name: 'Express.js', inProgress: true },
        { id: 3, name: 'Database Design', locked: true },
        { id: 4, name: 'API Development', locked: true },
        { id: 5, name: 'Authentication', locked: true },
      ]
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            My Learning Journey
          </h1>
          <p className="text-slate-400">Track your progress and achieve your goals</p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-morphism rounded-xl p-6 bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-slate-900/95">
            <div className="flex items-center justify-between mb-4">
              <FaChartLine className="text-violet-400 text-2xl" />
              <span className="text-2xl font-bold text-white">65%</span>
            </div>
            <h3 className="text-white font-medium">Overall Progress</h3>
          </div>
          
          <div className="glass-morphism rounded-xl p-6 bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-slate-900/95">
            <div className="flex items-center justify-between mb-4">
              <FaStar className="text-violet-400 text-2xl" />
              <span className="text-2xl font-bold text-white">250</span>
            </div>
            <h3 className="text-white font-medium">Points Earned</h3>
          </div>
          
          <div className="glass-morphism rounded-xl p-6 bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-slate-900/95">
            <div className="flex items-center justify-between mb-4">
              <FaTrophy className="text-violet-400 text-2xl" />
              <span className="text-2xl font-bold text-white">5</span>
            </div>
            <h3 className="text-white font-medium">Achievements</h3>
          </div>
        </div>

        {/* Learning Paths */}
        <div className="glass-morphism rounded-xl p-6 bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-slate-900/95">
          <div className="flex gap-4 mb-6">
            {Object.keys(learningPaths).map((path) => (
              <button
                key={path}
                onClick={() => setSelectedPath(path)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  selectedPath === path
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-violet-600/20'
                }`}
              >
                {learningPaths[path].title}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {learningPaths[selectedPath].modules.map((module) => (
              <div
                key={module.id}
                className={`p-4 rounded-lg transition-all duration-300 ${
                  module.completed
                    ? 'bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/20'
                    : module.inProgress
                    ? 'bg-gradient-to-r from-slate-800/50 to-purple-900/20 border border-violet-500/10'
                    : 'bg-slate-800/30 border border-slate-700/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {module.completed ? (
                      <FaRocket className="text-violet-400" />
                    ) : module.inProgress ? (
                      <FaBookmark className="text-violet-400" />
                    ) : (
                      <FaBookmark className="text-slate-500" />
                    )}
                    <span className={module.locked ? 'text-slate-500' : 'text-white'}>
                      {module.name}
                    </span>
                  </div>
                  {module.completed && (
                    <span className="text-violet-400 text-sm">Completed</span>
                  )}
                  {module.inProgress && (
                    <span className="text-purple-400 text-sm">In Progress</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyJourney;