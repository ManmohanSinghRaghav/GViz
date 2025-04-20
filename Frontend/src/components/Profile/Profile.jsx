import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaUserCircle, FaChevronRight } from 'react-icons/fa';

const Profile = ({ isExpanded }) => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Link to="/settings" className="block p-4 hover:bg-violet-600/10 transition-colors duration-200">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {user.photoURL ? (
            <img
              className="h-10 w-10 rounded-full ring-2 ring-violet-500/30"
              src={user.photoURL}
              alt={user.displayName || "User profile"}
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white">
              <FaUserCircle size={24} />
            </div>
          )}
        </div>
        {isExpanded && (
          <div className="ml-3 flex-1 overflow-hidden">
            <div className="text-sm font-medium text-slate-200 truncate">
              {user.displayName || user.email}
            </div>
            <div className="text-xs text-slate-400 truncate">View profile</div>
          </div>
        )}
        {isExpanded && <FaChevronRight className="text-slate-400 text-xs" />}
      </div>
    </Link>
  );
};

export default Profile;
