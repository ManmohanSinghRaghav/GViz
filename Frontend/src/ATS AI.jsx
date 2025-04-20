import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaFileUpload, FaCheckCircle, FaSpinner, FaRobot, FaSearch, FaFilePdf, FaExclamationTriangle, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { OPENAI_API_KEY } from '../config/api.config';
import { uploadFile } from '@uploadcare/file-uploader';
import { extractTextFromPDF } from '../utils/pdfParser';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const ATSAI = () => {
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileUrl, setFileUrl] = useState('');
  const [error, setError] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const onDrop = useCallback(async (acceptedFiles) => {
    setError(null);
    setResumeText('');
    setAnalysis(null);
    setPdfFile(null);

    const file = acceptedFiles[0];
    if (!file) return;

    setLoading(true);
    setFileName(file.name);
    setUploadProgress(0);

    try {
      if (file.type === 'application/pdf') {
        const fileURL = URL.createObjectURL(file);
        setPdfFile(fileURL);
        setIsPdfLoading(true);

        setUploadProgress(25);

        const text = await extractTextFromPDF(file);
        setResumeText(text);
        setUploadProgress(100);
        setIsPdfLoading(false);
      } else if (file.type === 'text/plain') {
        setUploadProgress(50);
        const text = await file.text();
        setUploadProgress(100);
        setResumeText(text);
      } else {
        throw new Error('Please upload a PDF or TXT file');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || 'Failed to process file');
      if (pdfFile) {
        URL.revokeObjectURL(pdfFile);
        setPdfFile(null);
      }
    } finally {
      setLoading(false);
      setIsPdfLoading(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (pdfFile) {
        URL.revokeObjectURL(pdfFile);
      }
    };
  }, [pdfFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    },
    maxSize: 10485760,
    maxFiles: 1
  });

  const analyzeResume = async () => {
    if (!resumeText || resumeText.trim().length < 50) {
      setError('The extracted text is too short or empty. Please try another PDF file.');
      return;
    }

    setLoading(true);
    setError(null);

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
          max_tokens: 1000
        })
      });

      const data = await response.json();
      setAnalysis(data.choices[0].message.content);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      setError('Error analyzing resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-slate-900/95 rounded-xl p-6 shadow-2xl border border-violet-500/20 backdrop-blur-sm">
        <div className="flex items-center mb-8 border-b border-violet-500/30 pb-4">
          <FaRobot className="text-3xl text-violet-400 mr-3" />
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-purple-300">
            ATS Resume Analyzer
          </h2>
        </div>

        <div className="mb-8 text-slate-300 text-sm">
          <p className="mb-4">Upload your resume and our AI will analyze it for ATS compatibility, providing feedback to help improve your chances of getting past automated screening systems.</p>
          <div className="bg-violet-900/20 p-3 rounded-lg border border-violet-500/30 flex items-start">
            <FaSearch className="text-violet-400 mt-1 mr-2 flex-shrink-0" />
            <p>ATS (Applicant Tracking Systems) are used by 99% of Fortune 500 companies to filter candidates. Optimizing your resume for these systems can significantly improve your job search success.</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex flex-col space-y-5">
            {!pdfFile ? (
              <div className="bg-slate-800/30 p-5 rounded-xl border border-violet-500/20">
                <label className="text-slate-200 font-medium mb-3 block">Upload Resume (PDF or TXT)</label>

                <div 
                  {...getRootProps()} 
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
                    ${isDragActive 
                      ? 'border-violet-400 bg-violet-900/30' 
                      : 'border-violet-500/40 hover:border-violet-400 hover:bg-violet-900/20'}`}
                >
                  <input {...getInputProps()} />
                  <FaFilePdf className="mx-auto text-3xl text-violet-400 mb-3" />
                  {isDragActive ? (
                    <p className="text-violet-300">Drop your resume here...</p>
                  ) : (
                    <div>
                      <p className="text-slate-300 mb-2">Drag & drop your resume here, or click to select</p>
                      <p className="text-slate-400 text-xs">Supports PDF and TXT files up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-slate-800/30 p-5 rounded-xl border border-violet-500/20">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-slate-200 font-medium">Preview</h3>
                  <button 
                    onClick={() => {
                      URL.revokeObjectURL(pdfFile);
                      setPdfFile(null);
                      setFileName('');
                    }}
                    className="text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    Upload Different File
                  </button>
                </div>

                <div className="bg-slate-900/50 rounded-lg border border-violet-500/20 p-4 h-96">
                  {isPdfLoading ? (
                    <div className="flex items-center justify-center h-full w-full">
                      <FaSpinner className="animate-spin text-4xl text-violet-400" />
                    </div>
                  ) : (
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                      <Viewer 
                        fileUrl={pdfFile}
                        plugins={[defaultLayoutPluginInstance]} 
                        onDocumentLoad={() => setIsPdfLoading(false)}
                      />
                    </Worker>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-900/20 text-red-300 p-3 rounded-lg border border-red-500/30 flex items-start">
                <FaExclamationTriangle className="text-red-400 mt-1 mr-2 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {fileName && !error && !pdfFile && (
              <div className="bg-slate-800/50 rounded-lg border border-violet-500/30 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <FaCheckCircle className="text-green-400" />
                  <span className="text-slate-200">{fileName}</span>
                </div>

                {loading && (
                  <div className="w-full bg-slate-700 rounded-full h-2 mb-1">
                    <div 
                      className="bg-gradient-to-r from-violet-600 to-purple-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }} 
                    />
                  </div>
                )}
              </div>
            )}

            {resumeText && (
              <button
                onClick={analyzeResume}
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg bg-gradient-to-r 
                  from-violet-600 to-purple-600 text-slate-200 font-medium
                  hover:shadow-lg hover:shadow-violet-500/25 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-300 transform hover:translate-y-[-2px]"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Analyzing Resume...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <FaRobot className="mr-2" />
                    Analyze with AI
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {analysis && (
          <div className="bg-slate-800/40 rounded-xl p-6 text-slate-200 border border-violet-500/30 animate-fadeIn shadow-inner">
            <h3 className="text-xl font-semibold mb-4 text-violet-300 flex items-center">
              <FaCheckCircle className="mr-2 text-green-400" />
              Analysis Results
            </h3>
            <div className="whitespace-pre-wrap font-sans bg-slate-900/50 p-4 rounded-lg border border-violet-500/20">
              {analysis}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ATSAI;
