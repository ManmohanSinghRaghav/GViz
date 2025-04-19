import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Profile = ({ isExpanded }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const completionPercentage = 65; // This should come from your user data

  return (
    <div 
      className="p-4 cursor-pointer" 
      onClick={() => navigate('/profile')}
    >
      <div className="flex items-center space-x-3">
        <img
          src={user.avatar}
          alt="Profile"
          className="h-8 w-8 rounded-full"
        />
        {isExpanded && (
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium text-gray-300">{user.name}</p>
              <span className="text-xs text-blue-400">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-1">
              <div
                className="bg-blue-400 rounded-full h-1"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
