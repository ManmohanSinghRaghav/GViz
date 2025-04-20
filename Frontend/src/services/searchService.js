import api from './api';

export const searchContent = async (query) => {
  try {
    const response = await api.get('/search', {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    console.error('Search service error:', error);
    throw error;
  }
};

export default {
  searchContent
};
