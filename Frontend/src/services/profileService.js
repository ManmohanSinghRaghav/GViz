import storage from '../utils/storage';

const profileService = {
  saveProfile: async (profileData) => {
    try {
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      storage.set('profileData', profileData);
      return true;
    } catch (error) {
      throw new Error('Failed to save profile');
    }
  },

  getProfile: () => {
    return storage.get('profileData') || null;
  }
};

export default profileService;
