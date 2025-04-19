import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCircle } from 'react-icons/fa';
import { mockNotifications } from '../../Mock_data/notificationsMock';

const NotificationsPage = () => {
  const navigate = useNavigate();

  // Mock notifications - replace with real data
  const notifications = mockNotifications;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full mr-4"
          aria-label="Go back"
        >
          <FaArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold">Notifications</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="p-4 border-b border-gray-100 hover:bg-gray-50"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {notification.unread && (
                  <FaCircle className="h-2 w-2 text-blue-500" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{notification.title}</p>
                <p className="text-gray-500 mt-1">{notification.message}</p>
                <p className="text-sm text-gray-400 mt-1">{notification.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
