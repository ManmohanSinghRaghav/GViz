import React from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const Home = () => {
  const profileData = [
    { name: 'Completed', value: 65 },
    { name: 'Remaining', value: 35 },
  ];

  const COLORS = ['#0088FE', '#ECECEC'];

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Profile Completion Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Profile Completion</h2>
            <div className="flex items-center justify-between">
              <div className="w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={profileData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={0}
                      dataKey="value"
                    >
                      {profileData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col space-y-4">
                <div>
                  <p className="text-4xl font-bold text-blue-600">65%</p>
                  <p className="text-gray-600">Profile Completed</p>
                </div>
                <Link
                  to="/profile"
                  className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                >
                  Complete Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Getting Started Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
            {/* Add your getting started content here */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
