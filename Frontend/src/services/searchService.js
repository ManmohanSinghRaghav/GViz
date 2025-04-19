import { mockSearchResults } from '../Mock_data/searchMock';

export const searchContent = async (query) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = Object.entries(mockSearchResults).reduce((acc, [key, items]) => {
        const filtered = items.filter(item => 
          item.title.toLowerCase().includes(query.toLowerCase())
        );
        if (filtered.length > 0) {
          acc[key] = filtered;
        }
        return acc;
      }, {});
      
      resolve(results);
    }, 500);
  });
};
