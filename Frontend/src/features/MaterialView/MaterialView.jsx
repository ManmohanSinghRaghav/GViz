import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockMaterials } from '../../Mock_data/materialMock';
import { FaArrowLeft, FaDownload, FaStar, FaEye, FaShare } from 'react-icons/fa';

const MaterialView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [material, setMaterial] = useState(null);
  const [relatedMaterials, setRelatedMaterials] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const foundMaterial = mockMaterials.find(m => m.id === parseInt(id));
    setMaterial(foundMaterial);
    if (foundMaterial?.relatedMaterials) {
      const related = mockMaterials.filter(m => 
        foundMaterial.relatedMaterials.includes(m.id)
      );
      setRelatedMaterials(related);
    }
  }, [id]);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Simulate download delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real implementation, trigger actual file download
      console.log('Downloading:', material.downloadUrl);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!material) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold">{material.title}</h1>
              <div className="flex items-center space-x-2">
                <span className="text-yellow-400 flex items-center">
                  <FaStar className="mr-1" /> {material.rating}
                </span>
                <span className="text-gray-500">({material.downloads} downloads)</span>
              </div>
            </div>
            <p className="text-gray-600 mb-6">{material.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {material.tags.map(tag => (
                <span 
                  key={tag}
                  className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Last updated: {material.lastUpdated}
              </div>
              <div className="flex space-x-4">
                <button 
                  onClick={() => {}} 
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <FaShare className="mr-2" /> Share
                </button>
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className={`flex items-center px-4 py-2 rounded-lg ${
                    isDownloading
                      ? 'bg-gray-200 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  <FaDownload className="mr-2" />
                  {isDownloading ? 'Downloading...' : 'Download'}
                </button>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <FaEye className="text-gray-400 h-12 w-12" />
            </div>
          </div>
        </div>

        {/* Related Materials */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Related Materials</h2>
          <div className="space-y-4">
            {relatedMaterials.map(related => (
              <button
                key={related.id}
                onClick={() => navigate(`/materials/${related.id}`)}
                className="w-full text-left p-3 rounded hover:bg-gray-50"
              >
                <h3 className="font-medium">{related.title}</h3>
                <p className="text-sm text-gray-500">{related.type}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialView;
