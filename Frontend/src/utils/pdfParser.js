import * as PDFJS from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

// Set the worker source to use the bundled worker
PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;

/**
 * Extract text content from a PDF file using mozilla's PDF.js
 * @param {File} file - PDF file object
 * @returns {Promise<string>} - Text content from the PDF
 */
export const extractTextFromPDF = async (file) => {
  try {
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document
    const loadingTask = PDFJS.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    console.log(`PDF loaded. Number of pages: ${pdf.numPages}`);
    
    let textContent = '';
    
    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      
      // Concatenate the text items
      const pageText = content.items.map(item => item.str).join(' ');
      textContent += pageText + '\n';
    }
    
    return textContent.trim();
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
};

/**
 * Fallback method using FileReader for simple PDF text extraction
 * Less accurate but doesn't require external libraries
 * @param {File} file - PDF file object
 * @returns {Promise<string>} - Text content from the PDF
 */
export const simpleExtractTextFromPDF = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      let text = '';
      
      // Simple text extraction - this is a basic approach and won't work well for all PDFs
      try {
        // Convert ArrayBuffer to string
        const textDecoder = new TextDecoder('utf-8');
        text = textDecoder.decode(arrayBuffer);
        
        // Clean up the text (remove non-printable characters)
        text = text.replace(/[^\x20-\x7E\n\r\t]/g, ' ');
        resolve(text);
      } catch (error) {
        reject(new Error(`Failed to extract text from PDF: ${error.message}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read PDF file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

export default {
  extractTextFromPDF,
  simpleExtractTextFromPDF
};
