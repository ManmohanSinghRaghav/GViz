import React, { useState, useMemo } from 'react';
import { FaStar, FaCode } from 'react-icons/fa';
import { mockTechStacks } from '../../Mock_data/techStackMock';

const TechStackEditor = () => {
  const [techStacks, setTechStacks] = useState(mockTechStacks);
  const [selectedCategory, setSelectedCategory] = useState('frontend');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLevelChange = (category, techId, level) => {
    setTechStacks(prev => ({
      ...prev,
      [category]: prev[category].map(tech => 
        tech.id === techId ? { ...tech, level } : tech
      )
    }));
  };

  const calculateCompletion = () => {
    const allTechs = Object.values(techStacks).flat();
    const completedTechs = allTechs.filter(tech => tech.level > 0);
    return (completedTechs.length / allTechs.length) * 100;
  };

  const filteredTechStacks = useMemo(() => {
    if (!searchQuery) return techStacks[selectedCategory];
    return techStacks[selectedCategory].filter(tech =>
      tech.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [techStacks, selectedCategory, searchQuery]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tech Stack</h2>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600">
            {Math.round(calculateCompletion())}%
          </div>
          <div className="text-sm text-gray-500">Stack Completed</div>
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        {Object.keys(techStacks).map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <input
          type="search"
          placeholder="Search technologies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTechStacks.map(tech => (
          <div key={tech.id} className="group relative p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <FaCode className="mr-2" />
                <span className="font-medium">{tech.name}</span>
              </div>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map(level => (
                  <button
                    key={level}
                    onClick={() => handleLevelChange(selectedCategory, tech.id, level)}
                    className={`p-1 ${
                      tech.level >= level ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    <FaStar />
                  </button>
                ))}
              </div>
            </div>
            <div className="hidden group-hover:block absolute -top-8 left-0 right-0 bg-gray-800 text-white p-2 rounded text-sm">
              {tech.level === 0 ? 'Not started' :
               tech.level === 1 ? 'Beginner' :
               tech.level === 2 ? 'Intermediate' :
               tech.level === 3 ? 'Advanced' :
               tech.level === 4 ? 'Expert' : 'Master'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStackEditor;
