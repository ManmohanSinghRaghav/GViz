import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';

function Settings() {
  const { settings, updateSettings } = useSettings();

  const handleChange = (setting, value) => {
    updateSettings({ [setting]: value });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="space-y-4">
        <div>
          <label className="flex items-center">
            <span className="mr-2">Theme:</span>
            <select
              value={settings.theme}
              onChange={(e) => handleChange('theme', e.target.value)}
              className="border rounded p-1"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
        </div>
        <div>
          <label className="flex items-center">
            <span className="mr-2">Language:</span>
            <select
              value={settings.language}
              onChange={(e) => handleChange('language', e.target.value)}
              className="border rounded p-1"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
            </select>
          </label>
        </div>
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => handleChange('notifications', e.target.checked)}
              className="mr-2"
            />
            Enable Notifications
          </label>
        </div>
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.autoSave}
              onChange={(e) => handleChange('autoSave', e.target.checked)}
              className="mr-2"
            />
            Auto Save
          </label>
        </div>
      </div>
    </div>
  );
}

export default Settings;
