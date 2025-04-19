import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockTutorials } from '../../Mock_data/tutorialMock';
import { FaArrowLeft, FaPlay, FaClock, FaUser, FaSignal } from 'react-icons/fa';

const TutorialView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tutorial, setTutorial] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const foundTutorial = mockTutorials.find(t => t.id === parseInt(id));
    setTutorial(foundTutorial);
  }, [id]);

  if (!tutorial) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-black aspect-video rounded-lg relative">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="bg-white/20 rounded-full p-4">
                <FaPlay className="h-8 w-8 text-white" />
              </div>
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold mb-4">{tutorial.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
              <span className="flex items-center">
                <FaClock className="mr-1" /> {tutorial.duration}
              </span>
              <span className="flex items-center">
                <FaUser className="mr-1" /> {tutorial.instructor}
              </span>
              <span className="flex items-center">
                <FaSignal className="mr-1" /> {tutorial.level}
              </span>
            </div>
            <p className="text-gray-600">{tutorial.description}</p>
          </div>
        </div>

        {/* Chapters Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Chapters</h2>
          <div className="space-y-2">
            {tutorial.chapters.map((chapter, index) => (
              <button
                key={index}
                onClick={() => console.log(`Seeking to ${chapter.time}`)}
                className="w-full flex items-center justify-between p-3 rounded hover:bg-gray-50 text-left"
              >
                <span className="font-medium">{chapter.title}</span>
                <span className="text-gray-500 text-sm">{chapter.time}</span>
              </button>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold mb-2">Topics</h3>
            <div className="flex flex-wrap gap-2">
              {tutorial.topics.map(topic => (
                <span
                  key={topic}
                  className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialView;
