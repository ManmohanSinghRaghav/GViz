import React, { useState } from 'react';

const SkillInput = ({ onSkillAdd }) => {
  const [skill, setSkill] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (skill.trim()) {
      onSkillAdd(skill.trim());
      setSkill('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={skill}
        onChange={(e) => setSkill(e.target.value)}
        className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2"
        placeholder="Add a skill..."
      />
      <button 
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add
      </button>
    </form>
  );
};

export default SkillInput;
