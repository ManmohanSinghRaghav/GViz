import React, { useState, useCallback } from 'react';
import { FaFileUpload, FaArrowLeft, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { initializeAI } from '../../utils/geminiConfig';
import { extractTextFromPDF } from '../../utils/pdfParser';
import { validateResumeFile } from '../../utils/fileValidation';

const ATSAI = () => {
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      // Validate file
      const validationErrors = validateResumeFile(file);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join('\n'));
      }

      // Process file using our updated PDF parser
      const text = await extractTextFromPDF(file);
      if (!text || text.trim().length < 100) {
        throw new Error('Unable to extract sufficient content from the resume. Please check the file.');
      }

      // Analyze with AI
      const model = initializeAI();
      const prompt = `Analyze this resume content for ATS compatibility and provide detailed feedback.
        Resume content: ${text}
        
        Provide a structured analysis including:
        1. Overall ATS Score (0-100)
        2. Key Skills Detected
        3. Missing Critical Keywords
        4. Format and Structure Analysis
        5. Specific Improvement Recommendations`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      if (!response || !response.text()) {
        throw new Error('Failed to generate analysis');
      }

      setAnalysis(response.text());
    } catch (err) {
      console.error('Resume processing error:', err);
      setError(err.message || 'Resume analysis failed. Please check your file and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button onClick={() => navigate(-1)} className="text-violet-400 hover:text-violet-300 mr-4">
            <FaArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold text-slate-200">ATS Resume Analysis</h1>
        </div>

        {/* Upload Section */}
        <div className="bg-slate-800/50 rounded-lg p-6 mb-6">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-violet-500/30 rounded-lg p-8">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="pdf-upload"
            />
            <label
              htmlFor="pdf-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <FaFileUpload className="text-violet-400 text-4xl mb-4" />
              <span className="text-slate-200 text-lg mb-2">
                Upload your Resume
              </span>
              <span className="text-slate-400 text-sm">
                {loading ? 'Processing...' : 'Drop your PDF here or click to browse'}
              </span>
            </label>
          </div>
          {error && (
            <div className="mt-4 text-red-400 text-center">{error}</div>
          )}
        </div>

        {/* Loading and Analysis Results */}
        {loading ? (
          <div className="flex justify-center items-center p-4">
            <FaSpinner className="animate-spin text-violet-500 text-4xl" />
          </div>
        ) : analysis && (
          <div className="bg-slate-800/50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-slate-200 mb-4">Analysis Results</h2>
            <div className="prose prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-slate-300">{analysis}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ATSAI;
