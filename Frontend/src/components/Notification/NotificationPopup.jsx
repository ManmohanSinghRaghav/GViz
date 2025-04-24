import React from 'react';
import { FaTimes, FaInfo, FaCheck, FaExclamation } from 'react-icons/fa';
import { useNotification } from '../../contexts/NotificationContext';

const NotificationPopup = () => {
  const { notifications, removeNotification } = useNotification();

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <FaCheck className="text-green-400" />;
      case 'error': return <FaExclamation className="text-red-400" />;
      case 'warning': return <FaExclamation className="text-yellow-400" />;
      default: return <FaInfo className="text-blue-400" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(({ id, message, type }) => (
        <div
          key={id}
          className={`
            flex items-center justify-between gap-2 p-4 rounded-lg shadow-lg
            animate-slideInUp backdrop-blur-sm
            ${type === 'error' ? 'bg-red-900/80 border-red-500' :
              type === 'success' ? 'bg-green-900/80 border-green-500' :
              type === 'warning' ? 'bg-yellow-900/80 border-yellow-500' :
              'bg-blue-900/80 border-blue-500'
            } border
          `}
        >
          <div className="flex items-center gap-2">
            {getIcon(type)}
            <p className="text-white">{message}</p>
          </div>
          <button
            onClick={() => removeNotification(id)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationPopup;
