import { useSettings } from '../../contexts/SettingsContext';

function Profile({ isExpanded }) {
  const { settings } = useSettings();
  const { profile } = settings;

  return (
    <div className="flex items-center p-4">
      <img
        src={profile.photoUrl}
        alt="Profile"
        className="w-10 h-10 rounded-full"
      />
      {isExpanded && (
        <div className="ml-3 transition-all duration-300">
          <p className="text-sm font-medium text-gray-700">{profile.name}</p>
          <p className="text-xs text-gray-500">{profile.email}</p>
        </div>
      )}
    </div>
  );
}

export default Profile;
