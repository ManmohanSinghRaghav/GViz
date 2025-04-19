import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaCheck } from 'react-icons/fa';

const ProfileSection = () => {
  const navigate = useNavigate();
  const completionPercentage = 65; // Will be dynamic based on actual completion

  const sections = [
    { id: 'basic', name: 'Basic Info', completed: true },
    { id: 'education', name: 'Education', completed: false },
    { id: 'experience', name: 'Experience', completed: false },
    { id: 'skills', name: 'Skills', completed: true },
    { id: 'projects', name: 'Projects', completed: false },
    { id: 'social', name: 'Social Links', completed: false }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Profile Completion</h2>
          <p className="text-gray-600">Complete your profile to unlock all features</p>
        </div>
        <button
          onClick={() => navigate('/complete-profile')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Complete Profile
        </button>
      </div>

      <div className="flex items-center space-x-8 mb-8">
        {/* Circular Progress */}
        <div className="relative w-40 h-40">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="8"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="8"
              strokeDasharray={`${completionPercentage * 4.4} 440`}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="text-3xl font-bold text-gray-900">{completionPercentage}%</span>
              <span className="block text-sm text-gray-500">Complete</span>
            </div>
          </div>
        </div>

        {/* Sections Grid */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
          {sections.map(section => (
            <div 
              key={section.id}
              className={`p-4 rounded-lg border ${
                section.completed ? 'border-green-200 bg-green-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{section.name}</span>
                {section.completed ? (
                  <FaCheck className="text-green-500" />
                ) : (
                  <button
                    onClick={() => navigate(`/complete-profile/${section.id}`)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <FaEdit />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
