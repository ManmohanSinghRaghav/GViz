import React from 'react';
import { FaUser, FaBell, FaShieldAlt, FaPalette, FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';

const Settings = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold dark:text-white text-gray-800 mb-8">Settings</h1>

      {/* Profile Settings */}
      <div className="glass-morphism rounded-xl p-6 bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-slate-900/95">
        <div className="flex items-center gap-3 mb-6">
          <FaUser className="text-violet-400 text-xl" />
          <h2 className="text-xl font-semibold text-white">Profile Settings</h2>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Display Name"
              className="bg-slate-800/50 text-slate-200 rounded-lg px-4 py-2 
                border border-violet-500/20 focus:outline-none focus:ring-2 
                focus:ring-violet-500/40"
            />
            <input
              type="email"
              placeholder="Email"
              className="bg-slate-800/50 text-slate-200 rounded-lg px-4 py-2 
                border border-violet-500/20 focus:outline-none focus:ring-2 
                focus:ring-violet-500/40"
            />
          </div>
          <textarea
            placeholder="Bio"
            className="w-full bg-slate-800/50 text-slate-200 rounded-lg px-4 py-2 
              border border-violet-500/20 focus:outline-none focus:ring-2 
              focus:ring-violet-500/40"
            rows="3"
          />
        </div>
      </div>

      {/* Notification Settings */}
      <div className="glass-morphism rounded-xl p-6 bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-slate-900/95">
        <div className="flex items-center gap-3 mb-6">
          <FaBell className="text-violet-400 text-xl" />
          <h2 className="text-xl font-semibold text-white">Notifications</h2>
        </div>
        <div className="space-y-4">
          {['Email Notifications', 'Push Notifications', 'Course Updates'].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-slate-200">{item}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer 
                  peer-checked:after:translate-x-full peer-checked:after:border-white 
                  after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                  after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all 
                  peer-checked:bg-violet-600" />
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Theme Settings */}
      <div className="glass-morphism-light dark:glass-morphism rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <FaPalette className="text-violet-600 dark:text-violet-400 text-xl" />
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Appearance</h2>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-700 dark:text-slate-200">Dark Mode</span>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 
              border border-violet-200 dark:border-violet-500/20
              hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors"
          >
            {darkMode ? 
              <FaSun className="text-violet-600 dark:text-violet-400" /> : 
              <FaMoon className="text-violet-600 dark:text-violet-400" />
            }
          </button>
        </div>
      </div>

      {/* Security Settings */}
      <div className="glass-morphism-light rounded-xl p-6 bg-white shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <FaShieldAlt className="text-violet-600 text-xl" />
          <h2 className="text-xl font-semibold text-slate-800">Security</h2>
        </div>
        <button
          className="w-full px-4 py-2 rounded-lg bg-violet-100 text-slate-800
            border border-violet-200 hover:bg-violet-200 transition-colors"
        >
          Change Password
        </button>
      </div>

      {/* Save Button */}
      <button
        className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 
          text-white font-medium hover:shadow-lg hover:shadow-violet-500/25 
          transition-all duration-300"
      >
        Save Changes
      </button>
    </div>
  );
};

export default Settings;
