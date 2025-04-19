import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCamera, FaLinkedin, FaGithub, FaMapMarkerAlt } from 'react-icons/fa';

const ProfilePage = () => {
  const navigate = useNavigate();
  const sectionRefs = useRef({});
  const [activeSection, setActiveSection] = useState(null);
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john@example.com',
    bio: '',
    location: '',
    linkedin: '',
    github: '',
    skills: [],
    education: [{ school: '', degree: '', year: '' }],
    experience: [{ company: '', position: '', duration: '' }],
    newSkill: ''
  });

  const [sections, setSections] = useState([
    { name: 'Basic Info', completed: true },
    { name: 'Contact Details', completed: false },
    { name: 'Bio', completed: false },
    { name: 'Skills', completed: false },
    { name: 'Education', completed: false },
    { name: 'Experience', completed: false }
  ]);

  const updateSectionCompletion = (sectionName, isCompleted) => {
    setSections(prev => 
      prev.map(section => 
        section.name === sectionName ? { ...section, completed: isCompleted } : section
      )
    );
  };

  const handleAddSkill = () => {
    if (formData.newSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, prev.newSkill.trim()],
        newSkill: ''
      }));
      updateSectionCompletion('Skills', true);
    }
  };

  const handleAddEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { school: '', degree: '', year: '' }]
    }));
  };

  const handleAddExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, { company: '', position: '', duration: '' }]
    }));
  };

  const handleCompleteSection = (sectionName) => {
    setActiveSection(sectionName);
    if (sectionRefs.current[sectionName]) {
      sectionRefs.current[sectionName].scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSaveProfile = () => {
    const sectionsValid = sections.every(section => {
      switch (section.name) {
        case 'Basic Info':
          return formData.fullName && formData.email;
        case 'Contact Details':
          return formData.location || formData.linkedin;
        case 'Bio':
          return formData.bio;
        case 'Skills':
          return formData.skills.length > 0;
        case 'Education':
          return formData.education.some(e => e.school && e.degree);
        case 'Experience':
          return formData.experience.some(e => e.company && e.position);
        default:
          return false;
      }
    });

    if (sectionsValid) {
      localStorage.setItem('profileData', JSON.stringify(formData));
      setSections(sections.map(s => ({ ...s, completed: true })));
    }
  };

  const completionPercentage = 
    (sections.filter(section => section.completed).length / sections.length) * 100;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full"
          aria-label="Go back"
        >
          <FaArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold ml-4">Complete Your Profile</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-start space-x-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
              <img
                src="https://ui-avatars.com/api/?name=John+Doe"
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
              <button className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600">
                <FaCamera />
              </button>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{formData.fullName}</h2>
                <p className="text-gray-600">{formData.email}</p>
                <div className="flex items-center mt-2 space-x-4">
                  <a href={formData.linkedin} className="text-gray-600 hover:text-blue-600">
                    <FaLinkedin className="h-5 w-5" />
                  </a>
                  <a href={formData.github} className="text-gray-600 hover:text-gray-900">
                    <FaGithub className="h-5 w-5" />
                  </a>
                  {formData.location && (
                    <span className="flex items-center text-gray-600">
                      <FaMapMarkerAlt className="h-4 w-4 mr-1" />
                      {formData.location}
                    </span>
                  )}
                </div>
              </div>

              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-gray-200"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-blue-600 transition-all duration-300"
                    strokeWidth="10"
                    strokeDasharray={`${completionPercentage * 2.51327} 251.327`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                    transform="rotate(-90 50 50)"
                  />
                  <text
                    x="50"
                    y="50"
                    className="text-2xl font-bold"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fill="currentColor"
                  >
                    {Math.round(completionPercentage)}%
                  </text>
                  <text
                    x="50"
                    y="65"
                    className="text-xs"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fill="currentColor"
                  >
                    Complete
                  </text>
                </svg>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              {sections.map((section, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border ${
                    section.completed 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="text-sm font-medium">{section.name}</div>
                  <div className={`text-xs ${section.completed ? 'text-green-600' : 'text-gray-500'}`}>
                    {section.completed ? 'Completed' : 'Pending'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-6">
        <button
          onClick={handleSaveProfile}
          className="cyber-button px-6 py-3 rounded-lg text-lg shadow-lg"
        >
          Save Profile
        </button>
      </div>

      <div className="grid gap-6">
        {sections.map((section, index) => (
          <div 
            key={index} 
            ref={el => sectionRefs.current[section.name] = el}
            className={`bg-white rounded-lg shadow-sm p-6 ${
              activeSection === section.name ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{section.name}</h3>
              {section.completed ? (
                <span className="text-green-500 text-sm">Completed</span>
              ) : (
                <button
                  onClick={() => handleCompleteSection(section.name)}
                  className="text-blue-500 text-sm hover:text-blue-600 focus:outline-none focus:underline"
                >
                  Complete Now
                </button>
              )}
            </div>

            {section.name === 'Basic Info' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
            )}

            {section.name === 'Contact Details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => {
                      setFormData({ ...formData, location: e.target.value });
                      updateSectionCompletion('Contact Details', !!e.target.value);
                    }}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="LinkedIn Profile URL"
                  />
                </div>
              </div>
            )}

            {section.name === 'Bio' && (
              <div>
                <textarea
                  value={formData.bio}
                  onChange={(e) => {
                    setFormData({ ...formData, bio: e.target.value });
                    updateSectionCompletion('Bio', !!e.target.value);
                  }}
                  className="w-full px-3 py-2 border rounded-md h-32"
                  placeholder="Tell us about yourself..."
                />
              </div>
            )}

            {section.name === 'Skills' && (
              <div>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={formData.newSkill}
                    onChange={(e) => setFormData({ ...formData, newSkill: e.target.value })}
                    className="flex-1 px-3 py-2 border rounded-md"
                    placeholder="Enter a skill"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Add Skill
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {section.name === 'Education' && (
              <div className="space-y-4">
                {formData.education.map((edu, i) => (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md">
                    <input
                      type="text"
                      value={edu.school}
                      onChange={(e) => {
                        const newEducation = [...formData.education];
                        newEducation[i].school = e.target.value;
                        setFormData({ ...formData, education: newEducation });
                        updateSectionCompletion('Education', formData.education.some(e => e.school));
                      }}
                      className="px-3 py-2 border rounded-md"
                      placeholder="School/University"
                    />
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => {
                        const newEducation = [...formData.education];
                        newEducation[i].degree = e.target.value;
                        setFormData({ ...formData, education: newEducation });
                      }}
                      className="px-3 py-2 border rounded-md"
                      placeholder="Degree"
                    />
                    <input
                      type="text"
                      value={edu.year}
                      onChange={(e) => {
                        const newEducation = [...formData.education];
                        newEducation[i].year = e.target.value;
                        setFormData({ ...formData, education: newEducation });
                      }}
                      className="px-3 py-2 border rounded-md"
                      placeholder="Year"
                    />
                  </div>
                ))}
                <button
                  onClick={handleAddEducation}
                  className="text-blue-500 hover:text-blue-600"
                >
                  + Add Education
                </button>
              </div>
            )}

            {section.name === 'Experience' && (
              <div className="space-y-4">
                {formData.experience.map((exp, i) => (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md">
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const newExperience = [...formData.experience];
                        newExperience[i].company = e.target.value;
                        setFormData({ ...formData, experience: newExperience });
                        updateSectionCompletion('Experience', formData.experience.some(e => e.company));
                      }}
                      className="px-3 py-2 border rounded-md"
                      placeholder="Company"
                    />
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => {
                        const newExperience = [...formData.experience];
                        newExperience[i].position = e.target.value;
                        setFormData({ ...formData, experience: newExperience });
                      }}
                      className="px-3 py-2 border rounded-md"
                      placeholder="Position"
                    />
                    <input
                      type="text"
                      value={exp.duration}
                      onChange={(e) => {
                        const newExperience = [...formData.experience];
                        newExperience[i].duration = e.target.value;
                        setFormData({ ...formData, experience: newExperience });
                      }}
                      className="px-3 py-2 border rounded-md"
                      placeholder="Duration"
                    />
                  </div>
                ))}
                <button
                  onClick={handleAddExperience}
                  className="text-blue-500 hover:text-blue-600"
                >
                  + Add Experience
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
