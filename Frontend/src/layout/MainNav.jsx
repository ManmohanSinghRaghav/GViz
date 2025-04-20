import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaSearch, FaBell, FaUserCircle, FaCircle } from 'react-icons/fa';
import { searchContent } from '../services/searchService';

const MainNav = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  // Mock notifications - replace with real data
  const notifications = [
    {
      id: 1,
      title: 'New Feature Available',
      message: 'Check out our new visualization tools',
      time: '5m ago',
      unread: true
    },
    {
      id: 2,
      title: 'Data Updated',
      message: 'Your dashboard data has been updated',
      time: '1h ago',
      unread: true
    },
    {
      id: 3,
      title: 'Welcome to SynqTech',
      message: 'Thanks for joining our platform',
      time: '2h ago',
      unread: false
    }
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchContent(searchQuery);
      setSearchResults(results);
      if (Object.keys(results).length === 0) {
        // No results found
        setSearchResults({ noResults: true });
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchItemClick = (item) => {
    setSearchResults(null);
    setSearchQuery('');
    navigate(`/${item.type}s/${item.id}`);
  };

  const handleNotificationClick = (notificationId) => {
    console.log('Clicked notification:', notificationId);
    // Add your notification click handling logic here
  };

  const handleViewAllNotifications = () => {
    setShowNotifications(false);
    navigate('/notifications');
  };

  return (
    <nav className="fixed top-0 right-0 left-0 
      bg-gradient-to-r from-slate-900/95 via-purple-900/95 to-slate-900/95 
      backdrop-filter backdrop-blur-md 
      border-b border-violet-500/20 
      z-[1001] 
      ml-16 
      h-16
      transition-all duration-300 
      shadow-lg shadow-violet-500/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left section - Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="/logo.png"
                alt="GViz Logo"
              />
              <span className="tech-text ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-purple-600">
                GViz
              </span>
            </div>
          </div>

          {/* Center section - Search Bar */}
          <div className="flex-1 flex items-center justify-center px-2 lg:px-6 relative">
            <form onSubmit={handleSearch} className="w-full max-w-lg">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-100 rounded-lg pl-10 pr-4 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search courses, materials..."
                  aria-label="Search"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  {isSearching ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />
                  ) : (
                    <FaSearch className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>

              {searchResults && (
                <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  {searchResults.noResults ? (
                    <div className="p-4 text-center text-gray-500">
                      No results found for "{searchQuery}"
                    </div>
                  ) : (
                    Object.entries(searchResults).map(([category, items]) => (
                      <div key={category} className="border-b last:border-b-0">
                        <div className="px-4 py-2 bg-gray-50 text-sm font-semibold text-gray-700 capitalize">
                          {category}
                        </div>
                        {items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleSearchItemClick(item)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center"
                          >
                            <span className="flex-1">{item.title}</span>
                          </button>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Right section - User Profile */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="cyber-button p-2 rounded-lg"
                aria-label="Notifications"
              >
                <FaBell className="h-5 w-5" />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="p-4 border-b">
                    <h3 className="text-lg font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <button
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification.id)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-start space-x-3 border-b border-gray-100"
                      >
                        <div className="flex-shrink-0 mt-1">
                          {notification.unread && (
                            <FaCircle className="h-2 w-2 text-blue-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="p-4 border-t">
                    <button
                      onClick={handleViewAllNotifications}
                      className="text-sm text-blue-500 hover:text-blue-600 font-medium"
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-expanded={showProfileMenu}
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <FaUserCircle className="h-8 w-8 text-gray-400" />
                )}
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {user?.name || 'Guest'}
                </span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {/* implement logout */}}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainNav;
