import React from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaChartBar, FaLightbulb, FaCode } from 'react-icons/fa';

const Home = () => {
  const features = [
    {
      icon: <FaRocket />,
      title: 'Learning Paths',
      description: 'Structured learning paths for different skill levels'
    },
    {
      icon: <FaChartBar />,
      title: 'Progress Tracking',
      description: 'Track your learning progress in real-time'
    },
    {
      icon: <FaLightbulb />,
      title: 'Interactive Learning',
      description: 'Hands-on coding exercises and projects'
    },
    {
      icon: <FaCode />,
      title: 'Skill Development',
      description: 'Build practical skills with real-world projects'
    }
  ];

  return (
    <div className="min-h-screen p-6 space-y-12">
      {/* Hero Section */}
      <div className="glass-morphism rounded-2xl p-8 md:p-12 bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-slate-900/95">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            Welcome to SynqTech Learning
          </h1>
          <p className="text-lg text-slate-300">
            Your journey to mastering modern web development starts here
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/journey"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 
                text-white font-medium hover:shadow-lg hover:shadow-violet-500/25 
                transition-all duration-300"
            >
              Start Learning
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="glass-morphism rounded-xl p-6 bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-slate-900/95
              hover:translate-y-[-4px] transition-all duration-300"
          >
            <div className="text-violet-400 text-2xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
            <p className="text-slate-400">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Statistics Section */}
      <div className="glass-morphism rounded-2xl p-8 bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-slate-900/95">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">1000+</div>
            <div className="text-slate-400">Active Learners</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">50+</div>
            <div className="text-slate-400">Courses</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">95%</div>
            <div className="text-slate-400">Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
