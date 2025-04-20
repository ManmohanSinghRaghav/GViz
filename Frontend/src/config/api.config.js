export const GEMINI_API_KEY = 'AIzaSyCpC7-m5Cz1gvgn-qM2bXqIuWfe_F5eiFk'; // Your Gemini API key
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
export const GEMINI_API_HEADERS = {
  'Content-Type': 'application/json',
};
// AIzaSyCVPPRqUDs2ZVxU5zUmZFahvVCq78SnUa4

// Application theme configuration
export const THEME = {
  colors: {
    primary: {
      light: '#a5b4fc', // indigo-300
      main: '#6366f1',  // indigo-500
      dark: '#4338ca',  // indigo-700
    },
    secondary: {
      light: '#c7d2fe', // indigo-200
      main: '#818cf8',  // indigo-400
      dark: '#4f46e5',  // indigo-600
    },
    background: {
      light: '#f9fafb', // gray-50
      main: '#f3f4f6',  // gray-100
      dark: '#e5e7eb',  // gray-200
    },
    text: {
      primary: '#1f2937', // gray-800
      secondary: '#4b5563', // gray-600
      light: '#9ca3af',    // gray-400
    },
    error: '#ef4444',    // red-500
    success: '#10b981',  // emerald-500
    warning: '#f59e0b',  // amber-500
    info: '#3b82f6',     // blue-500
  },
  
  // Common button styles
  buttons: {
    primary: 'bg-indigo-500 hover:bg-indigo-600 text-white',
    secondary: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700',
    outline: 'border border-indigo-500 text-indigo-500 hover:bg-indigo-50',
  },
  
  // Common component styles
  components: {
    card: 'bg-white border border-gray-200 rounded-lg shadow-sm',
    input: 'border border-gray-300 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 rounded-md',
    header: 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white',
  }
};