import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Profile = ({ isExpanded }) => {
  const { user } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);

  if (!user) return null;

  return (
    <>
      <div 
        className="p-4 cursor-pointer flex items-center relative" 
        onClick={() => setShowProfileModal(true)}
      >
        <img
          src={user.avatar}
          alt="Profile"
          className="h-8 w-8 rounded-full"
        />
        {isExpanded && (
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-300">{user.name}</p>
            <p className="text-xs text-gray-500">View Profile</p>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-auto my-4 relative">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900">Profile Details</h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex items-center mb-6">
              <img
                src={user.avatar}
                alt="Profile"
                className="h-20 w-20 rounded-full"
              />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-sm text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setShowProfileModal(false)}
                className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
