import { createContext, useState, useContext } from 'react';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'en',
    notifications: true,
    autoSave: true,
    profile: {
      name: 'John Doe',
      photoUrl: '/assets/profile-photo.jpg',
      email: 'john.doe@example.com'
    }
  });

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
