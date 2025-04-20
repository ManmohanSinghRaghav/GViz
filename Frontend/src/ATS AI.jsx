import React, { useState } from 'react';
import { FaFileUpload, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { OPENAI_API_KEY } from '../config/api.config';
import * as pdfjs from 'pdfjs-dist';

// Configure PDF.js worker
const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const ATSAI = () => {
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');

  const extractTextFromPDF = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + ' ';
      }

      return fullText.trim();
    } catch (error) {
      console.error('PDF parsing error:', error);
      throw new Error('Failed to parse PDF file');
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setFileName(file.name);

    try {
      let text = '';
      if (file.type === 'application/pdf') {
        text = await extractTextFromPDF(file);
      } else if (file.type === 'text/plain') {
        text = await file.text();
      } else {
        throw new Error('Please upload a PDF or TXT file');
      }

      setResumeText(text);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const analyzeResume = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are an ATS (Applicant Tracking System) expert. Analyze resumes and provide detailed feedback."
            },
            {
              role: "user",
              content: `Analyze this resume and provide feedback on: 
                1. Keywords and skills detection
                2. ATS compatibility score (0-100)
                3. Formatting issues
                4. Improvement suggestions
                
                Resume: ${resumeText}`
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      const data = await response.json();
      setAnalysis(data.choices[0].message.content);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      setAnalysis('Error analyzing resume. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-slate-900/95 rounded-lg p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-slate-200 mb-6">ATS Resume Analyzer</h2>
        
        <div className="mb-6">
          <div className="flex flex-col space-y-4">
            <label className="text-slate-200">Upload Resume (PDF or TXT)</label>
            
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileUpload}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className="cursor-pointer px-4 py-2 rounded-lg bg-gradient-to-r 
                  from-violet-600 to-purple-600 text-slate-200 flex items-center space-x-2
                  hover:shadow-lg hover:shadow-violet-500/25 transition-all duration-300"
              >
                <FaFileUpload />
                <span>Choose File</span>
              </label>
              
              {fileName && (
                <span className="text-slate-200 flex items-center">
                  {loading ? (
                    <FaSpinner className="animate-spin mr-2" />
                  ) : (
                    <FaCheckCircle className="text-green-500 mr-2" />
                  )}
                  {fileName}
                </span>
              )}
            </div>

            {resumeText && (
              <button
                onClick={analyzeResume}
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg bg-gradient-to-r 
                  from-violet-600 to-purple-600 text-slate-200
                  hover:shadow-lg hover:shadow-violet-500/25 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-300"
              >
                {loading ? 'Analyzing...' : 'Analyze Resume'}
              </button>
            )}
          </div>
        </div>

        {analysis && (
          <div className="bg-slate-800/50 rounded-lg p-4 text-slate-200">
            <h3 className="text-xl font-semibold mb-4">Analysis Results:</h3>
            <pre className="whitespace-pre-wrap font-sans">{analysis}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ATSAI;
