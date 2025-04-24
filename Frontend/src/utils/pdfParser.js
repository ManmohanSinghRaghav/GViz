/**
 * PDF parser utility with proper error handling
 */

/**
 * Extract text content from a PDF file using PDF.js
 * @param {File} file - PDF file object
 * @returns {Promise<string>} - Text content from the PDF
 */
export const extractTextFromPDF = async (file) => {
  try {
    // Dynamically import PDF.js to avoid worker configuration issues
    const pdfjs = await import('pdfjs-dist');
    
    // Set the worker source using a CDN or local path
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
    
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
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
    // Return empty string instead of throwing to avoid crashing
    return `Failed to extract text: ${error.message}`;
  }
};

/**
 * Fallback method using FileReader for simple PDF text extraction
 * @param {File} file - PDF file object
 * @returns {Promise<string>} - Text content from the PDF
 */
export const simpleExtractTextFromPDF = async (file) => {
  return new Promise((resolve) => {
    try {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const arrayBuffer = event.target.result;
          
          // Convert ArrayBuffer to string
          const textDecoder = new TextDecoder('utf-8');
          const text = textDecoder.decode(arrayBuffer);
          
          // Clean up the text (remove non-printable characters)
          const cleanedText = text.replace(/[^\x20-\x7E\n\r\t]/g, ' ');
          resolve(cleanedText);
        } catch (error) {
          console.error("Error processing PDF content:", error);
          resolve(`Failed to process PDF content: ${error.message}`);
        }
      };
      
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        resolve("Failed to read PDF file");
      };
      
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Error in simpleExtractTextFromPDF:", error);
      resolve(`Error: ${error.message}`);
    }
  });
};

export default {
  extractTextFromPDF,
  simpleExtractTextFromPDF
};
