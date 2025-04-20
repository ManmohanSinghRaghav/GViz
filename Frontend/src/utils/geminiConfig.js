import axios from 'axios';
import { GEMINI_API_KEY, GEMINI_API_URL, THEME } from '../config/api.config';

// Initialize AI with the appropriate model and API key
export const initializeAI = async () => {
  // Just validate that we have a valid API key
  if (!GEMINI_API_KEY) {
    throw new Error('AI API key is not configured');
  }
  
  console.log('AI initialized successfully');
  return true;
};

// Function to analyze resume with a job description
export const analyzeResume = async (resumeText, jobDescription) => {
  try {
    console.log('Analyzing resume with Gemini AI...');
    
    const prompt = `
    You are an expert ATS resume analyzer. Please analyze the following resume for the given job description. 
    Your task is to:
    1. Rate the resume match on a scale of 0-100%
    2. Identify missing keywords from the job description
    3. Highlight strengths in the resume
    4. Suggest specific improvements to better match the job description
    5. Provide a brief summary of why the resume would or wouldn't pass an ATS scan
    
    JOB DESCRIPTION:
    ${jobDescription}
    
    RESUME:
    ${resumeText}
    
    Provide your analysis in the following JSON format:
    {
      "matchPercentage": number,
      "missingKeywords": [string array],
      "strengths": [string array],
      "improvements": [string array],
      "atsSummary": string
    }
    
    You can use markdown formatting in the strings, like:
    - **bold** for important keywords
    - *italics* for emphasis
    
    Only return valid JSON, no other text.
    `;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024,
          topP: 0.8,
          topK: 40
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Process Gemini response
    if (
      response.data && 
      response.data.candidates && 
      response.data.candidates.length > 0 &&
      response.data.candidates[0].content &&
      response.data.candidates[0].content.parts &&
      response.data.candidates[0].content.parts.length > 0
    ) {
      const responseText = response.data.candidates[0].content.parts[0].text;
      
      // Parse JSON from response text
      try {
        // Extract JSON if surrounded by backticks or other formatting
        const jsonMatch = responseText.match(/```json\n([\s\S]*)\n```/) || 
                          responseText.match(/```\n([\s\S]*)\n```/) || 
                          responseText.match(/{[\s\S]*}/);
                          
        const jsonString = jsonMatch ? jsonMatch[0] : responseText;
        const cleanedJson = jsonString.replace(/```json\n|```\n|```/g, '').trim();
        
        const analysisResult = JSON.parse(cleanedJson);
        return {
          success: true,
          analysis: analysisResult
        };
      } catch (parseError) {
        console.error('Error parsing JSON from Gemini response:', parseError);
        return {
          success: false,
          error: 'Failed to parse analysis results',
          rawResponse: responseText
        };
      }
    }

    return {
      success: false,
      error: 'No valid response from Gemini'
    };
  } catch (error) {
    console.error('Error analyzing resume with Gemini:', error);
    return {
      success: false,
      error: error.message || 'Error analyzing resume'
    };
  }
};

export default {
  initializeAI,
  analyzeResume
};
