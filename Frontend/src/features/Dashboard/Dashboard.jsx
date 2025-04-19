import React from 'react';
import { FaChartLine, FaClock, FaBookmark, FaTrophy, FaCode, FaRocket } from 'react-icons/fa';

const Dashboard = () => {
  const stats = [
    { icon: <FaChartLine />, title: 'Progress', value: '68%', trend: '+12%' },
    { icon: <FaClock />, title: 'Learning Hours', value: '24h', trend: '+2h' },
    { icon: <FaBookmark />, title: 'Courses', value: '8', trend: '+1' },
    { icon: <FaTrophy />, title: 'Achievements', value: '12', trend: '+3' },
  ];

  const recentActivities = [
    { type: 'course', title: 'React Advanced Patterns', time: '2h ago', icon: <FaCode /> },
    { type: 'achievement', title: 'Frontend Master', time: '1d ago', icon: <FaTrophy /> },
    { type: 'milestone', title: 'Completed 5 Projects', time: '2d ago', icon: <FaRocket /> },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="glass-morphism rounded-xl p-6 bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-slate-900/95">
            <div className="flex justify-between items-start">
              <div className="text-violet-400 text-xl">{stat.icon}</div>
              <span className="text-emerald-400 text-sm">{stat.trend}</span>
            </div>
            <h3 className="text-white text-2xl font-bold mt-2">{stat.value}</h3>
            <p className="text-slate-400 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Learning Progress */}
        <div className="glass-morphism rounded-xl p-6 lg:col-span-2 bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-slate-900/95">
          <h2 className="text-xl font-bold text-white mb-4">Learning Progress</h2>
          <div className="space-y-4">
            {['HTML/CSS', 'JavaScript', 'React', 'Node.js'].map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">{skill}</span>
                  <span className="text-violet-400">
                    {[80, 65, 45, 30][index]}%
                  </span>
                </div>
                <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-600 to-purple-600 rounded-full"
                    style={{ width: `${[80, 65, 45, 30][index]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-morphism rounded-xl p-6 bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-slate-900/95">
          <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-800/50 border border-violet-500/20">
                <div className="text-violet-400">{activity.icon}</div>
                <div className="flex-1">
                  <h3 className="text-slate-200 font-medium">{activity.title}</h3>
                  <p className="text-slate-400 text-sm">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Course Progress */}
      <div className="glass-morphism rounded-xl p-6 bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-slate-900/95">
        <h2 className="text-xl font-bold text-white mb-4">Active Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {['React Mastery', 'Node.js Advanced', 'UI/UX Design'].map((course, index) => (
            <div key={index} className="p-4 rounded-lg bg-slate-800/50 border border-violet-500/20">
              <h3 className="text-slate-200 font-medium mb-2">{course}</h3>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Progress</span>
                <span className="text-violet-400">{[75, 45, 60][index]}%</span>
              </div>
              <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-violet-600 to-purple-600 rounded-full"
                  style={{ width: `${[75, 45, 60][index]}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
