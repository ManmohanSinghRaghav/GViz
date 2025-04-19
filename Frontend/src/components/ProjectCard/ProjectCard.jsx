import React from 'react';
import ProgressBar from '../ProgressBar/ProgressBar';

const ProjectCard = ({ title, description, progress }) => {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-3">{description}</p>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <ProgressBar progress={progress} />
      </div>
    </div>
  );
};

export default ProjectCard;
