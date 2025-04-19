import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';

const Breadcrumbs = () => {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(Boolean);

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
        </li>
        {paths.map((path, index) => (
          <li key={path} className="flex items-center">
            <FaChevronRight className="h-4 w-4 text-gray-400 mx-2" />
            <Link 
              to={`/${paths.slice(0, index + 1).join('/')}`}
              className={index === paths.length - 1 ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}
            >
              {path.charAt(0).toUpperCase() + path.slice(1)}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
