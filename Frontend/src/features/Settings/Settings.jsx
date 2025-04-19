import React, { useState } from 'react';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      desktop: false,
      updates: true
    },
    theme: 'light',
    language: 'en',
  });

  const handleChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: typeof field === 'string' 
        ? value 
        : { ...prev[section], [field]: value }
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>
      
      {/* Profile Settings */}
      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <button className="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
              Change Avatar
            </button>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <h2 className="text-xl font-semibold mb-4">Preferences</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <select
              value={settings.theme}
              onChange={(e) => handleChange('theme', null, e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={settings.language}
              onChange={(e) => handleChange('language', null, e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        <div className="space-y-4">
          {Object.entries(settings.notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 capitalize">
                {key} Notifications
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handleChange('notifications', key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;
