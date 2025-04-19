import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-12 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to AI Job Mentor
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your personalized AI-powered career development companion
          </p>
          <Link
            to="/login"
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            Get Started
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
