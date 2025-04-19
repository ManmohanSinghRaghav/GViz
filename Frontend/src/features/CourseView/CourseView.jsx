import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockCourses } from '../../Mock_data/courseMock';
import { FaArrowLeft, FaPlay, FaCheck } from 'react-icons/fa';

const CourseView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [activeModule, setActiveModule] = useState(null);

  useEffect(() => {
    const foundCourse = mockCourses.find(c => c.id === parseInt(id));
    setCourse(foundCourse);
    setActiveModule(foundCourse?.modules[0]);
  }, [id]);

  if (!course) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Overview */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-4">{course.title}</h1>
          <p className="text-gray-600 mb-6">{course.description}</p>
          
          <div className="space-y-4">
            {activeModule && (
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">{activeModule.title}</h3>
                <div className="space-y-2">
                  {activeModule.lessons.map(lesson => (
                    <button
                      key={lesson.id}
                      className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                    >
                      <div className="flex items-center">
                        {lesson.completed ? (
                          <FaCheck className="text-green-500 mr-2" />
                        ) : (
                          <FaPlay className="text-blue-500 mr-2" />
                        )}
                        <span>{lesson.title}</span>
                      </div>
                      <span className="text-gray-500 text-sm">{lesson.duration}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Course Progress */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Course Progress</h2>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Overall Progress</span>
              <span>{course.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 rounded-full h-2" 
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            {course.modules.map(module => (
              <button
                key={module.id}
                onClick={() => setActiveModule(module)}
                className={`w-full text-left p-3 rounded ${
                  activeModule?.id === module.id 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{module.title}</span>
                  {module.completed && <FaCheck className="text-green-500" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseView;
