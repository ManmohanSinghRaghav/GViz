import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa';
import profileService from '../../services/profileService';

const CompleteProfile = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '',
      dateOfBirth: '',
      phoneNumber: '',
      location: '',
      bio: ''
    },
    education: [],
    experience: [],
    skills: [],
    socialLinks: {
      linkedin: '',
      github: '',
      portfolio: ''
    }
  });

  const steps = [
    { id: 'personal', title: 'Personal Information', isComplete: false },
    { id: 'education', title: 'Education', isComplete: false },
    { id: 'experience', title: 'Experience', isComplete: false },
    { id: 'skills', title: 'Skills & Expertise', isComplete: false }
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await profileService.saveProfile(formData);
      navigate('/profile');
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {
        institution: '',
        degree: '',
        field: '',
        startYear: '',
        endYear: '',
        isOngoing: false
      }]
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        isCurrentRole: false,
        description: ''
      }]
    }));
  };

  const addSkill = (skill) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FaSave className="mr-2" />
          {isSubmitting ? 'Saving...' : 'Save Profile'}
        </button>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(index)}
              className={`flex-1 text-center py-2 px-4 ${
                activeStep === index
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500'
              }`}
            >
              {step.title}
            </button>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Personal Information Form */}
        {activeStep === 0 && (
          <div className="space-y-6">
            {/* Personal Info Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={formData.personalInfo.fullName}
                  onChange={(e) => setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, fullName: e.target.value }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              {/* Add more personal info fields */}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {activeStep > 0 && (
            <button
              onClick={() => setActiveStep(prev => prev - 1)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Previous
            </button>
          )}
          {activeStep < steps.length - 1 && (
            <button
              onClick={() => setActiveStep(prev => prev + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
