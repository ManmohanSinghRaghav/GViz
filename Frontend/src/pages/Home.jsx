import React from 'react';
import TechStackEditor from '../components/TechStack/TechStackEditor';
import ProfileSection from '../components/Profile/ProfileSection';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to GViz
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your personalized AI-powered data visualization companion
          </p>
        </div>

        <div className="mt-12 space-y-8">
          {/* Getting Started Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Getting Started</h2>
            <TechStackEditor />
          </div>

          {/* Profile Section */}
          <div>
            <ProfileSection />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
